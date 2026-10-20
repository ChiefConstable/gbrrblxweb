import Link from "next/link";

export default function Intro() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl">Your Journey Starts With GBR</h1>

      <div className="mt-10 space-y-6 text-left text-base leading-8">
        <p>
          GBR is a Roblox railway community built by people who love trains. Every day our members run
          timetabled services across a growing virtual network, from busy city termini to quiet branch
          lines. Behind every departure is a team of drivers, guards, signallers and station staff working
          together to keep things moving.
        </p>
        <p>
          Whether you&apos;ve been playing for years or you&apos;re just getting started, there&apos;s a
          place for you here. We train new members from scratch, give you room to progress at your own
          pace, and run regular events where you can put your skills to the test alongside friends.
        </p>
        <p className="font-bold text-brand-heading">
          Browse our open roles, pick the one that suits you, and apply today. Your first shift could be
          just around the corner.
        </p>
      </div>

      <div className="mt-12 text-center">
        <Link href="/jobs" className="btn-pill px-12 py-6 text-base uppercase tracking-wide">
          Apply Today
        </Link>
      </div>
    </section>
  );
}
