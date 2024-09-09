import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv
from fastapi import HTTPException
from models import Users
from starlette.responses import JSONResponse

load_dotenv()


class EmailService:

    async def email_verification(self, email: str, token: str) -> JSONResponse:
        user = await Users.find_one(Users.email == email)

        if not user:
            return JSONResponse(status_code=404, content={"message": "User not found"})

        verification_link = f"{os.getenv('SITE_URL')}/verify_email?token={token}"
        html_content = f"""
                <p>Hello {user.first_name},</p>
                <p>Click the following link to verify your email:</p>
                <a href="{verification_link}">{verification_link}</a>
            """

        # Email details
        message = MIMEMultipart()
        message["From"] = f"WiseWallet {os.getenv('ZOHO_FROM')}"
        message["To"] = email
        message["Subject"] = "Verify your email"
        message.attach(MIMEText(html_content, "html"))

        # SMTP configuration
        smtp_server = os.getenv("ZOHO_SERVER")
        smtp_port = 465  # Trying port 2525
        smtp_username = os.getenv("ZOHO_USERNAME")
        smtp_password = os.getenv("ZOHO_PASSWORD")

        try:
            with smtplib.SMTP(smtp_server, smtp_port, timeout=60) as server:
                print("Connecting to SMTP server")  # Debugging statement
                server.starttls()
                server.login(smtp_username, smtp_password)
                server.sendmail(message["From"], message["To"], message.as_string())
                print("Email sent successfully")  # Debugging statement

            return JSONResponse(
                status_code=200,
                content={"message": "Confirmation email sent successfully"},
            )
        except Exception as e:
            print(f"Failed to send email: {str(e)}")  # Debugging statement
            raise HTTPException(
                status_code=500, detail=f"Failed to send email: {str(e)}"
            )
