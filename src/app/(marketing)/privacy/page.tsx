import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — ViberQC" },
  description:
    "ViberQC Privacy Policy. How we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: March 10, 2026
            </p>

            <div className="mt-8 space-y-8 text-sm text-muted-foreground">
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  1. Information We Collect
                </h2>
                <p className="mt-2">
                  We collect information you provide directly: account details
                  (name, email), project URLs submitted for scanning, and
                  payment information processed securely through Stripe.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  2. How We Use Your Information
                </h2>
                <p className="mt-2">
                  We use your information to: provide and improve our scanning
                  services, send scan reports and notifications, process
                  payments, and communicate updates about our service.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  3. Data Security
                </h2>
                <p className="mt-2">
                  We implement industry-standard security measures including
                  encryption in transit (TLS), hashed passwords (bcrypt), and
                  secure session management. Scan results are stored encrypted
                  and can be deleted at your request.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  4. Data Sharing
                </h2>
                <p className="mt-2">
                  We do not sell your data. We share data only with: Stripe
                  (payment processing), AI providers (anonymized scan analysis),
                  and hosting providers (infrastructure).
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  5. Your Rights
                </h2>
                <p className="mt-2">
                  You can: access, update, or delete your account data at any
                  time through Settings. Request a full data export. Delete your
                  account and all associated data permanently.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  6. Contact
                </h2>
                <p className="mt-2">
                  For privacy-related questions, contact us at
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
