import { NextResponse } from "next/server";
import { createLiveInstallPreview } from "@/lib/kage-live";
import type { InstallPreviewRequest } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as InstallPreviewRequest | null;

    if (!body?.tokenMint || !body?.creatorWallet) {
      return NextResponse.json(
        {
          error: "tokenMint and creatorWallet are required"
        },
        { status: 400 }
      );
    }

    const preview = await createLiveInstallPreview(body);
    const totalBps = preview.recipients.reduce((sum, recipient) => sum + recipient.bps, 0);

    if (totalBps !== 10000) {
      return NextResponse.json(
        {
          error: "Shares must total 10,000 bps",
          preview
        },
        { status: 422 }
      );
    }

    return NextResponse.json(preview);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate install preview"
      },
      { status: 500 }
    );
  }
}
