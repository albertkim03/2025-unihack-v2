import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Share, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface PersonalTestsListProps {
  viewType: string
}

export function PersonalTestsList({ viewType }: PersonalTestsListProps) {
  const personalTests = [
    {
      id: "TEST-1001",
      name: "Physics: Wave Properties",
      subject: "Physics",
      created: "Mar 14, 2025",
      questions: 15,
      status: "Draft",
      shared: false,
    },
    {
      id: "TEST-1002",
      name: "Chemistry: Organic Compounds",
      subject: "Chemistry",
      created: "Mar 10, 2025",
      questions: 20,
      status: "Published",
      shared: true,
    },
    {
      id: "TEST-1003",
      name: "Biology: Genetics Basics",
      subject: "Biology",
      created: "Mar 8, 2025",
      questions: 12,
      status: "Published",
      shared: false,
    },
    {
      id: "TEST-1004",
      name: "Mathematics: Differential Equations",
      subject: "Mathematics",
      created: "Mar 5, 2025",
      questions: 10,
      status: "Published",
      shared: true,
    },
    {
      id: "TEST-1005",
      name: "Computer Science: Data Structures",
      subject: "Computer Science",
      created: "Mar 1, 2025",
      questions: 18,
      status: "Draft",
      shared: false,
    },
  ]

  if (viewType === "grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {personalTests.map((test) => (
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
                  <p className="font-medium">{test.created}</p>
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
            <CardFooter className="flex justify-between gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </Button>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </div>
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
            <TableHead>Created</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shared</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {personalTests.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.name}</TableCell>
              <TableCell>{test.subject}</TableCell>
              <TableCell>{test.created}</TableCell>
              <TableCell>{test.questions}</TableCell>
              <TableCell>
                <Badge variant={test.status === "Published" ? "default" : "outline"}>{test.status}</Badge>
              </TableCell>
              <TableCell>{test.shared ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right">
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
  )
}

