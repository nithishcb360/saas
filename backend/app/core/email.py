import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


async def send_email(
    email_to: str,
    subject: str,
    html_content: str,
) -> bool:
    """
    Send an email using SMTP.

    Args:
        email_to: Recipient email address
        subject: Email subject
        html_content: HTML content of the email

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    try:
        # Validate SMTP configuration
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            logger.warning("SMTP credentials not configured. Email not sent.")
            return False

        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        message["To"] = email_to

        # Add HTML content
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        # Connect to SMTP server and send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(message)

        logger.info(f"Email sent successfully to {email_to}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email to {email_to}: {str(e)}")
        return False


def generate_password_reset_email(reset_link: str, user_name: str) -> str:
    """
    Generate HTML content for password reset email.

    Args:
        reset_link: Password reset link with token
        user_name: User's name

    Returns:
        str: HTML content for the email
    """
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background-color: #f9f9f9;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .header h1 {{
                color: #4F46E5;
                margin: 0;
            }}
            .content {{
                background-color: white;
                padding: 20px;
                border-radius: 5px;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }}
            .warning {{
                background-color: #FEF3C7;
                padding: 15px;
                border-left: 4px solid #F59E0B;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{settings.APP_NAME}</h1>
            </div>
            <div class="content">
                <h2>Password Reset Request</h2>
                <p>Hello {user_name},</p>
                <p>We received a request to reset your password. Click the button below to reset your password:</p>

                <center>
                    <a href="{reset_link}" class="button">Reset Password</a>
                </center>

                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #4F46E5;">{reset_link}</p>

                <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <ul>
                        <li>This link will expire in 1 hour</li>
                        <li>If you didn't request this, please ignore this email</li>
                        <li>Never share this link with anyone</li>
                    </ul>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated email from {settings.APP_NAME}. Please do not reply to this email.</p>
                <p>&copy; 2024 {settings.APP_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content


def generate_password_reset_success_email(user_name: str) -> str:
    """
    Generate HTML content for password reset success confirmation email.

    Args:
        user_name: User's name

    Returns:
        str: HTML content for the email
    """
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .container {{
                background-color: #f9f9f9;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .header h1 {{
                color: #4F46E5;
                margin: 0;
            }}
            .content {{
                background-color: white;
                padding: 20px;
                border-radius: 5px;
            }}
            .success-icon {{
                text-align: center;
                font-size: 48px;
                color: #10B981;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }}
            .warning {{
                background-color: #FEF3C7;
                padding: 15px;
                border-left: 4px solid #F59E0B;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{settings.APP_NAME}</h1>
            </div>
            <div class="content">
                <div class="success-icon">✓</div>
                <h2 style="text-align: center;">Password Reset Successful</h2>
                <p>Hello {user_name},</p>
                <p>Your password has been successfully reset. You can now log in with your new password.</p>

                <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <p>If you didn't make this change, please contact our support team immediately.</p>
                </div>
            </div>
            <div class="footer">
                <p>This is an automated email from {settings.APP_NAME}. Please do not reply to this email.</p>
                <p>&copy; 2024 {settings.APP_NAME}. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return html_content
