"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { subscribeToAlerts, type AlertFormState } from "@/app/alerts/actions";
import { CATEGORY_OPTIONS, DIVISION_OPTIONS, EMPLOYMENT_OPTIONS, REGION_OPTIONS } from "@/lib/options";

const SELECTS: { name: string; label: string; options: string[] }[] = [
  { name: "division", label: "Division", options: DIVISION_OPTIONS },
  { name: "category", label: "Job category", options: CATEGORY_OPTIONS },
  { name: "region", label: "Region", options: REGION_OPTIONS },
  { name: "employmentType", label: "Employment type", options: EMPLOYMENT_OPTIONS },
];

const DONE_COPY = {
  confirm_sent: {
    title: "Check your inbox",
    body: "We've sent you an email. Click the link inside to confirm your job alerts.",
  },
  updated: { title: "Preferences updated", body: "Your job alert preferences have been saved." },
  saved_no_email: {
    title: "Thanks, you're signed up!",
    body: "We'll let you know as soon as a role matching your preferences opens up.",
  },
} as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-pill px-12 py-3 disabled:opacity-60">
      {pending ? "Submitting…" : "Submit"}
    </button>
  );
}

export default function JobAlertsForm() {
  const [state, action] = useActionState<AlertFormState, FormData>(subscribeToAlerts, { status: "idle" });
  const done = state.status !== "idle" && state.status !== "error" ? DONE_COPY[state.status] : null;

  return (
    <section id="job-alerts" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-20" aria-labelledby="alerts-heading">
      <h2 id="alerts-heading" className="text-center text-3xl sm:text-4xl">
        Register for Job Alerts
      </h2>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
        {done ? (
          <div className="rounded-sm border border-brand-green/40 bg-brand-green/10 p-8" role="status">
            <p className="font-heading text-lg font-bold text-brand-heading">{done.title}</p>
            <p className="mt-2 text-sm leading-7">{done.body}</p>
          </div>
        ) : (
          <form action={action} className="space-y-5">
            <div className="hidden" aria-hidden="true">
              <input name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {state.status === "error" && (
              <p role="alert" className="rounded-sm bg-red-50 p-3 text-sm text-red-700">
                {state.message}
              </p>
            )}
            <div>
              <p className="font-bold text-brand-heading">
                Be the first to hear about new roles in the GBR community.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Fields marked * are required. We only use your details to send job alerts, and you can
                unsubscribe at any time.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-1 block text-sm font-semibold text-brand-heading">
                  First Name *
                </label>
                <input id="firstName" name="firstName" type="text" autoComplete="given-name" required className="field" />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1 block text-sm font-semibold text-brand-heading">
                  Last Name *
                </label>
                <input id="lastName" name="lastName" type="text" autoComplete="family-name" required className="field" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold text-brand-heading">
                Email *
              </label>
              <input id="email" name="email" type="email" autoComplete="email" required className="field" />
            </div>

            {SELECTS.map((select) => (
              <div key={select.name}>
                <label htmlFor={select.name} className="mb-1 block text-sm font-semibold text-brand-heading">
                  {select.label}
                </label>
                <select id={select.name} name={select.name} defaultValue="" className="field">
                  <option value="">Any {select.label.toLowerCase()}</option>
                  {select.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <div className="pt-2 text-center">
              <SubmitButton />
            </div>
          </form>
        )}

        <div className="relative hidden aspect-[4/5] w-full overflow-hidden rounded-sm bg-gray-200 lg:block">
          <Image
            src="/media/job-alerts.jpg"
            alt="GBR team member on a station platform"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
