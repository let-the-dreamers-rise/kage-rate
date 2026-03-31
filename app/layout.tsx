import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "KAGE",
  title: "KAGE | Bags Creator Operations",
  description:
    "KAGE is the post-launch operator for Bags creators: fee recovery, holder retention, community drafts, growth intelligence, and live Bags install previews.",
  keywords: ["Bags", "AI agents", "Solana", "creator ops", "fee sharing", "hackathon"]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
