import { redirect } from "next/navigation";
import { getViewer, type Viewer } from "@/auth";

/** Signed-in user or redirect to sign-in (returning to `returnTo`). */
export async function requireViewer(returnTo: string): Promise<Viewer & { provider: string; providerAccountId: string }> {
  const viewer = await getViewer();
  if (!viewer || !viewer.provider || !viewer.providerAccountId) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(returnTo)}`);
  }
  return viewer as Viewer & { provider: string; providerAccountId: string };
}

/** For server actions: throws unless the caller is an admin. */
export async function assertAdmin(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer?.isAdmin) throw new Error("Not authorised");
  return viewer;
}
