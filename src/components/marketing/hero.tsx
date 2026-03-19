"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, ScanLine, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

function KineticText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 1, y: 20, rotateX: -15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: i * 0.05,
            duration: 0.4,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* === Mesh Gradient Background === */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div
          className="absolute inset-0 opacity-60 dark:opacity-100"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(108, 99, 255, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 10%, rgba(141, 131, 255, 0.08) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 80%, rgba(108, 99, 255, 0.06) 0%, transparent 50%)
            `,
          }}
        />
        {/* Dark mode enhanced mesh */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(123, 115, 255, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 0%, rgba(157, 149, 255, 0.1) 0%, transparent 40%),
              radial-gradient(ellipse at 0% 60%, rgba(10, 8, 32, 0.9) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(30, 22, 80, 0.5) 0%, transparent 60%)
            `,
            backgroundSize: "200% 200%",
            animation: "mesh-move 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* === Floating Orbs (CSS animation — no JS main thread) === */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px] will-change-transform"
        style={{
          top: "-15%",
          right: "-10%",
          animation: "orb-float-1 10s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] rounded-full bg-[#8D83FF]/5 dark:bg-[#8D83FF]/10 blur-[100px] will-change-transform"
        style={{
          bottom: "5%",
          left: "-5%",
          animation: "orb-float-2 8s ease-in-out infinite 2s",
        }}
      />
      <div
        className="absolute w-[200px] h-[200px] rounded-full bg-primary/4 dark:bg-primary/8 blur-[80px] will-change-transform"
        style={{
          top: "40%",
          left: "60%",
          animation: "orb-float-3 12s ease-in-out infinite 4s",
        }}
      />

      {/* === Hero Background Image === */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero-bg.webp"
          alt=""
          fill
          className="object-cover opacity-10 dark:opacity-20 mix-blend-luminosity"
          priority
          sizes="100vw"
        />
      </div>

      {/* === Noise Grain Overlay === */}
      <div className="absolute inset-0 -z-5 noise-grain pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 1, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full glass-subtle px-5 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Quality Control
              <Zap className="h-3.5 w-3.5" />
            </div>
          </motion.div>

          {/* Heading with Kinetic Text */}
          <h1
            className="mt-8 max-w-5xl font-bold tracking-tight text-foreground"
            style={{ fontSize: "var(--text-display-2xl)", lineHeight: 1.1 }}
          >
            <KineticText text="360° Quality Control" />
            <br />
            <span className="text-shimmer">for Viber Apps</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Scan your app for Performance, Security, SEO & Accessibility issues
            in 30 seconds. No login required. AI-powered analysis.
          </motion.p>

          {/* CTAs with Premium Styling */}
          <motion.div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/scan"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 px-10 text-lg rounded-2xl shadow-[0_4px_20px_rgba(108,99,255,0.35)] hover:shadow-[0_8px_30px_rgba(108,99,255,0.5)] transition-all duration-300",
              )}
            >
              <ScanLine className="mr-2 h-5 w-5" />
              Free Scan Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 px-8 text-base rounded-xl glass-subtle border-primary/15 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300",
              )}
            >
              See How It Works
            </Link>
          </motion.div>

          {/* Trust indicators with glass effect */}
          <motion.div
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {["8 Quality Phases", "30-Second Scan", "Free — No Login"].map(
              (text) => (
                <span key={text} className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                  </span>
                  {text}
                </span>
              ),
            )}
          </motion.div>

          {/* Radar illustration — visual proof of 360° scan */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Image
              src="/images/illustration-radar.svg"
              alt="360° Quality Radar"
              width={180}
              height={180}
              className="mx-auto opacity-60 dark:opacity-80"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
