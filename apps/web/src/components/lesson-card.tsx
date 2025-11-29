"use client"
import { Card, CardContent } from "@/components/card"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import type { Lesson } from "@/lib/lesson-data"

interface LessonCardProps {
  lesson: Lesson
  onClick?: () => void
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.ceil(seconds / 60)
    return `${minutes} min`
  }

  const difficultyColor = {
    beginner: "default",
    intermediate: "warning",
    advanced: "danger",
  } as const

  const statusColor = {
    active: "success",
    closed: "warning",
    resolved: "accent",
    cancelled: "danger",
  } as const

  const isActive = lesson.status === "active" && lesson.deadline > new Date()
  const timeRemaining = lesson.deadline.getTime() - Date.now()
  const hoursRemaining = Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))
  const minutesRemaining = Math.max(0, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)))

  const fallbackImages = [
    "/lesson-hero-1.jpg",
    "/lesson-hero-2.jpg",
    "/lesson-hero-3.jpg",
  ]

  const imageUrl = lesson.image && lesson.image.trim().length > 0
    ? lesson.image
    : fallbackImages[Number(lesson.poolId % BigInt(fallbackImages.length))]

  return (
    <Card
      variant="elevated"
      onClick={onClick}
      className="overflow-hidden cursor-pointer card-hover"
    >
      <div
        className="relative h-32 overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(108, 99, 255, 0.3), rgba(0, 209, 178, 0.3))" }}
      >
        <img src={imageUrl} alt={lesson.title} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)" }}
        />
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <Badge size="sm" variant={statusColor[lesson.status]}>
            {lesson.status === "active" ? "🟢 Active" : 
             lesson.status === "resolved" ? "✅ Resolved" : 
             lesson.status === "cancelled" ? "❌ Cancelled" : "⏸️ Closed"}
          </Badge>
        </div>
        {/* Pool Stats Overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          <Badge size="sm" variant="default" className="bg-black/50 backdrop-blur-sm">
            💰 {lesson.totalStaked.toFixed(2)} cUSD staked
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-lg leading-tight flex-1" style={{ color: "var(--text-primary)" }}>
              {lesson.title}
            </h3>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {lesson.author}
          </p>
        </div>

        <p className="text-sm line-clamp-2" style={{ color: "var(--text-tertiary)" }}>
          {lesson.description}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge size="sm" variant="default">
            {formatDuration(lesson.duration)}
          </Badge>
          <Badge size="sm" variant={difficultyColor[lesson.difficulty]}>
            {lesson.difficulty}
          </Badge>
          {isActive && (
            <Badge size="sm" variant="accent">
              Stake {lesson.minStake}-{lesson.maxStake} cUSD
            </Badge>
          )}
        </div>

        {/* Time Remaining */}
        {isActive && (
          <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            ⏱️ {hoursRemaining > 0 ? `${hoursRemaining}h ${minutesRemaining}m` : `${minutesRemaining}m`} remaining
          </div>
        )}

        <div className="pt-2" style={{ borderTop: "1px solid", borderTopColor: "var(--border)" }}>
          <Button
            variant={isActive ? "primary" : "secondary"}
            size="md"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.()
            }}
          >
            {isActive ? "Take Lesson & Stake" : 
             lesson.status === "resolved" ? "View Results" : "View Lesson"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
