from typing import List
import os
from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from starlette.responses import JSONResponse
from models import Users
from sqlmodel import Session, select

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=465,
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

verification_link = os.getenv("SITE_URL")

html = f"""
    <html>
    <body>
        <p>Hello,</p>
        <p>Click the following link to verify your email:</p>
        <a href="{verification_link}">{verification_link}</a>
    </body>
    </html>
    """


class EmailService:
    def __init__(self, db_session: Session) -> None:
        self.db = db_session

    async def email_confirmation(self, email: str) -> JSONResponse:
        statement = select(Users).where(Users.email == email)
        user = self.db.exec(statement).first()

        message = MessageSchema(
            subject="Welcome to WiseWallet",
            recipients=[user.email],
            body=html,
            subtype=MessageType.html,
        )

        fm = FastMail(conf)
        await fm.send_message(message)

        return JSONResponse(
            status_code=200, content={"message": "Confirmation email sent successfully"}
        )
