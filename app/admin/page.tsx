import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { listJobsForAdmin } from "@/lib/adminJobs";
import { deleteJob, setJobStatus } from "@/app/admin/actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

type Props = {
  searchParams: Promise<{
    saved?: string;
    updated?: string;
    deleted?: string;
    notified?: string;
    closedApps?: string;
    error?: string;
  }>;
};

const STATUS_STYLE = {
  published: "bg-brand-green/15 text-brand-dark",
  draft: "bg-gray-100 text-gray-600",
  closed: "bg-red-50 text-red-700",
} as const;

export default async function AdminJobsPage({ searchParams }: Props) {
  const { saved, updated, deleted, notified, closedApps, error } = await searchParams;
  const closedCount = Number(closedApps ?? 0);
  const jobs = await listJobsForAdmin();
  const notifiedCount = Number(notified ?? 0);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl">Jobs</h1>
          <p className="mt-1 text-sm text-gray-600">
            {jobs.filter((j) => j.status === "published").length} published · {jobs.length} total
          </p>
        </div>
        <Link href="/admin/jobs/new" className="btn-pill gap-2 px-6 py-2.5 text-sm">
          <Plus size={16} aria-hidden="true" />
          Add job
        </Link>
      </div>

      {(saved || updated || deleted) && (
        <p role="status" className="mt-6 rounded-sm bg-brand-green/10 p-3 text-sm text-brand-dark">
          {saved && <>Saved &ldquo;{saved}&rdquo;.</>}
          {updated && <>Updated &ldquo;{updated}&rdquo;.</>}
          {deleted && <>Deleted &ldquo;{deleted}&rdquo;.</>}
          {notifiedCount > 0 && <> Job alert sent to {notifiedCount} subscriber{notifiedCount === 1 ? "" : "s"}.</>}
          {closedCount > 0 && (
            <>
              {" "}
              {closedCount} open application{closedCount === 1 ? " was" : "s were"} closed and the applicant
              {closedCount === 1 ? " has" : "s have"} been emailed.
            </>
          )}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-6 rounded-sm bg-red-50 p-3 text-sm text-red-700">
          Something went wrong ({error}).
        </p>
      )}

      {jobs.length === 0 ? (
        <div className="mt-10 rounded-sm border border-dashed border-gray-300 p-10 text-center text-sm text-gray-600">
          No jobs in Supabase yet. Add your first job, or run <code>supabase/seed.sql</code> to load the demo roles.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-brand-dark text-xs text-brand-heading">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Division</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Posted</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-200 align-middle">
                  <td className="px-3 py-3">
                    <Link href={`/admin/jobs/${job.id}`} className="font-bold text-brand-green hover:underline">
                      {job.title}
                    </Link>
                    <div className="text-xs text-gray-500">/{job.slug}</div>
                  </td>
                  <td className="px-3 py-3">{job.division}</td>
                  <td className="px-3 py-3">{job.location}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs">
                    {new Date(job.posted_at).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${STATUS_STYLE[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <form action={setJobStatus}>
                        <input type="hidden" name="id" value={job.id} />
                        <input type="hidden" name="status" value={job.status === "published" ? "closed" : "published"} />
                        <button
                          type="submit"
                          className="rounded-full border border-brand-dark px-3 py-1 text-xs font-bold text-brand-dark hover:bg-brand-dark hover:text-white"
                        >
                          {job.status === "published" ? "Close" : "Publish"}
                        </button>
                      </form>
                      <Link
                        href={`/admin/jobs/${job.id}`}
                        aria-label={`Edit ${job.title}`}
                        className="rounded-full p-2 text-brand-heading hover:bg-gray-100"
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </Link>
                      <form action={deleteJob}>
                        <input type="hidden" name="id" value={job.id} />
                        <ConfirmSubmit
                          message={`Delete "${job.title}"? This can't be undone, and anyone with an application before the offer stage will be emailed that it has closed.`}
                          className="rounded-full p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={15} aria-label={`Delete ${job.title}`} />
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-500">
        Publishing a job emails everyone with matching job alerts. Closing, unpublishing or deleting a job hides it and
        closes its applications that haven&apos;t reached an offer, emailing each applicant. Offers are not affected.
      </p>
    </>
  );
}
