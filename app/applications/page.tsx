import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { requireViewer } from "@/lib/guards";
import { STATUS_LABEL, STATUS_STYLE, formatReference, listApplicationsForApplicant } from "@/lib/applications";

export const metadata: Metadata = { title: "My applications | GBR Careers", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function MyApplicationsPage() {
  const viewer = await requireViewer("/applications");
  const applications = await listApplicationsForApplicant(viewer);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-4xl px-6 pb-20 pt-28">
        <h1 className="text-2xl sm:text-3xl">My applications</h1>
        <p className="mt-1 text-sm text-gray-600">Signed in as {viewer.name}</p>

        {applications.length === 0 ? (
          <div className="mt-10 rounded-sm border border-dashed border-gray-300 p-10 text-center">
            <p className="text-sm text-gray-600">You haven&apos;t applied for anything yet.</p>
            <Link href="/jobs" className="btn-pill-sm mt-6">
              Browse vacancies
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {applications.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/applications/${a.id}`}
                  className="flex flex-col gap-2 rounded-sm border border-gray-200 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <span className="font-bold text-brand-green">{a.job_title}</span>
                    <span className="block text-xs font-semibold text-brand-heading">
                      {a.job_location} · {formatReference(a.reference)} · applied {new Date(a.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <span className={`self-start rounded-full px-3 py-1 text-xs font-bold sm:self-auto ${STATUS_STYLE[a.status]}`}>
                    {a.status === "offered" ? "Offer: action needed" : STATUS_LABEL[a.status]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );
}
