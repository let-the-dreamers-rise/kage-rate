import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard-nav";
import { getRuntimeHealth } from "@/lib/kage-live";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const health = await getRuntimeHealth();

  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 md:px-10">
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <DashboardNav />
        <div>
          <header className="panel rounded-[30px] px-6 py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-signal text-slate-500">Operator runtime</p>
                <h1 className="mt-2 text-2xl font-semibold text-stone">Assisted autonomy for live Bags tokens</h1>
              </div>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                <span>{health.bagsConfigured ? "Bags configured" : "Bags key missing"}</span>
                <span>{health.trackedTokenMints.length} tracked mints</span>
                <span>{health.defaultAdminWallet ? "Admin wallet preset" : "No admin preset"}</span>
              </div>
            </div>
          </header>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
