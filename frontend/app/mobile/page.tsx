import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Tablet, Monitor, CheckCircle2, ArrowRight } from "lucide-react"

export default function MobilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mobile App Components</h1>
          <p className="text-muted-foreground">
            Responsive layouts optimized for mobile devices, tablets, and desktop viewing
          </p>
        </div>

        {/* Device Preview Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Smartphone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Mobile (320px+)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Optimized for smartphones with touch-friendly interfaces and streamlined navigation
            </p>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              Fully Responsive
            </Badge>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Tablet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Tablet (768px+)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adaptive layouts that utilize extra screen space while maintaining mobile-friendly interactions
            </p>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              Fully Responsive
            </Badge>
          </Card>

          <Card className="p-6">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Desktop (1024px+)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Full-featured layouts with sidebars, advanced controls, and multi-column displays
            </p>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
              Fully Responsive
            </Badge>
          </Card>
        </div>

        {/* Mobile Features */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Mobile-First Features</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Navigation</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Collapsible hamburger menu for mobile devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Bottom navigation bar for quick access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Swipe gestures for drawer navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Sticky headers with context-aware actions</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Touch Interactions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Large tap targets (minimum 44x44px)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Pull-to-refresh functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Swipe-to-delete actions on list items</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Touch-friendly form inputs with proper spacing</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Performance</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Lazy loading for images and components</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Optimized assets for mobile networks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Progressive Web App (PWA) ready</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Offline support with service workers</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Layout Adaptations</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Single-column layouts on mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Stackable cards and components</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Responsive tables with horizontal scroll</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Bottom sheets for modals on mobile</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Example Mobile Views */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Mobile View Examples</h2>
          <p className="text-muted-foreground mb-6">
            All pages in the SaaS skeleton are fully responsive. Try resizing your browser or view on a mobile device.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              Dashboard Mobile View
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              Team Management Mobile
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              Settings Mobile View
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              Admin Panel Mobile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Technical Stack */}
        <Card className="p-6 bg-muted/50">
          <h2 className="text-xl font-semibold text-foreground mb-4">Mobile Technical Stack</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Responsive Framework</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Tailwind CSS with mobile-first breakpoints</li>
                <li>• Flexbox and CSS Grid for layouts</li>
                <li>• Viewport-based units (vw, vh, rem)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Progressive Enhancement</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Touch event handling</li>
                <li>• Responsive images with srcset</li>
                <li>• Mobile-optimized fonts and spacing</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
