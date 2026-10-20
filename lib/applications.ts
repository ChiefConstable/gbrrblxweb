import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { button, escapeHtml, layout, sendEmails, siteUrl } from "@/lib/email";

// Applications live in the `applications` table (see supabase/schema.sql).
// Status flow:  submitted -> assessment -> group_interview -> interview -> offered -> accepted
//               Admins can skip stages, and move any open application to unsuccessful.
//               offered -> declined (applicant turns it down)
//               any stage before an offer -> withdrawn (applicant)

export const STATUSES = [
  "submitted",
  "assessment",
  "group_interview",
  "interview",
  "offered",
  "accepted",
  "declined",
  "unsuccessful",
  "withdrawn",
] as const;
export const OPEN_STATUSES: ApplicationStatus[] = ["submitted", "assessment", "group_interview", "interview", "offered"];
const WITHDRAWABLE: ApplicationStatus[] = ["submitted", "assessment", "group_interview", "interview"];
export const NEEDS_SCHEDULE: ApplicationStatus[] = ["group_interview", "interview"];
export type ApplicationStatus = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  submitted: "Application received",
  assessment: "Assessment",
  group_interview: "Group interview",
  interview: "Interview",
  offered: "Offer made",
  accepted: "Offer accepted",
  declined: "Offer declined",
  unsuccessful: "Unsuccessful",
  withdrawn: "Withdrawn",
};

export const STATUS_STYLE: Record<ApplicationStatus, string> = {
  submitted: "bg-gray-100 text-gray-700",
  assessment: "bg-blue-50 text-blue-700",
  group_interview: "bg-indigo-50 text-indigo-700",
  interview: "bg-violet-50 text-violet-700",
  offered: "bg-amber-50 text-amber-800",
  accepted: "bg-brand-green/15 text-brand-dark",
  declined: "bg-gray-100 text-gray-500",
  unsuccessful: "bg-red-50 text-red-700",
  withdrawn: "bg-gray-100 text-gray-500",
};

export type Application = {
  id: string;
  reference: number;
  job_slug: string;
  job_title: string;
  job_location: string;
  provider: string;
  provider_account_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  discord_username: string | null;
  age_confirmed: boolean;
  experience: string;
  motivation: string;
  availability: string;
  status: ApplicationStatus;
  admin_note: string | null;
  interview_at: string | null;
  interview_location: string | null;
  created_at: string;
  updated_at: string;
};

export const formatReference = (n: number) => `GBR-${n}`;
const applicationUrl = (id: string) => `${siteUrl()}/applications/${id}`;

const SELECT = "*";

export type Applicant = { provider: string; providerAccountId: string; username: string };

export async function createApplication(
  applicant: Applicant,
  job: { slug: string; title: string; location: string },
  form: {
    first_name: string;
    last_name: string;
    email: string;
    discord_username: string | null;
    age_confirmed: boolean;
    experience: string;
    motivation: string;
    availability: string;
  },
): Promise<{ ok: true; application: Application } | { ok: false; error: string }> {
  const db = getSupabaseAdmin();
  if (!db) return { ok: false, error: "Applications aren't switched on yet. Please try again later." };

  // One open application per role per person
  const { data: existing } = await db
    .from("applications")
    .select("id, status")
    .eq("job_slug", job.slug)
    .eq("provider", applicant.provider)
    .eq("provider_account_id", applicant.providerAccountId)
    .in("status", OPEN_STATUSES)
    .maybeSingle();
  if (existing) return { ok: false, error: "You already have an open application for this role." };

  const { data, error } = await db
    .from("applications")
    .insert({
      job_slug: job.slug,
      job_title: job.title,
      job_location: job.location,
      provider: applicant.provider,
      provider_account_id: applicant.providerAccountId,
      username: applicant.username,
      ...form,
      email: form.email.trim().toLowerCase(),
      status: "submitted",
    })
    .select(SELECT)
    .single<Application>();
  if (error || !data) {
    console.error("application insert failed", error?.message);
    return { ok: false, error: "Something went wrong saving your application. Please try again." };
  }

  await sendStatusEmail(data);
  return { ok: true, application: data };
}

export async function listApplicationsForApplicant(applicant: Omit<Applicant, "username">): Promise<Application[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data } = await db
    .from("applications")
    .select(SELECT)
    .eq("provider", applicant.provider)
    .eq("provider_account_id", applicant.providerAccountId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Application[];
}

export async function listAllApplications(status?: ApplicationStatus): Promise<Application[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  let q = db.from("applications").select(SELECT).order("created_at", { ascending: false }).limit(500);
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []) as Application[];
}

export async function getApplication(id: string): Promise<Application | null> {
  const db = getSupabaseAdmin();
  if (!db || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await db.from("applications").select(SELECT).eq("id", id).maybeSingle<Application>();
  return data ?? null;
}

/** Changes status, saves an optional note and interview details, and emails the applicant. */
export async function setApplicationStatus(
  id: string,
  status: ApplicationStatus,
  note: string | null,
  schedule?: { at: string | null; location: string | null },
) {
  const db = getSupabaseAdmin();
  if (!db) return { ok: false as const, error: "Supabase isn't configured." };
  const update: Record<string, unknown> = { status, admin_note: note || null, updated_at: new Date().toISOString() };
  if (NEEDS_SCHEDULE.includes(status)) {
    update.interview_at = schedule?.at || null;
    update.interview_location = schedule?.location || null;
  }
  const { data, error } = await db
    .from("applications")
    .update(update)
    .eq("id", id)
    .select(SELECT)
    .single<Application>();
  if (error || !data) return { ok: false as const, error: error?.message ?? "Not found" };
  const emailed = await sendStatusEmail(data);
  return { ok: true as const, emailed: emailed > 0 };
}

// ---------- Emails ----------

const FOOTER =
  "This is an automated message from GBR Careers, an unofficial Roblox railway community. We're not affiliated with Great British Railways. Please don't reply to this email; contact the Recruitment Team in the GBR Discord server instead.";

function p(text: string) {
  return `<p style="line-height:24px;margin:0 0 14px">${text}</p>`;
}

export function formatInterviewTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  });
}

function scheduleBlock(a: Application) {
  if (!NEEDS_SCHEDULE.includes(a.status) || (!a.interview_at && !a.interview_location)) return "";
  const rows = [
    a.interview_at ? ["When", formatInterviewTime(a.interview_at)] : null,
    a.interview_location ? ["Where", a.interview_location] : null,
  ].filter(Boolean) as [string, string][];
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;border:1px solid #e5e7eb;width:100%">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 16px;font-weight:bold;color:#0E3B2E;width:70px">${k}</td><td style="padding:10px 16px">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;
}

function noteBlock(note: string | null) {
  if (!note) return "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 18px"><tr><td style="border-left:4px solid #4CB748;background:#f3f4f6;padding:12px 16px;line-height:22px;white-space:pre-line">${escapeHtml(note)}</td></tr></table>`;
}

function buildEmail(a: Application): { subject: string; title: string; paragraphs: string[]; cta?: [string, string] } | null {
  const role = `<strong>${escapeHtml(a.job_title)}</strong>`;
  const ref = formatReference(a.reference);
  switch (a.status) {
    case "submitted":
      return {
        subject: `Thanks for applying: ${a.job_title}, reference ${ref}`,
        title: "We've got your application",
        paragraphs: [
          `Thanks for applying for ${role} (${escapeHtml(a.job_location)}). Your reference is <strong>${ref}</strong>.`,
          "Our Recruitment Team reviews applications in the order they arrive. We'll email you at each step, so keep an eye on your inbox, including your spam or junk folder.",
          "You can check where your application is up to at any time.",
        ],
        cta: [applicationUrl(a.id), "View my application"],
      };
    case "assessment":
      return {
        subject: `The next stage of your ${a.job_title} application (${ref})`,
        title: "You're through to the next stage",
        paragraphs: [
          `Good news: your application for ${role} has moved on to our assessment stage.`,
          "This is a short quiz on GBR basics and the rulebook. Details are below. Please complete it within 48 hours if you can.",
        ],
        cta: [applicationUrl(a.id), "View my application"],
      };
    case "group_interview":
      return {
        subject: `Group interview invitation: ${a.job_title} (${ref})`,
        title: "You're invited to a group interview",
        paragraphs: [
          `Thanks for completing the earlier stages for ${role}. We'd like to invite you to a group interview.`,
          "You'll take part in a short roleplay exercise with other applicants while our team observes. It's relaxed, so just be yourself and work together.",
        ],
        cta: [applicationUrl(a.id), "View interview details"],
      };
    case "interview":
      return {
        subject: `Interview invitation: ${a.job_title} (${ref})`,
        title: "You're invited to an interview",
        paragraphs: [
          `We'd like to invite you to a one-to-one interview for ${role}.`,
          "It'll take about 15 minutes. We'll ask about your experience in the community and how you'd handle a few situations on the railway.",
          "If you can't make this time, contact the Recruitment Team on Discord before the interview.",
        ],
        cta: [applicationUrl(a.id), "View interview details"],
      };
    case "offered":
      return {
        subject: `You've been offered the role: ${a.job_title} (${ref})`,
        title: "Congratulations, we'd like to offer you the role",
        paragraphs: [
          `We're delighted to offer you the role of ${role} in the GBR community.`,
          "Please accept or decline the offer using the button below. If we don't hear from you within 7 days, the offer may be passed to another applicant.",
        ],
        cta: [applicationUrl(a.id), "Respond to my offer"],
      };
    case "accepted":
      return {
        subject: `Welcome to GBR: ${a.job_title}`,
        title: "Welcome aboard",
        paragraphs: [
          `Thanks for accepting the role of ${role}. We're really pleased to have you on the team.`,
          "Your mentor will be in touch on the GBR Discord server to arrange your first training session. Make sure you've joined the server and your direct messages are open.",
        ],
        cta: [applicationUrl(a.id), "View my application"],
      };
    case "unsuccessful":
      return {
        subject: `Your application for ${a.job_title}, reference ${ref}`,
        title: "An update on your application",
        paragraphs: [
          `Thank you for applying for ${role}. We appreciate the time you put into your application.`,
          "Unfortunately, you haven't been successful on this occasion. You're welcome to apply for other roles straight away, or for this role again after 30 days.",
          "We wish you the best and hope to see you around the network.",
        ],
        cta: [`${siteUrl()}/jobs`, "See other vacancies"],
      };
    default:
      return null; // declined and withdrawn don't send emails
  }
}

export async function sendStatusEmail(a: Application): Promise<number> {
  const e = buildEmail(a);
  if (!e) return 0;
  const name = escapeHtml(a.first_name);
  const body =
    p(`Dear ${name},`) +
    e.paragraphs.map(p).join("") +
    scheduleBlock(a) +
    noteBlock(a.admin_note) +
    (e.cta ? button(e.cta[0], e.cta[1]) : "") +
    p("Kind regards,<br><strong>GBR Recruitment Team</strong>");

  const text = [
    `Dear ${a.first_name},`,
    "",
    ...e.paragraphs.map((x) => x.replace(/<[^>]+>/g, "")),
    a.interview_at && NEEDS_SCHEDULE.includes(a.status) ? `When: ${formatInterviewTime(a.interview_at)}` : "",
    a.interview_location && NEEDS_SCHEDULE.includes(a.status) ? `Where: ${a.interview_location}` : "",
    a.admin_note ? `\n${a.admin_note}\n` : "",
    e.cta ? `${e.cta[1]}: ${e.cta[0]}` : "",
    "",
    "Kind regards,",
    "GBR Recruitment Team",
  ].join("\n");

  return sendEmails([{ to: a.email, subject: e.subject, html: layout(e.title, body, FOOTER), text }]);
}

/** Applicant responds to their own offer. */
export async function respondToOffer(id: string, applicant: Omit<Applicant, "username">, accept: boolean) {
  const db = getSupabaseAdmin();
  if (!db) return false;
  const { data, error } = await db
    .from("applications")
    .update({ status: accept ? "accepted" : "declined", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("provider", applicant.provider)
    .eq("provider_account_id", applicant.providerAccountId)
    .eq("status", "offered")
    .select(SELECT)
    .maybeSingle<Application>();
  if (error || !data) return false;
  await sendStatusEmail(data);
  return true;
}

/** Applicant withdraws an application that hasn't reached an offer yet. */
export async function withdrawApplication(id: string, applicant: Omit<Applicant, "username">) {
  const db = getSupabaseAdmin();
  if (!db) return false;
  const { data, error } = await db
    .from("applications")
    .update({ status: "withdrawn", updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("provider", applicant.provider)
    .eq("provider_account_id", applicant.providerAccountId)
    .in("status", WITHDRAWABLE)
    .select("id");
  return !error && (data?.length ?? 0) > 0;
}
