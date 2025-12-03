# API Specifications

Base URL: `http://localhost:8000/api/v1`

All endpoints require authentication unless specified otherwise.

## Authentication

### POST /auth/register
Register a new user account.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": false
  },
  "token": "jwt_token_here"
}
\`\`\`

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
\`\`\`

---

### POST /auth/refresh
Refresh access token using refresh token.

**Request:**
\`\`\`json
{
  "refreshToken": "refresh_token_here"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "token": "new_jwt_token_here",
  "refreshToken": "new_refresh_token_here"
}
\`\`\`

---

### POST /auth/forgot-password
Request password reset email.

**Request:**
\`\`\`json
{
  "email": "user@example.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Password reset email sent"
}
\`\`\`

---

### POST /auth/reset-password
Reset password using token from email.

**Request:**
\`\`\`json
{
  "token": "reset_token_from_email",
  "newPassword": "newSecurePassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Password reset successful"
}
\`\`\`

---

### POST /auth/verify-email
Verify email address using token.

**Request:**
\`\`\`json
{
  "token": "verification_token_from_email"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "message": "Email verified successfully"
}
\`\`\`

---

## Users

### GET /users/me
Get current authenticated user profile.

**Headers:**
\`\`\`
Authorization: Bearer {jwt_token}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://...",
  "emailVerified": true,
  "createdAt": "2024-01-15T10:00:00Z"
}
\`\`\`

---

### PATCH /users/me
Update current user profile.

**Request:**
\`\`\`json
{
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://..."
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatarUrl": "https://..."
}
\`\`\`

---

### GET /users/me/notifications
Get user notification preferences.

**Response (200):**
\`\`\`json
{
  "emailNotifications": true,
  "marketingEmails": false,
  "securityAlerts": true,
  "productUpdates": true,
  "weeklyDigest": true
}
\`\`\`

---

### PATCH /users/me/notifications
Update notification preferences.

**Request:**
\`\`\`json
{
  "emailNotifications": true,
  "marketingEmails": false
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "emailNotifications": true,
  "marketingEmails": false,
  "securityAlerts": true,
  "productUpdates": true,
  "weeklyDigest": true
}
\`\`\`

---

## Organizations

### GET /organizations
Get all organizations for current user.

**Response (200):**
\`\`\`json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "role": "owner",
      "memberCount": 5,
      "plan": "professional",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

---

### POST /organizations
Create a new organization.

**Request:**
\`\`\`json
{
  "name": "New Company",
  "slug": "new-company",
  "industry": "Technology",
  "companySize": "10-50"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "id": "uuid",
  "name": "New Company",
  "slug": "new-company",
  "role": "owner",
  "createdAt": "2024-01-15T10:00:00Z"
}
\`\`\`

---

### GET /organizations/:orgId
Get organization details.

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "name": "Acme Corp",
  "slug": "acme-corp",
  "avatarUrl": "https://...",
  "websiteUrl": "https://acme.com",
  "industry": "Technology",
  "companySize": "50-100",
  "billingEmail": "billing@acme.com",
  "memberCount": 5,
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

---

### PATCH /organizations/:orgId
Update organization details.

**Request:**
\`\`\`json
{
  "name": "Acme Corporation",
  "websiteUrl": "https://acmecorp.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "name": "Acme Corporation",
  "websiteUrl": "https://acmecorp.com"
}
\`\`\`

---

### DELETE /organizations/:orgId
Delete organization (owner only).

**Response (204):** No content

---

## Organization Members

### GET /organizations/:orgId/members
Get all members of an organization.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)
- `role` (optional): Filter by role (owner, admin, member, viewer)

**Response (200):**
\`\`\`json
{
  "members": [
    {
      "id": "uuid",
      "userId": "uuid",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatarUrl": "https://...",
      "role": "owner",
      "joinedAt": "2024-01-01T00:00:00Z",
      "lastActiveAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
\`\`\`

---

### PATCH /organizations/:orgId/members/:userId
Update member role.

**Request:**
\`\`\`json
{
  "role": "admin"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "role": "admin",
  "updatedAt": "2024-01-15T10:00:00Z"
}
\`\`\`

---

### DELETE /organizations/:orgId/members/:userId
Remove member from organization.

**Response (204):** No content

---

## Invitations

### POST /organizations/:orgId/invitations
Invite user to organization.

**Request:**
\`\`\`json
{
  "email": "newuser@example.com",
  "role": "member"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "id": "uuid",
  "email": "newuser@example.com",
  "role": "member",
  "token": "invitation_token",
  "expiresAt": "2024-01-22T10:00:00Z"
}
\`\`\`

---

### GET /organizations/:orgId/invitations
Get all pending invitations.

**Response (200):**
\`\`\`json
{
  "invitations": [
    {
      "id": "uuid",
      "email": "pending@example.com",
      "role": "member",
      "invitedBy": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "expiresAt": "2024-01-22T10:00:00Z"
    }
  ]
}
\`\`\`

---

### DELETE /organizations/:orgId/invitations/:invitationId
Cancel invitation.

**Response (204):** No content

---

### POST /invitations/accept
Accept invitation to join organization.

**Request:**
\`\`\`json
{
  "token": "invitation_token"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "organization": {
    "id": "uuid",
    "name": "Acme Corp",
    "role": "member"
  }
}
\`\`\`

---

## Subscriptions

### GET /organizations/:orgId/subscription
Get organization subscription details.

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "planId": "professional",
  "planName": "Professional",
  "status": "active",
  "currentPeriodStart": "2024-01-01T00:00:00Z",
  "currentPeriodEnd": "2024-02-01T00:00:00Z",
  "cancelAtPeriodEnd": false,
  "trialEnd": null
}
\`\`\`

---

### POST /organizations/:orgId/subscription
Create or update subscription.

**Request:**
\`\`\`json
{
  "planId": "professional",
  "paymentMethodId": "pm_xxx"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "planId": "professional",
  "status": "active",
  "clientSecret": "pi_xxx_secret_xxx"
}
\`\`\`

---

### POST /organizations/:orgId/subscription/cancel
Cancel subscription at period end.

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "cancelAtPeriodEnd": true,
  "currentPeriodEnd": "2024-02-01T00:00:00Z"
}
\`\`\`

---

### POST /organizations/:orgId/subscription/resume
Resume cancelled subscription.

**Response (200):**
\`\`\`json
{
  "id": "uuid",
  "cancelAtPeriodEnd": false,
  "status": "active"
}
\`\`\`

---

## Billing

### GET /organizations/:orgId/payment-methods
Get all payment methods.

**Response (200):**
\`\`\`json
{
  "paymentMethods": [
    {
      "id": "uuid",
      "type": "card",
      "cardBrand": "visa",
      "cardLast4": "4242",
      "cardExpMonth": 12,
      "cardExpYear": 2025,
      "isDefault": true
    }
  ]
}
\`\`\`

---

### POST /organizations/:orgId/payment-methods
Add new payment method.

**Request:**
\`\`\`json
{
  "paymentMethodId": "pm_xxx_from_stripe",
  "setAsDefault": true
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "id": "uuid",
  "type": "card",
  "cardBrand": "visa",
  "cardLast4": "4242",
  "isDefault": true
}
\`\`\`

---

### DELETE /organizations/:orgId/payment-methods/:paymentMethodId
Remove payment method.

**Response (204):** No content

---

### GET /organizations/:orgId/invoices
Get billing history.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response (200):**
\`\`\`json
{
  "invoices": [
    {
      "id": "uuid",
      "invoiceNumber": "INV-2024-001",
      "amountDue": 4900,
      "amountPaid": 4900,
      "currency": "usd",
      "status": "paid",
      "pdfUrl": "https://...",
      "hostedUrl": "https://...",
      "paidAt": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12
  }
}
\`\`\`

---

## Usage Metrics

### GET /organizations/:orgId/usage
Get current usage metrics.

**Response (200):**
\`\`\`json
{
  "metrics": [
    {
      "type": "api_calls",
      "current": 8450,
      "limit": 10000,
      "periodStart": "2024-01-01T00:00:00Z",
      "periodEnd": "2024-02-01T00:00:00Z"
    },
    {
      "type": "storage",
      "current": 2.4,
      "limit": 10,
      "unit": "GB"
    }
  ]
}
\`\`\`

---

## Activity Logs

### GET /organizations/:orgId/activity
Get activity logs for organization.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page (default: 50)
- `actionType` (optional): Filter by action type
- `userId` (optional): Filter by user

**Response (200):**
\`\`\`json
{
  "activities": [
    {
      "id": "uuid",
      "actionType": "team.invite",
      "actionDescription": "Invited john@example.com to join the team",
      "user": {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Doe"
      },
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 234
  }
}
\`\`\`

---

## Admin Endpoints

All admin endpoints require superadmin role.

### GET /admin/users
Get all platform users with filters.

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: active, inactive
- `search`: Search by email/name

**Response (200):**
\`\`\`json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isActive": true,
      "emailVerified": true,
      "organizationCount": 2,
      "lastLoginAt": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": { "total": 1250 }
}
\`\`\`

---

### PATCH /admin/users/:userId
Update user (suspend, activate, etc.).

**Request:**
\`\`\`json
{
  "isActive": false
}
\`\`\`

---

### DELETE /admin/users/:userId
Permanently delete user account.

**Response (204):** No content

---

### POST /admin/users/:userId/impersonate
Generate impersonation token.

**Response (200):**
\`\`\`json
{
  "token": "impersonation_jwt_token",
  "expiresAt": "2024-01-15T11:00:00Z"
}
\`\`\`

---

### GET /admin/organizations
Get all organizations with filters.

**Response (200):**
\`\`\`json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "plan": "professional",
      "status": "active",
      "memberCount": 12,
      "mrr": 49.00,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

---

### GET /admin/revenue
Get revenue analytics.

**Query Parameters:**
- `period`: day, week, month, year

**Response (200):**
\`\`\`json
{
  "mrr": 124500.00,
  "arr": 1494000.00,
  "growth": 15.2,
  "churnRate": 2.1,
  "ltv": 2450.00,
  "activeSubscriptions": 254,
  "trialConversionRate": 42.5,
  "revenueByPlan": {
    "starter": 34500.00,
    "professional": 67800.00,
    "enterprise": 22200.00
  }
}
\`\`\`

---

### GET /admin/feature-flags
Get all feature flags.

**Response (200):**
\`\`\`json
{
  "flags": [
    {
      "id": "uuid",
      "flagKey": "advanced_analytics",
      "flagName": "Advanced Analytics",
      "description": "Enable advanced analytics",
      "isEnabled": true,
      "rolloutPercentage": 100,
      "targetOrganizations": [],
      "updatedAt": "2024-01-10T00:00:00Z"
    }
  ]
}
\`\`\`

---

### PATCH /admin/feature-flags/:flagId
Update feature flag.

**Request:**
\`\`\`json
{
  "isEnabled": true,
  "rolloutPercentage": 50
}
\`\`\`

---

### GET /admin/audit-logs
Get platform audit logs.

**Query Parameters:**
- `page`, `limit`: Pagination
- `severity`: info, warning, critical
- `actionType`: Filter by action

**Response (200):**
\`\`\`json
{
  "logs": [
    {
      "id": "uuid",
      "adminUser": {
        "email": "admin@example.com"
      },
      "actionType": "user.suspend",
      "actionDescription": "Suspended user account",
      "severity": "warning",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
\`\`\`

---

### GET /admin/system/health
Get system health metrics.

**Response (200):**
\`\`\`json
{
  "status": "healthy",
  "uptime": 99.98,
  "apiLatency": 145,
  "errorRate": 0.02,
  "activeUsers": 1245,
  "requestsPerMinute": 850,
  "database": {
    "status": "healthy",
    "connectionPool": 45,
    "queryTime": 12
  },
  "cache": {
    "status": "healthy",
    "hitRate": 94.5
  }
}
\`\`\`

---

## Webhooks

### POST /webhooks/stripe
Stripe webhook endpoint for subscription events.

**Events handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- `payment_method.attached`

---

## Error Responses

All endpoints may return these error formats:

**400 Bad Request:**
\`\`\`json
{
  "error": "validation_error",
  "message": "Invalid request data",
  "details": {
    "email": ["Email is required"]
  }
}
\`\`\`

**401 Unauthorized:**
\`\`\`json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
\`\`\`

**403 Forbidden:**
\`\`\`json
{
  "error": "forbidden",
  "message": "Insufficient permissions"
}
\`\`\`

**404 Not Found:**
\`\`\`json
{
  "error": "not_found",
  "message": "Resource not found"
}
\`\`\`

**429 Rate Limited:**
\`\`\`json
{
  "error": "rate_limited",
  "message": "Too many requests",
  "retryAfter": 60
}
\`\`\`

**500 Internal Server Error:**
\`\`\`json
{
  "error": "internal_error",
  "message": "An unexpected error occurred"
}
