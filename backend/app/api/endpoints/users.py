from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas.user import User, UserUpdate
from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User as UserModel

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
async def update_current_user(user_data: UserUpdate):
    """
    Update current user profile.
    """
    # TODO: Implement update user logic
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="User update not implemented yet"
    )

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
