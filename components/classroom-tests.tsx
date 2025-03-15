"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  FileText,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Mail,
} from "lucide-react"
import Link from "next/link"

interface ClassroomTestsProps {
  classroomId: string
}

export function ClassroomTests({ classroomId }: ClassroomTestsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewType, setViewType] = useState("list")
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  // Add state for edited scores and total score
  const [editedAnswers, setEditedAnswers] = useState<any[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [totalMaxScore, setTotalMaxScore] = useState(0)

  // Mock tests data
  const tests = [
    {
      id: "test-1",
      name: "Mechanics Quiz",
      subject: "Physics",
      createdAt: "Mar 14, 2025",
      dueDate: "Mar 21, 2025",
      status: "Active",
      questions: 15,
      completionRate: 33,
      averageScore: 82,
      timeLimit: "30 minutes",
    },
    {
      id: "test-2",
      name: "Thermodynamics Basics",
      subject: "Physics",
      createdAt: "Mar 5, 2025",
      dueDate: "Mar 12, 2025",
      status: "Completed",
      questions: 20,
      completionRate: 100,
      averageScore: 78,
      timeLimit: "45 minutes",
    },
    {
      id: "test-3",
      name: "Wave Properties",
      subject: "Physics",
      createdAt: "Feb 25, 2025",
      dueDate: "Mar 4, 2025",
      status: "Completed",
      questions: 12,
      completionRate: 100,
      averageScore: 85,
      timeLimit: "25 minutes",
    },
    {
      id: "test-4",
      name: "Electricity & Magnetism",
      subject: "Physics",
      createdAt: "Feb 15, 2025",
      dueDate: "Feb 22, 2025",
      status: "Completed",
      questions: 18,
      completionRate: 100,
      averageScore: 76,
      timeLimit: "40 minutes",
    },
    {
      id: "test-5",
      name: "Quantum Mechanics",
      subject: "Physics",
      createdAt: "Mar 18, 2025",
      dueDate: "Mar 25, 2025",
      status: "Scheduled",
      questions: 15,
      completionRate: 0,
      averageScore: 0,
      timeLimit: "35 minutes",
    },
  ]

  // Mock student completions data
  const studentCompletions = [
    {
      id: "user-1",
      name: "Emma Miller",
      avatar: "/placeholder.svg?height=40&width=40&text=EM",
      status: "Completed",
      completedAt: "Mar 15, 2025",
      score: 95,
      timeSpent: "22 minutes",
    },
    {
      id: "user-2",
      name: "James Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=JC",
      status: "Completed",
      completedAt: "Mar 16, 2025",
      score: 88,
      timeSpent: "25 minutes",
    },
    {
      id: "user-3",
      name: "Sophia Patel",
      avatar: "/placeholder.svg?height=40&width=40&text=SP",
      status: "Completed",
      completedAt: "Mar 15, 2025",
      score: 92,
      timeSpent: "18 minutes",
    },
    {
      id: "user-4",
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      status: "In Progress",
      completedAt: "",
      score: null,
      timeSpent: "",
    },
    {
      id: "user-5",
      name: "Olivia Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=OR",
      status: "Not Started",
      completedAt: "",
      score: null,
      timeSpent: "",
    },
    {
      id: "user-6",
      name: "William Taylor",
      avatar: "/placeholder.svg?height=40&width=40&text=WT",
      status: "Not Started",
      completedAt: "",
      score: null,
      timeSpent: "",
    },
  ]

  // Mock student answers data
  const studentAnswers = [
    {
      id: 1,
      question: "What is Newton's First Law of Motion?",
      correctAnswer:
        "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
      studentAnswer:
        "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.",
      isCorrect: true,
      score: 10,
      maxScore: 10,
      aiGenerated: true,
    },
    {
      id: 2,
      question: "A 2 kg object moving at 5 m/s has a momentum of:",
      correctAnswer: "10 kg·m/s",
      studentAnswer: "10 kg·m/s",
      isCorrect: true,
      score: 5,
      maxScore: 5,
      aiGenerated: true,
    },
    {
      id: 3,
      question: "The SI unit of force is:",
      correctAnswer: "Newton (N)",
      studentAnswer: "Newton (N)",
      isCorrect: true,
      score: 5,
      maxScore: 5,
      aiGenerated: true,
    },
    {
      id: 4,
      question: "An object accelerates at 10 m/s² when a force of 5 N is applied. What is the mass of the object?",
      correctAnswer: "0.5 kg",
      studentAnswer: "0.5 kg",
      isCorrect: true,
      score: 10,
      maxScore: 10,
      aiGenerated: true,
    },
    {
      id: 5,
      question: "The principle of conservation of momentum applies when:",
      correctAnswer: "No external forces act on the system",
      studentAnswer: "When two objects collide",
      isCorrect: false,
      score: 3,
      maxScore: 10,
      aiGenerated: true,
    },
  ]

  // Filter tests based on search query
  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.status.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleViewTestResults = (test: any) => {
    setSelectedTest(test)
    setSelectedStudent(null)
  }

  // Add a function to handle score changes
  const handleScoreChange = (answerId: number, newScore: number) => {
    const updatedAnswers = editedAnswers.map((answer) =>
      answer.id === answerId ? { ...answer, score: newScore } : answer,
    )

    setEditedAnswers(updatedAnswers)
    setHasUnsavedChanges(true)

    // Update total score
    const newTotalScore = updatedAnswers.reduce((sum, answer) => sum + answer.score, 0)
    setTotalScore(newTotalScore)
  }

  // Add a function to save score changes
  const handleSaveScores = () => {
    // In a real app, this would send the updated scores to the backend
    console.log("Saving updated scores:", editedAnswers)

    // Update the studentAnswers with the new scores
    // This is just for demo purposes - in a real app, you'd update the database
    setHasUnsavedChanges(false)

    // Show a success message or toast notification
    alert("Scores saved successfully")
  }

  // Update the handleViewStudentAnswers function to initialize edited answers
  const handleViewStudentAnswers = (student: any) => {
    setSelectedStudent(student)
    setEditedAnswers([...studentAnswers])

    // Calculate total score and max score
    const total = studentAnswers.reduce((sum, answer) => sum + answer.score, 0)
    const maxTotal = studentAnswers.reduce((sum, answer) => sum + answer.maxScore, 0)

    setTotalScore(total)
    setTotalMaxScore(maxTotal)
  }

  const handleBackToTestResults = () => {
    setSelectedStudent(null)
  }

  const handleCloseResults = () => {
    setSelectedTest(null)
    setSelectedStudent(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/create-test?classroom=${classroomId}`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button
              variant={viewType === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewType("list")}
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewType("grid")}
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          {viewType === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.name}</TableCell>
                        <TableCell>{test.createdAt}</TableCell>
                        <TableCell>{test.dueDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              test.status === "Active"
                                ? "default"
                                : test.status === "Completed"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {test.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={test.completionRate} className="h-2 w-20" />
                            <span className="text-xs">{test.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{test.averageScore > 0 ? `${test.averageScore}%` : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleViewTestResults(test)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Results</span>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/edit-test/${test.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Export Results
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Test
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTests.map((test) => (
                <Card key={test.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <Badge
                        variant={
                          test.status === "Active" ? "default" : test.status === "Completed" ? "outline" : "secondary"
                        }
                      >
                        {test.status}
                      </Badge>
                    </div>
                    <CardDescription>{test.subject}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {test.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{test.timeLimit}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Completion</span>
                          <span>{test.completionRate}%</span>
                        </div>
                        <Progress value={test.completionRate} className="h-2" />
                      </div>

                      {test.status !== "Scheduled" && (
                        <div className="flex items-center justify-between text-sm">
                          <span>Average Score</span>
                          <span className="font-medium">{test.averageScore > 0 ? `${test.averageScore}%` : "N/A"}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleViewTestResults(test)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Results
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/edit-test/${test.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export Results
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Test
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {/* Similar structure to "active" tab but filtered for completed tests */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests
              .filter((test) => test.status === "Completed")
              .map((test) => (
                <Card key={test.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                    <CardDescription>{test.subject}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Due: {test.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{test.timeLimit}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Completion</span>
                          <span>{test.completionRate}%</span>
                        </div>
                        <Progress value={test.completionRate} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Average Score</span>
                        <span className="font-medium">{test.averageScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleViewTestResults(test)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Results
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Test Results Dialog */}
      <Dialog open={selectedTest !== null} onOpenChange={(open) => !open && handleCloseResults()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? (
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" className="mr-2 -ml-2" onClick={handleBackToTestResults}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  {selectedStudent.name}'s Answers
                </div>
              ) : (
                <>Test Results: {selectedTest?.name}</>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedStudent ? (
                <>
                  Completed on {selectedStudent.completedAt} • Score: {selectedStudent.score}%
                </>
              ) : (
                <>
                  {selectedTest?.status} • Due: {selectedTest?.dueDate} • Average Score: {selectedTest?.averageScore}%
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent ? (
            // Student's individual answers with editable scores
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Total Score: {totalScore}/{totalMaxScore} ({Math.round((totalScore / totalMaxScore) * 100)}%)
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
                {hasUnsavedChanges && (
                  <Button onClick={handleSaveScores} size="sm">
                    Save Scores
                  </Button>
                )}
              </div>

              {editedAnswers.map((answer) => (
                <div key={answer.id} className="space-y-3 border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">Question {answer.id}</h3>
                    <div className="flex items-center gap-2">
                      {answer.isCorrect ? (
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
                      {answer.aiGenerated && (
                        <Badge variant="outline" className="text-xs">
                          AI Graded
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm">{answer.question}</p>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Student's Answer:</span>
                      <p className={answer.isCorrect ? "text-green-600" : "text-red-600"}>{answer.studentAnswer}</p>
                    </div>
                    {!answer.isCorrect && (
                      <div>
                        <span className="font-medium">Correct Answer:</span>
                        <p className="text-green-600">{answer.correctAnswer}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t mt-2">
                    <span className="font-medium text-sm">Score:</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={answer.maxScore}
                        value={answer.score}
                        onChange={(e) => handleScoreChange(answer.id, Number.parseInt(e.target.value) || 0)}
                        className="w-16 h-8 text-right"
                      />
                      <span className="text-sm text-muted-foreground">/ {answer.maxScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // List of students and their results - keep this part unchanged
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentCompletions.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <button
                              className="font-medium hover:underline focus:outline-none"
                              onClick={() => student.status === "Completed" && handleViewStudentAnswers(student)}
                            >
                              {student.name}
                            </button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "Completed"
                              ? "default"
                              : student.status === "In Progress"
                                ? "outline"
                                : "secondary"
                          }
                          className="capitalize"
                        >
                          {student.status === "Completed" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : student.status === "In Progress" ? (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.completedAt || "—"}</TableCell>
                      <TableCell>{student.score !== null ? `${student.score}%` : "—"}</TableCell>
                      <TableCell>{student.timeSpent || "—"}</TableCell>
                      <TableCell className="text-right">
                        {student.status === "Completed" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleViewStudentAnswers(student)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Answers
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Reminder
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseResults}>
              Close
            </Button>
            {selectedStudent && hasUnsavedChanges && <Button onClick={handleSaveScores}>Save Scores</Button>}
            {!selectedStudent && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

