// @ts-nocheck

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
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
import { Label } from "@/components/ui/label"
import { UserPlus, Search, Mail, Copy, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export function ClassroomMembers({ classroomId, isOwner = false }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("student")
  const [joinCode, setJoinCode] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/classrooms/${classroomId}/members`)
        if (!response.ok) throw new Error("Failed to fetch members")
        const data = await response.json()
        setMembers(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching members:", error)
        setLoading(false)
      }
    }

    const fetchJoinCode = async () => {
      try {
        const response = await fetch(`/api/classrooms/${classroomId}`)
        if (!response.ok) throw new Error("Failed to fetch classroom")
        const data = await response.json()
        setJoinCode(data.joinCode || "")
      } catch (error) {
        console.error("Error fetching join code:", error)
      }
    }

    fetchMembers()
    if (isOwner) {
      fetchJoinCode()
    }
  }, [classroomId, isOwner])

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.user.firstName} ${member.user.lastName}`.toLowerCase()
    const email = member.user.email.toLowerCase()
    const query = searchQuery.toLowerCase()
    return fullName.includes(query) || email.includes(query)
  })

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/classrooms/${classroomId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to invite member")
      }

      console.log(response)
      const newMember = await response.json()
      setMembers([...members, newMember])
      setInviteEmail("")
      setIsInviteDialogOpen(false)

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      })
    } catch (error) {
      console.error("Error inviting member:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to invite member",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(`/api/classrooms/${classroomId}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      setMembers(members.filter((member) => member.id !== memberId))

      toast({
        title: "Success",
        description: "Member removed successfully",
      })
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      const response = await fetch(`/api/classrooms/${classroomId}/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      setMembers(members.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))

      toast({
        title: "Success",
        description: "Role updated successfully",
      })
    } catch (error) {
      console.error("Error updating role:", error)
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      })
    }
  }

  const copyJoinCode = () => {
    navigator.clipboard.writeText(joinCode)
    toast({
      title: "Copied!",
      description: "Join code copied to clipboard",
    })
  }

  if (loading) {
    return (
        <Card>
          <CardHeader>
            <CardTitle>Classroom Members</CardTitle>
            <CardDescription>Loading members...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
    )
  }

  return (
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Classroom Members</CardTitle>
            <CardDescription>Manage students in this classroom</CardDescription>
          </div>
          {isOwner && (
              <div className="flex space-x-2">
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Invite
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite to Classroom</DialogTitle>
                      <DialogDescription>Send an invitation to join this classroom</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            placeholder="student@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Join Code</Label>
                        <div className="flex">
                          <Input value={joinCode} readOnly className="rounded-r-none" />
                          <Button variant="secondary" className="rounded-l-none" onClick={copyJoinCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Share this code with students to let them join the classroom
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleInvite}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Invite
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 font-medium border-b">
              <div className="col-span-5">Name</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-1"></div>
            </div>
            <div className="divide-y">
              {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                      <div key={member.id} className="grid grid-cols-12 p-4 items-center">
                        <div className="col-span-5 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={
                                    member.user.image || `/placeholder.svg?height=32&width=32&text=${member.user.firstName[0]}`
                                }
                            />
                            <AvatarFallback>
                              {member.user.firstName[0]}
                              {member.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                      {member.user.firstName} {member.user.lastName}
                    </span>
                        </div>
                        <div className="col-span-4 truncate">{member.user.email}</div>
                        <div className="col-span-2 capitalize">{member.role}</div>
                        <div className="col-span-1 text-right">
                          {isOwner && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                      onClick={() =>
                                          handleUpdateRole(member.id, member.role === "student" ? "teacher" : "student")
                                      }
                                  >
                                    Change to {member.role === "student" ? "Teacher" : "Student"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRemoveMember(member.id)}>Remove</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                          )}
                        </div>
                      </div>
                  ))
              ) : (
                  <div className="p-4 text-center text-muted-foreground">No members found</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  )
}

