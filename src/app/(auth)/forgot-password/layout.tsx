import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Reset Password — ViberQC" },
  description: "Reset your ViberQC account password.",
  alternates: { canonical: "/forgot-password" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
