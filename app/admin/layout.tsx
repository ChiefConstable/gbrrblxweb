import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { authEnabled, getViewer } from "@/auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata: Metadata = { title: "Admin | GBR Careers", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!authEnabled) {
    return (
      <Shell>
        <Notice title="Sign-in isn't set up yet">
          Add the Roblox or Discord keys and AUTH_SECRET in Vercel to use the admin area. See the README.
        </Notice>
      </Shell>
    );
  }

  const viewer = await getViewer();
  if (!viewer) redirect("/signin?callbackUrl=/admin");
  if (!viewer.isAdmin) {
    return (
      <Shell>
        <Notice title="You don't have access to this page">
          Your account ({viewer.provider}:{viewer.providerAccountId}) isn&apos;t on the admin list. Ask the site owner to
          add it to ADMIN_IDS in Vercel.
        </Notice>
      </Shell>
    );
  }

  return (
    <Shell>
      <nav aria-label="Admin" className="mb-8 flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
        <span className="mr-4 font-heading text-lg font-bold text-brand-heading">Admin</span>
        <AdminLink href="/admin">Jobs</AdminLink>
        <AdminLink href="/admin/applications">Applications</AdminLink>
        <span className="ml-auto text-xs text-gray-500">Signed in as {viewer.name}</span>
      </nav>
      {!getSupabaseAdmin() && (
        <div className="mb-6 rounded-sm border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          SUPABASE_SECRET_KEY isn&apos;t set in Vercel, so changes can&apos;t be saved yet.
        </div>
      )}
      {children}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-6 pb-20 pt-28">{children}</main>
      <Footer />
    </>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-10 max-w-lg rounded-sm border border-gray-200 bg-white p-8 text-center">
      <ShieldAlert className="mx-auto text-brand-dark" size={40} strokeWidth={1.25} aria-hidden="true" />
      <h1 className="mt-4 text-xl">{title}</h1>
      <p className="mt-2 text-sm leading-6">{children}</p>
      <Link href="/" className="btn-pill-sm mt-6">
        Back to home
      </Link>
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-1.5 text-sm font-semibold text-brand-heading hover:bg-gray-100 hover:text-brand-green"
    >
      {children}
    </Link>
  );
}
