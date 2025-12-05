"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Download, CreditCard, Calendar, X, AlertTriangle, Check } from "lucide-react"
import { useCurrentUser } from "@/hooks/use-current-user"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Invoice data type
interface Invoice {
  date: string
  amount: string
  status: string
  invoice: string
  description: string
}

// Plan type
interface Plan {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  popular?: boolean
}

export default function BillingPage() {
  const { user } = useCurrentUser()
  const { toast } = useToast()
  const [showChangePlanModal, setShowChangePlanModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [currentPlan, setCurrentPlan] = useState("Professional")
  const [isProcessing, setIsProcessing] = useState(false)

  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: 29,
      interval: "month",
      features: [
        "Up to 5 team members",
        "Basic features",
        "Email support",
        "10 GB storage",
        "10,000 API calls/month"
      ]
    },
    {
      id: "professional",
      name: "Professional",
      price: 79,
      interval: "month",
      popular: true,
      features: [
        "Up to 20 team members",
        "Advanced features",
        "Priority support",
        "50 GB storage",
        "100,000 API calls/month",
        "Custom integrations"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199,
      interval: "month",
      features: [
        "Unlimited team members",
        "All features",
        "24/7 dedicated support",
        "500 GB storage",
        "Unlimited API calls",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security"
      ]
    }
  ]

  const invoices: Invoice[] = [
    { date: "Nov 28, 2025", amount: "$79.00", status: "Paid", invoice: "INV-2025-11", description: "Professional Plan - November 2025" },
    { date: "Oct 28, 2025", amount: "$79.00", status: "Paid", invoice: "INV-2025-10", description: "Professional Plan - October 2025" },
    { date: "Sep 28, 2025", amount: "$79.00", status: "Paid", invoice: "INV-2025-09", description: "Professional Plan - September 2025" },
    { date: "Aug 28, 2025", amount: "$29.00", status: "Paid", invoice: "INV-2025-08", description: "Starter Plan - August 2025" },
  ]

  const generateInvoicePDF = (invoice: Invoice) => {
    // Generate HTML invoice
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoice}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #333; }
    .invoice-container { max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 40px; }
    .header h1 { font-size: 48px; font-weight: 700; color: #000; margin-bottom: 5px; }
    .header .tagline { color: #666; font-size: 14px; }
    .invoice-details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
    .section-title { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 10px; font-weight: 600; }
    .info-line { margin-bottom: 8px; font-size: 14px; }
    .info-label { color: #666; display: inline-block; width: 120px; }
    .info-value { font-weight: 500; color: #000; }
    .items-table { width: 100%; border-collapse: collapse; margin: 40px 0; }
    .items-table th { background: #f5f5f5; padding: 15px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666; font-weight: 600; border-bottom: 2px solid #ddd; }
    .items-table td { padding: 15px; border-bottom: 1px solid #eee; font-size: 14px; }
    .items-table tr:last-child td { border-bottom: none; }
    .total-section { text-align: right; margin-top: 40px; padding-top: 20px; border-top: 2px solid #000; }
    .total-line { margin-bottom: 10px; font-size: 14px; }
    .total-label { display: inline-block; width: 120px; color: #666; }
    .total-value { font-weight: 600; color: #000; }
    .grand-total { font-size: 24px; font-weight: 700; margin-top: 15px; }
    .grand-total .total-label { font-size: 16px; }
    .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
    .status-badge { display: inline-block; padding: 4px 12px; background: #22c55e; color: white; border-radius: 4px; font-size: 12px; font-weight: 600; margin-left: 10px; }
    .company-info { margin-bottom: 20px; }
    .company-info strong { display: block; font-size: 16px; margin-bottom: 5px; color: #000; }
    .company-info div { font-size: 13px; color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>SaaSKit</h1>
      <div class="tagline">Professional SaaS Platform</div>
    </div>
    <div class="invoice-details">
      <div>
        <div class="section-title">Billed To</div>
        <div class="company-info">
          <strong>${user?.full_name || 'Customer Name'}</strong>
          <div>${user?.email || 'email@example.com'}</div>
          ${user?.company_name ? `<div>${user.company_name}</div>` : ''}
        </div>
      </div>
      <div style="text-align: right;">
        <div class="section-title">Invoice Details</div>
        <div class="info-line">
          <span class="info-label">Invoice Number:</span>
          <span class="info-value">${invoice.invoice}</span>
        </div>
        <div class="info-line">
          <span class="info-label">Date:</span>
          <span class="info-value">${invoice.date}</span>
        </div>
        <div class="info-line">
          <span class="info-label">Status:</span>
          <span class="status-badge">${invoice.status}</span>
        </div>
      </div>
    </div>
    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${invoice.description}</td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">${invoice.amount}</td>
          <td style="text-align: right; font-weight: 600;">${invoice.amount}</td>
        </tr>
      </tbody>
    </table>
    <div class="total-section">
      <div class="total-line">
        <span class="total-label">Subtotal:</span>
        <span class="total-value">${invoice.amount}</span>
      </div>
      <div class="total-line">
        <span class="total-label">Tax (0%):</span>
        <span class="total-value">$0.00</span>
      </div>
      <div class="grand-total">
        <span class="total-label">Total:</span>
        <span class="total-value">${invoice.amount}</span>
      </div>
    </div>
    <div class="footer">
      <p><strong>Thank you for your business!</strong></p>
      <p style="margin-top: 10px;">
        SaaSKit, Inc. | 123 Business St, San Francisco, CA 94102<br>
        support@saaskit.com | www.saaskit.com | +1 (555) 123-4567
      </p>
      <p style="margin-top: 20px; font-size: 11px;">
        This is an electronically generated invoice and does not require a signature.
      </p>
    </div>
  </div>
</body>
</html>
    `

    const blob = new Blob([invoiceHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${invoice.invoice}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    generateInvoicePDF(invoice)
  }

  const handleChangePlan = (plan: Plan) => {
    if (currentPlan === plan.name) return

    setSelectedPlan(plan)
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(plan.name)
      setSelectedPlan(null)
      setIsProcessing(false)
      setShowChangePlanModal(false)

      toast({
        title: "Plan Changed Successfully",
        description: `You are now subscribed to the ${plan.name} plan. Changes will take effect immediately.`,
      })
    }, 1500)
  }

  const handleCancelSubscription = () => {
    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setShowCancelModal(false)

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You'll have access until the end of your billing period (December 28, 2025).",
        variant: "destructive",
      })
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Subscription</h1>
          <p className="text-muted-foreground mt-1">Manage your subscription, payment methods, and billing history</p>
        </div>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are currently on the {currentPlan} plan</CardDescription>
              </div>
              <Badge className="bg-primary text-primary-foreground">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-foreground">${plans.find(p => p.name === currentPlan)?.price || 79}</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            <div className="space-y-2">
              {plans.find(p => p.name === currentPlan)?.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Billing cycle</span>
                <span className="font-medium text-foreground">Monthly</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Next billing date</span>
                <span className="font-medium text-foreground">December 28, 2025</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowChangePlanModal(true)}>
              Change Plan
            </Button>
            <Button variant="outline" onClick={() => setShowCancelModal(true)}>
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Track your usage across all features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Team Members</span>
                <span className="font-medium text-foreground">8 / 20</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "40%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium text-foreground">23.5 GB / 50 GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "47%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">API Calls</span>
                <span className="font-medium text-foreground">45,231 / 100,000</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "45%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="gap-2 bg-transparent">
              <CreditCard className="h-4 w-4" />
              Add Payment Method
            </Button>
          </CardFooter>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((item) => (
                <div key={item.invoice} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.invoice}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{item.amount}</p>
                      <Badge variant="outline" className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadInvoice(item)}
                      title="Download Invoice"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Plan Modal */}
      <Dialog open={showChangePlanModal} onOpenChange={setShowChangePlanModal}>
        <DialogContent className="!w-[96vw] !max-w-[96vw] sm:!max-w-[96vw] max-h-[96vh] h-auto overflow-hidden p-0 !m-0">
          <div className="p-6 pb-4 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl">Change Your Plan</DialogTitle>
              <DialogDescription className="text-base mt-2">
                Choose a plan that best fits your needs. You can upgrade or downgrade at any time.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="overflow-y-auto px-8 py-8" style={{ maxHeight: 'calc(96vh - 140px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1600px] mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all hover:shadow-xl ${
                  plan.popular ? 'border-primary shadow-xl ring-2 ring-primary/30 scale-[1.02]' : 'hover:border-primary/50'
                } ${
                  currentPlan === plan.name ? 'border-green-500 bg-gradient-to-b from-green-50/30 to-transparent dark:from-green-950/20' : ''
                }`}
              >
                {/* Badges Container */}
                <div className="absolute -top-4 left-0 right-0 flex justify-center gap-2 px-4 z-10">
                  {plan.popular && (
                    <Badge className="bg-primary text-primary-foreground shadow-lg px-4 py-1 text-xs font-semibold">
                      ⭐ Most Popular
                    </Badge>
                  )}
                  {currentPlan === plan.name && (
                    <Badge className="bg-green-500 text-white shadow-lg px-4 py-1 text-xs font-semibold">
                      ✓ Current Plan
                    </Badge>
                  )}
                </div>

                <CardHeader className="pt-8 pb-4">
                  <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mt-4">
                    <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
                    <span className="text-muted-foreground text-lg font-medium">/{plan.interval}</span>
                  </div>
                </CardHeader>

                <CardContent className="pb-6">
                  <ul className="space-y-3.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="mt-0.5">
                          <Check className="h-5 w-5 text-green-600 dark:text-green-500 stroke-[3]" />
                        </div>
                        <span className="text-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-0 pb-6">
                  <Button
                    className="w-full font-semibold shadow-sm"
                    size="lg"
                    variant={currentPlan === plan.name ? "outline" : plan.popular ? "default" : "outline"}
                    onClick={() => handleChangePlan(plan)}
                    disabled={currentPlan === plan.name || isProcessing}
                  >
                    {currentPlan === plan.name
                      ? "✓ Current Plan"
                      : isProcessing && selectedPlan?.id === plan.id
                      ? "Processing..."
                      : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>Cancel Subscription</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              Are you sure you want to cancel your subscription? This action will:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-start gap-2 text-sm">
              <X className="h-4 w-4 text-destructive mt-0.5" />
              <span>Cancel automatic renewal of your subscription</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 mt-0.5" />
              <span>You'll retain access until December 28, 2025</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <X className="h-4 w-4 text-destructive mt-0.5" />
              <span>Lose access to advanced features after the billing period</span>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Need help instead?</p>
            <p className="text-sm text-muted-foreground mb-3">
              If you're having issues or need assistance, our support team is here to help.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              disabled={isProcessing}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isProcessing}
            >
              {isProcessing ? "Cancelling..." : "Yes, Cancel Subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
