// @ts-nocheck
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowLeft, Download, Share } from "lucide-react"
import Link from "next/link"

export default function TestResultsPage({ params }) {
  // Mock test result data
  const testResult = {
    id: params.id,
    name: "Physics: Quantum Mechanics",
    subject: "Physics",
    assignedBy: "Prof. Richard Feynman",
    classroom: "Advanced Physics",
    dateCompleted: "Mar 15, 2025",
    score: 85,
    totalQuestions: 10,
    correctAnswers: 8.5,
    timeSpent: "32 minutes",
    questions: [
      {
        id: 1,
        text: "Which of the following is a fundamental principle of quantum mechanics?",
        userAnswer: "Heisenberg's Uncertainty Principle",
        correctAnswer: "Heisenberg's Uncertainty Principle",
        isCorrect: true,
        explanation:
          "Heisenberg's Uncertainty Principle states that we cannot simultaneously know the exact position and momentum of a particle.",
      },
      {
        id: 2,
        text: "What is the mathematical description of the wave function in quantum mechanics?",
        userAnswer: "Maxwell's equations",
        correctAnswer: "Schrödinger equation",
        isCorrect: false,
        explanation:
          "The Schrödinger equation is a linear partial differential equation that describes how the quantum state of a physical system changes with time.",
      },
      {
        id: 3,
        text: "Which particle is described as having both wave-like and particle-like properties?",
        userAnswer: "All of the above",
        correctAnswer: "All of the above",
        isCorrect: true,
        explanation:
          "Wave-particle duality is a concept in quantum mechanics that all particles exhibit both wave and particle properties.",
      },
      // More questions would be here
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{testResult.name} Results</h1>
          <p className="text-muted-foreground">Completed on {testResult.dateCompleted}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button asChild>
            <Link href="/myspace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Space
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
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
                  <span className="text-3xl font-bold">{testResult.score}%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {testResult.correctAnswers} of {testResult.totalQuestions} questions correct
              </p>
              <p className="text-sm text-muted-foreground">Time spent: {testResult.timeSpent}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Performance by Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Wave Mechanics</span>
                <span>90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Quantum States</span>
                <span>75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Particle Physics</span>
                <span>100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Quantum Entanglement</span>
                <span>60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Class Comparison</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Your Score</span>
              <Badge>{testResult.score}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Class Average</span>
              <Badge variant="outline">78%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Highest Score</span>
              <Badge variant="outline">95%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Lowest Score</span>
              <Badge variant="outline">62%</Badge>
            </div>
            <Separator />
            <div className="text-center text-sm text-muted-foreground">You scored higher than 68% of your class</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>Review your answers and see explanations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {testResult.questions.map((question) => (
            <div key={question.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Question {question.id}</h3>
                  <p className="mt-1">{question.text}</p>
                </div>
                {question.isCorrect ? (
                  <Badge className="bg-green-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Correct
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-3 w-3" />
                    Incorrect
                  </Badge>
                )}
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex items-start">
                  <span className="font-medium mr-2">Your answer:</span>
                  <span className={question.isCorrect ? "text-green-600" : "text-red-600"}>{question.userAnswer}</span>
                </div>
                {!question.isCorrect && (
                  <div className="flex items-start">
                    <span className="font-medium mr-2">Correct answer:</span>
                    <span className="text-green-600">{question.correctAnswer}</span>
                  </div>
                )}
              </div>

              <div className="rounded-md bg-muted p-3 text-sm">
                <span className="font-medium">Explanation: </span>
                {question.explanation}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

