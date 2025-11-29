"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"
import { Slider } from "@/components/slider"
import { Spinner } from "@/components/spinner"
import { useStake, type TransactionStatus } from "@/lib/stake-context"
import { useWallet } from "@/lib/wallet-context"
import { parseCUSD, formatCUSD, getContractAddress } from "@/lib/contracts"

interface StakeModalProps {
  poolId: bigint
  minStake: number // in cUSD (e.g., 0.05)
  maxStake: number // in cUSD (e.g., 0.5)
  selectedChoice: number
  onClose: () => void
  onSuccess?: () => void
}

const EXPLORER_URL = "https://celo-sepolia.blockscout.com"

export function StakeModal({ 
  poolId, 
  minStake, 
  maxStake, 
  selectedChoice,
  onClose, 
  onSuccess 
}: StakeModalProps) {
  const { balance, balanceRaw, address, isCorrectNetwork } = useWallet()
  const { initiateStake, pendingStake, currentStatus, clearPendingStake } = useStake()
  const [stakeAmount, setStakeAmount] = useState(minStake)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const stakeAmountWei = parseCUSD(stakeAmount)
  // Parse balance, handling "Error loading" and "Loading..." strings
  const walletBalance = balance && balance !== "Error loading" && balance !== "Loading..." 
    ? parseFloat(balance) 
    : 0
  const canAfford = walletBalance >= stakeAmount
  
  // Ensure stakeAmount is within bounds
  useEffect(() => {
    if (stakeAmount < minStake) {
      setStakeAmount(minStake)
    } else if (stakeAmount > maxStake) {
      setStakeAmount(maxStake)
    }
  }, [minStake, maxStake, stakeAmount])

  // Handle successful stake
  useEffect(() => {
    if (currentStatus === "confirmed" && pendingStake?.stakeTxHash) {
      const timer = setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentStatus, pendingStake, onSuccess, onClose])

  const handleStake = async () => {
    if (!address) {
      alert("Please connect your wallet first")
      return
    }
    
    if (!isCorrectNetwork) {
      alert("Please switch to Celo Sepolia network in your wallet")
      return
    }

    if (!canAfford) {
      const proceed = confirm(
        `Insufficient balance. You have ${balance || "0.00"} cUSD but need ${stakeAmount.toFixed(2)} cUSD.\n\n` +
        `The transaction will fail, but you can test the flow. Continue anyway?`
      )
      if (!proceed) return
    }

    if (!isConfirmed) {
      alert("Please confirm the terms by checking the checkbox")
      return
    }

    try {
      await initiateStake(poolId, stakeAmountWei, selectedChoice)
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Failed to initiate stake'}`)
      // Error is already handled in stake-context and will show in UI
    }
  }

  const handleClose = () => {
    clearPendingStake()
    onClose()
  }

  // Success state
  if (currentStatus === "confirmed" && pendingStake?.stakeTxHash) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Card className="w-full max-w-md text-center" variant="elevated">
          <CardContent className="pt-8 space-y-4">
            <div className="text-5xl">🎉</div>
            <h3 className="text-xl font-semibold">Stake Confirmed!</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Your {stakeAmount.toFixed(2)} cUSD stake has been placed on choice {selectedChoice + 1}.
            </p>
            <div
              className="rounded-lg p-3 text-sm border"
              style={{
                backgroundColor: "rgba(0, 210, 138, 0.1)",
                borderColor: "var(--success)",
                color: "var(--success)",
              }}
            >
              Awaiting challenge results...
            </div>
            <a
              href={`${EXPLORER_URL}/tx/${pendingStake.stakeTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline block"
              style={{ color: "var(--primary)" }}
            >
              View transaction on explorer →
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (currentStatus === "failed" && pendingStake?.error) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Card className="w-full max-w-md text-center" variant="elevated">
          <CardContent className="pt-8 space-y-4">
            <div className="text-5xl">❌</div>
            <h3 className="text-xl font-semibold">Transaction Failed</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              {pendingStake.message}
            </p>
            <div
              className="rounded-lg p-3 text-sm border text-left overflow-auto max-h-32"
              style={{
                backgroundColor: "rgba(255, 90, 110, 0.1)",
                borderColor: "var(--danger)",
                color: "var(--danger)",
              }}
            >
              {pendingStake.error}
            </div>
            <Button variant="primary" size="md" onClick={handleClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Processing state (approving or staking)
  const isProcessing = ["approving", "approved", "staking"].includes(currentStatus)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-3 py-6 sm:p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Card className="w-full max-w-md max-h-full flex flex-col overflow-hidden" variant="elevated">
        <CardHeader>
          <CardTitle>Confirm Stake</CardTitle>
          <CardDescription>
            Place your stake on choice {selectedChoice + 1} to enter the challenge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 overflow-y-auto pr-1">
          {isProcessing && pendingStake ? (
            <div className="space-y-4">
              <div className="text-center py-6">
                <Spinner size="lg" />
                <p className="font-semibold mt-4" style={{ color: "var(--text-primary)" }}>
                  {pendingStake.message}
                </p>
                {currentStatus === "approving" && (
                  <p className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
                    Step 1/2: Approving cUSD
                  </p>
                )}
                {currentStatus === "approved" && (
                  <p className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
                    Step 2/2: Placing stake
                  </p>
                )}
                {currentStatus === "staking" && (
                  <p className="text-sm mt-2" style={{ color: "var(--text-tertiary)" }}>
                    Confirming on Celo Sepolia...
                  </p>
                )}
              </div>
              
              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: currentStatus === "approving" ? "var(--primary)" : "var(--success)",
                  }}
                />
                <div
                  className="w-8 h-0.5"
                  style={{
                    backgroundColor: currentStatus === "approving" ? "var(--neutral-600)" : "var(--success)",
                  }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: 
                      currentStatus === "staking" ? "var(--primary)" : 
                      currentStatus === "approved" ? "var(--warning)" : 
                      "var(--neutral-600)",
                  }}
                />
              </div>

              {pendingStake.approvalTxHash && (
                <a
                  href={`${EXPLORER_URL}/tx/${pendingStake.approvalTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline block text-center"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  View approval tx →
                </a>
              )}

              <div
                className="border rounded-lg p-3 text-sm"
                style={{
                  backgroundColor: "var(--glass-01)",
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                Please confirm in your wallet and wait for confirmation...
              </div>
              
              <Button variant="ghost" size="md" onClick={handleClose} className="w-full">
                Cancel
              </Button>
            </div>
          ) : (
            <>
              {/* Stake Amount Slider */}
              <div>
                <Slider
                  label="Stake Amount (cUSD)"
                  min={String(minStake)}
                  max={String(Math.max(maxStake, minStake + 0.01))}
                  step="0.01"
                  value={stakeAmount}
                  onChange={(e) => {
                    const newValue = parseFloat(e.target.value)
                    setStakeAmount(newValue)
                  }}
                  formatValue={(val) => `${val.toFixed(2)} cUSD`}
                />
                <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
                  Min: {minStake} • Max: {maxStake} cUSD
                  {walletBalance > 0 && ` • Your max: ${Math.min(maxStake, walletBalance).toFixed(2)} cUSD`}
                </p>
              </div>

              {/* Summary */}
              <Card variant="glass">
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Stake amount</span>
                    <span className="font-mono font-semibold">{stakeAmount.toFixed(2)} cUSD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Selected choice</span>
                    <span className="font-mono font-semibold">Option {selectedChoice + 1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--text-secondary)" }}>Network</span>
                    <span className="font-mono font-semibold">Celo Sepolia</span>
                  </div>
                  <div className="pt-2 flex justify-between border-t" style={{ borderTopColor: "var(--border)" }}>
                    <span className="font-semibold">Your Balance</span>
                    <span className="font-mono font-semibold" style={{ color: "var(--accent)" }}>
                      {balance || "0.00"} cUSD
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Balance Check */}
              <div
                className="rounded-lg p-3 border text-sm font-medium"
                style={{
                  backgroundColor: canAfford ? "rgba(0, 210, 138, 0.1)" : "rgba(255, 90, 110, 0.1)",
                  borderColor: canAfford ? "var(--success)" : "var(--danger)",
                  color: canAfford ? "var(--success)" : "var(--danger)",
                }}
              >
                {canAfford
                  ? `Balance: ${balance} cUSD - Ready to stake`
                  : `Insufficient balance (need ${stakeAmount.toFixed(2)} cUSD)`}
              </div>

              {/* Testnet Notice */}
              <Card variant="glass">
                <CardContent>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    <strong>Testnet:</strong> This is cUSD on Celo Sepolia testnet. No real funds are at risk. 
                    Get testnet funds from{" "}
                    <a 
                      href="https://faucet.celo.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline"
                      style={{ color: "var(--primary)" }}
                    >
                      faucet.celo.org
                    </a>
                  </p>
                </CardContent>
              </Card>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  I understand this is a testnet stake. I agree to challenge with {stakeAmount.toFixed(2)} cUSD 
                  on choice {selectedChoice + 1}.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="ghost" size="md" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStake}
                  disabled={!isConfirmed || !address || !isCorrectNetwork}
                  className="flex-1"
                >
                  {!canAfford ? "Stake Anyway (Will Fail)" : "Confirm Stake"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
