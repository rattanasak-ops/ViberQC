# PROJECT_PHASES.md
# Complete Phase-by-Phase Development Plan
# WOW Premium Web/Mobile App — Cursor AI Implementation Guide
# ============================================================

## How to Use This File

1. **Before each session:** Read current phase section
2. **Start Cursor with:** "I am in Phase [X.X], task: [task name]. Read project_context.md first."
3. **Gate system:** ❌ NEVER move to next phase without passing current phase gate
4. **Update:** After each phase, update `project_context.md` with status

---

## 📋 Phase Overview

```
Phase 0: Foundation & Discovery      [1-2 days]
Phase 1: Design System & Core UI    [3-5 days]
Phase 2: Feature Development         [5-10 days per feature]
Phase 3: Integration & Real Data     [2-3 days]
Phase 4: Polish & WOW Enhancement   [2-3 days]
Phase 5: Performance & QA            [1-2 days]
Phase 6: Launch & Post-launch        [1 day + ongoing]
```

---

## ═══════════════════════════════════════
## PHASE 0: Foundation & Discovery
## ═══════════════════════════════════════

### Goal
สร้าง solid foundation ก่อน code แม้แต่บรรทัดเดียว
"Plan twice, code once"

### 0.1 — Project Context Setup

**Cursor Prompt:**
```
"In Role R1 (Creative Director): Read the WOW_DESIGN_SYSTEM.md and help me
complete the project_context.md for [PROJECT_NAME]. Ask me the Discovery
Questions one group at a time, wait for my answers, then fill in the file."
```

**Deliverables:**
- [ ] `project_context.md` filled completely
- [ ] North Star defined (1 sentence)
- [ ] Target users profiled (2-3 personas)
- [ ] WOW benchmark selected (which sites to beat)
- [ ] Key pages/screens listed

**Discovery Questions to Answer:**
```
BRAND:
1. North Star: "คนต้องจดจำอะไรหลังปิดหน้าจอ?"
2. Emotion: "3-8 วินาทีแรก ต้องรู้สึกอะไร?"
3. Benchmark: "เว็บไหนที่คิดว่า premium ที่สุด?"

UX:
4. Pain Points: "ระบบเดิม/คู่แข่ง มีปัญหาอะไรที่เราต้องแก้?"
5. Glory Moments: "ฟีเจอร์อะไรที่จะทำให้ผู้ใช้บอกต่อ?"
6. Critical Data: "ข้อมูลอะไรที่ต้องเห็นบน homepage ก่อน?"

TECH:
7. Integrations: "มี API หรือระบบเดิมที่ต้องเชื่อมต่อ?"
8. Auth: "ใครเข้าใช้ได้ บ้าง? มี role ไหน?"
9. Scale: "expect กี่ users ต่อวัน?"
```

---

### 0.2 — Tech Stack Setup

**Cursor Prompt:**
```
"In Role R4 (Frontend Architect): Set up the complete Next.js 15 project
with the stack defined in MASTER_ROLES.md. Create the full folder structure,
install all dependencies, configure TypeScript strict mode, Tailwind 4,
and set up the i18n system with empty th.json and en.json.
Do NOT ask questions — use the standard stack from MASTER_ROLES.md."
```

**Commands to run:**
```bash
# Create project
npx create-next-app@latest [project-name] --typescript --tailwind --app --src-dir

# Install core dependencies
npm install framer-motion @supabase/supabase-js @supabase/ssr
npm install zustand @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install next-intl  # i18n
npm install lenis      # smooth scroll
npm install @radix-ui/react-* # shadcn peer deps

# Dev dependencies
npm install -D @types/node prettier eslint-config-prettier

# shadcn/ui setup
npx shadcn@latest init
```

**Deliverables:**
- [ ] Project runs `npm run dev` without errors
- [ ] TypeScript strict mode enabled
- [ ] Folder structure matches MASTER_ROLES.md spec
- [ ] `th.json` and `en.json` created (empty structure)
- [ ] `tailwind.config.ts` has custom design tokens
- [ ] `.env.local.example` created with all required variables

**Gate 0 ✅:** Project runs, all configs valid, context file complete

---

## ═══════════════════════════════════════
## PHASE 1: Design System & Core UI
## ═══════════════════════════════════════

### Goal
สร้าง Design System ก่อน ทุก component ต้องมาจาก system นี้
ห้าม build features ก่อน Design System พร้อม

### 1.1 — Design Tokens & Global Styles

**Cursor Prompt:**
```
"In Role R1+R4: Create the complete Design System for this project.
Based on the brand in project_context.md, implement:
1. CSS variables in globals.css (all design tokens)
2. Tailwind config with custom colors, fonts, shadows, animations
3. Typography scale (display, heading, body, caption) in both TH and EN
4. Color palette with all variants (50-900 scale)
5. Custom animation utilities in Tailwind
Do NOT use any colors outside the design tokens. Zero hardcoded values."
```

**Design Token Checklist:**
```css
/* Must implement ALL of these: */
--color-primary (navy scale: 50,100,200,300,400,500,600,700,800,900)
--color-accent (gold scale)
--color-neutral (gray scale)
--color-success, --color-warning, --color-error, --color-info
--font-display, --font-body, --font-mono
--font-size-xs through --font-size-6xl
--font-weight (regular: 400, medium: 500, semibold: 600, bold: 700)
--line-height (tight: 1.25, normal: 1.5, relaxed: 1.75)
--spacing (4px base: 1=4px, 2=8px, 3=12px, 4=16px, etc.)
--radius (sm: 8px, md: 12px, lg: 16px, xl: 24px, full: 9999px)
--shadow (sm, md, lg, xl, 2xl, premium, glow-gold, glow-navy)
--transition (fast: 150ms, normal: 300ms, slow: 500ms)
--z-index (base, dropdown, sticky, overlay, modal, toast)
```

**Deliverables:**
- [ ] All tokens in `globals.css`
- [ ] Tailwind config extended with all tokens
- [ ] Font loaded via `next/font` (Sarabun for TH, Inter for EN)
- [ ] No hardcoded colors anywhere

---

### 1.2 — Base Component Library

**Cursor Prompt:**
```
"In Role R2+R3+R4: Build the base component library.
For each component, implement ALL states: default, hover, focus, active,
loading, disabled, error. Add Framer Motion animations per MASTER_ROLES.md.
Include TypeScript interfaces. Start with: Button, Input, Card, Badge, 
Modal, Toast, Skeleton, Navigation."
```

**Component Checklist:**

```
ATOMS (smallest):
□ Button (primary, secondary, ghost, danger, icon-only)
  - All states: hover, focus, active, loading, disabled, success
  - Magnetic hover effect (optional: premium feel)
  - Loading spinner animation
  
□ Input (text, email, password, search, textarea)
  - Float label animation
  - Valid/Invalid states with animations
  - Password show/hide toggle
  
□ Badge (default, primary, success, warning, error, outline)
□ Avatar (image, initials fallback, skeleton)
□ Skeleton (text, card, avatar variants)
□ Spinner (sizes: sm, md, lg)
□ Icon wrapper (consistent sizing)

MOLECULES (combinations):
□ Card (basic, premium-glass, interactive, stat)
  - Glassmorphism variant
  - 3D tilt on hover
  - Staggered reveal animation
  
□ StatCard (number + label + trend)
  - CountUp animation on viewport enter
  - Trend indicator (up/down with color)
  
□ Navigation (desktop + mobile)
  - Active state animations
  - Mobile drawer with smooth animation
  - Scroll-aware (blur + border on scroll)
  
□ Modal (with backdrop blur, slide-up animation)
□ Toast (success, error, warning, info with auto-dismiss)
□ Dropdown menu
□ Select / Combobox
□ Pagination
□ DataTable (sortable, filterable, paginated)

ORGANISMS (complex):
□ Hero section template
□ Feature grid (Bento layout)
□ Stats section (animated counters)
□ CTA section
□ Footer
□ Auth forms (login, register, forgot password)
```

**Per-component Quality Check:**
```
For EVERY component built:
□ TypeScript interface defined (no 'any')
□ Default props set
□ Loading state exists
□ Error state exists  
□ Empty state exists (for lists)
□ Mobile responsive
□ Keyboard accessible
□ Screen reader friendly (aria attributes)
□ Animation implemented per R3 standards
□ Storybook story created (if using Storybook)
```

**Gate 1 ✅:** All base components working, all states implemented,
Storybook shows components in all states (or equivalent demo page)

---

## ═══════════════════════════════════════
## PHASE 2: Page Development
## ═══════════════════════════════════════

### Goal
สร้างแต่ละ page โดยใช้ components จาก Phase 1
**ลำดับ:** Homepage → Core Feature Pages → Supporting Pages → Auth Pages

### Template Prompt for ANY Page

```
"In Role R1+R2+R3: Build the [PAGE_NAME] page.

Context: Read project_context.md for brand + user requirements.

Requirements:
1. Apply F-Shaped Pattern — most critical content top-left
2. Include ≥1 WOW moment (identify and implement it)
3. Use Bento Grid for any data-heavy section
4. All statistics use CountUp animation
5. Staggered reveals on all lists/grids
6. Full mobile responsive (test at 375px)
7. Both TH/EN languages (add to translation files)
8. Real/realistic mock data (no Lorem Ipsum)

WOW Element for this page: [SPECIFY THE WOW ELEMENT]

After building, run the SELF-VERIFICATION CHECKLIST from .cursorrules
and report results."
```

### 2.1 — Homepage

**WOW Elements Required:**
- `Hero`: Immersive full-viewport with animated gradient + particle/mesh
- `Stats Bar`: Animated counters (key metrics of the product/service)
- `Feature Grid`: Bento grid with staggered reveal
- `Interactive Element`: Map, live counter, or 3D visualization

**Section Sequence:**
```
1. Navigation (sticky, blur on scroll)
2. Hero Section
   - Headline (gradient text or animated)
   - Sub-headline
   - Primary + Secondary CTA
   - Hero visual (illustration/3D/video)
3. Trust Bar (logos, stats, or certifications)
4. Feature Highlights (Bento Grid)
5. How It Works (3-step or numbered)
6. Social Proof / Testimonials
7. CTA Section (conversion-focused)
8. Footer
```

**Homepage WOW Checklist:**
```
□ Hero loads with smooth entrance animation (< 1s delay)
□ At least one element causes involuntary "wow" reaction
□ Statistics count up when scrolled to
□ Bento grid has asymmetric sizing (not equal tiles)
□ Hover interactions on all interactive elements
□ Mobile: single column, priority preserved
□ Page weight < 500kb (gzipped)
□ LCP < 2.5s
```

---

### 2.2 — Dashboard / Main App Page

**Cursor Prompt:**
```
"In Role R2+R3+R4: Build the main dashboard page.
This is a DATA-HEAVY interface that must make complex information feel simple.

Requirements:
1. Command Center aesthetic (premium, data-forward)
2. KPI cards with animated counters (top of page)
3. Main data visualization (chart/graph with animation)
4. Activity feed or recent items
5. Quick action shortcuts
6. Responsive: sidebar collapses to bottom nav on mobile

Use Bento Grid for KPI section.
All charts animate in on load.
Real-time feel: add 'last updated' indicator."
```

---

### 2.3 — Feature Pages (Repeat for each feature)

**Template:**
```
"In Role R1+R2+R3+R4: Build the [FEATURE_NAME] feature page.

User Goal: [What user needs to accomplish]
Entry Point: [How user arrives here]
Success State: [What happens when user succeeds]

Required sections:
1. Page header (breadcrumb + title + primary action)
2. Main content area ([describe content])
3. Supporting sidebar or panel (if applicable)
4. Empty state (when no data)
5. Loading state (skeleton)

WOW Element: [specific wow element for this page]

After building: self-verify, then show me the component hierarchy."
```

---

### 2.4 — Authentication Pages

**Cursor Prompt:**
```
"In Role R2+R4: Build the authentication flow (Login, Register,
Forgot Password, Reset Password).

Requirements:
1. Supabase Auth integration
2. Smooth form animations (label float, validation feedback)
3. Social auth buttons (Google OAuth minimum)
4. Loading states on all submit actions
5. Error messages are helpful (not just 'error occurred')
6. Success states with smooth transition to next step
7. Mobile-optimized (thumb-friendly tap targets)
8. Bilingual (TH/EN toggle)

Security: CSRF protection, rate limiting on API route,
no password in URL, secure cookie settings."
```

**Gate 2 ✅:** All pages render correctly, all states work,
lighthouse scores pass, mobile reviewed

---

## ═══════════════════════════════════════
## PHASE 3: Integration & Real Data
## ═══════════════════════════════════════

### Goal
เชื่อมต่อ API จริง, database จริง, ข้อมูลจริง

### 3.1 — Database Schema & Setup

**Cursor Prompt:**
```
"In Role R4: Design and implement the complete database schema
for [PROJECT_NAME] in Supabase.

Requirements:
1. All tables with proper types and constraints
2. Row Level Security (RLS) policies for all tables
3. Indexes on frequently queried columns
4. Foreign key relationships
5. Soft delete pattern (deleted_at instead of DELETE)
6. created_at, updated_at timestamps on all tables
7. Migration files (not direct schema edit)

Also create:
- Supabase client setup (server + client components)
- TypeScript types generated from schema
- CRUD functions in /lib/db/ folder"
```

---

### 3.2 — API Integration

**Cursor Prompt:**
```
"In Role R4: Implement all API routes for [FEATURE_NAME].

For each route:
1. Input validation with Zod schema
2. Authentication check
3. Authorization check (RLS + application level)
4. Business logic
5. Error handling (specific error codes, helpful messages)
6. Success response (consistent format)

API Response Format (always):
{
  data: T | null,
  error: string | null,
  meta?: { total: number, page: number, per_page: number }
}

Test each route manually before moving to next."
```

---

### 3.3 — Data Fetching & State Management

**Cursor Prompt:**
```
"In Role R4: Implement data fetching for all pages using React Query.

Requirements:
1. React Query for all server state
2. Optimistic updates for better UX (no waiting for server)
3. Error boundaries for graceful failure
4. Refetch on window focus (where appropriate)
5. Infinite scroll OR pagination (specify per feature)
6. Suspense boundaries with skeleton fallbacks

Zustand for client state:
1. User preferences
2. UI state (sidebar open, modal state)
3. Form draft state (auto-save)"
```

**Gate 3 ✅:** All features work with real data,
no mock data remaining, all edge cases handled

---

## ═══════════════════════════════════════
## PHASE 4: Polish & WOW Enhancement
## ═══════════════════════════════════════

### Goal
เพิ่ม layer of excellence ที่ทำให้ work ดูเหนือระดับ
Phase นี้ทำ AFTER everything works — ไม่ใช่ระหว่าง

### 4.1 — Animation Polish Pass

**Cursor Prompt:**
```
"In Role R3: Do a full animation audit of the entire app.

For every page, verify:
1. All lists have staggered reveal (not simultaneous)
2. All statistics have CountUp animation
3. All cards have hover interactions (tilt, shadow, glow)
4. All buttons have micro-feedback (hover + active states)
5. Page transitions are smooth
6. Loading states are elegant (not just spinners)
7. Success states have celebration animation

Also add:
- Smooth scroll (Lenis)
- Scroll progress indicator (optional, for long pages)
- Cursor effects (optional, for premium feel)
- Magnetic elements on primary CTAs

Check: prefers-reduced-motion respected everywhere."
```

---

### 4.2 — Visual Excellence Pass

**Cursor Prompt:**
```
"In Role R1: Do a full visual polish review.

For every page, check and fix:
1. Typography consistency (size, weight, line-height, letter-spacing)
2. Spacing consistency (using design tokens, not arbitrary values)
3. Color consistency (only design tokens, no one-off colors)
4. Icon consistency (same icon set, same sizes)
5. Border radius consistency
6. Shadow consistency
7. Glassmorphism quality (blur amount, border opacity)
8. Gradient quality (smooth, not banded)
9. Image quality and optimization
10. Empty states have proper illustrations or icons

Special attention:
- Above the fold: must be perfect
- Mobile: must feel native, not 'responsive desktop'"
```

---

### 4.3 — Micro-interaction Deep Dive

**Cursor Prompt:**
```
"In Role R3: Add premium micro-interactions throughout the app.

Required additions:
1. Form field: label float animation on focus
2. Checkbox/Radio: custom animated checkmark
3. Toggle switch: smooth slide with color transition
4. Dropdown: smooth open/close with blur
5. Toast notifications: slide in + auto dismiss with countdown
6. Modal: backdrop blur + scale entrance
7. Tooltip: smooth fade with slight movement
8. Navigation active state: animated underline or indicator
9. Tab switching: sliding indicator
10. Accordion: smooth height animation (not jump)
11. Search: results appear with stagger
12. Progress bar: smooth fill animation

Each must feel: Snappy (not laggy), Purposeful (not random),
Consistent (same feel throughout)"
```

**Gate 4 ✅:** Full app feels premium, animations consistent,
visual design review passed by human (you)

---

## ═══════════════════════════════════════
## PHASE 5: Performance & Quality Assurance
## ═══════════════════════════════════════

### Goal
ทำให้ production-ready — เร็ว, ปลอดภัย, accessible

### 5.1 — Performance Optimization

**Cursor Prompt:**
```
"In Role R4: Full performance optimization pass.

Target metrics:
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
- Lighthouse Performance ≥ 90

Actions:
1. Audit bundle size — dynamic import any component > 50kb
2. Optimize all images (WebP, proper sizes, lazy load)
3. Font optimization (subset, preload critical fonts)
4. CSS: remove unused Tailwind classes
5. JavaScript: check for unnecessary re-renders (React DevTools)
6. API: add caching headers where appropriate
7. Database: check for N+1 queries
8. Enable Vercel Edge Network for static assets
9. Add loading priorities (priority prop on hero images)

Report: Before/After Lighthouse scores"
```

---

### 5.2 — Accessibility Audit

**Cursor Prompt:**
```
"In Role R2: Complete accessibility audit.

Test method:
1. Keyboard-only navigation (tab through entire app)
2. Screen reader test (VoiceOver or NVDA)
3. Contrast ratio check (all text/background combinations)
4. Zoom to 200% (no horizontal scroll, no content cut)
5. Color blind simulation (deuteranopia, protanopia)

Fix all issues found. Report:
- Issues found
- Fixes applied
- Final WCAG 2.1 AA compliance status"
```

---

### 5.3 — Security Review

**Cursor Prompt:**
```
"In Role R4: Security review for production.

Check and fix:
1. All API routes have authentication
2. All data access respects user permissions
3. No sensitive data in URL params
4. Environment variables not exposed to client
5. Rate limiting on all mutation routes
6. Input sanitization (no XSS vulnerabilities)
7. CORS configured correctly
8. Headers: CSP, X-Frame-Options, etc.
9. Supabase RLS tested (try to access others' data)
10. Payment webhooks validated

Use: next/headers for security headers configuration"
```

---

### 5.4 — Cross-browser & Device Testing

```
Test Matrix:
Desktop:
□ Chrome (latest)
□ Firefox (latest)
□ Safari (latest)
□ Edge (latest)

Mobile:
□ iOS Safari (iPhone 14)
□ Chrome Android (Pixel)
□ Samsung Internet

Screen Sizes:
□ 375px (iPhone SE)
□ 390px (iPhone 14)
□ 768px (iPad)
□ 1024px (iPad Landscape)
□ 1280px (Laptop)
□ 1920px (Desktop)
□ 2560px (Wide)

For each: No layout breaks, animations work,
fonts render correctly, interactions feel native
```

**Gate 5 ✅:** Lighthouse ≥ 90 all categories,
WCAG 2.1 AA pass, security review pass,
all browsers/devices tested

---

## ═══════════════════════════════════════
## PHASE 6: Launch Preparation
## ═══════════════════════════════════════

### Goal
Production deployment และ post-launch monitoring

### 6.1 — Pre-launch Checklist

```
Environment:
□ .env.production set up correctly
□ Database: production Supabase project configured
□ Payment: Lemon Squeezy production keys
□ Email: Resend production domain verified
□ Domain: configured + SSL

Monitoring:
□ Error tracking: Sentry configured
□ Analytics: configured
□ Uptime monitoring: configured
□ Database backups: enabled

Content:
□ All Lorem Ipsum REPLACED with real content
□ All placeholder images replaced
□ Legal pages: Privacy Policy, Terms of Service
□ Cookie consent (PDPA compliant)
□ SEO: meta tags, og:image, sitemap.xml, robots.txt

Testing:
□ Full user flow tested end-to-end in production
□ Payment flow tested with real card
□ Email delivery confirmed
□ Auth flow tested
```

### 6.2 — Vercel Deployment

**Cursor Prompt:**
```
"In Role R4: Prepare for Vercel deployment.

1. Verify next.config.ts is production-ready
2. Add security headers (Strict-Transport-Security, CSP, etc.)
3. Configure Vercel project settings:
   - Framework preset: Next.js
   - Node version: 20.x
   - Environment variables: [list all from .env.local.example]
4. Configure domain and redirects
5. Enable Vercel Analytics
6. Enable Speed Insights

Create deployment checklist in DEPLOYMENT.md"
```

**Gate 6 ✅:** App live in production, all features working,
monitoring active, first users can sign up

---

## 📊 Phase Summary & Timeline

| Phase | Name | Duration | Gate | Priority |
|---|---|---|---|---|
| 0 | Foundation | 1-2 days | Context + Setup complete | P0 🔴 |
| 1 | Design System | 3-5 days | All components, all states | P0 🔴 |
| 2 | Pages | 5-10 days | Pages render, data mocked | P0 🔴 |
| 3 | Integration | 2-3 days | Real data, all APIs working | P0 🔴 |
| 4 | Polish | 2-3 days | WOW level achieved | P1 🟡 |
| 5 | QA | 1-2 days | Lighthouse ≥ 90 | P1 🟡 |
| 6 | Launch | 1 day | Live + monitored | P0 🔴 |
| **Total** | | **15-26 days** | | |

---

## 🚨 Common Failure Modes & Prevention

### Problem: "Cursor says done but feature is broken"
**Prevention:** 
- Always test the feature manually after Cursor finishes
- Use the SELF-VERIFICATION CHECKLIST in .cursorrules
- End every prompt with: "After completing, show me [specific output to verify]"

### Problem: "Design doesn't look WOW"
**Prevention:**
- Always specify a WOW element in your prompt
- Reference specific examples: "Like Stripe's gradient hero"
- Run the WOW Checklist in QUALITY_CHECKLIST.md

### Problem: "Mobile is broken"
**Prevention:**
- End every UI prompt with: "Also show me the mobile (375px) layout"
- Build mobile-first (start with 375px, scale up)
- Test in DevTools responsive mode after every component

### Problem: "Animation feels cheap"
**Prevention:**
- Specify exact animation values from MASTER_ROLES.md (R3)
- Use the animation templates, don't let AI invent values
- Duration 0.4-0.6s for reveals, 0.15-0.25s for hovers — always

### Problem: "TypeScript errors everywhere"
**Prevention:**
- Phase 1: Set up strict TypeScript from day 1
- Per component: Always define interface first, then implement
- End of each session: Run `npx tsc --noEmit` and fix before next session

### Problem: "Placeholder data left in production"
**Prevention:**
- Phase 3 gate: Search for "Lorem", "placeholder", "TODO", "FIXME" before Gate 3
- Use real mock data from day 1 (use Faker.js for generating)
- Replace ALL placeholders in Phase 6 pre-launch checklist
