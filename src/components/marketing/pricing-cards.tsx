"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Get started with basic QC scanning",
    features: [
      "3 scans/month",
      "3 scan phases",
      "1 project",
      "Shareable result URL",
      "QC badge (with branding)",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 12, annual: 8 },
    description: "Unlimited scanning for professionals",
    features: [
      "Unlimited scans",
      "All 8 scan phases",
      "5 projects",
      "PDF reports (5/month)",
      "Email alerts",
      "API access (100 calls)",
      "VS Code / Cursor Extension",
      "Badge without branding",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Team",
    price: { monthly: 39, annual: 26 },
    description: "Collaborate with your team",
    features: [
      "Everything in Pro",
      "20 projects",
      "5 team members",
      "CI/CD GitHub Action",
      "Slack/Discord notifications",
      "Shared dashboard",
      "Unlimited PDF reports",
      "Priority support (24h)",
    ],
    cta: "Start Team Plan",
    popular: false,
  },
  {
    name: "Enterprise",
    price: { monthly: null, annual: null },
    description: "Custom solution for large teams",
    features: [
      "Everything in Team",
      "Unlimited projects & members",
      "SSO (SAML, OAuth)",
      "Custom checklists",
      "SLA 99.9% uptime",
      "Dedicated support",
      "Audit logs",
      "White-label reports",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Label htmlFor="billing" className="text-sm text-muted-foreground">
              Monthly
            </Label>
            <Switch
              id="billing"
              checked={annual}
              onCheckedChange={setAnnual}
            />
            <Label htmlFor="billing" className="text-sm text-muted-foreground">
              Annual
            </Label>
            {annual && (
              <Badge variant="secondary" className="text-xs text-primary">
                Save 33%
              </Badge>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                className={cn(
                  "relative h-full",
                  plan.popular && "border-primary shadow-lg shadow-primary/10"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-white">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="pb-4 pt-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </h3>
                  <div className="mt-2">
                    {plan.price.monthly !== null ? (
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-foreground">
                          ${annual ? plan.price.annual : plan.price.monthly}
                        </span>
                        <span className="ml-1 text-sm text-muted-foreground">
                          /month
                        </span>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold text-foreground">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="pb-6">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
