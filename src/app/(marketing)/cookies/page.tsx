import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Cookie Policy — ViberQC" },
  description:
    "ViberQC Cookie Policy. How we use cookies and similar technologies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Cookie Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: March 10, 2026
            </p>

            <div className="mt-8 space-y-8 text-sm text-muted-foreground">
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  What Are Cookies
                </h2>
                <p className="mt-2">
                  Cookies are small text files stored on your device when you
                  visit a website. They help the site remember your preferences
                  and improve your experience.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  Cookies We Use
                </h2>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  <li>
                    <strong className="text-foreground">
                      Essential cookies:
                    </strong>{" "}
                    Required for authentication and security (session tokens).
                    Cannot be disabled.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Preference cookies:
                    </strong>{" "}
                    Remember your settings like theme (dark/light mode) and
                    language preference.
                  </li>
                  <li>
                    <strong className="text-foreground">
                      Analytics cookies:
                    </strong>{" "}
                    Help us understand how users interact with our platform to
                    improve the experience.
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  Managing Cookies
                </h2>
                <p className="mt-2">
                  You can control cookies through your browser settings.
                  Disabling essential cookies may prevent you from using certain
                  features of ViberQC.
                </p>
              </section>
              <section>
                <h2 className="text-lg font-semibold text-foreground">
                  Contact
                </h2>
                <p className="mt-2">
                  For questions about our cookie usage, contact us at
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
