# ViberQC — คู่มือเข้าใจ Project ฉบับทีมพัฒนา

> เขียนโดย: Founder | อัปเดตล่าสุด: 18 มีนาคม 2026
>
> เป้าหมายของบทความนี้: ให้ทีมเข้าใจ **ทั้งภาพธุรกิจ** และ **ภาพเทคนิค** ของ ViberQC
> เพื่อสามารถเข้ามาพัฒนาต่อได้ทันที

---

## สารบัญ

1. [ViberQC คืออะไร?](#1-viberqc-คืออะไร)
2. [ปัญหาที่เราแก้](#2-ปัญหาที่เราแก้)
3. [Business Model — เราหาเงินยังไง?](#3-business-model)
4. [User Journey — ลูกค้าใช้งานยังไง?](#4-user-journey)
5. [Tech Stack — เราใช้อะไรบ้าง?](#5-tech-stack)
6. [System Architecture — ภาพรวมระบบ](#6-system-architecture)
7. [Scan Engine — หัวใจของ Product](#7-scan-engine)
8. [Database — ข้อมูลเก็บยังไง?](#8-database)
9. [โครงสร้าง Folder — ไฟล์อยู่ตรงไหน?](#9-โครงสร้าง-folder)
10. [Project Status — ทำถึงไหนแล้ว?](#10-project-status)
11. [สิ่งที่ต้องทำต่อ](#11-สิ่งที่ต้องทำต่อ)
12. [วิธี Setup เพื่อเริ่มพัฒนา](#12-วิธี-setup)

---

## 1. ViberQC คืออะไร?

**ViberQC** คือ **AI-Powered 360° Quality Control Platform**

พูดง่ายๆ คือ: **เว็บแอปที่ช่วยสแกนเว็บไซต์/แอปว่ามีปัญหาอะไรบ้าง**
ครอบคลุม 8 ด้าน ตั้งแต่ Performance, Security, SEO ไปจนถึง Accessibility

คล้ายๆ กับ Google Lighthouse แต่:

- ครอบคลุมกว่า (8 ด้าน vs 4 ด้าน)
- มี AI ช่วยวิเคราะห์และให้คำแนะนำ
- แชร์ผลลัพธ์ได้ทันที (มี OG image preview)
- มี Dashboard ติดตามคุณภาพตลอดเวลา
- มี Badge แสดงคุณภาพติดบน README

### Mission (ภารกิจ)

> "ให้คนที่พัฒนา Viber App สามารถ QC ได้ครบ 360 องศา
> ด้วย AI เพื่อให้ App มีคุณภาพสูงสุดทั้ง Code, Performance และ Security"

### North Star Metric

**Time-to-First-Value (TTFV) < 3 นาที**
= ผู้ใช้ต้องเห็นคุณค่าของ product ภายใน 3 นาทีหลัง signup

---

## 2. ปัญหาที่เราแก้

```
┌─────────────────────────────────────────────────────────┐
│                    ปัญหาของ Developer                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  😩 "ไม่รู้จะ QC อะไรบ้าง"                              │
│     → ขาด checklist ที่ครอบคลุม                         │
│                                                         │
│  😩 "ต้องใช้หลาย tools"                                 │
│     → Lighthouse + OWASP + axe + PageSpeed + ...        │
│                                                         │
│  😩 "ผลลัพธ์ไม่มีคำแนะนำ"                               │
│     → รู้ว่าพัง แต่ไม่รู้จะแก้ยังไง                      │
│                                                         │
│  😩 "ไม่มี report ส่งลูกค้า"                             │
│     → ต้อง screenshot แล้วทำ slide เอง                  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✅ ViberQC แก้ทั้งหมดนี้ในที่เดียว                      │
│     URL → Scan → Report → Share ภายใน 3 นาที            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Target Users

| ลำดับ              | ใคร             | Pain Point                | ต้องการอะไร              |
| ------------------ | --------------- | ------------------------- | ------------------------ |
| **Primary**        | QA/QC Engineer  | ไม่รู้จะเทสต์อะไร ยังไง   | Checklist + AI วิเคราะห์ |
| **Secondary**      | Product Owner   | อยากเห็นภาพรวม QC ทั้งหมด | Dashboard + Report       |
| **Decision Maker** | CTO / Tech Lead | ลดเวลา QC, ลดต้นทุน       | ROI + Automation         |

---

## 3. Business Model

### เราหาเงินยังไง? → **SaaS Subscription**

ลูกค้าจ่ายรายเดือน/รายปี เพื่อใช้งาน scan ไม่จำกัด

```
┌──────────────────────────────────────────────────────────────┐
│                    💰 Pricing Plans                           │
├────────────┬────────────┬────────────┬───────────────────────┤
│    FREE    │    PRO     │    TEAM    │     ENTERPRISE        │
│   ฟรี!     │  ฿199/mo   │  ฿699/mo   │    Custom             │
│            │  ($12/mo)  │  ($39/mo)  │    ($99/mo)           │
├────────────┼────────────┼────────────┼───────────────────────┤
│ 3 scans/mo │ 1000/mo    │ 1000/mo    │ Unlimited             │
│ 1 project  │ 5 projects │ 20 projects│ Unlimited             │
│ 3 phases   │ 8 phases   │ 8 phases   │ 8 phases              │
│ No reports │ 5 PDF/mo   │ Unlimited  │ Unlimited             │
│ No API     │ 100 calls  │ 1000 calls │ Unlimited             │
│            │            │ 5 members  │ Unlimited members     │
├────────────┼────────────┼────────────┼───────────────────────┤
│  ส่วนลดรายปี: 33% (จ่าย 8 เดือน ได้ใช้ 12 เดือน)           │
└──────────────────────────────────────────────────────────────┘
```

### Revenue Streams (แหล่งรายได้)

```
                    ┌─────────────────┐
                    │   ViberQC       │
                    │   Revenue       │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
    │ Subscription│   │  API Access │   │  Enterprise │
    │  (Pro/Team) │   │  (per call) │   │  (Custom)   │
    │  ฿199-699   │   │  ฿0.5/call  │   │  Negotiate  │
    └─────────────┘   └─────────────┘   └─────────────┘
```

### Competitive Landscape (คู่แข่ง)

| เรา (ViberQC) | Google Lighthouse | SonarQube | Wiz.io        |
| ------------- | ----------------- | --------- | ------------- |
| 8 phases ครบ  | 4 phases          | Code only | Security only |
| AI แนะนำ      | ❌                | ❌        | ✅            |
| แชร์ผลได้     | ❌                | ❌        | ✅            |
| Free tier     | ✅                | ✅        | ❌            |
| Badge         | ✅                | ❌        | ❌            |
| ภาษาไทย       | ✅                | ❌        | ❌            |

---

## 4. User Journey

### Flow หลัก: "3-Minute Magic Flow"

นี่คือ flow ที่สำคัญที่สุดของ product — ออกแบบให้เกิด viral ในตัวเอง

```
┌─────────────────────────────────────────────────────────────────────┐
│                    🚀 3-Minute Magic Flow                           │
│                                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │  1. SEE  │───▶│ 2. SCAN  │───▶│ 3. WOW!  │───▶│ 4. SHARE │      │
│  │          │    │          │    │          │    │          │      │
│  │ เห็น post│    │ วาง URL  │    │ เห็น     │    │ แชร์ผล  │      │
│  │ บน social│    │ กด Scan  │    │ score +  │    │ ลัพธ์    │      │
│  │          │    │ (ไม่ต้อง │    │ issues   │    │ กลับไป  │      │
│  │          │    │ login!)  │    │          │    │ social   │      │
│  └──────────┘    └──────────┘    └────┬─────┘    └──────────┘      │
│                                      │                              │
│                                      ▼                              │
│                               ┌──────────┐    ┌──────────┐         │
│                               │ 5. LOCK  │───▶│ 6. PAY   │         │
│                               │          │    │          │         │
│                               │ "Signup  │    │ Free     │         │
│                               │  เพื่อดู │    │ หมด?     │         │
│                               │  ครบทุก  │    │ Upgrade  │         │
│                               │  issue"  │    │ to Pro!  │         │
│                               └──────────┘    └──────────┘         │
│                                                                     │
│  ⟳ วน loop: คนเห็น post → scan เอง → แชร์ต่อ → คนใหม่เห็น...     │
└─────────────────────────────────────────────────────────────────────┘
```

### Flow สำหรับ Registered User

```
Register → Create Project → Connect URL
                               │
                               ▼
                    ┌────────────────────┐
                    │   Run QC Scan      │
                    │   (8 phases)       │
                    └────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Dashboard│  │  Report  │  │  Badge   │
        │ 360° view│  │ PDF/Web  │  │ SVG      │
        │ + trends │  │ ส่งลูกค้า│  │ ติด repo │
        └──────────┘  └──────────┘  └──────────┘
```

---

## 5. Tech Stack

### ทำไมเลือก Stack นี้?

หลักการ: **"Boring but Lethal"** — เลือกเทคโนโลยีที่เสถียร, community ใหญ่, AI (Cursor/Claude) เขียนได้แม่น

```
┌─────────────────────────────────────────────────────────────┐
│                    🏗️ Tech Stack Overview                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─── FRONTEND ──────────────────────────────────────────┐  │
│  │  Next.js 16      → Framework หลัก (App Router)       │  │
│  │  React 19        → UI Library                         │  │
│  │  TypeScript 5.9  → Type Safety                        │  │
│  │  Tailwind CSS 4  → Styling (utility-first)            │  │
│  │  shadcn/ui v4    → Component Library                  │  │
│  │  Framer Motion 12→ Animation                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─── BACKEND ───────────────────────────────────────────┐  │
│  │  Next.js API Routes → REST API (อยู่ใน project เดียว) │  │
│  │  NextAuth.js v5     → Authentication (OAuth + Email)  │  │
│  │  Drizzle ORM        → Database queries (type-safe)    │  │
│  │  PostgreSQL         → Main database                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─── AI LAYER ──────────────────────────────────────────┐  │
│  │  Claude (Anthropic) → Primary AI                      │  │
│  │  OpenAI (GPT)       → Alternative                     │  │
│  │  Google Gemini      → Fallback (free tier)            │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─── SERVICES ──────────────────────────────────────────┐  │
│  │  Stripe            → Payment processing               │  │
│  │  Resend            → Transactional emails             │  │
│  │  Sentry            → Error monitoring                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─── STATE MANAGEMENT ──────────────────────────────────┐  │
│  │  Zustand           → Client state (scan progress)     │  │
│  │  TanStack Query    → Server state (data fetching)     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─── DESIGN ────────────────────────────────────────────┐  │
│  │  Palette B: "AI Precision"                            │  │
│  │  Primary: #5A52D5 (Electric Purple)                   │  │
│  │  Dark BG: #0F0B2E (Deep Purple)                       │  │
│  │  Fonts: Sarabun (TH) + Inter (EN)                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### เปรียบเทียบ Library ที่ใช้

| หมวด      | Library                 | ทำไมเลือก                                                   |
| --------- | ----------------------- | ----------------------------------------------------------- |
| Framework | Next.js 16 (App Router) | Full-stack ใน project เดียว, Server Components ลด JS bundle |
| UI        | shadcn/ui v4            | ไม่ lock-in, copy code เข้า project, customize ได้ 100%     |
| ORM       | Drizzle                 | Type-safe, lightweight, SQL-like syntax ไม่ต้องเรียนใหม่    |
| Auth      | NextAuth v5             | รองรับ Google/GitHub/Email, integrate กับ Drizzle ได้       |
| Animation | Framer Motion           | API ง่าย, รองรับ layout animation, exit animation           |
| State     | Zustand                 | เบา (1KB), ไม่ต้อง boilerplate, ใช้ง่ายกว่า Redux มาก       |
| Payment   | Stripe                  | มาตรฐานโลก, รองรับ subscription, webhook ครบ                |

---

## 6. System Architecture

### ภาพรวมระบบทั้งหมด

```
┌─────────────────────────────────────────────────────────────────┐
│                        SYSTEM ARCHITECTURE                       │
│                                                                  │
│  ┌──── CLIENT (Browser) ────────────────────────────────────┐   │
│  │                                                          │   │
│  │   ┌────────────┐  ┌────────────┐  ┌────────────┐       │   │
│  │   │  Marketing │  │    App     │  │   Auth     │       │   │
│  │   │   Pages    │  │  Dashboard │  │   Pages    │       │   │
│  │   │ (public)   │  │ (protected)│  │ (public)   │       │   │
│  │   └────────────┘  └─────┬──────┘  └────────────┘       │   │
│  │                         │                                │   │
│  │   Zustand (scan state) ◄┘  TanStack Query (API cache)   │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │ HTTP / fetch                       │
│                             ▼                                    │
│  ┌──── SERVER (Next.js API Routes) ─────────────────────────┐   │
│  │                                                          │   │
│  │   /api/scan/*      → Scan Engine (orchestrator.ts)       │   │
│  │   /api/projects/*  → Project CRUD                        │   │
│  │   /api/reports/*   → Report generation                   │   │
│  │   /api/user/*      → User management                     │   │
│  │   /api/auth/*      → NextAuth.js                         │   │
│  │   /api/badge/*     → Dynamic SVG badge                   │   │
│  │   /api/og/*        → OG image generation                 │   │
│  │   /api/webhook/*   → Stripe webhook                      │   │
│  │   /api/contact/*   → Contact form → Resend email         │   │
│  │   /api/waitlist/*  → Newsletter signup                   │   │
│  │                                                          │   │
│  └───────┬──────────────┬──────────────┬────────────────────┘   │
│          │              │              │                         │
│          ▼              ▼              ▼                         │
│  ┌─────────────┐ ┌───────────┐ ┌──────────────┐                │
│  │ PostgreSQL  │ │  AI APIs  │ │  3rd Party   │                │
│  │ (Drizzle)   │ │  Claude   │ │  Stripe      │                │
│  │ 11 tables   │ │  OpenAI   │ │  Resend      │                │
│  │             │ │  Gemini   │ │  Sentry      │                │
│  └─────────────┘ └───────────┘ └──────────────┘                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User กด Login
       │
       ├── Google OAuth ──┐
       ├── GitHub OAuth ──┤──▶ NextAuth.js ──▶ JWT Session
       └── Email+Password ┘         │
                                     ▼
                              ┌─────────────┐
                              │  Database    │
                              │  users table │
                              │  + accounts  │
                              │  + sessions  │
                              └─────────────┘
```

### Payment Flow

```
User กด Upgrade
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Pricing     │────▶│  Stripe      │────▶│  Webhook     │
│  Page        │     │  Checkout    │     │  /api/webhook │
│  (เลือก plan)│     │  (secure)    │     │  /stripe     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                         ┌──────────────┐
                                         │  Update DB   │
                                         │  user.plan   │
                                         │  = "pro"     │
                                         └──────────────┘
```

---

## 7. Scan Engine — หัวใจของ Product

### Scan ทำงานยังไง?

Scan Engine เป็นระบบ **rules-based** (ไม่ต้องใช้ AI ก็ scan ได้)
โค้ดหลักอยู่ที่ `src/lib/scan/orchestrator.ts`

```
┌─────────────────────────────────────────────────────────────────┐
│                     🔍 SCAN ENGINE FLOW                          │
│                                                                  │
│  User ใส่ URL                                                    │
│       │                                                          │
│       ▼                                                          │
│  ┌──────────────────┐                                            │
│  │  POST /api/scan  │                                            │
│  │  /start          │                                            │
│  └────────┬─────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌──────────────────┐     ┌─────────────────────────────────┐   │
│  │  Orchestrator    │────▶│  1. Fetch URL                   │   │
│  │                  │     │  2. Parse HTML                   │   │
│  │  (orchestrator   │     │  3. Analyze Headers              │   │
│  │   .ts)           │     │  4. Run 8 Phase Checks           │   │
│  └──────────────────┘     └──────────────┬──────────────────┘   │
│                                          │                       │
│           ┌──────────────────────────────┐│                       │
│           │     8 QC PHASES              ││                       │
│           │                              ▼│                       │
│   ┌───────┴───────────────────────────────┴──────────────────┐  │
│   │                                                          │  │
│   │  Phase 1: Performance (15%)   │  Phase 5: Code (15%)     │  │
│   │  → Load time, image sizes,    │  → HTML validity,        │  │
│   │    compression, caching       │    meta tags, structure   │  │
│   │                               │                          │  │
│   │  Phase 2: SEO (10%)           │  Phase 6: Best           │  │
│   │  → Title, meta, sitemap,      │    Practices (10%)       │  │
│   │    robots.txt, canonical      │  → HTTPS, viewport,      │  │
│   │                               │    doctype, charset      │  │
│   │  Phase 3: Accessibility (15%) │                          │  │
│   │  → Alt text, ARIA, color      │  Phase 7: PWA (5%)       │  │
│   │    contrast, form labels      │  → Manifest, SW,         │  │
│   │                               │    icons, offline         │  │
│   │  Phase 4: Security (20%)      │                          │  │
│   │  → HTTPS, CSP, HSTS,         │  Phase 8: Viber           │  │
│   │    X-Frame, cookies           │    Specific (10%)        │  │
│   │                               │  → Deep links, bot,      │  │
│   │                               │    share, rich media     │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│                    ┌──────────────────┐                          │
│                    │  Weighted Score  │                          │
│                    │  (0-100)         │                          │
│                    │  + Issue List    │                          │
│                    │  + Severity      │                          │
│                    └────────┬─────────┘                          │
│                             │                                    │
│                             ▼                                    │
│                    ┌──────────────────┐                          │
│                    │  Save to DB      │                          │
│                    │  scans +         │                          │
│                    │  scan_issues     │                          │
│                    └──────────────────┘                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Score Calculation (น้ำหนักแต่ละ Phase)

```
Total Score = Σ (Phase Score × Weight)

┌────────────────────┬────────┬──────────────────────────┐
│ Phase              │ Weight │ ████████████████████████ │
├────────────────────┼────────┼──────────────────────────┤
│ Security           │  20%   │ ████████████████████     │
│ Performance        │  15%   │ ███████████████          │
│ Accessibility      │  15%   │ ███████████████          │
│ Code Quality       │  15%   │ ███████████████          │
│ SEO                │  10%   │ ██████████               │
│ Best Practices     │  10%   │ ██████████               │
│ Viber Specific     │  10%   │ ██████████               │
│ PWA                │   5%   │ █████                    │
└────────────────────┴────────┴──────────────────────────┘

Score Ranges:
  90-100 = Excellent (🟢 เขียว)
  70-89  = Good      (🟡 เขียวอ่อน)
  50-69  = Average   (🟠 เหลือง)
  30-49  = Poor      (🟠 ส้ม)
   0-29  = Critical  (🔴 แดง)
```

---

## 8. Database

### ER Diagram (ความสัมพันธ์ของ Tables)

เราใช้ **PostgreSQL** + **Drizzle ORM** มีทั้งหมด **11 tables**

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                             │
│                                                                  │
│  ┌──────────┐ 1    N ┌──────────┐ 1    N ┌──────────────┐      │
│  │  users   │───────▶│ projects │───────▶│    scans     │      │
│  │          │        │          │        │              │      │
│  │ id       │        │ id       │        │ id           │      │
│  │ email    │        │ userId   │        │ projectId    │      │
│  │ name     │        │ name     │        │ userId       │      │
│  │ plan     │        │ url      │        │ url          │      │
│  │ role     │        │ githubRepo│       │ status       │      │
│  │ scansUsed│        │ lastScanId│       │ scores (JSON)│      │
│  └────┬─────┘        └──────────┘        │ phases (JSON)│      │
│       │                                   │ shareToken   │      │
│       │                                   └──────┬───────┘      │
│       │                                          │               │
│       │  1    N ┌──────────┐             1    N  │               │
│       │────────▶│ accounts │                     │               │
│       │         │ (OAuth)  │             ┌───────▼──────┐       │
│       │         └──────────┘             │ scan_issues  │       │
│       │                                  │              │       │
│       │  1    N ┌──────────┐             │ id           │       │
│       │────────▶│ sessions │             │ scanId       │       │
│       │         └──────────┘             │ phase        │       │
│       │                                  │ severity     │       │
│       │  1    N ┌──────────────┐         │ title        │       │
│       │────────▶│subscriptions │         │ description  │       │
│       │         │              │         │ recommendation│      │
│       │         │ stripeId     │         └──────────────┘       │
│       │         │ plan         │                                 │
│       │         │ status       │                                 │
│       │         └──────────────┘                                │
│       │                                                         │
│       │  1    N ┌──────────┐                                    │
│       └────────▶│ reports  │    ┌──────────┐  ┌───────────┐    │
│                 │ scanId   │    │ badges   │  │ waitlist   │    │
│                 │ format   │    │ projectId│  │ email      │    │
│                 │ shareUrl │    │ score    │  │ source     │    │
│                 └──────────┘    │ svg      │  └───────────┘    │
│                                 └──────────┘                    │
│                                                                  │
│  + verification_tokens (สำหรับ email verification)              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Enums ที่ใช้

```
user_role:           admin | user
auth_provider:       email | google | github
plan_type:           free | pro | team | enterprise
scan_status:         pending | running | completed | failed
subscription_status: active | canceled | past_due | trialing
```

---

## 9. โครงสร้าง Folder

```
src/
├── app/                          ← Next.js App Router (Pages + API)
│   ├── (marketing)/              ← หน้า Public (ไม่ต้อง login)
│   │   ├── page.tsx              ← Homepage
│   │   ├── about/                ← เกี่ยวกับเรา
│   │   ├── features/             ← Features
│   │   ├── how-it-works/         ← วิธีใช้
│   │   ├── pricing/              ← ราคา
│   │   ├── blog/                 ← บทความ
│   │   ├── contact/              ← ติดต่อ
│   │   ├── careers/              ← ร่วมงาน
│   │   ├── privacy/              ← Privacy Policy
│   │   ├── terms/                ← Terms of Service
│   │   └── cookies/              ← Cookie Policy
│   │
│   ├── (auth)/                   ← หน้า Authentication
│   │   ├── login/                ← เข้าสู่ระบบ
│   │   ├── register/             ← สมัครสมาชิก
│   │   └── forgot-password/      ← ลืมรหัสผ่าน
│   │
│   ├── (app)/                    ← หน้าที่ต้อง login ★ Protected ★
│   │   ├── dashboard/            ← Dashboard หลัก (5 tabs)
│   │   ├── projects/             ← จัดการ Projects
│   │   ├── history/              ← ประวัติ Scan
│   │   ├── reports/              ← Reports
│   │   └── settings/             ← ตั้งค่า
│   │
│   ├── api/                      ← API Routes (Backend)
│   │   ├── auth/[...nextauth]/   ← NextAuth handler
│   │   ├── scan/                 ← Scan CRUD + Engine
│   │   ├── projects/             ← Project CRUD
│   │   ├── reports/              ← Report generation
│   │   ├── user/                 ← User management
│   │   ├── badge/                ← QC Badge SVG
│   │   ├── og/                   ← OG Image
│   │   ├── contact/              ← Contact form
│   │   ├── waitlist/             ← Newsletter
│   │   └── webhook/stripe/       ← Stripe webhook
│   │
│   ├── scan/                     ← Public scan page (3-Min Magic Flow)
│   ├── r/[token]/                ← Shareable scan results
│   ├── layout.tsx                ← Root layout
│   ├── error.tsx                 ← Error boundary
│   ├── not-found.tsx             ← 404 page
│   ├── robots.ts                 ← robots.txt
│   └── sitemap.ts                ← sitemap.xml
│
├── components/                   ← React Components
│   ├── ui/                       ← shadcn/ui (15 components)
│   │   ├── button.tsx, card.tsx, input.tsx, dialog.tsx ...
│   │
│   ├── layout/                   ← Layout components
│   │   ├── navbar.tsx            ← Navigation bar
│   │   ├── app-sidebar.tsx       ← Sidebar (app pages)
│   │   ├── footer.tsx            ← Footer
│   │   └── session-provider.tsx  ← NextAuth provider
│   │
│   ├── dashboard/                ← Dashboard tab components
│   │   ├── overview-tab.tsx      ← Radar chart + Score gauge
│   │   ├── checklist-tab.tsx     ← 163 checklist items
│   │   ├── tools-tab.tsx         ← 35 QC tools
│   │   ├── prompt-tab.tsx        ← AI prompts
│   │   └── settings-tab.tsx      ← User preferences
│   │
│   ├── scan/                     ← Scan result components
│   │   ├── radar-chart.tsx       ← 8-phase radar
│   │   ├── score-gauge.tsx       ← Score circle
│   │   ├── issue-list.tsx        ← Issue cards
│   │   └── share-card.tsx        ← Shareable card
│   │
│   ├── marketing/                ← Landing page sections
│   │   ├── hero.tsx
│   │   ├── features-grid.tsx
│   │   └── pricing-cards.tsx
│   │
│   └── shared/                   ← Shared components
│       ├── logo.tsx
│       └── theme-toggle.tsx
│
├── lib/                          ← Core Logic / Utilities
│   ├── scan/
│   │   └── orchestrator.ts       ← ★ Scan Engine (หัวใจ product)
│   ├── ai/
│   │   └── client.ts             ← Multi-provider AI client
│   ├── db/
│   │   ├── schema.ts             ← Drizzle schema (11 tables)
│   │   └── index.ts              ← DB connection
│   ├── auth.ts                   ← NextAuth config
│   ├── auth-utils.ts             ← Auth helpers
│   ├── actions/auth.ts           ← Server actions
│   └── utils.ts                  ← Utility functions
│
├── config/                       ← Configuration
│   ├── site.ts                   ← Plans, Pricing, Phases
│   └── theme.ts                  ← Design tokens, Colors
│
├── data/                         ← Static Data
│   ├── checklist.ts              ← 163 QC checklist items
│   ├── tools.ts                  ← 35 QC tools
│   └── prompts.ts                ← AI prompt library
│
├── types/
│   └── index.ts                  ← TypeScript types
│
└── middleware.ts                  ← Auth middleware
```

### ไฟล์สำคัญที่ต้องรู้จัก

| ไฟล์                       | ทำอะไร                                     | ขนาด            |
| -------------------------- | ------------------------------------------ | --------------- |
| `lib/scan/orchestrator.ts` | **Scan Engine** — หัวใจของ product ทั้งหมด | 1,394 บรรทัด ⚠️ |
| `lib/db/schema.ts`         | Database schema ทั้ง 11 tables             | ~300 บรรทัด     |
| `lib/auth.ts`              | NextAuth config (OAuth providers)          | ~150 บรรทัด     |
| `config/site.ts`           | Plans, pricing, scan phases                | ~75 บรรทัด      |
| `config/theme.ts`          | Design tokens, colors, fonts               | ~100 บรรทัด     |
| `data/checklist.ts`        | 163 QC checklist items                     | ~500 บรรทัด     |

---

## 10. Project Status

### Phase Progress

```
Phase 0: Foundation          ████████████████████ 100% ✅
Phase 1: Design System       ████████████████████ 100% ✅
Phase 2: Pages               ████████████████████ 100% ✅
Phase 3: Integration         ████████████████████ 100% ✅
Phase 4: Polish & UX         ████████████████████ 100% ✅
Phase 5: DB Setup            ████████████████████ 100% ✅
Phase 6: Launch Prep         ████████████████████ 100% ✅
Phase 7: Testing & QA        ░░░░░░░░░░░░░░░░░░░░   0% ❌
Phase 8: Production Deploy   ░░░░░░░░░░░░░░░░░░░░   0% ❌

Overall: ████████████████░░░░ ~78%
```

### สิ่งที่ทำเสร็จแล้ว

| หมวด           | รายละเอียด                                 | จำนวน       |
| -------------- | ------------------------------------------ | ----------- |
| Pages          | Marketing + Auth + App + Scan              | 21 หน้า     |
| API Routes     | CRUD + Scan + Auth + Webhook               | 13 routes   |
| Components     | UI + Layout + Dashboard + Scan + Marketing | 36 ชิ้น     |
| Database       | PostgreSQL tables with Drizzle ORM         | 11 tables   |
| Auth           | Google + GitHub + Email/Password           | 3 providers |
| Scan Engine    | Rules-based, 8 phases, weighted scoring    | ✅ ทำงานได้ |
| Payment        | Stripe integration + webhook               | ✅          |
| Email          | Contact form + Resend                      | ✅          |
| SEO            | robots.txt, sitemap.xml, OG images         | ✅          |
| Error Handling | Error boundary, 404 page, loading states   | ✅          |
| Monitoring     | Sentry integration                         | ✅          |

---

## 11. สิ่งที่ต้องทำต่อ

### Phase 7: Testing & QA (สำคัญมาก!)

```
┌─────────────────────────────────────────────────────┐
│  ❌ ยังไม่มี Test ใดๆ เลย                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  □ Unit Tests                                       │
│    → Scan engine (orchestrator.ts)                  │
│    → Score calculation                              │
│    → API route handlers                             │
│                                                     │
│  □ Integration Tests                                │
│    → Auth flow (login/register/OAuth)               │
│    → Scan flow (URL → Score → Save)                 │
│    → Payment flow (Stripe webhook)                  │
│                                                     │
│  □ E2E Tests                                        │
│    → 3-Minute Magic Flow                            │
│    → Dashboard interactions                         │
│    → Shareable results                              │
│                                                     │
│  □ Cross-browser Testing                            │
│    → Chrome, Firefox, Safari, Edge                  │
│                                                     │
│  □ Mobile Responsiveness                            │
│    → ทุกหน้าต้องใช้งานบนมือถือได้                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Phase 8: Production Deploy

```
□ Vercel deployment
□ Environment variables (production)
□ Domain setup (viberqc.com)
□ SSL certificate
□ Database production setup
□ Stripe production keys
□ OAuth redirect URIs (production)
□ Sentry DSN (production)
□ Smoke tests on production
```

### Known Issues ที่ต้องแก้

| Issue            | ไฟล์                            | รายละเอียด                            |
| ---------------- | ------------------------------- | ------------------------------------- |
| ⚠️ ไฟล์ใหญ่เกิน  | `orchestrator.ts` (1,394 lines) | ควร refactor แยกเป็นไฟล์ย่อยต่อ phase |
| ⚠️ ไฟล์ใหญ่เกิน  | `checklist-tab.tsx` (812 lines) | ควรแยก sub-components                 |
| ⚠️ ไฟล์ใหญ่เกิน  | `overview-tab.tsx` (524 lines)  | ควรแยก chart components               |
| ⚠️ i18n ปิดอยู่  | `middleware.ts`                 | next-intl รอ [locale] structure       |
| ⚠️ Uncommitted   | 80+ files                       | ต้อง commit/push ก่อนทีมเข้ามา        |
| ⚠️ Path มี space | "Cursor Project"                | อาจมีปัญหา node_modules               |

---

## 12. วิธี Setup เพื่อเริ่มพัฒนา

### Prerequisites

- Node.js 18+ (แนะนำ 20+)
- PostgreSQL (local หรือ cloud)
- Git

### Step-by-step

```bash
# 1. Clone repo
git clone <repo-url>
cd ViberQC

# 2. Install dependencies
npm install

# 3. สร้างไฟล์ .env.local (copy จาก .env.example)
cp .env.example .env.local

# 4. แก้ไข .env.local ใส่ค่าจริง
#    - DATABASE_URL        ← PostgreSQL connection string
#    - NEXTAUTH_SECRET     ← random string 32+ chars
#    - GOOGLE_CLIENT_ID    ← Google OAuth
#    - GOOGLE_CLIENT_SECRET
#    - GITHUB_CLIENT_ID    ← GitHub OAuth
#    - GITHUB_CLIENT_SECRET

# 5. สร้าง database tables
npx drizzle-kit push

# 6. รัน dev server (port 6161)
npm run dev
# → เปิด http://localhost:6161
```

### Environment Variables ที่ต้องมี

| Variable                | ต้องมี?  | คำอธิบาย                            |
| ----------------------- | -------- | ----------------------------------- |
| `DATABASE_URL`          | ✅       | PostgreSQL connection string        |
| `NEXTAUTH_URL`          | ✅       | URL ของ app (http://localhost:6161) |
| `NEXTAUTH_SECRET`       | ✅       | Random string 32+ chars             |
| `GOOGLE_CLIENT_ID`      | ✅       | Google OAuth                        |
| `GOOGLE_CLIENT_SECRET`  | ✅       | Google OAuth                        |
| `GITHUB_CLIENT_ID`      | ✅       | GitHub OAuth                        |
| `GITHUB_CLIENT_SECRET`  | ✅       | GitHub OAuth                        |
| `STRIPE_SECRET_KEY`     | ✅       | Stripe payment                      |
| `STRIPE_WEBHOOK_SECRET` | ✅       | Stripe webhook                      |
| `RESEND_API_KEY`        | ✅       | Email service                       |
| `ANTHROPIC_API_KEY`     | Optional | Claude AI                           |
| `OPENAI_API_KEY`        | Optional | GPT AI                              |
| `GOOGLE_API_KEY`        | Optional | Gemini AI                           |
| `SENTRY_DSN`            | Optional | Error tracking                      |

### Scripts ที่ใช้บ่อย

```bash
npm run dev          # รัน dev server (port 6161)
npm run build        # Build production
npm run start        # Start production server
npm run lint         # Run ESLint
npx drizzle-kit push # Push schema to DB
npx drizzle-kit studio # เปิด Drizzle Studio (DB UI)
npx tsc --noEmit     # TypeScript check
```

---

## สรุป

ViberQC เป็น **AI-Powered QC Platform** ที่:

1. **Product**: สแกนเว็บไซต์ 8 ด้าน ให้ score + คำแนะนำ ภายใน 3 นาที
2. **Business**: SaaS subscription model (Free → Pro → Team → Enterprise)
3. **Tech**: Next.js + React + TypeScript + PostgreSQL + AI (Claude/GPT/Gemini)
4. **Status**: ~78% เสร็จ (UI + API + DB + Scan Engine ครบ, ยังขาด Testing + Deploy)
5. **Next Step**: Testing → Deploy → Launch

> "Scan your website. Fix what matters. Ship with confidence."

---

_อัปเดตล่าสุด: 18 มีนาคม 2026_
