import { NextResponse, type NextRequest } from "next/server";
import { confirmSubscription } from "@/lib/alerts";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const ok = await confirmSubscription(token);
  return NextResponse.redirect(new URL(`/alerts?status=${ok ? "confirmed" : "invalid"}`, req.url));
}
