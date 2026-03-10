"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ArrowRight, ScanLine, FileText, Share2, Zap } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    number: "01",
    icon: ScanLine,
    title: "Paste your URL",
    description: "Enter your Viber App URL or connect your GitHub repo. No signup required for your first scan.",
    color: "#6C63FF",
  },
  {
    number: "02",
    icon: Zap,
    title: "AI scans 8 phases",
    description: "Our AI analyzes Performance, SEO, Accessibility, Security, Code Quality, Best Practices, PWA, and Viber-specific checks in parallel.",
    color: "#22C55E",
  },
  {
    number: "03",
    icon: FileText,
    title: "Get your 360° report",
    description: "See your overall score, critical issues, and AI-generated fix recommendations — all in 30 seconds.",
    color: "#FFB800",
  },
  {
    number: "04",
    icon: Share2,
    title: "Share & improve",
    description: "Share results with your team, export PDF reports, track your score over time, and watch your app quality improve.",
    color: "#8D83FF",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center">
              <motion.h1
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                How ViberQC Works
              </motion.h1>
              <motion.p
                className="mt-4 text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                From URL to full QC report in 30 seconds
              </motion.p>
            </div>

            {/* Steps */}
            <div className="mt-20 space-y-16">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  className="flex items-start gap-6"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${step.color}15` }}
                  >
                    <step.icon className="h-6 w-6" style={{ color: step.color }} />
                  </div>
                  <div>
                    <span className="text-sm font-bold" style={{ color: step.color }}>
                      Step {step.number}
                    </span>
                    <h3 className="mt-1 text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base")}
              >
                Try Free Scan Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
