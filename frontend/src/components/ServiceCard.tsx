import type { DentalService } from "@/lib/api";

type ServiceCardProps = {
  service: DentalService;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {service.id}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-slate-950">
        {service.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {service.description}
      </p>
    </article>
  );
}
