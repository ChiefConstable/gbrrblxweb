"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, FileText, LayoutDashboard, LogIn, LogOut, UserRound } from "lucide-react";
import { useAuthEnabled } from "@/components/AuthProvider";

export default function AccountMenu({ solid }: { solid: boolean }) {
  const enabled = useAuthEnabled();
  if (!enabled) return null;
  return <AccountMenuInner solid={solid} />;
}

function AccountMenuInner({ solid }: { solid: boolean }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const tone = solid ? "text-brand-heading hover:bg-gray-100" : "text-white hover:bg-white/15";

  if (status === "loading") return <span className="h-9 w-9 animate-pulse rounded-full bg-white/30" aria-hidden="true" />;

  if (!session?.user) {
    return (
      <Link
        href="/signin"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide ${tone}`}
      >
        <LogIn size={16} aria-hidden="true" />
        <span className="hidden sm:inline">Sign in</span>
      </Link>
    );
  }

  const { name, image, isAdmin, provider } = session.user;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Account menu for ${name ?? "your account"}`}
        className={`inline-flex items-center gap-1.5 rounded-full p-1 pr-2 ${tone}`}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-8 w-8 rounded-full bg-gray-200 object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-white">
            <UserRound size={16} aria-hidden="true" />
          </span>
        )}
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-60 rounded-sm bg-white py-2 text-sm shadow-lg ring-1 ring-black/5">
          <div className="border-b border-gray-100 px-4 pb-2">
            <p className="truncate font-bold text-brand-heading">{name}</p>
            <p className="text-xs capitalize text-gray-500">Signed in with {provider}</p>
          </div>
          <Link
            href="/applications"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-brand-heading hover:bg-gray-50 hover:text-brand-green"
          >
            <FileText size={16} aria-hidden="true" />
            My applications
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-brand-heading hover:bg-gray-50 hover:text-brand-green"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Admin dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-brand-heading hover:bg-gray-50 hover:text-brand-green"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
