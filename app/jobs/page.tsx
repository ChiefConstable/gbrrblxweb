import JobExplorer from '@/components/JobExplorer';
import { getJobs } from '@/lib/jobs';

export const metadata = { title: 'Current vacancies | GBR Roblox Careers' };

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  return (
    <main>
      <div className="brand-hero px-5 py-16 text-white">
        <div className="relative mx-auto max-w-7xl">
          <span className="text-sm font-bold uppercase tracking-[.2em] text-white/75">Find your next stop</span>
          <h1 className="mt-4 text-4xl font-black md:text-6xl">Explore careers.</h1>
          <p className="mt-4 max-w-2xl text-white/75">Search fictional railway opportunities on the Great British Railways Roblox network.</p>
        </div>
      </div>
      <JobExplorer jobs={await getJobs()} initialQuery={q || ''} />
    </main>
  );
}
