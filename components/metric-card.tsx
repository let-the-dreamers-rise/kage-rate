import type { Metric } from "@/lib/types";

export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="panel rounded-[28px] p-6">
      <p className="text-xs uppercase tracking-signal text-slate-400">{metric.label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h3 className="display-face text-4xl text-stone">{metric.value}</h3>
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
          {metric.delta}
        </span>
      </div>
      <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">{metric.note}</p>
    </article>
  );
}
