"use client";

import { useEffect, useState } from "react";

import AppointmentDateTimePicker from "@/components/AppointmentDateTimePicker";
import {
  type AvailabilitySlot,
  type DentalService,
  createAppointment,
  getFallbackAvailability,
  getFallbackServices,
  getAvailability,
  getDentalServices,
} from "@/lib/api";

export default function BookingForm() {
  const [services, setServices] = useState<DentalService[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "warning" | "error">(
    "success",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBookingData() {
      try {
        const [servicesResult, availabilityResult] = await Promise.all([
          getDentalServices(),
          getAvailability(),
        ]);
        setServices(servicesResult.services);
        setAvailability(availabilityResult.available_slots);
      } catch {
        setServices(getFallbackServices());
        setAvailability(getFallbackAvailability());
        setStatusType("warning");
        setStatus("Using temporary booking options until the backend is online.");
      }
    }

    loadBookingData();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setStatusType("success");

    try {
      const result = await createAppointment({
        name,
        phone,
        email: email || undefined,
        service,
        appointment_date: date,
        appointment_time: time,
      });

      setStatus(result.message);
      setStatusType(result.notification_sent === false ? "warning" : "success");
      setName("");
      setPhone("");
      setEmail("");
      setService("");
      setDate("");
      setTime("");
    } catch {
      setStatusType("error");
      setStatus("Something went wrong while creating the appointment request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Full name
          <input
            className="h-12 w-full rounded-md border border-slate-200 px-3 text-slate-950 outline-none focus:border-teal-700"
            placeholder="Sarah Johnson"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Phone number
          <input
            className="h-12 w-full rounded-md border border-slate-200 px-3 text-slate-950 outline-none focus:border-teal-700"
            placeholder="08012345678"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Email
        <input
          className="h-12 w-full rounded-md border border-slate-200 px-3 text-slate-950 outline-none focus:border-teal-700"
          type="email"
          placeholder="sarah@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Service
        <select
          className="h-12 w-full rounded-md border border-slate-200 bg-white px-3 text-slate-950 outline-none focus:border-teal-700"
          value={service}
          onChange={(event) => setService(event.target.value)}
          required
        >
          <option value="">Choose a service</option>
          {services.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <AppointmentDateTimePicker
        availability={availability}
        selectedDate={date}
        selectedTime={time}
        onDateSelect={setDate}
        onTimeSelect={setTime}
      />

      <button
        type="submit"
        disabled={loading}
        className="h-12 w-full rounded-md bg-teal-700 px-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? "Sending request..." : "Request appointment"}
      </button>

      {status ? (
        <p
          className={`rounded-md px-4 py-3 text-center text-sm font-medium ${
            statusType === "success"
              ? "bg-emerald-50 text-emerald-900"
              : statusType === "warning"
                ? "bg-amber-50 text-amber-900"
                : "bg-rose-50 text-rose-900"
          }`}
        >
          {status}
        </p>
      ) : null}
    </form>
  );
}
