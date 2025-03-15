import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText, MoreHorizontal } from "lucide-react"

export function RecentTests() {
  const tests = [
    {
      id: "TEST-1234",
      name: "Physics: Mechanics Fundamentals",
      subject: "Physics",
      created: "2 days ago",
      status: "Assigned",
      completion: "8/24",
    },
    {
      id: "TEST-1235",
      name: "Chemistry: Periodic Table Quiz",
      subject: "Chemistry",
      created: "3 days ago",
      status: "Completed",
      completion: "22/22",
    },
    {
      id: "TEST-1236",
      name: "Biology: Cell Structure",
      subject: "Biology",
      created: "1 week ago",
      status: "Completed",
      completion: "18/20",
    },
    {
      id: "TEST-1237",
      name: "Mathematics: Calculus Basics",
      subject: "Mathematics",
      created: "2 weeks ago",
      status: "Completed",
      completion: "15/15",
    },
    {
      id: "TEST-1238",
      name: "Computer Science: Algorithms",
      subject: "Computer Science",
      created: "3 weeks ago",
      status: "Archived",
      completion: "17/17",
    },
  ]

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
              <TableCell>{test.created}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    test.status === "Assigned" ? "outline" : test.status === "Completed" ? "default" : "secondary"
                  }
                >
                  {test.status}
                </Badge>
              </TableCell>
              <TableCell>{test.completion}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View test</span>
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

