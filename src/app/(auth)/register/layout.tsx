import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Sign Up — ViberQC" },
  description:
    "Create your free ViberQC account. Start scanning your Viber Apps with AI-powered quality control.",
  alternates: { canonical: "/register" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
