from datetime import timedelta

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, SecurityScopes
from models import UserIn, UserOut, Users, UserUpdate
from Services.auth import (
    ACCESS_TOKEN_EXPIRES_MINUTES,
    Token,
    authenticate_user,
    create_access_token,
    get_current_active_user,
    verify_token,
)
from Services.calculations import calc_income_minus_expenses, sum_of_all_expenses
from Services.user_service import UserService

router = APIRouter()


def get_user_service() -> UserService:
    return UserService()


# This endpoint is used tp validate token
# it updates the use is_email_verfied_status
@router.get("/verify_email")
async def verify_email_endpoint(
    security_scopes: SecurityScopes,
    token: str,
    service: UserService = Depends(get_user_service),
):
    token_data = verify_token(token, security_scopes)
    if not token_data:
        raise HTTPException(status_code=403, detail="Invalid or expired token")

    email = token_data.username
    user = await service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_email_verified:
        raise HTTPException(status_code=400, detail="Email already verified")

    user.is_email_verified = True

    await user.save()
    return {"message": "Email verified successfully!"}


# This endpoint is used for user login. It verifies the user's credentials and returns an access token.
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):

    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verfied",
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# This endpoint is used for user signup.
# It adds a new user to the database.
# Also Check if username or email exists in the database.
@router.post(
    "/user",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def add_user(
    user: UserIn,
    background_tasks: BackgroundTasks,
    service: UserService = Depends(get_user_service),
):
    return await service.add_user(user, background_tasks)


# This endpoint is used to get the profile of the currently logged in user.
@router.get("/user/me", response_model=UserOut)
async def read_user_me(
    current_user: Users = Depends(get_current_active_user),
    service: UserService = Depends(get_user_service),
):
    return await service.read_user(current_user.id)


# This endpoint is used to get the profile of a specific user based on their user_id.
@router.get("/user/{user_id}", response_model=UserOut)
async def read_user(user_id: str, service: UserService = Depends(get_user_service)):
    return await service.read_user(user_id)


# This endpoint is used to get total expense of a specific user based on their user_id.
@router.get("/user/{user_id}/total_expenses", response_model=dict)
async def read_total_expenses(user_id: str):
    total = await sum_of_all_expenses(user_id)
    return {"total_expenses": total}


# This endpoint is used to get the total income minus expenses of a specific user based on their user_id.
@router.get("/user/{user_id}/income_minus_expenses", response_model=dict)
async def read_total_income_minus_expenses(user_id: str):
    total = await calc_income_minus_expenses(user_id)
    return {"income_minus_expenses": total}


@router.put("/user/{user_id}", response_model=UserOut)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    service: UserService = Depends(get_user_service),
):
    return await service.update_user(user_id, user_update)


@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, service: UserService = Depends(get_user_service)):
    return await service.delete_user(user_id)
