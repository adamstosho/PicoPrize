"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { StakeModal } from "@/components/stake-modal"
import { useWallet } from "@/lib/wallet-context"
import { useHasUserStaked, useCalculateReward, useClaimReward } from "@/hooks/useContracts"
import { formatCUSD, shortenAddress } from "@/lib/contracts"
import type { Lesson } from "@/lib/lesson-data"

interface LessonViewProps {
  lesson: Lesson
  onBack: () => void
}

export function LessonView({ lesson, onBack }: LessonViewProps) {
  const { address, isConnected } = useWallet()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showChoiceSelection, setShowChoiceSelection] = useState(false)
  const [showStakeModal, setShowStakeModal] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)

  // Contract hooks - refetch after stake success
  const { data: hasStaked, refetch: refetchHasStaked } = useHasUserStaked(lesson.poolId, address || undefined)
  const { data: reward, refetch: refetchReward } = useCalculateReward(lesson.poolId, address || undefined)
  const { claimReward, isPending: isClaiming, isSuccess: claimSuccess } = useClaimReward()

  // Refetch stake status when wallet address changes or after successful stake
  useEffect(() => {
    if (address) {
      refetchHasStaked()
      refetchReward()
    }
  }, [address, refetchHasStaked, refetchReward])

  const currentQuestion = lesson.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === lesson.questions.length - 1
  const selectedAnswer = selectedAnswers[currentQuestionIndex]
  const isActive = lesson.status === "active" && lesson.deadline > new Date()
  const isResolved = lesson.status === "resolved"
  const isCreator = !!address && address.toLowerCase() === lesson.authorAddress.toLowerCase()

  const handleSelectAnswer = (optionIndex: number) => {
    if (showResults) return
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = optionIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // After last question, show choice selection if pool is active
      if (isActive && !hasStaked) {
        setShowChoiceSelection(true)
      } else {
        setShowResults(true)
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSelectChoice = (choice: number) => {
    setSelectedChoice(choice)
    setShowChoiceSelection(false)
    setShowResults(true)
  }

  const handleStake = () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }
    if (isCreator) {
      alert("Creators cannot stake on their own pools. Please connect with a different wallet to stake.")
      return
    }
    if (selectedChoice === null) {
      alert("Please select a choice to stake on")
      return
    }
    setShowStakeModal(true)
  }

  const handleClaimReward = async () => {
    if (reward && reward > 0n) {
      await claimReward(lesson.poolId)
    }
  }

  const calculateScore = () => {
    let correct = 0
    lesson.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return (correct / lesson.questions.length) * 100
  }

  const score = calculateScore()
  const passed = score >= 70

  const fallbackImages = [
    "/lesson-hero-1.jpg",
    "/lesson-hero-2.jpg",
    "/lesson-hero-3.jpg",
  ]

  const imageUrl = lesson.image && lesson.image.trim().length > 0
    ? lesson.image
    : fallbackImages[Number(lesson.poolId % BigInt(fallbackImages.length))]

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="md" onClick={onBack} className="mb-4">
        ← Back to Lessons
      </Button>

      {/* Stake Modal */}
      {showStakeModal && selectedChoice !== null && (
        <StakeModal
          poolId={lesson.poolId}
          minStake={lesson.minStake}
          maxStake={lesson.maxStake}
          selectedChoice={selectedChoice}
          onClose={() => setShowStakeModal(false)}
          onSuccess={() => {
            setShowStakeModal(false)
            // Refetch stake status to update UI
            refetchHasStaked()
            refetchReward()
          }}
        />
      )}

      {/* Choice Selection Screen */}
      {showChoiceSelection && !showResults && (
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Select Your Prediction</CardTitle>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Choose which option you think will win this challenge
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p style={{ color: "var(--text-secondary)" }}>
              This pool has {lesson.choicesCount} choices. Select the one you want to stake on:
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: lesson.choicesCount }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectChoice(i)}
                  className="p-4 rounded-lg border-2 transition-all text-center font-semibold"
                  style={{
                    borderColor: selectedChoice === i ? "var(--primary)" : "var(--border)",
                    backgroundColor: selectedChoice === i ? "rgba(108, 99, 255, 0.1)" : "var(--surface)",
                    color: selectedChoice === i ? "var(--primary)" : "var(--text-primary)",
                  }}
                >
                  Choice {i + 1}
                  {selectedChoice === i && <span className="ml-2">✓</span>}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (selectedChoice !== null) {
                  setShowChoiceSelection(false)
                  setShowResults(true)
                }
              }}
              disabled={selectedChoice === null}
              className="w-full"
            >
              Continue to Results
            </Button>
          </CardContent>
        </Card>
      )}

      {!showResults && !showChoiceSelection ? (
        <div className="space-y-4">
          {/* Lesson Header */}
          <Card variant="elevated">
            <CardHeader>
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                  <Badge 
                    size="sm" 
                    variant={isActive ? "success" : isResolved ? "accent" : "default"}
                  >
                    {isActive ? "🟢 Active" : isResolved ? "✅ Resolved" : lesson.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge size="sm" variant="default">
                    By {lesson.author}
                  </Badge>
                  <Badge size="sm" variant="default">
                    {Math.ceil(lesson.duration / 60)} min
                  </Badge>
                  <Badge size="sm" variant="warning">
                    {lesson.difficulty}
                  </Badge>
                </div>
                {/* Pool Stats */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge size="sm" variant="accent">
                    💰 {lesson.totalStaked.toFixed(2)} cUSD staked
                  </Badge>
                  <Badge size="sm" variant="default">
                    {lesson.choicesCount} choices
                  </Badge>
                  {hasStaked && (
                    <Badge size="sm" variant="success">
                      ✓ You've staked
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Content */}
          <Card variant="elevated">
            <CardContent>
              <img
                src={imageUrl}
                alt={lesson.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {lesson.description}
              </p>
            </CardContent>
          </Card>

          {/* Question */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Question {currentQuestionIndex + 1}/{lesson.questions.length}
                </CardTitle>
                <div
                  className="w-32 h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--neutral-700)" }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / lesson.questions.length) * 100}%`,
                      backgroundColor: "var(--primary)",
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
                {currentQuestion.text}
              </p>

              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className="w-full p-3 rounded-lg border-2 transition-colors text-left"
                    style={{
                      borderColor: selectedAnswer === index ? "var(--primary)" : "var(--border)",
                      backgroundColor: selectedAnswer === index ? "rgba(108, 99, 255, 0.1)" : "var(--surface)",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAnswer !== index) {
                        e.currentTarget.style.backgroundColor = "var(--surface-01)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAnswer !== index) {
                        e.currentTarget.style.backgroundColor = "var(--surface)"
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors"
                        style={{
                          borderColor: selectedAnswer === index ? "var(--primary)" : "var(--neutral-500)",
                          backgroundColor: selectedAnswer === index ? "var(--primary)" : "transparent",
                        }}
                      >
                        {selectedAnswer === index && <span className="text-white text-xs">✓</span>}
                      </div>
                      <span style={{ color: "var(--text-primary)" }}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === undefined}
                className="w-full"
              >
                {isLastQuestion ? "Review Results" : "Next Question"}
              </Button>
            </CardContent>
          </Card>


          {/* Already Staked Notice */}
          {hasStaked && (
            <Card variant="glass">
              <CardContent className="pt-4">
                <p className="text-sm" style={{ color: "var(--success)" }}>
                  ✓ You've already staked in this challenge. Complete the lesson to see results!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Results Screen */
        <div className="space-y-4">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle
                className="text-2xl text-center"
                style={{ color: passed ? "var(--success)" : "var(--text-primary)" }}
              >
                {passed ? "You Passed! 🎉" : "Keep Learning! 📚"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-5xl font-bold" style={{ color: "var(--primary)" }}>
                {Math.round(score)}%
              </div>
              <p style={{ color: "var(--text-secondary)" }}>
                You answered {selectedAnswers.filter((ans, idx) => ans === lesson.questions[idx].correctAnswer).length}/
                {lesson.questions.length} questions correctly
              </p>

              {/* Stake CTA for active pools */}
              {isActive && !hasStaked && selectedChoice !== null && !isCreator && (
                <div className="space-y-3">
                  <div
                    className="rounded-lg p-4 border"
                    style={{
                      backgroundColor: "rgba(108, 99, 255, 0.1)",
                      borderColor: "var(--primary)",
                    }}
                  >
                    <p className="font-semibold" style={{ color: "var(--primary)" }}>
                      🎯 Ready to stake on your prediction?
                    </p>
                    <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                      Stake {lesson.minStake}-{lesson.maxStake} cUSD on Choice {selectedChoice + 1}
                    </p>
                    <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
                      If Choice {selectedChoice + 1} wins, you'll earn a share of the reward pool!
                    </p>
                  </div>
                  <Button 
                    variant="primary" 
                    size="md" 
                    onClick={handleStake} 
                    disabled={!isConnected || selectedChoice === null}
                    className="w-full"
                  >
                    Stake Now
                  </Button>
                </div>
              )}

              {/* Creator notice when viewing own pool */}
              {isCreator && (
                <div
                  className="rounded-lg p-3 border"
                  style={{
                    backgroundColor: "rgba(108, 99, 255, 0.06)",
                    borderColor: "var(--border)",
                  }}
                >
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    As the creator of this pool, you can preview the quiz and results, but you{" "}
                    <span className="font-semibold" style={{ color: "var(--primary)" }}>
                      cannot stake
                    </span>{" "}
                    on your own challenge.
                  </p>
                </div>
              )}

              {/* Reward Claim for resolved pools */}
              {isResolved && reward && reward > 0n && (
                <div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: "rgba(0, 210, 138, 0.1)",
                    borderColor: "var(--success)",
                    color: "var(--success)",
                  }}
                >
                  <p className="font-semibold">🎉 You won {formatCUSD(reward)} cUSD!</p>
                  <p className="text-sm mt-1">Claim your reward now</p>
                  <Button 
                    variant="primary" 
                    size="md" 
                    onClick={handleClaimReward}
                    isLoading={isClaiming}
                    className="w-full mt-3"
                  >
                    {claimSuccess ? "Claimed! ✓" : "Claim Reward"}
                  </Button>
                </div>
              )}

              {/* Already staked message */}
              {hasStaked && !isResolved && (
                <div
                  className="rounded-lg p-3 border"
                  style={{
                    backgroundColor: "rgba(0, 210, 138, 0.1)",
                    borderColor: "var(--success)",
                    color: "var(--success)",
                  }}
                >
                  <p className="font-semibold">✓ Your stake is placed!</p>
                  <p className="text-sm">Awaiting pool resolution...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Review Answers */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Review Your Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson.questions.map((question, idx) => {
                const correct = selectedAnswers[idx] === question.correctAnswer
                return (
                  <div
                    key={idx}
                    className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0"
                    style={{ borderBottomColor: "var(--border)" }}
                  >
                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                      Q{idx + 1}: {question.text}
                    </p>
                    <p className="text-sm" style={{ color: correct ? "var(--success)" : "var(--danger)" }}>
                      {correct ? "✓ Correct" : "✗ Incorrect"}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Your answer: {question.options[selectedAnswers[idx]]}
                    </p>
                    {!correct && (
                      <p className="text-sm" style={{ color: "var(--success)" }}>
                        Correct answer: {question.options[question.correctAnswer]}
                      </p>
                    )}
                    <p className="text-xs italic" style={{ color: "var(--text-tertiary)" }}>
                      {question.explanation}
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Button variant="primary" size="md" onClick={onBack} className="w-full">
            Back to Lessons
          </Button>
        </div>
      )}
    </div>
  )
}
