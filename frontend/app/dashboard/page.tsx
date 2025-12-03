import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Users, DollarSign, Activity, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your account.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$45,231</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+20.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2,350</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+180</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+4.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">573</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+201</span> since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-4 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Your revenue performance over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">Chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "Sarah Johnson", action: "created a new project", time: "2 hours ago" },
                  { user: "Mike Chen", action: "completed onboarding", time: "4 hours ago" },
                  { user: "Emma Wilson", action: "upgraded to Pro plan", time: "5 hours ago" },
                  { user: "Tom Brown", action: "invited 3 team members", time: "1 day ago" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {item.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.user}</p>
                      <p className="text-sm text-muted-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2 bg-transparent">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Invite Team</span>
                <span className="text-xs text-muted-foreground">Add members to collaborate</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2 bg-transparent">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="font-medium">Upgrade Plan</span>
                <span className="text-xs text-muted-foreground">Unlock premium features</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2 bg-transparent">
                <Activity className="h-5 w-5 text-primary" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-muted-foreground">Deep dive into metrics</span>
              </Button>

              <Button variant="outline" className="h-auto flex-col items-start p-4 gap-2 bg-transparent">
                <ArrowUpRight className="h-5 w-5 text-primary" />
                <span className="font-medium">Documentation</span>
                <span className="text-xs text-muted-foreground">Learn how to use the platform</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
