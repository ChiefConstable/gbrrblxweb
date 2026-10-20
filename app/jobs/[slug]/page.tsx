import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, MapPin } from 'lucide-react';
import { getJob, getJobs } from '@/lib/jobs';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return (await getJobs()).map((job) => ({ slug: job.slug }));
}

export default async function JobDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) notFound();

  return (
    <main className="pb-20">
      <div className="brand-hero text-white">
        <div className="relative mx-auto max-w-5xl px-5 py-16">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-white/75 hover:text-white">
            <ArrowLeft size={17} /> All vacancies
          </Link>
          <span className="mt-9 block text-xs font-bold uppercase tracking-[.18em] text-white/75">{job.department}</span>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">{job.title}</h1>
          <div className="mt-6 flex flex-wrap gap-6 text-white/75">
            <span className="inline-flex items-center gap-2"><MapPin size={17} />{job.location}</span>
            <span className="inline-flex items-center gap-2"><BriefcaseBusiness size={17} />{job.employment_type}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-[1fr_260px]">
        <article className="space-y-10 rounded-2xl border border-[#dce4fb] bg-white p-7 md:p-10">
          <section>
            <h2 className="text-2xl font-extrabold text-rail-ink">About the role</h2>
            <p className="mt-4 leading-8 text-[#5c6880]">{job.description}</p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-rail-ink">What you will do</h2>
            <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#5c6880]">
              {job.responsibilities.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-rail-ink">What we are looking for</h2>
            <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#5c6880]">
              {job.requirements.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>
        </article>

        <aside className="h-fit rounded-2xl bg-rail-pale p-6">
          <h2 className="text-xl font-extrabold text-rail-ink">Interested?</h2>
          <p className="mt-3 text-sm leading-7 text-[#5c6880]">
            Applications are not enabled in this first release. Check back when recruitment opens.
          </p>
          <Link href="/jobs" className="mt-6 inline-block rounded-xl bg-rail-red px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#be0c2c]">
            View other roles
          </Link>
        </aside>
      </div>
    </main>
  );
}
