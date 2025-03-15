// @ts-nocheck
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Clock, ChevronLeft, ChevronRight, Save, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TakeTestPage({ params }) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState("45:00")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock test data
  const test = {
    id: params.id,
    name: "Physics: Quantum Mechanics",
    subject: "Physics",
    assignedBy: "Prof. Richard Feynman",
    totalQuestions: 10,
    timeLimit: "45 minutes",
    questions: [
      {
        id: 1,
        text: "Which of the following is a fundamental principle of quantum mechanics?",
        options: [
          { id: "a", text: "Heisenberg's Uncertainty Principle" },
          { id: "b", text: "Newton's Third Law" },
          { id: "c", text: "Boyle's Law" },
          { id: "d", text: "Ohm's Law" },
        ],
      },
      {
        id: 2,
        text: "What is the mathematical description of the wave function in quantum mechanics?",
        options: [
          { id: "a", text: "Schrödinger equation" },
          { id: "b", text: "Maxwell's equations" },
          { id: "c", text: "Einstein's field equations" },
          { id: "d", text: "Navier-Stokes equations" },
        ],
      },
      {
        id: 3,
        text: "Which particle is described as having both wave-like and particle-like properties?",
        options: [
          { id: "a", text: "Electron" },
          { id: "b", text: "Proton" },
          { id: "c", text: "Neutron" },
          { id: "d", text: "All of the above" },
        ],
      },
      // More questions would be here
    ],
  }

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestion < test.totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitTest = () => {
    setIsSubmitting(true)

    // Simulate submission delay
    setTimeout(() => {
      router.push(`/test-results/${params.id}`)
    }, 1500)
  }

  const currentQuestionData = test.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / test.totalQuestions) * 100
  const answeredQuestions = Object.keys(answers).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
        <p className="text-muted-foreground">Assigned by {test.assignedBy}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Question {currentQuestion + 1} of {test.totalQuestions}
                  </CardTitle>
                  <CardDescription>Select the best answer</CardDescription>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{timeRemaining} remaining</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-lg font-medium">{currentQuestionData.text}</div>

                <RadioGroup
                  value={answers[currentQuestion] || ""}
                  onValueChange={handleAnswerChange}
                  className="space-y-3"
                >
                  {currentQuestionData.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-2 rounded-md border p-4 transition-colors ${
                        answers[currentQuestion] === option.id ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                      <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={goToPreviousQuestion} disabled={currentQuestion === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentQuestion < test.totalQuestions - 1 ? (
                <Button onClick={goToNextQuestion}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmitTest} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
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
        </div>

        <div className="lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Question Navigator</CardTitle>
              <CardDescription>
                {answeredQuestions} of {test.totalQuestions} questions answered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: test.totalQuestions }).map((_, index) => (
                  <Button
                    key={index}
                    variant={answers[index] ? "default" : "outline"}
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
                  <span>{test.totalQuestions - answeredQuestions}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <Button className="w-full" variant="outline" onClick={() => {}}>
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

