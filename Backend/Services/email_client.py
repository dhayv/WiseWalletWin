from typing import List

from fastapi import BackgroundTasks
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.responses import JSONResponse
from models import EmailSchema


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


html = """
<p>Thanks for using Fastapi-mail</p> 
"""

class EmailService:

    @app.post("/email")
    async def simple_send(email: EmailSchema) -> JSONResponse:

        message = MessageSchema(
            subject="Fastapi-Mail module",
            recipients=email.dict().get("email"),
            body=html,
            subtype=MessageType.html)

        fm = FastMail(conf)
        await fm.send_message(message)
        return JSONResponse(status_code=200, content={"message": "email has been sent"}) 

