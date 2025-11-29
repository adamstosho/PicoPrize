"use client"
import { TopBar } from "@/components/top-bar"
import { BottomNav } from "@/components/bottom-nav"
import { Leaderboard } from "@/components/leaderboard"
import { WalletProvider } from "@/lib/wallet-context"

export default function LeaderboardPage() {
  return (
    <WalletProvider>
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <Leaderboard />
      </main>
      <BottomNav />
    </WalletProvider>
  )
}
