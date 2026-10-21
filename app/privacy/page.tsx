import type { Metadata } from "next";
import Link from "next/link";
import InfoPage, { Prose } from "@/components/info/InfoPage";
import { SITE, contactText } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | GBR Careers (Roblox Community)",
  description: "What information GBR Careers collects, why, and your rights.",
};

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy" intro={`Last updated ${SITE.policiesUpdated}`}>
      <Prose>
        <p>
          This policy explains what information GBR Careers ({SITE.url.replace(/^https?:\/\//, "")}) collects, why we
          collect it, and the choices you have. GBR is an unofficial Roblox railway roleplay community run by volunteers.
          It is not affiliated with Great British Railways, FirstGroup plc, Roblox Corporation or Discord. In this
          policy, &ldquo;we&rdquo; means the GBR community team that runs this website.
        </p>

        <h2>Information we collect</h2>
        <h3>When you sign in</h3>
        <p>You can sign in with Roblox or Discord. We receive:</p>
        <ul>
          <li>your account ID and username</li>
          <li>your profile picture</li>
          <li>your email address, if you sign in with Discord</li>
        </ul>
        <p>We never see or store your Roblox or Discord password.</p>

        <h3>When you apply for a role</h3>
        <ul>
          <li>your Roblox username, email address and (optionally) Discord username</li>
          <li>your answers about experience, motivation and availability</li>
          <li>confirmation that you are 13 or over</li>
          <li>the role, status of your application, interview times and any notes our team adds</li>
        </ul>

        <h3>When you sign up for job alerts</h3>
        <ul>
          <li>your Roblox username and email address</li>
          <li>the types of role you want to hear about</li>
          <li>when you confirmed or unsubscribed</li>
        </ul>

        <h3>Stored on your device</h3>
        <p>
          Sign-in cookies, your cookie choice and any jobs you save as favourites. See our{" "}
          <Link href="/cookies">Cookies Policy</Link>.
        </p>

        <h2>How we use your information</h2>
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Why we&apos;re allowed to</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Signing you in and keeping your account secure</td>
              <td>Needed to provide the service you asked for</td>
            </tr>
            <tr>
              <td>Reviewing your application and emailing you about it</td>
              <td>Needed to process the application you sent us</td>
            </tr>
            <tr>
              <td>Sending job alert emails</td>
              <td>Your consent, which you confirm by email and can withdraw at any time</td>
            </tr>
            <tr>
              <td>Keeping the community safe and preventing misuse</td>
              <td>Our legitimate interest in running a safe community</td>
            </tr>
          </tbody>
        </table>
        <p>We don&apos;t sell your information, show adverts, or use your information for marketing.</p>

        <h2>Who we share it with</h2>
        <p>Only the services we need to run the site, which process data on our behalf:</p>
        <ul>
          <li>
            <strong>Vercel</strong>: hosts the website
          </li>
          <li>
            <strong>Supabase</strong>: stores vacancies, applications and job alert sign-ups
          </li>
          <li>
            <strong>Resend</strong>: sends our emails
          </li>
          <li>
            <strong>Roblox</strong> and <strong>Discord</strong>: confirm who you are when you sign in
          </li>
        </ul>
        <p>
          Some of these services store data outside the UK, including in the United States. They are required to protect
          it to an equivalent standard. Our recruitment volunteers can see applications for the roles they manage.
        </p>

        <h2>How long we keep it</h2>
        <ul>
          <li>Applications: we aim to delete these within 12 months of a decision</li>
          <li>Job alert sign-ups: until you unsubscribe (unconfirmed sign-ups are cleared out regularly)</li>
          <li>Sign-in sessions: up to 30 days on your device</li>
        </ul>
        <p>You can ask us to delete your information sooner at any time.</p>

        <h2>Your rights</h2>
        <p>Under UK data protection law you can ask us to:</p>
        <ul>
          <li>give you a copy of the information we hold about you</li>
          <li>correct anything that&apos;s wrong</li>
          <li>delete your information</li>
          <li>stop or limit how we use it</li>
        </ul>
        <p>
          To make a request, contact {contactText()}. If you&apos;re unhappy with how we&apos;ve handled your information,
          you can complain to the UK Information Commissioner&apos;s Office at{" "}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
            ico.org.uk
          </a>
          .
        </p>

        <h2>Children</h2>
        <p>
          You must be 13 or over to apply or sign up for alerts. If you believe someone under 13 has given us their
          information, contact us and we&apos;ll delete it.
        </p>

        <h2>Changes</h2>
        <p>
          We&apos;ll update the date at the top when this policy changes. Significant changes will be announced on the GBR
          Discord server.
        </p>
      </Prose>
    </InfoPage>
  );
}
