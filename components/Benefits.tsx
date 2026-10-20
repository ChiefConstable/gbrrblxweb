import { HeartPulse, PiggyBank, ShieldCheck, TrainFront, type LucideIcon } from "lucide-react";

type Benefit = {
  title: string;
  icon: LucideIcon;
  points: string[];
};

const BENEFITS: Benefit[] = [
  {
    title: "Travel Benefits",
    icon: TrainFront,
    points: [
      "Free cab rides on every route in the network",
      "Early access to new lines and rolling stock",
      "Priority seats on special event services",
      "Staff-only depot and yard tours",
    ],
  },
  {
    title: "Policies that Care",
    icon: ShieldCheck,
    points: [
      "Flexible shifts that fit around school and life",
      "Clear, fair promotion and disciplinary process",
      "Zero tolerance for bullying or harassment",
      "Take a break any time with no pressure",
    ],
  },
  {
    title: "Financial Security",
    icon: PiggyBank,
    points: [
      "Earn in-game pay for every shift you work",
      "Bonus rewards for punctual services",
      "Long service milestones and badges",
      "No cost to join, ever",
    ],
  },
  {
    title: "Health & Wellbeing",
    icon: HeartPulse,
    points: [
      "Friendly mentors for every new starter",
      "Regular community events and socials",
      "Welfare team you can talk to in confidence",
      "Reminders to rest during long sessions",
    ],
  },
];

export default function Benefits() {
  return (
    <section className="bg-gray-100 py-20" aria-labelledby="benefits-heading">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="benefits-heading" className="text-center text-3xl sm:text-4xl">
          Benefits at GBR
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ title, icon: Icon, points }) => (
            <article key={title} className="flex flex-col overflow-hidden rounded-sm bg-white shadow-sm">
              <div className="flex flex-col items-center gap-4 bg-brand-dark px-6 py-8 text-center">
                <Icon size={56} strokeWidth={1} className="text-white" aria-hidden="true" />
                <h3 className="text-lg text-white">{title}</h3>
              </div>
              <ul className="flex-1 list-disc space-y-2 px-8 py-6 text-sm leading-7 marker:text-brand-green">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
