# QUALITY_CHECKLIST.md
# The Anti-Bullshit Quality System
# Force Cursor AI to actually verify its own work
# ============================================================
# HOW TO USE:
# After EVERY task, paste this section into Cursor:
# "Run the [SECTION NAME] checklist on your work and show me results."
# ============================================================

---

## 🔴 MASTER QA GATE
## (Run before declaring ANY feature "complete")

```
Paste this into Cursor after every major task:

"Before telling me this is done, run through QUALITY_CHECKLIST.md
MASTER QA GATE. Check EVERY item. Mark ✅ or ❌.
For every ❌, fix it immediately and re-check before reporting."
```

### MASTER QA GATE CHECKLIST

```
DOES IT ACTUALLY WORK?
□ Happy path works end-to-end (I tested it, not just wrote it)
□ Empty state works (what happens with no data?)
□ Error state works (what happens when API fails?)
□ Loading state works (what shows while waiting?)
□ Mobile works at 375px (I checked responsive view)

IS IT ACTUALLY WOW?
□ There is ≥1 element that makes you say "wow"
□ Statistics/numbers animate (CountUp when in viewport)
□ Lists/grids have staggered reveal (not all appear at once)
□ Hover states exist on all interactive elements
□ The most important content is visible without scrolling

IS THE CODE ACTUALLY CLEAN?
□ TypeScript: ran tsc --noEmit, zero errors
□ No 'any' types used
□ No hardcoded colors (only design tokens)
□ No hardcoded text (all in translation files)
□ No console.log left behind (use proper logger)
□ No TODO/FIXME comments blocking this task

IS IT ACTUALLY ACCESSIBLE?
□ All images have alt text
□ All buttons have accessible labels
□ Keyboard tab navigation works
□ Color contrast passes WCAG AA

IS IT ACTUALLY COMPLETE?
□ Both Thai AND English text work
□ Real/realistic data (zero Lorem Ipsum or "Test 123")
□ All links go somewhere real (no dead links)
□ Form validation works (try submitting empty)
```

---

## 📊 SECTION 1: Design Quality Checklist

### 1A. Visual Hierarchy Check

```
After building any page or section, check:

F-PATTERN COMPLIANCE:
□ Top-left corner: most important element? [YES/NO]
□ First horizontal zone: headline/value prop visible? [YES/NO]
□ Left column: secondary navigation/info? [YES/NO]
□ Right side: supporting info only? [YES/NO]

VISUAL WEIGHT:
□ Primary CTA is visually dominant (largest, most colorful)? [YES/NO]
□ Secondary elements are clearly subordinate? [YES/NO]
□ Can identify 1st, 2nd, 3rd priority in 3 seconds? [YES/NO]

WHITESPACE:
□ Section spacing consistent (py-16/20/24)? [YES/NO]
□ Cards don't feel cramped (p-6 minimum)? [YES/NO]
□ Text doesn't go full width on desktop (max ~65ch)? [YES/NO]

SCORE: ___/12
PASS threshold: 10/12
```

### 1B. WOW Moment Verification

```
For each page/section, identify and verify:

WOW ELEMENT 1 (required):
- What is it? ____________________
- Where is it? ____________________
- Does it actually wow? □ YES  □ NO (be honest)
- If NO, what needs to change? ____________________

WOW ELEMENT 2 (recommended):
- What is it? ____________________

TYPES OF WOW (at least 1 per page):
□ Visual: Something stunning to look at
  (gradient text, glassmorphism, immersive hero)
□ Motion: Something impressive that moves
  (CountUp, stagger reveal, kinetic text)
□ Interaction: Something that responds beautifully
  (3D tilt, magnetic button, hover glow)
□ Data: Something that makes data feel alive
  (animated chart, real-time indicator, live counter)
□ Delight: Something unexpected and pleasant
  (micro-animation, Easter egg, achievement unlock)

SCORE: ___/5 wow types present
PASS threshold: ≥1 must be present
```

### 1C. Color System Compliance

```
Audit: Open DevTools → Inspect each colored element

□ All background colors: reference CSS variable or Tailwind token
□ All text colors: reference CSS variable or Tailwind token
□ All border colors: reference CSS variable or Tailwind token
□ All shadow colors: reference CSS variable or Tailwind token
□ No hex codes (#xxxxx) directly in JSX/TSX
□ No rgb() values directly in JSX/TSX

EXCEPTIONS (must be documented):
- Noise grain SVG: inline data URI (acceptable)
- Dynamic colors from API/data (must use design token scale)

Quick check command:
grep -r "#[0-9A-Fa-f]\{3,6\}" src/ --include="*.tsx" --include="*.ts"
→ Should return only: design-tokens.ts, tailwind.config.ts, SVGs

SCORE: ___/6
PASS threshold: 6/6 (zero tolerance)
```

### 1D. Typography Audit

```
For every text element on the page:

SIZES:
□ Display text (headlines): clamp or text-3xl+ 
□ Section headings: text-2xl to text-4xl
□ Body text: text-base (16px) minimum
□ Caption/label: text-sm (14px) minimum
□ No text smaller than 12px

WEIGHTS:
□ Headings: font-semibold or font-bold
□ Body: font-normal or font-medium
□ UI labels: font-medium
□ No random weights (no font-light on headings)

LINE HEIGHT:
□ Headlines: leading-tight or leading-snug
□ Body text: leading-relaxed (1.75 for Thai)
□ UI elements: leading-normal

THAI-SPECIFIC:
□ Thai body text: leading-relaxed minimum (1.75)
□ No text-clipping on Thai characters (check ascenders/descenders)
□ Layout doesn't break when switching TH ↔ EN

SCORE: ___/14
PASS threshold: 12/14
```

---

## 🎬 SECTION 2: Animation Quality Checklist

### 2A. Animation Purpose Audit

```
For EVERY animation in the component/page:

List each animation:
1. [animation name] — Purpose: _______________ — Justified: □Y □N
2. [animation name] — Purpose: _______________ — Justified: □Y □N
3. [animation name] — Purpose: _______________ — Justified: □Y □N

PURPOSE must be one of:
→ "Guides attention to [element]"
→ "Confirms action was received"
→ "Shows relationship between [A] and [B]"
→ "Communicates loading/progress"
→ "Creates premium/delightful feel"
→ "Directs user to next step"

If you can't justify it → REMOVE IT

DECORATIVE animation (not justified): → REMOVE unless it's the WOW element
```

### 2B. Animation Timing Audit

```
Check EVERY animation against these standards:

HOVER RESPONSES:
□ Duration: 0.15-0.25s (not slower)
□ Easing: ease-out or easeInOut
□ Property: opacity, transform only (never height, padding, margin)

ENTRY REVEALS (scroll/mount):
□ Duration: 0.4-0.6s
□ Y offset: 20-30px max (not 100px+)
□ Scale: 0.92-0.98 (not 0.5)
□ Stagger: 0.05-0.1s between items

NUMBER COUNTUP:
□ Duration: 2-2.5s
□ Easing: ease-out cubic (slows near end)
□ Trigger: useInView with once: true
□ Margin: -100px (triggers before fully visible)

PAGE TRANSITIONS:
□ Duration: 0.3s max
□ Type: fade or fade+slide (not complex)
□ No content jump/flash during transition

SPRING ANIMATIONS:
□ stiffness: 200-400
□ damping: 20-35
□ No overdamping (bouncing too much)

RED FLAGS (immediate fix):
❌ Any duration > 1s on UI element (feels broken)
❌ ease-in on entry animations (starts fast, ends slow = wrong)
❌ Animating height or max-height (causes reflow)
❌ Animation blocking interaction (pointer-events)
❌ Auto-playing infinite animation without pause option

SCORE: ___/20
PASS threshold: 18/20
```

### 2C. Reduced Motion Check

```
MANDATORY — zero tolerance:

□ import { useReducedMotion } from 'framer-motion' present in animated components
□ Fallback defined: simple opacity fade only
□ prefers-reduced-motion CSS:
   @media (prefers-reduced-motion: reduce) { animation: none; }
□ Auto-playing video: paused when reduced motion
□ Scroll parallax: disabled when reduced motion
□ CountUp: instant jump to final value when reduced motion

Test: In DevTools → Rendering → Emulate: prefers-reduced-motion: reduce
→ Page should still be fully functional, just without animations

PASS: All 5 items above checked
FAIL: Any unchecked = accessibility violation
```

---

## 💻 SECTION 3: Code Quality Checklist

### 3A. TypeScript Strictness

```
Run this command and show output:
npx tsc --noEmit 2>&1

PASS: "Found 0 errors."
FAIL: Any number other than 0

Common TypeScript violations to fix:
□ No 'any' type (use unknown or proper interface)
□ No non-null assertion (!) without comment explaining why
□ No @ts-ignore without explanation in comment
□ All API responses typed (not 'any' from fetch)
□ All event handlers properly typed
□ All props interfaces defined (no implicit any)
□ No unused variables or imports (eslint:no-unused-vars)

Acceptable exceptions (document these):
- External library without types: use declare module
- Truly dynamic data: use Record<string, unknown>
- Third-party callback with forced any: comment + minimize scope
```

### 3B. Component Completeness

```
For EVERY component that fetches or displays data:

□ Loading state: Skeleton component that matches content shape
□ Error state: Error component with retry action
□ Empty state: Empty component with explanation + action
□ Success state: Correct data displayed
□ All states tested by intentionally triggering them

For EVERY interactive component:

□ Hover state: Visual change
□ Focus state: Visible focus ring (not hidden)
□ Active state: Press feedback
□ Disabled state: Reduced opacity + cursor: not-allowed
□ Loading state: Spinner + prevents double-submit

For EVERY form:

□ Field validation: real-time or on-blur
□ Submit loading: button disabled + spinner
□ Submit error: error message displayed (not just console)
□ Submit success: success feedback + next step clear
□ Network error: handled gracefully (not white screen)
```

### 3C. Performance Code Review

```
Quick code review for performance issues:

RENDERING:
□ No anonymous functions in JSX render (creates new ref each render)
  ❌ onClick={() => doSomething()}  →  ✅ onClick={handleClick}
□ No object literals in JSX props
  ❌ style={{ color: 'red' }}  →  ✅ className="text-red-500"
□ Lists use stable keys (not array index for dynamic data)
  ❌ key={index}  →  ✅ key={item.id}
□ Heavy components wrapped in React.memo (if pure)
□ useCallback on functions passed as props
□ useMemo on expensive calculations

DATA FETCHING:
□ React Query staleTime set (not 0, which causes constant refetch)
□ No useEffect for data fetching (use React Query)
□ No waterfall requests (use Promise.all or parallel queries)
□ Images: next/image used (not <img>)
□ Images: sizes prop set correctly

BUNDLE:
□ Heavy libraries dynamic imported:
  - Chart libraries
  - Map libraries  
  - Rich text editors
  - Date pickers
□ No full lodash import (use lodash/[function])
```

### 3D. Security Checklist

```
For EVERY API route:

□ Authentication: user session verified before any operation
□ Authorization: user can only access their own data
□ Input validation: Zod schema validates all inputs
□ Error responses: no stack traces, no internal details exposed
□ Rate limiting: applied to mutation endpoints
□ SQL injection: not possible (using Supabase parameterized queries)

For EVERY form handling user data:

□ XSS: user input rendered via React (auto-escaped) not dangerouslySetInnerHTML
□ Sensitive data: no passwords/tokens in URL params or localStorage
□ CSRF: using server actions or proper CSRF tokens

For environment configuration:

□ All secrets in .env.local (not in code)
□ Client-safe variables prefixed NEXT_PUBLIC_
□ No server secrets accessible on client
□ .env files in .gitignore

Supabase specific:
□ Row Level Security enabled on ALL tables
□ RLS policies tested (can user access another user's data?)
□ Service role key ONLY used on server (never client)
```

---

## 📱 SECTION 4: Responsive Quality Checklist

### 4A. Breakpoint Test Matrix

```
Test each breakpoint in DevTools Responsive Mode:

375px (iPhone SE — minimum):
□ No horizontal overflow (no scrollbar)
□ All text readable (min 14px)
□ All tap targets ≥ 44px
□ Navigation collapses correctly (hamburger/bottom nav)
□ Bento grid → single column
□ Hero section: text fits without overflow
□ CTAs: full width or large enough to tap
□ Forms: full width, inputs don't zoom (font-size ≥ 16px)

768px (Tablet):
□ Layout transitions gracefully (not same as mobile, not same as desktop)
□ 2-column grid where applicable
□ Navigation: sidebar or top nav?
□ Charts/tables: readable

1024px (Small laptop):
□ Full desktop navigation
□ 3-column grids activate
□ Sidebar visible if applicable

1280px (Standard desktop):
□ Container max-width respected (not edge-to-edge)
□ Content not too wide to read
□ Sidebars properly sized

1920px+ (Wide):
□ No elements stretch to fill full width when they shouldn't
□ Background extends properly (use full-bleed backgrounds)

SCORE: ___/20 (4 items × 5 breakpoints)
PASS threshold: 18/20
```

### 4B. Mobile-Specific UX

```
Test on actual mobile device OR iOS Simulator if possible:

TOUCH:
□ Swipe gestures work where expected (carousels, drawers)
□ Pinch-to-zoom not blocked inappropriately
□ No accidental taps from proximity of elements
□ Form inputs don't cause page zoom (font-size ≥ 16px)

PERFORMANCE:
□ Animations don't lag on mobile (test on mid-range device)
□ Heavy animations disabled on mobile if needed:
  → Use window.matchMedia('(max-width: 768px)') to skip 3D effects
□ Images load quickly (next/image optimizes for mobile)

NAVIGATION:
□ Back button behavior correct (browser back, not just history)
□ Deep links work correctly
□ Mobile nav accessible with thumb (bottom area preferred)

KEYBOARD:
□ Virtual keyboard doesn't cover input fields
□ "Done" button on iOS keyboard submits form
□ Next/Previous buttons navigate between form fields
```

---

## 🌐 SECTION 5: Internationalization Checklist

### 5A. Translation Completeness

```
Before any release, run:
grep -r "useTranslations\|t('" src/ | grep -v "node_modules"

Find every translation key used. Then verify:

□ Every key exists in th.json
□ Every key exists in en.json
□ No hardcoded Thai text in JSX
□ No hardcoded English text in JSX (except dev-only things)
□ Pluralization handled (x item vs x items)
□ Number formatting locale-aware (1,234.56 vs 1.234,56)
□ Date formatting locale-aware (วันที่ 9 มีนาคม 2025 vs March 9, 2025)
□ Currency formatting: ฿ for TH, appropriate for EN

Missing translation detection:
→ Add this to dev mode: log warning when key not found
→ next-intl will show key name if translation missing
```

### 5B. Layout Language Test

```
For every page, test both languages:

□ TH → EN: Layout doesn't break (EN usually shorter)
□ EN → TH: Layout doesn't break (TH usually 10-20% wider)
□ Headlines: Thai multi-line breaks look good
□ Buttons: Text fits in button (no overflow)
□ Cards: Content fits in card (no overflow)
□ Tables: Column headers fit
□ Navigation: All items visible

Thai-specific checks:
□ Thai font renders correctly (Sarabun loaded)
□ Thai characters not cut off (line-height: 1.75 minimum)
□ Vowel marks display above/below correctly (don't clip)
□ Word wrap doesn't break in middle of Thai word
```

---

## 🏁 SECTION 6: Pre-Launch Final Checklist

### 6A. Content Audit

```
Search for and eliminate ALL placeholder content:

Commands:
grep -ri "lorem ipsum" src/
grep -ri "placeholder" src/ --include="*.tsx" | grep -v "placeholder=" 
grep -ri "todo\|fixme\|hack\|xxx" src/ --include="*.tsx"
grep -ri "test@\|example.com\|dummy\|fake" src/ --include="*.tsx"
grep -ri "coming soon\|under construction" src/

□ Zero Lorem Ipsum results
□ Zero TODO/FIXME in production code
□ Zero test email addresses
□ Zero "Coming Soon" sections (either build it or remove it)
□ All images: real content (no gradient placeholder boxes)
□ All stats: real numbers (not 999,999)
```

### 6B. SEO Checklist

```
□ Each page has unique <title> (using next metadata)
□ Each page has unique meta description (150 chars max)
□ Open Graph tags: og:title, og:description, og:image (1200×630)
□ og:image exists and is the correct dimensions
□ Structured data (JSON-LD) for key pages
□ sitemap.xml generated (next-sitemap or app/sitemap.ts)
□ robots.txt exists
□ Canonical URLs set
□ No duplicate content
□ All page URLs are descriptive (/features not /page2)
□ Images have descriptive filenames (hero-dashboard.webp not img1.png)

Thai SEO:
□ Thai language content has lang="th" on html element
□ Thai keywords in meta description (for TH pages)
```

### 6C. Legal & Compliance

```
□ Privacy Policy page exists (in Thai)
□ Terms of Service page exists (in Thai)
□ Cookie consent banner (PDPA requirement)
□ Contact information on website
□ Company/entity information if required
□ PDPA consent for data collection forms

For apps collecting user data:
□ Data retention policy defined
□ User data deletion request flow exists
□ Privacy Policy explains what data is collected
□ User can export their data (PDPA right to data portability)
```

---

## 📊 QA COMPLIANCE SUMMARY TABLE

```
Run this after completing each phase:

Phase 0: Foundation
| Check | Status | Notes |
|-------|--------|-------|
| project_context.md complete | ☐ | |
| Tech stack installed | ☐ | |
| Zero build errors | ☐ | |
| i18n structure created | ☐ | |
| Design tokens configured | ☐ | |

Phase 1: Design System
| Check | Status | Notes |
|-------|--------|-------|
| All design tokens in globals.css | ☐ | |
| All base components built | ☐ | |
| All states implemented | ☐ | |
| TypeScript: zero errors | ☐ | |
| Storybook/demo page working | ☐ | |

Phase 2: Pages
| Check | Status | Notes |
|-------|--------|-------|
| Homepage WOW moment | ☐ | |
| Stats CountUp animation | ☐ | |
| Bento grid asymmetric | ☐ | |
| Mobile 375px passes | ☐ | |
| Both languages work | ☐ | |

Phase 3: Integration
| Check | Status | Notes |
|-------|--------|-------|
| Zero Lorem Ipsum | ☐ | |
| All API routes secured | ☐ | |
| RLS policies enabled | ☐ | |
| Error states handle real errors | ☐ | |

Phase 4: Polish
| Check | Status | Notes |
|-------|--------|-------|
| Full animation audit done | ☐ | |
| All reduced-motion handled | ☐ | |
| Visual consistency review | ☐ | |
| Zero hardcoded colors | ☐ | |

Phase 5: QA
| Check | Status | Notes |
|-------|--------|-------|
| Lighthouse Performance ≥ 90 | ☐ | Score: |
| Lighthouse Accessibility ≥ 95 | ☐ | Score: |
| WCAG 2.1 AA pass | ☐ | |
| Cross-browser tested | ☐ | |
| Security review done | ☐ | |

Phase 6: Launch
| Check | Status | Notes |
|-------|--------|-------|
| Zero placeholder content | ☐ | |
| SEO meta tags complete | ☐ | |
| Legal pages exist | ☐ | |
| Monitoring configured | ☐ | |
| Production env tested | ☐ | |
```

---

## 🚨 ZERO TOLERANCE VIOLATIONS

```
These items cause IMMEDIATE task rejection — fix before anything else:

❌ 'any' TypeScript type
❌ Hardcoded color hex values in JSX/TSX
❌ Lorem Ipsum or placeholder text in any user-facing content
❌ Missing loading state for async component
❌ Feature claims "done" but doesn't work end-to-end
❌ Mobile (375px) layout broken
❌ Animation blocking user interaction
❌ API route with no authentication check
❌ Form submits with no loading state
❌ Statistics section with no CountUp animation
❌ Translation key used but not in translation file
❌ Image without alt text
```
