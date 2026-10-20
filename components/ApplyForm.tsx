"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitApplication, type ApplyState } from "@/app/applications/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-pill px-12 py-3 text-sm disabled:opacity-60">
      {pending ? "Submitting…" : "Submit application"}
    </button>
  );
}

const label = "mb-1 block text-sm font-semibold text-brand-heading";

export default function ApplyForm({
  slug,
  defaultName,
  defaultEmail,
  isDiscord,
}: {
  slug: string;
  defaultName: string;
  defaultEmail: string;
  isDiscord: boolean;
}) {
  const [state, action] = useActionState<ApplyState, FormData>(submitApplication, {});
  const v = state.values ?? {};

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="slug" value={slug} />
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error && (
        <p role="alert" className="rounded-sm bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className={label}>First name *</label>
          <input id="first_name" name="first_name" required autoComplete="given-name" defaultValue={v.first_name ?? defaultName} className="field" />
        </div>
        <div>
          <label htmlFor="last_name" className={label}>Last name or initial *</label>
          <input id="last_name" name="last_name" required autoComplete="family-name" defaultValue={v.last_name} className="field" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>Email *</label>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue={v.email ?? defaultEmail} className="field" />
          <p className="mt-1 text-xs text-gray-500">We&apos;ll send updates about your application here.</p>
        </div>
        <div>
          <label htmlFor="discord_username" className={label}>Discord username {isDiscord ? "" : "(optional)"}</label>
          <input id="discord_username" name="discord_username" defaultValue={v.discord_username} className="field" placeholder="e.g. railfan123" />
        </div>
      </div>

      <div>
        <label htmlFor="experience" className={label}>Railway roleplay experience</label>
        <textarea
          id="experience"
          name="experience"
          rows={4}
          defaultValue={v.experience}
          className="field leading-6"
          placeholder="Other groups or games you've played, roles you've held. It's fine if this is your first time."
        />
      </div>

      <div>
        <label htmlFor="motivation" className={label}>Why do you want this role? *</label>
        <textarea id="motivation" name="motivation" rows={5} required minLength={20} defaultValue={v.motivation} className="field leading-6" />
      </div>

      <div>
        <label htmlFor="availability" className={label}>When are you usually available?</label>
        <input
          id="availability"
          name="availability"
          defaultValue={v.availability}
          className="field"
          placeholder="e.g. Weekday evenings after 6pm, Saturday afternoons"
        />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="age_confirmed" required className="mt-1 h-4 w-4 accent-brand-green" />
        <span>I&apos;m 13 or over, and I agree to follow the GBR community rules and the Roblox Terms of Use.</span>
      </label>

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
