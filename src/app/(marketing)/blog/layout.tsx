import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Blog — ViberQC" },
  description:
    "Insights on app quality, AI-powered code review, security best practices, and the Viber ecosystem.",
  alternates: { canonical: "/blog" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
