"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AddonCard } from "@/components/addons/addon-card";
import { CreditBalance } from "@/components/addons/credit-balance";

interface AddonPackage {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string;
  pricingMonthly: number | null;
  pricingPerUse: number | null;
  creditsIncluded: number | null;
  features: Record<string, unknown> | null;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "security", label: "Security" },
  { value: "seo", label: "SEO" },
  { value: "performance", label: "Performance" },
  { value: "accessibility", label: "Accessibility" },
  { value: "code_quality", label: "Code Quality" },
  { value: "cross_browser", label: "Cross-Browser" },
  { value: "uptime", label: "Uptime" },
  { value: "ai_fix", label: "AI Fix" },
  { value: "report", label: "Report" },
  { value: "bundle", label: "Bundle" },
];

export default function AddonsPage() {
  const [packages, setPackages] = useState<AddonPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetch("/api/addons")
      .then((res) => res.json())
      .then((data) => setPackages(data.packages ?? []))
      .catch(() => setError("ไม่สามารถโหลด add-ons ได้"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubscribe(slug: string) {
    const pkg = packages.find((p) => p.slug === slug);
    if (!pkg) return;

    setPurchasing(slug);
    try {
      const res = await fetch("/api/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addonId: pkg.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "เกิดข้อผิดพลาด");
        return;
      }
      alert(`สมัคร ${pkg.name} สำเร็จ!`);
    } catch {
      alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setPurchasing(null);
    }
  }

  function handleTryScan(slug: string) {
    // Navigate to scan page with addon pre-selected
    window.location.href = `/scan?addon=${slug}`;
  }

  const filtered =
    activeTab === "all"
      ? packages
      : packages.filter((p) => p.category === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">กำลังโหลด...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-destructive">
        <AlertCircle className="mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Add-on Marketplace
          </h1>
          <p className="text-sm text-muted-foreground">
            เพิ่มความสามารถให้การ scan ของคุณด้วย premium APIs
          </p>
        </div>
        <CreditBalance />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AddonCard
                  slug={pkg.slug}
                  name={pkg.name}
                  description={pkg.description}
                  category={pkg.category}
                  pricingMonthly={pkg.pricingMonthly}
                  pricingPerUse={pkg.pricingPerUse}
                  creditsIncluded={pkg.creditsIncluded}
                  features={pkg.features as { checks?: string[] } | null}
                  isBundle={pkg.category === "bundle"}
                  onSubscribe={handleSubscribe}
                  onTryScan={handleTryScan}
                  loading={purchasing === pkg.slug}
                />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">
              ไม่มี add-on ในหมวดนี้
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
