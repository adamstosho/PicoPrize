"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Badge } from "@/components/badge"
import { Spinner } from "@/components/spinner"
import { useLessons } from "@/hooks/useLessons"
import { useResolvePool, useCancelPool } from "@/hooks/useContracts"
import { useWallet } from "@/lib/wallet-context"
import type { Lesson } from "@/lib/lesson-data"

const EXPLORER_URL = "https://celo-sepolia.blockscout.com"

export function PoolManager() {
  const { address } = useWallet()
  const { lessons, isLoading } = useLessons(50)
  const [selectedPool, setSelectedPool] = useState<Lesson | null>(null)
  const [winningChoice, setWinningChoice] = useState(0)

  // Filter pools created by current user
  const myPools = lessons.filter(l => l.authorAddress?.toLowerCase() === address?.toLowerCase())

  const { resolvePool, hash: resolveHash, isPending: isResolving, isSuccess: resolveSuccess } = useResolvePool()
  const { cancelPool, hash: cancelHash, isPending: isCancelling, isSuccess: cancelSuccess } = useCancelPool()

  const handleResolve = async () => {
    if (!selectedPool) return
    await resolvePool(selectedPool.poolId, winningChoice)
  }

  const handleCancel = async () => {
    if (!selectedPool) return
    await cancelPool(selectedPool.poolId, "Cancelled by creator")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (selectedPool) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="md" onClick={() => setSelectedPool(null)}>
          ← Back to Pools
        </Button>

        <Card variant="elevated">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedPool.title}</CardTitle>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                  Pool #{selectedPool.id}
                </p>
              </div>
              <Badge variant={selectedPool.status === "active" ? "success" : "default"}>
                {selectedPool.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Staked</p>
                <p className="font-semibold">{selectedPool.totalStaked.toFixed(2)} cUSD</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Choices</p>
                <p className="font-semibold">{selectedPool.choicesCount}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Deadline</p>
                <p className="font-semibold">{selectedPool.deadline.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Stake Range</p>
                <p className="font-semibold">{selectedPool.minStake}-{selectedPool.maxStake} cUSD</p>
              </div>
            </div>

            {selectedPool.status === "active" && (
              <>
                <div>
                  <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Select Winning Choice
                  </label>
                  <div className="flex gap-2 mt-2">
                    {Array.from({ length: selectedPool.choicesCount }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setWinningChoice(i)}
                        className="w-12 h-12 rounded-lg font-semibold transition-colors"
                        style={{
                          backgroundColor: winningChoice === i ? "var(--success)" : "var(--surface-01)",
                          color: winningChoice === i ? "white" : "var(--text-secondary)",
                          border: `1px solid ${winningChoice === i ? "var(--success)" : "var(--border)"}`,
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="primary" 
                    size="md" 
                    onClick={handleResolve}
                    isLoading={isResolving}
                    className="flex-1"
                  >
                    Resolve Pool
                  </Button>
                  <Button 
                    variant="danger" 
                    size="md" 
                    onClick={handleCancel}
                    isLoading={isCancelling}
                    className="flex-1"
                  >
                    Cancel Pool
                  </Button>
                </div>

                {(resolveHash || cancelHash) && (
                  <a
                    href={`${EXPLORER_URL}/tx/${resolveHash || cancelHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline block text-center"
                    style={{ color: "var(--primary)" }}
                  >
                    View transaction →
                  </a>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Manage Pools</h2>
      
      {myPools.length > 0 ? (
        <div className="space-y-2">
          {myPools.map((pool) => (
            <Card 
              key={pool.id} 
              variant="elevated" 
              className="cursor-pointer card-hover"
              onClick={() => setSelectedPool(pool)}
            >
              <CardContent className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{pool.title}</p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Pool #{pool.id} • {pool.totalStaked.toFixed(2)} cUSD staked
                    </p>
                  </div>
                  <Badge variant={pool.status === "active" ? "success" : "default"}>
                    {pool.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="glass">
          <CardContent className="text-center py-8">
            <p style={{ color: "var(--text-secondary)" }}>No pools to manage</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
