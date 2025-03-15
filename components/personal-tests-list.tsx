// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Share, MoreHorizontal, Edit, Trash2, Copy, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          status: test.status || "Draft",
          shared: test.shared ?? false,
          score:
            test.results && test.results.length > 0
              ? `${test.results[0].score}%`
              : "-", // Display a dash if no score available
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
                <Badge variant={test.status === "Published" ? "default" : "outline"}>{test.status}</Badge>
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
              <div className="flex w-full items-center gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/take-test/${test.id}`}>Take Test</Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link href={`/test-details/${test.id}`}>View Details</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/edit-test/${test.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                <Badge variant={test.status === "Published" ? "default" : "outline"}>{test.status}</Badge>
              </TableCell>
              <TableCell>{test.score}</TableCell>
              <TableCell>{test.shared ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button asChild variant="default" size="sm">
                    <Link href={`/take-test/${test.id}`}>Take Test</Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/test-details/${test.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/edit-test/${test.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
