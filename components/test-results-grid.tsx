import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"

export function TestResultsGrid() {
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <Card key={result.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{result.name}</CardTitle>
              <Badge
                variant={
                  result.status === "Completed" ? "default" : result.status === "In Progress" ? "outline" : "secondary"
                }
              >
                {result.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Subject</p>
                <p className="font-medium">{result.subject}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Classroom</p>
                <p className="font-medium">{result.classroom}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{result.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Completion</p>
                <p className="font-medium">{result.completion}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-muted-foreground text-sm">Average Score</p>
              <p className="text-2xl font-bold">{result.avgScore}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Details
            </Button>
            <Button variant="ghost" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Results
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

