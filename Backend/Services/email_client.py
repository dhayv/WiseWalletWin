from typing import List

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from starlette.responses import JSONResponse
from models import UserIn, Users
from sqlmodel import Session, select


conf = ConnectionConfig(
    MAIL_USERNAME ="username",
    MAIL_PASSWORD = "**********",
    MAIL_FROM = "test@email.com",
    MAIL_PORT = 465,
    MAIL_SERVER = "mail server",
    MAIL_STARTTLS = False,
    MAIL_SSL_TLS = True,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)


html = """<p>hey</p>"""

 

class EmailService:
    def __init__(self, db_session: Session) -> None:
        self.db = db_session

    async def email_confirmation(self, email: str) -> JSONResponse:
            statement = select(Users).where(Users.email == email)
            user = self.db.exec(statement).first()

            message = MessageSchema(
                subject="Welcome to WiseWalletWins",
                recipients=[email]
                body=html,
                subtype=MessageType.html)

            fm = FastMail(conf)
            await fm.send_message(message)

            return JSONResponse(status_code=200, content={"message": "Confirmation email sent successfully"}) 
