import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { button, emailEnabled, escapeHtml, layout, sendEmails, siteUrl, type Email } from "@/lib/email";
import type { Job } from "@/lib/jobs";

// Job alert subscribers live in the `job_alerts` table (see supabase/schema.sql).
// Sign-ups are double opt-in: nobody gets alerts until they click the link in
// the confirmation email.

export type AlertPrefs = {
  division: string | null;
  category: string | null;
  region: string | null;
  employment_type: string | null;
};

type Subscriber = AlertPrefs & {
  id: string;
  email: string;
  first_name: string;
  token: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
};

export type SubscribeResult =
  | { ok: true; status: "confirm_sent" | "updated" | "saved_no_email" }
  | { ok: false; error: string };

const unsubscribeUrl = (token: string) => `${siteUrl()}/alerts/unsubscribe?token=${token}`;
const confirmUrl = (token: string) => `${siteUrl()}/alerts/confirm?token=${token}`;

function footer(token: string) {
  return `You're getting this because you signed up for GBR Careers job alerts. GBR is an unofficial Roblox community, not affiliated with Great British Railways.<br><a href="${unsubscribeUrl(token)}" style="color:#ffffff">Unsubscribe</a>`;
}

export async function subscribe(input: { firstName: string; lastName: string; email: string } & AlertPrefs): Promise<SubscribeResult> {
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, error: "Job alerts aren't switched on yet. Please try again later." };

  const email = input.email.trim().toLowerCase();
  const prefs: AlertPrefs = {
    division: input.division || null,
    category: input.category || null,
    region: input.region || null,
    employment_type: input.employment_type || null,
  };

  const { data: existing, error: findError } = await db
    .from("job_alerts")
    .select("id, email, first_name, token, confirmed_at, unsubscribed_at, division, category, region, employment_type")
    .eq("email", email)
    .maybeSingle<Subscriber>();
  if (findError) {
    console.error("job_alerts lookup failed", findError.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  // Already confirmed and active: just update their preferences
  if (existing?.confirmed_at && !existing.unsubscribed_at) {
    const { error } = await db
      .from("job_alerts")
      .update({ ...prefs, first_name: input.firstName, last_name: input.lastName })
      .eq("id", existing.id);
    if (error) return { ok: false, error: "Something went wrong. Please try again." };
    return { ok: true, status: "updated" };
  }

  const row = {
    email,
    first_name: input.firstName,
    last_name: input.lastName,
    ...prefs,
    token: crypto.randomUUID(),
    confirmed_at: null,
    unsubscribed_at: null,
  };
  const { error: saveError } = await db.from("job_alerts").upsert(row, { onConflict: "email" });
  if (saveError) {
    console.error("job_alerts save failed", saveError.message);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  if (!emailEnabled()) return { ok: true, status: "saved_no_email" };

  await sendEmails([
    {
      to: email,
      subject: "Confirm your GBR Careers job alerts",
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl(row.token)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      text: `Hi ${input.firstName},\n\nPlease confirm your GBR Careers job alerts by opening this link:\n${confirmUrl(row.token)}\n\nIf you didn't sign up, ignore this email and you won't hear from us.`,
      html: layout(
        "Confirm your job alerts",
        `<p style="line-height:24px">Hi ${escapeHtml(input.firstName)},</p>
<p style="line-height:24px">Thanks for signing up. Click below to confirm and we'll email you when a matching role opens in the GBR community.</p>
${button(confirmUrl(row.token), "Confirm my alerts")}
<p style="line-height:20px;font-size:12px;color:#6b7280">If you didn't sign up, ignore this email and you won't hear from us.</p>`,
        footer(row.token),
      ),
    },
  ]);
  return { ok: true, status: "confirm_sent" };
}

export async function confirmSubscription(token: string): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db || !isUuid(token)) return false;
  const { data, error } = await db
    .from("job_alerts")
    .update({ confirmed_at: new Date().toISOString(), unsubscribed_at: null })
    .eq("token", token)
    .select("id");
  return !error && (data?.length ?? 0) > 0;
}

export async function unsubscribe(token: string): Promise<boolean> {
  const db = getSupabaseAdmin();
  if (!db || !isUuid(token)) return false;
  const { data, error } = await db
    .from("job_alerts")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("token", token)
    .select("id");
  return !error && (data?.length ?? 0) > 0;
}

const matches = (pref: string | null, value: string) => !pref || pref === value;

/** Emails every confirmed subscriber whose preferences match this job. Returns the number sent. */
export async function notifySubscribers(job: Job): Promise<number> {
  const db = getSupabaseAdmin();
  if (!db || !emailEnabled()) return 0;

  const { data, error } = await db
    .from("job_alerts")
    .select("id, email, first_name, token, confirmed_at, unsubscribed_at, division, category, region, employment_type")
    .not("confirmed_at", "is", null)
    .is("unsubscribed_at", null);
  if (error) {
    console.error("job_alerts query failed", error.message);
    return 0;
  }

  const jobUrl = `${siteUrl()}/jobs/${job.slug}`;
  const emails: Email[] = ((data ?? []) as Subscriber[])
    .filter(
      (s) =>
        matches(s.division, job.division) &&
        matches(s.category, job.category) &&
        matches(s.region, job.region) &&
        matches(s.employment_type, job.employment_type),
    )
    .map((s) => ({
      to: s.email,
      subject: `New GBR vacancy: ${job.title}, ${job.location}`,
      headers: { "List-Unsubscribe": `<${unsubscribeUrl(s.token)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      text: `Hi ${s.first_name},\n\nA new role matching your alerts has opened:\n\n${job.title}\n${job.location} · ${job.contract_type} - ${job.employment_type}\n${job.division} · ${job.grade}\n\nView and apply: ${jobUrl}\n\nUnsubscribe: ${unsubscribeUrl(s.token)}`,
      html: layout(
        "A new role matches your alerts",
        `<p style="line-height:24px">Hi ${escapeHtml(s.first_name)},</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb"><tr><td style="padding:16px 20px">
<div style="font-size:16px;font-weight:bold;color:#4CB748">${escapeHtml(job.title)}</div>
<div style="font-size:12px;font-weight:bold;color:#0E3B2E;margin-top:4px">${escapeHtml(job.location)} · ${escapeHtml(job.contract_type)} - ${escapeHtml(job.employment_type)}</div>
<div style="font-size:12px;color:#6b7280;margin-top:4px">${escapeHtml(job.division)} · ${escapeHtml(job.grade)} · ${escapeHtml(job.category)}</div>
</td></tr></table>
${button(jobUrl, "View role")}`,
        footer(s.token),
      ),
    }));

  return sendEmails(emails);
}

const isUuid = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
