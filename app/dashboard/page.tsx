"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { RecentTests } from "@/components/recent-tests";
import { ClassroomOverview } from "@/components/classroom-overview";

export default function DashboardPage() {
  const [totalTests, setTotalTests] = useState<number | string>("-");
  const [completedTests, setCompletedTests] = useState<number | string>("-");
  const [averageScore, setAverageScore] = useState<number | string>("-");
  const [highestScore, setHighestScore] = useState<number | string>("-");
  const [lowestScore, setLowestScore] = useState<number | string>("-");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type Test = {
    id: string;
    name: string;
    subject: string;
    createdAt: string;
    results?: { score: number; completedAt?: string }[];
    _count?: {
      questions: number;
    };
  };

  useEffect(() => {
    async function fetchTestStats() {
      try {
        const userId = "currentUserId"; // Replace with actual user ID logic

        // Fetch both "created" and "assigned" tests
        const [createdRes, assignedRes] = await Promise.all([
          fetch(`/api/tests?type=created`),
          fetch(`/api/tests?type=assigned`),
        ]);

        if (!createdRes.ok || !assignedRes.ok) {
          throw new Error("Failed to fetch test data");
        }

        const [createdData, assignedData]: [Test[], Test[]] = await Promise.all([
          createdRes.json(),
          assignedRes.json(),
        ]);

        console.log("Created Tests:", createdData);
        console.log("Assigned Tests:", assignedData);

        // Combine all tests
        const allTests = [...createdData, ...assignedData];
        setTotalTests(allTests.length || "-");

        // Fetch completion status for each test
        const testResults = await Promise.all(
          allTests.map(async (test) => {
            const resultRes = await fetch(`/api/tests/${test.id}/results/${userId}`);
            if (!resultRes.ok) {
              return { ...test, completed: false, score: null };
            }
            const resultData = await resultRes.json();
            return { ...test, completed: true, score: resultData.score };
          })
        );

        // Filter completed tests
        const completedTestsData = testResults.filter((test) => test.completed);
        setCompletedTests(completedTestsData.length || "-");

        // Extract scores for calculations
        const scores = completedTestsData.map((test) => test.score).filter((score) => score !== null);

        // Calculate stats
        setAverageScore(scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : "-");
        setHighestScore(scores.length > 0 ? Math.max(...scores) : "-");
        setLowestScore(scores.length > 0 ? Math.min(...scores) : "-");
      } catch (err) {
        console.error("Error fetching test stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchTestStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
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
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore !== "-" ? `${averageScore}%` : "-"}</div>
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
                <span className="text-sm font-medium text-muted-foreground">Average Score</span>
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
          <ClassroomOverview classrooms={[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}