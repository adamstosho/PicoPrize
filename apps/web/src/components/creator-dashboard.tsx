"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Badge } from "@/components/badge"
import { Spinner } from "@/components/spinner"
import { LessonEditor } from "@/components/lesson-editor"
import { LessonView } from "@/components/lesson-view"
import { useWallet } from "@/lib/wallet-context"
import { useCreatorStats, usePoolCounter, useCreatePool, useCUSDApprove, useCUSDAllowance, useResolvePool } from "@/hooks/useContracts"
import { useLessons } from "@/hooks/useLessons"
import { getContractAddress, formatCUSD, parseCUSD } from "@/lib/contracts"
import type { Lesson } from "@/lib/lesson-data"

const EXPLORER_URL = "https://celo-sepolia.blockscout.com"

type LessonFormValues = {
  title: string
  description: string
  metadataUri: string
  choicesCount: number
  deadline: number
  minStake: number
  maxStake: number
  creatorSeed: number
  creatorFeeBps: number
}

type PoolCreationParams = {
  poolId: bigint
  metadataUri: string
  choicesCount: number
  deadline: bigint
  minStake: bigint
  maxStake: bigint
  creatorSeed: bigint
  creatorFeeBps: bigint
}

export function CreatorDashboard() {
  const { address, isConnected, isConnecting, balance, isCorrectNetwork } = useWallet()
  const [showEditor, setShowEditor] = useState(false)
  const [activeTab, setActiveTab] = useState<"lessons" | "earnings">("lessons")
  const [isCreatingPool, setIsCreatingPool] = useState(false)
  const [poolCreationStep, setPoolCreationStep] = useState<"idle" | "approving" | "creating" | "success" | "error">("idle")
  const [creationError, setCreationError] = useState<string | null>(null)
  const [lastCreatedPoolId, setLastCreatedPoolId] = useState<bigint | null>(null)
  const [pendingPoolParams, setPendingPoolParams] = useState<PoolCreationParams | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [lessonToResolve, setLessonToResolve] = useState<Lesson | null>(null)
  const [selectedWinningChoice, setSelectedWinningChoice] = useState<number | null>(null)
  const [resolveErrorMessage, setResolveErrorMessage] = useState<string | null>(null)

  const getFriendlyErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      return error.message
    }
    if (typeof error === "string") {
      return error
    }
    return "Something went wrong. Please try again."
  }

  // Contract hooks
  const { data: creatorStats, isLoading: isStatsLoading } = useCreatorStats(address || undefined)
  const { data: poolCounter } = usePoolCounter()
  const { lessons, isLoading: isLessonsLoading } = useLessons(50)
  
  // Pool creation hooks
  const { createPool, hash: createPoolHash, isPending: isCreatePending, isConfirming: isCreateConfirming, isSuccess: isCreateSuccess, error: createError } = useCreatePool()
  const { approve, hash: approveHash, isPending: isApprovePending, isConfirming: isApproveConfirming, isSuccess: isApproveSuccess, error: approveError } = useCUSDApprove()
  const { data: allowance, refetch: refetchAllowance } = useCUSDAllowance(address || undefined, getContractAddress("PICOPRIZE_POOL"))
  const { resolvePool, hash: resolveHash, isPending: isResolvePending, isConfirming: isResolveConfirming, isSuccess: isResolveSuccess, error: resolveError } = useResolvePool()

  // Track if we're waiting for approval confirmation
  const isWaitingForApproval = isApprovePending || isApproveConfirming
  const isWaitingForCreation = isCreatePending || isCreateConfirming
  const isResolving = isResolvePending || isResolveConfirming

  // Filter lessons created by current user
  const myLessons = lessons.filter(l => l.authorAddress?.toLowerCase() === address?.toLowerCase())

  // Calculate stats
  const totalEarnings = creatorStats ? Number(formatCUSD(creatorStats.totalFeesEarned)) : 0
  const totalParticipants = creatorStats ? Number(creatorStats.totalParticipants) : 0
  // Prefer on-chain lessonsCreated when available, but fall back to counted lessons
  const publishedCount = creatorStats && Number(creatorStats.lessonsCreated) > 0
    ? Number(creatorStats.lessonsCreated)
    : myLessons.length

  const handleCreatePoolTransaction = async (params: PoolCreationParams) => {
    try {
      setPoolCreationStep("creating")
      await createPool(params)
    } catch (err) {
      setCreationError(getFriendlyErrorMessage(err))
      setPoolCreationStep("error")
      setIsCreatingPool(false)
      setPendingPoolParams(null)
    }
  }

  const closeResolveModal = () => {
    setLessonToResolve(null)
    setSelectedWinningChoice(null)
    setResolveErrorMessage(null)
  }

  const handleResolveSubmit = async () => {
    if (!lessonToResolve) return
    if (selectedWinningChoice === null) {
      setResolveErrorMessage("Select the winning choice to resolve this pool.")
      return
    }
    try {
      setResolveErrorMessage(null)
      await resolvePool(lessonToResolve.poolId, selectedWinningChoice)
    } catch (err) {
      setResolveErrorMessage(getFriendlyErrorMessage(err))
    }
  }

  // Handle pool creation
  const handleCreatePool = async (lessonData: LessonFormValues) => {
    // Clear any previous errors
    setCreationError(null)
    
    // Prevent multiple submissions
    if (isCreatingPool || isApprovePending || isApproveConfirming || isCreatePending || isCreateConfirming) {
      return
    }

    // All validations passed - start the creation process
    setIsCreatingPool(true)
    setCreationError(null)
    setPoolCreationStep("idle") // Show status card immediately

    // Validate prerequisites AFTER showing status card
    if (!address) {
      setCreationError("Connect your wallet to create a pool.")
      setPoolCreationStep("error")
      setIsCreatingPool(false)
      return
    }

    if (!isCorrectNetwork) {
      setCreationError("Please switch to Celo Sepolia network in your wallet.")
      setPoolCreationStep("error")
      setIsCreatingPool(false)
      return
    }

    if (poolCounter === undefined) {
      setCreationError("Still syncing on-chain pool counter. Please try again in a moment.")
      setPoolCreationStep("error")
      setIsCreatingPool(false)
      return
    }
    
    const newPoolId = poolCounter + 1n
    const deadlineTimestamp = BigInt(Math.floor(Date.now() / 1000) + (lessonData.deadline * 60 * 60))
    const minStakeWei = parseCUSD(lessonData.minStake)
    const maxStakeWei = parseCUSD(lessonData.maxStake)
    const creatorSeedWei = parseCUSD(lessonData.creatorSeed)
    const params: PoolCreationParams = {
      poolId: newPoolId,
      metadataUri: lessonData.metadataUri || `ipfs://lesson-${newPoolId}`,
      choicesCount: lessonData.choicesCount,
      deadline: deadlineTimestamp,
      minStake: minStakeWei,
      maxStake: maxStakeWei,
      creatorSeed: creatorSeedWei,
      creatorFeeBps: BigInt(lessonData.creatorFeeBps),
    }

    setLastCreatedPoolId(newPoolId)

    try {
      if (params.creatorSeed > 0n) {
        const allowanceResult = await refetchAllowance()
        const currentAllowance = allowanceResult.data ?? allowance ?? 0n

        if (currentAllowance < params.creatorSeed) {
          // Store params before approval so we can continue after approval succeeds
          setPendingPoolParams(params)
          setPoolCreationStep("approving")
          try {
            await approve(getContractAddress("PICOPRIZE_POOL"), params.creatorSeed)
          } catch (err) {
            setCreationError(getFriendlyErrorMessage(err))
            setPoolCreationStep("error")
            setIsCreatingPool(false)
            setPendingPoolParams(null)
          }
          return
        }
      }

      await handleCreatePoolTransaction(params)
    } catch (err) {
      setPoolCreationStep("error")
      setCreationError((err as Error).message)
      setIsCreatingPool(false)
      setPendingPoolParams(null)
    }
  }

  // Handle approval success -> continue to create pool
  useEffect(() => {
    if (isApproveSuccess && poolCreationStep === "approving" && pendingPoolParams && !isWaitingForCreation) {
      // Wait a bit for allowance to update on-chain, then refetch and create
      const proceedWithCreation = async () => {
        await refetchAllowance()
        // Small delay to ensure on-chain state is updated
        setTimeout(() => {
          if (pendingPoolParams) {
            handleCreatePoolTransaction(pendingPoolParams)
          }
        }, 1500)
      }
      proceedWithCreation()
    }
  }, [isApproveSuccess, poolCreationStep, pendingPoolParams, createPool, isWaitingForCreation, refetchAllowance])

  // Handle create success
  useEffect(() => {
    if (isCreateSuccess) {
      setPoolCreationStep("success")
      setPendingPoolParams(null)
      setTimeout(() => {
        setIsCreatingPool(false)
        setPoolCreationStep("idle")
        setShowEditor(false)
      }, 3000)
    }
  }, [isCreateSuccess])

  // Handle errors
  useEffect(() => {
    if (approveError) {
      setPoolCreationStep("error")
      setCreationError(approveError.message || "Approval failed. Please try again.")
      setIsCreatingPool(false)
      setPendingPoolParams(null)
    }
  }, [approveError])

  useEffect(() => {
    if (createError) {
      setPoolCreationStep("error")
      setCreationError(createError.message || "Pool creation failed. Please try again.")
      setIsCreatingPool(false)
      setPendingPoolParams(null)
    }
  }, [createError])

  useEffect(() => {
    if (isResolveSuccess) {
      setLessonToResolve(null)
      setSelectedWinningChoice(null)
      setResolveErrorMessage(null)
    }
  }, [isResolveSuccess])

  useEffect(() => {
    if (resolveError) {
      setResolveErrorMessage(resolveError.message || "Pool resolution failed. Please try again.")
    }
  }, [resolveError])

  useEffect(() => {
    if (!lessonToResolve) {
      setSelectedWinningChoice(null)
      setResolveErrorMessage(null)
    }
  }, [lessonToResolve])

  // Reset state when editor is closed
  useEffect(() => {
    if (!showEditor) {
      setIsCreatingPool(false)
      setPoolCreationStep("idle")
      setCreationError(null)
      setPendingPoolParams(null)
      setLastCreatedPoolId(null)
    }
  }, [showEditor])

  // Show loading state while connecting/reconnecting
  if (isConnecting) {
    return (
      <Card variant="glass">
        <CardContent className="text-center py-12">
          <Spinner size="lg" />
          <p style={{ color: "var(--text-secondary)" }} className="mt-4">
            Connecting wallet...
          </p>
        </CardContent>
      </Card>
    )
  }

  // Show connect message only if not connected and not connecting
  if (!isConnected) {
    return (
      <Card variant="glass">
        <CardContent className="text-center py-12">
          <p className="text-4xl mb-4">🔐</p>
          <p style={{ color: "var(--text-secondary)" }} className="mb-2">
            Connect your wallet to access Creator Studio
          </p>
        </CardContent>
      </Card>
    )
  }

  if (selectedLesson) {
    return (
      <div className="space-y-4">
        <LessonView lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />
      </div>
    )
  }

  if (showEditor) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="md" 
          onClick={() => {
            if (!isCreatingPool && poolCreationStep === "idle") {
              setShowEditor(false)
            }
          }}
          disabled={isCreatingPool}
        >
          ← Back
        </Button>
        
        {/* Pool Creation Status - Show when creating OR if there's an error */}
        {(isCreatingPool || (creationError && poolCreationStep === "error")) && (
          <Card variant="elevated">
            <CardContent className="py-6 text-center">
              {poolCreationStep === "idle" && (
                <>
                  <Spinner size="lg" />
                  <p className="mt-4 font-semibold">Preparing pool creation...</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Validating parameters and checking allowance...
                  </p>
                </>
              )}
              {poolCreationStep === "approving" && (
                <>
                  <Spinner size="lg" />
                  <p className="mt-4 font-semibold">Approving cUSD...</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {isApprovePending 
                      ? "Waiting for wallet confirmation..."
                      : isApproveConfirming
                      ? "Confirming approval on blockchain..."
                      : "Step 1/2: Approve token spending"}
                  </p>
                  {approveHash && (
                    <a
                      href={`${EXPLORER_URL}/tx/${approveHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline mt-2 block"
                      style={{ color: "var(--primary)" }}
                    >
                      View approval tx →
                    </a>
                  )}
                </>
              )}
              {poolCreationStep === "creating" && (
                <>
                  <Spinner size="lg" />
                  <p className="mt-4 font-semibold">Creating Pool...</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {isCreatePending
                      ? "Waiting for wallet confirmation..."
                      : isCreateConfirming
                      ? "Confirming pool creation on blockchain..."
                      : "Step 2/2: Creating pool on-chain"}
                  </p>
                  {createPoolHash && (
                    <a
                      href={`${EXPLORER_URL}/tx/${createPoolHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline mt-2 block"
                      style={{ color: "var(--primary)" }}
                    >
                      View creation tx →
                    </a>
                  )}
                </>
              )}
              {poolCreationStep === "success" && (
                <>
                  <p className="text-5xl">🎉</p>
                  <p className="mt-4 font-semibold" style={{ color: "var(--success)" }}>
                    Pool Created Successfully!
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Pool ID: {lastCreatedPoolId?.toString()}
                  </p>
                  {createPoolHash && (
                    <a
                      href={`${EXPLORER_URL}/tx/${createPoolHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs underline mt-2 block"
                      style={{ color: "var(--primary)" }}
                    >
                      View on explorer →
                    </a>
                  )}
                </>
              )}
              {poolCreationStep === "error" && (
                <>
                  <p className="text-5xl">❌</p>
                  <p className="mt-4 font-semibold" style={{ color: "var(--danger)" }}>
                    Pool Creation Failed
                  </p>
                  <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                    {creationError}
                  </p>
                  <Button 
                    type="button"
                    variant="primary" 
                    size="md" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsCreatingPool(false)
                      setPoolCreationStep("idle")
                      setCreationError(null)
                      setPendingPoolParams(null)
                    }}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Always show editor - status card appears above it when creating */}
        <LessonEditor
          onCancel={() => {
            // Only allow cancel if not creating
            if (!isCreatingPool && poolCreationStep === "idle") {
            setShowEditor(false)
            }
          }}
          onSave={handleCreatePool}
          nextPoolId={poolCounter ? Number(poolCounter) + 1 : 1}
          isSubmitting={isCreatingPool || isWaitingForApproval || isWaitingForCreation}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Creator Studio</h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage your lessons and earnings</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowEditor(true)}>
          Create Pool
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass">
          <CardContent className="text-center py-4 space-y-1">
            <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>
              {isStatsLoading ? <Spinner size="sm" /> : publishedCount}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Published Pools
            </p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="text-center py-4 space-y-1">
            <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
              {isStatsLoading ? <Spinner size="sm" /> : totalParticipants}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Total Participants
            </p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="text-center py-4 space-y-1">
            <p className="text-2xl font-bold" style={{ color: "var(--success)" }}>
              {isStatsLoading ? <Spinner size="sm" /> : totalEarnings.toFixed(3)}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Total Earnings (cUSD)
            </p>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="text-center py-4 space-y-1">
            <p className="text-2xl font-bold" style={{ color: "var(--warning)" }}>
              {balance || "0.00"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Wallet Balance (cUSD)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderBottomColor: "var(--border)" }}>
        {["lessons", "earnings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className="px-4 py-3 font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: activeTab === tab ? "var(--primary)" : "transparent",
              color: activeTab === tab ? "var(--primary)" : "var(--text-secondary)",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "lessons" && (
        <div className="space-y-3">
          {isLessonsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : myLessons.length > 0 ? (
            myLessons.map((lesson) => (
            <Card key={lesson.id} variant="elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                        Pool #{lesson.id} • {lesson.description}
                    </p>
                  </div>
                    <Badge variant={lesson.status === "active" ? "success" : "default"}>
                      {lesson.status}
                    </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                        Total Staked
                    </p>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {lesson.totalStaked.toFixed(2)} cUSD
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                        Choices
                    </p>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {lesson.choicesCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                        Min/Max Stake
                    </p>
                    <p className="font-semibold" style={{ color: "var(--success)" }}>
                        {lesson.minStake}-{lesson.maxStake} cUSD
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                        Deadline
                    </p>
                    <p className="font-semibold" style={{ color: "var(--accent)" }}>
                        {lesson.deadline.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      View Details
                    </Button>
                    {lesson.status === "active" && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setLessonToResolve(lesson)
                          setSelectedWinningChoice(null)
                          setResolveErrorMessage(null)
                        }}
                      >
                        Resolve Pool
                    </Button>
                  )}
                </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card variant="glass">
              <CardContent className="text-center py-12">
                <p className="text-4xl mb-4">✏️</p>
                <p style={{ color: "var(--text-secondary)" }} className="mb-2">
                  You haven't created any pools yet
                </p>
                <p className="text-sm mb-4" style={{ color: "var(--text-tertiary)" }}>
                  Create your first lesson pool and start earning!
                </p>
                <Button variant="primary" size="md" onClick={() => setShowEditor(true)}>
                  Create Your First Pool
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "earnings" && (
        <div className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border rounded-lg p-4"
                style={{
                  background: "linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(0, 209, 178, 0.08) 100%)",
                  borderColor: "var(--border)",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>
                  Total Earnings
                </p>
                <p className="text-4xl font-bold" style={{ color: "var(--accent)" }}>
                  {totalEarnings.toFixed(3)} cUSD
                </p>
                <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
                  Testnet • Fees earned from {publishedCount} pools
                </p>
              </div>

              {creatorStats && Number(creatorStats.ratingCount) > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    Creator Rating
                </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {(Number(creatorStats.averageRating) / 10).toFixed(1)} ⭐
                    </span>
                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      from {Number(creatorStats.ratingCount)} ratings
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {lessonToResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              if (!isResolving) closeResolveModal()
            }}
          />
          <Card
            variant="elevated"
            className="relative z-10 w-full max-w-lg"
            style={{ borderColor: "var(--border)" }}
          >
            <CardHeader>
              <CardTitle>Resolve Pool #{lessonToResolve.id}</CardTitle>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Select the winning choice to distribute rewards.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Title</p>
                  <p className="font-semibold">{lessonToResolve.title}</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Staked</p>
                  <p className="font-semibold">{lessonToResolve.totalStaked.toFixed(2)} cUSD</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Select Winning Choice</p>
                <div className="grid grid-cols-2 gap-2">
                  {(lessonToResolve.questions?.[0]?.options?.length
                    ? lessonToResolve.questions[0].options
                    : Array.from({ length: lessonToResolve.choicesCount }, (_, i) => `Choice ${i + 1}`)
                  ).map((label, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedWinningChoice(index)}
                      className="p-3 rounded-lg border-2 text-left transition-colors"
                      style={{
                        borderColor: selectedWinningChoice === index ? "var(--primary)" : "var(--border)",
                        backgroundColor: selectedWinningChoice === index ? "rgba(108, 99, 255, 0.1)" : "var(--surface-01)",
                      }}
                      disabled={isResolving}
                    >
                      <span className="font-semibold">Choice {index + 1}</span>
                      <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                        {label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {resolveErrorMessage && (
                <div
                  className="p-3 rounded-md text-sm"
                  style={{ backgroundColor: "rgba(255, 77, 79, 0.1)", color: "var(--danger)" }}
                >
                  {resolveErrorMessage}
                </div>
              )}

              {resolveHash && (
                <a
                  href={`${EXPLORER_URL}/tx/${resolveHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline"
                  style={{ color: "var(--primary)" }}
                >
                  View resolution tx →
                </a>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  className="flex-1"
                  onClick={closeResolveModal}
                  disabled={isResolving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={handleResolveSubmit}
                  isLoading={isResolving}
                  disabled={selectedWinningChoice === null || isResolving}
                >
                  Confirm Resolution
              </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
