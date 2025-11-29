"use client"

import { Badge } from "@/components/badge"
import { formatCUSD } from "@/lib/contracts"
import type { StakeTransaction } from "@/lib/stake-context"

const EXPLORER_URL = "https://celo-sepolia.blockscout.com"

interface TransactionItemProps {
  transaction: StakeTransaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const statusVariant = {
    confirmed: "success",
    failed: "danger",
    pending: "warning",
    approving: "warning",
    approved: "warning",
    staking: "warning",
    idle: "default",
  } as const

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg border"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--surface-01)" }}
        >
          {transaction.status === "confirmed" ? "✅" : 
           transaction.status === "failed" ? "❌" : "⏳"}
        </div>
        <div>
          <p className="font-medium" style={{ color: "var(--text-primary)" }}>
            Stake on Pool #{transaction.poolId.toString()}
          </p>
          <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {transaction.timestamp.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-mono font-semibold" style={{ color: "var(--accent)" }}>
          {formatCUSD(transaction.amount)} cUSD
        </p>
        <Badge size="sm" variant={statusVariant[transaction.status]}>
          {transaction.status}
        </Badge>
      </div>
    </div>
  )
}
