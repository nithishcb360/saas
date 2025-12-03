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
import { Search, MoreVertical, Mail, Ban, CheckCircle, Shield, Eye, Download } from "lucide-react"

const users = [
  {
    name: "John Doe",
    email: "john@acme.com",
    organization: "Acme Inc.",
    plan: "Professional",
    status: "Active",
    joined: "Jan 15, 2025",
    lastActive: "2 hours ago",
    mrr: "$50",
    avatar: "/placeholder.svg?key=u1",
    initials: "JD",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    organization: "TechCorp",
    plan: "Enterprise",
    status: "Active",
    joined: "Jan 10, 2025",
    lastActive: "5 minutes ago",
    mrr: "$199",
    avatar: "/placeholder.svg?key=u2",
    initials: "SJ",
  },
  {
    name: "Mike Chen",
    email: "mike@startup.io",
    organization: "StartupXYZ",
    plan: "Starter",
    status: "Active",
    joined: "Jan 8, 2025",
    lastActive: "1 day ago",
    mrr: "$29",
    avatar: "/placeholder.svg?key=u3",
    initials: "MC",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    organization: "Freelance",
    plan: "Professional",
    status: "Suspended",
    joined: "Dec 20, 2024",
    lastActive: "3 weeks ago",
    mrr: "$0",
    avatar: "/placeholder.svg?key=u4",
    initials: "EW",
  },
  {
    name: "Tom Brown",
    email: "tom@company.com",
    organization: "Company LLC",
    plan: "Starter",
    status: "Active",
    joined: "Dec 15, 2024",
    lastActive: "1 hour ago",
    mrr: "$29",
    avatar: "/placeholder.svg?key=u5",
    initials: "TB",
  },
]

export default function AdminUsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">View and manage all platform users</p>
          </div>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
        </div>

        {/* User Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24,532</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+1,234</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">23,456</div>
              <p className="text-xs text-muted-foreground mt-1">95.6% active rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">76</div>
              <p className="text-xs text-muted-foreground mt-1">0.3% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR from Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$145,231</div>
              <p className="text-xs text-muted-foreground mt-1">Average: $5.92/user</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users by name, email, or organization..." className="pl-10" />
              </div>
              <select className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">All Plans</option>
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <select className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>{users.length.toLocaleString()} users with detailed activity tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Active"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-red-500/10 text-red-600 border-red-500/20"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{user.organization}</span>
                      <span>•</span>
                      <span>Joined {user.joined}</span>
                      <span>•</span>
                      <span>Active {user.lastActive}</span>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{user.plan}</p>
                      <p className="text-xs text-muted-foreground">{user.mrr}/mo</p>
                    </div>
                  </div>

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
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="h-4 w-4 mr-2" />
                        Impersonate User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Ban className="h-4 w-4 mr-2" />
                        {user.status === "Active" ? "Suspend User" : "Activate User"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
