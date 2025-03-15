"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, BarChart3, PieChart, LineChart, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ClassroomResultsProps {
  classroomId: string
}

export function ClassroomResults({ classroomId }: ClassroomResultsProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock results data
  const testResults = [
    {
      id: "test-2",
      name: "Thermodynamics Basics",
      date: "Mar 12, 2025",
      averageScore: 78,
      highestScore: 95,
      lowestScore: 62,
      completionRate: 100,
      participants: 22,
      trend: "up",
      trendValue: 5,
    },
    {
      id: "test-3",
      name: "Wave Properties",
      date: "Mar 4, 2025",
      averageScore: 85,
      highestScore: 98,
      lowestScore: 70,
      completionRate: 100,
      participants: 24,
      trend: "up",
      trendValue: 7,
    },
    {
      id: "test-4",
      name: "Electricity & Magnetism",
      date: "Feb 22, 2025",
      averageScore: 76,
      highestScore: 92,
      lowestScore: 58,
      completionRate: 100,
      participants: 23,
      trend: "down",
      trendValue: 3,
    },
  ]

  // Mock student performance data
  const studentPerformance = [
    {
      id: "user-1",
      name: "Emma Miller",
      avatar: "/placeholder.svg?height=40&width=40&text=EM",
      averageScore: 95,
      testsCompleted: 3,
      trend: "up",
      trendValue: 4,
    },
    {
      id: "user-2",
      name: "James Chen",
      avatar: "/placeholder.svg?height=40&width=40&text=JC",
      averageScore: 92,
      testsCompleted: 3,
      trend: "up",
      trendValue: 2,
    },
    {
      id: "user-3",
      name: "Sophia Patel",
      avatar: "/placeholder.svg?height=40&width=40&text=SP",
      averageScore: 89,
      testsCompleted: 3,
      trend: "up",
      trendValue: 5,
    },
    {
      id: "user-4",
      name: "Michael Johnson",
      avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      averageScore: 87,
      testsCompleted: 3,
      trend: "down",
      trendValue: 1,
    },
    {
      id: "user-5",
      name: "Olivia Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=OR",
      averageScore: 94,
      testsCompleted: 3,
      trend: "up",
      trendValue: 3,
    },
  ]

  // Filter results based on search query
  const filteredResults = testResults.filter((result) => result.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search results..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Select defaultValue="all-time">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+4%</span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500 font-medium">+2%</span>
              <span className="ml-1">from previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              <span>Total tests completed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Test Results</TabsTrigger>
          <TabsTrigger value="students">Student Performance</TabsTrigger>
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Performance across all completed tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {filteredResults.map((result) => (
                  <div key={result.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{result.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Completed on {result.date} • {result.participants} participants
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Badge className="mr-2">{result.averageScore}%</Badge>
                        {result.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Average Score</span>
                        <div className="flex items-center">
                          <span>{result.averageScore}%</span>
                          {result.trend === "up" ? (
                            <span className="ml-1 text-xs text-green-500">+{result.trendValue}%</span>
                          ) : (
                            <span className="ml-1 text-xs text-red-500">-{result.trendValue}%</span>
                          )}
                        </div>
                      </div>
                      <Progress value={result.averageScore} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Highest Score</span>
                        <p className="font-medium">{result.highestScore}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Lowest Score</span>
                        <p className="font-medium">{result.lowestScore}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>Individual student performance across all tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {studentPerformance.map((student) => (
                  <div key={student.id} className="flex items-center justify-between">
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
                        <p className="text-xs text-muted-foreground">{student.testsCompleted} tests completed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Avg. Score</span>
                          <div className="flex items-center">
                            <span>{student.averageScore}%</span>
                            {student.trend === "up" ? (
                              <span className="ml-1 text-xs text-green-500">+{student.trendValue}%</span>
                            ) : (
                              <span className="ml-1 text-xs text-red-500">-{student.trendValue}%</span>
                            )}
                          </div>
                        </div>
                        <Progress value={student.averageScore} className="h-2" />
                      </div>
                      <Badge>{student.averageScore}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card>
            <CardHeader>
              <CardTitle>Topic Analysis</CardTitle>
              <CardDescription>Performance breakdown by topic areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Thermodynamics</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Wave Properties</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Electricity & Magnetism</span>
                    <span>76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Mechanics</span>
                    <span>82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Quantum Physics</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </div>

              <div className="mt-8 h-[300px] w-full rounded-lg bg-muted p-4 flex items-center justify-center">
                <span className="text-muted-foreground">Topic performance chart visualization would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

