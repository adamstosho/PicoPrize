"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Badge } from "@/components/badge"
import { useStake } from "@/lib/stake-context"
import { formatCUSD, shortenAddress } from "@/lib/contracts"

const EXPLORER_URL = "https://celo-sepolia.blockscout.com"

export function TransactionHistory() {
  const { stakes } = useStake()

  // Sort by timestamp, newest first
  const sortedStakes = [...stakes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  if (sortedStakes.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="text-center py-8">
          <p className="text-4xl mb-4">📜</p>
          <p style={{ color: "var(--text-secondary)" }}>No transactions yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-tertiary)" }}>
            Your stake transactions will appear here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        Recent Transactions
      </h3>
      
      <div className="space-y-2">
        {sortedStakes.map((stake) => (
          <Card key={stake.id} variant="glass">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: "var(--surface-01)" }}
                  >
                    {stake.status === "confirmed" ? "✅" : stake.status === "failed" ? "❌" : "⏳"}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      Stake on Pool #{stake.poolId.toString()}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      Choice {stake.choice + 1} • {stake.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold" style={{ color: "var(--accent)" }}>
                    {formatCUSD(stake.amount)} cUSD
                  </p>
                  <Badge 
                    size="sm" 
                    variant={
                      stake.status === "confirmed" ? "success" : 
                      stake.status === "failed" ? "danger" : "warning"
                    }
                  >
                    {stake.status}
                  </Badge>
                </div>
              </div>
              
              {stake.stakeTxHash && (
                <a
                  href={`${EXPLORER_URL}/tx/${stake.stakeTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline mt-2 block"
                  style={{ color: "var(--primary)" }}
                >
                  View on explorer →
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
