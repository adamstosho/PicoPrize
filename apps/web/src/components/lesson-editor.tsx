"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import { Badge } from "@/components/badge"
import { Slider } from "@/components/slider"
import { saveLessonMetadata, type LessonMetadata } from "@/lib/lesson-data"

interface LessonEditorProps {
  onSave?: (lesson: {
    title: string
    description: string
    metadataUri: string
    choicesCount: number
    deadline: number
    minStake: number
    maxStake: number
    creatorSeed: number
    creatorFeeBps: number
  }) => void
  onCancel?: () => void
  initialData?: any
  nextPoolId?: number
  isSubmitting?: boolean
}

type QuestionInput = LessonMetadata["questions"][number]

const createBlankQuestion = (choiceCount: number, index: number = 0): QuestionInput => ({
  id: `q-${Date.now()}-${index}`,
  text: "",
  options: Array.from({ length: choiceCount }, () => ""),
  correctAnswer: 0,
  explanation: "",
})

export function LessonEditor({ onSave, onCancel, initialData, nextPoolId, isSubmitting = false }: LessonEditorProps) {
  // Lesson content
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "beginner")
  const [duration, setDuration] = useState(initialData?.duration || 60)
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "")
  
  // Pool parameters
  const [choicesCount, setChoicesCount] = useState(4) // Default 4 choices (A, B, C, D)
  const [deadlineHours, setDeadlineHours] = useState(24) // Hours from now
  const [minStake, setMinStake] = useState(0.05)
  const [maxStake, setMaxStake] = useState(0.5)
  const [creatorSeed, setCreatorSeed] = useState(0) // Optional seed amount
  const [creatorFeeBps, setCreatorFeeBps] = useState(100) // 1% creator fee

  const [isSaving, setIsSaving] = useState(false)
  const [questions, setQuestions] = useState<QuestionInput[]>(
    initialData?.questions && Array.isArray(initialData.questions) && initialData.questions.length > 0
      ? initialData.questions
      : [createBlankQuestion(choicesCount)]
  )

  useEffect(() => {
    setQuestions((prev) =>
      prev.map((question) => {
        let options = [...question.options]
        if (options.length < choicesCount) {
          options = options.concat(Array.from({ length: choicesCount - options.length }, () => ""))
        } else if (options.length > choicesCount) {
          options = options.slice(0, choicesCount)
        }
        const correctedAnswer = Math.min(question.correctAnswer, choicesCount - 1)
        return { ...question, options, correctAnswer: correctedAnswer }
      })
    )
  }, [choicesCount])

  const handleQuestionChange = (index: number, field: keyof QuestionInput, value: string | number) => {
    setQuestions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev]
      const options = [...updated[questionIndex].options]
      options[optionIndex] = value
      updated[questionIndex] = { ...updated[questionIndex], options }
      return updated
    })
  }

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createBlankQuestion(choicesCount, prev.length)])
  }

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default form submission behavior
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!title || !description) {
      alert("Please fill in the title and description")
      return
    }

    for (const [index, question] of questions.entries()) {
      if (!question.text.trim()) {
        alert(`Question ${index + 1} is missing text`)
        return
      }
      if (question.options.some((option) => !option.trim())) {
        alert(`Please fill in all options for Question ${index + 1}`)
        return
      }
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        alert(`Please select a correct answer for Question ${index + 1}`)
        return
      }
    }
    
    if (isSubmitting || isSaving) {
      return
    }
    
    setIsSaving(true)

    const normalizedTags = tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean)

    const lessonMetadata: LessonMetadata = {
      title,
      description,
      author: "Custom Creator",
      duration: Number(duration) * 60,
      difficulty,
      tags: normalizedTags,
      image: "/custom-lesson.png",
      language: "en",
      questions: questions.map((question, index) => ({
        ...question,
        id: question.id || `q-${index + 1}`,
      })),
    }
    
    try {
      // Generate a deterministic ID for this lesson (based on poolId when available)
      const baseId = nextPoolId ? `lesson-${nextPoolId}` : `lesson-${Date.now()}`

      // Persist metadata to shared backend so all users see the same content
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: baseId,
          metadata: lessonMetadata,
          aliases: nextPoolId ? [nextPoolId.toString()] : [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save lesson content. Please try again.")
      }

      const { id: storedId } = (await response.json()) as { id: string }
      const metadataUri = storedId || baseId

      // Keep local cache in browser as fast fallback
      saveLessonMetadata(metadataUri, lessonMetadata, nextPoolId ? nextPoolId.toString() : undefined)

      const lessonData = {
        title,
        description,
        metadataUri,
        choicesCount,
        deadline: deadlineHours,
        minStake,
        maxStake,
        creatorSeed,
        creatorFeeBps,
      }

      if (!onSave) {
        return
      }
      
      await onSave(lessonData)
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      // Always clear local saving state so the button doesn't get stuck
      setIsSaving(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    handleSave()
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create Pool</h2>
          {nextPoolId && (
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Pool ID: #{nextPoolId}
            </p>
          )}
        </div>
        <Badge variant="accent">New Pool</Badge>
      </div>

      {/* Lesson Details */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Lesson Details</CardTitle>
          <CardDescription>Add your lesson information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Lesson Title"
            placeholder="Enter an engaging title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className="label" style={{ color: "var(--text-secondary)" }}>
              Description
            </label>
            <textarea
              placeholder="Describe your lesson content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-24 rounded-md px-4 py-2 focus:outline-none focus:ring-3 resize-none"
              style={{
                backgroundColor: "var(--surface-01)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
                borderWidth: "1px",
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" style={{ color: "var(--text-secondary)" }}>
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full h-11 rounded-md px-4 py-2 focus:outline-none focus:ring-3"
                style={{
                  backgroundColor: "var(--surface-01)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                  borderWidth: "1px",
                }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <Input
              label="Duration (minutes)"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(Number.parseInt(e.target.value))}
            />
          </div>

          <Input
            label="Tags"
            placeholder="e.g., blockchain, crypto, defi (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Pool Configuration */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Pool Configuration</CardTitle>
          <CardDescription>Set up your challenge pool parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Number of Choices */}
          <div>
            <label className="label" style={{ color: "var(--text-secondary)" }}>
              Number of Answer Choices
            </label>
            <div className="flex gap-2 mt-2">
              {[2, 3, 4, 5, 6].map((num) => {
                const isSelected = choicesCount === num
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setChoicesCount(num)}
                    className="w-12 h-12 rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: isSelected ? "#6C63FF" : "var(--surface-01)",
                      color: isSelected ? "#FFFFFF" : "var(--text-secondary)",
                      border: `2px solid ${isSelected ? "#6C63FF" : "var(--border)"}`,
                      boxShadow: isSelected ? "0 0 0 3px rgba(108, 99, 255, 0.2)" : "none",
                      fontWeight: isSelected ? "700" : "500",
                    }}
                  >
                    {num}
                  </button>
                )
              })}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
              How many answer options will participants choose from?
            </p>
          </div>

          {/* Deadline */}
          <div>
            <Slider
              label="Pool Duration (hours from now)"
              min={2}
              max={168}
              step="1"
              value={deadlineHours}
              onChange={(e) => setDeadlineHours(Number(e.target.value))}
              formatValue={(val) => `${val} hours`}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              Pool closes: {new Date(Date.now() + deadlineHours * 60 * 60 * 1000).toLocaleString()}
            </p>
          </div>

          {/* Stake Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Slider
                label="Minimum Stake (cUSD)"
                min={0.01}
                max={1}
                step="0.01"
                value={minStake}
                onChange={(e) => setMinStake(Number(e.target.value))}
                formatValue={(val) => `${val.toFixed(2)} cUSD`}
              />
            </div>
            <div>
              <Slider
                label="Maximum Stake (cUSD)"
                min={minStake}
                max={10}
                step="0.1"
                value={maxStake}
                onChange={(e) => setMaxStake(Number(e.target.value))}
                formatValue={(val) => `${val.toFixed(2)} cUSD`}
              />
            </div>
          </div>

          {/* Creator Fee */}
          <div>
            <Slider
              label="Creator Fee (%)"
              min={0}
              max={500}
              step="10"
              value={creatorFeeBps}
              onChange={(e) => setCreatorFeeBps(Number(e.target.value))}
              formatValue={(val) => `${(val / 100).toFixed(1)}%`}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              Your fee from the total pool (max 5%, platform takes 2%)
            </p>
          </div>

          {/* Creator Seed (Optional) */}
          <div>
            <Slider
              label="Initial Seed Amount (cUSD) - Optional"
              min={0}
              max={10}
              step="0.1"
              value={creatorSeed}
              onChange={(e) => setCreatorSeed(Number(e.target.value))}
              formatValue={(val) => val > 0 ? `${val.toFixed(2)} cUSD` : "No seed"}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
              Seed the pool with your own cUSD to attract more participants
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="text-lg">Lesson Questions</CardTitle>
          <CardDescription>Define the questions learners must answer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, questionIndex) => (
            <div
              key={question.id}
              className="space-y-3 p-4 rounded-xl border"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-01)" }}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Question {questionIndex + 1}</h4>
                {questions.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeQuestion(questionIndex)}>
                    Remove
                  </Button>
                )}
              </div>

              <Input
                label="Question Text"
                placeholder="Enter your question"
                value={question.text}
                onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.options.map((option, optionIndex) => (
                  <Input
                    key={`${question.id}-option-${optionIndex}`}
                    label={`Option ${optionIndex + 1}`}
                    placeholder={`Enter option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="label" style={{ color: "var(--text-secondary)" }}>
                    Correct Answer
                  </label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(questionIndex, "correctAnswer", Number(e.target.value))}
                    className="w-full h-11 rounded-md px-4 py-2 focus:outline-none focus:ring-3"
                    style={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                      borderWidth: "1px",
                    }}
                  >
                    {question.options.map((_, optionIndex) => (
                      <option key={optionIndex} value={optionIndex}>
                        Option {optionIndex + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Explanation (optional)"
                  placeholder="Explain why the answer is correct"
                  value={question.explanation}
                  onChange={(e) => handleQuestionChange(questionIndex, "explanation", e.target.value)}
                />
              </div>
            </div>
          ))}

          <Button type="button" variant="secondary" size="sm" onClick={addQuestion}>
            + Add Another Question
          </Button>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card variant="glass">
        <CardContent className="py-4">
          <h4 className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
            Pool Summary
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div style={{ color: "var(--text-secondary)" }}>Questions:</div>
            <div className="font-mono">{questions.length}</div>
            <div style={{ color: "var(--text-secondary)" }}>Choices:</div>
            <div className="font-mono">{choicesCount}</div>
            <div style={{ color: "var(--text-secondary)" }}>Stake Range:</div>
            <div className="font-mono">{minStake.toFixed(2)} - {maxStake.toFixed(2)} cUSD</div>
            <div style={{ color: "var(--text-secondary)" }}>Your Fee:</div>
            <div className="font-mono">{(creatorFeeBps / 100).toFixed(1)}%</div>
            <div style={{ color: "var(--text-secondary)" }}>Initial Seed:</div>
            <div className="font-mono">{creatorSeed > 0 ? `${creatorSeed.toFixed(2)} cUSD` : "None"}</div>
            <div style={{ color: "var(--text-secondary)" }}>Closes:</div>
            <div className="font-mono">{deadlineHours}h from now</div>
          </div>
          
          {creatorSeed > 0 && (
            <div 
              className="mt-3 p-2 rounded text-xs"
              style={{ backgroundColor: "rgba(255, 193, 7, 0.1)", color: "var(--warning)" }}
            >
              ⚠️ You will need to approve {creatorSeed.toFixed(2)} cUSD for the seed amount
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          type="button"
          variant="ghost" 
          size="md" 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onCancel?.()
          }} 
          className="flex-1"
          disabled={isSaving || isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          onClick={(e) => {
            // Don't prevent default here - let form handle it
          }}
          isLoading={isSaving || isSubmitting}
          disabled={!title || !description || isSaving || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Processing..." : isSaving ? "Saving..." : "Create Pool"}
        </Button>
      </div>
    </form>
  )
}
