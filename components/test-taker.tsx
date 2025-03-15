// @ts-nocheck
"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Clock, ChevronLeft, ChevronRight, Save, CheckCircle, AlertTriangle } from "lucide-react"
import { startTestAttempt, saveAnswer, submitTest } from "@/app/actions/test-attempt"

interface TestTakerProps {
    test: any
    existingAttempt: any
    userId: string
}

export function TestTaker({ test, existingAttempt, userId }: TestTakerProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [timeRemaining, setTimeRemaining] = useState(test.timeLimit * 60) // in seconds
    const [attemptId, setAttemptId] = useState<string | null>(existingAttempt?.id || null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Initialize answers from existing attempt if available
    useEffect(() => {
        if (existingAttempt) {
            const savedAnswers: Record<string, string> = {}
            existingAttempt.answers.forEach((answer: any) => {
                savedAnswers[answer.questionId] = answer.text
            })
            setAnswers(savedAnswers)

            // Calculate remaining time if the attempt is not completed
            if (!existingAttempt.completedAt) {
                const elapsedSeconds = Math.floor((Date.now() - new Date(existingAttempt.startedAt).getTime()) / 1000)
                const remainingSeconds = Math.max(0, test.timeLimit * 60 - elapsedSeconds)
                setTimeRemaining(remainingSeconds)
            } else {
                // If the test is already completed, redirect to results
                router.push(`/test-results/${test.id}`)
            }
        }
    }, [existingAttempt, test.timeLimit, router, test.id])

    // Start a new attempt if none exists
    useEffect(() => {
        const initializeAttempt = async () => {
            if (!attemptId) {
                try {
                    const result = await startTestAttempt(test.id, userId)
                    if (result.success) {
                        setAttemptId(result.attemptId)
                        toast({
                            title: "Test started",
                            description: "Your progress will be saved automatically.",
                        })
                    } else {
                        toast({
                            title: "Error",
                            description: result.message || "Failed to start test",
                            variant: "destructive",
                        })
                    }
                } catch (error) {
                    console.error("Failed to start test attempt:", error)
                    toast({
                        title: "Error",
                        description: "Failed to start test. Please try again.",
                        variant: "destructive",
                    })
                }
            }
        }

        initializeAttempt()
    }, [attemptId, test.id, userId, toast])

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0) {
            handleSubmitTest(true)
            return
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeRemaining])

    // Format time remaining as MM:SS
    const formatTimeRemaining = () => {
        const minutes = Math.floor(timeRemaining / 60)
        const seconds = timeRemaining % 60
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    // Auto-save answers
    useEffect(() => {
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current)
        }

        if (attemptId && Object.keys(answers).length > 0) {
            autoSaveTimeoutRef.current = setTimeout(async () => {
                setAutoSaveStatus("saving")
                try {
                    await Promise.all(
                        Object.entries(answers).map(([questionId, answer]) => saveAnswer(attemptId!, questionId, answer)),
                    )
                    setAutoSaveStatus("saved")
                    setTimeout(() => setAutoSaveStatus("idle"), 2000)
                } catch (error) {
                    console.error("Auto-save failed:", error)
                    setAutoSaveStatus("error")
                }
            }, 3000) // Auto-save after 3 seconds of inactivity
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current)
            }
        }
    }, [answers, attemptId])

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }))
        setAutoSaveStatus("idle")
    }

    const goToNextQuestion = () => {
        if (currentQuestion < test.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        }
    }

    const goToPreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1)
        }
    }

    const handleSubmitTest = async (isAutoSubmit = false) => {
        if (!attemptId) return

        setIsSubmitting(true)

        try {
            // Save any unsaved answers first
            await Promise.all(
                Object.entries(answers).map(([questionId, answer]) => saveAnswer(attemptId!, questionId, answer)),
            )

            // Submit the test
            const result = await submitTest(attemptId, test.timeLimit * 60 - timeRemaining)

            if (result.success) {
                toast({
                    title: isAutoSubmit ? "Time's up!" : "Test submitted",
                    description: "Your test has been submitted successfully.",
                })
                router.push(`/test-results/${test.id}`)
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to submit test",
                    variant: "destructive",
                })
                setIsSubmitting(false)
            }
        } catch (error) {
            console.error("Failed to submit test:", error)
            toast({
                title: "Error",
                description: "Failed to submit test. Please try again.",
                variant: "destructive",
            })
            setIsSubmitting(false)
        }
    }

    const currentQuestionData = test.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / test.questions.length) * 100
    const answeredQuestions = Object.keys(answers).length

    // Render the appropriate question input based on question type
    const renderQuestionInput = () => {
        if (!currentQuestionData) return null

        switch (currentQuestionData.type) {
            case "multiple-choice":
                return (
                    <RadioGroup
                        value={answers[currentQuestionData.id] || ""}
                        onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                        className="space-y-3"
                    >
                        {currentQuestionData.options.map((option: string, index: number) => (
                            <div
                                key={index}
                                className={`flex items-center space-x-2 rounded-md border p-4 transition-colors ${
                                    answers[currentQuestionData.id] === index.toString() ? "border-primary bg-primary/5" : ""
                                }`}
                            >
                                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                )

            case "true-false":
                return (
                    <RadioGroup
                        value={answers[currentQuestionData.id] || ""}
                        onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                        className="space-y-3"
                    >
                        <div
                            className={`flex items-center space-x-2 rounded-md border p-4 transition-colors ${
                                answers[currentQuestionData.id] === "0" ? "border-primary bg-primary/5" : ""
                            }`}
                        >
                            <RadioGroupItem value="0" id="option-true" />
                            <Label htmlFor="option-true" className="flex-1 cursor-pointer">
                                True
                            </Label>
                        </div>
                        <div
                            className={`flex items-center space-x-2 rounded-md border p-4 transition-colors ${
                                answers[currentQuestionData.id] === "1" ? "border-primary bg-primary/5" : ""
                            }`}
                        >
                            <RadioGroupItem value="1" id="option-false" />
                            <Label htmlFor="option-false" className="flex-1 cursor-pointer">
                                False
                            </Label>
                        </div>
                    </RadioGroup>
                )

            case "short-answer":
                return (
                    <Textarea
                        placeholder="Type your answer here..."
                        value={answers[currentQuestionData.id] || ""}
                        onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                        className="min-h-[150px]"
                    />
                )

            default:
                return <p>Unsupported question type</p>
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
                {test.classroom && <p className="text-muted-foreground">Classroom: {test.classroom.name}</p>}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-3/4">
                    <Card className="mb-6">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        Question {currentQuestion + 1} of {test.questions.length}
                                    </CardTitle>
                                    <CardDescription>Select the best answer</CardDescription>
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <span className={timeRemaining < 300 ? "text-red-500 font-bold" : ""}>
                    {formatTimeRemaining()} remaining
                  </span>
                                </div>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="text-lg font-medium">{currentQuestionData?.text}</div>
                                {renderQuestionInput()}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestion === 0}>
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Previous
                                </Button>

                                {autoSaveStatus === "saving" && <span className="text-xs text-muted-foreground">Saving...</span>}
                                {autoSaveStatus === "saved" && <span className="text-xs text-green-500">Saved</span>}
                                {autoSaveStatus === "error" && <span className="text-xs text-red-500">Save failed</span>}
                            </div>

                            {currentQuestion < test.questions.length - 1 ? (
                                <Button onClick={goToNextQuestion}>
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handleSubmitTest()}
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {isSubmitting ? (
                                        <>Submitting...</>
                                    ) : (
                                        <>
                                            Submit Test
                                            <CheckCircle className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {timeRemaining < 300 && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center mb-6">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700">
                                <strong>Warning:</strong> Less than 5 minutes remaining. Your test will be automatically submitted when
                                time expires.
                            </p>
                        </div>
                    )}
                </div>

                <div className="lg:w-1/4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Navigator</CardTitle>
                            <CardDescription>
                                {answeredQuestions} of {test.questions.length} questions answered
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                                {test.questions.map((_, index: number) => (
                                    <Button
                                        key={index}
                                        variant={answers[test.questions[index].id] ? "default" : "outline"}
                                        className={`h-10 w-10 p-0 ${currentQuestion === index ? "ring-2 ring-primary" : ""}`}
                                        onClick={() => setCurrentQuestion(index)}
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <div className="mr-2 h-3 w-3 rounded-full bg-primary"></div>
                                        <span>Answered</span>
                                    </div>
                                    <span>{answeredQuestions}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <div className="mr-2 h-3 w-3 rounded-full border border-muted-foreground"></div>
                                        <span>Unanswered</span>
                                    </div>
                                    <span>{test.questions.length - answeredQuestions}</span>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <Button className="w-full" variant="outline" onClick={() => handleSubmitTest()}>
                                <Save className="mr-2 h-4 w-4" />
                                Submit Test
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

