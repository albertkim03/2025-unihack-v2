// @ts-nocheck

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { RecentTests } from "@/components/recent-tests"
import { ClassroomOverview } from "@/components/classroom-overview"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Get classrooms where the user is the owner
  const ownedClassrooms = session?.user?.id ? await prisma.classroom.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      _count: {
        select: {
          members: true,
          tests: true,
        },
      },
      tests: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  }) : []

  // Format classrooms for display
  const formattedClassrooms = ownedClassrooms.map((classroom) => ({
    id: classroom.id,
    name: classroom.name,
    description: classroom.description || "Your classroom",
    subject: classroom.subject,
    students: classroom._count.members,
    tests: classroom._count.tests,
    recent: classroom.tests[0]?.title || undefined,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Tests awaiting completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Tests completed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>
      </div>

      <div>
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Results Summary</CardTitle>
          <CardDescription>Overview of all test results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Total Tests</span>
              <span className="text-3xl font-bold">48</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Average Score</span>
              <span className="text-3xl font-bold">76%</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Highest Score</span>
              <span className="text-3xl font-bold">98%</span>
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Lowest Score</span>
              <span className="text-3xl font-bold">42%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>

      <Tabs defaultValue="recent" className="mt-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Tests</TabsTrigger>
          <TabsTrigger value="classrooms">My Classrooms</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <RecentTests />
        </TabsContent>
        <TabsContent value="classrooms" className="mt-4">
          <ClassroomOverview classrooms={formattedClassrooms} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

