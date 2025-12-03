# Google OAuth Setup Guide

This guide explains how to set up Google OAuth login for your SaaS application.

## Overview

Google OAuth login has been fully implemented with the following features:
- **"Continue with Google"** button on login and signup pages
- Automatic user creation for new Google users
- Account linking for existing users with the same email
- Profile picture import from Google account
- Auto-verification of Google-authenticated users

## Backend Implementation

### Files Created/Modified:

1. **`backend/app/core/google_oauth.py`** (NEW)
   - `get_google_oauth_url()` - Generates Google OAuth authorization URL
   - `verify_google_token()` - Verifies Google ID token and extracts user info
   - `exchange_code_for_token()` - Exchanges authorization code for ID token

2. **`backend/app/api/endpoints/auth.py`** (MODIFIED)
   - `GET /auth/google/login` - Returns Google OAuth URL
   - `GET /auth/google/callback` - Handles OAuth callback and creates/logs in user

3. **`backend/app/models/user.py`** (MODIFIED)
   - Added `google_id` column (unique, indexed)
   - Added `oauth_provider` column
   - Made `hashed_password` nullable (OAuth users don't have passwords)

4. **`backend/app/core/config.py`** (MODIFIED)
   - Added `GOOGLE_CLIENT_ID`
   - Added `GOOGLE_CLIENT_SECRET`
   - Added `GOOGLE_REDIRECT_URI`

5. **`backend/requirements.txt`** (MODIFIED)
   - Added `google-auth==2.34.0`
   - Added `google-auth-oauthlib==1.2.1`
   - Added `google-auth-httplib2==0.2.0`

### Database Changes:

```sql
ALTER TABLE users ADD COLUMN google_id TEXT;
ALTER TABLE users ADD COLUMN oauth_provider TEXT;
CREATE UNIQUE INDEX idx_users_google_id ON users(google_id);
```

## Frontend Implementation

### Files Created/Modified:

1. **`frontend/app/auth/login/page.tsx`** (MODIFIED)
   - Added `handleGoogleLogin()` function
   - Connected Google button to OAuth flow

2. **`frontend/app/auth/signup/page.tsx`** (MODIFIED)
   - Added `handleGoogleLogin()` function
   - Connected Google button to OAuth flow

3. **`frontend/app/auth/callback/page.tsx`** (NEW)
   - Handles OAuth redirect from Google
   - Extracts tokens from URL
   - Stores tokens and redirects to dashboard

## Setup Instructions

### Step 1: Create Google OAuth Application

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Choose **Web application**
6. Configure:
   - **Name**: Your app name (e.g., "SaaSKit")
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://127.0.0.1:8000/api/v1/auth/google/callback` (development)
     - `https://api.yourdomain.com/api/v1/auth/google/callback` (production)
7. Click **Create**
8. Copy your **Client ID** and **Client Secret**

### Step 2: Configure Environment Variables

Update `backend/.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/api/v1/auth/google/callback
```

**Important**: Replace the placeholder values with your actual credentials from Step 1.

### Step 3: Update for Production

When deploying to production, update:

1. **Backend `.env`**:
```env
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/api/v1/auth/google/callback
```

2. **Google Cloud Console**:
   - Add production URLs to authorized origins and redirect URIs
   - Consider creating separate OAuth credentials for production

## How It Works

### Login Flow:

1. User clicks **"Continue with Google"** button
2. Frontend calls `GET /api/v1/auth/google/login`
3. Backend returns Google OAuth authorization URL
4. User is redirected to Google's login page
5. User authenticates with Google
6. Google redirects back to `GET /api/v1/auth/google/callback?code=...`
7. Backend:
   - Exchanges code for ID token
   - Verifies token with Google
   - Checks if user exists by `google_id` or `email`
   - Creates new user OR links Google account to existing user
   - Generates JWT access and refresh tokens
   - Redirects to frontend callback page with tokens
8. Frontend callback page:
   - Extracts tokens from URL
   - Stores in localStorage
   - Redirects to dashboard

### User Creation Logic:

```
IF user exists with google_id:
    → Login existing user
ELSE IF user exists with email:
    → Link Google account (add google_id)
    → Update profile picture if not set
    → Login user
ELSE:
    → Create new user with:
        - email from Google
        - full_name from Google
        - google_id from Google
        - profile_picture from Google
        - oauth_provider = "google"
        - hashed_password = NULL
        - is_verified = True
    → Login new user
```

## Security Features

1. **Token Verification**: All Google tokens are verified with Google's servers
2. **Email Enumeration Protection**: Same pattern as regular login
3. **Unique Google ID**: Prevents duplicate accounts
4. **Account Linking**: Safely links Google to existing email accounts
5. **Auto-verification**: Google accounts are pre-verified

## Testing

### Manual Testing:

1. Start backend: `cd backend && python -m uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `http://localhost:3000/auth/login`
4. Click **"Continue with Google"**
5. Sign in with your Google account
6. Verify you're redirected to dashboard

### API Testing:

```bash
# Get Google OAuth URL
curl http://127.0.0.1:8000/api/v1/auth/google/login

# Response:
{
  "auth_url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=..."
}
```

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verify the redirect URI in Google Cloud Console matches exactly
- Check for http vs https, trailing slashes, port numbers

### Error: "invalid_client"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that credentials are for the correct Google Cloud project

### Error: "access_denied"
- User cancelled the OAuth flow
- User's Google account may not have permission

### Token Verification Fails
- Check that `google-auth` library is installed
- Verify system time is correct (token validation is time-sensitive)

## Future Enhancements

Potential improvements:
1. Add GitHub OAuth login
2. Add Microsoft OAuth login
3. Allow unlinking OAuth accounts
4. Add OAuth account management in settings
5. Support multiple OAuth providers per user

## Files Summary

### Backend Files:
- `backend/app/core/google_oauth.py` - OAuth utilities
- `backend/app/api/endpoints/auth.py` - OAuth endpoints
- `backend/app/models/user.py` - User model with OAuth support
- `backend/app/core/config.py` - Configuration
- `backend/.env` - Environment variables

### Frontend Files:
- `frontend/app/auth/login/page.tsx` - Login page with Google button
- `frontend/app/auth/signup/page.tsx` - Signup page with Google button
- `frontend/app/auth/callback/page.tsx` - OAuth callback handler

### Database:
- Added `google_id` column to users table
- Added `oauth_provider` column to users table
- Made `hashed_password` nullable

## Support

For issues or questions:
1. Check Google Cloud Console for OAuth configuration
2. Verify environment variables are set correctly
3. Check backend logs for detailed error messages
4. Ensure all dependencies are installed
