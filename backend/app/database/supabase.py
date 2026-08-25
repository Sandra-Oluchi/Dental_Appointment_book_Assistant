import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

try:
    from supabase import create_client
except ImportError:
    create_client = None


BACKEND_DIR = Path(__file__).resolve().parents[2]

load_dotenv(BACKEND_DIR / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
KNOWLEDGE_TABLE = os.getenv("SUPABASE_KNOWLEDGE_TABLE", "clinic_knowledge_base").strip()
SERVICES_TABLE = os.getenv("SUPABASE_SERVICES_TABLE", "dental_services").strip()
APPOINTMENT_REQUESTS_TABLE = os.getenv(
    "SUPABASE_APPOINTMENT_REQUESTS_TABLE",
    "appointment_requests",
).strip()


def is_real_env_value(value: Optional[str]) -> bool:
    if not value:
        return False

    placeholder_markers = [
        "your-project",
        "your_project",
        "replace_with",
        "your_",
    ]

    return not any(marker in value.lower() for marker in placeholder_markers)


def create_supabase_client():
    if not create_client:
        return None

    if not is_real_env_value(SUPABASE_URL) or not is_real_env_value(SUPABASE_KEY):
        return None

    return create_client(SUPABASE_URL, SUPABASE_KEY)


supabase = create_supabase_client()


def get_database():
    return supabase


def is_supabase_configured() -> bool:
    return supabase is not None
