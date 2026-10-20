// Email sending via Resend (https://resend.com), using its HTTP API directly.
// Needs RESEND_API_KEY and EMAIL_FROM, e.g. EMAIL_FROM="GBR Careers <alerts@yourdomain.com>".
// SITE_URL is used for links in emails, e.g. SITE_URL="https://gbrrblxweb.vercel.app".
// When not configured, emails are skipped and a warning is logged.

export type Email = { to: string; subject: string; html: string; text: string; headers?: Record<string, string> };

export const emailEnabled = () => Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);

export function siteUrl() {
  const url =
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  return url.replace(/\/$/, "");
}

/** Sends up to 100 emails per request. Returns how many were accepted. */
export async function sendEmails(emails: Email[]): Promise<number> {
  if (emails.length === 0) return 0;
  if (!emailEnabled()) {
    console.warn(`Email not configured; skipped ${emails.length} email(s).`);
    return 0;
  }

  let sent = 0;
  for (let i = 0; i < emails.length; i += 100) {
    const batch = emails.slice(i, i + 100).map((e) => ({ from: process.env.EMAIL_FROM, ...e }));
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(batch),
    });
    if (res.ok) sent += batch.length;
    else console.error("Resend error", res.status, await res.text());
  }
  return sent;
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Wraps body HTML in a simple branded layout. */
export function layout(title: string, bodyHtml: string, footerHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#374151">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="background:#07352B;padding:20px 28px;color:#ffffff;font-size:22px;font-weight:bold">GBR <span style="font-weight:normal">Careers</span>
<div style="font-size:10px;letter-spacing:2px;color:#a7c4b8;text-transform:uppercase;margin-top:4px">Roblox Community</div></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:20px;color:#0E3B2E">${escape(title)}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:16px 28px;background:#002664;color:#ffffff;font-size:11px;line-height:16px">${footerHtml}</td></tr>
</table></td></tr></table></body></html>`;
}

export function button(href: string, label: string) {
  return `<p style="margin:24px 0"><a href="${escape(href)}" style="background:#4CB748;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:999px;display:inline-block">${escape(label)}</a></p>`;
}

export { escape as escapeHtml };
