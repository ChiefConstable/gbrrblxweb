import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-rail-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Image src="/gbr-logo.png" alt="Great British Railways logo" width={72} height={72} className="h-14 w-14 rounded-xl object-cover" />
            <div>
              <strong className="text-xl">Great British Railways</strong>
              <p className="mt-1 text-sm text-white/70">Connecting communities. Inspiring railway careers.</p>
            </div>
          </div>

          <div className="flex gap-6 text-sm font-medium text-white/90">
            <Link href="/">Home</Link>
            <Link href="/jobs">Current vacancies</Link>
          </div>
        </div>

        <p className="mt-8 border-t border-white/15 pt-5 text-xs leading-6 text-white/65">
          Unofficial Roblox roleplay project. Positions are fictional, unpaid roleplay roles. Not affiliated with the real Great British Railways, Great Western Railway, FirstGroup or any UK train operator.
        </p>
      </div>
    </footer>
  );
}
