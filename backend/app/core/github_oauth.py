"""
GitHub OAuth integration utilities
"""
import httpx
from urllib.parse import urlencode
from app.core.config import settings


def get_github_oauth_url(state: str = None) -> str:
    """
    Generate GitHub OAuth authorization URL.
    """
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "scope": "user:email",
    }

    if state:
        params["state"] = state

    base_url = "https://github.com/login/oauth/authorize"
    return f"{base_url}?{urlencode(params)}"


async def exchange_code_for_token(code: str) -> dict:
    """
    Exchange authorization code for access token.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={
                "Accept": "application/json"
            },
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            }
        )

        if response.status_code != 200:
            raise Exception(f"Failed to exchange code for token: {response.text}")

        return response.json()


async def get_github_user_info(access_token: str) -> dict:
    """
    Get GitHub user information using access token.
    """
    async with httpx.AsyncClient() as client:
        # Get user profile
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )

        if user_response.status_code != 200:
            raise Exception(f"Failed to get user info: {user_response.text}")

        user_data = user_response.json()

        # Get user emails (GitHub doesn't always include email in user profile)
        emails_response = await client.get(
            "https://api.github.com/user/emails",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )

        emails_data = []
        if emails_response.status_code == 200:
            emails_data = emails_response.json()

        # Find primary email
        primary_email = None
        for email_obj in emails_data:
            if email_obj.get("primary") and email_obj.get("verified"):
                primary_email = email_obj.get("email")
                break

        # Fallback to email in user profile or first verified email
        if not primary_email:
            primary_email = user_data.get("email")
            if not primary_email and emails_data:
                for email_obj in emails_data:
                    if email_obj.get("verified"):
                        primary_email = email_obj.get("email")
                        break

        return {
            "id": str(user_data.get("id")),
            "email": primary_email,
            "name": user_data.get("name") or user_data.get("login"),
            "avatar_url": user_data.get("avatar_url"),
            "login": user_data.get("login"),
        }
