import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "accent" | "muted";
};

const toneClass = {
  default: "border-white/10 bg-white/5 text-stone",
  accent: "border-ember/30 bg-ember/10 text-orange-200",
  muted: "border-white/10 bg-white/0 text-slate-300"
};

export function Badge({ children, tone = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em] ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}
