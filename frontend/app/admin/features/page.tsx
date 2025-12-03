import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"

const featureFlags = [
  {
    name: "advanced_analytics",
    label: "Advanced Analytics Dashboard",
    description: "Enable advanced analytics with custom reports and data exports",
    enabled: true,
    environments: ["production", "staging"],
    users: 2847,
  },
  {
    name: "ai_insights",
    label: "AI-Powered Insights",
    description: "Show AI-generated insights and recommendations in dashboards",
    enabled: true,
    environments: ["production"],
    users: 1234,
  },
  {
    name: "team_collaboration",
    label: "Team Collaboration Tools",
    description: "Enable real-time collaboration features for team workspaces",
    enabled: false,
    environments: [],
    users: 0,
  },
  {
    name: "custom_branding",
    label: "Custom Branding",
    description: "Allow enterprise customers to customize platform branding",
    enabled: true,
    environments: ["production"],
    users: 311,
  },
  {
    name: "api_v2",
    label: "API v2 Endpoints",
    description: "Next generation API with improved performance and features",
    enabled: false,
    environments: ["staging"],
    users: 45,
  },
  {
    name: "sso_integration",
    label: "SSO Integration",
    description: "Enable Single Sign-On with SAML and OAuth providers",
    enabled: true,
    environments: ["production", "staging"],
    users: 876,
  },
]

export default function AdminFeaturesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Feature Flags</h1>
            <p className="text-muted-foreground mt-1">Manage feature rollouts and A/B testing</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Feature Flag
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-3">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search feature flags..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {featureFlags.filter((f) => f.enabled).length}/{featureFlags.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Flags List */}
        <Card>
          <CardHeader>
            <CardTitle>All Feature Flags</CardTitle>
            <CardDescription>Control feature availability across environments and user segments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featureFlags.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{feature.label}</h3>
                      <Badge
                        variant="outline"
                        className={
                          feature.enabled
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                        }
                      >
                        {feature.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">{feature.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Key: {feature.name}</span>
                      {feature.environments.length > 0 && (
                        <>
                          <span>•</span>
                          <span>Environments: {feature.environments.join(", ")}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{feature.users.toLocaleString()} users affected</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Switch checked={feature.enabled} />
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Flag Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Test new features in staging before enabling in production</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Use percentage rollouts for gradual feature releases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Remove feature flags once features are fully rolled out</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Document dependencies between feature flags</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
