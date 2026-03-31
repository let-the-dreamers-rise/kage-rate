import { NextResponse } from "next/server";
import { getLiveTokenOverview } from "@/lib/kage-live";

type TokenRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_: Request, { params }: TokenRouteProps) {
  const { slug } = await params;
  const tokenMint = decodeURIComponent(slug);

  try {
    const overview = await getLiveTokenOverview(tokenMint);
    return NextResponse.json(overview);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Token not found" },
      { status: 404 }
    );
  }
}
