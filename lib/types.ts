export type Metric = {
  label: string;
  value: string;
  delta: string;
  note: string;
};

export type Agent = {
  name: string;
  status: "Live" | "Needs approval" | "Advisory";
  cadence: string;
  summary: string;
};

export type TokenStatus = "Healthy" | "Watchlist" | "Recovery";

export type SplitRecipient = {
  label: string;
  walletAlias: string;
  bps: number;
  note: string;
};

export type InstallPreviewRequest = {
  tokenMint: string;
  creatorWallet: string;
  approvalMode?: "assisted" | "delegated";
  creatorShare?: number;
  opsShare?: number;
  retentionShare?: number;
};

export type InstallPreviewResponse = {
  tokenMint: string;
  approvalMode: "assisted" | "delegated";
  recipients: SplitRecipient[];
  warnings: string[];
  estimatedJobs: string[];
};

export type LiveRecipient = {
  wallet: string;
  displayName: string;
  royaltyBps: number;
  isCreator: boolean;
  isAdmin: boolean;
  totalClaimed: string;
};

export type LiveClaimEvent = {
  wallet: string;
  isCreator: boolean;
  amount: string;
  signature: string;
  timestamp: string | number;
  timestampLabel: string;
};

export type LiveTokenOverview = {
  tokenMint: string;
  creatorDisplay: string;
  creatorWallet: string | null;
  feeRecipientCount: number;
  creatorClaimableNow: string;
  creatorClaimableLamports: string;
  creatorClaimablePositionCount: number;
  pendingClaimPacketCount: number;
  lifetimeFees: string;
  lifetimeFeesLamports: string;
  claimed7d: string;
  claimed7dLamports: string;
  totalClaimed: string;
  totalClaimedLamports: string;
  status: TokenStatus;
  recipients: LiveRecipient[];
  recentClaimEvents: LiveClaimEvent[];
  summary: string;
};

export type RuntimeHealth = {
  bagsConfigured: boolean;
  opsWalletConfigured: boolean;
  retentionWalletConfigured: boolean;
  trackedTokenMints: string[];
  defaultAdminWallet: string | null;
};
