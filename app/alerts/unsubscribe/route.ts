import { NextResponse, type NextRequest } from "next/server";
import { unsubscribe } from "@/lib/alerts";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const ok = await unsubscribe(token);
  return NextResponse.redirect(new URL(`/alerts?status=${ok ? "unsubscribed" : "invalid"}`, req.url));
}

// One-click unsubscribe from email apps (List-Unsubscribe-Post)
export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  await unsubscribe(token);
  return new NextResponse(null, { status: 200 });
}
