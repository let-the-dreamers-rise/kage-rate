import Link from "next/link";
import { Badge } from "@/components/badge";
import { MetricCard } from "@/components/metric-card";
import { SectionTitle } from "@/components/section-title";
import { agents, heroStats } from "@/lib/data";
import { getRuntimeConfig } from "@/lib/runtime-config";

export default function HomePage() {
  const runtime = getRuntimeConfig();
  const demoMint = runtime.trackedTokenMints[0] ?? "";

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-80" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-16 pt-8 md:px-10">
          <header className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-xs uppercase tracking-signal text-slate-500">Bags creator ops</p>
              <h1 className="display-face mt-2 text-3xl text-stone">KAGE</h1>
            </div>
            <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <Link href="#agents">Agents</Link>
              <Link href="#proof">Why it wins</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/judge">Judge mode</Link>
              <Link href="/apply">Submission kit</Link>
            </nav>
          </header>

          <div className="grid flex-1 items-center gap-16 py-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <Badge tone="accent">Shadow operator for Bags creators</Badge>
              <h2 className="display-face mt-8 max-w-4xl text-5xl leading-[0.94] text-stone md:text-7xl">
                Keep the token alive after launch, not just for the first 48 hours.
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                KAGE turns a fading Bags token into an operating system: fee recovery, loyalty campaigns,
                community drafts, and operator-grade intelligence routed through one approval-first control tower.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={demoMint ? `/dashboard?tokenMint=${demoMint}` : "/dashboard"}
                  className="rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#f18c52]"
                >
                  Open live token demo
                </Link>
                <Link
                  href={demoMint ? `/judge?tokenMint=${demoMint}` : "/judge"}
                  className="rounded-full border border-ember/35 bg-ember/10 px-6 py-3 text-sm font-semibold text-orange-100 transition hover:bg-ember/20"
                >
                  Open judge mode
                </Link>
                <Link
                  href="/apply"
                  className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-stone transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  Open submission kit
                </Link>
                <Link
                  href="/install"
                  className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-stone transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  Preview install flow
                </Link>
              </div>
              <div className="mt-12 grid gap-4 text-sm text-slate-400 md:grid-cols-3">
                <p>Token-mint-first demo path, so you can prove live Bags reads without owning a token.</p>
                <p>Assisted autonomy by default, so creators never hand over silent custody.</p>
                <p>Reward campaigns for all loyal holders without pretending native Bags fee share can do that at scale.</p>
                <p>Cross-token network stays opt-in until the installed base makes the recommendations real.</p>
              </div>
            </div>

            <div className="panel panel-strong rounded-[34px] p-6 md:p-8">
              <div className="signal-border border-b border-white/10 pb-5">
                <p className="text-xs uppercase tracking-signal text-slate-500">Live operator view</p>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-stone">Three live agents. Two advisory layers.</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                      This ships like something creators would install today, while keeping the bigger swarm story for the hackathon pitch.
                    </p>
                  </div>
                  <Badge>assisted autonomy</Badge>
                </div>
              </div>
              {demoMint ? (
                <div className="mt-6 rounded-[24px] border border-ember/25 bg-ember/10 p-5">
                  <p className="text-xs uppercase tracking-signal text-orange-200">Current live demo mint</p>
                  <p className="mt-3 break-all text-sm leading-7 text-slate-100">{demoMint}</p>
                </div>
              ) : null}
              <div className="mt-6 space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.name}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.05]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-lg font-medium text-stone">{agent.name}</h4>
                      <Badge tone={agent.status === "Live" ? "accent" : "muted"}>{agent.status}</Badge>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-signal text-slate-500">{agent.cadence}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{agent.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-[1440px] px-6 py-24 md:px-10">
        <SectionTitle
          eyebrow="Why this is sharper"
          title="A real wedge, not five startups duct-taped together."
          body="The original concept was compelling but too broad, too custodial, and too hand-wavy for a judge or creator to trust. KAGE keeps the ambition while narrowing the first user promise to something measurable: recover value, retain holders, and reduce creator burnout."
          tag="corrected for adoption"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {heroStats.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </section>

      <section id="agents" className="mx-auto max-w-[1440px] px-6 py-24 md:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.7fr_1fr]">
          <SectionTitle
            eyebrow="Operating model"
            title="What creators actually get on day one."
            body="KAGE is not a generic bot. It is a post-launch operator stack for Bags tokens with one install flow, one approval queue, and one dashboard that ties recovered fees to retention outcomes."
          />
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs uppercase tracking-signal text-slate-500">Revenue recovery</p>
              <h3 className="mt-4 text-2xl font-semibold text-stone">Claim packets, not blind custody</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                KAGE scans for claimable Bags fees, batches transactions, and shows clear creator-side ROI before any approval.
              </p>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs uppercase tracking-signal text-slate-500">Retention loops</p>
              <h3 className="mt-4 text-2xl font-semibold text-stone">Loyalty campaigns for real cohorts</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Instead of promising impossible protocol-wide dividends, KAGE runs streaks, tiers, and reward drops powered by wallet snapshots.
              </p>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs uppercase tracking-signal text-slate-500">Community control</p>
              <h3 className="mt-4 text-2xl font-semibold text-stone">AI drafts with human trust gates</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Community updates, weekly reports, and alert responses are prepared automatically, then routed through the same queue.
              </p>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">
              <p className="text-xs uppercase tracking-signal text-slate-500">Network intelligence</p>
              <h3 className="mt-4 text-2xl font-semibold text-stone">Opt-in signal overlap</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Cross-promotion stays advisory until enough installed creators exist to make the recommendations materially better than guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
