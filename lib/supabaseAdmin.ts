import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the secret (service role) key.
// Never import this from a "use client" file: the key must stay on the server.
// Set SUPABASE_SECRET_KEY (or the older SUPABASE_SERVICE_ROLE_KEY) in Vercel.

let client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
