import { Award, BadgeCheck, GraduationCap, ShieldCheck, type LucideIcon } from "lucide-react";

// Original community badges for GBR. These are not real-world accreditations.
const BADGES: { label: string; sub: string; icon: LucideIcon }[] = [
  { label: "Verified Group", sub: "Official GBR Roblox group", icon: BadgeCheck },
  { label: "Safe Community", sub: "Moderated 7 days a week", icon: ShieldCheck },
  { label: "Trained Mentors", sub: "Support for every new starter", icon: GraduationCap },
  { label: "Fair Recruitment", sub: "Open, transparent applications", icon: Award },
];

export default function Badges() {
  return (
    <section aria-label="Our community commitments" className="border-t border-gray-200 bg-white py-12">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
        {BADGES.map(({ label, sub, icon: Icon }) => (
          <li key={label} className="flex flex-col items-center text-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand-green/30 bg-brand-dark text-white">
              <Icon size={40} strokeWidth={1.25} aria-hidden="true" />
            </span>
            <span className="mt-3 font-heading text-sm font-bold text-brand-heading">{label}</span>
            <span className="mt-0.5 text-xs text-gray-500">{sub}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
