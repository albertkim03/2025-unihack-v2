    // @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface AssignedTestsListProps {
  viewType: string;
  searchQuery: string;
  selectedSubject: string;
}

interface TestItem {
  id: string;
  name: string;
  subject: string;
  assignedBy: string;
  classroom: string;
  dueDate: string;
  status: string;
  score?: string;
}

export function AssignedTestsList({ viewType, searchQuery, selectedSubject }: AssignedTestsListProps) {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTests() {
      try {
        const queryParams = new URLSearchParams({
          type: 'assigned',
          search: searchQuery,
          subject: selectedSubject
        });
        const res = await fetch(`/api/tests?${queryParams}`);
        if (!res.ok) {
          throw new Error("Failed to fetch assigned tests");
        }
        const data = await res.json();
        console.log("Fetched assigned tests:", data);

          const formattedTests = data.map((test: any) => ({
            id: test.id,
            name: test.name || "Untitled Test",
            subject: test.subject || "No Subject",
            assignedBy: `${test.creator.firstName} ${test.creator.lastName}` || "Unknown",
            classroom: test.classroom?.name || "No Classroom",
            dueDate: test.dueDate ? format(new Date(test.dueDate), "MMM dd, yyyy") : "No Due Date",
            status: test.results.length > 0
              ? test.results[0].completedAt
                ? "Completed"
                : "Pending"
              : "Pending",
            score: test.results.length > 0 ? `${test.results[0].score}%` : undefined,
          }));

        setTests(formattedTests);
      } catch (err) {
        console.error("Error fetching assigned tests:", err);
        setError("Failed to load assigned tests.");
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, [searchQuery, selectedSubject]);

    if (loading) return <p>Loading assigned tests...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

  if (viewType === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <Card key={test.id} className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{test.name}</CardTitle>
                <Badge
                  variant={
                    test.status === "Completed"
                      ? "outline"
                      : test.status === "Pending"
                      ? "secondary"
                      : "default"
                  }
                >
                  {test.status}
                </Badge>
              </div>
              <CardDescription>{test.classroom}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium">{test.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Due Date</p>
                  <p className="font-medium">{test.dueDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Assigned By</p>
                  <p className="font-medium">{test.assignedBy}</p>
                </div>
                {test.score && (
                  <div>
                    <p className="text-muted-foreground">Score</p>
                    <p className="font-medium">{test.score}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={test.status === "Completed" ? `/test-results/${test.id}` : `/take-test/${test.id}`}>
                  {test.status === "Completed" ? "View Results" : "Take Test"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Classroom</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell>{test.name}</TableCell>
              <TableCell>{test.subject}</TableCell>
              <TableCell>{test.classroom}</TableCell>
              <TableCell>{test.dueDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    test.status === "Completed"
                      ? "outline"
                      : test.status === "Pending"
                      ? "secondary"
                      : "default"
                  }
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell>{test.score || "-"}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost">
                  <Link href={test.status === "Completed" ? `/test-results/${test.id}` : `/take-test/${test.id}`}>
                    {test.status === "Completed" ? "View Results" : "Take Test"}
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
