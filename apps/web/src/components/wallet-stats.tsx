"use client"

import { Card, CardContent } from "@/components/card"
import { useWallet } from "@/lib/wallet-context"
import { useUserStats } from "@/hooks/useContracts"
import { formatCUSD } from "@/lib/contracts"

export function WalletStats() {
  const { address, isConnected } = useWallet()
  const { data: stats } = useUserStats(address || undefined)

  if (!isConnected || !address || !stats) {
    return null
  }

  const totalStaked = formatCUSD(stats.totalStaked)
  const totalWon = formatCUSD(stats.totalWon)
  // Prefer explicit lessonsCompleted, but fall back to total challenges played
  const rawLessonsCompleted = Number(stats.lessonsCompleted)
  const rawChallengesWon = Number(stats.challengesWon)
  const rawChallengesLost = Number(stats.challengesLost)
  const lessonsTaken =
    rawLessonsCompleted > 0 ? rawLessonsCompleted : rawChallengesWon + rawChallengesLost
  const wins = rawChallengesWon
  const losses = rawChallengesLost
  const totalGames = wins + losses
  const winRate = totalGames > 0 ? `${Math.round((wins / totalGames) * 100)}%` : "0%"

  const items = [
    { label: "Total Staked", value: `${totalStaked} cUSD`, icon: "📍" },
    { label: "Total Claimed", value: `${totalWon} cUSD`, icon: "🏆" },
    { label: "Lessons Taken", value: lessonsTaken, icon: "📚" },
    { label: "Win Rate", value: winRate, icon: "📈" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item, index) => (
        <Card key={index} variant="glass">
          <CardContent className="text-center space-y-2 py-4">
            <div className="text-2xl">{item.icon}</div>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {item.label}
            </p>
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
