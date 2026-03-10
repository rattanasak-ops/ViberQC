"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Search,
  Eye,
  Shield,
  Code,
  CheckCircle,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  { icon: Zap, title: "Performance", desc: "Load time, LCP, CLS, runtime analysis", color: "#22C55E" },
  { icon: Search, title: "SEO", desc: "Meta tags, structure, search optimization", color: "#6C63FF" },
  { icon: Eye, title: "Accessibility", desc: "WCAG 2.1 AA compliance checks", color: "#FFB800" },
  { icon: Shield, title: "Security", desc: "OWASP Top 10 vulnerability detection", color: "#EF4444" },
  { icon: Code, title: "Code Quality", desc: "Patterns, best practices, maintainability", color: "#8D83FF" },
  { icon: CheckCircle, title: "Best Practices", desc: "Industry standards and modern web", color: "#84CC16" },
  { icon: Smartphone, title: "PWA", desc: "Progressive Web App readiness", color: "#F97316" },
  { icon: MessageCircle, title: "Viber Specific", desc: "Viber API and platform checks", color: "#6C63FF" },
];

export function FeaturesGrid() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            360° Quality Control
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            8 phases of comprehensive scanning powered by AI
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="group h-full border-border/50 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div
                    className="inline-flex rounded-lg p-2.5"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon
                      className="h-5 w-5"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
