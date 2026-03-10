// ============================================================
// ViberQC — Auth Utilities
// Helper functions for auth in API routes and server components
// ============================================================

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Get the current session user or return 401
 */
export async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.email) {
    return null;
  }
  return { id: session.user.id, email: session.user.email };
}

/**
 * Return a 401 JSON response
 */
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
}

/**
 * Return a 400 JSON response
 */
export function badRequestResponse(message: string) {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}
