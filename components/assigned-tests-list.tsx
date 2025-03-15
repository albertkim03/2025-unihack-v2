import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText } from "lucide-react"
import Link from "next/link"

interface AssignedTestsListProps {
  viewType: string
}

export function AssignedTestsList({ viewType }: AssignedTestsListProps) {
  const assignedTests = [
    {
      id: "TEST-2001",
      name: "Physics: Quantum Mechanics",
      subject: "Physics",
      assignedBy: "Prof. Richard Feynman",
      dueDate: "Mar 20, 2025",
      status: "Pending",
      classroom: "Advanced Physics",
    },
    {
      id: "TEST-2002",
      name: "Chemistry: Thermodynamics",
      subject: "Chemistry",
      assignedBy: "Dr. Marie Curie",
      dueDate: "Mar 18, 2025",
      status: "Completed",
      classroom: "Chemistry 201",
      score: "92%",
    },
    {
      id: "TEST-2003",
      name: "Biology: Evolution",
      subject: "Biology",
      assignedBy: "Dr. Charles Darwin",
      dueDate: "Mar 15, 2025",
      status: "Completed",
      classroom: "Biology 101",
      score: "88%",
    },
    {
      id: "TEST-2004",
      name: "Mathematics: Linear Algebra",
      subject: "Mathematics",
      assignedBy: "Prof. Ada Lovelace",
      dueDate: "Mar 22, 2025",
      status: "Pending",
      classroom: "Advanced Mathematics",
    },
    {
      id: "TEST-2005",
      name: "Computer Science: Algorithms",
      subject: "Computer Science",
      assignedBy: "Dr. Alan Turing",
      dueDate: "Mar 16, 2025",
      status: "Overdue",
      classroom: "CS Fundamentals",
    },
  ]

  if (viewType === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignedTests.map((test) => (
          <Card key={test.id}>
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
            <CardFooter className="flex justify-end gap-2">
              {test.status === "Pending" || test.status === "Overdue" ? (
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
    )
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
          {assignedTests.map((test) => (
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
                {test.status === "Pending" || test.status === "Overdue" ? (
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
  )
}

