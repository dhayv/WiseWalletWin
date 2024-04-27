from datetime import timedelta

from data_base.database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from models import UserIn, UserOut, Users, UserUpdate
from Services.auth import (ACCESS_TOKEN_EXPIRES_MINUTES, Token,
                           authenticate_user, create_access_token,
                           get_current_active_user)
from Services.calculations import (calc_income_minus_expenses,
                                   sum_of_all_expenses)
from Services.user_service import UserService
from sqlmodel import Session

router = APIRouter()


def get_user_service(db: Session = Depends(get_db)):
    return UserService(db)


# This endpoint is used for user login. It verifies the user's credentials and returns an access token.
@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# This endpoint is used for user signup.
# It adds a new user to the database.
# Also Check if username or email exists in the database.
@router.post("/user", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def add_user(user: UserIn, service: UserService = Depends(get_user_service)):
    return service.add_user(user)


# This endpoint is used to get the profile of the currently logged in user.
@router.get("/user/me", response_model=UserOut)
async def read_user_me(current_user: Users = Depends(get_current_active_user)):
    service = UserService(current_user.db)
    return service.read_user(current_user.id)


# This endpoint is used to get the profile of a specific user based on their user_id.
@router.get("/user/{user_id}", response_model=UserOut)
async def read_user(user_id: int, service: UserService = Depends(get_user_service)):
    return service.read_user(user_id)


# This endpoint is used to get total expense of a specific user based on their user_id.
@router.get("/user/{user_id}/total_expenses", response_model=dict)
def read_total_expenses(user_id: int, db: Session = Depends(get_db)):
    total = sum_of_all_expenses(user_id, db)
    return {"total_expenses": total}


# This endpoint is used to get the total income minus expenses of a specific user based on their user_id.
@router.get("/user/{user_id}/income_minus_expenses", response_model=dict)
def read_total_income_minus_expenses(user_id: int, db: Session = Depends(get_db)):
    total = calc_income_minus_expenses(user_id, db)
    return {"income_minus_expenses": total}


@router.put("/user/{user_id}", response_model=UserOut)
async def update_user(
    user_id: int,
    user_update: UserUpdate,
    service: UserService = Depends(get_user_service),
):
    return service.update_user(user_id, user_update)


@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, service: UserService = Depends(get_user_service)):
    return service.delete_user(user_id)
