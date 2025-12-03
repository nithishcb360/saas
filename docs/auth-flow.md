# Authentication & Authorization Flow

Complete guide for implementing secure authentication in the SaaS platform.

---

## 1. Authentication Strategy

### JWT (JSON Web Tokens)
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens
- **Storage**: HttpOnly cookies (more secure than localStorage)

---

## 2. Registration Flow

\`\`\`
User → Frontend → Backend → Database → Email Service
                     ↓
                 Hash Password
                     ↓
                 Create User
                     ↓
              Generate Tokens
                     ↓
            Send Verification Email
\`\`\`

### Django Implementation:

\`\`\`python
# views/auth.py
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
import jwt
from datetime import datetime, timedelta

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('firstName')
    last_name = request.data.get('lastName')
    
    # Validation
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already registered'},
            status=400
        )
    
    # Create user
    user = User.objects.create(
        email=email,
        password_hash=make_password(password),
        first_name=first_name,
        last_name=last_name,
        email_verified=False
    )
    
    # Generate verification token
    verification_token = jwt.encode(
        {
            'user_id': str(user.id),
            'type': 'email_verification',
            'exp': datetime.utcnow() + timedelta(days=1)
        },
        settings.JWT_SECRET,
        algorithm='HS256'
    )
    
    # Send verification email (async)
    send_verification_email.delay(user.id, verification_token)
    
    # Generate auth tokens
    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)
    
    response = Response({
        'user': UserSerializer(user).data,
        'token': access_token
    }, status=201)
    
    # Set refresh token in httponly cookie
    response.set_cookie(
        'refresh_token',
        refresh_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=7*24*60*60  # 7 days
    )
    
    return response
\`\`\`

---

## 3. Login Flow

\`\`\`
User Credentials → Validate → Check Password → Generate Tokens → Set Cookies
\`\`\`

### Django Implementation:

\`\`\`python
@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email, is_active=True)
    except User.DoesNotExist:
        return Response(
            {'error': 'Invalid credentials'},
            status=401
        )
    
    # Check password
    if not check_password(password, user.password_hash):
        return Response(
            {'error': 'Invalid credentials'},
            status=401
        )
    
    # Update last login
    user.last_login_at = timezone.now()
    user.save()
    
    # Log activity
    ActivityLog.objects.create(
        user=user,
        action_type='user.login',
        action_description='User logged in',
        ip_address=request.META.get('REMOTE_ADDR')
    )
    
    # Generate tokens
    access_token = generate_access_token(user)
    refresh_token = generate_refresh_token(user)
    
    response = Response({
        'user': UserSerializer(user).data,
        'token': access_token
    })
    
    response.set_cookie(
        'refresh_token',
        refresh_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=7*24*60*60
    )
    
    return response
\`\`\`

---

## 4. Token Generation

\`\`\`python
# utils/jwt.py
import jwt
from datetime import datetime, timedelta
from django.conf import settings

def generate_access_token(user):
    """Generate short-lived access token (15 minutes)"""
    payload = {
        'user_id': str(user.id),
        'email': user.email,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(minutes=15),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')

def generate_refresh_token(user):
    """Generate long-lived refresh token (7 days)"""
    payload = {
        'user_id': str(user.id),
        'type': 'refresh',
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_REFRESH_SECRET, algorithm='HS256')

def decode_token(token, token_type='access'):
    """Decode and validate token"""
    try:
        secret = settings.JWT_SECRET if token_type == 'access' else settings.JWT_REFRESH_SECRET
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        
        # Verify token type
        if payload.get('type') != token_type:
            return None
        
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
\`\`\`

---

## 5. Authentication Middleware

\`\`\`python
# middleware/auth.py
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .utils.jwt import decode_token
from .models import User

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Skip auth for public endpoints
        public_paths = ['/api/v1/auth/login', '/api/v1/auth/register']
        if request.path in public_paths:
            return None
        
        # Get token from Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Missing token'}, status=401)
        
        token = auth_header[7:]  # Remove 'Bearer ' prefix
        
        # Decode token
        payload = decode_token(token, 'access')
        if not payload:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        
        # Get user
        try:
            user = User.objects.get(id=payload['user_id'], is_active=True)
            request.user = user
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=401)
        
        return None
\`\`\`

---

## 6. Token Refresh Flow

\`\`\`
Expired Access Token → Send Refresh Token → Validate → Generate New Tokens
\`\`\`

### Django Implementation:

\`\`\`python
@api_view(['POST'])
def refresh_token(request):
    refresh_token = request.COOKIES.get('refresh_token')
    
    if not refresh_token:
        return Response({'error': 'Refresh token missing'}, status=401)
    
    # Decode refresh token
    payload = decode_token(refresh_token, 'refresh')
    if not payload:
        return Response({'error': 'Invalid refresh token'}, status=401)
    
    # Get user
    try:
        user = User.objects.get(id=payload['user_id'], is_active=True)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=401)
    
    # Generate new tokens
    new_access_token = generate_access_token(user)
    new_refresh_token = generate_refresh_token(user)
    
    response = Response({
        'token': new_access_token
    })
    
    # Update refresh token cookie
    response.set_cookie(
        'refresh_token',
        new_refresh_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=7*24*60*60
    )
    
    return response
\`\`\`

---

## 7. Password Reset Flow

\`\`\`
Request Reset → Generate Token → Send Email → User Clicks Link → Validate Token → Reset Password
\`\`\`

### Django Implementation:

\`\`\`python
@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    
    try:
        user = User.objects.get(email=email, is_active=True)
    except User.DoesNotExist:
        # Return success even if user doesn't exist (security)
        return Response({'message': 'If email exists, reset link sent'})
    
    # Generate reset token
    reset_token = jwt.encode(
        {
            'user_id': str(user.id),
            'type': 'password_reset',
            'exp': datetime.utcnow() + timedelta(hours=1)
        },
        settings.JWT_SECRET,
        algorithm='HS256'
    )
    
    # Send email
    send_password_reset_email.delay(user.id, reset_token)
    
    return Response({'message': 'Password reset email sent'})

@api_view(['POST'])
def reset_password(request):
    token = request.data.get('token')
    new_password = request.data.get('newPassword')
    
    # Validate token
    payload = decode_token(token)
    if not payload or payload.get('type') != 'password_reset':
        return Response({'error': 'Invalid or expired token'}, status=400)
    
    # Get user
    user = User.objects.get(id=payload['user_id'])
    
    # Update password
    user.password_hash = make_password(new_password)
    user.save()
    
    # Log activity
    ActivityLog.objects.create(
        user=user,
        action_type='user.password_reset',
        action_description='Password was reset'
    )
    
    return Response({'message': 'Password reset successful'})
\`\`\`

---

## 8. Email Verification

\`\`\`python
@api_view(['POST'])
def verify_email(request):
    token = request.data.get('token')
    
    # Decode token
    payload = decode_token(token)
    if not payload or payload.get('type') != 'email_verification':
        return Response({'error': 'Invalid verification link'}, status=400)
    
    # Get user
    user = User.objects.get(id=payload['user_id'])
    
    # Mark as verified
    user.email_verified = True
    user.email_verified_at = timezone.now()
    user.save()
    
    return Response({'message': 'Email verified successfully'})
\`\`\`

---

## 9. Role-Based Access Control (RBAC)

\`\`\`python
# decorators/permissions.py
from functools import wraps
from django.http import JsonResponse

def require_role(allowed_roles):
    """Decorator to check user role within organization"""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            org_id = kwargs.get('org_id')
            
            # Get user's role in organization
            try:
                membership = OrganizationMember.objects.get(
                    organization_id=org_id,
                    user=request.user
                )
            except OrganizationMember.DoesNotExist:
                return JsonResponse(
                    {'error': 'Not a member of this organization'},
                    status=403
                )
            
            # Check role
            if membership.role not in allowed_roles:
                return JsonResponse(
                    {'error': 'Insufficient permissions'},
                    status=403
                )
            
            # Attach org to request
            request.org = membership.organization
            request.user_role = membership.role
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

# Usage
@api_view(['DELETE'])
@require_role(['owner', 'admin'])
def delete_member(request, org_id, user_id):
    # Only owners and admins can delete members
    pass
\`\`\`

---

## 10. Frontend Integration

\`\`\`typescript
// lib/auth.ts
export const authService = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Important for cookies
    })
    
    if (!res.ok) throw new Error('Login failed')
    
    const data = await res.json()
    localStorage.setItem('access_token', data.token)
    return data
  },
  
  async refreshToken() {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    })
    
    if (!res.ok) {
      // Refresh failed, logout
      this.logout()
      throw new Error('Session expired')
    }
    
    const data = await res.json()
    localStorage.setItem('access_token', data.token)
    return data
  },
  
  async makeAuthRequest(url: string, options: RequestInit = {}) {
    let token = localStorage.getItem('access_token')
    
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    })
    
    // If 401, try to refresh
    if (res.status === 401) {
      await this.refreshToken()
      token = localStorage.getItem('access_token')
      
      // Retry request
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        }
      })
    }
    
    return res
  },
  
  logout() {
    localStorage.removeItem('access_token')
    window.location.href = '/auth/login'
  }
}
\`\`\`

---

## Security Best Practices

1. **Always use HTTPS** in production
2. **Store refresh tokens in HttpOnly cookies** (not localStorage)
3. **Implement rate limiting** on auth endpoints
4. **Hash passwords with bcrypt** (work factor 12+)
5. **Use CSRF tokens** for state-changing operations
6. **Implement account lockout** after failed attempts
7. **Log all authentication events** for audit
8. **Rotate refresh tokens** on each use
9. **Invalidate tokens on password change**
10. **Use secure, random token generation**

---

This completes the authentication implementation guide!
