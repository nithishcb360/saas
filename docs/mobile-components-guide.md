# Mobile Components Guide

## Overview

All components in the SaaS skeleton are built with a **mobile-first** approach, ensuring optimal user experience across all device sizes.

## Responsive Breakpoints

\`\`\`css
/* Tailwind CSS Breakpoints */
sm: 640px   // Small tablets and large phones
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large desktops
\`\`\`

## Mobile Navigation Pattern

### Desktop (lg+)
- Fixed sidebar navigation (left side)
- Full menu always visible
- Search bar in header
- User profile in sidebar footer

### Mobile (<lg)
- Hamburger menu button
- Slide-out drawer navigation
- Compact header with logo and actions
- Bottom navigation bar (optional)

## Implementation Examples

### Responsive Layout Component

\`\`\`tsx
// Dashboard layout adapts automatically
<div className="min-h-screen bg-background">
  {/* Desktop sidebar - hidden on mobile */}
  <aside className="hidden lg:fixed lg:flex lg:w-64">
    {/* Navigation */}
  </aside>

  {/* Mobile header - shown only on mobile */}
  <div className="lg:hidden fixed top-0">
    {/* Mobile nav */}
  </div>

  {/* Main content - adjusts padding based on screen size */}
  <div className="lg:pl-64">
    <main className="p-6 pt-20 lg:pt-6">
      {children}
    </main>
  </div>
</div>
\`\`\`

### Responsive Grid

\`\`\`tsx
// Automatically adjusts columns based on screen size
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards stack on mobile, 2 cols on tablet, 3 on desktop */}
</div>
\`\`\`

### Touch-Friendly Buttons

\`\`\`tsx
// Minimum 44x44px tap target
<Button size="lg" className="min-h-[44px] min-w-[44px]">
  Action
</Button>
\`\`\`

## Best Practices for Mobile

### 1. Typography
- Use `text-base` (16px) minimum for body text on mobile
- Larger line-height for readability: `leading-relaxed`
- Use `text-balance` for headings to prevent awkward line breaks

### 2. Forms
- Stack form fields vertically on mobile
- Large input fields with good padding
- Clear labels and helper text
- Native mobile inputs (date pickers, number inputs)

### 3. Tables
- Use horizontal scroll on mobile: `overflow-x-auto`
- Or convert to card layout on mobile
- Prioritize most important columns

### 4. Modals
- Use bottom sheets on mobile instead of centered modals
- Full-screen modals for complex forms
- Easy-to-reach close buttons

### 5. Images
- Use responsive images with proper aspect ratios
- Lazy loading for performance
- Optimized file sizes for mobile networks

## Testing Mobile Responsiveness

1. **Browser DevTools**: Use Chrome/Firefox responsive design mode
2. **Physical Devices**: Test on actual phones and tablets
3. **Common Resolutions**:
   - iPhone SE: 375x667
   - iPhone 12/13: 390x844
   - iPad: 768x1024
   - Android Phone: 360x800

## Performance Optimization

### Mobile-Specific Optimizations
- Lazy load images and heavy components
- Reduce animation complexity on mobile
- Use CSS transforms for smooth animations
- Minimize JavaScript bundle size
- Implement code splitting by route

### Network Considerations
- Optimize for 3G/4G networks
- Implement offline support with service workers
- Show loading states for slower connections
- Cache static assets aggressively

## Accessibility on Mobile

- Minimum 44x44px touch targets
- High contrast ratios for outdoor viewing
- Support for screen readers
- Keyboard navigation (for tablets with keyboards)
- Proper focus states

## Django Team Integration Notes

When your Django team builds the backend:

1. **API Responses**: Keep JSON responses minimal for mobile bandwidth
2. **Pagination**: Implement cursor-based pagination for infinite scroll
3. **Image Upload**: Support multiple image sizes for different devices
4. **Push Notifications**: Plan for mobile push notification endpoints
5. **Authentication**: Implement JWT for mobile-friendly stateless auth

## Progressive Web App (PWA) Features

The SaaS skeleton can be enhanced with PWA features:

- **Manifest.json**: App metadata and icons
- **Service Workers**: Offline support and caching
- **Install Prompt**: "Add to Home Screen" functionality
- **App-like Experience**: No browser chrome when launched from home screen

## Future Enhancements

For native mobile apps, consider:
- React Native for cross-platform mobile apps
- Expo for rapid React Native development
- Shared business logic with web app
- Platform-specific features (camera, GPS, biometrics)
