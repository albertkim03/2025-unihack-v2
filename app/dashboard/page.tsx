// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { RecentTests } from "@/components/recent-tests";
import { ClassroomOverview } from "@/components/classroom-overview";
import { fetchUserSession } from "./actions";
import { isSameMonth } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

interface Classroom {
  id: string;
  name: string;
  description: string;
  subject: string;
  students: number;
  tests: number;
  recentTest?: {
    name: string;
    date: string;
  };
  owner?: {
    name: string;
  };
}

export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [totalTests, setTotalTests] = useState<number | string>("-");
  const [completedTests, setCompletedTests] = useState<number | string>("-");
  const [averageScore, setAverageScore] = useState<number | string>("-");
  const [averageScoreThisMonth, setAverageScoreThisMonth] = useState<number | string>("-");
  const [highestScore, setHighestScore] = useState<number | string>("-");
  const [lowestScore, setLowestScore] = useState<number | string>("-");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const sessionData = await fetchUserSession();
        if (sessionData) {
          setSession(sessionData);
          setUserId(sessionData.user.id);
        }

        if (!sessionData?.user?.id) {
          throw new Error("User session not found.");
        }

        // Fetch test data and classroom data in parallel
        const [createdRes, assignedRes, classroomsRes] = await Promise.all([
          fetch(`/api/tests?type=created`),
          fetch(`/api/tests?type=assigned`),
          fetch('/api/classrooms')
        ]);

        if (!createdRes.ok || !assignedRes.ok || !classroomsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [createdData, assignedData, classroomsData] = await Promise.all([
          createdRes.json(),
          assignedRes.json(),
          classroomsRes.json()
        ]);

        // Format and combine owned and member classrooms
        const formattedClassrooms = [
          ...(classroomsData.owned || []).map(classroom => ({
            ...classroom,
            description: classroom.description || "Your classroom",
            students: classroom._count?.members || 0,
            tests: classroom._count?.tests || 0
          })),
          ...(classroomsData.member || []).map(classroom => ({
            ...classroom,
            description: classroom.description || "Classroom you're enrolled in",
            students: classroom._count?.members || 0,
            tests: classroom._count?.tests || 0,
            owner: classroom.owner ? `${classroom.owner.firstName} ${classroom.owner.lastName}` : "Unknown"
          }))
        ];
        setClassrooms(formattedClassrooms);

        const allTests = [...createdData, ...assignedData];
        setTotalTests(allTests.length || "-");

        // Fetch completion status for each test
        const testResults = await Promise.all(
          allTests.map(async (test) => {
            const resultRes = await fetch(`/api/tests/${test.id}/results/${sessionData.user.id}`);
            if (!resultRes.ok) {
              return { ...test, completed: false, score: null, completedAt: null };
            }
            const resultData = await resultRes.json();
            return { ...test, completed: true, score: resultData.score, completedAt: resultData.completedAt };
          })
        );

        // Calculate stats
        const completedTestsData = testResults.filter((test) => test.completed);
        setCompletedTests(completedTestsData.length || "-");

        const scores = completedTestsData.map((test) => test.score).filter((score) => score !== null);
        setAverageScore(scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : "-");
        setHighestScore(scores.length > 0 ? Math.round(Math.max(...scores)) : "-");
        setLowestScore(scores.length > 0 ? Math.round(Math.min(...scores)) : "-");

        const currentMonthScores = completedTestsData
          .filter((test) => test.completedAt && isSameMonth(new Date(test.completedAt), new Date()))
          .map((test) => test.score);

        setAverageScoreThisMonth(
          currentMonthScores.length > 0
            ? Math.round(currentMonthScores.reduce((a, b) => a + b, 0) / currentMonthScores.length)
            : "-"
        );

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
        <Spinner />
        <p className="text-center mt-4 text-muted-foreground">Fetching your data...</p>
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Stats Summary Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">Tests awaiting completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTests}</div>
            <p className="text-xs text-muted-foreground">Tests completed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score This Month</CardTitle> 
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageScoreThisMonth !== "-" ? `${averageScoreThisMonth}%` : "-"}
            </div>
            <p className="text-xs text-muted-foreground">Across all subjects</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Summary */}
      <div>
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>My Results Summary</CardTitle>
            <CardDescription>Overview of all test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Total Tests</span>
                <span className="text-3xl font-bold">{totalTests}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Overall Average Score</span>
                <span className="text-3xl font-bold">{averageScore !== "-" ? `${averageScore}%` : "-"}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Highest Score</span>
                <span className="text-3xl font-bold">{highestScore !== "-" ? `${highestScore}%` : "-"}</span>
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-medium text-muted-foreground">Lowest Score</span>
                <span className="text-3xl font-bold">{lowestScore !== "-" ? `${lowestScore}%` : "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests & Classroom Overview */}
      <Tabs defaultValue="recent" className="mt-8">
        <TabsList>
          <TabsTrigger value="recent">Recent Tests</TabsTrigger>
          <TabsTrigger value="classrooms">My Classrooms</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <RecentTests />
        </TabsContent>
        <TabsContent value="classrooms" className="mt-4">
          <ClassroomOverview classrooms={classrooms} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
