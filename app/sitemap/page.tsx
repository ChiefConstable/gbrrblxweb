import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { SectionTitle } from "@/components/info/InfoPage";
import { getPublishedJobs } from "@/lib/jobs";

export const metadata: Metadata = { title: "Sitemap | GBR Careers (Roblox Community)" };
export const dynamic = "force-dynamic";

const SECTIONS: { title: string; links: [string, string][] }[] = [
  {
    title: "Careers",
    links: [
      ["Home", "/"],
      ["Search vacancies", "/jobs"],
      ["Saved favourites", "/jobs?favourites=1"],
      ["Register for job alerts", "/#job-alerts"],
      ["My applications", "/applications"],
      ["Sign in", "/signin"],
    ],
  },
  {
    title: "Our divisions",
    links: [
      ["Train Crew", "/jobs?division=train-crew"],
      ["Stations", "/jobs?division=stations"],
      ["Control & Operations", "/jobs?division=control-operations"],
      ["Engineering", "/jobs?division=engineering"],
      ["Head Office", "/jobs?division=head-office"],
    ],
  },
  {
    title: "Life at GBR",
    links: [
      ["Diversity & Inclusion", "/diversity-and-inclusion"],
      ["Development", "/development"],
      ["Sustainability", "/sustainability"],
      ["Talk to Our Insiders", "/insiders"],
      ["FAQs", "/faqs"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "/privacy"],
      ["Cookies Policy", "/cookies"],
      ["Terms of Use", "/terms"],
    ],
  },
];

export default async function SitemapPage() {
  const jobs = await getPublishedJobs(500);
  return (
    <InfoPage title="Sitemap">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <SectionTitle>{s.title}</SectionTitle>
            <ul className="mt-5 space-y-2 text-sm">
              {s.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-brand-green hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="sm:col-span-2 lg:col-span-2">
          <SectionTitle>Current vacancies</SectionTitle>
          <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            {jobs.map((j) => (
              <li key={j.slug}>
                <Link href={`/jobs/${j.slug}`} className="text-brand-green hover:underline">
                  {j.title}, {j.location}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </InfoPage>
  );
}
