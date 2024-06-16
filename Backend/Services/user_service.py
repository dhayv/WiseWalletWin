from fastapi import HTTPException, Response, status, BackgroundTasks
from models import UserIn, Users, UserUpdate
from Services.auth import get_password_hash, create_email_access_token
from sqlmodel import Session, select
from Services.email_client import EmailService


class UserService:
    def __init__(self, db_session: Session):
        self.db = db_session

    def get_user_by_username(self, username: str):
        statement = select(Users).where(Users.username == username)
        result = self.db.exec(statement).first()
        return result

    def get_user_by_email(self, email: str):
        statement = select(Users).where(Users.email == email)
        result = self.db.exec(statement).first()
        return result

    def add_user(self, user_data: UserIn, background_task: BackgroundTasks):
        if self.get_user_by_username(user_data.username):
            raise HTTPException(status_code=400, detail="Username already exists")
        if self.get_user_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email already exists")

        hashed_password = get_password_hash(user_data.password)
        db_user = Users(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            phone_number=user_data.phone_number,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)

        email_service = EmailService(self.db)
        token = create_email_access_token(db_user.email)
        background_task.add_task(email_service.email_verification, user_data.email, token)

        return db_user

    # user/me

    def read_user(self, user_id: int):
        statement = select(Users).where(Users.id == user_id)
        result = self.db.exec(statement).first()
        if not result:
            raise HTTPException(status_code=404, detail="User account not found")
        return result

    def update_user(self, user_id: int, user_update: UserUpdate):
        statement = select(Users).where(Users.id == user_id)
        result = self.db.exec(statement).first()
        if not result:
            raise HTTPException(status_code=404, detail="User not found")

        update_data = user_update.model_dump(exclude_unset=True)

        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            update_data["password"] = hashed_password
            del update_data["password"]

        for key, value in update_data.items():
            setattr(
                result, key if key != "hashed_password" else "hashed_password", value
            )

        self.db.add(result)
        self.db.commit()
        self.db.refresh(result)
        return result

    def delete_user(self, user_id):
        statement = select(Users).where(Users.id == user_id)
        result = self.db.exec(statement).first()
        if not result:
            raise HTTPException(status_code=404, detail="User account not found")
        self.db.delete(result)
        self.db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
