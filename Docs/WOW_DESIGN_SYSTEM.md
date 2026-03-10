# WOW_DESIGN_SYSTEM.md
# Premium Design System — Complete Technical Specifications
# Standard: Awwwards / 10M+ THB Projects
# ============================================================

## Design Philosophy

```
3 Laws of WOW Design:
1. Every pixel has a PURPOSE
2. Every interaction has a REASON  
3. Every second of load time COSTS trust

"Beautiful is not enough. Beautiful + Fast + Purposeful = WOW"
```

---

## 🎨 COLOR SYSTEM

### Primary Palette

```css
/* Navy — Authority, Trust, Government */
--navy-50:  #EEF2F8;
--navy-100: #D5DFF0;
--navy-200: #ABBFE1;
--navy-300: #809FD2;
--navy-400: #567FC3;
--navy-500: #2C5FB4;
--navy-600: #234C90;
--navy-700: #1B3A6C;   /* Core Navy */
--navy-800: #1B2A4A;   /* PRIMARY — Authority */
--navy-900: #0D1525;

/* Gold — Premium, Excellence, Achievement */
--gold-50:  #FDF8F0;
--gold-100: #F9EDD6;
--gold-200: #F3DBAD;
--gold-300: #EDC984;
--gold-400: #E7B75B;
--gold-500: #C5A572;   /* PRIMARY — Premium */
--gold-600: #B8924A;
--gold-700: #9B7A30;
--gold-800: #7E6218;
--gold-900: #614A00;

/* Neutral — Clean, Professional */
--neutral-0:   #FFFFFF;
--neutral-50:  #F8FAFC;
--neutral-100: #F1F5F9;
--neutral-200: #E2E8F0;
--neutral-300: #CBD5E1;
--neutral-400: #94A3B8;
--neutral-500: #64748B;
--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1E293B;
--neutral-900: #0F172A;

/* Semantic Colors */
--success-light: #DCFCE7;
--success:       #16A34A;
--success-dark:  #14532D;

--warning-light: #FEF9C3;
--warning:       #CA8A04;
--warning-dark:  #713F12;

--error-light:   #FEE2E2;
--error:         #DC2626;
--error-dark:    #7F1D1D;

--info-light:    #DBEAFE;
--info:          #2563EB;
--info-dark:     #1E3A8A;
```

### Gradient System

```css
/* Hero Gradients */
--gradient-hero-primary:
  linear-gradient(135deg, #0D1525 0%, #1B2A4A 50%, #2D4A7A 100%);

--gradient-hero-gold:
  linear-gradient(135deg, #1B2A4A 0%, #2D3A5A 60%, #3D4A2A 100%);

--gradient-gold:
  linear-gradient(135deg, #C5A572 0%, #E8C98A 50%, #C5A572 100%);

--gradient-glass:
  linear-gradient(135deg,
    rgba(255,255,255,0.12) 0%,
    rgba(255,255,255,0.06) 100%);

--gradient-card-hover:
  linear-gradient(135deg,
    rgba(197,165,114,0.1) 0%,
    rgba(27,42,74,0.05) 100%);

/* Mesh Gradient (Hero background) */
--gradient-mesh:
  radial-gradient(at 40% 20%, rgba(45,74,122,0.8) 0%, transparent 50%),
  radial-gradient(at 80% 0%, rgba(197,165,114,0.3) 0%, transparent 40%),
  radial-gradient(at 0% 50%, rgba(13,21,37,0.9) 0%, transparent 50%),
  radial-gradient(at 80% 50%, rgba(27,42,74,0.7) 0%, transparent 60%),
  radial-gradient(at 0% 100%, rgba(45,74,122,0.5) 0%, transparent 40%);

/* Shimmer Animation (for loading + text effects) */
--gradient-shimmer:
  linear-gradient(90deg,
    transparent 0%,
    rgba(255,255,255,0.08) 50%,
    transparent 100%);
```

### Color Usage Rules

```
✅ CORRECT usage:
Navy #1B2A4A → Backgrounds, headers, dark sections
Gold #C5A572  → Accents, CTAs, highlights, borders
White/Light  → Text on dark backgrounds
Neutral-800  → Body text on light backgrounds

❌ NEVER:
- Gold text on white background (contrast fail for body text)
- Navy text on navy background
- Random colors outside the system
- More than 3 colors in one component
```

---

## 📐 TYPOGRAPHY SYSTEM

### Font Stack

```css
/* Thai-first, English fallback */
--font-display: "Sarabun", "Inter", "SF Pro Display", system-ui, sans-serif;
--font-body:    "Sarabun", "Inter", "SF Pro Text", system-ui, sans-serif;
--font-mono:    "JetBrains Mono", "Fira Code", "SF Mono", monospace;

/* next/font implementation */
/* In layout.tsx: */
import { Sarabun, Inter } from 'next/font/google'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
```

### Type Scale

```css
/* Display — Hero headlines, massive numbers */
--text-display-2xl: clamp(3rem, 8vw, 7rem);      /* 48-112px */
--text-display-xl:  clamp(2.5rem, 6vw, 5rem);    /* 40-80px */
--text-display-lg:  clamp(2rem, 4vw, 3.5rem);    /* 32-56px */

/* Heading — Section titles */
--text-heading-xl:  clamp(1.75rem, 3vw, 2.5rem); /* 28-40px */
--text-heading-lg:  clamp(1.5rem, 2.5vw, 2rem);  /* 24-32px */
--text-heading-md:  clamp(1.25rem, 2vw, 1.5rem); /* 20-24px */
--text-heading-sm:  1.125rem;                      /* 18px */

/* Body — Content */
--text-body-xl:  1.125rem;   /* 18px — lead text */
--text-body-lg:  1rem;       /* 16px — standard body */
--text-body-md:  0.9375rem;  /* 15px — secondary text */
--text-body-sm:  0.875rem;   /* 14px — captions, labels */
--text-body-xs:  0.75rem;    /* 12px — micro text */

/* Font Weights */
--weight-light:     300;
--weight-regular:   400;
--weight-medium:    500;
--weight-semibold:  600;
--weight-bold:      700;

/* Line Heights */
--leading-tight:    1.2;   /* headlines */
--leading-snug:     1.35;  /* subheadings */
--leading-normal:   1.5;   /* body text */
--leading-relaxed:  1.75;  /* long-form content */

/* Letter Spacing */
--tracking-tighter: -0.03em;  /* large display text */
--tracking-tight:   -0.01em;  /* headings */
--tracking-normal:   0em;     /* body */
--tracking-wide:     0.05em;  /* labels, caps */
--tracking-wider:    0.1em;   /* all-caps UI labels */
```

### Typography Patterns

```tsx
/* Hero Headline */
<h1 className="
  text-[clamp(3rem,8vw,7rem)]
  font-bold
  leading-[1.1]
  tracking-[-0.03em]
  text-white
">

/* Section Heading */
<h2 className="
  text-[clamp(1.75rem,3vw,2.5rem)]
  font-semibold
  leading-tight
  tracking-tight
  text-neutral-900 dark:text-white
">

/* Lead Text */
<p className="
  text-lg md:text-xl
  font-normal
  leading-relaxed
  text-neutral-600 dark:text-neutral-300
  max-w-[65ch]
">

/* Gradient Text (WOW element) */
<span className="
  bg-gradient-to-r from-[#C5A572] via-[#E8C98A] to-[#C5A572]
  bg-[length:200%_auto]
  bg-clip-text text-transparent
  animate-shimmer
">

/* Stat Number */
<span className="
  text-[clamp(2.5rem,5vw,4rem)]
  font-bold
  leading-none
  tracking-[-0.04em]
  text-white
">
```

---

## 🏗️ LAYOUT SYSTEM

### Grid Specifications

```css
/* Base Grid */
--grid-cols: 12;
--grid-gap:  clamp(1rem, 2vw, 1.5rem);  /* responsive gap */
--container-max: 1280px;
--container-padding: clamp(1rem, 5vw, 2rem);

/* Tailwind implementation: */
.container {
  @apply max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Bento Grid Patterns

```tsx
/* Pattern 1: Feature Highlight Grid (Homepage) */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  {/* Hero tile — spans 2 cols on lg */}
  <div className="lg:col-span-2 lg:row-span-2 ...">
    {/* Primary feature */}
  </div>
  {/* Normal tiles */}
  <div className="..."> {/* Feature 2 */} </div>
  <div className="..."> {/* Feature 3 */} </div>
  <div className="md:col-span-2 lg:col-span-1 ..."> {/* Feature 4 */} </div>
</div>

/* Pattern 2: Stats Dashboard */
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Wide stat */}
  <div className="col-span-2 ..."> {/* Key metric */} </div>
  {/* Normal stats */}
  <div className="..."> {/* Stat 1 */} </div>
  <div className="..."> {/* Stat 2 */} </div>
</div>

/* Pattern 3: Content + Sidebar */
<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
  <main> {/* Main content */} </main>
  <aside> {/* Sidebar */} </aside>
</div>

/* Pattern 4: Magazine Layout (Content grid) */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* First item spans full width */}
  <article className="md:col-span-2 lg:col-span-2 ..."> </article>
  <article className="..."> </article>
  {/* Rest are normal */}
  {items.slice(3).map(item => <article className="..." />)}
</div>
```

### Spacing System

```
Base: 4px
Scale: 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px,
       8=32px, 10=40px, 12=48px, 16=64px, 20=80px, 24=96px

Section spacing (between major sections):
Mobile:  py-16  (64px)
Tablet:  py-20  (80px)
Desktop: py-24  (96px)
→ Use: className="py-16 md:py-20 lg:py-24"

Component internal spacing:
Tight:   p-4   (16px) — small cards, badges
Normal:  p-6   (24px) — standard cards
Relaxed: p-8   (32px) — feature cards
Spacious: p-10 (40px) — hero sections, CTAs
```

---

## 💎 VISUAL EFFECTS

### Glassmorphism System

```css
/* Level 1 — Subtle (nav, overlays) */
.glass-subtle {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Level 2 — Standard (cards on dark bg) */
.glass-standard {
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Level 3 — Premium (feature cards, modals) */
.glass-premium {
  background: rgba(27, 42, 74, 0.6);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(197, 165, 114, 0.2);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3),
              0 0 80px rgba(197, 165, 114, 0.08),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

/* Tailwind equivalents */
/* glass-subtle:   bg-white/6 backdrop-blur-sm border border-white/8 */
/* glass-standard: bg-white/10 backdrop-blur-md border border-white/12 shadow-[...] */
/* glass-premium:  bg-navy-800/60 backdrop-blur-xl saturate-150 border border-gold/20 */
```

### Noise Grain Texture (Premium feel)

```tsx
/* Add to any card for premium texture */
const NoiseGrain = () => (
  <div
    className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-[0.04]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '128px 128px',
    }}
  />
)

/* Usage: */
<div className="relative ...">
  <NoiseGrain />
  {/* card content */}
</div>
```

### Shadow System

```css
/* Elevation shadows */
--shadow-xs:  0 1px 2px rgba(0,0,0,0.05);
--shadow-sm:  0 2px 8px rgba(0,0,0,0.08);
--shadow-md:  0 4px 16px rgba(0,0,0,0.12);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.16);
--shadow-xl:  0 16px 48px rgba(0,0,0,0.20);
--shadow-2xl: 0 24px 64px rgba(0,0,0,0.24);

/* Premium shadows */
--shadow-navy: 0 8px 40px rgba(27,42,74,0.4),
               0 2px 8px rgba(27,42,74,0.2);

--shadow-gold:  0 0 40px rgba(197,165,114,0.35),
                0 0 80px rgba(197,165,114,0.15);

--shadow-card:  0 4px 24px rgba(27,42,74,0.12),
                inset 0 1px 0 rgba(255,255,255,0.08);

--shadow-card-hover: 0 12px 40px rgba(27,42,74,0.20),
                     inset 0 1px 0 rgba(255,255,255,0.12);
```

### Border System

```css
/* Standard borders */
--border-subtle:  1px solid rgba(255,255,255,0.08);
--border-light:   1px solid rgba(255,255,255,0.12);
--border-medium:  1px solid rgba(255,255,255,0.20);
--border-gold:    1px solid rgba(197,165,114,0.30);
--border-gold-strong: 1px solid rgba(197,165,114,0.60);
--border-focus:   2px solid #C5A572;

/* Gradient border (premium effect) */
/* Use this technique: */
.gradient-border {
  position: relative;
  background: linear-gradient(#1B2A4A, #1B2A4A) padding-box,
              linear-gradient(135deg, #C5A572, #1B2A4A, #C5A572) border-box;
  border: 1px solid transparent;
}
```

---

## 🃏 COMPONENT DESIGN SPECS

### Card Specifications

```tsx
/* Standard Card */
const Card = ({ variant = 'default', ...props }) => {
  const variants = {
    default: `
      bg-white dark:bg-neutral-800
      border border-neutral-200 dark:border-neutral-700
      shadow-sm hover:shadow-md
      rounded-2xl p-6
      transition-shadow duration-300
    `,
    glass: `
      bg-white/10 backdrop-blur-md
      border border-white/12
      shadow-[0_4px_24px_rgba(0,0,0,0.2)]
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]
      hover:border-white/20
      rounded-2xl p-6
      transition-all duration-300
    `,
    premium: `
      bg-navy-800/60 backdrop-blur-xl
      border border-gold/20
      shadow-[0_8px_40px_rgba(27,42,74,0.4)]
      hover:border-gold/40
      hover:shadow-[0_12px_60px_rgba(27,42,74,0.5)]
      rounded-2xl p-8
      transition-all duration-500
    `,
    stat: `
      bg-gradient-to-br from-navy-800 to-navy-900
      border border-gold/10
      shadow-navy
      rounded-2xl p-6
    `
  }
  // ...
}

/* Hover interaction (Framer Motion) */
<motion.div
  whileHover={{
    y: -4,
    scale: 1.01,
    transition: { duration: 0.2, ease: "easeOut" }
  }}
  style={{ transformOrigin: "center" }}
>
```

### Button Specifications

```tsx
/* Button variants */
const buttonVariants = {
  primary: `
    bg-gold-500 hover:bg-gold-400 active:bg-gold-600
    text-navy-900 font-semibold
    shadow-[0_4px_16px_rgba(197,165,114,0.4)]
    hover:shadow-[0_8px_24px_rgba(197,165,114,0.5)]
    rounded-xl px-6 py-3
    transition-all duration-200
  `,
  secondary: `
    bg-transparent hover:bg-white/10
    text-white font-medium
    border border-white/20 hover:border-white/40
    rounded-xl px-6 py-3
    transition-all duration-200
  `,
  ghost: `
    bg-transparent hover:bg-neutral-100 dark:hover:bg-white/8
    text-neutral-700 dark:text-neutral-200
    rounded-xl px-4 py-2
    transition-colors duration-150
  `,
  danger: `
    bg-error hover:bg-red-700
    text-white font-medium
    rounded-xl px-6 py-3
    transition-colors duration-200
  `
}

/* Magnetic button effect */
const MagneticButton = ({ children, ...props }) => {
  const buttonRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e) => {
    const rect = buttonRef.current?.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = 80

    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance
      x.set(dx * strength * 0.4)
      y.set(dy * strength * 0.4)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={buttonRef}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.button>
  )
}
```

### Navigation Specifications

```tsx
/* Navbar — Scroll-aware */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy-900/90 backdrop-blur-xl border-b border-white/8 shadow-lg"
          : "bg-transparent"
      )}
    >
      {/* nav content */}
    </motion.nav>
  )
}

/* Active link indicator */
<Link href={href} className="relative group">
  {label}
  <motion.span
    className="absolute -bottom-1 left-0 h-0.5 bg-gold-500"
    initial={{ scaleX: 0 }}
    animate={{ scaleX: isActive ? 1 : 0 }}
    transition={{ duration: 0.2 }}
    style={{ transformOrigin: "left" }}
  />
</Link>
```

---

## 📊 STAT & DATA DISPLAY

### CountUp Animation (MANDATORY for all stats)

```tsx
// hooks/useCountUp.ts
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface UseCountUpOptions {
  end: number
  start?: number
  duration?: number
  delay?: number
  separator?: string
  decimals?: number
}

export const useCountUp = ({
  end,
  start = 0,
  duration = 2,
  delay = 0,
  separator = ',',
  decimals = 0,
}: UseCountUpOptions) => {
  const [count, setCount] = useState(start)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    const timeout = setTimeout(() => {
      const startTime = Date.now()
      const endTime = startTime + duration * 1000

      const tick = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / (duration * 1000), 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = start + (end - start) * eased

        setCount(current)
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    }, delay * 1000)

    return () => clearTimeout(timeout)
  }, [isInView])

  const formatted = count.toFixed(decimals).replace(
    /\B(?=(\d{3})+(?!\d))/g, separator
  )

  return { count, formatted, ref }
}

// StatCard component using CountUp
const StatCard = ({ value, prefix, suffix, label, trend }) => {
  const { formatted, ref } = useCountUp({
    end: value,
    duration: 2.5,
    separator: ','
  })

  return (
    <motion.div
      ref={ref}
      className="glass-premium rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-neutral-400 text-sm font-medium mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        {prefix && <span className="text-gold-500 text-2xl font-bold">{prefix}</span>}
        <span className="text-4xl font-bold text-white tracking-tight">
          {formatted}
        </span>
        {suffix && <span className="text-gold-500 text-xl font-semibold">{suffix}</span>}
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <TrendIcon trend={trend} />
          <span className={trend > 0 ? "text-success text-sm" : "text-error text-sm"}>
            {Math.abs(trend)}% vs last period
          </span>
        </div>
      )}
    </motion.div>
  )
}
```

### Data Table (Premium)

```tsx
/* Features needed: */
// ✅ Sortable columns (with animation)
// ✅ Filterable
// ✅ Paginated with smooth transition
// ✅ Row hover highlight
// ✅ Loading skeleton
// ✅ Empty state
// ✅ Responsive (horizontal scroll on mobile)
// ✅ Sticky header
// ✅ Row selection (optional)
// ✅ Bulk actions (optional)

const DataTable = ({ columns, data, isLoading }) => {
  if (isLoading) return <DataTableSkeleton />
  if (!data?.length) return <DataTableEmpty />

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full">
        <thead className="bg-navy-800/50 sticky top-0">
          <tr>
            {columns.map(col => (
              <th key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold
                           text-neutral-400 uppercase tracking-wider
                           cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  <SortIcon direction={sortConfig[col.key]} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="border-t border-white/5
                         hover:bg-white/5 transition-colors duration-150
                         cursor-pointer"
            >
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-sm text-neutral-200">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## 📱 RESPONSIVE SYSTEM

### Breakpoints

```
xs:  375px  — iPhone SE, minimum support
sm:  640px  — Large phones
md:  768px  — Tablets
lg:  1024px — Small laptops
xl:  1280px — Standard desktop
2xl: 1536px — Wide screens
```

### Mobile-First Principles

```tsx
/* ALWAYS write mobile first, then scale up */

/* ❌ WRONG — Desktop first */
<div className="grid-cols-3 sm:grid-cols-1">

/* ✅ CORRECT — Mobile first */
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

/* Text sizing */
<h1 className="text-3xl md:text-5xl lg:text-7xl">

/* Spacing */
<section className="py-12 md:py-16 lg:py-24">

/* Hidden/visible */
<div className="hidden lg:block"> {/* Desktop only */}
<div className="lg:hidden">      {/* Mobile only */}
```

### Touch-Friendly Rules

```
Minimum tap target: 44×44px (iOS HIG standard)
Tap target gap: minimum 8px between targets
Font size: minimum 16px for input fields (prevents zoom on iOS)
Scroll: -webkit-overflow-scrolling: touch for horizontal scrolls
Hover states: only on devices that support hover
  → Use: @media (hover: hover) { ... }
  → Tailwind: hover:... (Tailwind handles this correctly)
```

---

## 🌐 BILINGUAL SYSTEM (TH/EN)

### i18n Structure

```json
// messages/th.json
{
  "common": {
    "loading": "กำลังโหลด...",
    "error": "เกิดข้อผิดพลาด กรุณาลองใหม่",
    "empty": "ไม่พบข้อมูล",
    "save": "บันทึก",
    "cancel": "ยกเลิก",
    "delete": "ลบ",
    "edit": "แก้ไข",
    "confirm": "ยืนยัน"
  },
  "nav": {
    "home": "หน้าแรก",
    "features": "ฟีเจอร์",
    "pricing": "ราคา",
    "contact": "ติดต่อเรา"
  },
  "hero": {
    "headline": "[Thai headline]",
    "subheadline": "[Thai subheadline]",
    "cta_primary": "[Thai CTA]",
    "cta_secondary": "[Thai secondary CTA]"
  }
}

// messages/en.json — mirror structure, English values
```

### Thai Typography Special Rules

```css
/* Thai text needs these adjustments: */
.thai-text {
  /* Prevent character cutting on low line-height */
  line-height: 1.75;  /* Thai needs more line-height than English */
  word-break: keep-all; /* Don't break Thai words */
}

/* Thai headline — adjust tracking */
.thai-headline {
  letter-spacing: 0.02em; /* Slight positive tracking for Thai */
  line-height: 1.4;
}

/* Bilingual layout — reserve space for Thai */
/* Thai is typically 10-20% wider than English */
/* Layout must not break when switching */
/* Test: switch to Thai, check for overflow */
```

### Language Switch Implementation

```tsx
// components/LanguageSwitch.tsx
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const LanguageSwitch = () => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <motion.button
      onClick={() => switchLocale(locale === 'th' ? 'en' : 'th')}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                 bg-white/10 hover:bg-white/15 border border-white/15
                 text-sm font-medium text-white transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-base">{locale === 'th' ? '🇹🇭' : '🇬🇧'}</span>
      <span>{locale === 'th' ? 'TH' : 'EN'}</span>
      <motion.span
        animate={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        ↕
      </motion.span>
    </motion.button>
  )
}
```

---

## 🎯 WOW MOMENTS LIBRARY

### WOW Type 1: Particle/Mesh Hero

```tsx
// Simple CSS mesh gradient animation (no library needed)
const MeshGradientHero = () => (
  <div className="relative overflow-hidden">
    {/* Animated mesh gradient background */}
    <div className="absolute inset-0 animate-mesh-gradient"
      style={{
        background: `
          radial-gradient(at 40% 20%, rgba(45,74,122,0.8) 0%, transparent 50%),
          radial-gradient(at 80% 0%, rgba(197,165,114,0.3) 0%, transparent 40%),
          radial-gradient(at 0% 50%, rgba(13,21,37,0.9) 0%, transparent 50%)
        `,
        backgroundSize: '200% 200%',
      }}
    />
    {/* Floating orbs */}
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full
                 bg-gold-500/10 blur-[100px]"
      animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ top: '-20%', right: '-10%' }}
    />
    {/* Hero content */}
  </div>
)
```

### WOW Type 2: Interactive Bento Grid

```tsx
// Cards that respond to mouse position (3D tilt)
const TiltCard = ({ children }) => {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: y * -8, y: x * 8 }) // max 8deg
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {children}
    </motion.div>
  )
}
```

### WOW Type 3: Kinetic Typography

```tsx
// Text that reveals word-by-word
const KineticText = ({ text, className }) => {
  const words = text.split(' ')

  return (
    <motion.h1
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 40, rotateX: -40 },
            visible: {
              opacity: 1, y: 0, rotateX: 0,
              transition: {
                delay: i * 0.06,
                duration: 0.6,
                ease: [0.215, 0.61, 0.355, 1]
              }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  )
}
```

### WOW Type 4: Number Counter (Already in Stats section above)

### WOW Type 5: Scroll-triggered Reveal Grid

```tsx
const BentoRevealGrid = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {items.map((item, i) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          delay: (i % 3) * 0.1,  // stagger by column position
          duration: 0.5,
          ease: [0.215, 0.61, 0.355, 1]
        }}
        className={cn(
          "glass-premium rounded-2xl p-6",
          i === 0 && "lg:col-span-2 lg:row-span-2"  // hero tile
        )}
      >
        {/* card content */}
      </motion.div>
    ))}
  </div>
)
```

---

## 📋 Design Review Checklist

```
Before marking any design as "WOW ready":

Visual Hierarchy:
□ Most important content in top-left (F-Pattern)
□ Clear visual weight difference between primary/secondary/tertiary
□ Single primary CTA per screen section
□ Whitespace used intentionally (not randomly)

Premium Quality:
□ Glass effects look crisp (not muddy/blurry)
□ Shadows add depth (not flatten)
□ Gradients are smooth (not banded)
□ Typography is consistent with design tokens
□ Colors are consistent with design tokens
□ Border radius consistent throughout

WOW Factor:
□ At least 1 element causes "wow" reaction
□ Statistics animate when scrolled to
□ Cards respond to hover (depth/tilt)
□ Entry animations feel premium (not cheap)
□ Loading states are elegant

Mobile Quality:
□ Content is readable without zooming
□ Tap targets are large enough
□ No horizontal overflow
□ Animations work on mobile (not too heavy)
□ Touch interactions feel native

Brand Consistency:
□ Color palette: only design tokens
□ Typography: Sarabun/Inter only
□ Icons: consistent icon set, consistent sizes
□ Tone: premium, trustworthy, modern
```
