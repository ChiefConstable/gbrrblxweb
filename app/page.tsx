import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, BriefcaseBusiness, MapPin, TrainFront, Users } from 'lucide-react';
import HeroSearch from '@/components/HeroSearch';
import JobCard from '@/components/JobCard';
import { getJobs } from '@/lib/jobs';

export default async function Home() {
  const jobs = await getJobs();

  return (
    <main>
      <section className="brand-hero text-white">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.22fr_.78fr] lg:px-8 lg:py-28">
          <div className="relative z-10">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.17em] text-white">
              Great British Railways Careers
            </span>
            <h1 className="mt-8 max-w-3xl text-5xl font-black leading-[1.04] tracking-tight md:text-7xl">
              Join the network.
              <br />
              <span className="text-white">Build your route.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              Explore fictional railway opportunities across our Roblox network — from train operations and stations to recruitment, control and customer experience.
            </p>
            <HeroSearch />
            <p className="mt-5 text-xs text-white/65">Fictional Roblox roleplay opportunities · No real-world employment offered</p>
          </div>

          <div className="relative z-10 hidden lg:block">
            <div className="brand-panel rounded-[32px] p-8 shadow-panel">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold uppercase tracking-[.2em] text-white/80">Now recruiting</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">01 — 03</span>
              </div>

              <div className="mt-8 rounded-[24px] bg-white p-6 text-rail-ink">
                <div className="flex items-center gap-4">
                  <Image src="/gbr-logo.png" alt="Great British Railways logo" width={180} height={120} className="h-20 w-auto rounded-xl object-cover" />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-rail-soft p-4">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-rail-red">Network</p>
                    <p className="mt-2 text-lg font-extrabold text-rail-navy">Operations</p>
                  </div>
                  <div className="rounded-2xl bg-rail-soft p-4">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-rail-red">Route</p>
                    <p className="mt-2 text-lg font-extrabold text-rail-navy">Customer roles</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-[#e6ecfb] pt-5">
                  <p className="text-2xl font-black text-rail-ink">Explore. Apply. Progress.</p>
                  <p className="mt-2 text-sm leading-7 text-[#5c6880]">A clean, professional recruitment portal styled to match your Great British Railways brand.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-3 lg:px-8">
        {[
          { icon: TrainFront, title: 'Railway operations', text: 'Drive, dispatch, manage and support the running of your Roblox railway network.' },
          { icon: Users, title: 'Structured progression', text: 'Build your experience through training, supervision and team-based roleplay.' },
          { icon: BadgeCheck, title: 'Professional standards', text: 'Clear expectations, polished branding and role details that feel like a real operator.' },
        ].map((item) => (
          <div className="brand-grid-card rounded-2xl border border-[#dce4fb] p-7 shadow-sm" key={item.title}>
            <item.icon size={32} className="text-rail-blue" />
            <h2 className="mt-5 text-xl font-extrabold text-rail-ink">{item.title}</h2>
            <p className="mt-3 leading-7 text-[#5a6780]">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Your next stop</span>
              <h2 className="mt-3 text-4xl font-extrabold text-rail-ink">Featured opportunities</h2>
              <p className="mt-3 text-[#5b6882]">Choose your next role across the Great British Railways Roblox network.</p>
            </div>
            <Link href="/jobs" className="inline-flex items-center gap-2 font-bold text-rail-red">
              View all vacancies <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.filter((job) => job.featured).slice(0, 3).map((job) => <JobCard key={job.id} job={job} />)}
          </div>

          {jobs.length === 0 && <p>No published vacancies are available yet.</p>}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-20 md:flex-row md:items-center lg:px-8">
        <div>
          <span className="eyebrow">Be part of the journey</span>
          <h2 className="mt-3 max-w-xl text-3xl font-extrabold text-rail-ink md:text-4xl">A role for every railway enthusiast.</h2>
          <div className="mt-4 space-y-3 text-[#5a6780]">
            <p><MapPin size={17} className="mr-2 inline text-rail-blue" />Stations, depots and network control across your fictional network.</p>
            <p><BriefcaseBusiness size={17} className="mr-2 inline text-rail-blue" />Perfect for Roblox railway groups wanting a polished operator-style recruitment portal.</p>
          </div>
        </div>

        <Link href="/jobs" className="inline-flex items-center gap-3 rounded-xl bg-rail-navy px-7 py-4 font-bold text-white transition hover:bg-[#041f59]">
          Explore vacancies <ArrowRight size={19} />
        </Link>
      </section>
    </main>
  );
}
