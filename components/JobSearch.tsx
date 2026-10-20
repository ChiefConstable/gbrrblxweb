"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import type { Job } from "@/lib/jobs";

type FacetKey = "division" | "grade" | "region" | "category" | "employment_type";

const FACETS: { key: FacetKey; label: string; searchable?: boolean }[] = [
  { key: "division", label: "Division" },
  { key: "grade", label: "Grade" },
  { key: "region", label: "Region", searchable: true },
  { key: "category", label: "Job Category", searchable: true },
  { key: "employment_type", label: "Employment Type" },
];

type Filters = Record<FacetKey, string[]>;

const EMPTY_FILTERS: Filters = { division: [], grade: [], region: [], category: [], employment_type: [] };

export const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type SortKey = "updated" | "title";

function matches(job: Job, query: string, filters: Filters, skip?: FacetKey) {
  if (query) {
    const q = query.toLowerCase();
    const haystack = `${job.title} ${job.location} ${job.division} ${job.category} ${job.region}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return FACETS.every(({ key }) => {
    if (key === skip) return true;
    const selected = filters[key];
    return selected.length === 0 || selected.includes(job[key]);
  });
}

export default function JobSearch({
  jobs: allJobs,
  initialDivision,
  favouritesOnly = false,
}: {
  jobs: Job[];
  initialDivision?: string;
  favouritesOnly?: boolean;
}) {
  const [favourites, setFavourites] = useState<string[] | null>(null);
  useEffect(() => {
    if (!favouritesOnly) return;
    try {
      const raw = window.localStorage.getItem("gbr-favourite-jobs");
      setFavourites(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setFavourites([]);
    }
  }, [favouritesOnly]);
  const jobs = useMemo(
    () => (favouritesOnly && favourites ? allJobs.filter((j) => favourites.includes(j.slug)) : allJobs),
    [allJobs, favouritesOnly, favourites],
  );

  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("updated");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(() => {
    const match = jobs.find((j) => slugify(j.division) === initialDivision)?.division;
    return match ? { ...EMPTY_FILTERS, division: [match] } : EMPTY_FILTERS;
  });

  // All distinct values per facet, in a stable order
  const options = useMemo(() => {
    const out = {} as Record<FacetKey, string[]>;
    for (const { key } of FACETS) {
      out[key] = Array.from(new Set(jobs.map((j) => j[key]))).sort((a, b) => a.localeCompare(b, "en-GB", { numeric: true }));
    }
    return out;
  }, [jobs]);

  const results = useMemo(() => {
    const list = jobs.filter((job) => matches(job, query, filters));
    return list.sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : b.posted_at.localeCompare(a.posted_at),
    );
  }, [jobs, query, filters, sort]);

  // Faceted counts: how many results each option would give, keeping the other filters applied
  const countFor = (key: FacetKey, value: string) =>
    jobs.filter((job) => job[key] === value && matches(job, query, filters, key)).length;

  const toggle = (key: FacetKey, value: string) =>
    setFilters((cur) => ({
      ...cur,
      [key]: cur[key].includes(value) ? cur[key].filter((v) => v !== value) : [...cur[key], value],
    }));

  const activeChips = FACETS.flatMap(({ key }) => filters[key].map((value) => ({ key, value })));
  const hasActive = activeChips.length > 0 || query !== "";

  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    setDraftQuery("");
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setQuery(draftQuery.trim());
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside aria-label="Filter vacancies" className={`${showFilters ? "block" : "hidden"} lg:block`}>
        <button
          type="button"
          onClick={clearAll}
          disabled={!hasActive}
          className="mb-5 rounded-full bg-brand-pink px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-40"
        >
          Clear Filters
        </button>

        <div className="space-y-5">
          {FACETS.map((facet) => (
            <FacetGroup
              key={facet.key}
              label={facet.label}
              searchable={facet.searchable}
              options={options[facet.key]}
              selected={filters[facet.key]}
              countFor={(v) => countFor(facet.key, v)}
              onToggle={(v) => toggle(facet.key, v)}
            />
          ))}
        </div>
      </aside>

      {/* Results */}
      <section aria-label="Search results" className="min-w-0">
        <form onSubmit={onSearch} role="search" className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="job-query" className="sr-only">
            Search by job title, location, division or category
          </label>
          <input
            id="job-query"
            type="search"
            value={draftQuery}
            onChange={(e) => setDraftQuery(e.target.value)}
            placeholder="Search by job title, location, division, category etc."
            className="field flex-1 py-3"
          />
          <button type="submit" className="btn-pill gap-2 px-10 py-3 text-sm uppercase tracking-wide">
            <Search size={16} aria-hidden="true" />
            Search
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              className="inline-flex items-center gap-2 rounded-full border border-brand-dark px-4 py-1.5 text-xs font-bold uppercase text-brand-dark lg:hidden"
            >
              <SlidersHorizontal size={14} aria-hidden="true" />
              {showFilters ? "Hide filters" : "Filters"}
            </button>
            {query && (
              <Chip label={`"${query}"`} onRemove={() => { setQuery(""); setDraftQuery(""); }} />
            )}
            {activeChips.map(({ key, value }) => (
              <Chip key={`${key}-${value}`} label={value} onRemove={() => toggle(key, value)} />
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-brand-heading">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-sm border border-gray-300 bg-white px-2 py-1 text-xs focus:border-brand-green focus:outline-none"
            >
              <option value="updated">Last Updated</option>
              <option value="title">Job Title (A–Z)</option>
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="mt-8 rounded-sm border border-gray-200 bg-gray-50 p-10 text-center">
            <p className="font-heading font-bold text-brand-heading">No vacancies match your search</p>
            <p className="mt-2 text-sm">Try removing a filter, or register for job alerts and we&apos;ll tell you when one opens.</p>
            <Link href="/#job-alerts" className="btn-pill-sm mt-6">
              Register for Job Alerts
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-6 hidden overflow-x-auto md:block">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-brand-dark text-brand-heading">
                    {["Title", "Division", "Grade", "Location", "Region", "Job Category", "Employment Type"].map((h) => (
                      <th key={h} scope="col" className="px-3 py-3 font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((job) => (
                    <tr key={job.slug} className="border-b border-gray-200 transition-colors hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <Link href={`/jobs/${job.slug}`} className="text-sm font-bold text-brand-green hover:underline">
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-3 py-4">{job.division}</td>
                      <td className="px-3 py-4">{job.grade}</td>
                      <td className="px-3 py-4">{job.location}</td>
                      <td className="px-3 py-4">{job.region}</td>
                      <td className="px-3 py-4">{job.category}</td>
                      <td className="px-3 py-4">
                        {job.contract_type} - {job.employment_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="mt-6 space-y-3 md:hidden">
              {results.map((job) => (
                <li key={job.slug}>
                  <Link href={`/jobs/${job.slug}`} className="block rounded-sm border border-gray-200 p-4 hover:shadow-md">
                    <span className="block text-sm font-bold text-brand-green">{job.title}</span>
                    <span className="mt-1 block text-xs font-semibold text-brand-heading">
                      {job.location} &middot; {job.contract_type} - {job.employment_type}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {job.division} &middot; {job.grade} &middot; {job.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {favouritesOnly && (
          <p className="mt-6 text-xs text-gray-600">
            Showing your saved favourites.{" "}
            <Link href="/jobs" className="font-semibold text-brand-green hover:underline">
              Show all vacancies
            </Link>
          </p>
        )}
        <p className="mt-2 text-xs text-gray-600" aria-live="polite">
          Displaying <strong>{results.length}</strong> of {jobs.length} vacancies
        </p>
      </section>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm bg-brand-dark px-2 py-1 text-[11px] font-semibold text-white">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove filter ${label}`} className="rounded-sm hover:bg-white/20">
        <X size={12} aria-hidden="true" />
      </button>
    </span>
  );
}

function FacetGroup({
  label,
  options,
  selected,
  searchable,
  countFor,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  searchable?: boolean;
  countFor: (value: string) => number;
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [term, setTerm] = useState("");
  const id = `facet-${slugify(label)}`;
  const visible = options.filter((o) => o.toLowerCase().includes(term.toLowerCase()));

  return (
    <div className="overflow-hidden rounded-sm border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between bg-brand-dark px-4 py-2.5 text-left text-sm font-bold text-white"
      >
        {label}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={id} className="space-y-1 bg-white px-4 py-3">
          {searchable && (
            <input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search"
              aria-label={`Search ${label} options`}
              className="field mb-2 py-1.5 text-xs"
            />
          )}
          {visible.map((value) => {
            const count = countFor(value);
            const checked = selected.includes(value);
            return (
              <label
                key={value}
                className={`flex cursor-pointer items-center justify-between gap-2 py-1 text-xs ${
                  count === 0 && !checked ? "text-gray-400" : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(value)}
                    className="h-3.5 w-3.5 accent-brand-green"
                  />
                  {value}
                </span>
                <span
                  className={`min-w-[1.5rem] rounded-sm px-1.5 py-0.5 text-center text-[10px] font-bold ${
                    count === 0 ? "bg-gray-200 text-gray-500" : "bg-brand-green text-white"
                  }`}
                >
                  {count}
                </span>
              </label>
            );
          })}
          {visible.length === 0 && <p className="py-1 text-xs text-gray-400">No matches</p>}
        </div>
      )}
    </div>
  );
}
