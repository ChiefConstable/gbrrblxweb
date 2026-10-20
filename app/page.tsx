import Header from "@/components/Header";
import HeroVideo from "@/components/HeroVideo";
import Intro from "@/components/Intro";
import FunctionsCarousel from "@/components/FunctionsCarousel";
import Benefits from "@/components/Benefits";
import PhotoStrip from "@/components/PhotoStrip";
import LatestVacancies from "@/components/LatestVacancies";
import JobAlertsForm from "@/components/JobAlertsForm";
import Badges from "@/components/Badges";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { getPublishedJobs } from "@/lib/jobs";

export default async function HomePage() {
  const jobs = await getPublishedJobs(6);

  return (
    <>
      <Header />
      <main>
        <HeroVideo />
        <Intro />
        <FunctionsCarousel />
        <Benefits />
        <PhotoStrip />
        <LatestVacancies jobs={jobs} />
        <JobAlertsForm />
        <Badges />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
