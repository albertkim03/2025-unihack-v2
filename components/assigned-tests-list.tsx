  "use client";

  import { useEffect, useState } from "react";
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
  import { Eye, FileText } from "lucide-react";
  import Link from "next/link";
  import { format } from "date-fns";

  interface AssignedTestsListProps {
    viewType: string;
  }

  type TestItem = {
    id: string;
    name: string;
    subject: string;
    assignedBy: string;
    dueDate: string;
    status: string;
    classroom: string;
    score?: string;
  };

  export function AssignedTestsList({ viewType }: AssignedTestsListProps) {
    const [tests, setTests] = useState<TestItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      async function fetchTests() {
        try {
          const res = await fetch(`/api/tests?type=assigned`);
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
    }, []);

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
                      test.status === "Completed" ? "default" : test.status === "Overdue" ? "destructive" : "outline"
                    }
                  >
                    {test.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Subject</p>
                    <p className="font-medium">{test.subject}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Classroom</p>
                    <p className="font-medium">{test.classroom}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Assigned By</p>
                    <p className="font-medium">{test.assignedBy}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">{test.dueDate}</p>
                  </div>
                </div>
                {test.status === "Completed" && (
                  <div className="mt-4">
                    <p className="text-muted-foreground text-sm">Your Score</p>
                    <p className="text-2xl font-bold">{test.score}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 mt-auto">
                {test.status === "Pending" ? (
                  <Button asChild>
                    <Link href={`/take-test/${test.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Take Test
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link href={`/test-results/${test.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Results
                    </Link>
                  </Button>
                )}
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
              <TableHead>Classroom</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell className="font-medium">{test.name}</TableCell>
                <TableCell>{test.subject}</TableCell>
                <TableCell>{test.classroom}</TableCell>
                <TableCell>{test.assignedBy}</TableCell>
                <TableCell>{test.dueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      test.status === "Completed" ? "default" : test.status === "Overdue" ? "destructive" : "outline"
                    }
                  >
                    {test.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {test.status === "Pending" ? (
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/take-test/${test.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Take Test
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Results</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Test</span>
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
