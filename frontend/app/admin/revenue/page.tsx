import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, RefreshCw, Download } from "lucide-react"

export default function AdminRevenuePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Revenue Analytics</h1>
            <p className="text-muted-foreground mt-1">Track MRR, ARR, churn, and revenue metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Revenue Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MRR</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$145,231</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600">+12.5% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ARR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$1,742,772</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600">+18.2% year over year</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2.3%</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600">-0.5% improvement</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ARPU</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$42.45</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <p className="text-xs text-green-600">+3.2% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Plan</CardTitle>
              <CardDescription>Monthly recurring revenue breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Starter Plan</span>
                  <span className="font-medium text-foreground">$24,680</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "17%" }} />
                </div>
                <p className="text-xs text-muted-foreground">1,234 subscribers • $20/month avg</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Professional Plan</span>
                  <span className="font-medium text-foreground">$93,800</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "65%" }} />
                </div>
                <p className="text-xs text-muted-foreground">1,876 subscribers • $50/month avg</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Enterprise Plan</span>
                  <span className="font-medium text-foreground">$26,751</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: "18%" }} />
                </div>
                <p className="text-xs text-muted-foreground">311 subscribers • $86/month avg</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Distribution of payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Credit Card</p>
                    <p className="text-sm text-muted-foreground">2,847 customers</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">83.2%</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Bank Transfer</p>
                    <p className="text-sm text-muted-foreground">398 customers</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">11.6%</span>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">PayPal</p>
                    <p className="text-sm text-muted-foreground">176 customers</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">5.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Growth Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth Trend</CardTitle>
            <CardDescription>Monthly revenue progression over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: "November 2024", mrr: "$115,234", growth: "+8.2%" },
                { month: "December 2024", mrr: "$122,891", growth: "+6.6%" },
                { month: "January 2025", mrr: "$145,231", growth: "+18.2%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.month}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{item.mrr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Growth</p>
                    <p className="text-lg font-semibold text-green-600 mt-1">{item.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cohort Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Lifetime Value</CardTitle>
            <CardDescription>Average LTV by customer segment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Starter Customers</p>
                <p className="text-2xl font-bold text-foreground mt-2">$240</p>
                <p className="text-xs text-muted-foreground mt-1">Avg. 12 month retention</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Professional Customers</p>
                <p className="text-2xl font-bold text-foreground mt-2">$850</p>
                <p className="text-xs text-muted-foreground mt-1">Avg. 17 month retention</p>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Enterprise Customers</p>
                <p className="text-2xl font-bold text-foreground mt-2">$2,150</p>
                <p className="text-xs text-muted-foreground mt-1">Avg. 25 month retention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
