"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

// GBR Careers only uses strictly necessary cookies and storage today (sign-in,
// security and remembering choices like favourites). The "performance" option
// is here so the choice is recorded before any analytics are ever added: check
// hasPerformanceConsent() before loading anything like that.

const KEY = "gbr-cookie-consent";
const OPEN_EVENT = "gbr:open-cookie-preferences";

type Consent = { performance: boolean; at: string };

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function saveConsent(performance: boolean) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ performance, at: new Date().toISOString() }));
  } catch {
    // storage blocked: the banner will simply show again next visit
  }
}

export function hasPerformanceConsent() {
  return typeof window !== "undefined" && readConsent()?.performance === true;
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export default function CookieConsent() {
  const [banner, setBanner] = useState(false);
  const [modal, setModal] = useState(false);
  const [performance, setPerformance] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setBanner(true);
    else setPerformance(existing.performance);

    const open = () => {
      setPerformance(readConsent()?.performance ?? false);
      setModal(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal]);

  const choose = (perf: boolean) => {
    saveConsent(perf);
    setPerformance(perf);
    setBanner(false);
    setModal(false);
  };

  return (
    <>
      {banner && !modal && (
        <div
          role="region"
          aria-label="Cookie notice"
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-6 text-gray-700">
              We use cookies that are needed to keep you signed in and the site secure. We&apos;d also like your
              permission for performance cookies in future. See our{" "}
              <Link href="/cookies" className="font-semibold text-brand-green underline">
                Cookies Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button type="button" onClick={() => setModal(true)} className="rounded-full border border-brand-dark px-5 py-2 text-xs font-bold uppercase text-brand-dark hover:bg-gray-50">
                Manage
              </button>
              <button type="button" onClick={() => choose(false)} className="rounded-full border border-brand-dark px-5 py-2 text-xs font-bold uppercase text-brand-dark hover:bg-gray-50">
                Necessary only
              </button>
              <button type="button" onClick={() => choose(true)} className="btn-pill px-5 py-2 text-xs uppercase">
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4" onClick={() => setModal(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-title"
            className="relative w-full max-w-md rounded-sm bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModal(false)}
              aria-label="Close cookie preferences"
              className="absolute right-3 top-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <p className="font-heading text-xl">
              <span className="font-bold text-brand-heading">GBR</span> <span className="font-light text-brand-heading">Careers</span>
            </p>
            <h2 id="cookie-title" className="mt-4 text-lg">
              Manage cookie preferences
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Choose which cookies we can use. You can change this at any time from the Cookie Preferences link at the
              bottom of every page. More detail is in our{" "}
              <Link href="/cookies" className="font-semibold text-brand-green underline" onClick={() => setModal(false)}>
                Cookies Policy
              </Link>
              .
            </p>

            <div className="mt-5 divide-y divide-gray-200 rounded-sm border border-gray-200">
              <div className="flex items-start gap-3 p-4">
                <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-brand-green" aria-describedby="nec-desc" />
                <div>
                  <p className="text-sm font-semibold text-brand-heading">Strictly necessary</p>
                  <p id="nec-desc" className="mt-1 text-xs leading-5 text-gray-600">
                    Keep you signed in, protect forms from misuse and remember choices like this one. Always on.
                  </p>
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 p-4">
                <input
                  type="checkbox"
                  checked={performance}
                  onChange={(e) => setPerformance(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-brand-green"
                />
                <span>
                  <span className="block text-sm font-semibold text-brand-heading">Performance</span>
                  <span className="mt-1 block text-xs leading-5 text-gray-600">
                    Would let us count visits and see which pages are popular so we can improve the site. We don&apos;t
                    use any performance cookies yet, and won&apos;t unless you allow them.
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => choose(false)} className="rounded-full border border-brand-dark px-5 py-2 text-xs font-bold uppercase text-brand-dark hover:bg-gray-50">
                Necessary only
              </button>
              <button type="button" onClick={() => choose(performance)} className="btn-pill px-6 py-2 text-xs uppercase">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
