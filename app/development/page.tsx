import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, GraduationCap, Route, UserCheck } from "lucide-react";
import InfoPage, { Band, SectionTitle, TextImage } from "@/components/info/InfoPage";
import InsidersSection from "@/components/info/InsidersSection";

export const metadata: Metadata = {
  title: "Development | GBR Careers (Roblox Community)",
  description: "Training, mentoring and promotion paths in the GBR Roblox railway community.",
};

const STEPS = [
  { icon: UserCheck, title: "Welcome & induction", text: "A short tour of the network, the rulebook basics and how shifts work." },
  { icon: BookOpen, title: "Role training", text: "Hands-on sessions with a trainer for your division, at a pace that suits you." },
  { icon: GraduationCap, title: "Assessment", text: "A friendly practical check. If it's not quite there yet, you simply try again." },
  { icon: Route, title: "Mentored shifts", text: "Your first shifts are alongside an experienced member until you feel confident." },
  { icon: Award, title: "Grow and progress", text: "Move up the grades, cross-train into new divisions, or become a trainer yourself." },
];

const GRADES = [
  ["Grade 1", "Trainee and entry roles", "Customer host, station dispatcher, trainee driver"],
  ["Grade 2", "Qualified roles", "Guard, map builder, HR assistant"],
  ["Grade 3", "Experienced roles", "Train driver, signaller, Lua scripter"],
  ["Grade 4", "Leadership roles", "Station manager, network controller, division leads"],
];

export default function DevelopmentPage() {
  return (
    <InfoPage
      title="Development"
      intro="Start wherever you like and go as far as you want. Every role at GBR comes with training, mentoring and a clear path to progress."
      image="/media/page-development.jpg"
    >
      <TextImage title="Learn by doing" image="/media/page-development-2.jpg" imageAlt="A trainer showing a new GBR member the controls">
        <p>
          Most of our members joined with no railway roleplay experience at all. Our trainers break every role down
          into simple steps, and you&apos;ll always have someone to ask.
        </p>
        <p>
          Once you&apos;re settled, you can build new skills: cross-train into another division, take on extra
          responsibility, or train the next group of starters.
        </p>
      </TextImage>

      <section className="bg-gray-100 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle center>Your training journey</SectionTitle>
          <ol className="mt-10 grid gap-5 md:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="rounded-sm bg-white p-5 text-center">
                <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                  {i + 1}
                </span>
                <Icon size={32} strokeWidth={1.25} className="mx-auto mt-4 text-brand-dark" aria-hidden="true" />
                <h3 className="mt-3 text-sm">{title}</h3>
                <p className="mt-2 text-xs leading-5">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <SectionTitle center>How grades work</SectionTitle>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-brand-dark text-brand-heading">
                <th className="px-3 py-2">Grade</th>
                <th className="px-3 py-2">Level</th>
                <th className="px-3 py-2">Example roles</th>
              </tr>
            </thead>
            <tbody>
              {GRADES.map(([g, level, roles]) => (
                <tr key={g} className="border-b border-gray-200">
                  <td className="px-3 py-3 font-bold text-brand-green">{g}</td>
                  <td className="px-3 py-3">{level}</td>
                  <td className="px-3 py-3">{roles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          Higher grades earn more in-game pay per shift and open up leadership and training roles.
        </p>
      </section>

      <Band title="Ready to start?">
        <p>Every vacancy shows its grade, so you can see exactly where you&apos;d start.</p>
        <p>
          <Link href="/jobs" className="btn-pill-sm mt-2">
            Browse vacancies
          </Link>
        </p>
      </Band>

      <InsidersSection />
    </InfoPage>
  );
}
