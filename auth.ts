import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Roblox from "next-auth/providers/roblox";
import type { Provider } from "next-auth/providers";

// Providers switch on automatically when their keys are set (see README):
//   AUTH_DISCORD_ID / AUTH_DISCORD_SECRET
//   AUTH_ROBLOX_ID  / AUTH_ROBLOX_SECRET
// AUTH_SECRET must also be set. Until then the site runs with sign-in hidden.

const providers: Provider[] = [];
export const enabledProviders: ("roblox" | "discord")[] = [];
if (process.env.AUTH_ROBLOX_ID && process.env.AUTH_ROBLOX_SECRET) {
  providers.push(Roblox);
  enabledProviders.push("roblox");
}
if (process.env.AUTH_DISCORD_ID && process.env.AUTH_DISCORD_SECRET) {
  providers.push(Discord);
  enabledProviders.push("discord");
}
export const authEnabled = Boolean(process.env.AUTH_SECRET) && providers.length > 0;

// Admins are listed as "provider:accountId", comma separated, e.g.
// ADMIN_IDS="discord:123456789012345678,roblox:987654321"
const adminIds = new Set(
  (process.env.ADMIN_IDS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

// Keeps the most recent sign-in error so /signin can show what went wrong.
// Temporary troubleshooting aid: the details only show for 15 minutes.
type LastAuthError = { type: string; message: string; cause: string; at: number };
const errorStore = globalThis as unknown as { __gbrLastAuthError?: LastAuthError };

export function getLastAuthError(): LastAuthError | null {
  const e = errorStore.__gbrLastAuthError;
  return e && Date.now() - e.at < 15 * 60 * 1000 ? e : null;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: { signIn: "/signin", error: "/signin" },
  logger: {
    error(error: Error) {
      const e = error as Error & { type?: string; cause?: unknown };
      let cause = "";
      if (e.cause && typeof e.cause === "object" && "err" in e.cause) {
        const inner = (e.cause as { err: unknown }).err;
        cause = inner instanceof Error ? `${inner.name}: ${inner.message}` : String(inner);
      } else if (e.cause) {
        cause = e.cause instanceof Error ? `${e.cause.name}: ${e.cause.message}` : String(e.cause);
      }
      errorStore.__gbrLastAuthError = { type: e.type ?? e.name, message: e.message.split("\n")[0], cause, at: Date.now() };
      console.error("[auth][error]", e);
    },
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
        if (account.provider === "roblox" && profile) {
          const p = profile as { preferred_username?: string; name?: string; picture?: string | null };
          token.name = p.preferred_username || p.name || token.name;
          token.picture = p.picture ?? token.picture;
        }
      }
      return token;
    },
    session({ session, token }) {
      const provider = typeof token.provider === "string" ? token.provider : undefined;
      const accountId = typeof token.providerAccountId === "string" ? token.providerAccountId : undefined;
      session.user.provider = provider;
      session.user.providerAccountId = accountId;
      session.user.isAdmin = Boolean(provider && accountId && adminIds.has(`${provider}:${accountId}`.toLowerCase()));
      return session;
    },
  },
});

export type Viewer = {
  name: string;
  email?: string | null;
  image?: string | null;
  provider?: string;
  providerAccountId?: string;
  isAdmin: boolean;
};

/** The signed-in user, or null. Safe to call when auth isn't configured. */
export async function getViewer(): Promise<Viewer | null> {
  if (!authEnabled) return null;
  try {
    const session = await auth();
    if (!session?.user) return null;
    return {
      name: session.user.name ?? "GBR member",
      email: session.user.email,
      image: session.user.image,
      provider: session.user.provider,
      providerAccountId: session.user.providerAccountId,
      isAdmin: session.user.isAdmin ?? false,
    };
  } catch (e) {
    console.error("Auth session error", e);
    return null;
  }
}
