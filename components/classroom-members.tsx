"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  UserPlus,
  Mail,
  MoreHorizontal,
  UserCog,
  UserMinus,
  Download,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

interface ClassroomMembersProps {
  classroomId: string
}

export function ClassroomMembers({ classroomId }: ClassroomMembersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmails, setInviteEmails] = useState("")
  const [selectedRole, setSelectedRole] = useState("student")

  // Mock members data
  const members = [
    {
      id: "user-1",
      name: "Emma Miller",
      email: "emma.miller@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=EM",
      role: "Student",
      joinedAt: "Feb 15, 2025",
      status: "Active",
      testsCompleted: 8,
      averageScore: 95,
    },
    {
      id: "user-2",
      name: "James Chen",
      email: "james.chen@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=JC",
      role: "Student",
      joinedAt: "Feb 16, 2025",
      status: "Active",
      testsCompleted: 7,
      averageScore: 92,
    },
    {
      id: "user-3",
      name: "Sophia Patel",
      email: "sophia.patel@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=SP",
      role: "Student",
      joinedAt: "Feb 18, 2025",
      status: "Active",
      testsCompleted: 8,
      averageScore: 89,
    },
    {
      id: "user-4",
      name: "Michael Johnson",
      email: "michael.j@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=MJ",
      role: "Student",
      joinedAt: "Feb 20, 2025",
      status: "Active",
      testsCompleted: 6,
      averageScore: 87,
    },
    {
      id: "user-5",
      name: "Olivia Rodriguez",
      email: "olivia.r@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=OR",
      role: "Teaching Assistant",
      joinedAt: "Jan 25, 2025",
      status: "Active",
      testsCompleted: 8,
      averageScore: 94,
    },
    {
      id: "user-6",
      name: "William Taylor",
      email: "william.t@example.com",
      avatar: "/placeholder.svg?height=40&width=40&text=WT",
      role: "Student",
      joinedAt: "Feb 22, 2025",
      status: "Pending",
      testsCompleted: 0,
      averageScore: 0,
    },
  ]

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleInvite = () => {
    // In a real app, this would send invitations to the emails
    console.log(
      "Inviting:",
      inviteEmails.split(/[\n,]+/).map((email) => email.trim()),
    )
    console.log("Role:", selectedRole)
    setInviteEmails("")
    setShowInviteDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Members
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Members</DialogTitle>
                <DialogDescription>Invite new members to join your classroom</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Addresses</label>
                  <textarea
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter email addresses (one per line or comma-separated)"
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recipients will receive an email invitation to join this classroom
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teaching-assistant">Teaching Assistant</SelectItem>
                      <SelectItem value="co-teacher">Co-Teacher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInvite}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitations
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select defaultValue="role">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teaching-assistant">Teaching Assistants</SelectItem>
                <SelectItem value="co-teacher">Co-Teachers</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tests Completed</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.joinedAt}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === "Active" ? "default" : "outline"} className="capitalize">
                          {member.status === "Active" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : member.status === "Pending" ? (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.testsCompleted}</TableCell>
                      <TableCell>{member.averageScore > 0 ? `${member.averageScore}%` : "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove from Classroom
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Tests Completed</TableHead>
                    <TableHead>Avg. Score</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers
                    .filter((member) => member.status === "Active")
                    .map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.joinedAt}</TableCell>
                        <TableCell>{member.testsCompleted}</TableCell>
                        <TableCell>{member.averageScore > 0 ? `${member.averageScore}%` : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <UserCog className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <UserMinus className="mr-2 h-4 w-4" />
                                Remove from Classroom
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers
                    .filter((member) => member.status === "Pending")
                    .map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{member.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.joinedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Mail className="mr-2 h-3 w-3" />
                            Resend
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <XCircle className="mr-2 h-3 w-3" />
                            Cancel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

