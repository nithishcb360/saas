from fastapi import APIRouter, HTTPException, status, Depends
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

    # Always return success message to prevent email enumeration attacks
    success_message = {
        "message": "If an account exists with this email, a password reset link has been sent."
    }

    if not user:
        # Don't reveal that the user doesn't exist
        return success_message

    # Generate reset token
    reset_token = generate_reset_token()
    reset_token_expires = datetime.utcnow() + timedelta(hours=1)

    # Update user with reset token
    user.reset_token = reset_token
    user.reset_token_expires = reset_token_expires
    await db.commit()

    # Generate reset link
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

    # Generate email content
    html_content = generate_password_reset_email(
        reset_link=reset_link,
        user_name=user.full_name
    )

    # Send email
    email_sent = await send_email(
        email_to=user.email,
        subject=f"Password Reset Request - {settings.APP_NAME}",
        html_content=html_content
    )

    if not email_sent:
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
