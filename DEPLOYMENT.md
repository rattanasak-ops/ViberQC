# ViberQC — Deployment Runbook

## Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Drizzle ORM)
- **Auth**: NextAuth.js v5
- **Hosting**: Vercel (recommended)
- **Port (dev)**: 6161

---

## Pre-Deploy Checklist

### Environment Variables (Production)

ตรวจสอบให้ครบก่อน deploy ทุกครั้ง:

| Variable                             | Required | Notes                                  |
| ------------------------------------ | -------- | -------------------------------------- |
| `DATABASE_URL`                       | ✅       | เปลี่ยนเป็น production DB host         |
| `NEXTAUTH_URL`                       | ✅       | `https://viberqc.com`                  |
| `NEXTAUTH_SECRET`                    | ✅       | random 32+ chars                       |
| `GOOGLE_CLIENT_ID`                   | ✅       | เพิ่ม redirect URI ใน Google Console   |
| `GOOGLE_CLIENT_SECRET`               | ✅       |                                        |
| `GITHUB_CLIENT_ID`                   | ✅       | เพิ่ม callback URL ใน GitHub OAuth App |
| `GITHUB_CLIENT_SECRET`               | ✅       |                                        |
| `STRIPE_SECRET_KEY`                  | ✅       | ใช้ live key (sk*live*...)             |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅       | ใช้ live key (pk*live*...)             |
| `STRIPE_WEBHOOK_SECRET`              | ✅       | สร้าง webhook ใหม่สำหรับ prod URL      |
| `RESEND_API_KEY`                     | ✅       | สมัคร resend.com                       |
| `FROM_EMAIL`                         | ✅       | `noreply@viberqc.com`                  |
| `ANTHROPIC_API_KEY`                  | ⚠️       | ถ้าใช้ AI features                     |
| `NEXT_PUBLIC_APP_URL`                | ✅       | `https://viberqc.com`                  |
| `SENTRY_DSN`                         | ⚠️       | ถ้าติดตั้ง Sentry แล้ว                 |

### OAuth Redirect URIs

**Google Console** → เพิ่ม Authorized redirect URIs:

```
https://viberqc.com/api/auth/callback/google
```

**GitHub OAuth App** → เปลี่ยน Authorization callback URL:

```
https://viberqc.com/api/auth/callback/github
```

**Stripe Webhook** → สร้าง endpoint ใหม่:

```
https://viberqc.com/api/webhook/stripe
Events: payment_intent.succeeded, customer.subscription.*
```

---

## Deploy Steps (Vercel)

### ครั้งแรก (Initial Deploy)

```bash
# 1. ติดตั้ง Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. ตั้ง env vars (ทำครั้งเดียว)
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_URL production
# ... ทำซ้ำสำหรับทุก variable

# 5. Deploy
vercel --prod
```

### Routine Deploy

```bash
git push origin main
# Vercel จะ auto-deploy จาก main branch
```

### Manual Deploy

```bash
vercel --prod
```

---

## Rollback Plan

### Option 1: Vercel Dashboard (แนะนำ — เร็วที่สุด)

1. ไปที่ https://vercel.com/dashboard → เลือก project
2. คลิก "Deployments"
3. เลือก deployment เก่าที่ต้องการ
4. คลิก "..." → "Promote to Production"
   **ใช้เวลา: ~30 วินาที**

### Option 2: Vercel CLI

```bash
# ดู deployment list
vercel ls

# Rollback ไป deployment ก่อนหน้า
vercel rollback [deployment-url]
```

### Option 3: Git Revert

```bash
# Revert commit ล่าสุด
git revert HEAD
git push origin main

# หรือ revert หลาย commits
git revert HEAD~3..HEAD
git push origin main
```

### Database Rollback

```bash
# ถ้า migration มีปัญหา — restore จาก backup
psql $DATABASE_URL < backup-YYYYMMDD.sql

# หรือใช้ Drizzle
npx drizzle-kit drop  # ลบ migration ล่าสุด
```

---

## Smoke Tests หลัง Deploy

```bash
PROD_URL="https://viberqc.com"

# Homepage
curl -s -o /dev/null -w "%{http_code}" $PROD_URL

# Login page
curl -s -o /dev/null -w "%{http_code}" $PROD_URL/login

# API auth
curl -s -o /dev/null -w "%{http_code}" $PROD_URL/api/auth/session

# Scan page
curl -s -o /dev/null -w "%{http_code}" $PROD_URL/scan
```

ทุกตัวต้องได้ 200 (ยกเว้น /dashboard ได้ 307 redirect = ปกติ)

---

## Monitoring

| Service          | URL                          | Alert                     |
| ---------------- | ---------------------------- | ------------------------- |
| UptimeRobot      | https://uptimerobot.com      | Email + Telegram ถ้า down |
| Sentry           | https://sentry.io            | Error rate spike          |
| Vercel Analytics | Vercel Dashboard             | Core Web Vitals           |
| Stripe Dashboard | https://dashboard.stripe.com | Payment failures          |

---

## Emergency Contacts

- Database issues → ตรวจ `DATABASE_URL` + PostgreSQL logs
- Auth issues → ตรวจ `NEXTAUTH_SECRET` + OAuth redirect URIs
- Payment issues → ตรวจ Stripe webhook signature + `STRIPE_WEBHOOK_SECRET`

---

## Database Backup

ดูรายละเอียดใน [scripts/backup-db.sh](scripts/backup-db.sh)

```bash
# รัน manual backup
bash scripts/backup-db.sh

# ตั้ง cron (ทุกวันตี 2)
crontab -e
# เพิ่มบรรทัด:
# 0 2 * * * /path/to/ViberQC/scripts/backup-db.sh
```
