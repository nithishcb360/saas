from fastapi import APIRouter, HTTPException, status, Depends, Query
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    PasswordReset,
    PasswordResetConfirm
)
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    generate_reset_token
)
from app.core.database import get_db
from app.models.user import User
from app.core.email import (
    send_email,
    generate_password_reset_email,
    generate_password_reset_success_email
)
from app.core.config import settings
from app.core.google_oauth import (
    get_google_oauth_url,
    exchange_code_for_token,
    verify_google_token
)

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """
    Register a new user.
    """
    # Check if user already exists
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        company_name=user_data.company_name,
        hashed_password=hashed_password,
        is_active=True,
        is_verified=True  # Auto-verify for development
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Create tokens
    access_token = create_access_token(data={"sub": new_user.email})
    refresh_token = create_refresh_token(data={"sub": new_user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    """
    Login user and return JWT tokens.
    """
    # Find user by email (username field is used for email)
    result = await db.execute(
        select(User).where(User.email == form_data.username)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    # Create tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str):
    """
    Refresh access token using refresh token.
    """
    # TODO: Implement token refresh logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh not implemented yet"
    )

@router.post("/logout")
async def logout():
    """
    Logout user (invalidate tokens).
    """
    # TODO: Implement logout logic
    # - Add token to blacklist in Redis
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(data: PasswordReset, db: AsyncSession = Depends(get_db)):
    """
    Send password reset email to the user.
    """
    # Find user by email
    result = await db.execute(
        select(User).where(User.email == data.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        # Return error for unregistered email
        raise HTTPException(
            status_code=404,
            detail="No account found with this email address. Please check your email or register for a new account."
        )

    # Generate reset token
    reset_token = generate_reset_token()
    reset_token_expires = datetime.utcnow() + timedelta(hours=1)

    # Update user with reset token
    user.reset_token = reset_token
    user.reset_token_expires = reset_token_expires
    await db.commit()

    # Generate reset link
    reset_link = f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"

    # Generate email content
    html_content = generate_password_reset_email(
        reset_link=reset_link,
        user_name=user.full_name
    )

    # Try to send email
    email_sent = await send_email(
        email_to=user.email,
        subject=f"Password Reset Request - {settings.APP_NAME}",
        html_content=html_content
    )

    if not email_sent:
        # In development, log the reset link instead of failing
        if settings.ENVIRONMENT == "development":
            print("\n" + "="*80)
            print("PASSWORD RESET EMAIL (Development Mode)")
            print("="*80)
            print(f"To: {user.email}")
            print(f"User: {user.full_name}")
            print(f"\nReset Link:\n{reset_link}")
            print("\nCopy this link and paste it in your browser to reset the password.")
            print("="*80 + "\n")
            # Return success even if email fails in dev mode
            return success_message
        else:
            # In production, fail if email can't be sent
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send password reset email. Please contact support."
            )

    return success_message

@router.post("/reset-password")
async def reset_password(data: PasswordResetConfirm, db: AsyncSession = Depends(get_db)):
    """
    Reset password using the token received via email.
    """
    # Find user by reset token
    result = await db.execute(
        select(User).where(User.reset_token == data.token)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )

    # Check if token has expired
    if not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired. Please request a new password reset."
        )

    # Update password
    user.hashed_password = get_password_hash(data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    user.updated_at = datetime.utcnow()

    await db.commit()

    # Send confirmation email
    html_content = generate_password_reset_success_email(user.full_name)
    await send_email(
        email_to=user.email,
        subject=f"Password Reset Successful - {settings.APP_NAME}",
        html_content=html_content
    )

    return {"message": "Password reset successful. You can now login with your new password."}

@router.post("/verify-email")
async def verify_email(token: str):
    """
    Verify user email using token.
    """
    # TODO: Implement email verification
    return {"message": "Email verified successfully"}

@router.post("/resend-verification")
async def resend_verification(email: str):
    """
    Resend verification email.
    """
    # TODO: Implement resend verification email
    return {"message": "Verification email sent"}

@router.get("/google/login")
async def google_login():
    """
    Redirect to Google OAuth login page.
    """
    auth_url = get_google_oauth_url()
    return {"auth_url": auth_url}

@router.get("/google/callback")
async def google_callback(
    code: str = Query(..., description="Authorization code from Google"),
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Google OAuth callback and create/login user.
    """
    # Exchange code for ID token
    id_token = await exchange_code_for_token(code)
    if not id_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to obtain token from Google"
        )

    # Verify token and get user info
    user_info = await verify_google_token(id_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to verify Google token"
        )

    # Check if user exists by Google ID
    result = await db.execute(
        select(User).where(User.google_id == user_info["google_id"])
    )
    user = result.scalar_one_or_none()

    # If no user by Google ID, check by email
    if not user:
        result = await db.execute(
            select(User).where(User.email == user_info["email"])
        )
        user = result.scalar_one_or_none()

        if user:
            # User exists with this email but not linked to Google yet
            # Link the Google account
            user.google_id = user_info["google_id"]
            user.oauth_provider = "google"
            if not user.profile_picture and user_info.get("profile_picture"):
                user.profile_picture = user_info["profile_picture"]
            user.is_verified = True
            await db.commit()
        else:
            # Create new user
            user = User(
                email=user_info["email"],
                full_name=user_info["full_name"],
                google_id=user_info["google_id"],
                oauth_provider="google",
                profile_picture=user_info.get("profile_picture"),
                hashed_password=None,  # No password for OAuth users
                is_active=True,
                is_verified=True  # Google accounts are pre-verified
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()

    # Create tokens
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})

    # Redirect to frontend with tokens
    frontend_redirect = f"{settings.FRONTEND_URL}/auth/callback?access_token={access_token}&refresh_token={refresh_token}"
    return RedirectResponse(url=frontend_redirect)
