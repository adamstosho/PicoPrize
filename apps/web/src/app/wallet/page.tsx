"use client"
import { TopBar } from "@/components/top-bar"
import { BottomNav } from "@/components/bottom-nav"
import { BalanceCard } from "@/components/balance-card"
import { WalletStats } from "@/components/wallet-stats"
import { QuickActions } from "@/components/quick-actions"
import { TransactionHistory } from "@/components/transaction-history"
import { WalletProvider } from "@/lib/wallet-context"
import { StakeProvider } from "@/lib/stake-context"
import { Card, CardContent } from "@/components/card"

export default function WalletPage() {
  return (
    <WalletProvider>
      <StakeProvider>
        <TopBar />
        <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Wallet</h1>
              <p style={{ color: "var(--text-secondary)" }}>Manage your balance and view transactions</p>
            </div>

            <BalanceCard />

            <WalletStats />

            <QuickActions />

            <TransactionHistory />

            <Card variant="glass">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  <p>
                    <strong style={{ color: "var(--warning)" }}>Testnet Only:</strong> This wallet contains only Celo Sepolia testnet cUSD.
                  </p>
                  <p>
                    Real mainnet funds are never used in this demo. Always double-check the network before conducting
                    transactions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <BottomNav />
      </StakeProvider>
    </WalletProvider>
  )
}
