import Link from "next/link";
import { Badge } from "@/components/badge";
import type { LiveTokenOverview } from "@/lib/types";

const toneByStatus = {
  Healthy: "accent",
  Watchlist: "muted",
  Recovery: "muted"
} as const;

export function TokenCard({ token }: { token: LiveTokenOverview }) {
  return (
    <article className="panel rounded-[30px] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">{token.creatorDisplay}</p>
          <h3 className="mt-2 text-2xl font-semibold text-stone">
            {token.tokenMint.slice(0, 4)}...{token.tokenMint.slice(-4)}
          </h3>
        </div>
        <Badge tone={toneByStatus[token.status]}>{token.status}</Badge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">Creator claimable</p>
          <p className="mt-2 text-xl font-medium text-stone">{token.creatorClaimableNow}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">7-day claims</p>
          <p className="mt-2 text-xl font-medium text-stone">{token.claimed7d}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">Lifetime fees</p>
          <p className="mt-2 text-xl font-medium text-stone">{token.lifetimeFees}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-signal text-slate-500">Fee recipients</p>
          <p className="mt-2 text-xl font-medium text-stone">{token.feeRecipientCount}</p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-7 text-slate-300">{token.summary}</p>

      <Link
        href={`/dashboard/tokens/${token.tokenMint}`}
        className="mt-6 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-stone transition hover:border-white/20 hover:bg-white/[0.04]"
      >
        Open token detail
      </Link>
    </article>
  );
}
