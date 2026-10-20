"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";

const SELECTS: { name: string; label: string; options: string[] }[] = [
  {
    name: "division",
    label: "Division",
    options: ["Train Crew", "Stations", "Control & Operations", "Engineering", "Head Office"],
  },
  {
    name: "category",
    label: "Job category",
    options: ["Driving", "Customer Service", "Signalling", "Development & Building", "HR & Recruitment", "Events"],
  },
  {
    name: "region",
    label: "Region",
    options: ["London & Thames Valley", "Western", "Wales", "Midlands", "North", "Scotland"],
  },
  {
    name: "employmentType",
    label: "Employment type",
    options: ["Full Time", "Part Time", "Trainee"],
  },
];

export default function JobAlertsForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: send to Supabase (e.g. a `job_alerts` table) once the backend is ready.
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Job alert registration", data);
    setSubmitted(true);
  };

  return (
    <section id="job-alerts" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-20" aria-labelledby="alerts-heading">
      <h2 id="alerts-heading" className="text-center text-3xl sm:text-4xl">
        Register for Job Alerts
      </h2>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-2">
        {submitted ? (
          <div className="rounded-sm border border-brand-green/40 bg-brand-green/10 p-8" role="status">
            <p className="font-heading text-lg font-bold text-brand-heading">Thanks, you&apos;re signed up!</p>
            <p className="mt-2 text-sm leading-7">
              We&apos;ll let you know as soon as a role matching your preferences opens up.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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
              <button type="submit" className="btn-pill px-12 py-3">
                Submit
              </button>
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
