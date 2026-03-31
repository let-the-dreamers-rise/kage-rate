import Link from "next/link";
import { Badge } from "@/components/badge";
import { getLiveTokenOverview, getRuntimeHealth } from "@/lib/kage-live";
import { getRuntimeConfig } from "@/lib/runtime-config";

export const dynamic = "force-dynamic";

type JudgePageProps = {
  searchParams: Promise<{
    tokenMint?: string;
  }>;
};

function shortAddress(value: string) {
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function renderStatusLabel(value: boolean) {
  return value ? "Live" : "Missing";
}

export default async function JudgePage({ searchParams }: JudgePageProps) {
  const params = await searchParams;
  const runtime = getRuntimeConfig();
  const health = await getRuntimeHealth();
  const tokenMint = params.tokenMint?.trim() || runtime.trackedTokenMints[0] || "";

  let token = null;
  let tokenError: string | null = null;

  if (health.bagsConfigured && tokenMint) {
    try {
      token = await getLiveTokenOverview(tokenMint);
    } catch (error) {
      tokenError = error instanceof Error ? error.message : "Failed to load live token proof.";
    }
  }

  const demoFlow = [
    "Start with the live Bags status chips and show that runtime config is real.",
    "Point at lifetime fees, claimable now, and recent claim events from the tracked mint.",
    "Finish on the permission gate: KAGE is integrated already, but execution unlocks only for a real token admin."
  ];

  const judgeChecklist = [
    "Live Bags analytics loaded for a real token mint",
    "Recent claim activity pulled from Bags claim events",
    "Install preview built with real KAGE Solana wallets",
    "Config execution blocked when wallet is not Bags admin"
  ];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-mesh opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_24%,rgba(224,122,63,0.18),transparent_18%),radial-gradient(circle_at_18%_64%,rgba(255,255,255,0.05),transparent_20%)]" />
        <div className="relative mx-auto min-h-screen max-w-[1520px] px-6 pb-16 pt-8 md:px-10">
          <header className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-xs uppercase tracking-signal text-slate-500">KAGE judge mode</p>
              <h1 className="display-face mt-2 text-3xl text-stone">Live proof, not just a pitch.</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Open submission kit
              </Link>
              <Link
                href={tokenMint ? `/dashboard?tokenMint=${tokenMint}` : "/dashboard"}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Open dashboard
              </Link>
              <Link
                href={tokenMint ? `/install?tokenMint=${tokenMint}` : "/install"}
                className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f18c52]"
              >
                Open install preview
              </Link>
            </div>
          </header>

          <div className="grid gap-16 py-14 lg:grid-cols-[1.08fr_0.92fr]">
            <div>
              <Badge tone="accent">Bags hackathon proof surface</Badge>
              <h2 className="display-face mt-8 max-w-5xl text-6xl leading-[0.92] text-stone md:text-8xl">
                KAGE already talks to the live Bags API and refuses fake authority.
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                The demo proves three things judges care about: real Bags reads, permission-aware install flows,
                and a product path that works even before the creator grants full control.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200">
                  Bags API key: {renderStatusLabel(health.bagsConfigured)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200">
                  Ops wallet: {renderStatusLabel(health.opsWalletConfigured)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-slate-200">
                  Retention wallet: {renderStatusLabel(health.retentionWalletConfigured)}
                </span>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Live token</p>
                  <p className="mt-3 break-all text-sm leading-7 text-stone">{tokenMint || "No mint configured"}</p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Demo path</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Public token mint for analytics now, creator-owned wallet later for config execution.
                  </p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Core thesis</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    KAGE is useful before custody. It becomes stronger once a creator chooses to connect authority.
                  </p>
                </div>
              </div>
            </div>

            <div className="panel panel-strong rounded-[38px] p-7 md:p-8">
              <p className="text-xs uppercase tracking-signal text-slate-500">Judge checklist</p>
              <div className="mt-6 space-y-5">
                {judgeChecklist.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-sm font-semibold text-orange-200">
                      0{index + 1}
                    </div>
                    <p className="pt-2 text-sm leading-7 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-emerald-400/20 bg-emerald-400/10 p-5">
                <p className="text-xs uppercase tracking-signal text-emerald-200">Why that matters</p>
                <p className="mt-3 text-sm leading-7 text-slate-100">
                  This is not pretending to control money it does not control. The demo is already integrated, and the remaining step is creator authorization, not missing product logic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1520px] px-6 py-24 md:px-10">
        <div className="grid gap-10 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <p className="text-xs uppercase tracking-signal text-slate-500">Live Bags token proof</p>
            <h3 className="display-face mt-4 text-5xl text-stone">What the app saw from production.</h3>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              This section is pulled from the same runtime the app uses. If the token changes, this view changes with it.
            </p>

            {token ? (
              <div className="mt-10 grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Creator display</p>
                  <h4 className="mt-3 text-3xl font-semibold text-stone">{token.creatorDisplay}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Wallet: {token.creatorWallet ? shortAddress(token.creatorWallet) : "Unavailable"}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Creator claimable now</p>
                  <h4 className="mt-3 text-3xl font-semibold text-stone">{token.creatorClaimableNow}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Pending claim packets: {token.pendingClaimPacketCount}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Lifetime fees</p>
                  <h4 className="mt-3 text-3xl font-semibold text-stone">{token.lifetimeFees}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Total claimed so far: {token.totalClaimed}
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Fee recipients</p>
                  <h4 className="mt-3 text-3xl font-semibold text-stone">{token.feeRecipientCount}</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Current token state: {token.status}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-10 rounded-[28px] border border-dashed border-red-400/25 bg-red-400/10 p-6">
                <p className="text-xs uppercase tracking-signal text-red-200">Live read failed</p>
                <p className="mt-3 text-sm leading-7 text-slate-100">{tokenError ?? "No token mint available for judge mode."}</p>
              </div>
            )}
          </div>

          <div className="panel rounded-[34px] p-7">
            <p className="text-xs uppercase tracking-signal text-slate-500">Recent event sample</p>
            <div className="mt-6 space-y-4">
              {token?.recentClaimEvents.slice(0, 4).map((event) => (
                <div key={event.signature} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-lg font-medium text-stone">{event.amount}</h4>
                    <span className="text-xs uppercase tracking-[0.22em] text-slate-500">{event.timestampLabel}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {event.isCreator ? "Creator wallet" : "Fee recipient"} {shortAddress(event.wallet)} submitted Bags claim {shortAddress(event.signature)}.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-dashed border-white/15 p-5">
              <p className="text-xs uppercase tracking-signal text-slate-500">Interpretation</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Judges do not have to trust a mocked chart here. These are direct Bags claim event reads rendered into the KAGE operator surface.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1520px] px-6 py-24 md:px-10">
          <div className="grid gap-10 xl:grid-cols-[0.72fr_0.62fr_0.66fr]">
            <div>
              <p className="text-xs uppercase tracking-signal text-slate-500">30-second pitch</p>
              <h3 className="display-face mt-4 text-5xl text-stone">What to say while this screen is open.</h3>
            </div>

            <div className="rounded-[34px] border border-white/10 bg-white/[0.03] p-7">
              <p className="text-lg leading-9 text-stone">
                "Most Bags tokens die after launch because nobody manages what happens next. KAGE is the post-launch operator:
                it reads live Bags fees and claim activity, prepares install-ready fee-share updates, and keeps the creator in control
                until they explicitly connect authority. This demo is already talking to the real Bags API. It shows live token proof today,
                and it cleanly upgrades into creator-controlled automation the moment a real admin wallet is connected."
              </p>
            </div>

            <div className="rounded-[34px] border border-ember/20 bg-ember/10 p-7">
              <p className="text-xs uppercase tracking-signal text-orange-200">Demo flow</p>
              <div className="mt-5 space-y-4">
                {demoFlow.map((step, index) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ember/35 bg-black/20 text-sm font-semibold text-orange-100">
                      0{index + 1}
                    </div>
                    <p className="pt-1 text-sm leading-7 text-orange-50">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1520px] px-6 py-24 md:px-10">
          <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs uppercase tracking-signal text-slate-500">Permission gate</p>
              <h3 className="display-face mt-4 text-5xl text-stone">The install flow is real, and the guardrail is real too.</h3>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                KAGE can already generate the fee-share distribution plan using your live operator wallets. What it will not do is pretend it can reconfigure a token without a Bags admin wallet.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-signal text-slate-500">KAGE ops wallet</p>
                <p className="mt-3 break-all text-sm leading-7 text-stone">{runtime.kageOpsWallet ?? "Missing"}</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-signal text-slate-500">KAGE retention wallet</p>
                <p className="mt-3 break-all text-sm leading-7 text-stone">{runtime.kageRetentionWallet ?? "Missing"}</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:col-span-2">
                <p className="text-xs uppercase tracking-signal text-slate-500">Current gate result</p>
                <p className="mt-3 text-lg font-medium text-stone">
                  Config execution stays blocked until the connected wallet is a real Bags fee-share admin for the token.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  That means the demo is honest: live reads work today, real config execution unlocks the moment a creator connects authority.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-10 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-signal text-slate-500">Why this wins Bags</p>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-stone">
                It proves real Bags integration, solves a creator pain point immediately, and turns permission boundaries into a strength instead of a demo liability.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/apply"
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Open submission kit
              </Link>
              <Link
                href={tokenMint ? `/dashboard?tokenMint=${tokenMint}` : "/dashboard"}
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                Open live dashboard
              </Link>
              <Link
                href={tokenMint ? `/install?tokenMint=${tokenMint}` : "/install"}
                className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f18c52]"
              >
                Open live install check
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-signal text-slate-500">Integration depth</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Live Bags analytics, claim events, claimability checks, and fee-share update previews are all in the runtime.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-signal text-slate-500">Zero-cost demo path</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Public token mints are enough to prove value without spending money or controlling a token on day one.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-signal text-slate-500">Real upgrade path</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The same app becomes execution-ready when a creator connects the wallet that actually has Bags admin rights.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
