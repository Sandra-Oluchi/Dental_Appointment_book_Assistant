from datetime import date, time
from typing import Literal, Optional

from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    service: str
    appointment_date: date
    appointment_time: time


class AppointmentResponse(AppointmentCreate):
    id: int
    status: Literal["new", "contacted", "confirmed", "cancelled"]
    notification_sent: bool = False
