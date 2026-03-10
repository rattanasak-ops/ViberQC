import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — ViberQC",
  description: "Join the ViberQC team. We're building the future of AI-powered quality control.",
};

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Careers</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We&apos;re building the future of AI-powered quality control for the Viber ecosystem.
            </p>
            <div className="mt-12 rounded-2xl border border-border/50 bg-card p-8 text-center">
              <p className="text-lg font-medium text-foreground">No open positions right now</p>
              <p className="mt-2 text-sm text-muted-foreground">
                We&apos;re a small but growing team. Check back soon or follow us on social media for updates.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
