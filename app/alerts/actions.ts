"use server";

import { subscribe } from "@/lib/alerts";

export type AlertFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "confirm_sent" | "updated" | "saved_no_email" };

const str = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").trim().slice(0, max);

export async function subscribeToAlerts(_prev: AlertFormState, fd: FormData): Promise<AlertFormState> {
  if (str(fd, "website")) return { status: "confirm_sent" }; // honeypot: pretend it worked
  const username = str(fd, "username", 40);
  const email = str(fd, "email");
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) {
    return { status: "error", message: "Please enter a valid Roblox username (3 to 20 letters, numbers or underscores)." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "Please enter a valid email address." };

  const result = await subscribe({
    // Stored in first_name so the existing table and email templates keep working
    firstName: username,
    lastName: "",
    email,
    division: str(fd, "division") || null,
    category: str(fd, "category") || null,
    region: str(fd, "region") || null,
    employment_type: str(fd, "employmentType") || null,
  });
  if (!result.ok) return { status: "error", message: result.error };
  return { status: result.status };
}
