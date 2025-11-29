"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Badge } from "@/components/badge"
import { useWallet } from "@/lib/wallet-context"

export function BalanceCard() {
  const { address, balance, isConnected } = useWallet()

  if (!isConnected) {
    return null
  }

  return (
    <Card
      variant="elevated"
      className="border"
      style={{
        background: "linear-gradient(135deg, rgba(108, 99, 255, 0.15) 0%, rgba(0, 209, 178, 0.08) 100%)",
        borderColor: "var(--border)",
      }}
    >
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total Balance
          </CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold" style={{ color: "var(--accent)" }}>
              {balance}
            </span>
            <span className="text-xl" style={{ color: "var(--text-secondary)" }}>
              cUSD
            </span>
          </div>
          <Badge size="sm" variant="default" className="font-mono text-xs">
            {address}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          Celo Sepolia Testnet • All funds are test tokens
        </p>
      </CardContent>
    </Card>
  )
}
