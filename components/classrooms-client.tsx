// @ts-nocheck

"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, Users, BookOpen, UserPlus } from "lucide-react"

interface ClassroomOverviewProps {
    classrooms: Classroom[]
  }

export function ClassroomsClient({ initialClassrooms, classrooms = [] }: ClassroomOverviewProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("owned")

    // Filter classrooms based on search term
    const filterClassrooms = (classrooms) => {
        if (!searchTerm) return classrooms

        return classrooms.filter(
            (classroom) =>
                classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                classroom.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }

    const filteredOwned = filterClassrooms(initialClassrooms.owned)
    const filteredMember = filterClassrooms(initialClassrooms.member)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Classrooms</h1>
                {(initialClassrooms.owned.length > 0 || initialClassrooms.member.length > 0) && (
                    <Button asChild>
                        <Link href="/classrooms/create">
                            <Plus className="mr-2 h-4 w-4" /> Create Classroom
                        </Link>
                    </Button>
                )}
            </div>

            <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search classrooms..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="owned">
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Classrooms
                    </TabsTrigger>
                    <TabsTrigger value="member">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Enrolled
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="owned">
                    {filteredOwned.length === 0 ? (
                        <div className="text-center py-10">
                            <h3 className="text-lg font-medium">No classrooms found</h3>
                            <p className="text-muted-foreground mt-1">
                                {searchTerm ? "Try a different search term" : "Create your first classroom to get started"}
                            </p>
                            {!searchTerm && (
                                <Button asChild className="mt-4">
                                    <Link href="/classrooms/create">
                                        <Plus className="mr-2 h-4 w-4" /> Create Classroom
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredOwned.map((classroom) => (
                                <ClassroomCard key={classroom.id} classroom={classroom} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="member">
                    {filteredMember.length === 0 ? (
                        <div className="text-center py-10">
                            <h3 className="text-lg font-medium">No enrolled classrooms found</h3>
                            <p className="text-muted-foreground mt-1">
                                {searchTerm ? "Try a different search term" : "You haven't joined any classrooms yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredMember.map((classroom) => (
                                <ClassroomCard key={classroom.id} classroom={classroom} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

function ClassroomCard({ classroom }) {
    return (
        <Card key={classroom.id}>
            <CardHeader>
                <CardTitle>{classroom.name}</CardTitle>
                <CardDescription>{classroom.description}</CardDescription>
                {classroom.owner && <p className="text-sm text-muted-foreground mt-1">Teacher: {classroom.owner}</p>}
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                        {[...Array(Math.min(3, classroom.students))].map((_, i) => (
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
    )
}

