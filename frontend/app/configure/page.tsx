"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Palette, Rocket, FileText, Download, Eye } from "lucide-react"
import Link from "next/link"

const domainTemplates = [
  {
    id: "crm",
    name: "CRM Platform",
    description: "Customer relationship management with contacts, deals, pipeline",
    color: "#3b82f6",
    features: ["Contact Management", "Deal Pipeline", "Activity Tracking", "Email Integration"],
  },
  {
    id: "project",
    name: "Project Management",
    description: "Task tracking, team collaboration, project timelines",
    color: "#8b5cf6",
    features: ["Task Boards", "Team Collaboration", "Gantt Charts", "Time Tracking"],
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Appointments, scheduling, calendar management",
    color: "#10b981",
    features: ["Calendar Integration", "Booking Forms", "Reminders", "Payment Processing"],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    description: "Product catalog, orders, inventory, payments",
    color: "#f59e0b",
    features: ["Product Catalog", "Shopping Cart", "Order Management", "Inventory Tracking"],
  },
  {
    id: "healthcare",
    name: "Healthcare Portal",
    description: "Patient records, appointments, prescriptions",
    color: "#06b6d4",
    features: ["Patient Records", "Appointment Scheduling", "Medical History", "Prescriptions"],
  },
  {
    id: "custom",
    name: "Custom Domain",
    description: "Define your own domain requirements",
    color: "#64748b",
    features: ["Fully Customizable", "Any Industry", "Tailored Features"],
  },
]

const colorPresets = [
  { name: "Blue Professional", primary: "#3b82f6", secondary: "#1e40af" },
  { name: "Purple Modern", primary: "#8b5cf6", secondary: "#6d28d9" },
  { name: "Green Growth", primary: "#10b981", secondary: "#059669" },
  { name: "Orange Energy", primary: "#f59e0b", secondary: "#d97706" },
  { name: "Teal Medical", primary: "#06b6d4", secondary: "#0891b2" },
  { name: "Red Bold", primary: "#ef4444", secondary: "#dc2626" },
]

export default function ConfigurePage() {
  const [clientName, setClientName] = useState("")
  const [productName, setProductName] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("")
  const [customRequirements, setCustomRequirements] = useState("")
  const [selectedColorPreset, setSelectedColorPreset] = useState(colorPresets[0])
  const [customPrimary, setCustomPrimary] = useState("#3b82f6")
  const [customSecondary, setCustomSecondary] = useState("#1e40af")

  const selectedTemplate = domainTemplates.find((t) => t.id === selectedDomain)

  const handleGenerate = () => {
    // This would trigger the demo generation with the configured settings
    console.log("[v0] Generating demo with config:", {
      clientName,
      productName,
      domain: selectedDomain,
      requirements: customRequirements,
      colors: { primary: customPrimary, secondary: customSecondary },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl text-foreground">SaaSKit Configurator</span>
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Eye className="h-4 w-4" />
                  Preview Demo
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="ghost" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Dev Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Configure Your Client Demo</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Customize the SaaS skeleton for your client's domain. Generate an enterprise-grade investor demo in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Configuration Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client & Product Info */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Client Information
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    placeholder="e.g., Acme Corporation"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., SalesFlow Pro"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </Card>

            {/* Domain Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Domain Type
              </h2>

              <div className="grid md:grid-cols-2 gap-3">
                {domainTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedDomain(template.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedDomain === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="h-3 w-3 rounded-full mb-2" style={{ backgroundColor: template.color }} />
                    <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </button>
                ))}
              </div>

              {selectedTemplate && selectedDomain !== "custom" && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground mb-2">Included Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.features.map((feature) => (
                      <Badge key={feature} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Custom Requirements */}
            {selectedDomain === "custom" && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Custom Requirements</h2>
                <Textarea
                  placeholder="Describe the key features and functionality needed for this domain. Be specific about the main user workflows and data models.

Example: 
- Manage customer contacts with custom fields
- Track sales pipeline with drag-and-drop stages
- Email integration for communication tracking
- Reporting dashboard with revenue metrics"
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </Card>
            )}

            {/* Theme Customization */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Brand Colors
              </h2>

              <div className="space-y-4">
                <div>
                  <Label>Color Presets</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setSelectedColorPreset(preset)
                          setCustomPrimary(preset.primary)
                          setCustomSecondary(preset.secondary)
                        }}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedColorPreset.name === preset.name
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="flex gap-2 mb-2">
                          <div className="h-4 w-4 rounded" style={{ backgroundColor: preset.primary }} />
                          <div className="h-4 w-4 rounded" style={{ backgroundColor: preset.secondary }} />
                        </div>
                        <p className="text-sm font-medium text-foreground">{preset.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={customPrimary}
                        onChange={(e) => setCustomPrimary(e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={customSecondary}
                        onChange={(e) => setCustomSecondary(e.target.value)}
                        className="flex-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Generate Button */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleGenerate}
                disabled={!clientName || !productName || !selectedDomain}
              >
                <Rocket className="h-5 w-5" />
                Generate Enterprise Demo
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Download className="h-5 w-5" />
                Export Config
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Preview</h3>

                <div className="space-y-4">
                  {/* Brand Preview */}
                  <div className="p-6 rounded-lg" style={{ backgroundColor: customPrimary }}>
                    <h4 className="text-white font-bold text-xl mb-1">{productName || "Your Product"}</h4>
                    <p className="text-white/80 text-sm">{clientName || "Client Name"}</p>
                  </div>

                  {/* Button Preview */}
                  <div className="space-y-2">
                    <button
                      className="w-full py-2 px-4 rounded-lg font-medium text-white"
                      style={{ backgroundColor: customPrimary }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="w-full py-2 px-4 rounded-lg font-medium"
                      style={{
                        backgroundColor: customSecondary + "20",
                        color: customSecondary,
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>

                  {/* Configuration Summary */}
                  <div className="pt-4 border-t space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Domain</p>
                      <p className="text-sm font-medium text-foreground">{selectedTemplate?.name || "Not selected"}</p>
                    </div>
                    {selectedTemplate && selectedDomain !== "custom" && (
                      <div>
                        <p className="text-xs text-muted-foreground">Features</p>
                        <p className="text-sm text-foreground">{selectedTemplate.features.length} components</p>
                      </div>
                    )}
                  </div>

                  {/* What Gets Generated */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-foreground mb-2">What You'll Get:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Branded landing page</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Domain-specific dashboard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Complete auth flows</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Billing & subscriptions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Team management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Admin panel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Mobile responsive</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span>Dev handoff docs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
