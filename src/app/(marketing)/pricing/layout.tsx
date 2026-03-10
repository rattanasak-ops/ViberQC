import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — ViberQC",
  description: "Start free with 3 scans. Upgrade to Pro ($12/mo) or Team ($39/mo) for unlimited scans, PDF reports, and team collaboration.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
