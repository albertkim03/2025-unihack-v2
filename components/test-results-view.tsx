// @ts-nocheck

"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowLeft, Download, Loader2 } from "lucide-react"
import Link from "next/link"

interface TestResultsViewProps {
  test: any
  testResult: any
}

export function TestResultsView({ test, testResult }: TestResultsViewProps) {
  const [feedbacks, setFeedbacks] = useState({})
  const [loadingFeedback, setLoadingFeedback] = useState({})

  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return "N/A"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} min ${remainingSeconds} sec`
  }

  // Calculate statistics
  const correctAnswers = testResult.answers.filter((answer: any) => answer.isCorrect).length
  const totalQuestions = test.questions.length
  const completionDate = new Date(testResult.completedAt).toLocaleDateString()

  // Group questions by topic for topic analysis (simplified)
  const topicPerformance = {
    "Topic 1": { correct: 2, total: 3 },
    "Topic 2": { correct: 3, total: 4 },
    "Topic 3": { correct: 1, total: 3 },
  }

  const handleGenerateFeedback = async (question: any) => {
    // Set loading state for the specific question
    setLoadingFeedback((prev) => ({ ...prev, [question.id]: true }))

    // Determine the correct answer string based on question type
    const questionText = question.text
    const correctAnswer =
      question.type === "multiple-choice"
        ? question.options[Number.parseInt(question.answer)] || question.answer
        : question.type === "true-false"
        ? question.answer === "0"
          ? "True"
          : "False"
        : question.answer

    try {
      const res = await fetch("/api/tests/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionText, correctAnswer })
      })

      const data = await res.json()
      if (data.feedback) {
        setFeedbacks((prev) => ({ ...prev, [question.id]: data.feedback }))
      } else {
        setFeedbacks((prev) => ({ ...prev, [question.id]: "Unable to generate feedback." }))
      }
    } catch (error) {
      console.error("Error generating feedback:", error)
      setFeedbacks((prev) => ({ ...prev, [question.id]: "Error generating feedback." }))
    } finally {
      setLoadingFeedback((prev) => ({ ...prev, [question.id]: false }))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{test.name} Results</h1>
          <p className="text-muted-foreground">Completed on {completionDate}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button asChild>
            <Link href="/myspace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Space
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle className="stroke-muted stroke-[8] fill-none" cx="50" cy="50" r="40" />
                  <circle
                    className="stroke-primary stroke-[8] fill-none"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * testResult.score) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{testResult.score.toFixed(0)}%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {correctAnswers} of {totalQuestions} questions correct
              </p>
              <p className="text-sm text-muted-foreground">Time spent: {formatTimeSpent(testResult.timeSpent)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Score</span>
              <Badge>{testResult.score.toFixed(0)}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Time Spent</span>
              <Badge variant="outline">{formatTimeSpent(testResult.timeSpent)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Questions</span>
              <Badge variant="outline">{totalQuestions}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Correct Answers</span>
              <Badge variant="outline">{correctAnswers}</Badge>
            </div>
            <Separator />
            <div className="text-center text-sm text-muted-foreground">
              {testResult.score >= 70 ? "Great job!" : "Keep practicing!"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>Review your answers and see explanations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {test.questions.map((question: any, index: number) => {
            // Find the user's answer for this question, if any
            const answer = testResult.answers.find((a: any) => a.questionId === question.id)
            const isAnswered = !!answer

            return (
              <div key={question.id} className="relative space-y-4 rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <p className="mt-1">{question.text}</p>
                  </div>
                  {isAnswered ? (
                    answer.isCorrect ? (
                      <Badge className="bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Correct
                      </Badge>
                    ) : question.type === "short-answer" ? (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        <XCircle className="mr-1 h-3 w-3" />
                        Manual Check
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="mr-1 h-3 w-3" />
                        Incorrect
                      </Badge>
                    )
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="mr-1 h-3 w-3" />
                      Unanswered
                    </Badge>
                  )}
                </div>

                <div className="grid gap-2 text-sm">
                  {isAnswered ? (
                    <>
                      <div className="flex items-start">
                        <span className="font-medium mr-2">Your answer:</span>
                        <span className={answer.isCorrect ? "text-green-600" : "text-red-600"}>
                          {question.type === "multiple-choice"
                            ? question.options[Number.parseInt(answer.text)] || answer.text
                            : question.type === "true-false"
                            ? answer.text === "0"
                              ? "True"
                              : "False"
                            : answer.text}
                        </span>
                      </div>
                      {!answer.isCorrect && (
                        <div className="flex items-start">
                          <span className="font-medium mr-2">Correct answer:</span>
                          <span className="text-green-600">
                            {question.type === "multiple-choice"
                              ? question.options[Number.parseInt(question.answer)] || question.answer
                              : question.type === "true-false"
                              ? question.answer === "0"
                                ? "True"
                                : "False"
                              : question.answer}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-start text-muted-foreground">
                        <span>You did not provide an answer for this question.</span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium mr-2">Correct answer:</span>
                        <span className="text-green-600">
                          {question.type === "multiple-choice"
                            ? question.options[Number.parseInt(question.answer)] || question.answer
                            : question.type === "true-false"
                            ? question.answer === "0"
                              ? "True"
                              : "False"
                            : question.answer}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {isAnswered && !answer.isCorrect && (
                  <>
                    {!feedbacks[question.id] && (
                      <div className="absolute bottom-2 right-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleGenerateFeedback(question)}
                          disabled={loadingFeedback[question.id]}
                        >
                          {loadingFeedback[question.id] ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "AI Feedback"
                          )}
                        </Button>
                      </div>
                    )}
                    {feedbacks[question.id] && (
                      <div className="mt-4 rounded-md border border-blue-300 bg-blue-50 p-4">
                        <p className="text-sm text-black-600">{feedbacks[question.id]}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
