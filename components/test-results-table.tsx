import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, FileText, MoreHorizontal } from "lucide-react"

export function TestResultsTable() {
  const results = [
    {
      id: "TEST-1234",
      name: "Physics: Mechanics Fundamentals",
      subject: "Physics",
      classroom: "Physics 101",
      date: "Mar 12, 2025",
      avgScore: "82%",
      completion: "24/24",
      status: "Completed",
    },
    {
      id: "TEST-1235",
      name: "Chemistry: Periodic Table Quiz",
      subject: "Chemistry",
      classroom: "Advanced Chemistry",
      date: "Mar 10, 2025",
      avgScore: "76%",
      completion: "22/22",
      status: "Completed",
    },
    {
      id: "TEST-1236",
      name: "Biology: Cell Structure",
      subject: "Biology",
      classroom: "Biology Fundamentals",
      date: "Mar 5, 2025",
      avgScore: "88%",
      completion: "18/20",
      status: "Completed",
    },
    {
      id: "TEST-1237",
      name: "Mathematics: Calculus Basics",
      subject: "Mathematics",
      classroom: "Calculus II",
      date: "Feb 28, 2025",
      avgScore: "71%",
      completion: "15/15",
      status: "Completed",
    },
    {
      id: "TEST-1238",
      name: "Computer Science: Algorithms",
      subject: "Computer Science",
      classroom: "Personal",
      date: "Feb 20, 2025",
      avgScore: "85%",
      completion: "17/17",
      status: "Completed",
    },
    {
      id: "TEST-1239",
      name: "Physics: Electricity & Magnetism",
      subject: "Physics",
      classroom: "Physics 101",
      date: "Mar 14, 2025",
      avgScore: "N/A",
      completion: "8/24",
      status: "In Progress",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Test Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Classroom</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Avg. Score</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">{result.name}</TableCell>
              <TableCell>{result.subject}</TableCell>
              <TableCell>{result.classroom}</TableCell>
              <TableCell>{result.date}</TableCell>
              <TableCell>{result.avgScore}</TableCell>
              <TableCell>{result.completion}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    result.status === "Completed"
                      ? "default"
                      : result.status === "In Progress"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {result.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">View results</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

