import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Users, BookOpen } from "lucide-react"

export default function ClassroomsPage() {
  const classrooms = [
    {
      id: "class-1",
      name: "Physics 101",
      description: "Introductory physics course",
      students: 24,
      tests: 8,
      recent: "Mechanics Quiz",
    },
    {
      id: "class-2",
      name: "Advanced Chemistry",
      description: "Senior level chemistry course",
      students: 18,
      tests: 12,
      recent: "Organic Chemistry Test",
    },
    {
      id: "class-3",
      name: "Biology Fundamentals",
      description: "Core biology concepts",
      students: 30,
      tests: 6,
      recent: "Cell Structure Quiz",
    },
    {
      id: "class-4",
      name: "Calculus II",
      description: "Advanced calculus topics",
      students: 22,
      tests: 10,
      recent: "Integration Methods",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
        <Button asChild>
          <Link href="/classrooms/create">
            <Plus className="mr-2 h-4 w-4" /> Create Classroom
          </Link>
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search classrooms..." className="pl-8" />
        </div>
      </div>

      <Tabs defaultValue="my-classrooms" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-classrooms">
            <BookOpen className="mr-2 h-4 w-4" />
            My Classrooms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-classrooms">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classrooms.map((classroom) => (
              <Card key={classroom.id}>
                <CardHeader>
                  <CardTitle>{classroom.name}</CardTitle>
                  <CardDescription>{classroom.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <Avatar key={i} className="border-2 border-background">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i + 1}`} />
                          <AvatarFallback>S{i + 1}</AvatarFallback>
                        </Avatar>
                      ))}
                      {classroom.students > 3 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{classroom.students - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-1 h-4 w-4" />
                      {classroom.students} students
                    </div>
                  </div>
                  <div className="mt-4 text-sm">
                    <p>
                      <strong>Tests:</strong> {classroom.tests}
                    </p>
                    <p>
                      <strong>Recent:</strong> {classroom.recent}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/classrooms/${classroom.id}`}>View Classroom</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

