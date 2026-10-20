import type { NextRequest } from "next/server";
import { getLastAuthError, handlers } from "@/auth";

// Temporary troubleshooting aid: when Auth.js redirects to the sign-in page
// with an error, attach the reason it logged during this same request so the
// sign-in page can show it. Remove once sign-in is working.
function withErrorDetail(req: NextRequest, res: Response): Response {
  const location = res.headers.get("location");
  if (!location || !location.includes("error=")) return res;
  const e = getLastAuthError();
  if (!e || Date.now() - e.at > 10_000) return res;

  const url = new URL(location, req.url);
  url.searchParams.set("detail", `${e.type}: ${e.message}${e.cause ? ` | ${e.cause}` : ""}`.slice(0, 400));
  const headers = new Headers(res.headers);
  headers.set("location", url.toString());
  return new Response(res.body, { status: res.status, headers });
}

export async function GET(req: NextRequest) {
  return withErrorDetail(req, await handlers.GET(req));
}

export async function POST(req: NextRequest) {
  return withErrorDetail(req, await handlers.POST(req));
}
