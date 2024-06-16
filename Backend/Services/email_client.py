import os

from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from models import Users
from sqlmodel import Session, select
from starlette.responses import JSONResponse

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


class EmailService:
    def __init__(self, db_session: Session) -> None:
        self.db = db_session

    async def email_verification(self, email: str, token: str) -> JSONResponse:
        statement = select(Users).where(Users.email == email)
        user = self.db.exec(statement).first()
        if not user:
            return JSONResponse(status_code=404, content={"message": "User not found"})

        verification_link = f"{os.getenv('SITE_URL')}/verify_email?token={token}"
        html = f"""
            <html>
            <body>
                <p>Hello,</p>
                <p>Click the following link to verify your email:</p>
                <a href="{verification_link}">{verification_link}</a>
            </body>
            </html>
            """

        message = MessageSchema(
            subject="Verify your email",
            recipients=[user.email],
            body=html,
            subtype=MessageType.html,
        )

        fm = FastMail(conf)
        try:
            await fm.send_message(message)
            return JSONResponse(
                status_code=200,
                content={"message": "Confirmation email sent successfully"},
            )
        except Exception as e:
            return JSONResponse(
                status_code=500, content={"message": f"Failed to send email: {str(e)}"}
            )
