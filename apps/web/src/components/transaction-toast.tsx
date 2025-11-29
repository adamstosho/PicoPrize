"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/card"
import { Badge } from "@/components/badge"
import { useStake, type TransactionStatus } from "@/lib/stake-context"

const EXPLORER_URL = "https://celo-sepolia.blockscout.com"

export function TransactionToast() {
  const { pendingStake, currentStatus } = useStake()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (pendingStake && currentStatus !== "idle") {
      setIsVisible(true)
    } else {
      // Delay hiding to show success/failure
      const timer = setTimeout(() => setIsVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [pendingStake, currentStatus])

  if (!isVisible || !pendingStake) return null

  const statusVariant: Record<TransactionStatus, "warning" | "success" | "danger" | "default"> = {
    idle: "default",
    approving: "warning",
    approved: "warning",
    staking: "warning",
    confirmed: "success",
    failed: "danger",
  }

  const statusIcon = {
    idle: "⏳",
    approving: "⏳",
    approved: "✓",
    staking: "⏳",
    confirmed: "✅",
    failed: "❌",
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <Card variant="elevated" className="max-w-md mx-auto">
        <CardContent className="py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{statusIcon[currentStatus]}</span>
            <div className="flex-1">
              <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                {pendingStake.message}
              </p>
              {pendingStake.stakeTxHash && (
                <a
                  href={`${EXPLORER_URL}/tx/${pendingStake.stakeTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline"
                  style={{ color: "var(--primary)" }}
                >
                  View on explorer →
                </a>
              )}
            </div>
            <Badge size="sm" variant={statusVariant[currentStatus]}>
              {currentStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
