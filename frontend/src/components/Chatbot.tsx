"use client";

import { useEffect, useRef, useState } from "react";

import AppointmentDateTimePicker from "@/components/AppointmentDateTimePicker";
import {
  type AvailabilitySlot,
  type DentalService,
  createAppointment,
  getBackendHealth,
  getFallbackAvailability,
  getFallbackServices,
  getAvailability,
  getDentalServices,
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
  "Do you treat children?",
];

export default function Chatbot() {
  const [message, setMessage] = useState("");
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
      text: "Welcome. Ask me about dental services, opening hours, or appointment requests.",
    },
  ]);
  const [backendStatus, setBackendStatus] = useState("checking");
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
    async function loadInitialData() {
      try {
        await getBackendHealth();
        setBackendStatus("online");
      } catch {
        setBackendStatus("offline");
      }

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

    loadInitialData();
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

      setAppointmentStatus(result.message);
      setFullName("");
      setPhone("");
      setEmail("");
      setService("");
      setPreferredDate("");
      setPreferredTime("");
    } catch {
      setAppointmentStatus("Could not save the appointment request.");
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

    setMessage("");
    setIsLoading(true);
    setChat((currentChat) => [
      ...currentChat,
      { role: "user", text: userMessage },
    ]);

    try {
      const result = await sendChatMessage(userMessage);
      setChat((currentChat) => [
        ...currentChat,
        { role: "assistant", text: result.reply },
      ]);
    } catch {
      setChat((currentChat) => [
        ...currentChat,
        {
          role: "assistant",
          text: "I could not reach the backend right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto grid min-h-[680px] w-full max-w-7xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
        <div>
          <p className="text-sm font-bold text-teal-700">Dental Clinic AI</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950">
            AI patient assistant
          </h1>
        </div>

        <div className="mt-7 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">
            Popular questions
          </h2>

          <div className="mt-4 grid gap-2">
            {POPULAR_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={(event) => sendMessage(event, question)}
                disabled={isLoading}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm font-medium leading-5 text-slate-700 transition hover:border-teal-600 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={submitAppointment}
          className="mt-7 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-950">
              Request appointment
            </h2>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                hasAppointmentDetails
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {hasAppointmentDetails ? "Ready" : "Needed"}
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-11 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-teal-700"
              placeholder="Full name"
              required
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-11 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-teal-700"
              placeholder="Phone number"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-teal-700"
              placeholder="Email, optional"
            />
            <select
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="h-11 rounded-md border border-slate-300 bg-slate-50 px-3 text-sm outline-none focus:border-teal-700"
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
              className="h-11 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {appointmentLoading ? "Saving..." : "Request appointment"}
            </button>

            {appointmentStatus ? (
              <p className="text-xs font-medium text-emerald-700">
                {appointmentStatus}
              </p>
            ) : null}
          </div>
        </form>
      </aside>

      <div className="flex min-h-[680px] flex-col bg-slate-100">
        <div className="flex flex-col gap-4 border-b border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Assistant
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">
              Ask popular questions
            </h2>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              backendStatus === "online"
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                : backendStatus === "checking"
                  ? "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-100"
            }`}
          >
            Backend: {backendStatus}
          </span>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
          {chat.map((chatMessage, index) => (
            <div
              key={`${chatMessage.role}-${index}`}
              className={`flex ${
                chatMessage.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[72%] ${
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
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                The assistant is preparing an answer...
              </div>
            </div>
          ) : null}

          <div ref={chatEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row"
        >
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-12 min-w-0 flex-1 resize-none rounded-md border border-slate-300 bg-white px-4 py-3 text-sm leading-5 outline-none transition focus:border-teal-700"
            placeholder="Ask about braces, whitening, implants, or appointments"
            rows={1}
          />
          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="h-12 rounded-md bg-teal-700 px-6 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
