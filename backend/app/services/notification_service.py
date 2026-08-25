import os
import logging
from pathlib import Path
from html import escape
from typing import Any

import httpx
from dotenv import load_dotenv

from app.models.appointment import AppointmentResponse


load_dotenv(Path(__file__).resolve().parents[2] / ".env")
logger = logging.getLogger(__name__)


def get_make_webhook_url() -> str:
    return os.getenv("MAKE_WEBHOOK_URL") or os.getenv("WEBHOOK_URL") or ""


def build_appointment_notification_payload(
    appointment: AppointmentResponse,
) -> dict[str, Any]:
    appointment_date = appointment.appointment_date.isoformat()
    appointment_time = appointment.appointment_time.strftime("%H:%M")
    patient_email = appointment.email or "Not provided"
    email_subject = f"New Dental Appointment Request - {appointment.name}"
    email_body_text = f"""A new patient appointment request was submitted through the Optimist Dental AI Assistant.

PATIENT DETAILS

Name: {appointment.name}
Phone: {appointment.phone}
Email: {patient_email}

APPOINTMENT DETAILS

Service: {appointment.service}
Date: {appointment_date}
Time: {appointment_time}
Status: {appointment.status}

Please contact the patient to confirm the appointment."""
    email_body = f"""
<p>A new patient appointment request was submitted through the Optimist Dental AI Assistant.</p>

<p><strong>PATIENT DETAILS</strong></p>

<p>
Name: {escape(appointment.name)}<br>
Phone: {escape(appointment.phone)}<br>
Email: {escape(patient_email)}
</p>

<p><strong>APPOINTMENT DETAILS</strong></p>

<p>
Service: {escape(appointment.service)}<br>
Date: {escape(appointment_date)}<br>
Time: {escape(appointment_time)}<br>
Status: {escape(appointment.status)}
</p>

<p>Please contact the patient to confirm the appointment.</p>
""".strip()

    return {
        "event": "appointment_requested",
        "app_name": os.getenv("APP_NAME", "Dental Clinic AI"),
        "clinic_email": os.getenv("CLINIC_EMAIL", ""),
        "appointment_id": appointment.id,
        "patient_name": appointment.name,
        "patient_phone": appointment.phone,
        "patient_email": patient_email,
        "service": appointment.service,
        "appointment_date": appointment_date,
        "appointment_time": appointment_time,
        "status": appointment.status,
        "email_subject": email_subject,
        "email_body": email_body,
        "email_body_text": email_body_text,
        "appointment": {
            "id": appointment.id,
            "name": appointment.name,
            "phone": appointment.phone,
            "email": patient_email,
            "service": appointment.service,
            "appointment_date": appointment_date,
            "appointment_time": appointment_time,
            "status": appointment.status,
        },
    }


def send_appointment_notification(appointment: AppointmentResponse) -> bool:
    webhook_url = get_make_webhook_url()

    if not webhook_url:
        logger.warning("Make webhook URL is not configured; appointment notification skipped.")
        return False

    payload = build_appointment_notification_payload(appointment)

    try:
        response = httpx.post(webhook_url, json=payload, timeout=10)
        response.raise_for_status()
    except httpx.HTTPStatusError as error:
        logger.error(
            "Make webhook returned an error:",
            extra={
                "status_code": error.response.status_code,
                "response_text": error.response.text,
            },
        )
        return False
    except httpx.HTTPError as error:
        logger.exception("Make webhook request failed: %s", error)
        return False

    logger.info("Make webhook accepted appointment notification.")
    return True
