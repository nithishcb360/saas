"""Google OAuth utilities for authentication."""
from google.oauth2 import id_token
from google.auth.transport import requests
from typing import Optional, Dict
from app.core.config import settings

GOOGLE_CLIENT_ID = settings.GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET = settings.GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI = settings.GOOGLE_REDIRECT_URI


def get_google_oauth_url() -> str:
    """
    Generate Google OAuth authorization URL.

    Returns:
        str: The authorization URL to redirect users to
    """
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }

    query_string = "&".join([f"{key}={value}" for key, value in params.items()])
    return f"{base_url}?{query_string}"


async def verify_google_token(token: str) -> Optional[Dict[str, any]]:
    """
    Verify Google ID token and extract user information.

    Args:
        token: The Google ID token to verify

    Returns:
        Dict containing user info if valid, None otherwise
        {
            'sub': Google user ID,
            'email': User's email,
            'name': User's full name,
            'picture': Profile picture URL,
            'email_verified': Boolean
        }
    """
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        # Token is valid, return user info
        return {
            "google_id": idinfo.get("sub"),
            "email": idinfo.get("email"),
            "full_name": idinfo.get("name"),
            "profile_picture": idinfo.get("picture"),
            "email_verified": idinfo.get("email_verified", False)
        }
    except Exception as e:
        print(f"Error verifying Google token: {e}")
        return None


async def exchange_code_for_token(code: str) -> Optional[str]:
    """
    Exchange authorization code for Google ID token.

    Args:
        code: The authorization code from Google

    Returns:
        The ID token if successful, None otherwise
    """
    import httpx

    token_url = "https://oauth2.googleapis.com/token"

    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            response.raise_for_status()

            tokens = response.json()
            return tokens.get("id_token")
    except Exception as e:
        print(f"Error exchanging code for token: {e}")
        return None
