"use client";

import { useMemo, useState } from "react";

import type { AvailabilitySlot } from "@/lib/api";

type AppointmentDateTimePickerProps = {
  availability: AvailabilitySlot[];
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
};

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const VISUAL_WEEKDAY_TIME_SLOTS: Record<number, string[]> = {
  1: ["09:00", "10:00", "11:30", "14:00"],
  2: ["09:30", "10:30", "12:00", "15:00"],
  3: ["09:00", "11:00", "13:30", "16:00"],
  4: ["10:00", "12:30", "14:30", "16:30"],
  5: ["09:30", "11:30", "13:00", "15:30"],
  6: ["10:00", "11:30", "13:00"],
};

function parseDateValue(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatSelectedDate(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parseDateValue(dateValue));
}

function getMonthDays(visibleMonth: Date) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getSelectableYears(availability: AvailabilitySlot[], visibleMonth: Date) {
  const currentYear = new Date().getFullYear();
  const availabilityYears = availability.map((slot) =>
    parseDateValue(slot.date).getFullYear(),
  );

  return Array.from(
    new Set([
      currentYear,
      currentYear + 1,
      visibleMonth.getFullYear(),
      ...availabilityYears,
    ]),
  ).sort((firstYear, secondYear) => firstYear - secondYear);
}

function getVisualWeekdayIndex(date: Date) {
  return (date.getDate() - 1) % 7;
}

function getVisualDayTimes(date: Date) {
  return VISUAL_WEEKDAY_TIME_SLOTS[getVisualWeekdayIndex(date)] || [];
}

export default function AppointmentDateTimePicker({
  availability,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: AppointmentDateTimePickerProps) {
  const firstAvailableDate = availability[0]?.date || "";
  const todayValue = toDateValue(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() =>
    parseDateValue(selectedDate || firstAvailableDate || todayValue),
  );

  const availableYears = useMemo(
    () => getSelectableYears(availability, visibleMonth),
    [availability, visibleMonth],
  );
  const selectedDateObject = selectedDate ? parseDateValue(selectedDate) : null;
  const selectedSlot = selectedDateObject
    ? {
        date: selectedDate,
        times: getVisualDayTimes(selectedDateObject),
      }
    : null;
  const monthDays = getMonthDays(visibleMonth);
  const previousMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() - 1,
    1,
  );
  const nextMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    1,
  );

  function selectDate(dateValue: string) {
    const date = parseDateValue(dateValue);

    if (!getVisualDayTimes(date).length) {
      return;
    }

    onDateSelect(dateValue);
    onTimeSelect("");
  }

  function selectMonth(monthValue: string) {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), Number(monthValue), 1));
    onDateSelect("");
    onTimeSelect("");
  }

  function selectYear(yearValue: string) {
    setVisibleMonth(new Date(Number(yearValue), visibleMonth.getMonth(), 1));
    onDateSelect("");
    onTimeSelect("");
  }

  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-medium text-slate-700">
        Appointment date and time
      </legend>

      <div className="overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50 text-slate-950 shadow-sm">
        <div className="px-3 pb-2 pt-3">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setVisibleMonth(previousMonth)}
              className="h-8 rounded-full bg-white px-3 text-base font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-100"
              aria-label="Previous month"
            >
              {"<"}
            </button>

            <select
              value={visibleMonth.getFullYear()}
              onChange={(event) => selectYear(event.target.value)}
              className="h-8 rounded-full border border-emerald-100 bg-white px-3 text-sm font-semibold text-emerald-900 outline-none focus:border-emerald-600"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setVisibleMonth(nextMonth)}
              className="h-8 rounded-full bg-white px-3 text-base font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-100"
              aria-label="Next month"
            >
              {">"}
            </button>
          </div>

          <select
            value={visibleMonth.getMonth()}
            onChange={(event) => selectMonth(event.target.value)}
            className="mt-3 h-10 w-full rounded-md border border-transparent bg-emerald-50 text-2xl font-bold leading-none text-emerald-950 outline-none focus:border-emerald-600"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-7 border-b border-emerald-100 px-3 text-center text-xs font-semibold uppercase text-emerald-700">
          {WEEK_DAYS.map((day) => (
            <div key={day} className="pb-2">
              {day.slice(0, 1)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {monthDays.map((date) => {
            const dateValue = toDateValue(date);
            const isAvailable = getVisualDayTimes(date).length > 0;
            const isSelected = selectedDate === dateValue;
            const isToday = todayValue === dateValue;

            return (
              <button
                key={dateValue}
                type="button"
                aria-disabled={!isAvailable}
                onClick={() => selectDate(dateValue)}
                className={`flex min-h-10 items-center justify-center border-b border-emerald-100 py-1 ${
                  isAvailable ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
              >
                <span
                  className={`relative flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold transition ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-sm"
                      : isAvailable
                        ? "bg-white text-emerald-900 ring-1 ring-emerald-100 hover:bg-emerald-100 hover:ring-emerald-500"
                        : "text-emerald-300"
                  } ${isToday && !isSelected ? "ring-2 ring-emerald-500" : ""}`}
                >
                  {date.getDate()}
                  {isAvailable && !isSelected ? (
                    <span className="absolute bottom-0 h-1 w-1 rounded-full bg-emerald-600" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {selectedDate ? (
          <div className="border-t border-emerald-100 px-3 py-2 text-center text-xs font-medium text-emerald-800">
            {formatSelectedDate(selectedDate)}
          </div>
        ) : null}
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium text-slate-700">Available time</p>
        {selectedSlot ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {selectedSlot.times.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onTimeSelect(time)}
                className={`h-10 rounded-md border px-3 text-sm font-semibold transition ${
                  selectedTime === time
                    ? "border-teal-700 bg-teal-700 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-teal-600 hover:bg-teal-50"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-500">
            Select an available date to see time slots.
          </div>
        )}
      </div>
    </fieldset>
  );
}
