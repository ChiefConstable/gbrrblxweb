import { NextRequest } from "next/server";
import { getLastAuthError, handlers } from "@/auth";

// Discord now adds an `iss` (issuer) parameter to its OAuth callback (RFC 9207).
// Auth.js compares it against a placeholder issuer for non-OpenID providers
// and rejects it with "unexpected iss response parameter value". Discord is
// the only provider that redirects to this callback, so when `iss` is a
// Discord URL we drop it before Auth.js handles the request.
function stripDiscordIssuer(req: NextRequest): NextRequest {
  const url = req.nextUrl;
  if (!url.pathname.endsWith("/callback/discord")) return req;
  const iss = url.searchParams.get("iss");
  if (!iss) return req;
  let host = iss.toLowerCase();
  try {
    host = new URL(iss).hostname.toLowerCase();
  } catch {
    // not a full URL, e.g. a bare hostname: compare the raw value
  }
  if (host !== "discord.com" && !host.endsWith(".discord.com")) return req;

  const cleaned = new URL(url.toString());
  cleaned.searchParams.delete("iss");
  return new NextRequest(cleaned, req);
}

// Temporary troubleshooting aid: when Auth.js redirects to the sign-in page
// with an error, attach the reason it logged during this same request so the
// sign-in page can show it. Remove once sign-in is working reliably.
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
  return withErrorDetail(req, await handlers.GET(stripDiscordIssuer(req)));
}

export async function POST(req: NextRequest) {
  return withErrorDetail(req, await handlers.POST(req));
}
