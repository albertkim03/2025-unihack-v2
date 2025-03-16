// @ts-nocheck

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Users, FileText, BarChart3 } from "lucide-react"
import { ClassroomMembers } from "@/components/classroom-members"
import { ClassroomTests } from "@/components/classroom-tests"
import { ClassroomSettings } from "@/components/classroom-settings"

export function ClassroomClientWrapper({ classroom }) {
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{classroom.name}</h1>
                    <p className="text-muted-foreground">{classroom.description}</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="members">
                        <Users className="mr-2 h-4 w-4 hidden sm:inline" />
                        Members
                    </TabsTrigger>
                    <TabsTrigger value="tests">
                        <FileText className="mr-2 h-4 w-4 hidden sm:inline" />
                        Tests
                    </TabsTrigger>
                    {classroom.isOwner && (
                        <TabsTrigger value="settings">
                            <Settings className="mr-2 h-4 w-4 hidden sm:inline" />
                            Settings
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Members</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{classroom._count.members}</div>
                                <div className="flex mt-2 -space-x-2">
                                    {classroom.members.map((member, i) => (
                                        <Avatar key={i} className="border-2 border-background">
                                            <AvatarImage
                                                src={
                                                    member.user.image || `/placeholder.svg?height=32&width=32&text=${member.user.firstName[0]}`
                                                }
                                            />
                                            <AvatarFallback 
                                                className={`bg-[#${member?.user?.iconColor || 'e5e7eb'}]`} 
                                                style={{ backgroundColor: `#${member?.user?.iconColor || 'e5e7eb'}` }}
                                            >
                                                {member.user.firstName[0]}
                                                {member.user.lastName[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {classroom._count.members > 5 && (
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                            +{classroom._count.members - 5}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tests</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{classroom._count.tests}</div>
                                <p className="text-xs text-muted-foreground mt-2">{classroom.completionRate}% completion rate</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{classroom.averageScore.toFixed(1)}%</div>
                                <p className="text-xs text-muted-foreground mt-2">Across all tests</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Subject</CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{classroom.subject}</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Created on {new Date(classroom.createdAt).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {classroom.recentTests && classroom.recentTests.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Tests</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {classroom.recentTests.map((test) => (
                                        <li key={test.id} className="flex justify-between items-center">
                                            <span>{test.name}</span>
                                            <span className="text-sm text-muted-foreground">
                        {new Date(test.updatedAt).toLocaleDateString()}
                      </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="members">
                    <ClassroomMembers classroomId={classroom.id} isOwner={classroom.isOwner} />
                </TabsContent>

                <TabsContent value="tests">
                    <ClassroomTests classroomId={classroom.id} isOwner={classroom.isOwner} />
                </TabsContent>

                {classroom.isOwner && (
                    <TabsContent value="settings">
                        <ClassroomSettings classroomId={classroom.id} classroom={classroom} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}

