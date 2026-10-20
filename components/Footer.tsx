import Link from "next/link";

const LINKS = ["Sitemap", "Privacy Policy", "Cookies Policy", "Cookie Preferences", "Terms of Use"];

export default function Footer() {
  return (
    <footer className="bg-footerBlue text-[11px] text-white">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p>
          &copy;2026 GBR Roblox. All Rights Reserved. Not affiliated with Great British Railways or FirstGroup plc.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((label) => (
              <li key={label}>
                <Link href="#" className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
