import { getRuntimeConfig } from "@/lib/runtime-config";

const BAGS_BASE_URL = "https://public-api-v2.bags.fm/api/v1";

type BagsEnvelope<T> = {
  success: boolean;
  response: T;
  error?: string;
};

export type BagsCreator = {
  username?: string | null;
  pfp?: string | null;
  royaltyBps: number;
  isCreator: boolean;
  wallet: string;
  provider?: string | null;
  providerUsername?: string | null;
  twitterUsername?: string | null;
  bagsUsername?: string | null;
  isAdmin?: boolean | null;
};

export type BagsClaimStat = {
  username?: string | null;
  pfp?: string | null;
  royaltyBps: number;
  isCreator: boolean;
  wallet: string;
  totalClaimed: string;
  provider?: string | null;
  providerUsername?: string | null;
  twitterUsername?: string | null;
  bagsUsername?: string | null;
  isAdmin?: boolean | null;
};

export type BagsClaimEvent = {
  wallet: string;
  isCreator: boolean;
  amount: string;
  signature: string;
  timestamp: string | number;
};

export type BagsClaimablePosition = {
  baseMint: string;
  totalClaimableLamportsUserShare: number | string;
  claimableDisplayAmount?: number | string;
  user: string;
};

export type BagsAdminListResponse = {
  tokenMints: string[];
};

export type BagsClaimTransactionsResponse = Array<{
  tx: string;
  blockhash: {
    blockhash: string;
    lastValidBlockHeight: number;
  };
}>;

export type BagsUpdateConfigResponse = {
  transactions: Array<{
    transaction: string;
    blockhash: {
      blockhash: string;
      lastValidBlockHeight: number;
    };
  }>;
};

export class MissingBagsApiKeyError extends Error {
  constructor() {
    super("BAGS_API_KEY is not configured");
    this.name = "MissingBagsApiKeyError";
  }
}

async function bagsFetch<T>(
  path: string,
  init?: {
    method?: "GET" | "POST";
    query?: Record<string, string | number | undefined>;
    body?: unknown;
  }
) {
  const { bagsApiKey } = getRuntimeConfig();

  if (!bagsApiKey) {
    throw new MissingBagsApiKeyError();
  }

  const url = new URL(`${BAGS_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(init?.query ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": bagsApiKey
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store"
  });

  const json = (await response.json().catch(() => null)) as BagsEnvelope<T> | null;

  if (!response.ok || !json?.success) {
    throw new Error(json?.error ?? `Bags API request failed for ${path} (${response.status})`);
  }

  return json.response;
}

export async function getTokenCreators(tokenMint: string) {
  return bagsFetch<BagsCreator[]>("/token-launch/creator/v3", {
    query: { tokenMint }
  });
}

export async function getTokenLifetimeFees(tokenMint: string) {
  return bagsFetch<string>("/token-launch/lifetime-fees", {
    query: { tokenMint }
  });
}

export async function getTokenClaimStats(tokenMint: string) {
  return bagsFetch<BagsClaimStat[]>("/token-launch/claim-stats", {
    query: { tokenMint }
  });
}

export async function getTokenClaimEvents(tokenMint: string, limit = 10) {
  const response = await bagsFetch<{ events: BagsClaimEvent[] }>("/fee-share/token/claim-events", {
    query: {
      tokenMint,
      mode: "offset",
      limit,
      offset: 0
    }
  });

  return response.events;
}

export async function getClaimablePositions(wallet: string) {
  return bagsFetch<BagsClaimablePosition[]>("/token-launch/claimable-positions", {
    query: { wallet }
  });
}

export async function getFeeShareAdminList(wallet: string) {
  return bagsFetch<BagsAdminListResponse>("/fee-share/admin/list", {
    query: { wallet }
  });
}

export async function getClaimTransactions(tokenMint: string, feeClaimer: string) {
  return bagsFetch<BagsClaimTransactionsResponse>("/token-launch/claim-txs/v3", {
    method: "POST",
    body: {
      tokenMint,
      feeClaimer
    }
  });
}

export async function createFeeShareAdminUpdateConfig(input: {
  baseMint: string;
  payer: string;
  claimersArray: string[];
  basisPointsArray: number[];
}) {
  return bagsFetch<BagsUpdateConfigResponse>("/fee-share/admin/update-config", {
    method: "POST",
    body: {
      baseMint: input.baseMint,
      payer: input.payer,
      claimersArray: input.claimersArray,
      basisPointsArray: input.basisPointsArray
    }
  });
}
