# UX Team Workflow Guide

## Quick Start for New Client Projects

### 1. Open Configuration Interface
Navigate to `/configure` in your v0 project

### 2. Input Client Details
- **Client Name**: Company you're building for
- **Product Name**: The SaaS product name
- **Domain Type**: Select from templates or choose "Custom"
  - CRM Platform
  - Project Management  
  - Booking System
  - E-Commerce
  - Healthcare Portal
  - Custom Domain

### 3. Customize Brand Colors
Choose from presets or input custom hex colors:
- **Primary Color**: Main brand color (buttons, links, highlights)
- **Secondary Color**: Supporting color (hover states, accents)

Color presets optimized for different industries:
- Blue Professional (Tech, Finance)
- Purple Modern (Creative, SaaS)
- Green Growth (Healthcare, Sustainability)
- Orange Energy (E-commerce, Food)
- Teal Medical (Healthcare, Wellness)
- Red Bold (Sports, Entertainment)

### 4. Generate Demo
Click "Generate Enterprise Demo" to apply your configuration

### 5. Preview & Present
- Navigate through all sections of the demo
- Show investors the complete flow
- Demonstrate domain-specific features

### 6. Hand Off to Dev Team
Export configuration and development docs:
- Database schemas (`docs/database-schema.sql`)
- API specifications (`docs/api-specifications.md`)
- Data flows (`docs/data-flows.md`)
- Authentication guide (`docs/auth-flow.md`)
- Mobile components guide (`docs/mobile-components-guide.md`)

## What Gets Generated

### For Investor Demos:
1. **Branded Landing Page** - With client colors and product name
2. **Authentication Flows** - Login, signup, password reset, email verification
3. **Domain-Specific Dashboard** - Customized for the selected domain type
4. **Billing & Subscriptions** - Full subscription management UI
5. **Team Management** - Invite members, manage roles, permissions
6. **Admin Panel** - Platform-wide management tools
7. **Mobile Responsive** - All screens optimized for mobile devices

### For Development Team:
1. **Database Schemas** - Complete SQL with all tables, relationships
2. **API Specifications** - REST endpoints with request/response examples
3. **Data Flow Diagrams** - How data moves through the application
4. **Component Architecture** - Frontend structure and patterns
5. **Integration Guides** - How to connect to Django backend

## Domain Templates

### CRM Platform
- Contact Management
- Deal Pipeline
- Activity Tracking
- Email Integration

### Project Management
- Task Boards (Kanban)
- Team Collaboration
- Gantt Charts
- Time Tracking

### Booking System
- Calendar Integration
- Booking Forms
- Automated Reminders
- Payment Processing

### E-Commerce
- Product Catalog
- Shopping Cart
- Order Management
- Inventory Tracking

### Healthcare Portal
- Patient Records
- Appointment Scheduling
- Medical History
- Prescription Management

### Custom Domain
Define your own requirements when the client's needs don't fit standard templates.

## Best Practices

### Naming Conventions
- **Product Name**: Should be memorable and professional (e.g., "SalesFlow Pro", "MediConnect")
- **Client Name**: Use the actual company name for realistic demos

### Color Selection
- Choose colors that match the client's industry
- Ensure sufficient contrast for accessibility
- Test primary color on both light and dark backgrounds
- Use secondary color sparingly for accents only

### Custom Requirements
When selecting "Custom Domain", be specific about:
- Main user personas and their workflows
- Core data models (what objects users will manage)
- Key integrations needed
- Unique features that differentiate this product

### Demo Preparation
Before showing to investors:
1. Walk through the entire flow yourself
2. Prepare talking points for each section
3. Have sample data ready (contacts, deals, etc.)
4. Anticipate questions about scalability and security
5. Be ready to show both user and admin perspectives

## Tips for Speed

- **Reuse colors**: Save successful color schemes for similar domains
- **Template first**: Start with a template, customize only if needed
- **Iterate fast**: Generate, review, adjust colors if needed
- **Focus on story**: The demo tells the product story—make it coherent

## Common Issues

**Colors look washed out?**
- Increase color saturation
- Ensure primary color is not too light or dark

**Domain doesn't fit templates?**
- Use "Custom Domain" and be very specific in requirements
- Think about what makes this unique vs. standard templates

**Need to change after generation?**
- v0 allows live editing of colors and content
- Adjust and regenerate as needed

## Support

For questions or issues with the configurator:
- Check this workflow guide
- Review dev handoff documentation
- Consult with senior frontend team members
