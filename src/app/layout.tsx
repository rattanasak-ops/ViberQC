import type { Metadata } from "next";
import { Inter, Sarabun, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ViberQC — AI-Powered 360° Quality Control",
    template: "%s | ViberQC",
  },
  description:
    "Scan your Viber App for Code, Performance, and Security issues in 30 seconds. AI-powered 360° QC — all in one place.",
  keywords: [
    "Viber QC",
    "quality control",
    "AI testing",
    "app security",
    "performance testing",
    "code quality",
    "OWASP",
    "accessibility",
  ],
  authors: [{ name: "ViberQC" }],
  openGraph: {
    type: "website",
    title: "ViberQC — AI-Powered 360° Quality Control",
    description:
      "Scan your Viber App for Code, Performance, and Security issues in 30 seconds.",
    siteName: "ViberQC",
  },
  twitter: {
    card: "summary_large_image",
    title: "ViberQC — AI-Powered 360° Quality Control",
    description:
      "Scan your Viber App for Code, Performance, and Security issues in 30 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${sarabun.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
