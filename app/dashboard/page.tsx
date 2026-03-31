import { MetricCard } from "@/components/metric-card";
import { SectionTitle } from "@/components/section-title";
import { TokenCard } from "@/components/token-card";
import { getAdminWalletTokenMints, getLiveTokenOverview, lamportsToSolString, toBigInt } from "@/lib/kage-live";
import { getDashboardMissingEnv, getRuntimeConfig } from "@/lib/runtime-config";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{
    tokenMint?: string;
    tokenMints?: string;
    adminWallet?: string;
  }>;
};

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function parseTimestamp(value: string | number) {
  if (typeof value === "number") {
    return value > 1_000_000_000_000 ? value : value * 1000;
  }

  const trimmed = String(value).trim();
  const numeric = Number(trimmed);

  if (Number.isFinite(numeric) && `${numeric}` === trimmed) {
    return numeric > 1_000_000_000_000 ? numeric : numeric * 1000;
  }

  return Number.isNaN(Date.parse(trimmed)) ? Date.now() : Date.parse(trimmed);
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const runtime = getRuntimeConfig();
  const missingEnv = getDashboardMissingEnv();
  const explicitTokenMint = params.tokenMint?.trim() ?? "";
  const tokenMintsFromQuery = (params.tokenMints ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const adminWallet = params.adminWallet?.trim() || runtime.defaultAdminWallet || "";

  let adminWalletTokenMints: string[] = [];
  let adminWalletError: string | null = null;

  if (adminWallet && missingEnv.length === 0) {
    try {
      adminWalletTokenMints = await getAdminWalletTokenMints(adminWallet);
    } catch (error) {
      adminWalletError = error instanceof Error ? error.message : "Failed to load admin token list.";
    }
  }

  const tokenMints = unique([
    explicitTokenMint,
    ...tokenMintsFromQuery,
    ...adminWalletTokenMints,
    ...runtime.trackedTokenMints
  ]).slice(0, 4);

  const overviewResults =
    missingEnv.length === 0 && tokenMints.length > 0
      ? await Promise.allSettled(tokenMints.map((tokenMint) => getLiveTokenOverview(tokenMint)))
      : [];

  const tokens = overviewResults
    .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof getLiveTokenOverview>>> => result.status === "fulfilled")
    .map((result) => result.value);
  const tokenErrors = overviewResults
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => (result.reason instanceof Error ? result.reason.message : "Unknown Bags API error"));

  const aggregateClaimableLamports = tokens.reduce(
    (sum, token) => sum + toBigInt(token.creatorClaimableLamports),
    0n
  );
  const aggregateClaimed7dLamports = tokens.reduce(
    (sum, token) => sum + toBigInt(token.claimed7dLamports),
    0n
  );
  const aggregateLifetimeFeesLamports = tokens.reduce(
    (sum, token) => sum + toBigInt(token.lifetimeFeesLamports),
    0n
  );
  const aggregateClaimPackets = tokens.reduce((sum, token) => sum + token.pendingClaimPacketCount, 0);

  const metrics = [
    {
      label: "Tokens loaded",
      value: String(tokens.length),
      delta: adminWallet ? "wallet-aware" : "manual load",
      note: "Real token overviews built from Bags reads instead of a hardcoded demo portfolio."
    },
    {
      label: "Creator claimable",
      value: lamportsToSolString(aggregateClaimableLamports),
      delta: `${aggregateClaimPackets} claim packets`,
      note: "Current claimable fees for creator wallets across the loaded token set."
    },
    {
      label: "7-day claims",
      value: lamportsToSolString(aggregateClaimed7dLamports),
      delta: "recent activity",
      note: "Observed Bags claim events from the last rolling week."
    },
    {
      label: "Lifetime fees",
      value: lamportsToSolString(aggregateLifetimeFeesLamports),
      delta: `${tokens.reduce((sum, token) => sum + token.feeRecipientCount, 0)} recipients`,
      note: "Lifetime fees and current fee recipient coverage pulled from Bags analytics endpoints."
    }
  ];

  const recentEvents = tokens
    .flatMap((token) =>
      token.recentClaimEvents.map((event) => ({
        ...event,
        tokenMint: token.tokenMint,
        creatorDisplay: token.creatorDisplay
      }))
    )
    .sort((left, right) => parseTimestamp(right.timestamp) - parseTimestamp(left.timestamp))
    .slice(0, 6);

  return (
    <div>
      <header className="border-b border-white/10 pb-8">
        <p className="text-xs uppercase tracking-signal text-slate-500">Live Bags overview</p>
        <h2 className="display-face mt-3 text-5xl text-stone md:text-6xl">Load a real token mint</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          KAGE now reads live Bags data. A token mint is enough for live analytics. Admin wallet support is optional and only helps auto-discover tokens you actually control.
        </p>
      </header>

      <section className="mt-10 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <form action="/dashboard" className="panel rounded-[30px] p-6">
          <p className="text-xs uppercase tracking-signal text-slate-500">Read-only live mode</p>
          <div className="mt-6 grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Token mint</span>
              <input
                type="text"
                name="tokenMint"
                defaultValue={explicitTokenMint}
                placeholder="Paste any Bags token mint"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Admin wallet (optional)</span>
              <input
                type="text"
                name="adminWallet"
                defaultValue={adminWallet}
                placeholder="Only if you manage tokens"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
              />
            </label>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Token mint is the normal demo path. If you also supply an admin wallet, KAGE will ask Bags which tokens that wallet can manage and load those automatically.
          </p>
          <button
            type="submit"
            className="mt-6 rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f18c52]"
          >
            Load Bags data
          </button>
        </form>

        <div className="panel rounded-[30px] p-6">
          <p className="text-xs uppercase tracking-signal text-slate-500">Runtime status</p>
          <div className="mt-6 space-y-3 text-sm leading-7 text-slate-300">
            <p>BAGS_API_KEY: {missingEnv.includes("BAGS_API_KEY") ? "missing" : "configured"}</p>
            <p>Tracked env mints: {runtime.trackedTokenMints.length}</p>
            <p>Default admin wallet: {runtime.defaultAdminWallet ?? "not set"}</p>
          </div>
          {runtime.trackedTokenMints.length > 0 ? (
            <div className="mt-6 rounded-[24px] border border-ember/25 bg-ember/10 p-5">
              <p className="text-xs uppercase tracking-signal text-orange-200">Current live demo mint</p>
              <p className="mt-3 break-all text-sm leading-7 text-slate-200">{runtime.trackedTokenMints[0]}</p>
            </div>
          ) : null}
          {missingEnv.length > 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-amber-400/25 bg-amber-400/10 p-5">
              <p className="text-xs uppercase tracking-signal text-amber-200">Setup needed</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Add {missingEnv.join(", ")} before the dashboard can read live Bags data.
              </p>
            </div>
          ) : null}
          {adminWalletError ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-red-400/25 bg-red-400/10 p-5">
              <p className="text-xs uppercase tracking-signal text-red-200">Admin lookup failed</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{adminWalletError}</p>
            </div>
          ) : null}
        </div>
      </section>

      {missingEnv.length === 0 && tokens.length > 0 ? (
        <>
          <section className="mt-10 grid gap-5 xl:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </section>

          <section className="mt-14">
            <SectionTitle
              eyebrow="Live token views"
              title="Bags-backed operator cards."
              body="Each card is loaded from the official Bags API. This works even for public tokens you do not control, which makes the hackathon demo easy to show without spending money."
            />
            <div className="mt-8 grid gap-5 xl:grid-cols-2">
              {tokens.map((token) => (
                <TokenCard key={token.tokenMint} token={token} />
              ))}
            </div>
          </section>

          <section className="mt-20 grid gap-10 xl:grid-cols-[0.92fr_1.08fr]">
            <div className="panel rounded-[30px] p-7">
              <p className="text-xs uppercase tracking-signal text-slate-500">Recent Bags claims</p>
              <div className="mt-6 space-y-4">
                {recentEvents.map((event) => (
                  <article key={`${event.signature}-${event.tokenMint}`} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-signal text-slate-500">{event.creatorDisplay}</p>
                        <h3 className="mt-2 text-lg font-medium text-stone">
                          {event.amount} claimed on {event.tokenMint.slice(0, 4)}...{event.tokenMint.slice(-4)}
                        </h3>
                      </div>
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{event.timestampLabel}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      {event.isCreator ? "Creator wallet" : "Fee recipient"} {event.wallet.slice(0, 6)}...
                      {event.wallet.slice(-4)} executed Bags claim {event.signature.slice(0, 8)}...
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel rounded-[30px] p-7">
              <p className="text-xs uppercase tracking-signal text-slate-500">Live API surface</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">GET /api/tokens?tokenMint=&lt;mint&gt;</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Returns a live Bags overview for the requested mint, plus any tracked environment mints.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">GET /api/tokens?adminWallet=&lt;wallet&gt;</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Uses Bags&apos; fee-share admin list to discover tokens a creator/admin wallet controls.
                  </p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">POST /api/install-preview</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Generates a live fee-share admin update preview, so the install flow can move from pitch to transaction-ready.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {missingEnv.length === 0 && tokens.length === 0 ? (
        <section className="mt-12 panel rounded-[30px] p-7">
          <h3 className="text-2xl font-semibold text-stone">Nothing loaded yet.</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            Add a token mint, or rely on `KAGE_TRACKED_TOKEN_MINTS` in the environment. Admin wallet support is optional and only needed for creator-managed auto-discovery.
          </p>
          {tokenErrors.length > 0 ? (
            <div className="mt-6 space-y-3">
              {tokenErrors.map((error) => (
                <p key={error} className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </p>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
