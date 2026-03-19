import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service — ViberQC" },
  description:
    "ViberQC Terms of Service. Rules and guidelines for using our platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: March 10, 2026
            </p>

            <div className="mt-8 space-y-8 text-sm text-muted-foreground">
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  1. Acceptance of Terms
                </h2>
                <p className="mt-2">
                  By accessing or using ViberQC, you agree to be bound by these
                  Terms of Service. If you do not agree, do not use our service.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  2. Description of Service
                </h2>
                <p className="mt-2">
                  ViberQC provides AI-powered quality control scanning for web
                  applications, particularly those built for the Viber platform.
                  Our service analyzes URLs you submit and provides quality
                  reports.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  3. User Accounts
                </h2>
                <p className="mt-2">
                  You are responsible for maintaining the security of your
                  account. You must provide accurate information during
                  registration. One person or entity per account.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  4. Acceptable Use
                </h2>
                <p className="mt-2">
                  You may only scan URLs you own or have permission to scan.
                  Automated abuse, reverse engineering, or attempts to
                  circumvent rate limits are prohibited.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  5. Subscription & Payments
                </h2>
                <p className="mt-2">
                  Paid plans are billed monthly or annually through Stripe. You
                  can cancel anytime. Refunds are handled on a case-by-case
                  basis within 14 days of purchase.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  6. Limitation of Liability
                </h2>
                <p className="mt-2">
                  ViberQC is provided &quot;as is&quot;. We are not liable for
                  any damages resulting from the use of our service or reliance
                  on scan results. Our total liability is limited to the amount
                  you paid in the last 12 months.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  7. Contact
                </h2>
                <p className="mt-2">
                  Questions about these terms? Contact us at
                  support@viberqc.com.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
