import type { Metadata } from "next";
import { Accessibility, HeartHandshake, Languages, Megaphone, ShieldCheck, Users } from "lucide-react";
import InfoPage, { Band, SectionTitle, TextImage } from "@/components/info/InfoPage";
import InsidersSection from "@/components/info/InsidersSection";

export const metadata: Metadata = {
  title: "Diversity & Inclusion | GBR Careers (Roblox Community)",
  description: "How the GBR Roblox railway community makes sure everyone feels welcome, safe and able to progress.",
};

const COMMITMENTS = [
  { icon: ShieldCheck, title: "Zero tolerance", text: "No bullying, harassment or discrimination, in game or on Discord. Reports are handled quickly and confidentially." },
  { icon: Users, title: "Fair recruitment", text: "Every application is scored against the same criteria, and interview panels always include more than one person." },
  { icon: Accessibility, title: "Accessible by default", text: "Text chat alternatives to voice, flexible shift times, and the option to ask for adjustments at any stage." },
  { icon: Languages, title: "Welcoming to all", text: "Members from every country, background and experience level. Nobody needs to have played a railway game before." },
  { icon: Megaphone, title: "Your voice counts", text: "Regular community feedback polls and open suggestion channels shape how GBR is run." },
  { icon: HeartHandshake, title: "Welfare team", text: "Trained volunteers you can talk to privately if something isn't right, on or off the railway." },
];

const NETWORKS = [
  { title: "New Starters Network", text: "Buddy sessions and a relaxed weekly drop-in for anyone in their first month." },
  { title: "Pride on the Rails", text: "A friendly space for LGBTQ+ members and allies, plus our annual Pride livery service." },
  { title: "Neurodiversity Network", text: "Tips, quiet-shift options and peer support for neurodivergent members." },
  { title: "Women in GBR", text: "Mentoring and meet-ups to grow the number of women in driving, signalling and leadership roles." },
];

export default function DiversityPage() {
  return (
    <InfoPage
      title="Equity, Diversity and Inclusion"
      intro="GBR is for everyone who loves railways. We want every member to feel safe, respected and able to grow."
      image="/media/page-diversity.jpg"
    >
      <TextImage title="A community where everyone belongs" image="/media/page-diversity-2.jpg" imageAlt="GBR members at a community event">
        <p>
          The GBR railway only runs because of the people behind it. Our members come from all over the world, with
          different backgrounds, ages, abilities and experiences, and that mix makes the community better.
        </p>
        <p>
          We work hard to make sure everyone gets a fair chance to join, take part and move up, whether you want to
          drive trains, run a station, signal the network or build the game itself.
        </p>
      </TextImage>

      <Band title="How we create an inclusive community">
        <p>
          Inclusion isn&apos;t a one-off statement. It&apos;s built into how we recruit, train and run every shift, and we
          keep checking how we&apos;re doing.
        </p>
      </Band>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionTitle center>Our commitments</SectionTitle>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMMITMENTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-sm border border-gray-200 bg-white p-6">
              <Icon size={36} strokeWidth={1.25} className="text-brand-dark" aria-hidden="true" />
              <h3 className="mt-4 text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-6">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-brand-dark py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl text-white sm:text-3xl">Member networks</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {NETWORKS.map((n) => (
              <li key={n.title} className="rounded-sm bg-white p-6">
                <h3 className="text-base">{n.title}</h3>
                <p className="mt-2 text-sm leading-6">{n.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <InsidersSection />
    </InfoPage>
  );
}
