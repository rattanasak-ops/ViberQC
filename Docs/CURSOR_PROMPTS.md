# CURSOR_PROMPTS.md
# Ready-to-Use Prompts — Copy & Paste Directly into Cursor
# ============================================================
# HOW TO USE:
# 1. Copy the prompt
# 2. Replace [BRACKETED] placeholders with your specifics
# 3. Paste into Cursor AI chat
# 4. Wait for SELF-VERIFICATION REPORT before accepting work
# ============================================================

---

## 🚀 SESSION STARTER (Use EVERY time you open Cursor)

```
You are the elite 4-role team defined in .cursorrules.
Before responding to anything:
1. Read .cursorrules completely
2. Read project_context.md for current project state
3. Confirm: "I am in Phase [X.X], ready to work on [current task]"
4. State the 3 things you will do in this session

Never say "done" without running the WOW SELF-VERIFICATION CHECKLIST.
```

---

## 📐 PHASE 0 PROMPTS

### P0.1 — Discovery Questions

```
In Role R1 (Creative Director) and R2 (UX Designer):
I need to complete project_context.md for a new project.

Ask me the Discovery Questions in this order, ONE GROUP at a time.
Wait for my answer before asking the next group.

Group 1 — Brand & Vision (R1):
- North Star: What should people remember after closing the page?
- Emotion: What feeling in the first 3-8 seconds?
- Benchmark: Which websites represent the "premium" standard?

[After my answer, ask Group 2]

Group 2 — User & UX (R2):
- Who are the main users? Describe them.
- What are their biggest pain points with current solutions?
- What is the ONE thing that would make them say "wow"?

[After my answer, ask Group 3]

Group 3 — Technical (R4):
- What integrations are required?
- Expected number of users per day?
- Any security/compliance requirements?

After all answers: Generate the completed project_context.md file.
```

---

### P0.2 — Project Setup

```
In Role R4 (Frontend Architect):
Set up the complete Next.js 15 project for [PROJECT_NAME].

Requirements from MASTER_ROLES.md:
- Next.js 15 with App Router
- TypeScript strict mode
- Tailwind CSS 4
- Framer Motion 11+
- Supabase (client + server setup)
- React Query + Zustand
- next-intl for i18n (th + en)
- Lenis smooth scroll
- shadcn/ui initialized

Create the COMPLETE folder structure from MASTER_ROLES.md.
Install ALL dependencies.
Create empty th.json and en.json with base structure.
Create .env.local.example with all required variables.
Create tailwind.config.ts with ALL design tokens from WOW_DESIGN_SYSTEM.md.

After setup: Show me `npm run dev` output confirming zero errors.
Run SELF-VERIFICATION CHECKLIST before reporting complete.
```

---

## 🎨 PHASE 1 PROMPTS

### P1.1 — Design System Implementation

```
In Role R1 (Creative Director) + R4 (Frontend Architect):
Implement the complete Design System from WOW_DESIGN_SYSTEM.md.

Create these files:
1. app/globals.css — ALL CSS variables (colors, typography, spacing, shadows)
2. tailwind.config.ts — Extended with all design tokens
3. lib/design-tokens.ts — TypeScript constants matching CSS variables
4. app/fonts.ts — next/font setup for Sarabun + Inter

Rules:
- ZERO hardcoded colors anywhere
- All values must reference design tokens
- Include dark mode variables
- Include animation keyframes (shimmer, mesh-gradient, pulse-glow)

After creating: Show me the color palette rendered (create a simple /design page).
```

---

### P1.2 — Button Component (All States)

```
In Role R2 (UX) + R3 (Motion) + R4 (Frontend):
Build the Button component with ALL variants and ALL states.

File: components/ui/Button.tsx

Variants: primary, secondary, ghost, danger, icon-only
Sizes: sm, md (default), lg
States: default, hover, focus, active, loading, disabled, success

Requirements:
- TypeScript interface (no 'any')
- Framer Motion for hover/tap animations
- Loading: spinner + text change + pointer-events-none
- Success: checkmark animation + green flash
- Magnetic hover effect on primary variant (from MASTER_ROLES.md R3)
- Keyboard accessible (focus ring visible)
- All text in i18n (no hardcoded strings)

After building: Create /test-components page showing all variants × all states.
Run SELF-VERIFICATION CHECKLIST.
```

---

### P1.3 — Card Component Library

```
In Role R1 + R3 + R4:
Build the Card component system.

File: components/ui/Card.tsx

Required variants:
1. default — light/dark theme
2. glass — glassmorphism (bg-white/10 backdrop-blur)
3. premium — navy + gold border, deep glass
4. stat — for metrics/KPIs with CountUp

All cards must have:
- 3D tilt effect on hover (max 8deg, from MASTER_ROLES.md R3)
- Shadow animation on hover (elevation change)
- Staggered reveal when entering viewport
- NoiseGrain texture component (from WOW_DESIGN_SYSTEM.md)
- TypeScript interface

Also create:
- components/ui/StatCard.tsx using useCountUp hook
  (CountUp from 0 to value when card enters viewport)

After building: Demo page at /test-components showing all cards.
```

---

### P1.4 — Navigation Component

```
In Role R2 + R3 + R4:
Build the main Navigation component.

File: components/layout/Navbar.tsx

Requirements:
- Scroll-aware: transparent → backdrop-blur + border after 20px scroll
- Active link: animated underline indicator (Framer Motion layoutId)
- Mobile: Hamburger → Full-screen drawer with staggered links
- Language switch: TH/EN toggle (using next-intl)
- CTA button: primary variant from Button component
- Logo: SVG or text logo (placeholder OK)

Desktop breakpoint: lg (1024px)
Mobile: drawer slides from right with backdrop

Animation details:
- Drawer: x: "100%" → x: 0, duration 0.3s, ease easeOut
- Links in drawer: stagger 0.05s each
- Background blur: transition-all duration-300

After building: Show desktop AND mobile (375px) screenshots.
Run SELF-VERIFICATION CHECKLIST.
```

---

## 🏠 PHASE 2 PROMPTS

### P2.1 — Homepage Hero Section

```
In Role R1 (Creative Director) + R3 (Motion) + R4 (Frontend):
Build the Hero section for [PROJECT_NAME].

Brand context: Read project_context.md first.

Required elements:
1. Full viewport height (100dvh)
2. Mesh gradient background (animated, from WOW_DESIGN_SYSTEM.md)
3. Floating glow orbs (motion.div, blur-[100px])
4. Headline: KineticText component (word-by-word reveal)
5. Sub-headline: fade up, delay after headline
6. Two CTAs: primary (MagneticButton) + secondary
7. Hero visual: [specify: illustration / mockup / abstract 3D / stats]
8. Scroll indicator: animated arrow at bottom

WOW Element: [SPECIFY — e.g., "Animated gradient text on headline",
"Interactive globe", "Particle system", "3D product mockup"]

Entrance sequence (timing):
- 0ms:    Background loads
- 100ms:  Logo/nav appears
- 300ms:  Headline starts word-by-word reveal
- 700ms:  Subheadline fades up
- 900ms:  CTAs appear with spring animation
- 1100ms: Hero visual animates in

After building: Test at 375px, 768px, 1280px widths.
Run SELF-VERIFICATION CHECKLIST.
```

---

### P2.2 — Stats/Trust Bar Section

```
In Role R2 + R3 + R4:
Build the Stats/Social Proof section.

Placement: Immediately below hero (trust builder)

Content (use realistic mock data for [PROJECT_NAME]):
- 4 key statistics with CountUp animation
- Layout: Bento grid (2+2 or 4-column)
- Each stat: large number + prefix/suffix + label + trend indicator

Stats to show (customize for your project):
- Total users/customers: [number]
- Key metric 1: [number + unit]
- Key metric 2: [number + unit]  
- Key metric 3: [number + unit]

Requirements:
- CountUp ONLY triggers when section enters viewport
- CountUp duration: 2.5s with easeOut cubic
- After count complete: subtle scale pulse
- Trend indicators: +X% with green/red color
- glassmorphism style: bg-white/8 with gold border

After building: Scroll to trigger and verify animation works.
```

---

### P2.3 — Feature Grid (Bento Layout)

```
In Role R1 + R2 + R3 + R4:
Build the Feature Highlights section using Bento Grid.

Layout pattern (from WOW_DESIGN_SYSTEM.md — Pattern 1):
- Hero tile: spans 2 columns, 2 rows (primary feature)
- 4 smaller tiles: single column each
- Full-width tile at bottom (optional)

Content: Read project_context.md for the 5-6 key features.
Use realistic descriptions, NOT placeholder text.

Each tile must have:
- Icon (use lucide-react, consistent size: 24px)
- Feature name
- 2-sentence description
- Subtle gradient or illustration
- Hover: 3D tilt + border glow + shadow elevation

Animations:
- Staggered reveal: each tile by column position (delay = col * 0.1s)
- Hero tile: slightly longer entrance (0.7s vs 0.5s)

WOW Element for this section: Interactive hover states where
hovering one tile subtly dims others (focus effect)

Mobile: Single column, hero tile full width, priority order maintained.
```

---

### P2.4 — Dashboard Main Page

```
In Role R2 + R3 + R4:
Build the main Dashboard page for authenticated users.

Layout: 
- Sidebar (240px desktop) + Main content
- Sidebar collapses to bottom nav on mobile

Sidebar content:
- Logo + user avatar
- Navigation links (with active state animation)
- Collapse toggle

Main content structure:
1. Header bar: Page title + Quick actions + User menu
2. KPI row: 4 StatCards with CountUp (Bento grid, 2+2)
3. Main visualization: [Chart/Graph using recharts or custom SVG]
4. Secondary section: Data table OR Activity feed OR Split layout

All charts animate in on page load (not on scroll — above fold)
Data: use realistic mock data for [PROJECT_NAME]

Command Center feel:
- Dark theme (navy-900 background)
- Glass cards
- Subtle grid lines or dots on background
- "Live" indicator with pulse animation (optional)

After building: Show mobile (375px) — sidebar should be bottom nav.
```

---

### P2.5 — Empty & Loading States

```
In Role R2 + R3:
Create premium Empty and Loading states for ALL data components.

For each component that loads data, create:

SKELETON (Loading):
- Match the shape of actual content exactly
- Use animate-pulse with shimmer effect
- Color: bg-white/10 to bg-white/5 gradient shimmer
- Duration: same as typical load time expectation

EMPTY STATE:
- Relevant illustration or icon (large, 80-120px)
- Clear headline: "No [items] yet"
- Helpful sub-text: explain what will appear here
- Primary action: "Add your first [item]" button
- Friendly, not depressing

ERROR STATE:
- Different from empty (icon shows something went wrong)
- Error message: helpful, not technical ("Something went wrong" + retry)
- Retry button
- Optional: support link

Components to create states for:
[LIST ALL DATA COMPONENTS IN YOUR PROJECT]

All states must match the design system (glass cards, correct spacing).
```

---

### P2.6 — Forms (Premium Style)

```
In Role R2 + R3 + R4:
Build premium form components and a complete [FORM_NAME] form.

Form components needed:
1. Input (text, email, password, number, search)
   - Float label animation on focus
   - Border color transition: neutral → gold on focus
   - Valid state: checkmark icon fade in
   - Invalid state: red border + error message fade in + shake
   
2. Textarea
   - Auto-resize to content
   - Character counter (optional)

3. Select/Combobox
   - Custom styled (not browser default)
   - Smooth open/close animation
   - Search within options

4. File Upload
   - Drag & drop zone
   - Preview for images
   - Progress bar for upload

The [FORM_NAME] form:
- Fields: [LIST FIELDS]
- Validation: react-hook-form + zod schema
- Submit: loading state → success or error
- Success: [describe success action]

All labels and errors in translation files (th + en).
Run SELF-VERIFICATION CHECKLIST after building.
```

---

## 🔌 PHASE 3 PROMPTS

### P3.1 — Supabase Database Setup

```
In Role R4 (Frontend Architect):
Design and implement the complete database schema for [PROJECT_NAME].

Tables needed (based on project_context.md):
[LIST YOUR TABLES]

For EVERY table, include:
- id: uuid (primary key, default gen_random_uuid())
- created_at: timestamptz (default now())
- updated_at: timestamptz (auto-update via trigger)
- deleted_at: timestamptz (soft delete — null means not deleted)
- created_by: uuid (foreign key to auth.users)

Create:
1. SQL migration file: supabase/migrations/[timestamp]_initial.sql
2. Row Level Security policies for each table
3. Indexes on: foreign keys, frequently filtered columns
4. TypeScript types: lib/database.types.ts (generated from schema)
5. CRUD functions: lib/db/[table-name].ts

RLS policies must ensure:
- Users can only read their own data (or org data if multi-tenant)
- Users can only write their own data
- Admins have full access

After creating: Show me the schema diagram (text-based).
```

---

### P3.2 — API Route (CRUD)

```
In Role R4:
Build complete CRUD API routes for [RESOURCE_NAME].

Files to create:
- app/api/[resource]/route.ts (GET list, POST create)
- app/api/[resource]/[id]/route.ts (GET one, PUT update, DELETE)

For EVERY route:
1. Zod schema validation (create lib/validations/[resource].ts)
2. Authentication check (Supabase auth.getUser())
3. Authorization (user can only access their own data)
4. Business logic
5. Consistent response format:
   { data: T | null, error: string | null, meta?: {...} }
6. Proper HTTP status codes
7. Error messages safe for client (no internals exposed)

Also create:
- hooks/use[Resource].ts — React Query hooks for this resource
  (useList, useOne, useCreate, useMutation, useDelete)
- With optimistic updates for better UX

Test: Show me manual test of each endpoint (curl or equivalent).
```

---

## ✨ PHASE 4 PROMPTS

### P4.1 — Animation Polish Pass

```
In Role R3 (Motion Designer):
Full animation audit of the entire application.

Go through EVERY page and component. For each one, verify and fix:

1. Lists: Do all items stagger in? (0.07s delay between items)
2. Statistics: Do all numbers count up when in viewport?
3. Cards: Do all cards have hover interactions?
4. Buttons: Do all buttons have hover + active micro-feedback?
5. Navigation: Is the active indicator animated?
6. Page transitions: Is there a smooth transition between routes?

Missing animations to add:
- Page route change: fade out/in (0.3s)
- Scroll progress indicator (optional, for long pages)
- Cursor custom style (optional, premium feel)
- Background: subtle gradient shift over time (hero sections)

For every animation, confirm:
- prefers-reduced-motion is respected
- Animation doesn't cause layout shift (CLS)
- Animation duration matches MASTER_ROLES.md R3 specs

After audit: Report WHAT was missing, WHAT was fixed.
```

---

### P4.2 — Visual Polish Pass

```
In Role R1 (Creative Director):
Visual excellence audit — find and fix everything that looks "off".

Check every page for:
TYPOGRAPHY:
□ Consistent font weights (no random weights)
□ Correct letter-spacing (tight for headlines, normal for body)
□ Correct line-height (relaxed for body, tight for headlines)
□ No orphan words in headings (single word on last line)

SPACING:
□ Section spacing consistent (py-16 md:py-20 lg:py-24)
□ Component internal spacing matches design tokens
□ No arbitrary padding/margin values

COLORS:
□ All colors from design tokens (no one-off hex values)
□ Contrast ratios pass WCAG AA
□ Glassmorphism looks crisp (not muddy)

ICONS:
□ Same icon library throughout (lucide-react preferred)
□ Consistent sizes (16px small, 20px medium, 24px large)
□ Consistent stroke width

IMAGES:
□ All optimized with next/image
□ Proper aspect ratios maintained
□ No layout shift on load (explicit width/height)

Report: List of every issue found and fix applied.
```

---

## 🔍 PHASE 5 PROMPTS

### P5.1 — Performance Optimization

```
In Role R4:
Full performance optimization to reach Lighthouse ≥ 90.

Actions to take:

BUNDLE:
1. Analyze bundle: run `next build && next analyze`
2. Dynamic import any component > 30kb
3. Check for duplicate dependencies

IMAGES:
4. Convert all images to WebP format
5. Ensure all next/image have proper sizes prop
6. Add priority prop to above-fold images
7. Lazy load below-fold images (default behavior)

FONTS:
8. Verify next/font is used (no external font URLs)
9. Add font-display: swap
10. Preconnect to font CDN if needed

CODE:
11. Remove unused Tailwind classes (purge check)
12. Check for unnecessary re-renders (React DevTools)
13. Add React.memo to expensive components
14. Use Suspense boundaries for dynamic imports

NETWORK:
15. Add Cache-Control headers to API routes
16. Enable Vercel Image Optimization
17. Add staleTime to React Query (reduce refetches)

After: Run Lighthouse and show me the scores.
Target: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90
```

---

### P5.2 — Accessibility Audit

```
In Role R2 (UX Designer — Accessibility):
Complete WCAG 2.1 AA accessibility audit.

Test and fix:

KEYBOARD:
□ Tab through entire app — can you reach everything?
□ Focus indicators visible on all interactive elements
□ No keyboard traps (modal can be closed with Escape)
□ Skip-to-content link at top of page

SCREEN READER:
□ All images have descriptive alt text
□ All icons have aria-label
□ All form inputs have associated labels
□ Error messages connected with aria-describedby
□ Heading hierarchy correct (h1 → h2 → h3, no skipping)
□ Dynamic content updates announced (aria-live)

VISUAL:
□ All text: contrast ratio ≥ 4.5:1 (check with DevTools)
□ Large text (18px+ or 14px+ bold): ≥ 3:1
□ Focus ring: contrast ≥ 3:1 against adjacent colors
□ Color not the only means of conveying info

MOTION:
□ All animations wrapped with useReducedMotion check
□ No auto-playing animation > 5 seconds without controls

Fix ALL issues. Report final compliance status.
```

---

## 🚨 PROBLEM-SOLVING PROMPTS

### WHEN: "This doesn't look premium / WOW"

```
In Role R1 (Creative Director):
The current design of [COMPONENT/PAGE] doesn't look premium enough.
WOW benchmark: [Stripe / Linear / Apple / specify]

Analyze what's missing. Common issues to check:
1. Is there enough contrast and visual hierarchy?
2. Are the glassmorphism effects crisp? (blur amount, border opacity)
3. Is the shadow creating real depth?
4. Is the typography scale dramatic enough?
5. Is there a clear focal point (WOW element)?
6. Is whitespace being used intentionally?

Fix the design by:
- Increasing contrast in key areas
- Adding the premium shadow system from WOW_DESIGN_SYSTEM.md
- Refining glassmorphism (backdrop-blur-xl, border border-white/12)
- Adding a wow element: [animated counter / gradient text / 3D tilt / glow effect]
- Ensuring mobile looks equally premium

Before/after: Show me both states.
```

---

### WHEN: "Animation feels cheap or wrong"

```
In Role R3 (Motion Designer):
The animation on [COMPONENT] feels wrong/cheap. Fix it.

Common problems to diagnose:
1. Duration too long? (hover should be 0.15-0.25s MAX)
2. Wrong easing? (ease-in feels slow, ease-out is usually correct)
3. Moving wrong property? (prefer opacity + transform, never height/width)
4. Stagger too slow or too fast? (0.07s ideal)
5. Scale too large? (1.05 max for hover)
6. Missing spring physics? (try type: "spring" instead of duration)

Correct values from MASTER_ROLES.md R3:
- Hover: duration 0.2s, ease easeOut
- Entry reveal: duration 0.5s, y: 24→0, ease smooth
- Spring: stiffness 300, damping 20-30

Rewrite the animation using correct values.
Verify: prefers-reduced-motion fallback exists.
```

---

### WHEN: "Mobile is broken"

```
In Role R2 + R4:
The mobile layout (375px) is broken on [PAGE/COMPONENT].

Diagnose and fix:
1. Where does it break? (overflow? elements clipping? text too small?)
2. Are we using mobile-first classes? (base → sm: → md: → lg:)
3. Is the grid collapsing to single column correctly?
4. Are touch targets ≥ 44px?
5. Is there horizontal overflow? (check overflow-x)
6. Are fonts readable without zooming? (min 16px for body)
7. Does the navigation work on mobile?

Mobile-specific fixes to apply:
- overflow-x: hidden on root container
- Bento grid → single column (grid-cols-1)
- Text sizes: reduce by ~20% from desktop
- CTAs: full width on mobile (w-full)
- Padding: use consistent px-4 on mobile

Test at: 375px, 390px, 428px
Show me screenshots after fix.
```

---

### WHEN: "TypeScript errors everywhere"

```
In Role R4:
Fix all TypeScript errors in the project.

Run: npx tsc --noEmit
Show me the error output.

For each error:
1. Type 'any' → Find the correct type
2. Missing type → Define interface
3. Null check → Add optional chaining (?.) or null guard
4. Wrong props → Fix the component interface

Rules:
- NEVER use 'any' as a fix
- NEVER use @ts-ignore (explain why if unavoidable)
- Define proper interfaces for all API responses
- Use TypeScript utility types (Partial, Pick, Omit) when helpful

After fixing: Run tsc --noEmit again and show me "zero errors".
```

---

### WHEN: "Feature is 'done' but doesn't actually work"

```
In Role R4:
Verify that [FEATURE_NAME] works end-to-end.

Test checklist:
1. Happy path: Do the normal steps, does it work?
2. Edge cases:
   - Empty/null data
   - Very long text (500+ characters)
   - Special characters (Thai text, symbols)
   - Slow network (throttle to 3G)
   - Error state (break the API intentionally)
3. Form validation: Try submitting empty, invalid data
4. Auth: Does it work when logged in? Redirect when not?
5. Mobile: Test on 375px

Fix everything that fails.
Report: What you tested, what failed, what you fixed.
```

---

## 📋 COMPLETION REPORT TEMPLATE

```
After completing ANY task, report in this format:

✅ TASK COMPLETE — [Task Name]
Phase: [X.X] | Role: [R1/R2/R3/R4]

WOW Check:
□ ≥1 WOW moment: [YES/NO — describe it]
□ F-Pattern respected: [YES/NO]
□ Animations purposeful: [YES/NO]
□ Mobile looks premium: [YES/NO]

Code Check:
□ TypeScript: ZERO errors
□ Console: ZERO errors
□ Loading/Error/Empty states: [YES/NO]
□ Real data (no Lorem Ipsum): [YES/NO]
□ i18n complete: [YES/NO]

Performance:
□ LCP: [< 2.5s YES/NO or N/A]
□ No layout shift: [YES/NO]

What I built:
1. [specific deliverable]
2. [specific deliverable]
3. [specific deliverable]

Issues I found and fixed:
- [issue] → [fix]

Next steps (Phase X.X):
1. [next task]
2. [next task]
3. [next task]
```
