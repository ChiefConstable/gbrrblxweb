import { getPublishedJobs } from "@/lib/jobs";
import { SITE } from "@/lib/site";

// Machine-readable sitemap for search engines (the human one is at /sitemap).
export const dynamic = "force-dynamic";

const PAGES = [
  "/",
  "/jobs",
  "/diversity-and-inclusion",
  "/development",
  "/sustainability",
  "/insiders",
  "/faqs",
  "/sitemap",
  "/privacy",
  "/cookies",
  "/terms",
];

export async function GET() {
  const jobs = await getPublishedJobs(500);
  const urls = [
    ...PAGES.map((p) => ({ loc: `${SITE.url}${p}`, lastmod: undefined as string | undefined })),
    ...jobs.map((j) => ({ loc: `${SITE.url}/jobs/${j.slug}`, lastmod: j.posted_at.slice(0, 10) })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
