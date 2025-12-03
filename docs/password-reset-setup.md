# Password Reset Email Setup Guide

This guide explains how to configure and use the forgot password functionality with email sending.

## Features Implemented

✅ **Forgot Password Endpoint** - Sends reset link via email
✅ **Reset Password Endpoint** - Validates token and updates password
✅ **Email Templates** - Beautiful HTML email templates
✅ **Security** - Token expiration (1 hour), secure token generation
✅ **Confirmation Emails** - Success notification after password reset

## Email Configuration

### 1. Configure Environment Variables

Update your `.env` file with your SMTP credentials:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
EMAILS_FROM_EMAIL=noreply@saaskit.com
EMAILS_FROM_NAME=SaaSKit
```

### 2. Gmail Setup (Recommended for Development)

If using Gmail, you need to generate an **App Password**:

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Windows Computer** (or Other)
5. Click **Generate**
6. Copy the 16-character password and use it as `SMTP_PASSWORD`

**Important:** Never use your actual Gmail password. Always use App Passwords.

### 3. Other Email Providers

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-smtp-password
```

#### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key-id
SMTP_PASSWORD=your-aws-secret-access-key
```

## API Endpoints

### 1. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account exists with this email, a password reset link has been sent."
}
```

**Security Note:** The endpoint always returns the same message, whether the email exists or not, to prevent email enumeration attacks.

### 2. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request Body:**
```json
{
  "token": "secure-reset-token-from-email",
  "new_password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successful. You can now login with your new password."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired token
- `400 Bad Request`: Token has expired (after 1 hour)

## Testing the Functionality

### Using cURL

1. **Request Password Reset:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

2. **Check your email** for the reset link with token

3. **Reset Password:**
```bash
curl -X POST "http://127.0.0.1:8000/api/v1/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_FROM_EMAIL","new_password":"newpassword123"}'
```

### Using Postman/Thunder Client

1. Import the endpoints into your API client
2. Send POST request to `/api/v1/auth/forgot-password` with email
3. Check email inbox for reset link
4. Copy token from the reset link URL
5. Send POST request to `/api/v1/auth/reset-password` with token and new password

## Email Templates

The system includes two HTML email templates:

### 1. Password Reset Request Email
- Professional design with your app branding
- Clear call-to-action button
- Security warnings
- Token expiration notice (1 hour)
- Fallback link for email clients that don't support buttons

### 2. Password Reset Success Email
- Confirmation that password was changed
- Security alert if user didn't make the change
- Professional branding

## Security Features

1. **Secure Token Generation**: Uses `secrets.token_urlsafe(32)` for cryptographically secure tokens
2. **Token Expiration**: Reset tokens expire after 1 hour
3. **One-Time Use**: Tokens are cleared after successful password reset
4. **Email Enumeration Protection**: Same response for existing and non-existing emails
5. **Password Hashing**: Passwords are hashed using bcrypt
6. **HTTPS Recommended**: Always use HTTPS in production

## Database Schema

The `users` table includes these fields for password reset:

```python
reset_token = Column(String, nullable=True)
reset_token_expires = Column(DateTime, nullable=True)
```

These fields are automatically managed by the system.

## Frontend Integration

Create a password reset page at `/reset-password` that:

1. Extracts the token from URL query parameter
2. Shows a form for entering new password
3. Calls the reset password API endpoint
4. Redirects to login on success

**Example URL:** `http://localhost:3000/reset-password?token=abc123xyz`

## Troubleshooting

### Emails Not Sending

1. **Check SMTP credentials** - Ensure they're correct in `.env`
2. **Check firewall** - Port 587 must be open
3. **Gmail blocking** - Enable "Less secure app access" or use App Passwords
4. **Check logs** - Look for error messages in console output
5. **Test SMTP connection** - Use a tool like Telnet to test connection

### Token Expired Error

- Reset tokens expire after 1 hour
- Request a new password reset if token expired
- Check server time is synchronized (NTP)

### Email in Spam

- Configure SPF, DKIM, and DMARC records for your domain
- Use a reputable email service provider
- Avoid spam trigger words in email content

## Production Recommendations

1. **Use Professional Email Service**
   - SendGrid, AWS SES, Mailgun, or similar
   - Better deliverability and reputation management
   - Higher sending limits

2. **Configure Custom Domain**
   - Use your own domain for sender email
   - Set up proper DNS records (SPF, DKIM, DMARC)

3. **Monitor Email Delivery**
   - Track bounce rates and delivery failures
   - Set up webhooks for email events

4. **Rate Limiting**
   - Implement rate limiting on forgot-password endpoint
   - Prevent abuse and spam

5. **Audit Logging**
   - Log password reset requests
   - Monitor for suspicious activity

## Code Structure

```
backend/
├── app/
│   ├── api/endpoints/
│   │   └── auth.py              # Password reset endpoints
│   ├── core/
│   │   ├── email.py             # Email sending utilities
│   │   ├── security.py          # Token generation
│   │   └── config.py            # Email configuration
│   ├── models/
│   │   └── user.py              # User model with reset fields
│   └── schemas/
│       └── auth.py              # Request/response schemas
```

## Support

For issues or questions:
1. Check logs for error messages
2. Verify email configuration
3. Test with a different email provider
4. Review the security settings

## License

This implementation is part of the SaaSKit project.
