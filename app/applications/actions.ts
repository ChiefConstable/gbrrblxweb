"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getViewer } from "@/auth";
import { getJobBySlug } from "@/lib/jobs";
import { createApplication, respondToOffer, withdrawApplication } from "@/lib/applications";

export type ApplyState = { error?: string; values?: Record<string, string> };

const str = (fd: FormData, key: string, max = 2000) => String(fd.get(key) ?? "").trim().slice(0, max);

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const slug = str(formData, "slug", 200);
  const viewer = await getViewer();
  if (!viewer?.provider || !viewer.providerAccountId) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/jobs/${slug}/apply`)}`);
  }

  const values = {
    first_name: str(formData, "first_name", 80),
    last_name: str(formData, "last_name", 80),
    email: str(formData, "email", 200),
    discord_username: str(formData, "discord_username", 80),
    experience: str(formData, "experience"),
    motivation: str(formData, "motivation"),
    availability: str(formData, "availability", 500),
  };

  // Honeypot: real people never fill this hidden field
  if (str(formData, "website")) return { error: "Something went wrong. Please try again.", values };

  if (!values.first_name || !values.last_name) return { error: "Please enter your first and last name.", values };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return { error: "Please enter a valid email address.", values };
  if (values.motivation.length < 20) return { error: "Please tell us a bit more about why you want this role.", values };
  if (formData.get("age_confirmed") !== "on") return { error: "You need to be 13 or over to apply.", values };

  const job = await getJobBySlug(slug);
  if (!job) return { error: "This vacancy is no longer open.", values };

  const result = await createApplication(
    { provider: viewer.provider, providerAccountId: viewer.providerAccountId, username: viewer.name },
    { slug: job.slug, title: job.title, location: job.location },
    { ...values, discord_username: values.discord_username || null, age_confirmed: true },
  );
  if (!result.ok) return { error: result.error, values };

  revalidatePath("/applications");
  redirect(`/applications/${result.application.id}?submitted=1`);
}

async function applicant() {
  const viewer = await getViewer();
  if (!viewer?.provider || !viewer.providerAccountId) redirect("/signin?callbackUrl=/applications");
  return { provider: viewer.provider, providerAccountId: viewer.providerAccountId };
}

export async function acceptOffer(formData: FormData) {
  const id = str(formData, "id", 64);
  const ok = await respondToOffer(id, await applicant(), true);
  redirect(`/applications/${id}?${ok ? "accepted=1" : "error=1"}`);
}

export async function declineOffer(formData: FormData) {
  const id = str(formData, "id", 64);
  const ok = await respondToOffer(id, await applicant(), false);
  redirect(`/applications/${id}?${ok ? "declined=1" : "error=1"}`);
}

export async function withdraw(formData: FormData) {
  const id = str(formData, "id", 64);
  const ok = await withdrawApplication(id, await applicant());
  redirect(`/applications/${id}?${ok ? "withdrawn=1" : "error=1"}`);
}
