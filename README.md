# Dental Appointment Booking Assistant

Dental Appointment Booking Assistant is a full-stack booking and clinic notification system for a dental clinic. Patients can choose a service, pick an available appointment time, submit their details, and the clinic receives the booking through Supabase and a Make/Gmail email workflow.

## Features

- Patient-facing booking form built with Next.js.
- FastAPI backend for services, availability, chat, appointments, and health checks.
- Supabase storage for appointment requests and dental services.
- Make webhook notification payload for Gmail clinic emails.
- Clinic dashboard endpoint for viewing submitted appointment requests.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: FastAPI, Uvicorn, Python
- Database: Supabase
- Automation: Make webhook plus Gmail module
- AI: OpenRouter/OpenAI-compatible API configuration

## Project Structure

```text
backend/
  app/
    database/
    models/
    routes/
    services/
  requirements.txt
  .env.example

frontend/
  src/
    app/
    components/
    lib/
  package.json
  next.config.ts

Knowledge_base/
PROJECT_PLAN.md
```

## Local Backend Setup

```powershell
cd backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

Fill in `backend/.env` with your real Supabase, Make, clinic email, and AI keys.

Run the backend:

```powershell
python -m uvicorn app.main:app --reload --port 8140
```

Health check:

```text
http://127.0.0.1:8140/health
```

## Local Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:3002
```

For local development, `frontend/.env` can point to the backend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8140
```

## Backend Environment Variables

Use `backend/.env.example` as the template.

```env
APP_NAME=
OPENROUTER_API_KEY=
OPENAI_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_KNOWLEDGE_TABLE=
SUPABASE_SERVICES_TABLE=
SUPABASE_APPOINTMENT_REQUESTS_TABLE=
MAKE_WEBHOOK_URL=
WEBHOOK_URL=
CLINIC_EMAIL=
BACKEND_ALLOWED_ORIGINS=
```

Do not commit real `.env` files.

## Make/Gmail Mapping

The backend sends appointment data to Make. In the Gmail module, map:

```text
To: clinic_email
Subject: email_subject
Body: email_body_text
```

Turn the Make scenario ON after testing.

## Deployment

### Render Backend

Create a Render Web Service using the `backend` directory.

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Add the backend environment variables in Render.

### Vercel Frontend

Create a Vercel project from the same repository using the `frontend` directory.

```text
Root Directory: frontend
Build Command: npm run build
```

Add this Vercel environment variable:

```env
BACKEND_API_URL=https://your-render-backend.onrender.com
```

Then update Render:

```env
BACKEND_ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
```

Redeploy both services after changing environment variables.

## Verification Checklist

- `GET /health` returns `{"status":"healthy","supabase_configured":true}`.
- `GET /services` returns active dental services.
- Booking form creates a new appointment.
- Supabase receives the appointment.
- The appointment has `notification_sent: true`.
- Gmail receives the clinic email with patient details.
