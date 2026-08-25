"use client";

import { useEffect, useRef, useState } from "react";

import AppointmentDateTimePicker from "@/components/AppointmentDateTimePicker";
import {
  type AvailabilitySlot,
  type DentalService,
  createAppointment,
  getAvailability,
  getDentalServices,
  getFallbackAvailability,
  getFallbackServices,
  sendChatMessage,
} from "@/lib/api";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const POPULAR_QUESTIONS = [
  "What services do you offer?",
  "Do you offer braces?",
  "Can I whiten my teeth?",
  "How can I request an appointment?",
];
const APPOINTMENT_KEYWORDS = [
  "appointment",
  "book",
  "booking",
  "visit",
  "schedule",
  "request",
];

export default function WidgetChatbot() {
  const [message, setMessage] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [services, setServices] = useState<DentalService[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi, I can help with clinic questions and appointment requests.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const hasAppointmentDetails =
    fullName.trim() &&
    phone.trim() &&
    service &&
    preferredDate &&
    preferredTime;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

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
      }
    }

    loadBookingData();
  }, []);

  async function submitAppointment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasAppointmentDetails || appointmentLoading) {
      return;
    }

    setAppointmentLoading(true);
    setAppointmentStatus("");

    try {
      const result = await createAppointment({
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        service,
        appointment_date: preferredDate,
        appointment_time: preferredTime,
      });

      setAppointmentStatus(
        result.notification_sent
          ? "Request sent. The clinic has been notified."
          : "Request saved. The clinic will review it shortly.",
      );
      setFullName("");
      setPhone("");
      setEmail("");
      setService("");
      setPreferredDate("");
      setPreferredTime("");
    } catch {
      setAppointmentStatus("Could not send the appointment request.");
    } finally {
      setAppointmentLoading(false);
    }
  }

  async function sendMessage(
    event?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    quickPrompt?: string,
  ) {
    event?.preventDefault();

    const userMessage = (quickPrompt || message).trim();
    if (!userMessage || isLoading) {
      return;
    }

    const isAppointmentIntent = APPOINTMENT_KEYWORDS.some((keyword) =>
      userMessage.toLowerCase().includes(keyword),
    );

    setMessage("");
    if (isAppointmentIntent) {
      setBookingOpen(true);
    }
    setIsLoading(true);
    setChat((currentChat) => [
      ...currentChat,
      { role: "user", text: userMessage },
    ]);

    try {
      const result = await sendChatMessage(userMessage);
      setChat((currentChat) => [
        ...currentChat,
        {
          role: "assistant",
          text: isAppointmentIntent
            ? "Sure. Please complete the appointment form above and the clinic will receive your request."
            : result.reply,
        },
      ]);
    } catch {
      setChat((currentChat) => [
        ...currentChat,
        {
          role: "assistant",
          text: "I cannot reach the clinic assistant right now. Please try again shortly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex h-screen min-h-0 flex-col overflow-hidden bg-white">
      <header className="border-b border-slate-200 bg-teal-700 px-4 py-3 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-100">
          Dental Clinic AI
        </p>
        <h1 className="mt-1 text-lg font-semibold">Patient assistant</h1>
      </header>

      <div className="border-b border-slate-200 bg-slate-50 px-3 py-3">
        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => setBookingOpen((isOpen) => !isOpen)}
            className="rounded-md bg-teal-700 px-3 py-2 text-left text-xs font-semibold leading-4 text-white transition hover:bg-teal-800"
          >
            {bookingOpen ? "Hide appointment form" : "Request appointment"}
          </button>

          {POPULAR_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={(event) => sendMessage(event, question)}
              disabled={isLoading}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium leading-4 text-slate-700 transition hover:border-teal-600 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {bookingOpen ? (
        <div className="max-h-[310px] overflow-y-auto border-b border-slate-200 bg-slate-50 p-3">
          <form
            onSubmit={submitAppointment}
            className="grid gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-950">
                Request appointment
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  hasAppointmentDetails
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {hasAppointmentDetails ? "Ready" : "Needed"}
              </span>
            </div>

            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-slate-50 px-3 text-xs outline-none focus:border-teal-700"
              placeholder="Full name"
              required
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-slate-50 px-3 text-xs outline-none focus:border-teal-700"
              placeholder="Phone number"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-slate-50 px-3 text-xs outline-none focus:border-teal-700"
              placeholder="Email, optional"
            />
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="h-9 rounded-md border border-slate-300 bg-slate-50 px-3 text-xs outline-none focus:border-teal-700"
              required
            >
              <option value="">Choose service</option>
              {services.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>

            <AppointmentDateTimePicker
              availability={availability}
              selectedDate={preferredDate}
              selectedTime={preferredTime}
              onDateSelect={setPreferredDate}
              onTimeSelect={setPreferredTime}
            />

            <button
              type="submit"
              disabled={!hasAppointmentDetails || appointmentLoading}
              className="h-9 rounded-md bg-teal-700 px-3 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {appointmentLoading ? "Sending..." : "Send request"}
            </button>

            {appointmentStatus ? (
              <p className="text-xs font-medium leading-5 text-emerald-700">
                {appointmentStatus}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-100 p-3">
        {chat.map((chatMessage, index) => (
          <div
            key={`${chatMessage.role}-${index}`}
            className={`flex ${
              chatMessage.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[86%] rounded-lg px-3 py-2 text-xs leading-5 shadow-sm ${
                chatMessage.role === "user"
                  ? "bg-teal-700 text-white"
                  : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {chatMessage.text}
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
              Thinking...
            </div>
          </div>
        ) : null}

        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} className="grid gap-2 border-t border-slate-200 bg-white p-3">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-10 resize-none rounded-md border border-slate-300 px-3 py-2 text-xs leading-5 outline-none transition focus:border-teal-700"
          placeholder="Ask a question"
          rows={2}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="h-9 rounded-md bg-teal-700 px-4 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Send
        </button>
      </form>
    </section>
  );
}
