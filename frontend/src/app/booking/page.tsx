import BookingForm from "@/components/BookingForm";

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <section className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Appointment Request
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Request a dental appointment
        </h1>
        <p className="mt-3 text-slate-600">
          Choose a service and preferred time. The clinic can review and confirm
          your request.
        </p>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
