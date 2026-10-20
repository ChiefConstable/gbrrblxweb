import Link from "next/link";
import type { Job } from "@/lib/jobs";

export default function LatestVacancies({ jobs }: { jobs: Job[] }) {
  return (
    <section id="vacancies" className="scroll-mt-16 bg-brand-dark py-16" aria-labelledby="vacancies-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="vacancies-heading" className="text-center text-3xl text-white sm:text-4xl">
          Latest GBR Vacancies
        </h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <li key={job.slug}>
              <Link
                href={`/jobs/${job.slug}`}
                className="block h-full rounded-sm border border-gray-200 bg-white px-5 py-4 transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/50"
              >
                <h3 className="font-body text-sm font-bold text-brand-green">{job.title}</h3>
                <p className="mt-1 text-xs font-semibold text-brand-heading">
                  {job.location} &middot; {job.contract_type} - {job.employment_type}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link href="/jobs" className="btn-pill-sm">
            View All Vacancies
          </Link>
        </div>
      </div>
    </section>
  );
}
