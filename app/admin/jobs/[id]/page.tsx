import Link from "next/link";
import { notFound } from "next/navigation";
import JobForm from "@/components/admin/JobForm";
import { getJobForAdmin } from "@/lib/adminJobs";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export default async function EditJobPage({ params, searchParams }: Props) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  if (id === "new") notFound();
  const job = await getJobForAdmin(id);
  if (!job) notFound();

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl">Edit: {job.title}</h1>
        {job.status === "published" && (
          <Link href={`/jobs/${job.slug}`} className="text-sm font-semibold text-brand-green hover:underline">
            View live page &rarr;
          </Link>
        )}
      </div>
      <JobForm job={job} error={error} />
    </>
  );
}
