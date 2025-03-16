// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Removed unused icons: Eye, MoreHorizontal, FileText, Share
import Link from "next/link";
import { format } from "date-fns";

interface PersonalTestsListProps {
  viewType: string;
  searchQuery: string;
  selectedSubject: string;
}

interface TestItem {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  questions: number;
  status: string;
  shared: boolean;
  score: string;
}

export function PersonalTestsList({ viewType, searchQuery, selectedSubject }: PersonalTestsListProps) {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTests() {
      try {
        const queryParams = new URLSearchParams({
          type: 'created',
          search: searchQuery,
          subject: selectedSubject,
        });
        const res = await fetch(`/api/tests?${queryParams}`);
        if (!res.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await res.json();
        console.log("Fetched tests:", data);

        const formattedTests = data.map((test: any) => ({
          id: test.id,
          name: test.name || "Untitled Test",
          subject: test.subject || "No Subject",
          createdAt: test.createdAt ? format(new Date(test.createdAt), "MMM dd, yyyy") : "Unknown",
          questions: test._count?.questions ?? 0,
          // Updated status logic to mimic assigned tests:
          status: test.results && test.results.length > 0 
                    ? (test.results[0].completedAt ? "Completed" : "Pending")
                    : "Pending",
          shared: test.shared ?? false,
          score: test.results && test.results.length > 0 ? `${Math.round(test.results[0].score)}%` : "-",
        }));
        
        setTests(formattedTests);
      } catch (err) {
        console.error("Error fetching tests:", err);
        setError("Failed to load tests.");
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, [searchQuery, selectedSubject]);

  if (loading) return <p>Loading tests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (viewType === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{test.name}</CardTitle>
                <Badge variant={test.status === "Completed" ? "outline" : "secondary"}>
                  {test.status}
                </Badge>
              </div>
              <CardDescription>{test.createdAt}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium">{test.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-medium">{test.questions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Score</p>
                  <p className="font-medium">{test.score}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shared</p>
                  <p className="font-medium">{test.shared ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="default">
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
            <TableHead>Created</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Shared</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell>{test.name}</TableCell>
              <TableCell>{test.subject}</TableCell>
              <TableCell>{test.createdAt}</TableCell>
              <TableCell>{test.questions}</TableCell>
              <TableCell>
              <Badge
                  className={
                    test.status === "Completed"
                      ? "bg-green-500 text-white"
                      : test.status === "Pending"
                      ? "bg-gray-300 text-black"
                      : "bg-blue-500 text-white"
                  }
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell>{test.score}</TableCell>
              <TableCell>{test.shared ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="default">
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
