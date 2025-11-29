"use client"
import { Card, CardContent } from "@/components/card"
import { Button } from "@/components/button"
import { useWallet } from "@/lib/wallet-context"

export function QuickActions() {
  const { address } = useWallet()

  const explorerBase = "https://celo-sepolia.blockscout.com"

  return (
    <Card variant="elevated">
      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={() => window.open("https://faucet.celo.org", "_blank")}
            className="w-full"
          >
            Get Test Funds
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              if (!address) {
                window.open(explorerBase, "_blank")
              } else {
                window.open(`${explorerBase}/address/${address}`, "_blank")
              }
            }}
            className="w-full"
          >
            View on Explorer
          </Button>
        </div>
        <p className="text-xs text-center" style={{ color: "var(--text-tertiary)" }}>
          Need more testnet cUSD? Use the Celo faucet to request additional funds
        </p>
      </CardContent>
    </Card>
  )
}
