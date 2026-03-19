"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Coins, Calendar, XCircle } from "lucide-react";
import { CreditBalance } from "@/components/addons/credit-balance";
import { CreditHistoryTable } from "@/components/addons/credit-history-table";

interface UserAddonWithPackage {
  userAddon: {
    id: string;
    status: string;
    billingCycle: string | null;
    creditsRemaining: number;
    creditsResetAt: string | null;
    startedAt: string;
    canceledAt: string | null;
  };
  addon: {
    name: string;
    slug: string;
    category: string;
    pricingMonthly: number | null;
    creditsIncluded: number | null;
  };
}

const categoryIcons: Record<string, string> = {
  security: "🔒",
  seo: "📊",
  performance: "⚡",
  accessibility: "♿",
  code_quality: "💻",
  cross_browser: "📱",
  uptime: "📡",
  ai_fix: "🤖",
  report: "📄",
  bundle: "🔥",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  canceled: "bg-red-500/10 text-red-400",
  expired: "bg-muted text-muted-foreground",
  past_due: "bg-amber-500/10 text-amber-500",
  trialing: "bg-blue-500/10 text-blue-400",
};

export default function MyAddonsPage() {
  const [addons, setAddons] = useState<UserAddonWithPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAddons();
  }, []);

  async function fetchAddons() {
    try {
      // Fetch user's credits breakdown to get active addons
      const res = await fetch("/api/credits");
      if (!res.ok) return;
      const data = await res.json();

      // For each active addon, fetch details
      const breakdown = data.breakdown ?? [];
      const details: UserAddonWithPackage[] = [];

      for (const item of breakdown) {
        // We'll construct a simplified view from the breakdown
        details.push({
          userAddon: {
            id: item.addonId,
            status: item.status,
            billingCycle: "monthly",
            creditsRemaining: item.creditsRemaining,
            creditsResetAt: null,
            startedAt: new Date().toISOString(),
            canceledAt: null,
          },
          addon: {
            name: item.addonName,
            slug: "",
            category: "",
            pricingMonthly: null,
            creditsIncluded: item.creditsIncluded,
          },
        });
      }

      setAddons(details);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(addonId: string) {
    if (!confirm("ยืนยันยกเลิก add-on นี้?")) return;

    setCancelingId(addonId);
    try {
      const res = await fetch(`/api/addons/${addonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (res.ok) {
        setAddons((prev) =>
          prev.map((a) =>
            a.userAddon.id === addonId
              ? { ...a, userAddon: { ...a.userAddon, status: "canceled" } }
              : a,
          ),
        );
      }
    } catch {
      alert("ไม่สามารถยกเลิกได้ กรุณาลองอีกครั้ง");
    } finally {
      setCancelingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Add-ons</h1>
          <p className="text-sm text-muted-foreground">
            จัดการ add-ons และ credits ของคุณ
          </p>
        </div>
        <CreditBalance />
      </div>

      {/* Active Add-ons */}
      {addons.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Coins className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">ยังไม่มี add-on</p>
            <a
              href="/addons"
              className="mt-2 text-sm text-primary hover:underline"
            >
              ดู Add-on Marketplace →
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {addons.map((item, i) => {
            const icon = categoryIcons[item.addon.category] ?? "📦";
            const statusClass =
              statusColors[item.userAddon.status] ?? statusColors.active;

            return (
              <motion.div
                key={item.userAddon.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">
                            {item.addon.name}
                          </h3>
                          <Badge className={statusClass}>
                            {item.userAddon.status}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Coins className="h-3 w-3" />
                            {item.userAddon.creditsRemaining}
                            {item.addon.creditsIncluded
                              ? `/${item.addon.creditsIncluded}`
                              : ""}{" "}
                            credits
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.userAddon.billingCycle}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.userAddon.status === "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(item.userAddon.id)}
                        disabled={cancelingId === item.userAddon.id}
                        className="text-red-400 hover:text-red-500"
                      >
                        {cancelingId === item.userAddon.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-1 h-4 w-4" />
                        )}
                        Cancel
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Credit History */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Credit History
        </h2>
        <Card>
          <CardContent className="p-4">
            <CreditHistoryTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
