"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  {
    label: "Our Divisions",
    href: "/#functions",
    children: [
      { label: "Train Crew", href: "/jobs?division=train-crew" },
      { label: "Stations", href: "/jobs?division=stations" },
      { label: "Control & Operations", href: "/jobs?division=control-operations" },
      { label: "Engineering", href: "/jobs?division=engineering" },
      { label: "Head Office", href: "/jobs?division=head-office" },
    ],
  },
  { label: "Diversity & Inclusion", href: "#" },
  { label: "Development", href: "#" },
  { label: "Sustainability", href: "#" },
  { label: "Talk to Our Insiders", href: "#" },
  { label: "FAQs", href: "#" },
  {
    label: "Job Search",
    href: "/jobs",
    children: [
      { label: "All Vacancies", href: "/jobs" },
      { label: "Latest Vacancies", href: "/#vacancies" },
      { label: "Job Alerts", href: "/#job-alerts" },
    ],
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdowns on outside click / Escape
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const solid = scrolled || mobileOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${
        solid ? "bg-white shadow-md" : "bg-neutral-600/85"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className={`flex flex-col leading-none ${solid ? "text-brand-heading" : "text-white"}`}
          aria-label="GBR Careers, Roblox railway community, home"
        >
          <span className="font-heading text-2xl">
            <span className="font-bold">GBR</span>{" "}
            <span className="font-light">Careers</span>
          </span>
          <span
            className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] ${
              solid ? "text-brand-green" : "text-white/80"
            }`}
          >
            Roblox Community
          </span>
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown((cur) => (cur === item.label ? null : item.label));
                      }}
                      className={`flex items-center gap-1 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                        solid ? "text-brand-heading hover:text-brand-green" : "text-white hover:text-white/80"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {openDropdown === item.label && (
                      <ul className="absolute left-0 top-full mt-4 min-w-[220px] rounded-sm bg-white py-2 shadow-lg ring-1 ring-black/5">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className="block px-4 py-2 text-sm text-brand-heading hover:bg-gray-50 hover:text-brand-green"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                      solid ? "text-brand-heading hover:text-brand-green" : "text-white hover:text-white/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full bg-brand-pink px-5 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:brightness-110 sm:inline-flex"
          >
            Accessibility Tool
          </button>

          {/* Mobile toggle */}
          <button
            type="button"
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full xl:hidden ${
              solid ? "text-brand-heading hover:bg-gray-100" : "text-white hover:bg-white/15"
            }`}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-gray-100 bg-white shadow-lg xl:hidden"
        >
          <ul className="divide-y divide-gray-100">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-6 py-4 text-[13px] font-semibold uppercase tracking-wide text-brand-heading hover:bg-gray-50 hover:text-brand-green"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="pb-2">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-10 py-2 text-sm text-gray-600 hover:text-brand-green"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="px-6 py-4 sm:hidden">
              <button
                type="button"
                className="w-full rounded-full bg-brand-pink px-5 py-3 text-xs font-bold uppercase tracking-wide text-white"
              >
                Accessibility Tool
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
