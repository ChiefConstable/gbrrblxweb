import type { Metadata } from "next";
import { Leaf, Recycle, TrainFront, Zap } from "lucide-react";
import InfoPage, { Band, SectionTitle, TextImage } from "@/components/info/InfoPage";
import InsidersSection from "@/components/info/InsidersSection";

export const metadata: Metadata = {
  title: "Sustainability | GBR Careers (Roblox Community)",
  description: "How GBR keeps its community healthy for the long run, and celebrates rail as the greener way to travel.",
};

const PILLARS = [
  { icon: TrainFront, title: "Celebrating greener travel", text: "Our network shows why rail matters: electric routes, modern trains and stations people want to use." },
  { icon: Zap, title: "An efficient game", text: "Our engineers keep the game light and fast, so it runs well on older devices and uses less power." },
  { icon: Recycle, title: "Built to last", text: "Reusable building kits and tidy code mean new lines take less effort and old ones stay maintained." },
  { icon: Leaf, title: "A healthy community", text: "Sensible shift lengths, break reminders and a welfare team, so members can enjoy GBR for years." },
];

export default function SustainabilityPage() {
  return (
    <InfoPage
      title="Sustainability"
      intro="Rail is one of the greenest ways to travel, and a great community should be built to last too. Here's how we think about both."
      image="/media/page-sustainability.jpg"
    >
      <TextImage title="Showing what rail can do" image="/media/page-sustainability-2.jpg" imageAlt="An electric train crossing a viaduct in the GBR game">
        <p>
          Railways move huge numbers of people with far lower emissions than cars or planes. Our virtual network lets
          players experience that: frequent services, electrified main lines and well-connected stations.
        </p>
        <p>
          Many members tell us GBR sparked a real interest in transport, engineering or sustainability, and we love
          that.
        </p>
      </TextImage>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle center>Our sustainability pillars</SectionTitle>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-sm bg-white p-6 text-center">
                <Icon size={40} strokeWidth={1.25} className="mx-auto text-brand-dark" aria-hidden="true" />
                <h3 className="mt-4 text-base">{title}</h3>
                <p className="mt-2 text-sm leading-6">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Band title="A community that looks after itself">
        <p>
          Sustainability isn&apos;t just about the planet. We want GBR to still be a great place in years to come, so we
          share knowledge widely, train new leaders early, and never let the railway depend on just one person.
        </p>
      </Band>

      <InsidersSection />
    </InfoPage>
  );
}
