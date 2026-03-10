"use server";

// ============================================================
// ViberQC — Auth Server Actions
// Used by Login, Register, Forgot Password pages
// ============================================================

import { signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

// --- Login with Email/Password ---
export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error; // Redirect error from next-auth — must be re-thrown
  }
}

// --- Login with OAuth ---
export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function loginWithGithub() {
  await signIn("github", { redirectTo: "/dashboard" });
}

// --- Register with Email/Password ---
export async function registerWithCredentials(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  if (!process.env.DATABASE_URL) {
    return { error: "Registration is not available in demo mode. Use test@viberqc.com / password123 to log in." };
  }

  // Check if user already exists
  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return { error: "An account with this email already exists" };
  }

  // Hash password
  const bcrypt = await import("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  await db.insert(users).values({
    email,
    fullName: name || null,
    hashedPassword,
    provider: "email",
  });

  // Auto sign in after register
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Account created but auto-login failed. Please sign in." };
    }
    throw error;
  }
}

// --- Forgot Password ---
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  if (!process.env.DATABASE_URL) {
    return { success: "If an account exists, you'll receive a reset link." };
  }

  // Check if user exists (don't reveal if they do or not)
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  // Always return success to prevent email enumeration
  // TODO: Send actual reset email via Resend
  if (user) {
    console.log(`[auth] Password reset requested for ${email}`);
  }

  return { success: "If an account exists, you'll receive a reset link." };
}
