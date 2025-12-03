"""
Test script for password reset functionality.
Run this after starting the server to test the complete flow.
"""

import httpx
import asyncio

BASE_URL = "http://127.0.0.1:8000/api/v1/auth"
TEST_EMAIL = "test@example.com"
TEST_PASSWORD = "password123"
NEW_PASSWORD = "newpassword456"


async def test_password_reset_flow():
    """Test the complete password reset flow."""

    async with httpx.AsyncClient() as client:
        print("🚀 Starting Password Reset Flow Test\n")

        # Step 1: Register a test user
        print("1️⃣ Registering test user...")
        try:
            response = await client.post(
                f"{BASE_URL}/register",
                json={
                    "email": TEST_EMAIL,
                    "password": TEST_PASSWORD,
                    "full_name": "Test User",
                    "company_name": "Test Company"
                }
            )
            if response.status_code == 201:
                print(f"✅ User registered successfully: {TEST_EMAIL}")
            elif response.status_code == 400 and "already registered" in response.text:
                print(f"ℹ️  User already exists: {TEST_EMAIL}")
            else:
                print(f"❌ Registration failed: {response.status_code}")
                print(response.text)
                return
        except Exception as e:
            print(f"❌ Error during registration: {e}")
            return

        print()

        # Step 2: Request password reset
        print("2️⃣ Requesting password reset...")
        try:
            response = await client.post(
                f"{BASE_URL}/forgot-password",
                json={"email": TEST_EMAIL}
            )
            if response.status_code == 200:
                print("✅ Password reset email sent")
                print(f"   Message: {response.json()['message']}")
            else:
                print(f"❌ Password reset request failed: {response.status_code}")
                print(response.text)
                return
        except Exception as e:
            print(f"❌ Error during password reset request: {e}")
            return

        print()
        print("📧 Check your email for the password reset link!")
        print("   The email contains a token that you'll need for the next step.")
        print()
        print("⚠️  Note: If you don't see the email:")
        print("   1. Check your spam folder")
        print("   2. Verify SMTP_USER and SMTP_PASSWORD in .env file")
        print("   3. For Gmail, make sure you're using an App Password")
        print()

        # Step 3: Prompt user to enter the token
        print("3️⃣ Enter the reset token from the email:")
        reset_token = input("   Token: ").strip()

        if not reset_token:
            print("❌ No token provided. Test aborted.")
            return

        print()

        # Step 4: Reset password with token
        print("4️⃣ Resetting password with token...")
        try:
            response = await client.post(
                f"{BASE_URL}/reset-password",
                json={
                    "token": reset_token,
                    "new_password": NEW_PASSWORD
                }
            )
            if response.status_code == 200:
                print("✅ Password reset successful!")
                print(f"   Message: {response.json()['message']}")
            else:
                print(f"❌ Password reset failed: {response.status_code}")
                print(response.text)
                return
        except Exception as e:
            print(f"❌ Error during password reset: {e}")
            return

        print()

        # Step 5: Verify login with new password
        print("5️⃣ Verifying login with new password...")
        try:
            response = await client.post(
                f"{BASE_URL}/login",
                data={
                    "username": TEST_EMAIL,  # OAuth2 uses 'username' field
                    "password": NEW_PASSWORD
                }
            )
            if response.status_code == 200:
                print("✅ Login successful with new password!")
                print("   Password reset flow completed successfully! 🎉")
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"❌ Error during login: {e}")


async def test_forgot_password_only():
    """Test only the forgot password endpoint."""

    async with httpx.AsyncClient() as client:
        print("📧 Testing Forgot Password Endpoint\n")

        email = input("Enter email address: ").strip()

        if not email:
            print("❌ No email provided.")
            return

        try:
            response = await client.post(
                f"{BASE_URL}/forgot-password",
                json={"email": email}
            )
            print(f"\nStatus Code: {response.status_code}")
            print(f"Response: {response.json()}")

            if response.status_code == 200:
                print("\n✅ Check your email for the reset link!")
        except Exception as e:
            print(f"❌ Error: {e}")


async def main():
    """Main menu."""
    print("=" * 60)
    print("Password Reset Functionality Test")
    print("=" * 60)
    print()
    print("Choose a test:")
    print("1. Complete password reset flow (register + reset + verify)")
    print("2. Test forgot-password endpoint only")
    print()

    choice = input("Enter choice (1 or 2): ").strip()
    print()

    if choice == "1":
        await test_password_reset_flow()
    elif choice == "2":
        await test_forgot_password_only()
    else:
        print("❌ Invalid choice")


if __name__ == "__main__":
    asyncio.run(main())
