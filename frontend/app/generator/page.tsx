"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  Zap,
  Database,
  Users,
  CreditCard,
  Shield,
  BarChart3,
  Send,
  Loader2,
  CheckCircle2,
  Smartphone,
} from "lucide-react"
import Link from "next/link"

const templates = [
  {
    name: "CRM Platform",
    description: "Customer relationship management with contacts, deals, and pipeline tracking",
    domain: "Sales & Marketing",
    icon: Users,
  },
  {
    name: "Project Management",
    description: "Task tracking, kanban boards, gantt charts, and team collaboration",
    domain: "Productivity",
    icon: BarChart3,
  },
  {
    name: "Booking System",
    description: "Appointment scheduling, calendar management, and payment processing",
    domain: "Service Business",
    icon: Database,
  },
  {
    name: "E-Learning Platform",
    description: "Course creation, student enrollment, progress tracking, and certifications",
    domain: "Education",
    icon: Shield,
  },
]

const features = [
  { name: "Authentication Flows", icon: Shield, included: true },
  { name: "Subscription & Billing", icon: CreditCard, included: true },
  { name: "Team Management", icon: Users, included: true },
  { name: "Admin Dashboard", icon: BarChart3, included: true },
  { name: "Mobile Responsive", icon: Smartphone, included: true },
  { name: "Domain-Specific Modules", icon: Zap, included: true },
]

export default function GeneratorPage() {
  const [requirement, setRequirement] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false)
      setGenerated(true)
    }, 3000)
  }

  const handleTemplateClick = (templateName: string) => {
    setRequirement(
      `Build a ${templateName} with enterprise-grade features including user authentication, subscription management, and team collaboration tools.`,
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl text-foreground">SaaSKit Generator</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  View Demo
                </Button>
              </Link>
              <Link href="/docs/README-DEV-HANDOFF.md">
                <Button variant="ghost" size="sm">
                  Dev Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Domain-Neutral SaaS Generator
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4 text-balance">
            Generate Enterprise SaaS Demo in Minutes
          </h1>

          <p className="text-xl text-muted-foreground text-pretty">
            Describe your client's requirements and generate a fully-functional investor demo with the SaaS skeleton
            pre-configured for their domain
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Generator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Describe Client Requirements</label>
                  <Textarea
                    placeholder="Example: Build a CRM platform for real estate agents with contact management, deal pipeline tracking, automated follow-ups, and commission calculations. Must support team collaboration and mobile access."
                    className="min-h-[120px] resize-none"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    The generator will create domain-specific modules on top of the SaaS skeleton
                  </p>

                  <Button onClick={handleGenerate} disabled={!requirement || isGenerating} className="gap-2">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : generated ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Regenerate
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Generate Demo
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Generated Output Preview */}
            {generated && (
              <Card className="p-6 border-primary">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Generated Demo Ready</h3>
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Complete</Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Pages Generated</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Landing page with domain copy
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Authentication flows
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Dashboard with domain modules
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Mobile-responsive layouts
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Developer Handoff</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Database schema (SQL)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          API specifications
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Data flow diagrams
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          Frontend integration guide
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full">View Investor Demo</Button>
                    </Link>
                    <Link href="/docs/README-DEV-HANDOFF.md" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        Dev Documentation
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}

            {/* Quick Start Templates */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Start Templates</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.name}
                    className="p-4 hover:border-primary transition-colors cursor-pointer"
                    onClick={() => handleTemplateClick(template.name)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground mb-1">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {template.domain}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Features */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Included in Every Demo</h3>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature.name} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature.name}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 bg-muted/50">
              <h3 className="font-semibold text-foreground mb-3">How It Works</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    1
                  </span>
                  <span>Describe client's SaaS requirements in natural language</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    2
                  </span>
                  <span>System generates domain-specific modules on the SaaS skeleton</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    3
                  </span>
                  <span>Present enterprise-grade demo to investors</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    4
                  </span>
                  <span>Hand off specs to Django team for production build</span>
                </li>
              </ol>
            </Card>

            <Card className="p-6 border-primary/50 bg-primary/5">
              <div className="flex items-start gap-3 mb-3">
                <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Mobile-First Design</h4>
                  <p className="text-sm text-muted-foreground">
                    Every demo is fully responsive with optimized mobile layouts for on-the-go investor presentations
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
