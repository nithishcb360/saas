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
import { Search, MoreVertical, Building2, Users, DollarSign } from "lucide-react"

const organizations = [
  {
    name: "Acme Inc.",
    owner: "john@acme.com",
    members: 12,
    plan: "Professional",
    mrr: "$948",
    status: "Active",
    created: "Jan 15, 2025",
  },
  {
    name: "TechCorp",
    owner: "sarah@techcorp.com",
    members: 45,
    plan: "Enterprise",
    mrr: "$2,500",
    status: "Active",
    created: "Jan 10, 2025",
  },
  {
    name: "StartupXYZ",
    owner: "mike@startup.io",
    members: 5,
    plan: "Starter",
    mrr: "$145",
    status: "Active",
    created: "Jan 8, 2025",
  },
  {
    name: "Company LLC",
    owner: "tom@company.com",
    members: 8,
    plan: "Starter",
    mrr: "$232",
    status: "Active",
    created: "Dec 15, 2024",
  },
  {
    name: "Innovation Labs",
    owner: "lisa@labs.io",
    members: 23,
    plan: "Professional",
    mrr: "$1,817",
    status: "Trial",
    created: "Nov 28, 2024",
  },
]

export default function AdminOrganizationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Organization Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all organizations on the platform</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search organizations by name or owner..." className="pl-10" />
              </div>
              <select className="h-10 px-3 rounded-lg border bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">All Plans</option>
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Organizations Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <Card key={org.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <CardDescription className="text-xs">{org.owner}</CardDescription>
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Contact Owner</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Suspend Organization</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{org.members} members</span>
                  </div>
                  <Badge variant="outline">{org.plan}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{org.mrr} MRR</span>
                  </div>
                  <Badge
                    className={
                      org.status === "Active"
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                    }
                  >
                    {org.status}
                  </Badge>
                </div>

                <div className="pt-3 border-t text-xs text-muted-foreground">Created {org.created}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
