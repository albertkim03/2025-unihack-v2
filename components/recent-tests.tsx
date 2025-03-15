"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type TestItem = {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  status: string;
  answeredQuestions: number;
  totalQuestions: number;
};

export function RecentTests() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch(`/api/tests?type=created`);
        if (!res.ok) {
          throw new Error("Failed to fetch tests");
        }
        const data = await res.json();
        console.log(data);

        // Format API response
        const formattedTests = data.map((test: any) => ({
          id: test.id,
          name: test.name || "Untitled Test",
          subject: test.subject || "No Subject",
          createdAt: test.createdAt || "Unknown",
          status: test.results?.length > 0 ? "Completed" : "Assigned",
          answeredQuestions: test.results?.[0]?.score ?? 0, // 👈 This line is causing the error
          totalQuestions: test._count?.questions ?? 0,
        }));

        setTests(formattedTests);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  if (loading) return <p>Loading tests...</p>;

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
                      : "secondary"
                  }
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell>{`${test.answeredQuestions}/${test.totalQuestions}`}</TableCell>
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
