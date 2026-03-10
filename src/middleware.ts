// ============================================================
// ViberQC — Middleware (Auth protection)
// Protects app routes, redirects unauthenticated users to /login
// ============================================================

import { NextRequest, NextResponse } from "next/server";

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
  "/api/og",
  "/api/badge",
  "/sitemap.xml",
  "/robots.txt",
];

const protectedPaths = [
  "/dashboard",
  "/projects",
  "/scan",
  "/reports",
  "/history",
  "/settings",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths — always allow
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Protected paths — check for session token
  if (isProtectedPath(pathname)) {
    const token =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protected API routes — check for session token
  if (pathname.startsWith("/api/") && !isPublicPath(pathname)) {
    const token =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
