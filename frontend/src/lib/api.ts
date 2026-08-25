const API_URL = "/api/backend";

export type DentalService = {
  id: string;
  name: string;
  description: string;
};

export type AvailabilitySlot = {
  date: string;
  times: string[];
};

export type Appointment = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
};

export type AppointmentPayload = {
  name: string;
  phone: string;
  email?: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
};

const FALLBACK_SERVICES: DentalService[] = [
  {
    id: "consultation",
    name: "Dental Consultation",
    description: "General consultation with a dentist.",
  },
  {
    id: "braces",
    name: "Braces Consultation",
    description: "Consultation about orthodontic treatment.",
  },
  {
    id: "whitening",
    name: "Teeth Whitening",
    description: "Professional teeth whitening consultation.",
  },
  {
    id: "implant",
    name: "Dental Implant Consultation",
    description: "Consultation about replacing missing teeth.",
  },
  {
    id: "children",
    name: "Child Dental Appointment",
    description: "Dental care appointment for children.",
  },
];

const FALLBACK_WEEKDAY_TIME_SLOTS: Record<number, string[]> = {
  1: ["09:00", "10:00", "11:30", "14:00"],
  2: ["09:30", "10:30", "12:00", "15:00"],
  3: ["09:00", "11:00", "13:30", "16:00"],
  4: ["10:00", "12:30", "14:30", "16:30"],
  5: ["09:30", "11:30", "13:00", "15:30"],
  6: ["10:00", "11:30", "13:00"],
};

export function formatDisplayDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-");

  if (!year || !month || !day) {
    return dateValue;
  }

  return `${day}/${month}/${year.slice(-2)}`;
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getFallbackServices() {
  return FALLBACK_SERVICES;
}

export function getFallbackAvailability() {
  const slots: AvailabilitySlot[] = [];
  const today = new Date();

  for (let offset = 0; offset < 180; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const times = FALLBACK_WEEKDAY_TIME_SLOTS[date.getDay()];

    if (times) {
      slots.push({
        date: toDateValue(date),
        times,
      });
    }
  }

  return slots;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getDentalServices() {
  return fetchJson<{ services: DentalService[] }>(`${API_URL}/services`);
}

export async function getAvailability() {
  return fetchJson<{ available_slots: AvailabilitySlot[] }>(
    `${API_URL}/availability`,
  );
}

export async function getAppointments() {
  return fetchJson<{ appointments: Appointment[] }>(`${API_URL}/appointments`, {
    cache: "no-store",
  });
}

export async function getBackendHealth() {
  return fetchJson<{ status: string; supabase_configured: boolean }>(
    `${API_URL}/health`,
    {
      cache: "no-store",
    },
  );
}

export async function createAppointment(data: AppointmentPayload) {
  return fetchJson<{
    success: boolean;
    message: string;
    appointment: Appointment;
    notification_sent?: boolean;
  }>(`${API_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function sendChatMessage(message: string) {
  return fetchJson<{ reply: string }>(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
}
