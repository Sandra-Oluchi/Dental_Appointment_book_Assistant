# Dental Clinic AI Assistant Plan

## Goal

Build a website-based AI patient assistant for a dental clinic. The assistant should answer clinic questions, recommend services, collect appointment requests, save patient details, and notify the clinic by email.

WhatsApp is not part of the first appointment flow. It can be added later.

## MVP Flow

```text
Clinic Website
    |
    v
AI Patient Assistant Widget
    |
    v
FastAPI Backend
    |
    v
Clinic Knowledge Base
    |
    v
Answer Question / Recommend Service / Collect Appointment Request
    |
    v
Supabase Appointment Requests
    |
    v
Email Notification To Clinic
```

## Recommended Stack

Frontend:
- Next.js
- React
- Tailwind CSS
- Embeddable `widget.js`
- Hosted on Vercel

Backend:
- Python 3.10
- FastAPI
- Uvicorn
- Hosted on Render

AI:
- OpenRouter first, because it is similar to the ZubeVision assistant setup
- OpenAI API can also work later if preferred

Database:
- Supabase
- Start with two tables: `clinic_knowledge_base` and `appointment_requests`

Notifications:
- Make webhook first
- Later: Resend, Gmail automation, or direct email provider

Calendar:
- Not in the MVP
- Add Google Calendar later after the appointment request flow works

Dashboard:
- Start with Supabase dashboard
- Later build a protected Next.js clinic dashboard

## First Version Features

Build these first:
- Website chat widget
- Clinic knowledge base
- AI answers patient questions
- Patient can request an appointment
- Save appointment request in Supabase
- Send email notification to the clinic
- Basic health check endpoint

Do not build these first:
- WhatsApp booking
- Google Calendar booking
- Payment/deposit links
- Reminder automation
- Full admin dashboard

## Knowledge Base Content

The assistant needs clinic information such as:
- Services
- Opening hours
- Location
- FAQs
- Dentists/doctors
- Appointment types
- Pricing/payment notes, only if the clinic allows
- Insurance/payment options, if needed
- Safety rules for dental advice

The AI should not diagnose patients. It can give general information and recommend booking a consultation.

Current local file:

```text
Knowledge_base/Knowledgebase.md
```

Later, this content can be moved into the Supabase `clinic_knowledge_base` table.

## Backend API Shape

Current and near-term endpoints:

```text
GET  /
GET  /health
GET  /services
GET  /availability
POST /chat
POST /appointments
GET  /appointments
```

Later endpoints:

```text
GET  /knowledge-base
POST /appointment-requests
PATCH /appointment-requests/{id}
GET  /dashboard/appointments
```

## Supabase Tables

`clinic_knowledge_base`

```text
id
topic
content
category
active
created_at
updated_at
```

`services`

```text
id
name
description
duration_minutes
price_note
active
created_at
updated_at
```

`appointment_requests`

```text
id
full_name
email
phone
service
preferred_date
preferred_time
message
status
created_at
```

Suggested statuses:

```text
new
contacted
confirmed
cancelled
```

## Environment Variables

Backend `.env`:

```env
APP_NAME=Dental Clinic AI
OPENROUTER_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_KNOWLEDGE_TABLE=clinic_knowledge_base
SUPABASE_APPOINTMENT_REQUESTS_TABLE=appointment_requests
MAKE_WEBHOOK_URL=
CLINIC_EMAIL=
BACKEND_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8001
```

Use the deployed Render backend URL in production.

## Build Order

1. Finish the FastAPI backend structure.
2. Keep fake services, fake availability, fake AI response, and fake appointment storage working.
3. Build or copy the ZubeVision-style frontend widget.
4. Replace academy language with clinic language.
5. Create a clinic knowledge base file or Supabase table.
6. Connect the backend chat endpoint to OpenRouter.
7. Connect appointment requests to Supabase.
8. Connect appointment request notifications to Make webhook.
9. Deploy backend to Render.
10. Deploy frontend/widget to Vercel.
11. Embed `widget.js` on the clinic website.
12. Test the full website-to-clinic-email flow.

## Later Upgrades

Add these only after the MVP works:
- Google Calendar availability
- Confirmed appointment booking
- Patient confirmation emails
- Appointment reminders
- Clinic dashboard
- Human handoff
- WhatsApp reminders or follow-up
- Payment/deposit links

## Demo Pitch

Patients can ask about services, get clear answers, and request an appointment directly from the clinic website. The clinic receives the request by email and can follow up manually. This reduces lost leads while keeping the first version simple and reliable.
