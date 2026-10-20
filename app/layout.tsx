import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GBR Careers | Roblox Railway Community",
  description:
    "Join the GBR Roblox railway community. Find train crew, station, control, engineering and head office roles in our virtual railway. Unofficial fan community, not affiliated with Great British Railways.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${poppins.variable} ${openSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
