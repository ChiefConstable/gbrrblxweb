import crypto from "node:crypto";

// Verifies a Resend webhook (Resend signs webhooks using the Svix scheme).
// Signed content is "<svix-id>.<svix-timestamp>.<raw body>", HMAC-SHA256 with the
// base64 key after the "whsec_" prefix. The svix-signature header holds one or
// more space-separated "v1,<base64 signature>" values.
export function verifyResendWebhook(rawBody: string, headers: Headers, secret: string): boolean {
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signatures = headers.get("svix-signature");
  if (!id || !timestamp || !signatures) return false;

  // Reject anything more than 5 minutes old or in the future (replay protection)
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Math.floor(Date.now() / 1000) - ts) > 300) return false;

  const key = Buffer.from(secret.startsWith("whsec_") ? secret.slice(6) : secret, "base64");
  const expected = crypto.createHmac("sha256", key).update(`${id}.${timestamp}.${rawBody}`).digest("base64");
  const expectedBuf = Buffer.from(expected);

  for (const part of signatures.split(" ")) {
    const [version, sig] = part.split(",");
    if (version !== "v1" || !sig) continue;
    const sigBuf = Buffer.from(sig);
    if (sigBuf.length === expectedBuf.length && crypto.timingSafeEqual(sigBuf, expectedBuf)) return true;
  }
  return false;
}
