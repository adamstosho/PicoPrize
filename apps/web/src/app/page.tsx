"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { WalletProvider, useWallet } from "@/lib/wallet-context"
import { StakeProvider } from "@/lib/stake-context"
import { TopBar } from "@/components/top-bar"
import { BottomNav } from "@/components/bottom-nav"
import { OnboardingModal } from "@/components/onboarding-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Button } from "@/components/button"

function HomeContent() {
  const { isConnected } = useWallet()
  const [showOnboarding, setShowOnboarding] = useState(!isConnected)

  useEffect(() => {
    setShowOnboarding(!isConnected)
  }, [isConnected])

  return (
    <>
      <TopBar />
      {showOnboarding && <OnboardingModal />}

      <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {isConnected ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Learn & Earn</h1>
              <p style={{ color: "var(--text-secondary)" }}>
                Complete bite-sized lessons and stake cUSD for instant rewards
              </p>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/lessons">
                <Card variant="elevated" className="card-hover cursor-pointer h-full animate-slide-up stagger-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>📚</span> Browse Lessons
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                      Explore micro-lessons across various topics
                    </p>
                    <Button variant="primary" size="md" className="w-full">
                      View Lessons
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/wallet">
                <Card variant="elevated" className="card-hover cursor-pointer h-full animate-slide-up stagger-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>💰</span> My Wallet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                      Check balance and transaction history
                    </p>
                    <Button variant="primary" size="md" className="w-full">
                      View Wallet
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/leaderboard">
                <Card variant="elevated" className="card-hover cursor-pointer h-full animate-slide-up stagger-3">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>🏆</span> Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                      See top learners and creators
                    </p>
                    <Button variant="primary" size="md" className="w-full">
                      View Rankings
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/creator">
                <Card variant="elevated" className="card-hover cursor-pointer h-full animate-slide-up stagger-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span>✏️</span> Create Lesson
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                      Earn by creating and publishing lessons
                    </p>
                    <Button variant="primary" size="md" className="w-full">
            Get Started
          </Button>
                  </CardContent>
                </Card>
              </Link>
        </div>

            <Card variant="glass">
              <CardContent className="pt-4">
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  <strong style={{ color: "var(--warning)" }}>Testnet Notice:</strong> This is a demonstration using cUSD on Celo Sepolia testnet. All funds
                  are test tokens with no real value.
                </p>
              </CardContent>
            </Card>
      </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">Connect your wallet to begin</h2>
            <p style={{ color: "var(--text-secondary)" }}>Follow the onboarding steps to connect your MiniPay wallet</p>
    </div>
        )}
</main>

      <BottomNav />
    </>
  )
}

export default function Home() {
  return (
    <WalletProvider>
      <StakeProvider>
        <HomeContent />
      </StakeProvider>
    </WalletProvider>
  )
}
