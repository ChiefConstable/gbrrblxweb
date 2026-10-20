import Link from "next/link";
import { notFound } from "next/navigation";
import { updateApplication } from "@/app/admin/actions";
import StatusFields from "@/components/admin/StatusFields";
import {
  NEEDS_SCHEDULE,
  STATUS_LABEL,
  STATUS_STYLE,
  formatInterviewTime,
  formatReference,
  getApplication,
} from "@/lib/applications";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string; emailed?: string; error?: string }>;
};

const ACTIONS = [
  { value: "assessment", label: "Assessment", hint: "Emails them the next-stage invite" },
  { value: "group_interview", label: "Group interview", hint: "Emails an invite with date, time and place" },
  { value: "interview", label: "Interview", hint: "Emails an invite with date, time and place" },
  { value: "offered", label: "Make an offer", hint: "Emails them a link to accept or decline" },
  { value: "unsuccessful", label: "Unsuccessful", hint: "Emails a polite rejection" },
  { value: "submitted", label: "Back to received", hint: "Resends the application-received email" },
];

/** ISO timestamp -> "YYYY-MM-DDTHH:mm" in UK time, for a datetime-local input */
function toLondonLocal(iso: string | null) {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}`;
}

export default async function AdminApplicationPage({ params, searchParams }: Props) {
  const [{ id }, { updated, emailed, error }] = await Promise.all([params, searchParams]);
  const a = await getApplication(id);
  if (!a) notFound();

  const answers: [string, string][] = [
    ["Experience", a.experience],
    ["Why this role", a.motivation],
    ["Availability", a.availability],
  ];

  return (
    <>
      <Link href="/admin/applications" className="text-xs font-semibold text-brand-green hover:underline">
        &larr; All applications
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl">
          {formatReference(a.reference)}: {a.first_name} {a.last_name}
        </h1>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[a.status]}`}>{STATUS_LABEL[a.status]}</span>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {a.job_title}, {a.job_location} · applied {new Date(a.created_at).toLocaleString("en-GB")}
      </p>

      {updated && (
        <p role="status" className="mt-6 rounded-sm bg-brand-green/10 p-3 text-sm text-brand-dark">
          Status updated.{" "}
          {emailed === "1" ? "The applicant has been emailed." : "No email was sent (email isn't set up, or this status doesn't send one)."}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 rounded-sm bg-red-50 p-3 text-sm text-red-700">
          {error === "time" ? "Please set a date and time for the interview." : `Couldn't update: ${error}`}
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <dl className="grid gap-4 rounded-sm border border-gray-200 p-5 text-sm sm:grid-cols-2">
            {[
              ["Account", `${a.username} (${a.provider})`],
              ["Account ID", a.provider_account_id],
              ["Email", a.email],
              ["Discord", a.discord_username ?? "Not given"],
              ["Age 13+ confirmed", a.age_confirmed ? "Yes" : "No"],
              ["Last updated", new Date(a.updated_at).toLocaleString("en-GB")],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{k}</dt>
                <dd className="break-words font-semibold text-brand-heading">{v}</dd>
              </div>
            ))}
          </dl>

          {answers.map(([q, ans]) => (
            <div key={q}>
              <h2 className="text-base">{q}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6">{ans || "No answer"}</p>
            </div>
          ))}

          {NEEDS_SCHEDULE.includes(a.status) && a.interview_at && (
            <div className="rounded-sm bg-gray-50 p-4 text-sm">
              <strong className="text-brand-heading">Booked:</strong> {formatInterviewTime(a.interview_at)}
              {a.interview_location && <> · {a.interview_location}</>}
            </div>
          )}
        </section>

        <aside>
          <form action={updateApplication} className="space-y-5 rounded-sm border border-gray-200 p-5">
            <input type="hidden" name="id" value={a.id} />
            <h2 className="text-lg">Update status</h2>
            <StatusFields
              options={ACTIONS}
              current={a.status}
              scheduleStatuses={NEEDS_SCHEDULE}
              defaultAt={toLondonLocal(a.interview_at)}
              defaultLocation={a.interview_location ?? ""}
            />
            <div>
              <label htmlFor="note" className="mb-1 block text-sm font-semibold text-brand-heading">
                Message to include in the email
              </label>
              <textarea
                id="note"
                name="note"
                rows={4}
                defaultValue={a.admin_note ?? ""}
                placeholder="e.g. Join the GBR Discord and message @Recruitment to book your quiz."
                className="field leading-6"
              />
              <p className="mt-1 text-xs text-gray-500">Optional. Shown to the applicant in the email and on their application page.</p>
            </div>
            <button type="submit" className="btn-pill w-full py-3 text-sm">
              Save and email applicant
            </button>
          </form>
        </aside>
      </div>
    </>
  );
}
