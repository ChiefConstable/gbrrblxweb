"use client";

import { openCookiePreferences } from "@/components/CookieConsent";

export default function CookiePreferencesButton() {
  return (
    <button type="button" onClick={openCookiePreferences} className="btn-pill-sm">
      Cookie preferences
    </button>
  );
}
