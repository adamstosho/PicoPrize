"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/input"
import { LessonCard } from "@/components/lesson-card"
import { LessonView } from "@/components/lesson-view"
import { Spinner } from "@/components/spinner"
import { Card, CardContent } from "@/components/card"
import { useLessons } from "@/hooks/useLessons"
import type { Lesson } from "@/lib/lesson-data"

export function LessonFeed() {
  const { lessons, isLoading, error, totalPools } = useLessons(50)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resolved">("all")

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesSearch =
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesDifficulty = difficultyFilter === "all" || lesson.difficulty === difficultyFilter
      const matchesStatus = statusFilter === "all" || lesson.status === statusFilter
      return matchesSearch && matchesDifficulty && matchesStatus
    })
  }, [lessons, searchQuery, difficultyFilter, statusFilter])

  if (selectedLesson) {
    return <LessonView lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lessons</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Discover micro-lessons and earn rewards
          {totalPools > 0 && (
            <span className="ml-2 text-sm" style={{ color: "var(--text-tertiary)" }}>
              ({totalPools} pools on-chain)
            </span>
          )}
        </p>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Search lessons, topics, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<span>🔍</span>}
        />

        {/* Difficulty Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["all", "beginner", "intermediate", "advanced"].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff as typeof difficultyFilter)}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium"
              style={{
                backgroundColor: difficultyFilter === diff ? "var(--primary)" : "var(--neutral-800)",
                color: difficultyFilter === diff ? "white" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (difficultyFilter !== diff) {
                  e.currentTarget.style.backgroundColor = "var(--neutral-700)"
                }
              }}
              onMouseLeave={(e) => {
                if (difficultyFilter !== diff) {
                  e.currentTarget.style.backgroundColor = "var(--neutral-800)"
                }
              }}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: "all", label: "All Pools" },
            { value: "active", label: "🟢 Active" },
            { value: "resolved", label: "✅ Resolved" },
          ].map((status) => (
            <button
              key={status.value}
              onClick={() => setStatusFilter(status.value as typeof statusFilter)}
              className="px-4 py-2 rounded-full whitespace-nowrap transition-colors text-sm font-medium"
              style={{
                backgroundColor: statusFilter === status.value ? "var(--accent)" : "var(--neutral-800)",
                color: statusFilter === status.value ? "white" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (statusFilter !== status.value) {
                  e.currentTarget.style.backgroundColor = "var(--neutral-700)"
                }
              }}
              onMouseLeave={(e) => {
                if (statusFilter !== status.value) {
                  e.currentTarget.style.backgroundColor = "var(--neutral-800)"
                }
              }}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
            Loading lessons from blockchain...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card variant="glass">
          <CardContent className="text-center py-8">
            <p style={{ color: "var(--danger)" }} className="mb-2">
              Error loading lessons
            </p>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              {error.message}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lessons Grid */}
      {!isLoading && !error && (
        <>
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((lesson) => (
                <LessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                  onClick={() => setSelectedLesson(lesson)} 
                />
              ))}
            </div>
          ) : lessons.length === 0 ? (
            <Card variant="glass">
              <CardContent className="text-center py-12">
                <p className="text-4xl mb-4">📚</p>
                <p style={{ color: "var(--text-secondary)" }} className="mb-2">
                  No lessons available yet
                </p>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Be the first to create a lesson and seed a reward pool!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: "var(--text-secondary)" }} className="mb-2">
                No lessons found
              </p>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
