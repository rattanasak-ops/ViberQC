import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — ViberQC",
  description: "ViberQC is an AI-powered 360° quality control platform for Viber Apps.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">About ViberQC</h1>
            <div className="mt-8 space-y-6 text-muted-foreground">
              <p>
                ViberQC is an AI-powered SaaS platform that provides comprehensive 360° quality control for Viber Apps. We help developers and teams build better, faster, and more secure applications on the Viber ecosystem.
              </p>
              <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
              <p>
                To make quality assurance accessible to every developer — from solo builders to enterprise teams. We believe that every Viber App deserves world-class quality, and AI makes that possible in seconds, not days.
              </p>
              <h2 className="text-2xl font-semibold text-foreground">What We Do</h2>
              <p>
                Our platform scans your Viber App across 8 critical dimensions: Performance, SEO, Accessibility, Security, Code Quality, Best Practices, PWA Readiness, and Viber-specific compliance. Using multi-model AI (Claude, GPT-4, Gemini, Grok), we deliver actionable insights in under 30 seconds.
              </p>
              <h2 className="text-2xl font-semibold text-foreground">Our Team</h2>
              <p>
                ViberQC is built by a passionate team of developers who understand the challenges of shipping quality software. We use the very tools we build — eating our own dog food, every single day.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
