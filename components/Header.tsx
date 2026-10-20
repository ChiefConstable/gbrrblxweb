import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d9e2fb] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-rail-ink" aria-label="GBR Careers home">
          <Image src="/gbr-logo.png" alt="Great British Railways logo" width={72} height={72} className="h-12 w-12 rounded-xl object-cover shadow-sm" />
          <span className="leading-tight">
            <strong className="block text-lg tracking-tight text-rail-ink">Great British Railways</strong>
            <span className="text-xs font-bold uppercase tracking-[.16em] text-rail-red">Careers · Roblox Network</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-semibold sm:gap-7">
          <Link href="/" className="text-rail-ink transition hover:text-rail-blue">Home</Link>
          <Link href="/jobs" className="text-rail-ink transition hover:text-rail-blue">Vacancies</Link>
          <Link href="/jobs" className="hidden rounded-full bg-rail-red px-5 py-3 text-white transition hover:bg-[#bb0a28] sm:inline-flex sm:items-center">
            Find a role <ArrowUpRight size={16} className="ml-2" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
