import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-6 pb-32 pt-40 text-center">
        <h1 className="text-4xl">That stop doesn&apos;t exist.</h1>
        <p className="mt-4 leading-8">We couldn&apos;t find the page you requested. It may have moved, or the vacancy may have closed.</p>
        <Link href="/jobs" className="btn-pill-sm mt-8">
          Back to vacancies
        </Link>
      </main>
      <Footer />
    </>
  );
}
