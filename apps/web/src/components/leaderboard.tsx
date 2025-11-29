"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/card"
import { Badge } from "@/components/badge"
import { Spinner } from "@/components/spinner"
import { useLeaderboard, useUserStats, useCreatorStats, useTotalUsers, useCreatorsLeaderboard } from "@/hooks/useContracts"
import { useWallet } from "@/lib/wallet-context"
import { shortenAddress, formatCUSD } from "@/lib/contracts"

export function Leaderboard() {
  const [tab, setTab] = useState<"learners" | "creators">("learners")
  const { address } = useWallet()
  
  // Fetch leaderboard data from contract
  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useLeaderboard(20)
  const { data: totalUsers } = useTotalUsers()
  const { data: myStats } = useUserStats(address || undefined)
  const { data: myCreatorStats } = useCreatorStats(address || undefined)
  const { creators, isLoading: isCreatorsLoading } = useCreatorsLeaderboard()

  // Process leaderboard data
  const leaderboard = useMemo(() => {
    if (!leaderboardData) return []
    
    const [users, points] = leaderboardData
    return users.map((user, index) => ({
      rank: index + 1,
      address: user,
      points: Number(points[index]),
      displayName: shortenAddress(user),
    }))
  }, [leaderboardData])

  // Find user's rank
  const myRank = useMemo(() => {
    if (!address || !leaderboard.length) return null
    const index = leaderboard.findIndex(u => u.address.toLowerCase() === address.toLowerCase())
    return index >= 0 ? index + 1 : null
  }, [address, leaderboard])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          See top learners and creators on the network
          {totalUsers !== undefined && (
            <span className="ml-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
              ({Number(totalUsers)} registered users)
            </span>
          )}
        </p>
      </div>

      {/* My Stats Card */}
      {address && myStats && (
        <Card variant="elevated">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Your Stats</p>
                <p className="text-2xl font-bold" style={{ color: "var(--primary)" }}>
                  {Number(myStats.totalPoints)} pts
                </p>
              </div>
              <div className="text-right">
                {myRank && (
                  <Badge size="sm" variant={myRank <= 3 ? "success" : "default"}>
                    Rank #{myRank}
                  </Badge>
                )}
                <div className="flex gap-4 mt-2 text-sm">
                  <span style={{ color: "var(--success)" }}>
                    {Number(myStats.challengesWon)} wins
                  </span>
                  <span style={{ color: "var(--text-tertiary)" }}>
                    🔥 {Number(myStats.currentStreak)} streak
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderBottomColor: "var(--border)" }}>
        {["learners", "creators"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as typeof tab)}
            className="px-4 py-3 font-medium border-b-2 transition-colors"
            style={{
              borderBottomColor: tab === t ? "var(--primary)" : "transparent",
              color: tab === t ? "var(--primary)" : "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              if (tab !== t) {
                e.currentTarget.style.color = "var(--text-primary)"
              }
            }}
            onMouseLeave={(e) => {
              if (tab !== t) {
                e.currentTarget.style.color = "var(--text-secondary)"
              }
            }}
          >
            {t === "learners" ? "🎓 Learners" : "✏️ Creators"}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLeaderboardLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
            Loading leaderboard from blockchain...
          </p>
        </div>
      )}

      {/* Learners Tab */}
      {!isLeaderboardLoading && tab === "learners" && (
        <div className="space-y-2">
          {leaderboard.length > 0 ? (
            leaderboard.map((user) => (
              <Card 
                key={user.address} 
                variant={user.address.toLowerCase() === address?.toLowerCase() ? "elevated" : "glass"}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="text-3xl font-bold w-10 text-center" 
                      style={{ 
                        color: user.rank === 1 ? "var(--warning)" : 
                               user.rank === 2 ? "var(--text-secondary)" : 
                               user.rank === 3 ? "#CD7F32" : "var(--primary)" 
                      }}
                    >
                      {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : user.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                          {user.displayName}
                        </span>
                        {user.rank <= 3 && (
                          <Badge
                            size="sm"
                            variant={user.rank === 1 ? "warning" : user.rank === 2 ? "default" : "accent"}
                          >
                            {user.rank === 1 ? "Gold" : user.rank === 2 ? "Silver" : "Bronze"}
                          </Badge>
                        )}
                        {user.address.toLowerCase() === address?.toLowerCase() && (
                          <Badge size="sm" variant="success">You</Badge>
                        )}
                      </div>
                      <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                        {user.address}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-lg" style={{ color: "var(--accent)" }}>
                        {user.points.toLocaleString()} pts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card variant="glass">
              <CardContent className="text-center py-12">
                <p className="text-4xl mb-4">🏆</p>
                <p style={{ color: "var(--text-secondary)" }} className="mb-2">
                  No learners on the leaderboard yet
                </p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Be the first to complete a challenge and earn points!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Creators Tab */}
      {tab === "creators" && (
        <div className="space-y-2">
          {/* Loading State */}
          {isCreatorsLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Spinner size="lg" />
              <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
                Loading creators from blockchain...
              </p>
            </div>
          )}

          {/* Show my creator stats if I'm a creator */}
          {!isCreatorsLoading && myCreatorStats && Number(myCreatorStats.lessonsCreated) > 0 && (
            <Card variant="elevated">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">✏️</div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      Your Creator Stats
                    </p>
                    <div className="flex gap-4 mt-1 text-sm">
                      <span style={{ color: "var(--text-secondary)" }}>
                        {Number(myCreatorStats.lessonsCreated)} lessons
                      </span>
                      <span style={{ color: "var(--text-secondary)" }}>
                        {Number(myCreatorStats.totalParticipants)} participants
                      </span>
                      <span style={{ color: "var(--success)" }}>
                        {formatCUSD(myCreatorStats.totalFeesEarned)} cUSD earned
                      </span>
                    </div>
                  </div>
                  {Number(myCreatorStats.ratingCount) > 0 && (
                    <Badge size="sm" variant="accent">
                      {(Number(myCreatorStats.averageRating) / 10).toFixed(1)} ⭐
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Creators List */}
          {!isCreatorsLoading && creators.length > 0 ? (
            creators.map((creator, index) => (
              <Card 
                key={creator.address} 
                variant={creator.address.toLowerCase() === address?.toLowerCase() ? "elevated" : "glass"}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className="text-3xl font-bold w-10 text-center" 
                      style={{ 
                        color: index === 0 ? "var(--warning)" : 
                               index === 1 ? "var(--text-secondary)" : 
                               index === 2 ? "#CD7F32" : "var(--primary)" 
                      }}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                          {shortenAddress(creator.address)}
                        </span>
                        {index < 3 && (
                          <Badge
                            size="sm"
                            variant={index === 0 ? "warning" : index === 1 ? "default" : "accent"}
                          >
                            {index === 0 ? "Top Earner" : index === 1 ? "Silver" : "Bronze"}
                          </Badge>
                        )}
                        {creator.address.toLowerCase() === address?.toLowerCase() && (
                          <Badge size="sm" variant="success">You</Badge>
                        )}
                      </div>
                      <p className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                        {creator.address}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-lg" style={{ color: "var(--success)" }}>
                        {formatCUSD(creator.stats.totalFeesEarned)} cUSD
                      </p>
                      <div className="flex gap-3 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span>{Number(creator.stats.lessonsCreated)} lessons</span>
                        <span>{Number(creator.stats.totalParticipants)} participants</span>
                        {Number(creator.stats.ratingCount) > 0 && (
                          <span>
                            {(Number(creator.stats.averageRating) / 10).toFixed(1)} ⭐
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !isCreatorsLoading ? (
            <Card variant="glass">
              <CardContent className="text-center py-12">
                <p className="text-4xl mb-4">✏️</p>
                <p style={{ color: "var(--text-secondary)" }} className="mb-2">
                  No creators on the leaderboard yet
                </p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Create lessons and seed pools to appear here!
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  )
}
