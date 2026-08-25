from fastapi import APIRouter

from app.models.appointment import AppointmentCreate
from app.services.booking_service import (
    create_appointment,
    get_all_appointments,
    mark_appointment_notification_sent,
)
from app.services.notification_service import send_appointment_notification


router = APIRouter(
    prefix="/appointments",
    tags=["Appointments"],
)


@router.post("/")
def book_appointment(appointment: AppointmentCreate):
    new_appointment = create_appointment(appointment)
    notification_sent = send_appointment_notification(new_appointment)
    message = "Appointment booked successfully."

    if notification_sent:
        updated_appointment = mark_appointment_notification_sent(new_appointment.id)

        if updated_appointment:
            new_appointment = updated_appointment
    else:
        message = (
            "Appointment booked successfully, but the clinic email notification "
            "could not be sent."
        )

    return {
        "success": True,
        "message": message,
        "appointment": new_appointment,
        "notification_sent": notification_sent,
    }


@router.get("/")
def list_appointments():
    return {
        "appointments": get_all_appointments()
    }
