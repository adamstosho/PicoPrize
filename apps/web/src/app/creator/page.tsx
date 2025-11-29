"use client"
import { TopBar } from "@/components/top-bar"
import { BottomNav } from "@/components/bottom-nav"
import { CreatorDashboard } from "@/components/creator-dashboard"
import { WalletProvider } from "@/lib/wallet-context"
import { StakeProvider } from "@/lib/stake-context"

export default function CreatorPage() {
  return (
    <WalletProvider>
      <StakeProvider>
        <TopBar />
        <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
          <CreatorDashboard />
        </main>
        <BottomNav />
      </StakeProvider>
    </WalletProvider>
  )
}
