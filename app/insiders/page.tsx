import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import InfoPage, { SectionTitle } from "@/components/info/InfoPage";
import { INSIDERS } from "@/lib/insiders";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Talk to Our Insiders | GBR Careers (Roblox Community)",
  description: "Meet GBR members from every division and find out what it's really like to work on the railway.",
};

export default function InsidersPage() {
  return (
    <InfoPage
      title="Talk to Our Insiders"
      intro="Want to know what a role is really like? Our Insiders are members from every division who are happy to answer your questions."
      image="/media/page-insiders.jpg"
    >
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionTitle center>Meet the team</SectionTitle>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {INSIDERS.map((p) => (
            <li key={p.slug} id={p.slug} className="scroll-mt-24">
              <article className="flex h-full gap-5 rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
                <span
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-pink font-heading text-xl font-bold text-white"
                >
                  {p.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h3 className="text-lg">{p.name}</h3>
                  <p className="text-xs text-gray-500">
                    {p.role} · {p.division} · member since {p.joined}
                  </p>
                  <p className="mt-3 text-sm leading-6">{p.bio}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-brand-heading">Top advice</p>
                  <p className="text-sm italic leading-6">&ldquo;{p.advice}&rdquo;</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-brand-heading">Ask me about</p>
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {p.askMeAbout.map((t) => (
                      <li key={t} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <SectionTitle center>How to ask a question</SectionTitle>
          <p className="mt-6 text-sm leading-7">
            Join the GBR Discord server and post in the <strong>#ask-an-insider</strong> channel, mentioning who you&apos;d
            like to talk to. Insiders usually reply within a day. Please keep personal details private, and never share
            your password with anyone.
          </p>
          {SITE.discordInvite && (
            <a
              href={SITE.discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-8 py-3 text-sm font-bold text-white hover:bg-[#4752C4]"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Join the GBR Discord
            </a>
          )}
          <p className="mt-6 text-sm">
            Ready to apply? <Link href="/jobs" className="font-semibold text-brand-green underline">Browse vacancies</Link>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <SectionTitle center>Contact us</SectionTitle>
        <div className="mt-8 space-y-6 text-sm leading-7">
          <div>
            <h3 className="text-base">Recruitment questions</h3>
            <p className="mt-1">
              Questions about a vacancy or your application? Message the Recruitment Team on Discord, quoting your
              application reference (for example GBR-100001) if you have one.
            </p>
          </div>
          <div>
            <h3 className="text-base">Privacy and your data</h3>
            <p className="mt-1">
              See our <Link href="/privacy" className="font-semibold text-brand-green underline">Privacy Policy</Link> for
              how to access or delete your information.
            </p>
          </div>
        </div>
      </section>
    </InfoPage>
  );
}
