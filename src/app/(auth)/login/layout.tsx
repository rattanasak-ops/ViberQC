import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Sign In — ViberQC" },
  description:
    "Sign in to your ViberQC account to scan, analyze, and improve your Viber Apps.",
  alternates: { canonical: "/login" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
