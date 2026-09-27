import sys
import asyncio
import os

# Enable subprocess support on Windows for Playwright browser automation
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.endpoints import portfolio

# Import our database init and our router endpoints
from app.db.session import init_db
from app.api.v1.endpoints import records, mutations

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("EVENT LOOP RUNNING:", type(asyncio.get_running_loop()))
    # Startup: Initialize the database tables
    print("Database initializing...")
    await init_db()
    
    # Ensure output directory exists when server starts so StaticFiles doesn't crash
    os.makedirs("output", exist_ok=True)
    
    yield
    # Shutdown logic goes here (if any)

app = FastAPI(title="AnyROR SaaS API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚨 FIX 2: Serve the downloaded mutation images over the network for the HITL UI
app.mount("/static/images", StaticFiles(directory="output"), name="static_images")

# 🚨 FIX 3: Register the Routers
app.include_router(records.router, prefix="/api/v1/records", tags=["Records"])
app.include_router(mutations.router, prefix="/api/v1/mutations", tags=["Mutations Review"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Portfolio Bulk Processing"])

@app.get("/")
def read_root():
    return {"message": "AnyROR Scraper API is running!"}