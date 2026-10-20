"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/guards";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalise, type JobRow } from "@/lib/jobs";
import { notifySubscribers } from "@/lib/alerts";
import { JOB_STATUSES } from "@/lib/adminJobs";
import { NEEDS_SCHEDULE, STATUSES, setApplicationStatus, type ApplicationStatus } from "@/lib/applications";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function refreshJobPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/jobs");
  if (slug) revalidatePath(`/jobs/${slug}`);
  revalidatePath("/admin");
}

export async function saveJob(formData: FormData) {
  await assertAdmin();
  const db = getSupabaseAdmin();
  if (!db) redirect("/admin?error=supabase");

  const id = str(formData, "id");
  const title = str(formData, "title");
  const location = str(formData, "location");
  if (!title || !location) redirect(`/admin/jobs/${id || "new"}?error=missing`);

  const status = str(formData, "status");
  const fields = {
    title,
    slug: slugify(str(formData, "slug") || `${title}-${location}`),
    location,
    division: str(formData, "division"),
    region: str(formData, "region"),
    category: str(formData, "category"),
    grade: str(formData, "grade"),
    contract_type: str(formData, "contract_type") || "Permanent",
    employment_type: str(formData, "employment_type") || "Full Time",
    closing_date: str(formData, "closing_date") || null,
    pay: str(formData, "pay") || null,
    description: str(formData, "description") || null,
    responsibilities: lines(formData, "responsibilities"),
    requirements: lines(formData, "requirements"),
    status: (JOB_STATUSES as readonly string[]).includes(status) ? status : "draft",
  };

  let previousStatus: string | null = null;
  let saved: (JobRow & { status: string }) | null = null;

  if (id) {
    const { data: prev } = await db.from("jobs").select("status").eq("id", id).maybeSingle();
    previousStatus = prev?.status ?? null;
    const { data, error } = await db.from("jobs").update(fields).eq("id", id).select("*").single();
    if (error) redirect(`/admin/jobs/${id}?error=${encodeURIComponent(error.message)}`);
    saved = data;
  } else {
    const { data, error } = await db
      .from("jobs")
      .insert({ ...fields, posted_at: new Date().toISOString() })
      .select("*")
      .single();
    if (error) redirect(`/admin/jobs/new?error=${encodeURIComponent(error.message)}`);
    saved = data;
  }

  let notified = 0;
  if (saved && saved.status === "published" && previousStatus !== "published") {
    notified = await notifySubscribers(normalise(saved));
  }

  refreshJobPages(saved?.slug);
  redirect(`/admin?saved=${encodeURIComponent(title)}&notified=${notified}`);
}

export async function setJobStatus(formData: FormData) {
  await assertAdmin();
  const db = getSupabaseAdmin();
  if (!db) redirect("/admin?error=supabase");
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!(JOB_STATUSES as readonly string[]).includes(status)) redirect("/admin");

  const { data: prev } = await db.from("jobs").select("status").eq("id", id).maybeSingle();
  const updates: Record<string, unknown> = { status };
  // Republishing a job bumps it to the top of the list
  if (status === "published" && prev?.status !== "published") updates.posted_at = new Date().toISOString();
  const { data } = await db.from("jobs").update(updates).eq("id", id).select("*").single();

  let notified = 0;
  if (data && status === "published" && prev?.status !== "published") notified = await notifySubscribers(normalise(data));
  refreshJobPages(data?.slug);
  redirect(`/admin?updated=${encodeURIComponent(data?.title ?? "Job")}&notified=${notified}`);
}

export async function deleteJob(formData: FormData) {
  await assertAdmin();
  const db = getSupabaseAdmin();
  if (!db) redirect("/admin?error=supabase");
  const id = str(formData, "id");
  const { data } = await db.from("jobs").delete().eq("id", id).select("slug, title").maybeSingle();
  refreshJobPages(data?.slug);
  redirect(`/admin?deleted=${encodeURIComponent(data?.title ?? "Job")}`);
}

/** Converts a datetime-local value ("2026-10-25T19:00") in UK time to an ISO timestamp. */
function londonLocalToIso(local: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null;
  const asUtc = new Date(`${local}:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(asUtc);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const londonAsUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  const offset = londonAsUtc - asUtc.getTime(); // London minus UTC
  return new Date(asUtc.getTime() - offset).toISOString();
}

export async function updateApplication(formData: FormData) {
  await assertAdmin();
  const id = str(formData, "id");
  const status = str(formData, "status") as ApplicationStatus;
  if (!STATUSES.includes(status)) redirect(`/admin/applications/${id}?error=status`);

  const scheduled = NEEDS_SCHEDULE.includes(status)
    ? { at: londonLocalToIso(str(formData, "interview_at")), location: str(formData, "interview_location") || null }
    : undefined;
  if (scheduled && !scheduled.at) redirect(`/admin/applications/${id}?error=time`);

  const result = await setApplicationStatus(id, status, str(formData, "note") || null, scheduled);
  if (!result.ok) redirect(`/admin/applications/${id}?error=${encodeURIComponent(result.error)}`);

  revalidatePath("/admin/applications");
  redirect(`/admin/applications/${id}?updated=1&emailed=${result.emailed ? 1 : 0}`);
}
