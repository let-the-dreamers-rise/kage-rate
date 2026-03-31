import Link from "next/link";
import { Badge } from "@/components/badge";
import { installSteps } from "@/lib/data";
import { createLiveInstallPreview } from "@/lib/kage-live";
import { getInstallMissingEnv, getRuntimeConfig } from "@/lib/runtime-config";

export const dynamic = "force-dynamic";

type InstallPageProps = {
  searchParams: Promise<{
    tokenMint?: string;
    creatorWallet?: string;
    approvalMode?: "assisted" | "delegated";
    creatorPct?: string;
    opsPct?: string;
    retentionPct?: string;
  }>;
};

function parsePercent(value: string | undefined, fallback: number) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, numeric));
}

export default async function InstallPage({ searchParams }: InstallPageProps) {
  const params = await searchParams;
  const missingEnv = getInstallMissingEnv();
  const runtime = getRuntimeConfig();
  const tokenMint = params.tokenMint?.trim() ?? runtime.trackedTokenMints[0] ?? "";
  const creatorWallet = params.creatorWallet?.trim() ?? "";
  const approvalMode = params.approvalMode === "delegated" ? "delegated" : "assisted";
  const creatorPct = parsePercent(params.creatorPct, 80);
  const opsPct = parsePercent(params.opsPct, 10);
  const retentionPct = parsePercent(params.retentionPct, 10);
  const splitTotal = creatorPct + opsPct + retentionPct;

  let preview = null;
  let previewError: string | null = null;

  if (tokenMint && creatorWallet && missingEnv.length === 0) {
    try {
      preview = await createLiveInstallPreview({
        tokenMint,
        creatorWallet,
        approvalMode,
        creatorShare: Math.round(creatorPct * 100),
        opsShare: Math.round(opsPct * 100),
        retentionShare: Math.round(retentionPct * 100)
      });
    } catch (error) {
      previewError = error instanceof Error ? error.message : "Failed to build install preview.";
    }
  }

  return (
    <main className="mx-auto max-w-[1240px] px-6 py-8 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">Install KAGE</p>
          <h1 className="display-face mt-3 text-5xl text-stone">Build a real Bags install preview.</h1>
        </div>
        <Link href="/dashboard" className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]">
          Back to dashboard
        </Link>
      </header>

      <section className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel rounded-[30px] p-7">
          <Badge tone="accent">Admin update preview</Badge>
          <h2 className="mt-5 text-3xl font-semibold text-stone">This page now targets live Bags config updates.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            You only need this flow when you actually control the token. For random public tokens, use the dashboard for live analytics and keep this page as a permissions check.
          </p>
          <div className="mt-8 space-y-5">
            {installSteps.map((step, index) => (
              <div key={step} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ember/30 bg-ember/10 text-sm font-semibold text-orange-200">
                  0{index + 1}
                </div>
                <p className="pt-2 text-sm leading-7 text-slate-300">{step}</p>
              </div>
            ))}
          </div>

          <form action="/install" className="mt-8 space-y-4 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Token mint</span>
              <input
                type="text"
                name="tokenMint"
                defaultValue={tokenMint}
                placeholder="Base58 token mint you manage"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Creator/admin wallet</span>
              <input
                type="text"
                name="creatorWallet"
                defaultValue={creatorWallet}
                placeholder="Wallet that is admin for the token"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Approval mode</span>
              <select
                name="approvalMode"
                defaultValue={approvalMode}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
              >
                <option value="assisted">assisted</option>
                <option value="delegated">delegated</option>
              </select>
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Creator %</span>
                <input
                  type="number"
                  name="creatorPct"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={creatorPct}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-slate-500">KAGE ops %</span>
                <input
                  type="number"
                  name="opsPct"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={opsPct}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
                />
              </label>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Retention %</span>
                <input
                  type="number"
                  name="retentionPct"
                  min="0"
                  max="100"
                  step="1"
                  defaultValue={retentionPct}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone outline-none transition focus:border-ember/40"
                />
              </label>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-black/15 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Split check</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Current total: {splitTotal}%. Recommended default is 80 / 10 / 10.
              </p>
              {splitTotal !== 100 ? (
                <p className="mt-2 text-sm leading-7 text-amber-200">
                  This preview will warn until the split totals exactly 100%.
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f18c52]"
            >
              Generate live preview
            </button>
          </form>
        </div>

        <div className="panel rounded-[30px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">Live preview result</p>

          {missingEnv.length > 0 ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-amber-400/25 bg-amber-400/10 p-5">
              <p className="text-xs uppercase tracking-signal text-amber-200">Setup needed</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                Add {missingEnv.join(", ")} before this page can build a real Bags fee-share update preview.
              </p>
            </div>
          ) : null}

          {!missingEnv.length && !tokenMint && !creatorWallet ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-white/15 p-5">
              <p className="text-sm leading-7 text-slate-300">
                Enter a token mint you actually manage and the wallet that is admin for it to generate a Bags fee-share admin update preview.
              </p>
            </div>
          ) : null}

          {previewError ? (
            <div className="mt-6 rounded-[24px] border border-dashed border-red-400/25 bg-red-400/10 p-5">
              <p className="text-xs uppercase tracking-signal text-red-200">Preview failed</p>
              <p className="mt-3 text-sm leading-7 text-slate-200">{previewError}</p>
            </div>
          ) : null}

          {preview ? (
            <>
              {preview.warnings.some((warning) => warning.includes("not currently listed as a fee share admin")) ? (
                <div className="mt-6 rounded-[24px] border border-dashed border-amber-400/25 bg-amber-400/10 p-5">
                  <p className="text-xs uppercase tracking-signal text-amber-200">Read-only result</p>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    This wallet is not an admin for the token, so KAGE can still validate the split and runtime plan but will not generate a live update transaction.
                  </p>
                </div>
              ) : null}
              <div className="mt-6 space-y-4">
                {preview.recipients.map((recipient) => (
                  <article key={recipient.walletAlias} className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-medium text-stone">{recipient.label}</h3>
                      <span className="text-sm font-semibold text-orange-200">{recipient.bps / 100}%</span>
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">{recipient.walletAlias}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{recipient.note}</p>
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-signal text-slate-500">Estimated jobs</p>
                <div className="mt-3 space-y-2">
                  {preview.estimatedJobs.map((job) => (
                    <p key={job} className="text-sm text-slate-300">{job}</p>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-signal text-slate-500">Split summary</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Creator {creatorPct}% | KAGE ops {opsPct}% | Retention {retentionPct}% | Total {splitTotal}%
                </p>
              </div>

              <div className="mt-6 rounded-[24px] border border-dashed border-white/15 p-5">
                <p className="text-xs uppercase tracking-signal text-slate-500">Warnings</p>
                <div className="mt-3 space-y-2">
                  {preview.warnings.map((warning) => (
                    <p key={warning} className="text-sm leading-7 text-slate-300">{warning}</p>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}
