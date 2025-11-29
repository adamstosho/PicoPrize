"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { StakeModal } from "@/components/stake-modal"
import { useWallet } from "@/lib/wallet-context"
import type { Lesson } from "@/lib/lesson-data"

interface ChallengeCardProps {
  lesson: Lesson
  selectedChoice?: number
  onStakeSuccess?: () => void
}

export function ChallengeCard({ lesson, selectedChoice = 0, onStakeSuccess }: ChallengeCardProps) {
  const { isConnected } = useWallet()
  const [showStakeModal, setShowStakeModal] = useState(false)

  const isActive = lesson.status === "active" && lesson.deadline > new Date()

  return (
    <>
      <Card variant="elevated" className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Pool #{lesson.id}
              </p>
            </div>
            <Badge variant={isActive ? "success" : "default"}>
              {isActive ? "Active" : lesson.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Total Staked</p>
              <p className="font-semibold" style={{ color: "var(--accent)" }}>
                {lesson.totalStaked.toFixed(2)} cUSD
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Stake Range</p>
              <p className="font-semibold">
                {lesson.minStake}-{lesson.maxStake} cUSD
              </p>
            </div>
          </div>

          {isActive && isConnected && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowStakeModal(true)}
              className="w-full"
            >
              Stake Now
            </Button>
          )}

          {!isConnected && (
            <p className="text-sm text-center" style={{ color: "var(--text-tertiary)" }}>
              Connect wallet to stake
            </p>
          )}
        </CardContent>
      </Card>

      {showStakeModal && (
        <StakeModal
          poolId={lesson.poolId}
          minStake={lesson.minStake}
          maxStake={lesson.maxStake}
          selectedChoice={selectedChoice}
          onClose={() => setShowStakeModal(false)}
          onSuccess={() => {
            setShowStakeModal(false)
            onStakeSuccess?.()
          }}
        />
      )}
    </>
  )
}
