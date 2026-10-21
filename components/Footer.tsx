"use client";

import Link from "next/link";
import { openCookiePreferences } from "@/components/CookieConsent";

const LINKS = [
  { label: "Sitemap", href: "/sitemap" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Cookies Policy", href: "/cookies" },
  { label: "Terms of Use", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-footerBlue text-[11px] text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p>
          &copy;2026 GBR Roblox. All Rights Reserved. Not affiliated with Great British Railways or FirstGroup plc.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 [&_a]:inline-block [&_a]:py-1 [&_button]:py-1">
            {LINKS.slice(0, 3).map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" onClick={openCookiePreferences} className="hover:underline">
                Cookie Preferences
              </button>
            </li>
            <li>
              <Link href={LINKS[3].href} className="hover:underline">
                {LINKS[3].label}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
