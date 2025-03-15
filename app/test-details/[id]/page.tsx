// @ts-nocheck
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  Download,
  Share,
  Edit,
  MoreHorizontal,
  Mail,
  Clock,
  Calendar,
  FileText,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function TestDetailsPage({ params }) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock test data
  const test = {
    id: params.id,
    name: "Mechanics Quiz",
    subject: "Physics",
    classroom: "Physics 101",
    createdAt: "Mar 14, 2025",
    dueDate: "Mar 21, 2025",
    status: "Active",
    questions: 15,
    completionRate: 33,
    averageScore: 82,
    timeLimit: "30 minutes",
    description: "A comprehensive quiz covering Newton's laws of motion, kinematics, and dynamics.",
    topics: ["Newton's Laws", "Kinematics", "Dynamics", "Momentum"],
    questionTypes: ["Multiple Choice", "True/False", "Short Answer"],
    creator: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  }

  // Mock student completion data
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

  // Mock question performance data
  const questionPerformance = [
    {
      id: 1,
      text: "What is Newton's First Law of Motion?",
      correctRate: 92,
      avgTimeSpent: "45 seconds",
    },
    {
      id: 2,
      text: "A 2 kg object moving at 5 m/s has a momentum of:",
      correctRate: 78,
      avgTimeSpent: "60 seconds",
    },
    {
      id: 3,
      text: "The SI unit of force is:",
      correctRate: 95,
      avgTimeSpent: "30 seconds",
    },
    {
      id: 4,
      text: "An object accelerates at 10 m/s² when a force of 5 N is applied. What is the mass of the object?",
      correctRate: 65,
      avgTimeSpent: "90 seconds",
    },
    {
      id: 5,
      text: "The principle of conservation of momentum applies when:",
      correctRate: 72,
      avgTimeSpent: "75 seconds",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
          <p className="text-muted-foreground">
            {test.classroom} • Created on {test.createdAt}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/edit-test/${test.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send Reminder
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Extend Due Date
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Close Test
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge>{test.status}</Badge>
              <span className="text-xs text-muted-foreground">Due {test.dueDate}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{test.timeLimit}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{test.completionRate}%</div>
            <div className="mt-2">
              <Progress value={test.completionRate} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">8 of 24 students completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{test.averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-2">Based on completed tests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{test.questions}</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {test.questionTypes.map((type, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
                <CardDescription>Information about this test</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="mt-1">{test.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Topics</h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {test.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={test.creator.avatar} alt={test.creator.name} />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <span>{test.creator.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                      <p className="mt-1">{test.createdAt}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                      <p className="mt-1">{test.dueDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/preview-test/${test.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Test
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Status</CardTitle>
                <CardDescription>Student completion overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-primary"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm">In Progress</span>
                    </div>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-muted"></div>
                      <span className="text-sm">Not Started</span>
                    </div>
                    <span className="font-medium">12</span>
                  </div>

                  <div className="h-[200px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Completion chart visualization would appear here</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reminder
                </Button>
                <Button size="sm">View All Students</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Track individual student performance</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
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
                            <p className="font-medium">{student.name}</p>
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
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/student-result/${test.id}/${student.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Results
                            </Link>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Question Performance</CardTitle>
                <CardDescription>Analyze performance by question</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/edit-test/${test.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Questions
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {questionPerformance.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Question {question.id}</h3>
                        <p className="text-sm">{question.text}</p>
                      </div>
                      <Badge
                        variant={
                          question.correctRate >= 80 ? "default" : question.correctRate >= 60 ? "outline" : "secondary"
                        }
                      >
                        {question.correctRate}% correct
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Correct Response Rate</span>
                        <span>{question.correctRate}%</span>
                      </div>
                      <Progress value={question.correctRate} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span>Average Time Spent</span>
                      <span>{question.avgTimeSpent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Distribution of student scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                  <span className="text-muted-foreground">Score distribution chart would appear here</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Analysis</CardTitle>
                <CardDescription>Time spent on test completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                  <span className="text-muted-foreground">Time analysis chart would appear here</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Topic Performance</CardTitle>
                <CardDescription>Performance breakdown by topic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Newton's Laws</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Kinematics</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Dynamics</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Momentum</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

