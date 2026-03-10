import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features — ViberQC",
  description: "8 phases of AI-powered quality control: Performance, SEO, Accessibility, Security, Code Quality, Best Practices, PWA, and Viber-specific checks.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
