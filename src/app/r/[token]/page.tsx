import { Metadata } from "next";
import { getScanResult } from "@/lib/scan/store";
import { ShareResultClient } from "./client";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const result = getScanResult(token);

  if (!result) {
    return {
      title: "Scan Result Not Found — ViberQC",
    };
  }

  const title = `Score ${result.scores.overall}/100 — ${result.url}`;
  const description = `ViberQC scanned ${result.url} and found ${result.issues.length} issues. Overall score: ${result.scores.overall}/100.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}&score=${result.scores.overall}`;

  return {
    title: `${title} — ViberQC`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;
  return <ShareResultClient token={token} />;
}
