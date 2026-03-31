import Link from "next/link";
import { Badge } from "@/components/badge";
import { MetricCard } from "@/components/metric-card";
import { getLiveTokenOverview } from "@/lib/kage-live";
import { getDashboardMissingEnv } from "@/lib/runtime-config";

export const dynamic = "force-dynamic";

type TokenPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TokenDetailPage({ params }: TokenPageProps) {
  const missingEnv = getDashboardMissingEnv();
  const { slug } = await params;
  const tokenMint = decodeURIComponent(slug);

  let token = null;
  let errorMessage: string | null = null;

  if (missingEnv.length === 0) {
    try {
      token = await getLiveTokenOverview(tokenMint);
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : "Failed to load token overview.";
    }
  }

  if (missingEnv.length > 0) {
    return (
      <div className="panel rounded-[30px] p-7">
        <h2 className="text-2xl font-semibold text-stone">Bags setup required</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Add {missingEnv.join(", ")} before token drilldowns can read live Bags data.
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="panel rounded-[30px] p-7">
        <h2 className="text-2xl font-semibold text-stone">Token load failed</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">{errorMessage}</p>
      </div>
    );
  }

  const metrics = [
    {
      label: "Creator claimable",
      value: token.creatorClaimableNow,
      delta: `${token.creatorClaimablePositionCount} positions`,
      note: "Claimable value for the creator wallet only."
    },
    {
      label: "Claim packets",
      value: String(token.pendingClaimPacketCount),
      delta: token.status,
      note: "Current Bags claim transactions that can be generated for the creator wallet."
    },
    {
      label: "7-day claims",
      value: token.claimed7d,
      delta: `${token.feeRecipientCount} recipients`,
      note: "Recent observed claim events for this token."
    },
    {
      label: "Lifetime fees",
      value: token.lifetimeFees,
      delta: token.totalClaimed,
      note: "Lifetime fees and total claimed value from Bags analytics."
    }
  ];

  return (
    <div>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">{token.creatorDisplay}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h2 className="display-face text-5xl text-stone">{token.tokenMint.slice(0, 4)}...{token.tokenMint.slice(-4)}</h2>
            <Badge tone={token.status === "Healthy" ? "accent" : "muted"}>{token.status}</Badge>
          </div>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{token.summary}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500">
            Creator wallet: {token.creatorWallet ?? "Unavailable"}
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]"
        >
          Back to overview
        </Link>
      </header>

      <section className="mt-10 grid gap-5 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="mt-12 grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <article className="panel rounded-[30px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">Current fee recipients</p>
          <div className="mt-6 space-y-4">
            {token.recipients.map((recipient) => (
              <div key={recipient.wallet} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-medium text-stone">{recipient.displayName}</h3>
                  <span className="text-sm font-semibold text-orange-200">{recipient.royaltyBps / 100}%</span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  {recipient.wallet}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Total claimed: {recipient.totalClaimed}
                  {recipient.isCreator ? " | creator" : ""}
                  {recipient.isAdmin ? " | admin" : ""}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel rounded-[30px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">Recent claim activity</p>
          <div className="mt-6 space-y-4">
            {token.recentClaimEvents.map((event) => (
              <div key={event.signature} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-medium text-stone">{event.amount}</h3>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{event.timestampLabel}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {event.isCreator ? "Creator wallet" : "Fee recipient"} {event.wallet.slice(0, 6)}...
                  {event.wallet.slice(-4)} claimed via Bags.
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                  {event.signature}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
