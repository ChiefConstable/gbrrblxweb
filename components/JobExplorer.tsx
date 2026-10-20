'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import JobCard from '@/components/JobCard';
import type { Job } from '@/lib/jobs';

export default function JobExplorer({ jobs, initialQuery = '' }: { jobs: Job[]; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [department, setDepartment] = useState('All departments');
  const [location, setLocation] = useState('All locations');
  const [sort, setSort] = useState('newest');

  const departments = ['All departments', ...Array.from(new Set(jobs.map((job) => job.department))).sort()];
  const locations = ['All locations', ...Array.from(new Set(jobs.map((job) => job.location))).sort()];

  const filtered = useMemo(() => {
    return jobs
      .filter((job) => {
        const text = [job.title, job.location, job.department, job.description].join(' ').toLowerCase();
        return (
          text.includes(query.trim().toLowerCase()) &&
          (department === 'All departments' || job.department === department) &&
          (location === 'All locations' || job.location === location)
        );
      })
      .sort((a, b) => {
        if (sort === 'az') return a.title.localeCompare(b.title);
        if (sort === 'za') return b.title.localeCompare(a.title);
        return Date.parse(b.posted_at) - Date.parse(a.posted_at);
      });
  }, [jobs, query, department, location, sort]);

  function reset() {
    setQuery('');
    setDepartment('All departments');
    setLocation('All locations');
    setSort('newest');
  }

  return (
    <section id="vacancies" className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="eyebrow">Discover opportunities</span>
          <h2 className="mt-3 text-3xl font-extrabold text-rail-ink md:text-4xl">Current vacancies</h2>
          <p className="mt-3 text-[#5b6882]">Find your place on our railway network.</p>
        </div>
        <p className="font-bold text-rail-navy">
          {filtered.length} {filtered.length === 1 ? 'vacancy' : 'vacancies'} found
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-[#dbe3fb] bg-white p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 font-bold text-rail-ink">
          <SlidersHorizontal size={18} className="text-rail-blue" /> Search and filter
        </h3>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="relative md:col-span-2">
            <span className="sr-only">Keywords</span>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7e8eb3]" size={18} />
            <input className="field pl-11" placeholder="Job title, keyword or location" value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>

          <label>
            <span className="sr-only">Department</span>
            <select className="field" value={department} onChange={(event) => setDepartment(event.target.value)}>
              {departments.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="sr-only">Location</span>
            <select className="field" value={location} onChange={(event) => setLocation(event.target.value)}>
              {locations.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="inline-flex items-center gap-2 text-sm font-bold text-rail-red" onClick={reset}>
            <X size={16} /> Clear filters
          </button>

          <label className="flex items-center gap-2 text-sm font-medium text-rail-ink">
            Sort by
            <select className="rounded-lg border border-[#d8e1fb] bg-white p-2" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="az">Title A–Z</option>
              <option value="za">Title Z–A</option>
            </select>
          </label>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#bcc9ef] bg-white p-14 text-center">
          <h3 className="text-xl font-bold text-rail-ink">No vacancies found</h3>
          <p className="mt-3 text-[#5b6882]">Try different filters or another keyword.</p>
          <button className="mt-5 font-bold text-rail-red underline" onClick={reset}>Reset search</button>
        </div>
      )}
    </section>
  );
}
