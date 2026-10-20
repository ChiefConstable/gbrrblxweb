import { createClient } from "@supabase/supabase-js";

// Job data layer.
// Reads published vacancies from Supabase when NEXT_PUBLIC_SUPABASE_URL and
// NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set (see .env.example). Without
// them, the site falls back to the demo jobs below so it still runs locally.
// Run supabase/schema.sql (then seed.sql) in the Supabase SQL Editor first.

export type Job = {
  id?: string;
  slug: string;
  title: string;
  location: string;
  contract_type: string; // e.g. "Permanent"
  employment_type: string; // e.g. "Full Time"
  division: string; // e.g. "Train Crew"
  region: string; // e.g. "Western"
  category: string; // e.g. "Driving"
  grade: string; // rank band within the community, e.g. "Grade 2"
  posted_at: string; // ISO date
  closing_date?: string | null; // ISO date
  pay?: string | null; // in-game pay, e.g. "120 credits per shift"
  description?: string | null;
  responsibilities?: string[] | null;
  requirements?: string[] | null;
};

export type JobDetail = Job & {
  reference: string;
  closing_date: string;
  pay: string;
  intro: string;
  responsibilities: string[];
  requirements: string[];
  working_pattern: string[];
  process: string[];
};

export const DIVISIONS = ["Train Crew", "Stations", "Control & Operations", "Engineering", "Head Office"] as const;

// Older rows only have `department`; map those to the new divisions.
const DEPARTMENT_TO_DIVISION: Record<string, string> = {
  "Train Operations": "Train Crew",
  "Onboard Services": "Train Crew",
  "Customer Experience": "Stations",
  "Station Operations": "Stations",
  "Network Control": "Control & Operations",
  "People & Recruitment": "Head Office",
  Engineering: "Engineering",
};

type JobRow = Partial<Job> & { id: string; slug: string; title: string; location: string; department?: string | null; posted_at: string };

function normalise(row: JobRow): Job {
  const department = row.department ?? undefined;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    location: row.location,
    contract_type: row.contract_type ?? "Permanent",
    employment_type: row.employment_type ?? "Full Time",
    division: row.division ?? (department && DEPARTMENT_TO_DIVISION[department]) ?? "Head Office",
    region: row.region ?? "Western",
    category: row.category ?? department ?? "General",
    grade: row.grade ?? "Grade 1",
    posted_at: row.posted_at,
    closing_date: row.closing_date ?? null,
    pay: row.pay ?? null,
    description: row.description ?? null,
    responsibilities: row.responsibilities ?? null,
    requirements: row.requirements ?? null,
  };
}

const DEMO_JOBS: Job[] = [
  { slug: "train-driver-london-paddington", title: "Train Driver", location: "London Paddington", contract_type: "Permanent", employment_type: "Full Time", division: "Train Crew", region: "London & Thames Valley", category: "Driving", grade: "Grade 3", posted_at: "2026-10-19" },
  { slug: "guard-bristol-temple-meads", title: "Guard", location: "Bristol Temple Meads", contract_type: "Permanent", employment_type: "Full Time", division: "Train Crew", region: "Western", category: "Customer Service", grade: "Grade 2", posted_at: "2026-10-18" },
  { slug: "signaller-reading-roc", title: "Signaller", location: "Reading ROC", contract_type: "Permanent", employment_type: "Full Time", division: "Control & Operations", region: "London & Thames Valley", category: "Signalling", grade: "Grade 3", posted_at: "2026-10-17" },
  { slug: "station-dispatcher-swindon", title: "Station Dispatcher", location: "Swindon", contract_type: "Permanent", employment_type: "Full Time", division: "Stations", region: "Western", category: "Customer Service", grade: "Grade 1", posted_at: "2026-10-16" },
  { slug: "network-controller-swindon-control", title: "Network Controller", location: "Swindon Control Centre", contract_type: "Permanent", employment_type: "Full Time", division: "Control & Operations", region: "Western", category: "Signalling", grade: "Grade 4", posted_at: "2026-10-15" },
  { slug: "hr-assistant-head-office", title: "HR Assistant", location: "Head Office", contract_type: "Permanent", employment_type: "Full Time", division: "Head Office", region: "Remote", category: "HR & Recruitment", grade: "Grade 2", posted_at: "2026-10-14" },
  { slug: "trainee-driver-plymouth", title: "Trainee Train Driver", location: "Plymouth", contract_type: "Fixed Term", employment_type: "Trainee", division: "Train Crew", region: "South West", category: "Driving", grade: "Grade 1", posted_at: "2026-10-13" },
  { slug: "customer-host-cardiff-central", title: "Customer Host", location: "Cardiff Central", contract_type: "Permanent", employment_type: "Part Time", division: "Stations", region: "Wales", category: "Customer Service", grade: "Grade 1", posted_at: "2026-10-12" },
  { slug: "map-builder-engineering", title: "Map Builder", location: "Engineering Studio", contract_type: "Permanent", employment_type: "Part Time", division: "Engineering", region: "Remote", category: "Development & Building", grade: "Grade 2", posted_at: "2026-10-11" },
  { slug: "lua-scripter-engineering", title: "Lua Scripter", location: "Engineering Studio", contract_type: "Permanent", employment_type: "Full Time", division: "Engineering", region: "Remote", category: "Development & Building", grade: "Grade 3", posted_at: "2026-10-10" },
  { slug: "events-coordinator-head-office", title: "Events Coordinator", location: "Head Office", contract_type: "Fixed Term", employment_type: "Part Time", division: "Head Office", region: "Remote", category: "Events", grade: "Grade 2", posted_at: "2026-10-09" },
  { slug: "station-manager-exeter-st-davids", title: "Station Manager", location: "Exeter St Davids", contract_type: "Permanent", employment_type: "Full Time", division: "Stations", region: "South West", category: "Management", grade: "Grade 4", posted_at: "2026-10-08" },
];

async function fetchAllJobs(): Promise<Job[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return DEMO_JOBS;

  try {
    const client = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await client
      .from("jobs")
      .select("*")
      .eq("status", "published")
      .order("posted_at", { ascending: false });
    if (error) {
      console.error("Supabase vacancies query failed:", error.message);
      return [];
    }
    return ((data ?? []) as JobRow[]).map(normalise);
  } catch (e) {
    console.error("Supabase connection error", e);
    return [];
  }
}

export async function getPublishedJobs(limit = 6): Promise<Job[]> {
  const jobs = await fetchAllJobs();
  return [...jobs].sort((a, b) => b.posted_at.localeCompare(a.posted_at)).slice(0, limit);
}

const PAY_BY_GRADE: Record<string, string> = {
  "Grade 1": "80 credits per shift",
  "Grade 2": "120 credits per shift",
  "Grade 3": "160 credits per shift",
  "Grade 4": "220 credits per shift",
};

const DIVISION_COPY: Record<string, { intro: string; responsibilities: string[]; requirements: string[] }> = {
  "Train Crew": {
    intro:
      "Our train crew keep the GBR timetable running. You'll work services across the network, look after passengers and make sure every departure leaves safely and on time.",
    responsibilities: [
      "Operate timetabled services following GBR rules and signals",
      "Carry out station stops, door checks and announcements",
      "Report faults and delays to Control promptly",
      "Help new crew members find their feet on shared shifts",
    ],
    requirements: [
      "A Roblox account in good standing",
      "Willingness to learn our routes and rulebook",
      "Clear, friendly communication in the GBR server",
      "Able to attend at least two shifts a week",
    ],
  },
  Stations: {
    intro:
      "Station teams are the first people our passengers meet. You'll keep platforms safe and organised, help players find their trains and dispatch services during busy events.",
    responsibilities: [
      "Welcome and assist passengers on the concourse and platforms",
      "Dispatch trains safely using GBR procedures",
      "Keep station information and announcements up to date",
      "Support crowd management during special events",
    ],
    requirements: [
      "A Roblox account in good standing",
      "Patient, helpful attitude towards other players",
      "Good awareness of what's happening around you",
      "Able to attend at least two shifts a week",
    ],
  },
  "Control & Operations": {
    intro:
      "Control sees the whole railway at once. You'll set routes, manage disruption and make the calls that keep trains moving safely across the map.",
    responsibilities: [
      "Signal trains through your area using the GBR signalling system",
      "Manage delays and re-route services during disruption",
      "Keep crews informed with clear radio messages",
      "Log incidents accurately for the operations team",
    ],
    requirements: [
      "A Roblox account in good standing",
      "Calm decision-making when things get busy",
      "Prior Train Crew or Stations experience preferred",
      "Able to attend at least two shifts a week",
    ],
  },
  Engineering: {
    intro:
      "Engineering builds the railway itself. You'll work in Roblox Studio on new stations, track layouts and the systems our crews rely on every shift.",
    responsibilities: [
      "Build and improve maps, stations and scenery",
      "Script and test gameplay systems in Luau",
      "Fix bugs reported by crews and players",
      "Review work with other engineers before it goes live",
    ],
    requirements: [
      "A Roblox account in good standing",
      "Experience with Roblox Studio (a portfolio helps)",
      "Comfortable taking and giving feedback",
      "Able to commit a few hours a week",
    ],
  },
  "Head Office": {
    intro:
      "Head Office keeps the community organised, welcoming and fair. You'll support recruitment, events and member welfare behind the scenes.",
    responsibilities: [
      "Review applications and run interviews",
      "Organise community events and socials",
      "Keep records and announcements up to date",
      "Help resolve member concerns fairly and confidentially",
    ],
    requirements: [
      "A Roblox account in good standing",
      "Organised, reliable and trustworthy",
      "Good written communication",
      "Previous experience in another GBR division preferred",
    ],
  },
};

export async function getJobBySlug(slug: string): Promise<JobDetail | undefined> {
  const jobs = await fetchAllJobs();
  const index = jobs.findIndex((job) => job.slug === slug);
  if (index === -1) return undefined;
  const job = jobs[index];
  const copy = DIVISION_COPY[job.division] ?? DIVISION_COPY["Train Crew"];
  const closing = new Date(job.posted_at);
  closing.setDate(closing.getDate() + 21);

  return {
    ...job,
    reference: job.id && !job.id.startsWith("demo") ? `GBR-${job.id.slice(0, 6).toUpperCase()}` : `GBR-${1001 + index}`,
    closing_date: job.closing_date ?? closing.toISOString().slice(0, 10),
    pay: job.pay ?? PAY_BY_GRADE[job.grade] ?? "Paid per shift",
    intro: job.description || copy.intro,
    responsibilities: job.responsibilities?.length ? job.responsibilities : copy.responsibilities,
    requirements: job.requirements?.length ? job.requirements : copy.requirements,
    working_pattern: [
      "Shifts run on our community schedule, including evenings and weekends",
      "Book shifts in advance through the GBR server",
      "Breaks are encouraged during long sessions",
    ],
    process: [
      "Submit your application form",
      "Complete a short online quiz on GBR basics",
      "Attend a training session with a mentor",
      "Shadow an experienced member before your first solo shift",
    ],
  };
}
