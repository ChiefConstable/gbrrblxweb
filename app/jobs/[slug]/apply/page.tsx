import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplyForm from "@/components/ApplyForm";
import { getJobBySlug } from "@/lib/jobs";
import { requireViewer } from "@/lib/guards";
import { authEnabled } from "@/auth";
import { formatReference, listApplicationsForApplicant, OPEN_STATUSES } from "@/lib/applications";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  return { title: job ? `Apply: ${job.title} | GBR Careers` : "Apply | GBR Careers", robots: { index: false } };
}

export default async function ApplyPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  if (!authEnabled) {
    return (
      <Shell title={`Apply: ${job.title}`}>
        <p className="text-sm leading-6">Online applications open soon. Check back shortly.</p>
      </Shell>
    );
  }

  const viewer = await requireViewer(`/jobs/${job.slug}/apply`);
  const mine = await listApplicationsForApplicant(viewer);
  const open = mine.find((a) => a.job_slug === job.slug && OPEN_STATUSES.includes(a.status));

  return (
    <Shell title={`Apply: ${job.title}`} subtitle={`${job.location} · ${job.contract_type} - ${job.employment_type}`} slug={job.slug}>
      {open ? (
        <div className="rounded-sm border border-gray-200 bg-gray-50 p-6 text-sm leading-6">
          You already have an open application for this role ({formatReference(open.reference)}).{" "}
          <Link href={`/applications/${open.id}`} className="font-bold text-brand-green hover:underline">
            View it here
          </Link>
          .
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-600">
            Applying as <strong className="text-brand-heading">{viewer.name}</strong> ({viewer.provider}). It takes about 5 minutes.
          </p>
          <ApplyForm
            slug={job.slug}
            defaultName={viewer.provider === "roblox" ? viewer.name : ""}
            defaultEmail={viewer.email ?? ""}
            isDiscord={viewer.provider === "discord"}
          />
        </>
      )}
    </Shell>
  );
}

function Shell({ title, subtitle, slug, children }: { title: string; subtitle?: string; slug?: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>
        <section className="bg-brand-dark pb-10 pt-28">
          <div className="mx-auto max-w-3xl px-6">
            {slug && (
              <Link href={`/jobs/${slug}`} className="text-xs font-semibold text-white/80 hover:text-white">
                &larr; Back to the job
              </Link>
            )}
            <h1 className="mt-2 text-2xl text-white sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm font-semibold text-white/80">{subtitle}</p>}
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-6 py-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}
