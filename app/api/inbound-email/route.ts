import { NextResponse, type NextRequest } from "next/server";
import { verifyResendWebhook } from "@/lib/webhookVerify";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { escapeHtml, layout } from "@/lib/email";

// Receives Resend "inbox.email.received" webhooks and sends an automatic
// acknowledgement in the same thread. Replies by a person are sent from the
// Resend dashboard (resend.com/inboxes) and are never touched by this route.
//
// Needs RESEND_API_KEY and RESEND_WEBHOOK_SECRET in Vercel.

export const dynamic = "force-dynamic";

type ReceivedEvent = {
  type: string;
  data: {
    inbox_id: string;
    thread_id: string;
    email_id: string;
    email?: { direction?: string; from?: string; to?: string[]; subject?: string };
  };
};

// Inboxes that send an automatic reply, keyed by address.
const AUTO_REPLIES: Record<string, (ref: string) => { html: string; text: string }> = {
  "dataprotectionofficer@gbrrblx.xyz": (ref) => {
    const paragraphs = [
      "Thank you for contacting the GBR Careers Data Protection Officer. This is an automatic reply to confirm we've received your email.",
      `Your reference is <strong>${escapeHtml(ref)}</strong>. Please keep it in the subject line if you write to us again about the same matter.`,
      "We'll reply as soon as we can. If you've asked to see, correct or delete your personal information, we'll respond within one month, as required by UK data protection law. We may need to confirm your identity first, for example by asking you to message us from the Roblox or Discord account you used on our site.",
      "Please don't send passwords or other sensitive details by email.",
    ];
    const html = layout(
      "We've received your email",
      paragraphs.map((p) => `<p style="line-height:24px;margin:0 0 14px">${p}</p>`).join("") +
        `<p style="line-height:24px;margin:0">Kind regards,<br><strong>GBR Data Protection Officer</strong></p>`,
      "GBR Careers is an unofficial Roblox railway community and is not affiliated with Great British Railways. This is an automated message.",
    );
    const text = [...paragraphs.map((p) => p.replace(/<[^>]+>/g, "")), "", "Kind regards,", "GBR Data Protection Officer"].join("\n\n");
    return { html, text };
  },
};

const OWN_DOMAIN = "gbrrblx.xyz";
const NO_REPLY = /^(no-?reply|do-?not-?reply|mailer-daemon|postmaster|bounces?|notifications?)([+.-]|@)/i;

function addressOf(from: string | undefined) {
  if (!from) return "";
  const m = from.match(/<([^>]+)>/);
  return (m ? m[1] : from).trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  if (!secret || !apiKey) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const raw = await req.text();
  if (!verifyResendWebhook(raw, req.headers, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: ReceivedEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  if (event.type !== "inbox.email.received" || event.data?.email?.direction === "outbound") {
    return NextResponse.json({ ignored: true });
  }

  const { inbox_id, thread_id, email_id, email } = event.data;
  const inboxAddress = (email?.to ?? []).map(addressOf).find((a) => AUTO_REPLIES[a]);
  if (!inboxAddress) return NextResponse.json({ ignored: "no auto-reply for this inbox" });

  // Loop protection: never auto-reply to ourselves or to automated senders
  const sender = addressOf(email?.from);
  if (!sender || sender.endsWith("@" + OWN_DOMAIN) || NO_REPLY.test(sender)) {
    return NextResponse.json({ ignored: "automated or internal sender" });
  }

  // At most one automatic reply per sender per inbox every 24 hours
  const db = getSupabaseAdmin();
  if (db) {
    const { data: last } = await db
      .from("email_autoreplies")
      .select("last_sent")
      .eq("sender", sender)
      .eq("inbox", inboxAddress)
      .maybeSingle();
    if (last && Date.now() - new Date(last.last_sent).getTime() < 24 * 60 * 60 * 1000) {
      return NextResponse.json({ ignored: "already acknowledged recently" });
    }
  }

  const ref = "DPO-" + thread_id.replace(/-/g, "").slice(0, 8).toUpperCase();
  const { html, text } = AUTO_REPLIES[inboxAddress](ref);
  const res = await fetch(
    `https://api.resend.com/inboxes/${encodeURIComponent(inbox_id)}/threads/${encodeURIComponent(thread_id)}/emails/${encodeURIComponent(email_id)}/reply`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `autoreply-${email_id}`,
      },
      body: JSON.stringify({
        html,
        text,
        headers: { "Auto-Submitted": "auto-replied", "X-Auto-Response-Suppress": "All" },
      }),
    },
  );
  if (!res.ok) {
    console.error("Auto-reply failed", res.status, await res.text());
    // 200 so Resend doesn't keep retrying; the email is still in the inbox for a person to answer
    return NextResponse.json({ sent: false });
  }

  if (db) {
    await db
      .from("email_autoreplies")
      .upsert({ sender, inbox: inboxAddress, last_sent: new Date().toISOString() }, { onConflict: "sender,inbox" });
  }
  return NextResponse.json({ sent: true });
}
