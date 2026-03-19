"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "why-viber-app-quality-matters",
    title: "Why Viber App Quality Matters More Than Ever",
    excerpt:
      "With over 1 billion users, Viber's ecosystem demands high-quality apps. Learn why QC is your competitive advantage.",
    category: "Quality",
    readTime: "5 min",
    date: "Mar 8, 2026",
    color: "#6C63FF",
  },
  {
    slug: "ai-powered-code-review",
    title: "How AI is Revolutionizing Code Review",
    excerpt:
      "Multi-model AI scanning catches issues that traditional linters miss. Here's how ViberQC leverages Claude, GPT-4, and Gemini.",
    category: "AI",
    readTime: "7 min",
    date: "Mar 5, 2026",
    color: "#22C55E",
  },
  {
    slug: "owasp-top-10-viber-apps",
    title: "OWASP Top 10 for Viber Mini Apps",
    excerpt:
      "Security vulnerabilities specific to Viber's platform. A practical guide to protecting your users and data.",
    category: "Security",
    readTime: "10 min",
    date: "Mar 1, 2026",
    color: "#EF4444",
  },
  {
    slug: "performance-optimization-guide",
    title: "Performance Optimization: From 40 to 95 Score",
    excerpt:
      "Real case study of how one team improved their Viber App performance score using ViberQC recommendations.",
    category: "Performance",
    readTime: "8 min",
    date: "Feb 25, 2026",
    color: "#FFB800",
  },
];

export default function BlogPage() {
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
                Blog
              </motion.h1>
              <motion.p
                className="mt-4 text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Insights on app quality, AI, security, and the Viber ecosystem
              </motion.p>
            </div>

            {/* Posts */}
            <div className="mt-16 space-y-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card className="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ color: post.color }}
                          >
                            {post.category}
                          </Badge>
                          <h2 className="mt-3 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {post.excerpt}
                          </p>
                          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="mt-8 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
