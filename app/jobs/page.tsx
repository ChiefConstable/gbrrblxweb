import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobSearch from "@/components/JobSearch";
import Badges from "@/components/Badges";
import ScrollToTop from "@/components/ScrollToTop";
import { getPublishedJobs } from "@/lib/jobs";

export const metadata: Metadata = { title: "Job Search | GBR Careers (Roblox Community)" };

type Props = { searchParams: Promise<{ division?: string | string[]; favourites?: string }> };

export default async function JobsPage({ searchParams }: Props) {
  const { division, favourites } = await searchParams;
  const favouritesOnly = favourites === "1";
  const jobs = await getPublishedJobs(500);
  const initialDivision = Array.isArray(division) ? division[0] : division;

  return (
    <>
      <Header />
      <main>
        <section className="bg-brand-dark pb-12 pt-28">
          <div className="mx-auto max-w-7xl px-6">
            <h1 className="text-3xl text-white sm:text-4xl">{favouritesOnly ? "Your Favourite Vacancies" : "Search GBR Vacancies"}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-white/80">
              Find your next role in the GBR Roblox railway community. Filter by division, grade, region and more.
            </p>
          </div>
        </section>
        <JobSearch
          key={`${initialDivision ?? "all"}-${favouritesOnly}`}
          jobs={jobs}
          initialDivision={initialDivision}
          favouritesOnly={favouritesOnly}
        />
        <Badges />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
