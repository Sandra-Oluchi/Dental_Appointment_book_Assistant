import logging
from typing import Any

from app.models.appointment import AppointmentCreate, AppointmentResponse
from app.database.supabase import APPOINTMENT_REQUESTS_TABLE, get_database


appointments: list[AppointmentResponse] = []
logger = logging.getLogger(__name__)


def _create_local_appointment(
    appointment_data: AppointmentCreate,
) -> AppointmentResponse:
    new_appointment = AppointmentResponse(
        id=len(appointments) + 1,
        status="new",
        **appointment_data.model_dump(mode="json"),
    )

    appointments.append(new_appointment)

    return new_appointment


def _to_supabase_payload(appointment_data: AppointmentCreate) -> dict[str, Any]:
    appointment_payload = appointment_data.model_dump(mode="json")

    return {
        "name": appointment_payload["name"],
        "email": appointment_payload.get("email"),
        "phone": appointment_payload["phone"],
        "service": appointment_payload["service"],
        "appointment_date": appointment_payload["appointment_date"],
        "appointment_time": appointment_payload["appointment_time"],
        "message": None,
        "status": "new",
    }


def _from_supabase_row(row: dict[str, Any]) -> AppointmentResponse:
    return AppointmentResponse(
        id=row["id"],
        name=row.get("name") or row.get("full_name"),
        phone=row["phone"],
        email=row.get("email"),
        service=row["service"],
        appointment_date=row.get("appointment_date") or row.get("preferred_date"),
        appointment_time=row.get("appointment_time") or row.get("preferred_time"),
        status=row.get("status") or "new",
        notification_sent=row.get("notification_sent") or False,
    )


def create_appointment(appointment_data: AppointmentCreate) -> AppointmentResponse:
    supabase = get_database()

    if supabase:
        try:
            saved_appointment = supabase.table(APPOINTMENT_REQUESTS_TABLE).insert(
                _to_supabase_payload(appointment_data)
            ).execute()

            if not saved_appointment.data:
                raise RuntimeError("Supabase insert did not return appointment data.")

            return _from_supabase_row(saved_appointment.data[0])
        except Exception:
            logger.exception("Supabase appointment insert failed; using local storage.")

    return _create_local_appointment(appointment_data)


def mark_appointment_notification_sent(appointment_id: int) -> AppointmentResponse | None:
    supabase = get_database()

    if supabase:
        try:
            result = supabase.table(APPOINTMENT_REQUESTS_TABLE).update(
                {"notification_sent": True}
            ).eq("id", appointment_id).execute()

            if result.data:
                return _from_supabase_row(result.data[0])

            return None
        except Exception:
            logger.exception("Supabase notification update failed.")

    for index, appointment in enumerate(appointments):
        if appointment.id == appointment_id:
            updated_appointment = appointment.model_copy(
                update={"notification_sent": True}
            )
            appointments[index] = updated_appointment
            return updated_appointment

    return None


def get_all_appointments() -> list[AppointmentResponse]:
    supabase = get_database()

    if supabase:
        try:
            result = supabase.table(APPOINTMENT_REQUESTS_TABLE).select("*").order(
                "created_at",
                desc=True,
            ).execute()

            return [_from_supabase_row(row) for row in result.data or []]
        except Exception:
            logger.exception("Supabase appointment list failed; using local storage.")

    return appointments
