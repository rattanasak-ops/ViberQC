import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "How It Works — ViberQC" },
  description:
    "From URL to full QC report in 30 seconds. Paste your URL, AI scans 8 phases, get your 360° report, share & improve.",
  alternates: { canonical: "/how-it-works" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
