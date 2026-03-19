import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // ส่ง 10% ของ transactions ไป Sentry (ลด cost)
  tracesSampleRate: 0.1,

  // Replay 1% normal sessions, 100% ถ้า error
  replaysSessionSampleRate: 0.01,
  replaysOnErrorSampleRate: 1.0,

  integrations: [Sentry.replayIntegration()],

  // ไม่ส่ง error ใน development
  enabled: process.env.NODE_ENV === "production",
});
