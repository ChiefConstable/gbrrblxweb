'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';

export default function HeroSearch() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/jobs${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  }

  return (
    <form onSubmit={submit} className="mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-panel sm:flex-row">
      <label className="flex flex-1 items-center gap-3 px-3 text-rail-ink">
        <Search size={20} className="text-rail-blue" />
        <span className="sr-only">Search vacancies</span>
        <input
          className="w-full py-3 outline-none"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Job title, department or location"
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-3 rounded-xl bg-rail-red px-7 py-4 font-extrabold text-white transition hover:bg-[#be0c2c]"
      >
        Find jobs <ArrowRight size={18} />
      </button>
    </form>
  );
}
