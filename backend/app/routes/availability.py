from datetime import date, timedelta

from fastapi import APIRouter


router = APIRouter(
    prefix="/availability",
    tags=["Availability"],
)


WEEKDAY_TIME_SLOTS = {
    0: ["09:00", "10:00", "11:30", "14:00"],
    1: ["09:30", "10:30", "12:00", "15:00"],
    2: ["09:00", "11:00", "13:30", "16:00"],
    3: ["10:00", "12:30", "14:30", "16:30"],
    4: ["09:30", "11:30", "13:00", "15:30"],
    5: ["10:00", "11:30", "13:00"],
}


@router.get("/")
def get_availability():
    available_slots = []
    current_day = date.today()
    days_to_check = 0
    lookahead_days = 180

    while days_to_check < lookahead_days:
        slot_date = current_day + timedelta(days=days_to_check)
        day_slots = WEEKDAY_TIME_SLOTS.get(slot_date.weekday())

        if day_slots:
            available_slots.append(
                {
                    "date": slot_date.isoformat(),
                    "times": day_slots,
                }
            )

        days_to_check += 1

    return {
        "available_slots": available_slots
    }
