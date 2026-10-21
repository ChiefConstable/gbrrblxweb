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
    roblox_username: str(formData, "roblox_username", 40),
    email: str(formData, "email", 200),
    discord_username: str(formData, "discord_username", 80),
    experience: str(formData, "experience"),
    motivation: str(formData, "motivation"),
    availability: str(formData, "availability", 500),
  };

  // Honeypot: real people never fill this hidden field
  if (str(formData, "website")) return { error: "Something went wrong. Please try again.", values };

  if (!/^[A-Za-z0-9_]{3,20}$/.test(values.roblox_username)) {
    return { error: "Please enter a valid Roblox username (3 to 20 letters, numbers or underscores).", values };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return { error: "Please enter a valid email address.", values };
  if (values.motivation.length < 20) return { error: "Please tell us a bit more about why you want this role.", values };
  if (formData.get("age_confirmed") !== "on") return { error: "You need to be 13 or over to apply.", values };

  const job = await getJobBySlug(slug);
  if (!job) return { error: "This vacancy is no longer open.", values };

  const result = await createApplication(
    { provider: viewer.provider, providerAccountId: viewer.providerAccountId, username: viewer.name },
    { slug: job.slug, title: job.title, location: job.location },
    {
      // The Roblox username is stored in first_name so existing tables, admin pages and emails keep working
      first_name: values.roblox_username,
      last_name: "",
      email: values.email,
      discord_username: values.discord_username || null,
      age_confirmed: true,
      experience: values.experience,
      motivation: values.motivation,
      availability: values.availability,
    },
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
