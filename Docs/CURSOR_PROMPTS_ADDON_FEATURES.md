# ViberQC — Cursor AI Prompts สำหรับพัฒนา Add-on Features

> อัปเดต: 19 มีนาคม 2026
>
> วิธีใช้: Copy prompt ในแต่ละ code block ไปวางใน Cursor AI Chat แล้วรันได้เลย
> Prompts #1-3, #11-12 ทำเสร็จแล้ว — เหลือ #4-10 ที่ต้องเชื่อม external API keys

---

## สถานะรวม

| #   | Prompt                     | สถานะ         | หมายเหตุ                                         |
| --- | -------------------------- | ------------- | ------------------------------------------------ |
| 1   | Credits & Add-on DB Schema | ✅ DONE       | 5 tables, seed data, credits service             |
| 2   | API Integration Layer      | ✅ DONE       | BaseClient, circuit breaker, rate limiter, cache |
| 3   | Report Generation Pipeline | ✅ DONE       | Puppeteer + QuickChart + AI Summary + PDF cache  |
| 4   | Security Deep Scan         | ⚠️ CODE READY | ต้องใส่ API keys เพื่อ activate                  |
| 5   | SEO Pro Scan               | ⚠️ CODE READY | ต้องใส่ API keys เพื่อ activate                  |
| 6   | Performance Insight        | ⚠️ CODE READY | PageSpeed ใช้ได้เลย (free)                       |
| 7   | Accessibility Audit        | ⚠️ CODE READY | axe-core + Pa11y ใช้ได้ (free)                   |
| 8   | Code Quality               | ⚠️ CODE READY | ต้องใส่ API keys + GitHub repo                   |
| 9   | Cross-Browser & Mobile     | ⚠️ CODE READY | ต้องใส่ API keys                                 |
| 10  | Uptime & Monitoring        | ⚠️ CODE READY | ต้องใส่ API keys                                 |
| 11  | AI Fix Suggestions         | ✅ DONE       | OpenRouter + Public API + UI panel               |
| 12  | Add-on Marketplace UI      | ✅ DONE       | /addons page + /addons/my                        |

---

## สิ่งที่ยังต้องทำ — Prompts สำหรับทีม

### ลำดับแนะนำ

```
Quick Wins (ใช้ free APIs ได้เลย):
  → Prompt #A: Activate Free Deep Scans (PageSpeed + Observatory + SSL Labs + CrUX)
  → Prompt #B: Deep Scan Results UI (หน้าแสดงผล deep scan)

เมื่อมี API keys:
  → Prompt #C: Activate Paid APIs (ใส่ key → ระบบทำงานทันที)
  → Prompt #D: Stripe Payment Integration (ซื้อ credits จริง)

Nice to have:
  → Prompt #E: Email Report Delivery (Resend integration)
  → Prompt #F: Uptime Monitoring Dashboard
  → Prompt #G: End-to-End Testing
```

---

<a id="prompt-a"></a>

## Prompt #A: Activate Free Deep Scans (Quick Win)

```markdown
# TASK: Activate Free Deep Scans for ViberQC

## Context

ViberQC มี deep scan API routes พร้อมแล้ว 6 ตัว แต่ยังไม่ได้เชื่อมเข้ากับ UI
ต้องการให้ free scan (ไม่ต้อง login) สามารถเรียก deep scan APIs ที่ใช้ free providers ได้

## Tech Stack

- Next.js 16 + React 19 + TypeScript
- shadcn/ui v4 (ไม่มี asChild — ใช้ buttonVariants แทน)
- Tailwind CSS 4
- Framer Motion 12+
- OpenRouter AI (OPENROUTER_API_KEY)
- Port: 6161

## Architecture ที่มีอยู่แล้ว

- Scan engine: `src/lib/scan/orchestrator.ts` (rules-based, 8 phases)
- Deep scan orchestrators: `src/lib/integrations/{security,seo,performance,accessibility}/orchestrator.ts`
- Free API clients ที่ใช้ได้ทันที (ไม่ต้อง API key):
  - `src/lib/integrations/security/observatory-client.ts` (Mozilla Observatory)
  - `src/lib/integrations/security/ssllabs-client.ts` (SSL Labs)
  - `src/lib/integrations/performance/pagespeed-client.ts` (Google PageSpeed)
  - `src/lib/integrations/seo/crux-client.ts` (Chrome UX Report)
  - `src/lib/integrations/accessibility/axe-client.ts` (axe-core)
  - `src/lib/integrations/accessibility/pa11y-client.ts` (Pa11y)

## Requirements

### 1. สร้าง Public Deep Scan API

สร้าง endpoint ใหม่ `POST /api/scan/deep-free` ที่:

- ไม่ต้อง auth (public path ใน middleware)
- รับ `{ url: string }` จาก body
- เรียก free providers ทั้งหมดพร้อมกัน (Promise.allSettled)
- Return ผลรวมของทุก provider

### 2. เพิ่ม Deep Scan Button ในหน้า Scan Result

ในไฟล์ `src/app/scan/page.tsx`:

- เพิ่มปุ่ม "Run Deep Scan (Free)" หลัง AI Fix panel
- กดแล้วเรียก `/api/scan/deep-free`
- แสดง loading state ขณะ scan
- แสดงผลลัพธ์เมื่อเสร็จ

### 3. Deep Scan Results Component

สร้าง component `src/components/scan/deep-scan-results.tsx`:

- แสดงผลจากแต่ละ provider เป็น card
- Security: Observatory grade + SSL Labs grade
- Performance: PageSpeed score + metrics (LCP, FID, CLS)
- SEO: CrUX data
- Accessibility: axe-core violations + Pa11y issues
- แต่ละ card มี expand/collapse

## Constraints

- ห้ามแก้ existing orchestrator files
- ใช้ dynamic import สำหรับ heavy components
- ไฟล์เดียว < 300 บรรทัด (แยกถ้าเกิน)
- ภาษาไทยสำหรับ UI labels
```

---

<a id="prompt-b"></a>

## Prompt #B: Deep Scan Results UI (Dashboard Integration)

```markdown
# TASK: Deep Scan Results in Dashboard

## Context

ViberQC มี Dashboard ที่ /dashboard (protected, ต้อง login)
ต้องการเพิ่ม tab "Deep Scan" ใน dashboard ที่แสดงผล deep scan history + trigger new scans

## Existing Files

- Dashboard: `src/app/(app)/dashboard/page.tsx`
- Dashboard tabs: `src/components/dashboard/` (overview-tab, checklist-tab, tools-tab, prompt-tab, settings-tab)
- Deep scan APIs: `src/app/api/scan/{security,seo,performance,accessibility,code-quality,cross-browser}-deep/route.ts`
- Credits service: `src/lib/credits/service.ts`

## Requirements

### 1. สร้าง Deep Scan Tab Component

ไฟล์: `src/components/dashboard/deep-scan-tab.tsx`

Features:

- แสดง user's credit balance
- ปุ่ม trigger deep scan แต่ละ type (Security, SEO, Performance, Accessibility)
- แสดงผลลัพธ์ล่าสุดของแต่ละ type
- Free providers มี badge "FREE" สีเขียว
- Paid providers มี badge "1 Credit" สีม่วง + ต้อง check credits ก่อน

### 2. เพิ่ม Tab ใน Dashboard

เพิ่ม "Deep Scan" tab ใน dashboard page พร้อม icon Microscope หรือ ScanSearch

### 3. Deep Scan History API

ถ้ายังไม่มี: สร้าง `GET /api/scan/deep-history` ที่:

- Return user's deep scan history (last 20)
- Group by type (security, seo, etc.)
- Include scores + provider results

## Design

- ใช้ theme colors จาก `src/config/theme.ts`
- Primary: #6C63FF, Background dark: #0F0B2E
- ใช้ Framer Motion สำหรับ animations
- shadcn/ui v4 components (ไม่มี asChild)

## Constraints

- Component < 300 บรรทัด
- ใช้ dynamic import
- ต้องแสดง error state ถ้า credits ไม่พอ
```

---

<a id="prompt-c"></a>

## Prompt #C: Activate Paid APIs

````markdown
# TASK: Activate Paid API Integrations

## Context

ViberQC มี API client implementations พร้อมแล้วทั้งหมด (47+ files)
แต่ยังไม่ได้ทดสอบกับ API จริง — ต้อง validate + fix ให้ทำงานได้จริงเมื่อใส่ API keys

## API Keys ที่ต้องใส่ใน .env.local (ทำทีละตัว)

### Priority 1 — High ROI

| API      | Env Variable     | Pricing                 | สมัครที่                    |
| -------- | ---------------- | ----------------------- | --------------------------- |
| Snyk     | SNYK_API_TOKEN   | Free tier: 200 tests/mo | https://app.snyk.io         |
| WAVE     | WAVE_API_KEY     | $10/mo: 100 credits     | https://wave.webaim.org/api |
| GTmetrix | GTMETRIX_API_KEY | Free: 200 tests/mo      | https://gtmetrix.com/api    |

### Priority 2 — Medium ROI

| API        | Env Variable                           | Pricing              | สมัครที่                     |
| ---------- | -------------------------------------- | -------------------- | ---------------------------- |
| DataForSEO | DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD | $50/mo credit        | https://dataforseo.com       |
| Moz        | MOZ_ACCESS_ID + MOZ_SECRET_KEY         | Free: 10 queries/mo  | https://moz.com/products/api |
| SonarCloud | SONARCLOUD_TOKEN                       | Free for open source | https://sonarcloud.io        |

### Priority 3 — Enterprise

| API          | Env Variable                                    | Pricing        |
| ------------ | ----------------------------------------------- | -------------- |
| BrowserStack | BROWSERSTACK_USERNAME + BROWSERSTACK_ACCESS_KEY | $29/mo         |
| Detectify    | DETECTIFY_API_KEY                               | Custom pricing |
| Ahrefs       | AHREFS_API_TOKEN                                | $99/mo         |

## Requirements

### สำหรับแต่ละ API ที่จะ activate:

1. สมัคร account + ได้ API key
2. ใส่ key ใน `.env.local`
3. ทดสอบด้วย curl หรือ node script ว่า API ตอบกลับถูกต้อง
4. ทดสอบผ่าน ViberQC deep scan endpoint
5. ตรวจว่า credits deduction ทำงานถูกต้อง
6. ตรวจว่า error handling ทำงานเมื่อ API down

### Test Script Template

```bash
# ตัวอย่าง: ทดสอบ Snyk API
curl -s -H "Authorization: token $SNYK_API_TOKEN" \
  https://api.snyk.io/v1/test/npm/lodash/4.17.21 \
  | python3 -m json.tool | head -20
```
````

## Client Files ที่ต้อง validate

- `src/lib/integrations/security/snyk-client.ts`
- `src/lib/integrations/security/observatory-client.ts`
- `src/lib/integrations/security/ssllabs-client.ts`
- `src/lib/integrations/seo/dataforseo-client.ts`
- `src/lib/integrations/seo/moz-client.ts`
- `src/lib/integrations/performance/gtmetrix-client.ts`
- `src/lib/integrations/performance/pagespeed-client.ts`
- `src/lib/integrations/accessibility/wave-client.ts`
- `src/lib/integrations/accessibility/axe-client.ts`
- `src/lib/integrations/code-quality/sonarcloud-client.ts`

## Constraints

- อย่าแก้ code ถ้า API ทำงานถูกต้องอยู่แล้ว
- ถ้าต้องแก้ ให้แก้เฉพาะ client file ที่มี bug
- ห้ามเปลี่ยน API client interface (types.ts)

````

---

<a id="prompt-d"></a>
## Prompt #D: Stripe Payment Integration

```markdown
# TASK: Complete Stripe Payment for Credits

## Context
ViberQC มี Stripe webhook handler อยู่แล้วที่ `src/app/api/webhook/stripe/route.ts`
แต่ยังไม่ได้เชื่อม checkout flow จริง ต้องทำให้ user สามารถซื้อ credits ผ่าน Stripe ได้

## Existing Files
- Webhook: `src/app/api/webhook/stripe/route.ts`
- Credits service: `src/lib/credits/service.ts` (addCredits, deductCredits, etc.)
- Add-on packages: DB table `addonPackages` (10 packages seeded)
- Pricing page: `src/app/(marketing)/pricing/page.tsx`
- Addons marketplace: `src/app/(app)/addons/page.tsx`

## Env Variables ที่ต้องใส่
````

STRIPE*SECRET_KEY=sk_test*...
NEXT*PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test*...
STRIPE*WEBHOOK_SECRET=whsec*...

```

## Requirements

### 1. Stripe Checkout API Route
สร้าง `POST /api/stripe/checkout`:
- รับ `{ packageSlug: string, billingPeriod: 'monthly' | 'yearly' }`
- สร้าง Stripe Checkout Session
- Return `{ checkoutUrl: string }`

### 2. Stripe Product Setup Script
สร้าง `scripts/stripe-setup.ts` ที่:
- สร้าง Stripe Products + Prices สำหรับทุก add-on package
- Map ราคาจาก DB (addonPackages table)
- สร้างทั้ง monthly + yearly prices

### 3. Buy Button ใน Addons Page
แก้ `src/app/(app)/addons/page.tsx`:
- เพิ่มปุ่ม "Buy" ที่เรียก checkout API
- Redirect ไป Stripe Checkout
- Handle success/cancel URLs

### 4. Webhook Handler Update
ตรวจ/แก้ webhook handler ให้:
- Handle `checkout.session.completed` → addCredits
- Handle `customer.subscription.updated` → update plan
- Handle `customer.subscription.deleted` → downgrade

### 5. Success Page
สร้าง `/addons/success` page:
- แสดง "ซื้อสำเร็จ!" + credit balance ใหม่
- ปุ่มกลับ dashboard

## Constraints
- ใช้ Stripe test mode ก่อน (sk_test_...)
- ห้ามเก็บ credit card info ใน DB
- ตรวจ webhook signature ทุกครั้ง
- ทดสอบด้วย Stripe CLI: `stripe listen --forward-to localhost:6161/api/webhook/stripe`
```

---

<a id="prompt-e"></a>

## Prompt #E: Email Report Delivery (Resend)

```markdown
# TASK: Activate Email Report Delivery

## Context

ViberQC มี email module อยู่แล้วที่ `src/lib/report/email.ts`
ใช้ Resend API — ต้องใส่ key + ทดสอบให้ทำงานจริง

## Env Variables
```

RESEND*API_KEY=re*...
FROM_EMAIL=reports@viberqc.com

````

## Requirements

### 1. ตั้งค่า Resend
- สมัครที่ https://resend.com (free tier: 100 emails/day)
- ตั้งค่า domain verification (หรือใช้ onboarding@resend.dev สำหรับ test)
- ใส่ RESEND_API_KEY ใน .env.local

### 2. ทดสอบส่ง Email
สร้าง test script:
```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'your-email@gmail.com',
  subject: 'ViberQC Test',
  html: '<h1>Test OK!</h1>'
}).then(r => console.log('Sent:', r)).catch(e => console.error(e));
"
````

### 3. เพิ่มปุ่ม "Email Report" ในหน้า Reports

แก้ `src/app/(app)/reports/page.tsx`:

- เพิ่มปุ่ม "Send to Email" ข้าง Download
- Modal ให้กรอก email address
- เรียก POST /api/reports (ที่มีอยู่แล้ว) พร้อม emailTo parameter

### 4. ทดสอบ Flow

- Login → สร้าง scan → สร้าง report → กด Email → เช็ค inbox

## File ที่เกี่ยวข้อง

- `src/lib/report/email.ts` — Email template + Resend client (ทำเสร็จแล้ว)
- `src/app/api/reports/route.ts` — POST handler (รองรับ emailTo แล้ว)

````

---

<a id="prompt-f"></a>
## Prompt #F: Uptime Monitoring Dashboard

```markdown
# TASK: Build Uptime Monitoring Dashboard

## Context
ViberQC มี uptime monitoring clients อยู่แล้ว:
- `src/lib/integrations/uptime/uptimerobot-client.ts`
- `src/lib/integrations/uptime/betterstack-client.ts`
- `src/lib/integrations/uptime/orchestrator.ts`

ต้องสร้าง UI ให้ user ตั้งค่า + ดูผล uptime monitoring

## Requirements

### 1. Monitoring API Routes
สร้าง `src/app/api/monitoring/`:
- `GET /api/monitoring` — List user's monitors
- `POST /api/monitoring` — Create new monitor (url + interval)
- `DELETE /api/monitoring/[id]` — Remove monitor
- `GET /api/monitoring/status` — Get current status of all monitors

### 2. Monitoring Dashboard Page
สร้าง `src/app/(app)/dashboard/monitoring/` หรือเพิ่ม tab ใน dashboard:
- แสดงรายการ monitors + status (up/down)
- Uptime % ใน 30 วัน
- Response time chart
- Alert history
- ปุ่มเพิ่ม/ลบ monitor

### 3. Env Variables ที่ต้องการ
````

UPTIMEROBOT_API_KEY=... # Free: 50 monitors
BETTER_STACK_API_TOKEN=... # Free: 5 monitors

```

## Constraints
- UptimeRobot free tier: 50 monitors, 5-min interval
- Better Stack free tier: 5 monitors, 3-min interval
- แสดง uptime data จาก provider ที่มี key
```

---

<a id="prompt-g"></a>

## Prompt #G: End-to-End Testing

````markdown
# TASK: Add E2E Tests for ViberQC

## Context

ViberQC ยังไม่มี test ใดๆ เลย (Phase 7 ใน project plan)
ต้องเพิ่ม test suite เพื่อ confidence ก่อน production deploy

## Requirements

### 1. Setup Testing Framework

- Install Playwright สำหรับ E2E tests
- Install Vitest สำหรับ unit tests
- ตั้งค่า `playwright.config.ts` + `vitest.config.ts`

### 2. Unit Tests (Vitest)

ไฟล์สำคัญที่ต้องมี test:

- `src/lib/scan/orchestrator.ts` — score calculation, phase analysis
- `src/lib/credits/service.ts` — balance, deduct, refund
- `src/lib/report/charts.ts` — chart URL generation
- `src/lib/ai/client.ts` — provider fallback logic

### 3. E2E Tests (Playwright)

Flows ที่ต้องทดสอบ:

- **3-Minute Magic Flow**: Homepage → Scan → See results → Share
- **Auth Flow**: Register → Login → Dashboard
- **Report Flow**: Scan → Generate PDF → Download
- **Add-on Flow**: Browse marketplace → View details
- **Responsive**: ทุกหน้าต้องใช้งานบน mobile ได้

### 4. CI/CD Integration

- สร้าง GitHub Actions workflow
- Run tests on PR
- Block merge if tests fail

## Scripts to Add

```json
{
  "test": "vitest",
  "test:e2e": "playwright test",
  "test:coverage": "vitest --coverage"
}
```
````

````

---

## Reference: สิ่งที่ทำเสร็จแล้ว (ไม่ต้อง prompt)

### Prompt #1: Credits & Add-on DB Schema ✅
- 5 tables: addonPackages, userAddons, creditTransactions, addonApiUsage, addonScanResults
- Credits service: 7 functions (balance, check, deduct, add, refund, reset, history)
- Seed data: 10 add-on packages

### Prompt #2: API Integration Layer ✅
- BaseApiClient: retry, circuit breaker, rate limiter, cache
- 47+ integration files across 7 categories
- API client factory with configs

### Prompt #3: Report Generation ✅
- Puppeteer → PDF (A4, 3 pages: cover + charts + issues)
- QuickChart: Radar + Gauge + Bar charts
- AI Executive Summary via OpenRouter
- PDF caching (filesystem)
- Public API: `/api/reports/generate`
- Download button ในหน้า scan result

### Prompt #11: AI Fix Suggestions ✅
- OpenRouter + Claude + GPT + Gemini support
- Public API: `/api/scan/ai-fix-public` (free, top 3 fixes)
- Auth API: `/api/scan/ai-fix` (credits-based, unlimited)
- UI: `src/components/scan/ai-fix-panel.tsx`

### Prompt #12: Add-on Marketplace UI ✅
- Public marketplace: `/addons`
- Protected my-addons: `/addons/my`
- API: GET/POST `/api/addons`
- Credits API: `/api/credits`

---

## Quick Reference: Env Variables

```bash
# ===== REQUIRED (มีแล้ว) =====
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:6161
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
OPENROUTER_API_KEY=sk-or-v1-...

# ===== TO ACTIVATE =====
# Payment
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...

# Security APIs (Free)
# Observatory + SSL Labs = ไม่ต้อง key

# Security APIs (Paid)
SNYK_API_TOKEN=...
STACKHAWK_API_KEY=...

# Performance APIs
# PageSpeed = ไม่ต้อง key
GTMETRIX_API_KEY=...

# SEO APIs
# CrUX = ไม่ต้อง key
DATAFORSEO_LOGIN=...
DATAFORSEO_PASSWORD=...
MOZ_ACCESS_ID=...
MOZ_SECRET_KEY=...

# Accessibility APIs
# axe-core + Pa11y = ไม่ต้อง key
WAVE_API_KEY=...

# Code Quality
SONARCLOUD_TOKEN=...

# Cross-Browser
BROWSERSTACK_USERNAME=...
BROWSERSTACK_ACCESS_KEY=...

# Uptime Monitoring
UPTIMEROBOT_API_KEY=...
BETTER_STACK_API_TOKEN=...

# Freepik (images)
FREEPIK_API_KEY=...
````
