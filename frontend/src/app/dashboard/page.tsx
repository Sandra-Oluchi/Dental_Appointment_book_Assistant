import { type Appointment, getAppointments } from "@/lib/api";

export default async function DashboardPage() {
  let appointments: Appointment[] = [];

  try {
    const data = await getAppointments();
    appointments = data.appointments;
  } catch {
    appointments = [];
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Clinic Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Appointment requests
        </h1>

        <div className="mt-8 space-y-4">
          {appointments.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">
              No appointment requests yet.
            </div>
          ) : (
            appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      {appointment.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {appointment.service}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
                    {appointment.status}
                  </span>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                  <div>
                    <dt className="font-semibold">Preferred time</dt>
                    <dd>
                      {appointment.appointment_date} at{" "}
                      {appointment.appointment_time}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Phone</dt>
                    <dd>{appointment.phone}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Email</dt>
                    <dd>{appointment.email || "Not provided"}</dd>
                  </div>
                </dl>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
