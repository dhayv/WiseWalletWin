from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select
from models import Users, UserIn, UserOut, UserUpdate, Expense
from database.database import get_db
from datetime import  timedelta
from Services.auth import (get_password_hash, Token, ACCESS_TOKEN_EXPIRES_MINUTES, 
                  create_access_token, authenticate_user, get_current_active_user)
from fastapi.security import OAuth2PasswordRequestForm
from Services.calculations import sum_of_all_expenses, calc_income_minus_expenses



router = APIRouter()

# This endpoint is used for user login. It verifies the user's credentials and returns an access token.
@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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

# This endpoint is used for user signup. It adds a new user to the database.
@router.post("/user", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def add_user(user: UserIn, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)  
    db_user = Users(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password, 
        first_name=user.first_name,
        phone_number=user.phone_number
        )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# This endpoint is used to get the profile of the currently logged in user.
@router.get("/user/me", response_model=UserOut)
async def read_user_me(current_user: Users = Depends(get_current_active_user)):
    return current_user

# This endpoint is used to get the profile of a specific user based on their user_id.
@router.get("/user/{user_id}", response_model=UserOut)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result 


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
async def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_update.model_dump(exclude_unset=True)

    if "password" in update_data:
        hashed_password = get_password_hash(update_data["password"])
        update_data["password"] = hashed_password
        del update_data["password"]

    for key, value in update_data.items():
        setattr(result, key if key != "hashed_password" else "hashed_password", value)

    db.add(result) 
    db.commit()
    db.refresh(result)
    return result

@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    statement = select(Users).where(Users.id == user_id)
    result = db.exec(statement).first()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(result)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)