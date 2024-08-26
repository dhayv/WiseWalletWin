import base64
import os
from datetime import datetime, timedelta, timezone
from typing import List

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from models import Users
from pydantic import BaseModel

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_if_not_set")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 30


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    # to retireve email
    username: str | None = None
    scopes: List[str] = []


def get_password_hash(password):
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return base64.b64encode(hashed_password).decode("utf-8")


def verify_password(plain_password, hashed_password):
    hashed_password_bytes = base64.b64decode(hashed_password.encode("utf-8"))
    password_byte_enc = plain_password.encode("utf-8")
    return bcrypt.checkpw(
        password=password_byte_enc, hashed_password=hashed_password_bytes
    )


async def get_user(username: str):
    user = await Users.find_one(Users.username == username)

    return user


async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_email_access_token(email: str, expires_delta: timedelta | None = None):
    claims = {"sub": email, "scope": "email_verification"}
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=120)
    claims.update({"exp": expire})
    encoded_jwt = jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)
    print(
        f"Created token for {email} with expiry {expire} and scope 'email_verification'"
    )
    return encoded_jwt


def verify_token(token: str, security_scopes: SecurityScopes):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_scopes = payload.get("scopes", [])
        token_data = TokenData(scopes=token_scopes, username=payload.get("sub"))

        print(f"Decoded token: {payload}")
        for scope in security_scopes.scopes:
            if scope not in token_data.scopes:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not enough permissions",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        return token_data

    except jwt.InvalidTokenError as e:
        print(f"Token decoding error: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    security_scopes: SecurityScopes,
    token: str = Depends(oauth2_scheme),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = verify_token(token, security_scopes)
    if token_data.username is None:
        raise credentials_exception

    user = await Users.find_one(Users.username == token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: Users = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
