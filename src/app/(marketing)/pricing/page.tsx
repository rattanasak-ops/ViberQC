import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PricingCards } from "@/components/marketing/pricing-cards";

export const metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for ViberQC. Start free, upgrade when you need more.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <PricingCards />
      </main>
      <Footer />
    </div>
  );
}
