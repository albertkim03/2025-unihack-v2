"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton"

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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {["Test Name", "Subject", "Created", "Status", "Completion", "Actions"].map((header, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.name}</TableCell>
              <TableCell>{test.subject}</TableCell>
              <TableCell>{formatDistanceToNow(new Date(test.createdAt)) + " ago"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    test.status === "Assigned"
                      ? "outline"
                      : test.status === "Completed"
                      ? "default"
                      : test.status === "Created"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell>{test.answeredQuestions}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View test</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">View results</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
