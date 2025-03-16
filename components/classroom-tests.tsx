"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

// --- 1) Import all your UI components from /components/ui ---
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- 2) Import icons from lucide-react (or your icon set) ---
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Search,
  Trash2,
  XCircle
} from "lucide-react"

// --- 3) Optional: import your toast hooks/components ---
import { useToast } from "@/components/ui/use-toast"

// --------------------------------
//    Type Definitions (Optional)
// --------------------------------

interface ClassroomTestsProps {
  classroomId: string
}

interface TestData {
  id: string
  name: string
  subject: string
  timeLimit: number
  createdAt: string
  updatedAt: string
  classroomId: string | null
  creatorId: string
  completionRate: number    // calculated on the backend
  averageScore: number      // calculated on the backend
  // If your endpoint returns other fields (status, etc.), add them here
}

interface MemberData {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  role: string
  joinedAt: string
}

interface StudentCompletion {
  userId: string
  name: string
  avatar?: string
  status: "Not Started" | "In Progress" | "Completed"
  completedAt?: string
  score?: number
  timeSpent?: string
}

interface TestResult {
  id: string
  score: number
  completedAt: string | null
  timeSpent: number | null
  userId: string
  testId: string
  answers: {
    id: string
    text: string
    isCorrect: boolean
    score: number
    question: {
      id: string
      text: string
      answer: string
      points: number
    }
  }[]
}

export function ClassroomTests({ classroomId }: ClassroomTestsProps) {
  const { toast } = useToast()        // (optional) for success/error toasts

  // --------------------- Main data states ---------------------
  const [tests, setTests] = useState<TestData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewType, setViewType] = useState<"list" | "grid">("list")

  // -------------- For the Test Results Dialog --------------
  const [selectedTest, setSelectedTest] = useState<TestData | null>(null)
  const [students, setStudents] = useState<StudentCompletion[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentCompletion | null>(null)

  // -------------- For individual answers editing --------------
  const [editedAnswers, setEditedAnswers] = useState<TestResult["answers"]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [totalMaxScore, setTotalMaxScore] = useState(0)

  // --------------------- 1. Fetch tests ----------------------
  useEffect(() => {
    if (!classroomId) return
    ;(async function fetchTests() {
      try {
        const res = await fetch(`/api/classrooms/${classroomId}/tests`, { method: "GET" })
        if (!res.ok) {
          console.error("Failed to fetch tests.")
          return
        }
        const data = await res.json()
        setTests(data) // data: TestData[]
      } catch (err) {
        console.error("Error fetching tests:", err)
      }
    })()
  }, [classroomId])

  // -------------- 2. Filter tests by search query --------------
  const filteredTests = tests.filter((test) =>
    [test.name, test.subject].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  // -------------- 3. View test results => fetch members + results --------------
  const handleViewTestResults = async (test: TestData) => {
    setSelectedTest(test)
    setSelectedStudent(null)
    try {
      // a) Fetch classroom members
      const membersRes = await fetch(`/api/classrooms/${classroomId}/members`)
      if (!membersRes.ok) {
        console.error("Failed to fetch classroom members.")
        return
      }
      const membersData: MemberData[] = await membersRes.json()

      // b) For each member, attempt to get their test result
      const promises = membersData.map(async (member) => {
        const fullName = `${member.user.firstName} ${member.user.lastName}`
        const userId = member.user.id
        const resultRes = await fetch(`/api/tests/${test.id}/results/${userId}`)
        if (resultRes.ok) {
          const result: TestResult = await resultRes.json()
          const isCompleted = !!result.completedAt

          let userScore = undefined;


          return {
            userId,
            name: fullName,
            avatar: "/placeholder.svg",
            status: isCompleted ? "Completed" : "In Progress",
            completedAt: isCompleted
              ? new Date(result.completedAt!).toLocaleDateString()
              : undefined,
            score: userScore,
            timeSpent:
              isCompleted && result.timeSpent
                ? `${Math.round(result.timeSpent / 60)} minute(s)`
                : ""
          } as StudentCompletion
        } else {
          // if 404 or not found => "Not Started"
          return {
            userId,
            name: fullName,
            avatar: "/placeholder.svg",
            status: "Not Started"
          } as StudentCompletion
        }
      })
      const studentCompletions = await Promise.all(promises)
      setStudents(studentCompletions)
    } catch (err) {
      console.error("Error fetching members/results:", err)
    }
  }

  // -------------- 4. View a single student's answers --------------
  const handleViewStudentAnswers = async (student: StudentCompletion) => {
    setSelectedStudent(student)
    setHasUnsavedChanges(false)
    setEditedAnswers([])
    setTotalScore(0)
    setTotalMaxScore(0)

    if (!selectedTest) return

    // Only fetch the result if they have "In Progress" or "Completed" status
    if (student.status === "Not Started") return
    try {
      const res = await fetch(`/api/tests/${selectedTest.id}/results/${student.userId}`)
      if (!res.ok) {
        console.error("Failed to fetch user test answers.")
        return
      }
      const data: TestResult = await res.json()

      // Transform answers into a shape convenient for editing in the UI
      // const answers = data.answers.map((a) => ({
      //   ...a,
      //   question: a.question.text,
      //   correctAnswer: a.question.answer,
      //   maxScore: a.question.points
      // }))

      const answers = data.answers.map((a) => ({
         ...a,
      }))
      setEditedAnswers(answers as any)

      // Summarize total score / max
      let sum = 0
      let maxSum = 0
      answers.forEach((ans) => {
        sum += ans.score
        maxSum += ans.question.points
      })
      setTotalScore(sum)
      setTotalMaxScore(maxSum)
    } catch (err) {
      console.error("Error fetching user test result:", err)
    }
  }

  // -------------- 5. Edit scores --------------
  const handleScoreChange = (answerId: string, newScore: number) => {
    const updated = editedAnswers.map((ans) =>
      ans.id === answerId ? { ...ans, score: newScore } : ans
    )
    setEditedAnswers(updated)
    setHasUnsavedChanges(true)
    const newTotal = updated.reduce((sum, ans) => sum + ans.score, 0)
    setTotalScore(newTotal)
  }

  // -------------- 6. Save updated scores => PATCH --------------
  const handleSaveScores = async () => {
    if (!selectedTest || !selectedStudent) return
    try {
      const body = {
        answers: editedAnswers.map((ans) => ({
          answerId: ans.id,
          score: ans.score
        }))
      }
      const res = await fetch(`/api/tests/${selectedTest.id}/results/${selectedStudent.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        console.error("Failed to save updated scores.")
        return
      }
      setHasUnsavedChanges(false)

      // Optional: show a success toast
      toast({
        title: "Scores saved",
        description: "All changes have been saved successfully!"
      })
    } catch (error) {
      console.error("Error saving scores:", error)
    }
  }

  // -------------- 7. Dialog navigation --------------
  const handleBackToTestResults = () => {
    setSelectedStudent(null)
  }
  const handleCloseResults = () => {
    setSelectedTest(null)
    setSelectedStudent(null)
  }

  // ----------------------------------------------------------------
  //                         RENDER
  // ----------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top bar: search input & list/grid toggle */}
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
              <div className="h-1.5 w-1.5 rounded-sm bg-current" />
              <div className="h-1.5 w-1.5 rounded-sm bg-current" />
              <div className="h-1.5 w-1.5 rounded-sm bg-current" />
              <div className="h-1.5 w-1.5 rounded-sm bg-current" />
            </div>
          </Button>
        </div>
      </div>

      {/* Tabs: All Tests, Completed, etc. */}
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

        {/* --- TAB: ALL TESTS --- */}
        <TabsContent value="all">
          {viewType === "list" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Test Name</TableHead>
                      <TableHead className="text-center">Created</TableHead>
                      <TableHead className="text-center">Time Limit</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Completion</TableHead>
                      <TableHead className="text-center">Avg. Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTests.map((test) => {
                      const completionRate = Math.round(test.completionRate)
                      const status =
                        completionRate < 100 && completionRate > 0
                          ? "Active"
                          : completionRate === 100
                          ? "Completed"
                          : "Scheduled"
                      return (
                        <TableRow key={test.id}>
                          <TableCell className="text-center font-medium">{test.name}</TableCell>
                          <TableCell className="text-center">{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-center">{test.timeLimit} minute(s)</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                status === "Active"
                                  ? "default"
                                  : status === "Completed"
                                  ? "outline"
                                  : "secondary"
                              }
                            >
                              {status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={completionRate} className="h-2 w-20" />
                              <span className="text-xs">{completionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {test.averageScore > 0
                              ? `${Math.round(test.averageScore)}%`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTests.map((test) => {
                const completionRate = Math.round(test.completionRate)
                const status =
                  completionRate < 100 && completionRate > 0
                    ? "Active"
                    : completionRate === 100
                    ? "Completed"
                    : "Scheduled"
                return (
                  <Card key={test.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{test.name}</CardTitle>
                        <Badge
                          variant={
                            status === "Active"
                              ? "default"
                              : status === "Completed"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {status}
                        </Badge>
                      </div>
                      <CardDescription>{test.subject}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{test.timeLimit} min</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Completion</span>
                            <span>{completionRate}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>

                        {status !== "Scheduled" && (
                          <div className="flex items-center justify-between text-sm">
                            <span>Average Score</span>
                            <span className="font-medium">
                              {test.averageScore > 0
                                ? `${Math.round(test.averageScore)}%`
                                : "N/A"}
                            </span>
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
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* --- TAB: COMPLETED TESTS --- */}
        <TabsContent value="completed">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests
              .filter((test) => Math.round(test.completionRate) === 100)
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
                          <span>{new Date(test.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{test.timeLimit} min</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Completion</span>
                          <span>{Math.round(test.completionRate)}%</span>
                        </div>
                        <Progress value={test.completionRate} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Average Score</span>
                        <span className="font-medium">
                          {test.averageScore > 0
                            ? `${Math.round(test.averageScore)}%`
                            : "N/A"}
                        </span>
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

      {/* -------------- Test Results Dialog -------------- */}
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
                  {selectedStudent.completedAt
                    ? `Completed on ${selectedStudent.completedAt}`
                    : "Not Completed"}
                  {selectedStudent.score !== undefined
                    ? ` • Score: ${selectedStudent.score}%`
                    : null}
                </>
              ) : (
                <>
                  Average Score:{" "}
                  {selectedTest?.averageScore
                    ? `${Math.round(selectedTest.averageScore)}%`
                    : "N/A"}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* If no student selected => show the "students" table; otherwise show answer details */}
          {selectedStudent ? (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Total Score: {totalScore}/{totalMaxScore} (
                    {totalMaxScore > 0
                      ? Math.round((totalScore / totalMaxScore) * 100)
                      : 0}
                    %)
                  </Badge>
                  {hasUnsavedChanges && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Unsaved Changes
                    </Badge>
                  )}
                </div>
              </div>

              {/* Render each answer with an editable score */}
              {editedAnswers.map((answer) => {
                const isCorrect = answer.isCorrect
                return (
                  <div key={answer.id} className="space-y-3 border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">Question</h3>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
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
                    </div>

                    <p className="text-sm">{answer.question.text}</p>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Student's Answer:</span>{" "}
                        <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                          {answer.text}
                        </p>
                      </div>
                      {!isCorrect && (
                        <div>
                          <span className="font-medium">Correct Answer:</span>{" "}
                          <p className="text-green-600">
                            {answer.question.answer}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t mt-2">
                      <span className="font-medium text-sm">Score:</span>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={answer.question.points}
                          value={answer.score}
                          onChange={(e) =>
                            handleScoreChange(answer.id, Number(e.target.value) || 0)
                          }
                          className="w-16 h-8 text-right"
                        />
                        <span className="text-sm text-muted-foreground">
                          / {answer.question.points}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
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
                  {students.map((student) => (
                    <TableRow key={student.userId}>
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
                            {student.status === "Not Started" ? (
                              <span className="font-medium">{student.name}</span>
                            ) : (
                              <button
                                className="font-medium hover:underline focus:outline-none"
                                onClick={() => handleViewStudentAnswers(student)}
                              >
                                {student.name}
                              </button>
                            )}
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
                      <TableCell>
                        {student.score !== undefined ? `${student.score.toFixed(1)}%` : "—"}
                      </TableCell>
                      <TableCell>{student.timeSpent || "—"}</TableCell>
                      <TableCell className="text-right">
                        {student.status === "Completed" || student.status === "In Progress" ? (
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
            {selectedStudent && hasUnsavedChanges && (
              <Button onClick={handleSaveScores}>Save Scores</Button>
            )}
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
