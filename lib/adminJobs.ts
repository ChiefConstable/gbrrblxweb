import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { normalise, type Job, type JobRow } from "@/lib/jobs";

export type AdminJob = Job & { id: string; status: "draft" | "published" | "closed" };

export const JOB_STATUSES = ["draft", "published", "closed"] as const;

export async function listJobsForAdmin(): Promise<AdminJob[]> {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db.from("jobs").select("*").order("posted_at", { ascending: false });
  if (error) {
    console.error("admin jobs query failed", error.message);
    return [];
  }
  return ((data ?? []) as (JobRow & { status: AdminJob["status"] })[]).map((r) => ({
    ...normalise(r),
    id: r.id,
    status: r.status,
  }));
}

export async function getJobForAdmin(id: string): Promise<AdminJob | null> {
  const db = getSupabaseAdmin();
  if (!db || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const { data } = await db.from("jobs").select("*").eq("id", id).maybeSingle();
  if (!data) return null;
  const r = data as JobRow & { status: AdminJob["status"] };
  return { ...normalise(r), id: r.id, status: r.status };
}
