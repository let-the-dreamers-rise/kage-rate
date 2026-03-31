import { NextResponse } from "next/server";
import { getAdminWalletTokenMints, getLiveTokenOverview } from "@/lib/kage-live";
import { getRuntimeConfig } from "@/lib/runtime-config";

export async function GET(request: Request) {
  try {
    const config = getRuntimeConfig();
    const url = new URL(request.url);
    const explicitTokenMint = url.searchParams.get("tokenMint");
    const explicitTokenMints = (url.searchParams.get("tokenMints") ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    const adminWallet = url.searchParams.get("adminWallet");

    let tokenMints = [...config.trackedTokenMints, ...explicitTokenMints];

    if (explicitTokenMint) {
      tokenMints.unshift(explicitTokenMint);
    }

    if (adminWallet) {
      const adminTokenMints = await getAdminWalletTokenMints(adminWallet);
      tokenMints = [...adminTokenMints, ...tokenMints];
    }

    tokenMints = [...new Set(tokenMints)].slice(0, 5);

    const results = await Promise.allSettled(tokenMints.map((tokenMint) => getLiveTokenOverview(tokenMint)));

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      tokens: results
        .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof getLiveTokenOverview>>> => result.status === "fulfilled")
        .map((result) => result.value),
      errors: results
        .filter((result): result is PromiseRejectedResult => result.status === "rejected")
        .map((result) => result.reason instanceof Error ? result.reason.message : "Unknown Bags API error")
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load Bags tokens"
      },
      { status: 500 }
    );
  }
}
