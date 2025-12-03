import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, CreditCard, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Platform-wide metrics and system administration</p>
        </div>

        {/* Platform Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">24,532</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+1,234</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Organizations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3,421</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+156</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$145,231</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+23.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">+18.2%</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">+2.4%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time platform status and uptime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-foreground">API Services</p>
                    <p className="text-sm text-muted-foreground">All systems operational</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">99.9%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-foreground">Database</p>
                    <p className="text-sm text-muted-foreground">Healthy connections</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">100%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-foreground">Email Service</p>
                    <p className="text-sm text-muted-foreground">Slight delays detected</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-yellow-600">97.2%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-foreground">Payment Processing</p>
                    <p className="text-sm text-muted-foreground">Operating normally</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">99.8%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    event: "New organization created",
                    user: "TechCorp Inc.",
                    time: "5 minutes ago",
                    type: "success",
                  },
                  {
                    event: "Payment received",
                    user: "Acme Corp - $79.00",
                    time: "12 minutes ago",
                    type: "success",
                  },
                  {
                    event: "Failed login attempt",
                    user: "user@example.com",
                    time: "23 minutes ago",
                    type: "warning",
                  },
                  {
                    event: "Subscription upgraded",
                    user: "StartupXYZ",
                    time: "1 hour ago",
                    type: "success",
                  },
                  {
                    event: "User deleted account",
                    user: "john@example.com",
                    time: "2 hours ago",
                    type: "info",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div
                      className={`h-2 w-2 rounded-full mt-2 ${
                        item.type === "success"
                          ? "bg-green-500"
                          : item.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.user}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Breakdown of active subscriptions by plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Starter Plan</span>
                  <span className="text-sm font-bold text-foreground">1,234</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "36%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">36% of total</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Professional Plan</span>
                  <span className="text-sm font-bold text-foreground">1,876</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "55%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">55% of total</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Enterprise Plan</span>
                  <span className="text-sm font-bold text-foreground">311</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "9%" }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">9% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
