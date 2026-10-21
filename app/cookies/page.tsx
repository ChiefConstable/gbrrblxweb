import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { Prose } from "@/components/info/InfoPage";
import CookiePreferencesButton from "@/components/info/CookiePreferencesButton";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookies Policy | GBR Careers (Roblox Community)",
  description: "The cookies and browser storage GBR Careers uses, and how to control them.",
};

const ROWS: [string, string, string, string][] = [
  ["authjs.session-token", "Cookie", "Keeps you signed in", "Up to 30 days"],
  ["authjs.csrf-token", "Cookie", "Protects sign-in forms from misuse", "Session"],
  ["authjs.callback-url", "Cookie", "Returns you to the right page after signing in", "Session"],
  ["authjs.state, authjs.pkce.code_verifier", "Cookie", "Secures the sign-in hand-off with Roblox or Discord", "15 minutes"],
  ["gbr-cookie-consent", "Local storage", "Remembers your cookie choice", "Until cleared"],
  ["gbr-favourite-jobs", "Local storage", "Remembers jobs you saved as favourites", "Until cleared"],
];

export default function CookiesPage() {
  return (
    <InfoPage title="Cookies Policy" intro={`Last updated ${SITE.policiesUpdated}`}>
      <Prose>
        <p>
          Cookies are small files a website saves in your browser. Local storage is similar, but stays on your device
          and isn&apos;t sent to our servers. This page lists everything GBR Careers stores.
        </p>

        <h2>Strictly necessary</h2>
        <p>The site needs these to work, so they&apos;re always on. Some cookie names start with __Secure- or __Host-.</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Lasts</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([name, type, purpose, lasts]) => (
              <tr key={name}>
                <td className="font-mono text-xs">{name}</td>
                <td>{type}</td>
                <td>{purpose}</td>
                <td>{lasts}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Performance</h2>
        <p>
          We don&apos;t currently use any performance or analytics cookies. If we add them in future, they&apos;ll only
          run if you&apos;ve allowed them in your cookie preferences.
        </p>

        <h2>Advertising</h2>
        <p>We don&apos;t use advertising or tracking cookies, and we don&apos;t sell your information.</p>

        <h2>Changing your settings</h2>
        <p>You can change your choice at any time:</p>
        <p>
          <CookiePreferencesButton />
        </p>
        <p>
          You can also block or delete cookies in your browser settings. If you block strictly necessary cookies,
          you won&apos;t be able to sign in. Find out more at{" "}
          <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
            allaboutcookies.org
          </a>
          .
        </p>

        <h2>More information</h2>
        <p>
          See our <Link href="/privacy">Privacy Policy</Link> for how we handle your information.
        </p>
      </Prose>
    </InfoPage>
  );
}
