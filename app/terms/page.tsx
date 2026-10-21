import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { Prose } from "@/components/info/InfoPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use | GBR Careers (Roblox Community)",
  description: "The rules for using the GBR Careers website.",
};

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Use" intro={`Last updated ${SITE.policiesUpdated}`}>
      <Prose>
        <p>
          By using GBR Careers you agree to these terms. If you don&apos;t agree, please don&apos;t use the site.
        </p>

        <h2>About GBR</h2>
        <p>
          GBR is an unofficial, volunteer-run Roblox railway roleplay community. It is not affiliated with, endorsed by
          or connected to Great British Railways, FirstGroup plc, any real train operator, Roblox Corporation or Discord.
        </p>
        <p>
          All &ldquo;jobs&rdquo;, &ldquo;roles&rdquo;, &ldquo;pay&rdquo; and &ldquo;contracts&rdquo; on this site are
          community roleplay roles. They are not real employment, they carry no wages or legal employment rights, and
          in-game pay has no real-world value.
        </p>

        <h2>Who can use the site</h2>
        <ul>
          <li>You must be 13 or over to sign in, apply or sign up for job alerts.</li>
          <li>You must follow the Roblox Terms of Use and Discord Terms of Service.</li>
          <li>You must give honest information in applications.</li>
        </ul>

        <h2>Your account</h2>
        <p>
          You sign in with your own Roblox or Discord account. Keep it secure, and never share your password with anyone,
          including GBR staff. We will never ask for it.
        </p>

        <h2>Acceptable use</h2>
        <p>You must not:</p>
        <ul>
          <li>apply on behalf of someone else or pretend to be another person</li>
          <li>post or send anything abusive, hateful, sexual or harmful</li>
          <li>try to break, overload or get around the security of the site</li>
          <li>collect other members&apos; information or use the site to send spam</li>
        </ul>
        <p>
          We may refuse applications, close accounts&apos; access to the site, or remove members from the community if
          these terms or the community rules are broken.
        </p>

        <h2>Recruitment decisions</h2>
        <p>
          The GBR Recruitment Team decides who is offered a role. We try to be fair and consistent, but we don&apos;t
          have to give reasons for every decision.
        </p>

        <h2>Content and trademarks</h2>
        <p>
          The website text and design belong to the GBR community. Roblox and Discord names and logos belong to their
          owners. Please don&apos;t copy the site&apos;s content for other projects without asking.
        </p>

        <h2>Availability and liability</h2>
        <p>
          We run this site for free and provide it &ldquo;as is&rdquo;. We try to keep it working and accurate, but
          we can&apos;t promise it will always be available or error-free. As far as the law allows, we aren&apos;t
          responsible for any loss caused by using it. Nothing in these terms affects your legal rights.
        </p>

        <h2>Privacy</h2>
        <p>
          How we handle your information is explained in our <Link href="/privacy">Privacy Policy</Link> and{" "}
          <Link href="/cookies">Cookies Policy</Link>.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. The date at the top shows when they last changed. These terms are governed by the
          laws of England and Wales.
        </p>
      </Prose>
    </InfoPage>
  );
}
