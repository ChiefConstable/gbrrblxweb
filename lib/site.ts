// Site-wide settings used by the info and policy pages.
// Fill these in so the "contact us" links work everywhere.
export const SITE = {
  name: "GBR Careers",
  community: "GBR Roblox railway community",
  url: (process.env.SITE_URL ?? "https://careers.gbrrblx.xyz").replace(/\/$/, ""),
  // Your Discord server invite, e.g. "https://discord.gg/abc123". Leave empty to hide Discord links.
  discordInvite: process.env.NEXT_PUBLIC_DISCORD_INVITE ?? "",
  // Where people can contact you about privacy. Leave empty to point to Discord instead.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  policiesUpdated: "21 October 2026",
};

export function contactText() {
  if (SITE.contactEmail) return SITE.contactEmail;
  return "the Recruitment Team on the GBR Discord server";
}
