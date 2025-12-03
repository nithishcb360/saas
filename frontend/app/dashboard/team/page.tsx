import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, MoreVertical, Mail, Shield, User } from "lucide-react"

const teamMembers = [
  {
    name: "John Doe",
    email: "john@acme.com",
    role: "Owner",
    status: "Active",
    avatar: "/placeholder.svg?key=john",
    initials: "JD",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@acme.com",
    role: "Admin",
    status: "Active",
    avatar: "/placeholder.svg?key=sarah",
    initials: "SJ",
  },
  {
    name: "Mike Chen",
    email: "mike@acme.com",
    role: "Member",
    status: "Active",
    avatar: "/placeholder.svg?key=mike",
    initials: "MC",
  },
  {
    name: "Emma Wilson",
    email: "emma@acme.com",
    role: "Member",
    status: "Active",
    avatar: "/placeholder.svg?key=emma",
    initials: "EW",
  },
]

const pendingInvites = [
  { email: "tom@acme.com", role: "Member", sentDate: "2 days ago" },
  { email: "lisa@acme.com", role: "Admin", sentDate: "5 days ago" },
]

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Team</h1>
            <p className="text-muted-foreground mt-1">Manage your team members and their roles</p>
          </div>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>{teamMembers.length} active members in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.email} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{member.role}</Badge>
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{member.status}</Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="h-4 w-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Invites */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Invites</CardTitle>
            <CardDescription>Invitations that haven't been accepted yet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInvites.map((invite) => (
                <div key={invite.email} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invite.email}</p>
                      <p className="text-sm text-muted-foreground">Sent {invite.sentDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{invite.role}</Badge>
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>
                    <Button variant="outline" size="sm">
                      Resend
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invite New Member */}
        <Card>
          <CardHeader>
            <CardTitle>Invite Team Member</CardTitle>
            <CardDescription>Send an invitation to join your organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="invite-email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input id="invite-email" type="email" placeholder="colleague@company.com" />
              </div>

              <div className="space-y-2">
                <label htmlFor="invite-role" className="text-sm font-medium text-foreground">
                  Role
                </label>
                <select
                  id="invite-role"
                  className="w-full h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Send Invitation
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
