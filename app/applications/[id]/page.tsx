import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Check, MapPin, PartyPopper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";
import { requireViewer } from "@/lib/guards";
import {
  NEEDS_SCHEDULE,
  STATUS_LABEL,
  STATUS_STYLE,
  formatInterviewTime,
  formatReference,
  getApplication,
  type ApplicationStatus,
} from "@/lib/applications";
import { acceptOffer, declineOffer, withdraw } from "@/app/applications/actions";

export const metadata: Metadata = { title: "Application | GBR Careers", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ submitted?: string; accepted?: string; declined?: string; withdrawn?: string; error?: string }>;
};

const STEPS: { key: ApplicationStatus; label: string }[] = [
  { key: "submitted", label: "Applied" },
  { key: "assessment", label: "Assessment" },
  { key: "group_interview", label: "Group interview" },
  { key: "interview", label: "Interview" },
  { key: "offered", label: "Offer" },
];

export default async function ApplicationPage({ params, searchParams }: Props) {
  const [{ id }, flags] = await Promise.all([params, searchParams]);
  const viewer = await requireViewer(`/applications/${id}`);
  const a = await getApplication(id);
  // Only the applicant (or an admin) can see an application
  if (!a || (!viewer.isAdmin && (a.provider !== viewer.provider || a.provider_account_id !== viewer.providerAccountId))) notFound();

  const stepIndex = a.status === "accepted" ? STEPS.length : STEPS.findIndex((s) => s.key === a.status);
  const closed = ["declined", "unsuccessful", "withdrawn"].includes(a.status);
  const canWithdraw = ["submitted", "assessment", "group_interview", "interview"].includes(a.status);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-3xl px-6 pb-20 pt-28">
        <Link href="/applications" className="text-xs font-semibold text-brand-green hover:underline">
          &larr; My applications
        </Link>
        <h1 className="mt-3 text-2xl sm:text-3xl">{a.job_title}</h1>
        <p className="mt-1 text-sm font-semibold text-gray-600">
          {a.job_location} · Reference {formatReference(a.reference)}
        </p>

        {flags.submitted && <Banner>Application sent. We&apos;ve emailed a confirmation to {a.email}.</Banner>}
        {flags.withdrawn && <Banner>Your application has been withdrawn.</Banner>}
        {flags.error && <Banner tone="error">That didn&apos;t work. The application may have already been updated.</Banner>}

        {/* Progress */}
        {!closed && (
          <ol className="mt-8 grid grid-cols-5 gap-1" aria-label="Application progress">
            {STEPS.map((s, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex;
              return (
                <li key={s.key} className="text-center">
                  <span
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      done ? "bg-brand-green text-white" : current ? "bg-brand-dark text-white" : "bg-gray-200 text-gray-500"
                    }`}
                    aria-current={current ? "step" : undefined}
                  >
                    {done ? <Check size={14} aria-hidden="true" /> : i + 1}
                  </span>
                  <span className={`mt-1 block text-[11px] leading-4 ${current ? "font-bold text-brand-heading" : "text-gray-500"}`}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        <div className="mt-8 rounded-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-brand-heading">Status</span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[a.status]}`}>{STATUS_LABEL[a.status]}</span>
          </div>

          {NEEDS_SCHEDULE.includes(a.status) && (a.interview_at || a.interview_location) && (
            <div className="mt-5 space-y-2 rounded-sm bg-gray-50 p-4 text-sm">
              {a.interview_at && (
                <p className="flex items-center gap-2">
                  <CalendarClock size={16} className="text-brand-dark" aria-hidden="true" />
                  {formatInterviewTime(a.interview_at)}
                </p>
              )}
              {a.interview_location && (
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-brand-dark" aria-hidden="true" />
                  {a.interview_location}
                </p>
              )}
            </div>
          )}

          {a.admin_note && (
            <div className="mt-5 border-l-4 border-brand-green bg-gray-50 p-4 text-sm leading-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">Message from the Recruitment Team</p>
              <p className="whitespace-pre-line">{a.admin_note}</p>
            </div>
          )}

          <StatusMessage status={a.status} />
        </div>

        {/* Offer: the accept page */}
        {a.status === "offered" && (
          <section className="mt-8 rounded-sm border-2 border-brand-green bg-brand-green/5 p-6 text-center" aria-labelledby="offer-heading">
            <PartyPopper className="mx-auto text-brand-green" size={44} strokeWidth={1.25} aria-hidden="true" />
            <h2 id="offer-heading" className="mt-3 text-xl">
              We&apos;d like to offer you the role of {a.job_title}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6">
              Accepting means you&apos;ll join the {a.job_location} team and be paired with a mentor for your first shifts.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <form action={acceptOffer}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="btn-pill px-10 py-3 text-sm">
                  Accept offer
                </button>
              </form>
              <form action={declineOffer}>
                <input type="hidden" name="id" value={a.id} />
                <ConfirmSubmit
                  message="Decline this offer? You won't be able to undo this."
                  className="rounded-full border border-gray-400 px-8 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100"
                >
                  Decline
                </ConfirmSubmit>
              </form>
            </div>
          </section>
        )}

        {a.status === "accepted" && (
          <section className="mt-8 rounded-sm bg-brand-dark p-8 text-center text-white">
            <PartyPopper className="mx-auto" size={44} strokeWidth={1.25} aria-hidden="true" />
            <h2 className="mt-3 text-xl text-white">{flags.accepted ? "You've accepted. Welcome to GBR!" : "Welcome to GBR!"}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/80">
              Your mentor will message you on the GBR Discord server to arrange your first training session.
            </p>
          </section>
        )}

        <details className="mt-8 text-sm">
          <summary className="cursor-pointer font-semibold text-brand-heading">Your answers</summary>
          <dl className="mt-4 space-y-4">
            {[
              ["Experience", a.experience],
              ["Why this role", a.motivation],
              ["Availability", a.availability],
            ].map(([q, v]) => (
              <div key={q}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{q}</dt>
                <dd className="mt-1 whitespace-pre-line leading-6">{v || "No answer"}</dd>
              </div>
            ))}
          </dl>
        </details>

        {canWithdraw && (
          <form action={withdraw} className="mt-10 border-t border-gray-200 pt-6">
            <input type="hidden" name="id" value={a.id} />
            <ConfirmSubmit message="Withdraw this application?" className="text-xs font-semibold text-red-600 hover:underline">
              Withdraw application
            </ConfirmSubmit>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}

function Banner({ children, tone = "ok" }: { children: React.ReactNode; tone?: "ok" | "error" }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`mt-6 rounded-sm p-3 text-sm ${tone === "error" ? "bg-red-50 text-red-700" : "bg-brand-green/10 text-brand-dark"}`}
    >
      {children}
    </p>
  );
}

const MESSAGES: Partial<Record<ApplicationStatus, string>> = {
  submitted: "We've received your application and our Recruitment Team will review it soon.",
  assessment: "You're through to the assessment stage. Follow the instructions above to complete it.",
  group_interview: "You're invited to a group interview. Please arrive a few minutes early.",
  interview: "You're invited to a one-to-one interview. If you can't make it, message the Recruitment Team on Discord.",
  declined: "You declined this offer. You're welcome to apply for other roles at any time.",
  unsuccessful: "Unfortunately you weren't successful this time. You can apply for other roles straight away.",
  withdrawn: "You withdrew this application.",
};

function StatusMessage({ status }: { status: ApplicationStatus }) {
  const msg = MESSAGES[status];
  return msg ? <p className="mt-5 text-sm leading-6">{msg}</p> : null;
}
