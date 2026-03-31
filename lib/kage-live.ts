import {
  createFeeShareAdminUpdateConfig,
  getClaimTransactions,
  getClaimablePositions,
  getFeeShareAdminList,
  getTokenClaimEvents,
  getTokenClaimStats,
  getTokenCreators,
  getTokenLifetimeFees
} from "@/lib/bags";
import { getRuntimeConfig } from "@/lib/runtime-config";
import type { InstallPreviewResponse, LiveTokenOverview, RuntimeHealth } from "@/lib/types";

export function lamportsToSolString(lamports: bigint) {
  const sol = Number(lamports) / 1_000_000_000;

  if (sol >= 100) {
    return `${sol.toFixed(1)} SOL`;
  }

  if (sol >= 1) {
    return `${sol.toFixed(2)} SOL`;
  }

  return `${sol.toFixed(4)} SOL`;
}

export function toBigInt(value: string | number | bigint | null | undefined) {
  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number") {
    return BigInt(Math.trunc(value));
  }

  if (!value) {
    return 0n;
  }

  try {
    return BigInt(value);
  } catch {
    return 0n;
  }
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

function formatTimestamp(value: string | number) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(parseTimestamp(value));
}

function deriveStatus(creatorClaimableLamports: bigint, claimed7dLamports: bigint) {
  if (creatorClaimableLamports >= 1_000_000_000n || claimed7dLamports >= 3_000_000_000n) {
    return "Healthy" as const;
  }

  if (creatorClaimableLamports >= 250_000_000n || claimed7dLamports >= 500_000_000n) {
    return "Watchlist" as const;
  }

  return "Recovery" as const;
}

function bestCreatorDisplayName(creator: {
  providerUsername?: string | null;
  bagsUsername?: string | null;
  username?: string | null;
  wallet: string;
}) {
  return creator.providerUsername ?? creator.bagsUsername ?? creator.username ?? creator.wallet.slice(0, 8);
}

export async function getLiveTokenOverview(tokenMint: string): Promise<LiveTokenOverview> {
  const [creators, claimStats, claimEvents, lifetimeFees] = await Promise.all([
    getTokenCreators(tokenMint),
    getTokenClaimStats(tokenMint),
    getTokenClaimEvents(tokenMint, 8),
    getTokenLifetimeFees(tokenMint)
  ]);

  const creator =
    creators.find((entry) => entry.isCreator) ??
    claimStats.find((entry) => entry.isCreator) ??
    creators[0] ??
    claimStats[0];

  const creatorWallet = creator?.wallet ?? null;
  const creatorPositions = creatorWallet ? await getClaimablePositions(creatorWallet) : [];
  const creatorTokenPositions = creatorPositions.filter((position) => position.baseMint === tokenMint);
  const creatorClaimableLamports = creatorTokenPositions.reduce(
    (sum, position) => sum + toBigInt(position.totalClaimableLamportsUserShare),
    0n
  );

  let claimPacketCount = 0;

  if (creatorWallet && creatorClaimableLamports > 0n) {
    const claimTransactions = await getClaimTransactions(tokenMint, creatorWallet);
    claimPacketCount = claimTransactions.length;
  }

  const claimed7dLamports = claimEvents.reduce((sum, event) => {
    const eventTime = parseTimestamp(event.timestamp);
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    if (eventTime < sevenDaysAgo) {
      return sum;
    }

    return sum + toBigInt(event.amount);
  }, 0n);

  const totalClaimedLamports = claimStats.reduce((sum, recipient) => sum + toBigInt(recipient.totalClaimed), 0n);
  const status = deriveStatus(creatorClaimableLamports, claimed7dLamports);
  const creatorDisplay = creator
    ? bestCreatorDisplayName(creator)
    : `${tokenMint.slice(0, 4)}...${tokenMint.slice(-4)}`;

  return {
    tokenMint,
    creatorDisplay,
    creatorWallet,
    feeRecipientCount: claimStats.length,
    creatorClaimableNow: lamportsToSolString(creatorClaimableLamports),
    creatorClaimableLamports: creatorClaimableLamports.toString(),
    creatorClaimablePositionCount: creatorTokenPositions.length,
    pendingClaimPacketCount: claimPacketCount,
    lifetimeFees: lamportsToSolString(toBigInt(lifetimeFees)),
    lifetimeFeesLamports: toBigInt(lifetimeFees).toString(),
    claimed7d: lamportsToSolString(claimed7dLamports),
    claimed7dLamports: claimed7dLamports.toString(),
    totalClaimed: lamportsToSolString(totalClaimedLamports),
    totalClaimedLamports: totalClaimedLamports.toString(),
    status,
    recipients: claimStats.map((recipient) => ({
      wallet: recipient.wallet,
      displayName: bestCreatorDisplayName(recipient),
      royaltyBps: recipient.royaltyBps,
      isCreator: recipient.isCreator,
      isAdmin: Boolean(recipient.isAdmin),
      totalClaimed: lamportsToSolString(toBigInt(recipient.totalClaimed))
    })),
    recentClaimEvents: claimEvents.map((event) => ({
      wallet: event.wallet,
      isCreator: event.isCreator,
      amount: lamportsToSolString(toBigInt(event.amount)),
      signature: event.signature,
      timestamp: event.timestamp,
      timestampLabel: formatTimestamp(event.timestamp)
    })),
    summary:
      creatorClaimableLamports > 0n
        ? `Creator wallet has ${lamportsToSolString(creatorClaimableLamports)} ready to claim across ${creatorTokenPositions.length} position${creatorTokenPositions.length === 1 ? "" : "s"}.`
        : "Creator wallet has no claimable fees right now, so the best move is monitoring and community upkeep."
  };
}

export async function getAdminWalletTokenMints(wallet: string) {
  const response = await getFeeShareAdminList(wallet);
  return response.tokenMints;
}

export async function createLiveInstallPreview(input: {
  tokenMint: string;
  creatorWallet: string;
  creatorShare?: number;
  opsShare?: number;
  retentionShare?: number;
  approvalMode?: "assisted" | "delegated";
}): Promise<InstallPreviewResponse> {
  const { kageOpsWallet, kageRetentionWallet } = getRuntimeConfig();

  if (!kageOpsWallet || !kageRetentionWallet) {
    throw new Error("KAGE operator wallets are not configured");
  }

  const creatorShare = input.creatorShare ?? 8000;
  const opsShare = input.opsShare ?? 1000;
  const retentionShare = input.retentionShare ?? 1000;
  const adminTokenMints = await getAdminWalletTokenMints(input.creatorWallet);
  const walletIsAdmin = adminTokenMints.includes(input.tokenMint);

  const recipients = [
    {
      label: "Creator wallet",
      walletAlias: input.creatorWallet,
      bps: creatorShare,
      note: "Primary fee destination controlled by the creator."
    },
    {
      label: "KAGE ops wallet",
      walletAlias: kageOpsWallet,
      bps: opsShare,
      note: "Continuous operator fee for claims, monitoring, and reporting."
    },
    {
      label: "Retention pool",
      walletAlias: kageRetentionWallet,
      bps: retentionShare,
      note: "Dedicated reward wallet for streak and loyalty campaign payouts."
    }
  ];

  const warnings: string[] = [];

  if (!walletIsAdmin) {
    warnings.push("The supplied wallet is not currently listed as a fee share admin for this token.");
  }

  warnings.push("Native Bags fee-sharing only covers configured claimer wallets, so broader holder incentives still need campaign distributions.");

  const totalBps = recipients.reduce((sum, recipient) => sum + recipient.bps, 0);

  if (totalBps !== 10000) {
    warnings.push("Shares must total 10,000 bps before the update transaction is valid.");
  }

  let transactionCount = 0;

  if (walletIsAdmin && totalBps === 10000) {
    const update = await createFeeShareAdminUpdateConfig({
      baseMint: input.tokenMint,
      payer: input.creatorWallet,
      claimersArray: recipients.map((recipient) => recipient.walletAlias),
      basisPointsArray: recipients.map((recipient) => recipient.bps)
    });

    transactionCount = update.transactions.length;
  }

  return {
    tokenMint: input.tokenMint,
    approvalMode: input.approvalMode ?? "assisted",
    recipients,
    warnings,
    estimatedJobs: [
      walletIsAdmin ? `config-update-txs:${transactionCount}` : "config-update-skipped:not-admin",
      "fee-scan-every-15m",
      "community-draft-daily",
      "retention-audit-daily",
      "state-of-token-weekly"
    ]
  };
}

export async function getRuntimeHealth(): Promise<RuntimeHealth> {
  const config = getRuntimeConfig();

  return {
    bagsConfigured: Boolean(config.bagsApiKey),
    opsWalletConfigured: Boolean(config.kageOpsWallet),
    retentionWalletConfigured: Boolean(config.kageRetentionWallet),
    trackedTokenMints: config.trackedTokenMints,
    defaultAdminWallet: config.defaultAdminWallet
  };
}
