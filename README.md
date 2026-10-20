# GBR Careers (Roblox Community)

Recruitment site for the GBR Roblox railway community. Unofficial fan project, not affiliated with Great British Railways or FirstGroup plc. All roles are fictional community roles, not real employment.

Built with Next.js (App Router), TypeScript, Tailwind CSS, lucide-react and Supabase.

## Pages

- `/`: homepage with video hero, intro, "Our Functions" carousel, benefits, latest vacancies, job alerts form and community badges
- `/jobs`: job search with keyword search, filters (Division, Grade, Region, Job Category, Employment Type) and sorting
- `/jobs?division=train-crew`: job search pre-filtered to one division
- `/jobs?favourites=1`: jobs saved with "Add to Favourites"
- `/jobs/[slug]`: job detail page

## Run locally on Windows PowerShell

You need Node.js 18.18 or newer (https://nodejs.org).

```powershell
npm.cmd install
npm.cmd run dev
```

Then open http://localhost:3000.

## Supabase

1. Copy `.env.example` to `.env.local` and fill in your project URL and publishable key.
2. In the Supabase SQL Editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Only rows with `status = 'published'` appear on the site.

Without `.env.local`, the site uses the demo jobs in `lib/jobs.ts`.

Older rows that only have `department` still work: the site maps them to a division and fills in defaults for the new fields.

## Media

Add your images and hero video to `public/media/`. See `public/media/README.txt` for the file names. Screenshots from your Roblox game work well.

## Still to do

- Point the "Apply Now" buttons at your application form or Discord invite (`app/jobs/[slug]/page.tsx`)
- Save job alert sign-ups to Supabase (`components/JobAlertsForm.tsx`)
