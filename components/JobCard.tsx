import Link from 'next/link';
import { ArrowUpRight, BriefcaseBusiness, MapPin } from 'lucide-react';
import type { Job } from '@/lib/jobs';

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#dbe3fb] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <span className="mb-5 self-start rounded-full bg-rail-pale px-3 py-1 text-xs font-bold text-rail-navy">
        {job.department}
      </span>
      <h3 className="text-xl font-extrabold text-rail-ink">{job.title}</h3>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#59647f]">
        <span className="inline-flex items-center gap-1.5"><MapPin size={16} />{job.location}</span>
        <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness size={16} />{job.employment_type}</span>
      </div>
      <p className="mt-4 flex-1 text-sm leading-7 text-[#55617b]">{job.description}</p>
      <Link href={`/jobs/${job.slug}`} className="mt-6 inline-flex items-center justify-between border-t border-[#edf1fd] pt-4 font-bold text-rail-red">
        View opportunity <ArrowUpRight size={19} />
      </Link>
    </article>
  );
}
