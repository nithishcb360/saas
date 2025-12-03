# Data Flow Documentation

## Overview

This document explains how data flows through the SaaS platform, from user actions through the frontend to the Django backend and database.

---

## 1. Authentication Flow

\`\`\`
┌─────────┐      ┌──────────┐      ┌─────────┐      ┌──────────┐
│ Browser │─────>│ Next.js  │─────>│ Django  │─────>│ Database │
│         │ POST │ /login   │ POST │ API     │ Query│          │
│         │<─────│          │<─────│         │<─────│          │
└─────────┘ JWT  └──────────┘ JWT  └─────────┘ User └──────────┘
\`\`\`

### Step-by-step:

1. **User submits login form** → `/app/auth/login/page.tsx`
2. **Frontend validates** → Client-side form validation
3. **POST to backend** → `POST /api/v1/auth/login`
4. **Django authenticates** → Checks password hash in `users` table
5. **Generate JWT** → Creates access token + refresh token
6. **Store in cookie** → HttpOnly cookie for security
7. **Redirect to dashboard** → `/dashboard`
8. **All future requests** → Include JWT in Authorization header

### Implementation:

**Frontend (Next.js):**
\`\`\`typescript
// app/auth/login/page.tsx
const handleLogin = async (email: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include' // Important: sends cookies
  })
  
  if (res.ok) {
    const { token, user } = await res.json()
    // Store token in cookie or localStorage
    router.push('/dashboard')
  }
}
\`\`\`

**Backend (Django):**
\`\`\`python
# views/auth.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
import jwt

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    user = authenticate(email=email, password=password)
    if user:
        token = jwt.encode({'user_id': str(user.id)}, settings.JWT_SECRET)
        return Response({
            'user': UserSerializer(user).data,
            'token': token
        })
    return Response({'error': 'Invalid credentials'}, status=401)
\`\`\`

---

## 2. Multi-Tenant Data Access Flow

\`\`\`
┌──────────┐     ┌─────────────────┐     ┌──────────┐
│  Request │────>│ Middleware      │────>│ View     │
│ + JWT    │     │ Extract Org ID  │     │ Filter   │
└──────────┘     └─────────────────┘     └──────────┘
                          │                     │
                          v                     v
                  ┌──────────────┐      ┌───────────┐
                  │ Set Context  │      │ Query DB  │
                  │ org_id=xxx   │      │ WHERE     │
                  └──────────────┘      │ org=xxx   │
                                        └───────────┘
\`\`\`

### Step-by-step:

1. **Request arrives** → With JWT token
2. **Auth middleware** → Extracts user from JWT
3. **Tenant middleware** → Determines organization context
4. **Set org context** → Attach to request object
5. **View receives request** → With `request.org`
6. **Query database** → Automatically filtered by org_id
7. **Return data** → Only data user is allowed to see

### Implementation:

**Django Middleware:**
\`\`\`python
# middleware/tenant.py
class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if hasattr(request, 'user') and request.user.is_authenticated:
            # Get org from header or default org
            org_id = request.headers.get('X-Organization-ID')
            if org_id:
                org = Organization.objects.get(
                    id=org_id,
                    members__user=request.user
                )
                request.org = org
        
        response = self.get_response(request)
        return response
\`\`\`

**Django View with Tenant Filter:**
\`\`\`python
# views/dashboard.py
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_data(request):
    # Automatically filtered by request.org
    activities = ActivityLog.objects.filter(
        organization=request.org
    ).order_by('-created_at')[:10]
    
    return Response({
        'activities': ActivityLogSerializer(activities, many=True).data
    })
\`\`\`

---

## 3. Subscription & Billing Flow

\`\`\`
┌──────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
│ Frontend │────>│ Django  │────>│ Stripe  │────>│ Webhook  │
│ Checkout │     │ Create  │     │ Process │     │ Update   │
└──────────┘     │ Session │     │ Payment │     │ DB       │
                 └─────────┘     └─────────┘     └──────────┘
\`\`\`

### Step-by-step:

1. **User clicks upgrade** → `/dashboard/billing`
2. **Create Stripe session** → `POST /api/v1/organizations/{id}/subscription`
3. **Redirect to Stripe** → Hosted checkout page
4. **User completes payment** → On Stripe's domain
5. **Stripe sends webhook** → `POST /webhooks/stripe`
6. **Verify webhook** → Check signature
7. **Update database** → Create/update subscription record
8. **Send confirmation email** → To user

### Implementation:

**Frontend:**
\`\`\`typescript
// app/dashboard/billing/page.tsx
const handleUpgrade = async (planId: string) => {
  const res = await fetch(`/api/organizations/${orgId}/subscription`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ planId })
  })
  
  const { checkoutUrl } = await res.json()
  window.location.href = checkoutUrl // Redirect to Stripe
}
\`\`\`

**Backend:**
\`\`\`python
# views/billing.py
import stripe

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsOrgOwner])
def create_subscription(request, org_id):
    org = get_object_or_404(Organization, id=org_id)
    plan_id = request.data.get('planId')
    
    # Create Stripe checkout session
    session = stripe.checkout.Session.create(
        customer=org.stripe_customer_id,
        mode='subscription',
        line_items=[{'price': plan_id, 'quantity': 1}],
        success_url=f'{settings.FRONTEND_URL}/dashboard/billing?success=true',
        cancel_url=f'{settings.FRONTEND_URL}/dashboard/billing?canceled=true',
    )
    
    return Response({'checkoutUrl': session.url})

# Webhook handler
@api_view(['POST'])
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return Response(status=400)
    
    if event['type'] == 'customer.subscription.created':
        subscription = event['data']['object']
        # Update database
        Subscription.objects.create(
            organization_id=subscription.metadata['org_id'],
            stripe_subscription_id=subscription.id,
            status=subscription.status,
            # ... more fields
        )
    
    return Response({'received': True})
\`\`\`

---

## 4. Team Invitation Flow

\`\`\`
┌────────┐    ┌──────────┐    ┌───────┐    ┌─────────┐
│ Admin  │───>│ Create   │───>│ Email │───>│ New     │
│ Invites│    │ Invite   │    │ Sent  │    │ User    │
└────────┘    │ Record   │    └───────┘    │ Accepts │
              └──────────┘                  └─────────┘
                    │                             │
                    v                             v
              ┌──────────┐                ┌──────────────┐
              │ Database │<───────────────│ Join Org     │
              │ Pending  │                │ Set Role     │
              └──────────┘                └──────────────┘
\`\`\`

### Step-by-step:

1. **Admin invites member** → `POST /api/organizations/{id}/invitations`
2. **Create invitation record** → Store in `invitations` table with token
3. **Send email** → Background job sends invitation email
4. **User clicks link** → Email contains unique token
5. **Frontend validates token** → `GET /invitations/validate?token=xxx`
6. **User accepts** → `POST /invitations/accept`
7. **Create membership** → Add to `organization_members` table
8. **Delete invitation** → Remove from `invitations` table
9. **Send confirmation** → Email to admin and new member

### Implementation:

**Backend:**
\`\`\`python
# views/invitations.py
@api_view(['POST'])
@permission_classes([IsAuthenticated, CanInviteMembers])
def create_invitation(request, org_id):
    org = get_object_or_404(Organization, id=org_id)
    email = request.data.get('email')
    role = request.data.get('role', 'member')
    
    # Generate unique token
    token = secrets.token_urlsafe(32)
    
    invitation = Invitation.objects.create(
        organization=org,
        email=email,
        role=role,
        token=token,
        invited_by=request.user,
        expires_at=timezone.now() + timedelta(days=7)
    )
    
    # Send email (async task)
    send_invitation_email.delay(invitation.id)
    
    return Response(InvitationSerializer(invitation).data, status=201)

@api_view(['POST'])
def accept_invitation(request):
    token = request.data.get('token')
    
    invitation = get_object_or_404(
        Invitation,
        token=token,
        accepted_at__isnull=True,
        expires_at__gt=timezone.now()
    )
    
    # Create membership
    OrganizationMember.objects.create(
        organization=invitation.organization,
        user=request.user,
        role=invitation.role
    )
    
    # Mark as accepted
    invitation.accepted_at = timezone.now()
    invitation.save()
    
    return Response({'success': True})
\`\`\`

---

## 5. Activity Logging Flow

\`\`\`
┌──────────────┐
│ User Action  │
└──────┬───────┘
       │
       v
┌──────────────┐     ┌──────────────┐     ┌──────────┐
│ Decorator    │────>│ Log Service  │────>│ Database │
│ @log_activity│     │ Create Entry │     │ Insert   │
└──────────────┘     └──────────────┘     └──────────┘
\`\`\`

### Implementation:

**Backend Decorator:**
\`\`\`python
# decorators/logging.py
from functools import wraps

def log_activity(action_type):
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            response = view_func(request, *args, **kwargs)
            
            # Log after successful request
            if response.status_code < 400:
                ActivityLog.objects.create(
                    organization=getattr(request, 'org', None),
                    user=request.user if request.user.is_authenticated else None,
                    action_type=action_type,
                    action_description=f"User performed {action_type}",
                    ip_address=request.META.get('REMOTE_ADDR'),
                    user_agent=request.META.get('HTTP_USER_AGENT'),
                    metadata={
                        'path': request.path,
                        'method': request.method
                    }
                )
            
            return response
        return wrapper
    return decorator

# Usage
@api_view(['POST'])
@log_activity('team.invite')
def create_invitation(request, org_id):
    # ... invitation logic
    pass
\`\`\`

---

## 6. Feature Flag Evaluation Flow

\`\`\`
┌──────────┐     ┌───────────────┐     ┌──────────┐
│ Request  │────>│ Check Flag    │────>│ Database │
│          │     │ Service       │     │ Query    │
└──────────┘     └───────┬───────┘     └──────────┘
                         │
                         v
                 ┌───────────────┐
                 │ Evaluate:     │
                 │ - Enabled?    │
                 │ - Rollout %?  │
                 │ - Target org? │
                 └───────┬───────┘
                         │
                         v
                 ┌───────────────┐
                 │ Return Result │
                 │ true/false    │
                 └───────────────┘
\`\`\`

### Implementation:

**Backend Service:**
\`\`\`python
# services/feature_flags.py
class FeatureFlagService:
    @staticmethod
    def is_enabled(flag_key: str, user=None, org=None) -> bool:
        try:
            flag = FeatureFlag.objects.get(flag_key=flag_key)
        except FeatureFlag.DoesNotExist:
            return False
        
        # Check if globally enabled
        if not flag.is_enabled:
            return False
        
        # Check targeted organizations
        if org and flag.target_organizations:
            if str(org.id) not in flag.target_organizations:
                return False
        
        # Check rollout percentage
        if flag.rollout_percentage < 100:
            # Use consistent hashing for stable rollout
            hash_input = f"{flag_key}:{org.id if org else user.id}"
            hash_value = int(hashlib.md5(hash_input.encode()).hexdigest(), 16)
            if (hash_value % 100) >= flag.rollout_percentage:
                return False
        
        return True

# Usage in views
@api_view(['GET'])
def dashboard_view(request):
    if FeatureFlagService.is_enabled('advanced_analytics', org=request.org):
        # Show advanced analytics
        pass
    else:
        # Show basic dashboard
        pass
\`\`\`

---

## 7. Real-time Data Updates (Optional)

For features that need real-time updates (notifications, activity feed, etc.):

\`\`\`
┌──────────┐     ┌─────────────┐     ┌──────────┐
│ Frontend │<───>│ WebSocket   │<───>│ Django   │
│          │     │ Connection  │     │ Channels │
└──────────┘     └─────────────┘     └──────────┘
                                            │
                                            v
                                     ┌──────────┐
                                     │ Redis    │
                                     │ PubSub   │
                                     └──────────┘
\`\`\`

---

## 8. File Upload Flow (for avatars, documents, etc.)

\`\`\`
┌──────────┐     ┌─────────┐     ┌─────────┐     ┌──────────┐
│ Frontend │────>│ Django  │────>│ S3/Blob │────>│ Database │
│ Upload   │     │ Generate│     │ Store   │     │ Save URL │
│          │     │ URL     │     │         │     │          │
└──────────┘     └─────────┘     └─────────┘     └──────────┘
\`\`\`

### Implementation:

**Backend:**
\`\`\`python
# views/uploads.py
import boto3
from django.conf import settings

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_avatar(request):
    file = request.FILES.get('avatar')
    
    # Validate file
    if file.size > 5 * 1024 * 1024:  # 5MB limit
        return Response({'error': 'File too large'}, status=400)
    
    # Generate unique filename
    ext = file.name.split('.')[-1]
    filename = f"avatars/{request.user.id}/{uuid.uuid4()}.{ext}"
    
    # Upload to S3
    s3 = boto3.client('s3')
    s3.upload_fileobj(
        file,
        settings.AWS_STORAGE_BUCKET_NAME,
        filename,
        ExtraArgs={'ACL': 'public-read'}
    )
    
    # Get URL
    url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/{filename}"
    
    # Update user
    request.user.avatar_url = url
    request.user.save()
    
    return Response({'avatarUrl': url})
\`\`\`

---

## Summary

These data flows show how the frontend and backend interact for all major features. The Django team should:

1. **Implement these API endpoints** following the specifications
2. **Use middleware** for authentication and tenant isolation
3. **Create background jobs** for emails, webhooks, and heavy processing
4. **Add proper error handling** and validation
5. **Implement caching** where appropriate (Redis)
6. **Add rate limiting** to prevent abuse
7. **Log all important actions** for audit trails

The frontend team has already built the UI that consumes these APIs - the Django team just needs to make them work!
