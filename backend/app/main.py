import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes.appointments import book_appointment, list_appointments
from app.routes.availability import get_availability
from app.routes.chat import chat
from app.routes.services import get_services
from app.database.supabase import is_supabase_configured


BACKEND_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_DIR / ".env", override=True)


def get_allowed_origins():
    configured_origins = os.getenv("BACKEND_ALLOWED_ORIGINS")

    if configured_origins:
        return [
            origin.strip()
            for origin in configured_origins.split(",")
            if origin.strip()
        ]

    return [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
    ]


app = FastAPI(
    title="Dental Clinic AI API",
    description="Backend for the Dental Clinic AI Assistant",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_api_route("/services", get_services, methods=["GET"], tags=["Dental Services"])
app.add_api_route("/availability", get_availability, methods=["GET"], tags=["Availability"])
app.add_api_route("/chat", chat, methods=["POST"], tags=["AI Assistant"])
app.add_api_route("/appointments", book_appointment, methods=["POST"], tags=["Appointments"])
app.add_api_route("/appointments", list_appointments, methods=["GET"], tags=["Appointments"])


@app.get("/")
def home():
    return {
        "message": "Dental Clinic AI Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "supabase_configured": is_supabase_configured(),
    }
