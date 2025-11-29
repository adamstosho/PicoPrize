"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useChainId } from "wagmi"
import { 
  PicoPrizePoolABI, 
  ERC20ABI, 
  getContractAddress,
  parseCUSD,
  formatCUSD
} from "./contracts"
import { useWallet } from "./wallet-context"
import { celoSepolia } from "./wagmi-config"

export type TransactionStatus = "idle" | "approving" | "approved" | "staking" | "confirmed" | "failed"

export interface StakeTransaction {
  id: string
  poolId: bigint
  amount: bigint
  choice: number
  timestamp: Date
  status: TransactionStatus
  approvalTxHash?: `0x${string}`
  stakeTxHash?: `0x${string}`
  message: string
  error?: string
}

interface StakeContextType {
  stakes: StakeTransaction[]
  pendingStake: StakeTransaction | null
  currentStatus: TransactionStatus
  
  // Main staking flow
  initiateStake: (poolId: bigint, amount: bigint, choice: number) => Promise<void>
  
  // Individual operations
  checkAllowance: (amount: bigint) => Promise<boolean>
  approveTokens: (amount: bigint) => Promise<void>
  executeStake: (poolId: bigint, choice: number, amount: bigint) => Promise<void>
  
  // Utilities
  clearPendingStake: () => void
  getStakesByPool: (poolId: bigint) => StakeTransaction[]
}

const StakeContext = createContext<StakeContextType | undefined>(undefined)

export function StakeProvider({ children }: { children: React.ReactNode }) {
  const { address, isCorrectNetwork } = useWallet()
  const chainId = useChainId()
  const [stakes, setStakes] = useState<StakeTransaction[]>([])
  const [pendingStake, setPendingStake] = useState<StakeTransaction | null>(null)
  const [currentStatus, setCurrentStatus] = useState<TransactionStatus>("idle")

  // Contract write hooks
  const { 
    writeContract: writeApprove, 
    data: approveHash, 
    isPending: isApproving,
    error: approveError,
    reset: resetApprove
  } = useWriteContract()

  const { 
    writeContract: writeStake, 
    data: stakeHash, 
    isPending: isStaking,
    error: stakeError,
    reset: resetStake
  } = useWriteContract()

  // Transaction receipts
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalSuccess } = 
    useWaitForTransactionReceipt({ hash: approveHash })
  
  const { isLoading: isStakeConfirming, isSuccess: isStakeSuccess } = 
    useWaitForTransactionReceipt({ hash: stakeHash })

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: getContractAddress("CUSD"),
    abi: ERC20ABI,
    functionName: "allowance",
    args: address ? [address, getContractAddress("PICOPRIZE_POOL")] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Check if user has enough allowance
  const checkAllowance = useCallback(async (amount: bigint): Promise<boolean> => {
    await refetchAllowance()
    return (allowance || 0n) >= amount
  }, [allowance, refetchAllowance])

  // Approve tokens for spending
  const approveTokens = useCallback(async (amount: bigint) => {
    // Validate chain before proceeding
    if (!isCorrectNetwork || chainId !== celoSepolia.id) {
      const error = new Error(`Please switch to Celo Sepolia (Chain ID: ${celoSepolia.id}). Current chain: ${chainId}`)
      setCurrentStatus("failed")
      if (pendingStake) {
        setPendingStake({
          ...pendingStake,
          status: "failed",
          message: "Wrong network",
          error: error.message,
        })
      }
      throw error
    }

    setCurrentStatus("approving")
    
    if (pendingStake) {
      setPendingStake({
        ...pendingStake,
        status: "approving",
        message: "Approving cUSD for staking...",
      })
    }

    writeApprove({
      address: getContractAddress("CUSD"),
      abi: ERC20ABI,
      functionName: "approve",
      args: [getContractAddress("PICOPRIZE_POOL"), amount],
      chainId: celoSepolia.id,
    })
  }, [writeApprove, pendingStake, isCorrectNetwork, chainId])

  // Execute stake transaction
  const executeStake = useCallback(async (poolId: bigint, choice: number, amount: bigint) => {
    // Validate chain before proceeding
    if (!isCorrectNetwork || chainId !== celoSepolia.id) {
      const error = new Error(`Please switch to Celo Sepolia (Chain ID: ${celoSepolia.id}). Current chain: ${chainId}`)
      setCurrentStatus("failed")
      if (pendingStake) {
        setPendingStake({
          ...pendingStake,
          status: "failed",
          message: "Wrong network",
          error: error.message,
        })
      }
      throw error
    }

    setCurrentStatus("staking")
    
    if (pendingStake) {
      setPendingStake({
        ...pendingStake,
        status: "staking",
        message: "Placing your stake...",
      })
    }

    writeStake({
      address: getContractAddress("PICOPRIZE_POOL"),
      abi: PicoPrizePoolABI,
      functionName: "stake",
      args: [poolId, choice, amount],
      chainId: celoSepolia.id,
    })
  }, [writeStake, pendingStake, isCorrectNetwork, chainId])

  // Main staking flow - handles approval + stake
  const initiateStake = useCallback(async (poolId: bigint, amount: bigint, choice: number) => {
    // Validate prerequisites
    if (!address) {
      const error = new Error("Please connect your wallet first")
      setCurrentStatus("failed")
      setPendingStake({
        id: `${poolId}-${Date.now()}`,
        poolId,
        amount,
        choice,
        timestamp: new Date(),
        status: "failed",
        message: "Wallet not connected",
        error: error.message,
      })
      throw error
    }

    if (!isCorrectNetwork || chainId !== celoSepolia.id) {
      const error = new Error(`Please switch to Celo Sepolia (Chain ID: ${celoSepolia.id}). Current chain: ${chainId}`)
      setCurrentStatus("failed")
      setPendingStake({
        id: `${poolId}-${Date.now()}`,
        poolId,
        amount,
        choice,
        timestamp: new Date(),
        status: "failed",
        message: "Wrong network",
        error: error.message,
      })
      throw error
    }

    resetApprove()
    resetStake()
    
    const stake: StakeTransaction = {
      id: `${poolId}-${Date.now()}`,
      poolId,
      amount,
      choice,
      timestamp: new Date(),
      status: "idle",
      message: "Preparing transaction...",
    }

    setPendingStake(stake)
    setCurrentStatus("idle")

    try {
      // Check allowance first
      const hasAllowance = await checkAllowance(amount)
      
      if (!hasAllowance) {
        // Need approval first
        await approveTokens(amount)
      } else {
        // Already approved, proceed to stake
        await executeStake(poolId, choice, amount)
      }
    } catch (err) {
      // Error handling is done in approveTokens/executeStake
      throw err // Re-throw so the modal can handle it
    }
  }, [address, isCorrectNetwork, chainId, checkAllowance, approveTokens, executeStake, resetApprove, resetStake])

  // Handle approval success -> proceed to stake
  useEffect(() => {
    if (isApprovalSuccess && pendingStake && currentStatus === "approving") {
      setCurrentStatus("approved")
      setPendingStake({
        ...pendingStake,
        status: "approved",
        approvalTxHash: approveHash,
        message: "Approval confirmed! Now placing stake...",
      })
      
      // Proceed to stake after approval
      setTimeout(() => {
        executeStake(pendingStake.poolId, pendingStake.choice, pendingStake.amount)
      }, 1000)
    }
  }, [isApprovalSuccess, pendingStake, currentStatus, approveHash, executeStake])

  // Handle stake success
  useEffect(() => {
    if (isStakeSuccess && pendingStake && (currentStatus === "staking" || currentStatus === "approved")) {
      const completedStake: StakeTransaction = {
        ...pendingStake,
        status: "confirmed",
        stakeTxHash: stakeHash,
        message: `Stake confirmed! TX: ${stakeHash?.slice(0, 10)}...`,
      }
      
      setCurrentStatus("confirmed")
      setPendingStake(completedStake)
      setStakes(prev => [...prev, completedStake])
      
      // Clear pending after showing success
      setTimeout(() => {
        setPendingStake(null)
        setCurrentStatus("idle")
      }, 3000)
    }
  }, [isStakeSuccess, pendingStake, currentStatus, stakeHash])

  // Handle errors
  useEffect(() => {
    if (approveError && pendingStake) {
      setCurrentStatus("failed")
      setPendingStake({
        ...pendingStake,
        status: "failed",
        message: "Approval failed",
        error: approveError.message,
      })
    }
  }, [approveError, pendingStake])

  useEffect(() => {
    if (stakeError && pendingStake) {
      setCurrentStatus("failed")
      setPendingStake({
        ...pendingStake,
        status: "failed",
        message: "Stake failed",
        error: stakeError.message,
      })
    }
  }, [stakeError, pendingStake])

  // Update status based on pending states
  useEffect(() => {
    if (isApproving && pendingStake) {
      setPendingStake({
        ...pendingStake,
        message: "Waiting for approval confirmation...",
      })
    }
  }, [isApproving])

  useEffect(() => {
    if (isApprovalConfirming && pendingStake) {
      setPendingStake({
        ...pendingStake,
        message: "Confirming approval on chain...",
      })
    }
  }, [isApprovalConfirming])

  useEffect(() => {
    if (isStaking && pendingStake) {
      setPendingStake({
        ...pendingStake,
        message: "Waiting for stake confirmation...",
      })
    }
  }, [isStaking])

  useEffect(() => {
    if (isStakeConfirming && pendingStake) {
      setPendingStake({
        ...pendingStake,
        message: "Confirming stake on chain...",
      })
    }
  }, [isStakeConfirming])

  const clearPendingStake = useCallback(() => {
    setPendingStake(null)
    setCurrentStatus("idle")
    resetApprove()
    resetStake()
  }, [resetApprove, resetStake])

  const getStakesByPool = useCallback((poolId: bigint) => {
    return stakes.filter(s => s.poolId === poolId)
  }, [stakes])

  return (
    <StakeContext.Provider
      value={{
        stakes,
        pendingStake,
        currentStatus,
        initiateStake,
        checkAllowance,
        approveTokens,
        executeStake,
        clearPendingStake,
        getStakesByPool,
      }}
    >
      {children}
    </StakeContext.Provider>
  )
}

export function useStake() {
  const context = useContext(StakeContext)
  if (!context) {
    throw new Error("useStake must be used within StakeProvider")
  }
  return context
}
