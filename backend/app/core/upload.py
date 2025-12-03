import os
import uuid
from pathlib import Path
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from PIL import Image
import io

# Upload configuration
UPLOAD_DIR = Path("uploads")
PROFILE_PICTURES_DIR = UPLOAD_DIR / "profile_pictures"
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
MAX_IMAGE_DIMENSION = 2048  # Maximum width or height


def setup_upload_directories():
    """Create upload directories if they don't exist."""
    UPLOAD_DIR.mkdir(exist_ok=True)
    PROFILE_PICTURES_DIR.mkdir(exist_ok=True)


async def validate_image_file(file: UploadFile) -> None:
    """
    Validate that the uploaded file is a valid image.

    Args:
        file: The uploaded file to validate

    Raises:
        HTTPException: If validation fails
    """
    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read file content
    content = await file.read()
    file_size = len(content)

    # Check file size
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds maximum limit of {MAX_FILE_SIZE // (1024 * 1024)}MB"
        )

    # Validate that it's actually an image
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()  # Verify that it is, in fact, an image
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file"
        )

    # Reset file pointer for subsequent reads
    await file.seek(0)


async def save_profile_picture(file: UploadFile, user_id: str) -> str:
    """
    Save a profile picture for a user.

    Args:
        file: The uploaded image file
        user_id: The ID of the user

    Returns:
        str: The relative path to the saved file

    Raises:
        HTTPException: If validation or saving fails
    """
    # Ensure directories exist
    setup_upload_directories()

    # Validate the image
    await validate_image_file(file)

    # Generate unique filename
    file_ext = Path(file.filename).suffix.lower()
    unique_filename = f"{user_id}_{uuid.uuid4().hex}{file_ext}"
    file_path = PROFILE_PICTURES_DIR / unique_filename

    # Read and process image
    content = await file.read()
    image = Image.open(io.BytesIO(content))

    # Convert RGBA to RGB if necessary (for JPEG)
    if image.mode in ("RGBA", "LA", "P"):
        background = Image.new("RGB", image.size, (255, 255, 255))
        if image.mode == "P":
            image = image.convert("RGBA")
        background.paste(image, mask=image.split()[-1] if image.mode == "RGBA" else None)
        image = background

    # Resize if too large
    if image.width > MAX_IMAGE_DIMENSION or image.height > MAX_IMAGE_DIMENSION:
        image.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.Resampling.LANCZOS)

    # Save optimized image
    image.save(file_path, optimize=True, quality=85)

    # Return relative path
    return f"/uploads/profile_pictures/{unique_filename}"


def delete_profile_picture(file_path: Optional[str]) -> None:
    """
    Delete a profile picture file.

    Args:
        file_path: The path to the file to delete
    """
    if not file_path:
        return

    try:
        # Extract filename from path
        if file_path.startswith("/uploads/profile_pictures/"):
            filename = file_path.split("/")[-1]
            full_path = PROFILE_PICTURES_DIR / filename

            if full_path.exists():
                full_path.unlink()
    except Exception as e:
        # Log error but don't raise exception
        print(f"Error deleting profile picture: {e}")


def get_initials(full_name: str) -> str:
    """
    Get initials from a full name for avatar fallback.

    Args:
        full_name: The user's full name

    Returns:
        str: Up to 2 initials
    """
    if not full_name:
        return "U"

    parts = full_name.strip().split()
    if len(parts) == 1:
        return parts[0][0].upper()
    else:
        return f"{parts[0][0]}{parts[-1][0]}".upper()
