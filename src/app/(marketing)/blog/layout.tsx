import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — ViberQC",
  description: "Insights on app quality, AI-powered code review, security best practices, and the Viber ecosystem.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
