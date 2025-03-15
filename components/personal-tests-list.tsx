// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Share, MoreHorizontal, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface PersonalTestsListProps {
  viewType: string;
}

type TestItem = {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  questions: number;
  status: string;
  shared: boolean;
};

export function PersonalTestsList({ viewType }: PersonalTestsListProps) {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch(`/api/tests?type=created`);
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
  }, []);

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
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Subject</p>
                  <p className="font-medium">{test.subject}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{test.createdAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Questions</p>
                  <p className="font-medium">{test.questions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shared</p>
                  <p className="font-medium">{test.shared ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              {/* Take Test Button always appears */}
              <Button asChild>
                <Link href={`/take-test/${test.id}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Take Test
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </Button>
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Share className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More</span>
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
            <TableHead>Test Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shared</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.name}</TableCell>
              <TableCell>{test.subject}</TableCell>
              <TableCell>{test.createdAt}</TableCell>
              <TableCell>{test.questions}</TableCell>
              <TableCell>
                <Badge variant={test.status === "Published" ? "default" : "outline"}>
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell>{test.shared ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right flex gap-2 justify-end">
                {/* Take Test Button always appears */}
                <Button asChild>
                  <Link href={`/take-test/${test.id}`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Take Test
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/edit-test/${test.id}`}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
