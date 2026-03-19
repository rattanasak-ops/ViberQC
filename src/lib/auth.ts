// ============================================================
// ViberQC — Auth Configuration (NextAuth.js v5 Beta)
// Providers: Email+Password / Google / GitHub
// ============================================================

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";

const hasDB = !!process.env.DATABASE_URL;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...(hasDB
    ? {
        adapter: DrizzleAdapter(db, {
          usersTable: users,
          accountsTable: accounts,
          sessionsTable: sessions,
          verificationTokensTable: verificationTokens,
        }),
      }
    : {}),
  session: { strategy: "jwt" },
  trustHost: process.env.NODE_ENV === "development",

  providers: [
    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID
      ? [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!hasDB) {
          // Demo mode: hardcoded test account
          const demoEmail = process.env.DEMO_EMAIL ?? "test@viberqc.com";
          const demoPassword =
            process.env.DEMO_PASSWORD ?? "demo-password-change-me";
          if (
            credentials.email === demoEmail &&
            credentials.password === demoPassword
          ) {
            return {
              id: "demo-user",
              email: demoEmail,
              name: "Demo User",
              image: null,
            };
          }
          return null;
        }

        const { eq } = await import("drizzle-orm");
        const { users } = await import("@/lib/db/schema");

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const bcrypt = await import("bcryptjs");
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword,
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.avatarUrl,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
});
