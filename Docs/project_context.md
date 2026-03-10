# project_context.md
# ============================================================
# PROJECT CONTEXT — Fill this before any development starts
# Cursor AI reads this file at the start of EVERY session
# ============================================================
# INSTRUCTIONS:
# 1. Fill ALL sections before writing code
# 2. Update "Current Status" section after each session
# 3. Never delete old entries — add new ones with date
# ============================================================

---

## 🎯 PROJECT IDENTITY

```
Project Name:      ViberQC
Type:              Web App (SaaS) — Dedicated VPS Linux
Phase:             Phase 0: Foundation (Not started)
Sprint:            Not started
Last Updated:      2026-03-10
```

---

## 🌟 NORTH STAR

```
One-sentence mission:
"ViberQC มีไว้เพื่อให้คนที่พัฒนา Viber App สามารถ QC ได้ครบ 360 องศา
ด้วย AI เพื่อให้ App มีคุณภาพสูงสุดทั้ง Code, Performance และ Security"

What users feel after 8 seconds on homepage:
"WOW — งาน QC สำหรับ Viber ด้วย AI แบบครบ จบในทีเดียว"

What users remember after closing the tab:
"AI QC ที่สแกนครบทุกมิติ ใน 30 วินาที"

WOW Benchmark (what we must match or beat):
Primary:   wiz.io — Security visualization + interactive demo + modern dark UI
Secondary: virtuosoqa.com — AI + QA domain, natural language test builder
```

---

## 👥 TARGET USERS

### Primary User (QA/QC Engineer)
```
Who:           QA/QC Engineer ที่ทำงานกับ Viber App
Pain Point:    ขาดความรู้ ความเข้าใจ ไม่รู้จะทดสอบอะไร ยังไง
Goal:          App ที่ผ่าน QC แล้วคุณภาพสูง แตกต่างอย่างเห็นได้ชัด
               ทั้ง Code, Performance, Security และอื่นๆ แบบ 360 องศา
Success looks like: "App ผ่าน ViberQC แล้วคุณภาพสูง แตกต่างอย่างเห็นได้ชัด"
Tech comfort:  Beginner — ต้องใช้ง่ายมาก
Device:        Both (Desktop + Mobile)
Language:      Both (Thai + English)
```

### Secondary User (Product Owner)
```
Who:           Product Owner ที่ดูแล Viber App project
Pain Point:    ต้องการเห็นภาพรวม QC ทั้งหมดในที่เดียว
Goal:          ตรวจสอบคุณภาพ App ก่อน release ได้อย่างมั่นใจ
```

### Decision Maker (for pitching)
```
Who:           QA/QC, CTO, Tech Lead, เจ้าของบริษัท (สาย Viber)
What they care about: ลดเวลา QC, ลดต้นทุน, ความปลอดภัย, ROI
What would impress them most: AI สแกนครบ 360° ภายใน 30 วินาที + report พร้อมส่งลูกค้า
What would make them skeptical: ผลลัพธ์ไม่แม่นยำ, ช้า, ซับซ้อนเกินไป
```

---

## 🏗️ PRODUCT DEFINITION

### Core Features (Priority Order)
```
P0 — Must have for launch:
1. AI Code Quality Scan: วิเคราะห์คุณภาพ code ด้วย AI (multi-model)
2. Performance Testing: ทดสอบ performance (LCP, CLS, FID, load time)
3. Security Scan: ตรวจจับช่องโหว่ความปลอดภัย (OWASP Top 10)
4. Accessibility Scan: ตรวจสอบ WCAG 2.1 AA compliance
5. SEO Analysis: วิเคราะห์ SEO score + recommendations
6. AI Report Generation: สร้าง report อัตโนมัติพร้อมคำแนะนำ
7. Shareable Result URL: แชร์ผลลัพธ์ได้ทันที
8. QC360 Badge: badge แสดงคุณภาพ App

P1 — Should have for v1:
9. PDF Report Export: ส่งรายงานให้ลูกค้าภายใน 30 วินาที
10. History & Trend Charts: ดูแนวโน้มคุณภาพตลอดเวลา
11. Email Alerts: แจ้งเตือน weekly digest
12. GitHub Integration: เชื่อมต่อ repo โดยตรง
13. VS Code / Cursor Extension: ใช้งานจาก IDE ได้เลย
14. CI/CD Integration: GitHub Actions auto-scan

P2 — Nice to have:
15. Viber API Integration: ทดสอบ Viber-specific features
16. Team Dashboard: shared dashboard สำหรับทีม
17. Custom Checklists: สร้าง checklist เอง
18. Slack/Discord Notifications: แจ้งเตือนผ่าน chat
19. White-label Reports: reports ไม่มี branding
20. Multi-IDE Support: JetBrains, Zed, Neovim, Replit, Gitpod
```

### Key Pages / Screens
```
Public:
- Homepage: Landing page — first impression + value proposition
- How It Works: แสดงขั้นตอนการใช้งาน + demo
- Value / Features: แสดง features ทั้งหมด + benefits
- Pricing: 4 tiers (Free / Pro / Team / Enterprise)
- Blog: SEO content + technical articles
- Contact: ติดต่อ + support

Authenticated:
- Dashboard: ภาพรวม projects + recent scans + scores
- Projects: รายการ projects ทั้งหมด
- Scan Results: ผลลัพธ์ scan แบบละเอียด 360°
- Reports: ดู + export reports (PDF)
- History: ประวัติ scan + trend charts
- Settings: User preferences, account management, billing

Auth:
- Login (Email+Password / Google / GitHub)
- Register
- Forgot Password
- Email Verification
```

### User Flows (Critical Paths)
```
Primary Flow (most important):
Register → Create Project → Connect Repo/URL → Run QC Scan → View 360° Report → Share/Export

Onboarding Flow (Free trial):
Landing Page → Try Free Scan (no login) → See 3 Critical Issues
→ Signup to see full report → Connect GitHub → Use free 3 scans/month

Conversion Flow:
Free 3 scans exhausted → See upgrade prompt → Choose Pro $12/mo
→ Stripe checkout → Unlimited scans activated → Ongoing usage
```

---

## 🎨 BRAND & DESIGN

### Brand Identity
```
Brand voice:     "จริงจังแต่เข้าถึงง่าย — Professional สุดๆ"
Visual style:    Dark + Light theme, AI Precision aesthetic, futuristic purple
Tone:            Technical / Friendly

Color Palette — "AI Precision" (Palette B):
Primary BG:      #0F0B2E  (Deep Purple — Dark mode background)
Secondary BG:    #2D1B69  (Purple — Cards, Sections)
Accent:          #6C63FF  (Electric Purple — CTA, AI features)
Pass/Success:    #22C55E  (Green — QC Pass)
Fail/Critical:   #EF4444  (Red — QC Fail)
Warning:         #FFB800  (Yellow — Warning, Medium risk)
Text (Dark):     #E2E8F0  (Light gray — Body text on dark)
Text (Light):    #1E293B  (Dark gray — Body text on light)

Typography:      Sarabun (Thai) + Inter (English)
Border radius:   16px cards, 12px buttons

Logo:            ต้องออกแบบ — Logo + Slogan + Concept + SVG Animate
```

### WOW Moments (Define 3)
```
WOW 1 — Hero/First Impression:
AI-powered scan visualization แบบ Wiz security graph
แสดง real-time scan animation ที่วิ่งผ่าน 8 phases
พร้อม counter แสดงจำนวน issues ที่เจอแบบ live

WOW 2 — Data/Feature Section:
360° Radar chart แสดงผลครบทุกมิติ (Code, Performance, Security,
Accessibility, SEO, Best Practices, PWA, Viber-specific)
Interactive — คลิกแต่ละมิติเพื่อ drill down ดูรายละเอียด

WOW 3 — Interaction/Engagement:
"Try Free Scan" — สแกนได้เลยไม่ต้อง login
ใส่ URL → เห็นผลลัพธ์ 3 critical issues ใน 30 วินาที
→ frustrate ด้วย locked features → signup to unlock
```

### Design Constraints
```
Must use:    Palette B colors, Sarabun+Inter fonts, Dark+Light toggle
Must avoid:  Lorem ipsum, generic stock photos, childish elements
Tone:        Technical + Friendly — เหมือนคุยกับ senior dev ที่ใจดี
Reference:   wiz.io (security viz), virtuosoqa.com (AI+QA UX)
```

---

## ⚙️ TECHNICAL SPECIFICATION

### Stack
```
Frontend:    Next.js 15 (App Router) + React 19 + TypeScript
Styling:     Tailwind CSS 4 + shadcn/ui
Animation:   Framer Motion 11+
State:       Zustand (client) + React Query (server state)
Database:    PostgreSQL (on VPS — not Supabase)
ORM:         Drizzle
Auth:        NextAuth.js (Email+Password / Google / GitHub OAuth)
Email:       Resend + React Email
Payments:    Stripe (with PPP pricing for Thailand)
Deployment:  VPS Linux + GitHub CI/CD (GitHub Actions)
i18n:        next-intl (th + en) — ทำทั้ง 2 ภาษาตั้งแต่ต้น
AI:          Multi-model — OpenAI, Gemini, Grok, Claude API
```

### External Integrations
```
Required:
- OpenAI API: AI-powered code analysis + report generation
- Google Gemini API: Fallback AI model + free tier
- Anthropic Claude API: AI analysis (advanced reasoning)
- xAI Grok API: AI analysis (alternative model)
- GitHub API: Repo connection, CI/CD, Actions
- Stripe API: Payments, subscriptions, PPP pricing
- Resend API: Transactional emails (verify, report, notification)

Optional/Future:
- Viber API: Viber-specific testing features
- Slack API: Team notifications
- Discord API: Community notifications
- VS Code Extension API: IDE integration
- Cursor Extension API: IDE integration
- JetBrains Plugin API: IDE integration
```

### Database Tables
```
users:
- id, email, full_name, avatar_url, role (admin/user),
  provider (email/google/github), locale (th/en),
  created_at, updated_at

projects:
- id, user_id, name, url, github_repo, description,
  created_at, updated_at, deleted_at

scans:
- id, project_id, user_id, status (pending/running/completed/failed),
  score_overall, score_code, score_performance, score_security,
  score_accessibility, score_seo, score_best_practices, score_pwa,
  score_viber, ai_model_used, duration_ms,
  created_at, completed_at

scan_issues:
- id, scan_id, phase, severity (critical/high/medium/low/info),
  title, description, recommendation, file_path, line_number,
  created_at

reports:
- id, scan_id, user_id, format (web/pdf), share_url, share_token,
  created_at, expires_at

subscriptions:
- id, user_id, stripe_customer_id, stripe_subscription_id,
  plan (free/pro/team/enterprise), status, current_period_start,
  current_period_end, created_at, updated_at

badges:
- id, project_id, scan_id, type (free/pro/team),
  score, generated_svg, created_at
```

### Auth & Permissions
```
Auth method:     NextAuth.js (Email+Password + Google OAuth + GitHub OAuth)
User roles:      admin / user
Row Level Security: Enforced via middleware + Prisma policies

Role permissions:
- admin:   Full access — manage all users, projects, scans, settings, billing
- user:    CRUD own projects, run scans (within plan limits), view own reports,
           manage own account + billing
```

### Pricing Model (from BusinessPlan.md)
```
Free — "The Hook":
- 3 scans/month
- 3 phases (Performance, SEO, Accessibility)
- 1 project
- Shareable result URL
- QC360 badge (with "Free" label)

Pro $12/month (TH: ฿199/month):
- Unlimited scans (fair use: 1,000/month)
- All 8 phases
- 5 projects
- Full history & trend charts
- PDF report (5/month)
- Email alerts (weekly digest)
- Badge without branding
- API access (100 calls/month)
- VS Code / Cursor Extension

Team $39/month (TH: ฿699/month):
- Everything in Pro
- 20 projects, 5 team members
- CI/CD GitHub Action
- Slack/Discord notifications
- Shared dashboard
- Unlimited PDF reports
- API access (1,000 calls/month)
- Priority support (24h response)

Enterprise — Custom (starts $99/month):
- Unlimited projects + members
- SSO (SAML, OAuth)
- Custom checklists
- SLA 99.9%, dedicated support
- Audit logs, white-label reports
- On-premise option (Y2)

Annual plans: Save 33% (4 months free)
PPP Pricing: Geo-detect Thailand → show ฿ prices automatically
```

### Environment Variables Required
```
# Database
DATABASE_URL=postgresql://...

# Auth (NextAuth.js)
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# AI Models
OPENAI_API_KEY=
GOOGLE_GEMINI_API_KEY=
ANTHROPIC_API_KEY=
XAI_GROK_API_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
FROM_EMAIL=noreply@viberqc.com

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=ViberQC
```

---

## 📊 PERFORMANCE & COMPLIANCE

### Performance Targets
```
LCP (Largest Contentful Paint):  < 2.5s
CLS (Cumulative Layout Shift):   < 0.1
FID (First Input Delay):         < 100ms
Lighthouse Performance:          ≥ 90
Lighthouse Accessibility:        ≥ 95
```

### Compliance Requirements
```
WCAG 2.1 AA:    Required (accessibility) — Global market
PDPA:           Required (Thai data protection law)
GDPR:           Required (EU users — global market)
HTTPS:          Required
Cookie Consent: Required (global)
Terms of Service: Required (TH + EN)
Privacy Policy:   Required (TH + EN)
```

---

## 📅 CURRENT STATUS

### Session Log (Newest First)
```
[2026-03-10] — Phase 0.0
- Completed: Discovery Questions — เก็บข้อมูล project context ครบทุกกลุ่ม
- Current state: project_context.md filled — พร้อมเริ่ม development
- Next: Phase 0 Foundation — Setup project, design system, logo design
- Issues: None
```

### Phase Progress
```
Phase 0: Foundation      [ ] Not started  [x] In Progress  [ ] Complete
Phase 1: Design System   [ ] Not started  [ ] In Progress  [ ] Complete
Phase 2: Pages           [ ] Not started  [ ] In Progress  [ ] Complete
Phase 3: Integration     [ ] Not started  [ ] In Progress  [ ] Complete
Phase 4: Polish          [ ] Not started  [ ] In Progress  [ ] Complete
Phase 5: QA              [ ] Not started  [ ] In Progress  [ ] Complete
Phase 6: Launch          [ ] Not started  [ ] In Progress  [ ] Complete
```

### Current Blockers
```
1. Logo design — ยังไม่มี logo, slogan, concept, SVG animate
```

---

## 🎯 DEFINITION OF DONE

### Feature Complete = ALL of:
```
□ Works end-to-end (not just UI shell)
□ TypeScript: zero errors
□ Both TH and EN work
□ Mobile 375px looks good
□ Loading/Error/Empty states exist
□ Real/realistic data (no Lorem Ipsum)
□ WOW element present
□ Animation: stagger + countup where applicable
□ Dark + Light theme both work
□ Beginner-friendly UX (target user = QA beginner)
```

### Launch Ready = ALL of:
```
□ All P0 features complete
□ Lighthouse ≥ 90 all categories
□ WCAG 2.1 AA pass
□ PDPA + GDPR compliance implemented
□ Cookie consent implemented
□ Terms of Service + Privacy Policy live (TH + EN)
□ Zero console errors in production
□ SEO meta tags complete
□ Legal pages live
□ Stripe payments working
□ Email flows working (verify, report, notification)
□ Monitoring active
□ Someone other than developer tested it
```

---

## 💡 QUICK REFERENCE FOR CURSOR

```
When starting a session, state:
"I am in Phase [X], working on [task].
Brand: ViberQC — AI Precision
Target: make QA/QC Engineers feel 'ง่าย ครบ จบในที่เดียว'
WOW element today: [what wow element to implement]
Constraint: Beginner-friendly, TH+EN, Dark+Light, Mobile responsive"
```
