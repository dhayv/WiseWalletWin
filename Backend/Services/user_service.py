from fastapi import BackgroundTasks, HTTPException, Response, status
from models import UserIn, Users, UserUpdate
from Services.auth import create_email_access_token, get_password_hash
from Services.email_client import EmailService


class UserService:

    async def get_user_by_username(self, username: str):
        user = await Users.find_one(Users.username == username)

        return user

    async def get_user_by_email(self, email: str):
        statement = Users.find_one(Users.email == email)

        return await statement

    async def add_user(self, user_data: UserIn, background_task: BackgroundTasks):

        if await self.get_user_by_username(user_data.username):
            raise HTTPException(status_code=400, detail="Username already exists")
        if await self.get_user_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email already exists")

        hashed_password = get_password_hash(user_data.password)

        db_user = Users(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            first_name=user_data.first_name,
            is_email_verified=False,
        )
        await db_user.insert()

        email_service = EmailService()
        token = create_email_access_token(db_user.email)
        background_task.add_task(
            email_service.email_verification, user_data.email, token
        )

        return db_user

    # user/me

    async def read_user(self, user_id: str):
        result = await Users.find_one(Users.id == user_id)

        if not result:
            raise HTTPException(status_code=404, detail="User account not found")
        return result

    async def update_user(self, user_id: str, user_update: UserUpdate):
        result = await Users.get(Users.id == user_id)

        if not result:
            raise HTTPException(status_code=404, detail="User not found")

        update_data = user_update.model_dump_json(exclude_unset=True)

        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            update_data["hashed_password"] = hashed_password

        await result.update({"$set": update_data})

        return result

    async def delete_user(self, user_id):
        user = await Users.get(Users.id == user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User account not found")
        await user.delete()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
