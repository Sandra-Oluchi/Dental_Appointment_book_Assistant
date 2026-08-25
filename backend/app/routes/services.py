from fastapi import APIRouter
import logging

from app.database.supabase import SERVICES_TABLE, get_database


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/services",
    tags=["Dental Services"],
)


dental_services = [
    {
        "id": "consultation",
        "name": "Dental Consultation",
        "description": "General consultation with a dentist.",
    },
    {
        "id": "braces",
        "name": "Braces Consultation",
        "description": "Consultation about orthodontic treatment.",
    },
    {
        "id": "whitening",
        "name": "Teeth Whitening",
        "description": "Professional teeth whitening consultation.",
    },
    {
        "id": "implant",
        "name": "Dental Implant Consultation",
        "description": "Consultation about replacing missing teeth.",
    },
    {
        "id": "children",
        "name": "Child Dental Appointment",
        "description": "Dental care appointment for children.",
    },
]


@router.get("/")
def get_services():
    supabase = get_database()

    if supabase:
        try:
            result = supabase.table(SERVICES_TABLE).select("*").eq(
                "active",
                True,
            ).order("sort_order").execute()

            return {
                "services": result.data or []
            }
        except Exception:
            logger.exception("Supabase services list failed; using fallback services.")

    return {
        "services": dental_services
    }
