import Link from "next/link";
import { Badge } from "@/components/badge";
import { SectionTitle } from "@/components/section-title";
import { getLiveTokenOverview, getRuntimeHealth } from "@/lib/kage-live";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { submissionDraft } from "@/lib/submission";

export const dynamic = "force-dynamic";

export default async function ApplyPage() {
  const runtime = getRuntimeConfig();
  const health = await getRuntimeHealth();
  const demoMint = runtime.trackedTokenMints[0] ?? "";

  let token = null;

  if (health.bagsConfigured && demoMint) {
    try {
      token = await getLiveTokenOverview(demoMint);
    } catch {
      token = null;
    }
  }

  const missingSubmissionLinks = [
    "Website URL",
    "GitHub repo URL",
    "Email address",
    "X profile URL"
  ];

  return (
    <main className="mx-auto max-w-[1480px] px-6 py-8 md:px-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">Submission kit</p>
          <h1 className="display-face mt-3 text-5xl text-stone md:text-6xl">Everything you need to fill the Bags application.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            This page turns KAGE into a fundable submission package: paste-ready form answers, live proof, and the few personal details that still need your own links.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={demoMint ? `/judge?tokenMint=${demoMint}` : "/judge"}
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            Open judge mode
          </Link>
          <Link
            href={demoMint ? `/dashboard?tokenMint=${demoMint}` : "/dashboard"}
            className="rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f18c52]"
          >
            Open live dashboard
          </Link>
        </div>
      </header>

      <section className="mt-12 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="panel panel-strong rounded-[34px] p-7">
          <Badge tone="accent">Recommended submission position</Badge>
          <h2 className="display-face mt-6 text-5xl text-stone">Pitch KAGE as the post-launch operator, not just another analytics tool.</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">{submissionDraft.description}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-signal text-slate-500">App name</p>
              <p className="mt-3 text-2xl font-semibold text-stone">{submissionDraft.appName}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-signal text-slate-500">Primary category</p>
              <p className="mt-3 text-2xl font-semibold text-stone">{submissionDraft.recommendedCategory}</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">Alternate: {submissionDraft.alternateCategory}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-signal text-slate-500">Coin choice</p>
              <p className="mt-3 text-2xl font-semibold text-stone">{submissionDraft.recommendedCoinChoice}</p>
            </div>
          </div>
        </div>

        <div className="panel rounded-[34px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">What still needs your info</p>
          <div className="mt-6 space-y-4">
            {missingSubmissionLinks.map((item, index) => (
              <div key={item} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-sm font-semibold text-amber-100">
                  0{index + 1}
                </div>
                <p className="pt-2 text-sm leading-7 text-slate-300">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] border border-dashed border-amber-400/25 bg-amber-400/10 p-5">
            <p className="text-xs uppercase tracking-signal text-amber-200">Important</p>
            <p className="mt-3 text-sm leading-7 text-slate-100">
              Do not submit placeholder links. Publish this app to a real URL and create a dedicated repo for this project before you paste the website and GitHub fields.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <SectionTitle
          eyebrow="Paste-ready answers"
          title="Use these values in the application form."
          body="These are tuned to sound credible to judges and clear to investors. The goal is to make KAGE feel like a product with a wedge, not a broad concept deck."
          tag="submission draft"
        />

        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          {submissionDraft.formFields.map((field) => (
            <article key={field.label} className="panel rounded-[28px] p-6">
              <p className="text-xs uppercase tracking-signal text-slate-500">{field.label}</p>
              <p className="mt-4 text-lg leading-8 text-stone">{field.value}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{field.note}</p>
            </article>
          ))}

          <article className="panel rounded-[28px] p-6">
            <p className="text-xs uppercase tracking-signal text-slate-500">Website</p>
            <p className="mt-4 text-lg leading-8 text-stone">{submissionDraft.websitePlaceholder}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Best answer after deployment: your live KAGE demo URL. Do not use `myapp.com` or `localhost`.
            </p>
          </article>

          <article className="panel rounded-[28px] p-6">
            <p className="text-xs uppercase tracking-signal text-slate-500">GitHub</p>
            <p className="mt-4 text-lg leading-8 text-stone">{submissionDraft.githubPlaceholder}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Publish this `kage-operator` app to its own repo. The current local git remote should not be used as the submission link for KAGE.
            </p>
          </article>

          <article className="panel rounded-[28px] p-6">
            <p className="text-xs uppercase tracking-signal text-slate-500">Email</p>
            <p className="mt-4 text-lg leading-8 text-stone">{submissionDraft.emailPlaceholder}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Use the address you actually monitor during judging.
            </p>
          </article>

          <article className="panel rounded-[28px] p-6">
            <p className="text-xs uppercase tracking-signal text-slate-500">X profile</p>
            <p className="mt-4 text-lg leading-8 text-stone">{submissionDraft.xPlaceholder}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Use the account you want judges and creators to contact.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-16 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <article className="panel rounded-[30px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">Full description</p>
          <p className="mt-5 text-lg leading-9 text-stone">{submissionDraft.description}</p>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-signal text-slate-500">Why no coin yet</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{submissionDraft.coinRationale}</p>
          </div>
        </article>

        <article className="panel rounded-[30px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">Live proof for the application</p>
          {token ? (
            <div className="mt-5 space-y-4">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-signal text-slate-500">Tracked demo mint</p>
                <p className="mt-3 break-all text-sm leading-7 text-stone">{token.tokenMint}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Creator claimable now</p>
                  <p className="mt-3 text-2xl font-semibold text-stone">{token.creatorClaimableNow}</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-signal text-slate-500">Lifetime fees</p>
                  <p className="mt-3 text-2xl font-semibold text-stone">{token.lifetimeFees}</p>
                </div>
              </div>
              <p className="text-sm leading-7 text-slate-300">
                This is useful in the application because it proves KAGE already reads live Bags production data instead of showing mocked charts.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-white/15 p-5">
              <p className="text-sm leading-7 text-slate-300">
                Live proof will appear here when `BAGS_API_KEY` and a tracked token mint are configured.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="mt-16 grid gap-6 xl:grid-cols-2">
        <article className="panel rounded-[30px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">Why this is fundable</p>
          <div className="mt-6 space-y-4">
            {submissionDraft.fundabilityPoints.map((point) => (
              <div key={point} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm leading-7 text-slate-300">{point}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel rounded-[30px] p-7">
          <p className="text-xs uppercase tracking-signal text-slate-500">Judge proof points</p>
          <div className="mt-6 space-y-4">
            {submissionDraft.proofPoints.map((point) => (
              <div key={point} className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-sm leading-7 text-slate-300">{point}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
