import { NextResponse } from "next/server";
import { getRuntimeHealth } from "@/lib/kage-live";

export async function GET() {
  const health = await getRuntimeHealth();

  return NextResponse.json({ generatedAt: new Date().toISOString(), ...health });
}
