// ============================================================
// ViberQC — Middleware (Auth protection)
// Protects app routes, redirects unauthenticated users to /login
// Uses NextAuth auth() to verify JWT signature — not just cookie existence
// ============================================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/pricing",
  "/how-it-works",
  "/features",
  "/blog",
  "/contact",
  "/about",
  "/careers",
  "/privacy",
  "/terms",
  "/cookies",
  "/api/auth",
  "/api/contact",
  "/api/waitlist",
  "/api/webhook",
  "/api/scan/start",
  "/api/scan/run",
  "/api/scan/share",
  "/scan",
  "/r",
  "/api/og",
  "/api/badge",
  "/sitemap.xml",
  "/robots.txt",
  "/addons",
  "/api/addons",
  "/api/reports/generate",
  "/api/scan/ai-fix-public",
];

const protectedPaths = [
  "/dashboard",
  "/projects",
  "/reports",
  "/history",
  "/settings",
  "/addons/my",
];

function isPublicPath(pathname: string): boolean {
  // Check protected first — protected takes priority over public prefix
  if (isProtectedPath(pathname)) return false;
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
}

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );
}

export default auth(function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = request.auth;

  // Public paths — always allow
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Protected paths — require valid session
  if (isProtectedPath(pathname)) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protected API routes — require valid session
  if (pathname.startsWith("/api/") && !isPublicPath(pathname)) {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}) as (request: NextRequest) => Promise<NextResponse>;

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
