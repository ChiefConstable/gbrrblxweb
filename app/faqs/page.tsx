import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import InfoPage, { SectionTitle } from "@/components/info/InfoPage";
import InsidersSection from "@/components/info/InsidersSection";

export const metadata: Metadata = {
  title: "FAQs | GBR Careers (Roblox Community)",
  description: "Answers to common questions about joining and applying to the GBR Roblox railway community.",
};

type QA = { q: string; a: React.ReactNode };

const GROUPS: { title: string; items: QA[] }[] = [
  {
    title: "About GBR",
    items: [
      {
        q: "Is GBR a real railway company?",
        a: "No. GBR is an unofficial Roblox railway roleplay community run by volunteers. We're not affiliated with Great British Railways, FirstGroup, Roblox Corporation or Discord, and roles are community roles, not real jobs.",
      },
      {
        q: "Does it cost anything to join?",
        a: "No. Joining, training and working shifts are completely free. In-game pay is virtual currency only.",
      },
      {
        q: "How old do I need to be?",
        a: "You need to be 13 or over to apply, which matches the age you need to be to use Discord.",
      },
    ],
  },
  {
    title: "Applying",
    items: [
      {
        q: "How do I apply?",
        a: (
          <>
            Find a role on the <Link href="/jobs">vacancies page</Link>, sign in with Roblox or Discord, and fill in the
            short form. It takes about 5 minutes.
          </>
        ),
      },
      {
        q: "Do I need experience?",
        a: "No. Most of our members started with none. We train you from scratch and pair you with a mentor.",
      },
      {
        q: "What happens after I apply?",
        a: (
          <>
            You'll get an email with your reference number. Depending on the role, the next steps can include a short
            quiz, a group interview and a one-to-one interview. You can track every step on{" "}
            <Link href="/applications">My applications</Link>.
          </>
        ),
      },
      {
        q: "Can I apply for more than one role?",
        a: "Yes. You can have one open application per role. If you're unsuccessful, you can apply for a different role straight away, or for the same role again after 30 days.",
      },
      {
        q: "I didn't get an email. What should I do?",
        a: "Check your spam or junk folder first. Our emails come from noreply@gbrrblx.xyz. You can also see your application status on My applications at any time.",
      },
    ],
  },
  {
    title: "Working at GBR",
    items: [
      {
        q: "How much time do I need to give?",
        a: "Most roles ask for about two shifts a week, booked around school, work and life. You can take breaks whenever you need to.",
      },
      {
        q: "Can I move to a different division later?",
        a: (
          <>
            Yes, and we encourage it. Lots of drivers started on the platforms. See <Link href="/development">Development</Link>{" "}
            for how training and grades work.
          </>
        ),
      },
      {
        q: "Who do I talk to if something's wrong?",
        a: "Our welfare team is there to help in confidence. You can also contact any member of the Recruitment Team on the GBR Discord server.",
      },
    ],
  },
  {
    title: "Your account and data",
    items: [
      {
        q: "What do you see when I sign in with Roblox or Discord?",
        a: (
          <>
            Your username, avatar and account ID, plus your email if you sign in with Discord. We never see your
            password. Full details are in our <Link href="/privacy">Privacy Policy</Link>.
          </>
        ),
      },
      {
        q: "How do I stop job alert emails?",
        a: "Click the unsubscribe link at the bottom of any job alert email and you'll be removed straight away.",
      },
      {
        q: "How do I get my data deleted?",
        a: (
          <>
            Contact the Recruitment Team and we'll delete your applications and alerts. See the{" "}
            <Link href="/privacy">Privacy Policy</Link> for your rights.
          </>
        ),
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <InfoPage title="FAQs" intro="Quick answers to the questions we're asked most about joining GBR.">
      <div className="mx-auto max-w-3xl px-6 py-16 [&_a]:font-semibold [&_a]:text-brand-green [&_a]:underline">
        {GROUPS.map((group) => (
          <section key={group.title} className="mb-12">
            <SectionTitle>{group.title}</SectionTitle>
            <div className="mt-6 divide-y divide-gray-200 border-y border-gray-200">
              {group.items.map(({ q, a }) => (
                <details key={q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-brand-heading hover:text-brand-green [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="pb-5 text-sm leading-7">{a}</div>
                </details>
              ))}
            </div>
          </section>
        ))}
        <p className="text-center text-sm">
          Still stuck? <Link href="/insiders">Talk to our Insiders</Link>.
        </p>
      </div>
      <InsidersSection />
    </InfoPage>
  );
}
