from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from fastapi.security import OAuth2PasswordBearer
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.schemas.user import User, UserUpdate, UserProfileUpdate, PasswordChange
from app.core.database import get_db
from app.core.security import decode_token, verify_password, get_password_hash
from app.models.user import User as UserModel
from app.core.upload import save_profile_picture, delete_profile_picture

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user_from_token(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> UserModel:
    """
    Dependency to get current user from JWT token.
    """
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(select(UserModel).where(UserModel.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

@router.get("/me", response_model=User)
async def get_current_user(current_user: UserModel = Depends(get_current_user_from_token)):
    """
    Get current user profile.
    """
    return current_user

@router.put("/me", response_model=User)
async def update_current_user(
    user_data: UserProfileUpdate,
    current_user: UserModel = Depends(get_current_user_from_token),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user profile information.
    """
    # Update only provided fields
    update_data = user_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    current_user.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(current_user)

    return current_user

@router.post("/me/profile-picture", response_model=User)
async def upload_profile_picture(
    file: UploadFile = File(...),
    current_user: UserModel = Depends(get_current_user_from_token),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload or update user profile picture.
    """
    # Delete old profile picture if exists
    if current_user.profile_picture:
        delete_profile_picture(current_user.profile_picture)

    # Save new profile picture
    file_path = await save_profile_picture(file, current_user.id)

    # Update user record
    current_user.profile_picture = file_path
    current_user.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(current_user)

    return current_user

@router.delete("/me/profile-picture", response_model=User)
async def delete_user_profile_picture(
    current_user: UserModel = Depends(get_current_user_from_token),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete user profile picture.
    """
    if current_user.profile_picture:
        delete_profile_picture(current_user.profile_picture)
        current_user.profile_picture = None
        current_user.updated_at = datetime.utcnow()

        await db.commit()
        await db.refresh(current_user)

    return current_user

@router.post("/me/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: UserModel = Depends(get_current_user_from_token),
    db: AsyncSession = Depends(get_db)
):
    """
    Change user password.
    """
    # Verify passwords match
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirmation do not match"
        )

    # Verify current password
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Check that new password is different from current
    if verify_password(password_data.new_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )

    # Update password
    current_user.hashed_password = get_password_hash(password_data.new_password)
    current_user.updated_at = datetime.utcnow()

    await db.commit()

    return {"message": "Password changed successfully"}

@router.delete("/me")
async def delete_current_user():
    """
    Delete current user account.
    """
    # TODO: Implement account deletion logic
    return {"message": "Account deleted successfully"}

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str):
    """
    Get user by ID (admin only).
    """
    # TODO: Implement get user by ID logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Get user not implemented yet"
    )

@router.get("/", response_model=List[User])
async def list_users(skip: int = 0, limit: int = 100):
    """
    List all users (admin only).
    """
    # TODO: Implement list users logic
    return []

