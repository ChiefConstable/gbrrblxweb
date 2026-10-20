import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Bike,
  Briefcase,
  CalendarClock,
  CircleCheck,
  Clock,
  Coins,
  GraduationCap,
  Hash,
  HeartHandshake,
  MapPin,
  PartyPopper,
  TrainFront,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavouriteButtons from "@/components/FavouriteButtons";
import ScrollToTop from "@/components/ScrollToTop";
import { getJobBySlug } from "@/lib/jobs";
import { authEnabled, getViewer } from "@/auth";

// Always render fresh so jobs edited in /admin show up straight away
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

const DIVISION_IMAGE: Record<string, string> = {
  "Train Crew": "/media/function-train-crew.jpg",
  Stations: "/media/function-stations.jpg",
  "Control & Operations": "/media/function-control.jpg",
  Engineering: "/media/function-engineering.jpg",
  "Head Office": "/media/function-head-office.jpg",
};

const JOB_BENEFITS: { label: string; icon: LucideIcon }[] = [
  { label: "Free cab rides", icon: TrainFront },
  { label: "Paid every shift", icon: Coins },
  { label: "Mentor support", icon: HeartHandshake },
  { label: "Training included", icon: GraduationCap },
  { label: "Flexible shifts", icon: Bike },
  { label: "Community events", icon: PartyPopper },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  return {
    title: job ? `${job.title}, ${job.location} | GBR Careers (Roblox Community)` : "Vacancy not found | GBR Careers",
  };
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const viewer = await getViewer();

  const meta: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Hash, label: "Reference", value: job.reference },
    { icon: MapPin, label: "Location", value: `${job.location} (${job.region})` },
    { icon: CalendarClock, label: "Closing date", value: `Closing on ${formatDate(job.closing_date)}` },
    { icon: Briefcase, label: "Division", value: `${job.division} · ${job.grade}` },
    { icon: Coins, label: "Pay", value: `${job.pay} (in-game)` },
    { icon: Clock, label: "Contract", value: `${job.contract_type} - ${job.employment_type}` },
  ];

  // The apply page asks people to sign in first when needed
  const applyHref = `/jobs/${job.slug}/apply`;

  return (
    <>
      <Header />
      <main className="pt-16">
        {/* Split banner */}
        <section className="grid md:grid-cols-2" aria-label={`${job.division} division`}>
          <div className="flex min-h-[220px] flex-col items-center justify-center bg-brand-dark px-6 py-12 text-white md:min-h-[360px]">
            <span className="font-heading text-6xl font-bold tracking-tight sm:text-7xl">GBR</span>
            <span className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              {job.division}
            </span>
          </div>
          <div className="relative hidden min-h-[360px] bg-gray-300 md:block">
            <Image
              src={DIVISION_IMAGE[job.division] ?? "/media/hero-poster.jpg"}
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1fr_300px]">
          <article className="min-w-0">
            <Link href="/jobs" className="text-xs font-semibold text-brand-green hover:underline">
              &larr; Back to job search
            </Link>
            <h1 className="mt-3 text-2xl sm:text-3xl">{job.title}</h1>

            <dl className="mt-6 grid gap-x-8 gap-y-3 text-xs sm:grid-cols-2">
              {meta.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <dt className="pt-0.5 text-brand-dark">
                    <Icon size={14} aria-hidden="true" />
                    <span className="sr-only">{label}</span>
                  </dt>
                  <dd className="text-gray-700">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6">
              <FavouriteButtons slug={job.slug} />
            </div>

            <div className="mt-10 space-y-8 text-sm leading-7">
              <section>
                <h2 className="text-base">Who are we?</h2>
                <p className="mt-2">
                  GBR is a Roblox railway community where players run a realistic UK-style network together. We
                  train every new member from scratch, and there&apos;s a role for you whether you want to drive,
                  signal, build or organise.
                </p>
              </section>

              <section>
                <h2 className="text-base">About the role</h2>
                <p className="mt-2">{job.intro}</p>
              </section>

              <section>
                <h2 className="text-base">What you&apos;ll do</h2>
                <ul className="mt-3 space-y-2">
                  {job.responsibilities.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CircleCheck size={16} className="mt-1 shrink-0 text-brand-green" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-base">What we&apos;re looking for</h2>
                <ul className="mt-3 space-y-2">
                  {job.requirements.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CircleCheck size={16} className="mt-1 shrink-0 text-brand-green" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-semibold text-brand-heading">No previous experience needed. Full training is provided.</p>
              </section>

              <section>
                <h2 className="text-base">Working pattern</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-brand-green">
                  {job.working_pattern.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-base">What to expect</h2>
                <ol className="mt-3 space-y-3">
                  {job.process.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-dark text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section id="apply" className="scroll-mt-24 rounded-sm bg-gray-100 p-6">
                <h2 className="text-base">Ready to apply?</h2>
                <p className="mt-2">
                  Applications for this role close on <strong>{formatDate(job.closing_date)}</strong>. Sign in with
                  Roblox or Discord and it takes about 5 minutes.
                </p>
                {viewer && (
                  <p className="mt-3 text-xs text-gray-600">
                    Signed in as <strong>{viewer.name}</strong>
                  </p>
                )}
                <Link href={applyHref} className="btn-pill-sm mt-4">
                  {authEnabled && !viewer ? "Sign in to apply" : "Apply Now"}
                </Link>
              </section>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Link href={applyHref} className="btn-pill w-full py-3 text-sm">
              Apply Now!
            </Link>

            <div className="rounded-sm bg-gray-100 p-6">
              <h2 className="text-center text-lg">Job benefits</h2>
              <div className="mx-auto mt-2 h-0.5 w-10 bg-brand-green" />
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
                {JOB_BENEFITS.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex flex-col items-center text-center">
                    <Icon size={34} strokeWidth={1} className="text-brand-dark" aria-hidden="true" />
                    <span className="mt-2 text-xs font-semibold text-brand-heading">{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-gray-200 p-6 text-xs leading-6">
              <p className="font-semibold text-brand-heading">Not quite right?</p>
              <p className="mt-1">Get new vacancies sent to you as soon as they open.</p>
              <Link href="/#job-alerts" className="mt-2 inline-block font-bold text-brand-green hover:underline">
                Register for job alerts &rarr;
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
