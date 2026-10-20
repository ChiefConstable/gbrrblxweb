import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Job alerts | GBR Careers", robots: { index: false } };

type Props = { searchParams: Promise<{ status?: string }> };

const COPY: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "You're all set",
    body: "Your job alerts are confirmed. We'll email you as soon as a matching role opens in the GBR community.",
  },
  unsubscribed: {
    title: "You've unsubscribed",
    body: "You won't get any more job alert emails from us. You can sign up again at any time.",
  },
  invalid: {
    title: "That link didn't work",
    body: "It may have expired or already been used. Sign up again from the homepage if you'd like job alerts.",
  },
};

export default async function AlertsPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const copy = COPY[status ?? ""] ?? COPY.invalid;
  return (
    <>
      <Header />
      <main className="bg-gray-100 px-6 pb-24 pt-32">
        <div className="mx-auto max-w-md rounded-sm bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl">{copy.title}</h1>
          <p className="mt-3 text-sm leading-6">{copy.body}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/jobs" className="btn-pill-sm">
              Browse vacancies
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
