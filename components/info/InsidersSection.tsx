import Link from "next/link";
import { INSIDERS } from "@/lib/insiders";
import { SectionTitle } from "@/components/info/InfoPage";

/** "Got a question? Talk to our Insiders" cards. */
export default function InsidersSection({ title = "Got a question? Talk to our Insiders", limit = 3 }: { title?: string; limit?: number }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle center>{title}</SectionTitle>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INSIDERS.slice(0, limit).map((p) => (
            <li key={p.slug}>
              <InsiderCard slug={p.slug} />
            </li>
          ))}
        </ul>
        {limit < INSIDERS.length && (
          <div className="mt-10 text-center">
            <Link href="/insiders" className="btn-pill-sm">
              Meet all our Insiders
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function InsiderCard({ slug }: { slug: string }) {
  const p = INSIDERS.find((i) => i.slug === slug);
  if (!p) return null;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-sm border border-gray-200 bg-white text-center shadow-sm">
      <div className="h-16 bg-brand-pink" />
      <span
        aria-hidden="true"
        className="mx-auto -mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-brand-dark font-heading text-2xl font-bold text-white"
      >
        {p.name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase()}
      </span>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-3">
        <h3 className="text-lg">{p.name}</h3>
        <p className="text-xs text-gray-500">
          {p.role} · {p.division}
        </p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-brand-heading">Top advice</p>
        <p className="mt-1 flex-1 text-sm leading-6">&ldquo;{p.advice}&rdquo;</p>
        <Link href={`/insiders#${p.slug}`} className="mx-auto mt-5 rounded-full bg-brand-pink px-6 py-2 text-xs font-bold text-white hover:brightness-110">
          View profile
        </Link>
      </div>
    </article>
  );
}
