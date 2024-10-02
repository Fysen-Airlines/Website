import asyncio
from fastapi import FastAPI, Request, HTTPException, Response
from starlette.middleware.cors import CORSMiddleware
import asyncpg

# JWT
import jwt
from datetime import datetime, timedelta
from pydantic import BaseModel

import hashlib
import razorpay

from dotenv import load_dotenv


import os
import secrets

from pydantic import BaseModel

load_dotenv()

def create_order(amount, currency):
    client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY"), os.getenv("RAZORPAY_SECRET")))
    data = {
        "amount": amount,
        "currency": currency,
        "receipt": "order_rcptid_11",
        "payment_capture": '1'
    }
    order = client.order.create(data=data)
    return order

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    
class LoginRequest(BaseModel):
    email: str
    password: str

def generate_session_token(email: str) -> str:
    payload = {
        "exp": datetime.utcnow() + timedelta(days=1),
        "sub": "session",
        "aud": "auth",
        "nbf": datetime.utcnow(),
        "email": email,
        "jti": secrets.token_urlsafe(16),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")



app = FastAPI()
db_pool = None  # initialize the database connection pool here
SECRET_KEY = os.getenv("SECRET_KEY")
SALT = os.getenv("SALT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://oss-aryanroy.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def create_connection_pool():
    global db_pool
    db_pool = await asyncpg.create_pool(
        user=os.getenv("DB_USERNAME"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT"))
    )


def get_hashed_password(password: str):
    return hashlib.sha256((password + SALT).encode()).hexdigest()


async def verify_user_credentials(email: str, password: str):
    hashed_pwd = get_hashed_password(password)

    async with db_pool.acquire() as connection:
        user = await connection.fetchrow(
            "SELECT * FROM users WHERE email = $1 AND password = $2",
            email,
            hashed_pwd
        )
        print(user)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return True
    

@app.post("/api/login")
async def login(response: Response, request: LoginRequest):
    await verify_user_credentials(request.email, request.password)
    
    session_token = generate_session_token(request.email)
    print("session", session_token)
    response.set_cookie(
        key="session",
        value=session_token,
        httponly=True,
        secure=True
    )
    return {"message": "Logged in successfully"}


@app.post("/api/register")
async def register(request: RegisterRequest):
    async with db_pool.acquire() as connection:
        await connection.execute(
            "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)",
            request.email,
            get_hashed_password(request.password),
            request.first_name,
            request.last_name
        )
    return {"message": "User registered successfully"}


@app.post("/api/logout")
async def logout(response: Response):
    response.delete_cookie("session")
    return {"message": "Logged out successfully"}


@app.middleware("http")
async def verify_session_cookie(request: Request, call_next):

    if request.method == "GET" and request.url.path == "/api/":
        response = await call_next(request)
        return response
    if request.method == "OPTIONS":
        # Allow preflight requests to pass through
        response = await call_next(request)
        return response
    
    if request.method == "POST" and (request.url.path in ('/api/register', '/api/login')):
        response = await call_next(request)
        return response

    if request.method == "GET" and (request.url.path == '/api/isUserLoggedIn'):
        response = await call_next(request)
        return response

    session_token = request.cookies.get("session")
    if not session_token or not verify_session_token(session_token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    response = await call_next(request)
    return response

# make an endpoint called flights which returns information about flights, and make it so that only logged in users can access it
@app.get("/api/flights")
async def get_flights():
    async with db_pool.acquire() as connection:
        flights = await connection.fetch("SELECT * FROM flights")
        return {"flights": flights}

@app.get("/api/createRazorOrder")
async def create_razor_order(amount: int):
    order = create_order(amount, "INR")
    return order
    
@app.get('/api/isUserLoggedIn')
async def is_user_logged_in(request: Request):
    session_token = request.cookies.get("session")
    print(session_token)
    if not session_token or not verify_session_token(session_token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    payload = jwt.decode(session_token, options={"verify_signature": False})
    async with db_pool.acquire() as connection:
        user = await connection.fetchrow(
            "SELECT (first_name, last_name) FROM users WHERE email = $1",
            payload["email"]
        )

    print(user)
    return {"name": user[0][0] + " " + user[0][1]}

def verify_session_token(token: str) -> bool:
    try:
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        return True
    except jwt.PyJWTError as e:
        print(e)
        return False

@app.on_event("startup")
async def on_startup():
    await create_connection_pool()
    
    conn = db_pool.acquire()
    async with conn as connection:
        await connection.execute(
            "CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT, first_name TEXT, last_name TEXT)"
        )
