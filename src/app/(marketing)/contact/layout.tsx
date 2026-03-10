import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — ViberQC",
  description: "Have questions about ViberQC? Get in touch with our team via email, Viber community, or GitHub.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
