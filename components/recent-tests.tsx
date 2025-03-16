"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/spinner";

type TestItem = {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  status: string;
  answeredQuestions: string; // Now a string to allow "-/{totalQuestions}"
  totalQuestions: number;
};

export function RecentTests() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTests() {
      try {
        // Fetch both "created" and "assigned" tests
        const [createdRes, assignedRes] = await Promise.all([
          fetch(`/api/tests?type=created`),
          fetch(`/api/tests?type=assigned`)
        ]);

        if (!createdRes.ok || !assignedRes.ok) {
          throw new Error("Failed to fetch tests");
        }

        const [createdData, assignedData] = await Promise.all([
          createdRes.json(),
          assignedRes.json()
        ]);

        console.log("Created Tests:", createdData);
        console.log("Assigned Tests:", assignedData);

        // Combine both lists & sort by createdAt (newest first)
        const allTests = [...createdData, ...assignedData].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Query each test for the user's test result
        const userId = "currentUserId"; // Replace with actual userId retrieval logic
        const enrichedTests = await Promise.all(
          allTests.map(async (test) => {
            let answeredQuestions = "-";
            if (test.results && test.results.length > 0) {
              answeredQuestions = test.results[0]?.score ?? "0";
            } else {
              // Fetch user's test result from API
              const testResultRes = await fetch(`/api/tests/${test.id}/results/${userId}`);
              if (testResultRes.ok) {
                const testResult = await testResultRes.json();
                answeredQuestions = testResult ? `${testResult.score}` : "-";
              }
            }

            const returnAnsweredQuestions = answeredQuestions != "-" ? `${Math.round(parseInt(answeredQuestions) * 100) / 100} %` : "- %"
            
            return {
              id: test.id,
              name: test.name || "Untitled Test",
              subject: test.subject || "No Subject",
              createdAt: test.createdAt || new Date().toISOString(),
              status: test.results?.length > 0 ? "Completed" : "Assigned",
              answeredQuestions: returnAnsweredQuestions,
              totalQuestions: test._count?.questions ?? 0,
            };
          })
        );

        setTests(enrichedTests);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load tests.");
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Tests</h1>
        <Spinner />
        <p className="text-center mt-4 text-muted-foreground">Loading your tests...</p>
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Test Name</TableHead>
            <TableHead className="text-center">Subject</TableHead>
            <TableHead className="text-center">Created</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Completion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="text-center font-medium">{test.name}</TableCell>
              <TableCell className="text-center">{test.subject}</TableCell>
              <TableCell className="text-center">{formatDistanceToNow(new Date(test.createdAt)) + " ago"}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={
                    test.status === "Assigned"
                      ? "outline"
                      : test.status === "Completed"
                      ? "default"
                      : "secondary"
                  }
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{test.answeredQuestions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
