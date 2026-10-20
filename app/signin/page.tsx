import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { authEnabled, enabledProviders, getLastAuthError, getViewer, signIn } from "@/auth";

export const metadata: Metadata = { title: "Sign in | GBR Careers (Roblox Community)" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ callbackUrl?: string; error?: string }> };

// Only allow redirects back to pages on this site
const safePath = (url?: string) => (url && url.startsWith("/") && !url.startsWith("//") ? url : "/");

const PROVIDERS = {
  roblox: { label: "Continue with Roblox", className: "bg-black hover:bg-neutral-800 text-white" },
  discord: { label: "Continue with Discord", className: "bg-[#5865F2] hover:bg-[#4752C4] text-white" },
} as const;

export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;
  const redirectTo = safePath(callbackUrl);

  const viewer = await getViewer();
  if (viewer) redirect(redirectTo);
  const lastError = error ? getLastAuthError() : null;

  return (
    <>
      <Header />
      <main className="bg-gray-100 px-6 pb-24 pt-32">
        <div className="mx-auto max-w-md rounded-sm bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl">Sign in to GBR Careers</h1>
          <p className="mt-3 text-center text-sm leading-6 text-gray-600">
            Use your Roblox or Discord account to apply for roles and keep track of your applications.
          </p>

          {error && (
            <p role="alert" className="mt-6 rounded-sm bg-red-50 p-3 text-center text-sm text-red-700">
              Sign-in didn&apos;t complete. Please try again.
              <span className="mt-2 block break-words text-left font-mono text-[11px] leading-4 text-red-800">
                Code: {error}
                {lastError && (
                  <>
                    <br />
                    {lastError.type}: {lastError.message}
                    {lastError.cause && (
                      <>
                        <br />
                        Cause: {lastError.cause}
                      </>
                    )}
                  </>
                )}
              </span>
            </p>
          )}

          {authEnabled ? (
            <div className="mt-8 space-y-3">
              {enabledProviders.map((id) => (
                <form
                  key={id}
                  action={async () => {
                    "use server";
                    await signIn(id, { redirectTo });
                  }}
                >
                  <button
                    type="submit"
                    className={`w-full rounded-full px-6 py-3 text-sm font-bold transition-colors ${PROVIDERS[id].className}`}
                  >
                    {PROVIDERS[id].label}
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-sm border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
              Sign-in isn&apos;t switched on yet. Check back soon.
            </p>
          )}

          <p className="mt-8 text-center text-xs leading-5 text-gray-500">
            We only see your username and avatar. GBR is an unofficial Roblox community and isn&apos;t affiliated
            with Roblox Corporation, Discord or Great British Railways.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
