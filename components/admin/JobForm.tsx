import Link from "next/link";
import { saveJob } from "@/app/admin/actions";
import type { AdminJob } from "@/lib/adminJobs";
import {
  CATEGORY_OPTIONS,
  CONTRACT_OPTIONS,
  DIVISION_OPTIONS,
  EMPLOYMENT_OPTIONS,
  GRADE_OPTIONS,
  REGION_OPTIONS,
} from "@/lib/options";

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-semibold text-brand-heading">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function Select({ name, options, value }: { name: string; options: string[]; value?: string }) {
  const all = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <select id={name} name={name} defaultValue={value ?? options[0]} className="field">
      {all.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export default function JobForm({ job, error }: { job?: AdminJob; error?: string }) {
  return (
    <form action={saveJob} className="mt-8 space-y-6">
      {job && <input type="hidden" name="id" value={job.id} />}

      {error && (
        <p role="alert" className="rounded-sm bg-red-50 p-3 text-sm text-red-700">
          {error === "missing" ? "Title and location are required." : `Couldn't save: ${error}`}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Job title *" htmlFor="title">
          <input id="title" name="title" required defaultValue={job?.title} className="field" />
        </Field>
        <Field label="Location *" htmlFor="location">
          <input id="location" name="location" required defaultValue={job?.location} className="field" placeholder="e.g. Bristol Temple Meads" />
        </Field>
        <Field label="Division" htmlFor="division">
          <Select name="division" options={DIVISION_OPTIONS} value={job?.division} />
        </Field>
        <Field label="Region" htmlFor="region">
          <Select name="region" options={REGION_OPTIONS} value={job?.region} />
        </Field>
        <Field label="Job category" htmlFor="category">
          <Select name="category" options={CATEGORY_OPTIONS} value={job?.category} />
        </Field>
        <Field label="Grade" htmlFor="grade">
          <Select name="grade" options={GRADE_OPTIONS} value={job?.grade} />
        </Field>
        <Field label="Contract" htmlFor="contract_type">
          <Select name="contract_type" options={CONTRACT_OPTIONS} value={job?.contract_type} />
        </Field>
        <Field label="Hours" htmlFor="employment_type">
          <Select name="employment_type" options={EMPLOYMENT_OPTIONS} value={job?.employment_type} />
        </Field>
        <Field label="In-game pay" htmlFor="pay" hint="Leave blank to use the standard rate for the grade">
          <input id="pay" name="pay" defaultValue={job?.pay ?? ""} className="field" placeholder="e.g. 120 credits per shift" />
        </Field>
        <Field label="Closing date" htmlFor="closing_date" hint="Leave blank for 3 weeks after posting">
          <input id="closing_date" name="closing_date" type="date" defaultValue={job?.closing_date?.slice(0, 10) ?? ""} className="field" />
        </Field>
      </div>

      <Field label="About the role" htmlFor="description" hint="Leave blank to use the standard text for the division">
        <textarea id="description" name="description" rows={4} defaultValue={job?.description ?? ""} className="field leading-6" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="What you'll do" htmlFor="responsibilities" hint="One point per line">
          <textarea
            id="responsibilities"
            name="responsibilities"
            rows={6}
            defaultValue={(job?.responsibilities ?? []).join("\n")}
            className="field leading-6"
          />
        </Field>
        <Field label="What we're looking for" htmlFor="requirements" hint="One point per line">
          <textarea
            id="requirements"
            name="requirements"
            rows={6}
            defaultValue={(job?.requirements ?? []).join("\n")}
            className="field leading-6"
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Web address" htmlFor="slug" hint="Leave blank to create one from the title and location">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            /jobs/
            <input id="slug" name="slug" defaultValue={job?.slug} className="field" />
          </div>
        </Field>
        <Field label="Status" htmlFor="status" hint="Publishing emails matching job alert subscribers">
          <select id="status" name="status" defaultValue={job ? job.status : "published"} className="field">
            <option value="published">Published (live on the site)</option>
            <option value="draft">Draft (hidden)</option>
            <option value="closed">Closed (hidden)</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
        <button type="submit" className="btn-pill px-10 py-3 text-sm">
          {job ? "Save changes" : "Create job"}
        </button>
        <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:text-brand-heading">
          Cancel
        </Link>
      </div>
    </form>
  );
}
