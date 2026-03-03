Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# ASTRARA — Root Cause Style Fix

The app styling is completely broken. Elements overlap, content bleeds off screen, form inputs have no visible styling, cards have no backgrounds. Before making any visual changes, DIAGNOSE the root cause.

## Step 1: DIAGNOSE — Read every style-related file and report issues

Read and check ALL of these files:
1. `src/app/globals.css` — Are CSS custom properties defined? Are they inside the correct layer/scope for Tailwind v4?
2. `tailwind.config.ts` (or `tailwind.config.js`) — Is the theme extending with the custom colours? Or is Tailwind v4 being used (which uses CSS-based config)?
3. `postcss.config.js` — Is Tailwind configured correctly?
4. `src/app/layout.tsx` — Are fonts loading? Is globals.css imported?
5. Check the Tailwind version in package.json — if v4, the config system is completely different from v3.

**Common root causes:**
- Tailwind v4 does NOT use tailwind.config.ts — it uses `@theme` in CSS. If the project uses Tailwind v4 but has a v3-style config, ALL custom colours/theme extensions will be ignored.
- CSS custom properties defined outside `@layer base` or `:root` may not cascade correctly.
- If using Tailwind v4 with `@import "tailwindcss"`, custom properties must be registered via `@theme` blocks.

**Report what you find before making changes.**

## Step 2: FIX the styling foundation

Based on what you find, fix the root cause. Then ensure these CORE styles work:

### globals.css must have (adapt for Tailwind v3 or v4 as appropriate):

```css
/* If Tailwind v4 — register theme values */
@import "tailwindcss";

@theme {
  --color-space: #04040A;
  --color-space-surface: #0A0B14;
  --color-space-card: #0F1019;
  --color-space-hover: #161722;
  --color-border: #1E1F2E;
  --color-border-active: #3B4BDB;
  --color-accent: #3B82F6;
  --color-accent-warm: #F59E0B;
  --color-accent-cool: #8B5CF6;
  --color-text-primary: #E8ECF4;
  --color-text-secondary: #6B7194;
  --color-text-dim: #3D4167;
  --color-planet-sun: #FCD34D;
  --color-planet-moon: #E2E8F0;
  --color-planet-mercury: #A5B4FC;
  --color-planet-venus: #F9A8D4;
  --color-planet-mars: #EF4444;
  --color-planet-jupiter: #FB923C;
  --color-planet-saturn: #A78BFA;
  --color-planet-uranus: #22D3EE;
  --color-planet-neptune: #6366F1;
  --color-planet-pluto: #9CA3AF;
}

/* If Tailwind v3 — use :root for custom properties */
/* And extend theme in tailwind.config.ts */
```

### Verify these utility classes actually work in the app:
- `bg-space` or `bg-[#04040A]` — does it apply?
- `border-border` or `border-[#1E1F2E]` — does it apply?
- `text-text-primary` or `text-[#E8ECF4]` — does it apply?

If Tailwind theme colours don't work, FALL BACK to using inline hex values in Tailwind classes: `bg-[#0F1019]`, `border-[#1E1F2E]`, `text-[#E8ECF4]` etc. This always works regardless of Tailwind version.

## Step 3: Fix EVERY page layout

After the foundation is fixed, go through each page and fix the layout. Use the screenshots as reference for what's broken.

### Landing Page (/) — MUST look like this:

```
┌─────────────────────────────────────┐ ← screen edge
│ ┌─────────────────────────────────┐ │ ← px-6 padding
│ │         [Fixed Header]          │ │
│ │  ASTRARA              🇬🇧 EN ▾  │ │
│ └─────────────────────────────────┘ │
│                                     │
│         [Cosmic Ring 160px]         │
│                                     │
│            A S T R A R A            │
│    What does your birth chart       │
│         sound like?                 │
│  Every person has a unique cosmic   │
│    frequency. Discover yours.       │
│                                     │
│  ┌───────────────────────────────┐  │ ← Card wrapper
│  │ DATE OF BIRTH                 │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │ dd/mm/yyyy               │ │  │ ← Input with bg, border, rounded
│  │ └───────────────────────────┘ │  │
│  │                               │  │
│  │ TIME OF BIRTH                 │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │ HH:MM                    │ │  │
│  │ └───────────────────────────┘ │  │
│  │ Don't know? Use 12:00         │  │
│  │                               │  │
│  │ CITY OF BIRTH                 │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │ Search for your city...  │ │  │
│  │ └───────────────────────────┘ │  │
│  │                               │  │
│  │ ┌───────────────────────────┐ │  │
│  │ │  Reveal My Cosmic Portrait│ │  │ ← Gradient button
│  │ └───────────────────────────┘ │  │
│  └───────────────────────────────┘  │
│                                     │
│        How does it work? →          │
│       Part of Harmonic Waves        │
└─────────────────────────────────────┘
```

**Critical styles for the form card:**
```tsx
<div className="bg-[#0A0B14] border border-[#1E1F2E] rounded-2xl p-6">
```

**Critical styles for inputs:**
```tsx
<input className="w-full bg-[#0F1019] border border-[#1E1F2E] rounded-lg py-3 px-4 text-sm text-[#E8ECF4] placeholder-[#3D4167] focus:border-[#3B4BDB] focus:outline-none transition-colors" />
```

**Critical styles for labels:**
```tsx
<label className="block text-xs uppercase tracking-wider font-medium text-[#6B7194] mb-2">
```

**Critical styles for generate button:**
```tsx
<button className="w-full py-3.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:brightness-110 transition disabled:opacity-40">
```

### Portrait Page (/portrait/[id]) — Fix these issues:

**Overall container:**
```tsx
<main className="min-h-screen bg-[#04040A] pt-[72px]"> {/* space for fixed header */}
  <div className="max-w-lg mx-auto px-5">
    {/* ALL content inside this constrained container */}
  </div>
</main>
```

**The cosmic wheel:**
- Wrap in a div with `max-w-[380px] mx-auto` on mobile, `max-w-[500px]` on desktop
- Add `mb-4` below
- The Canvas element: `w-full aspect-square` — let CSS handle sizing, set canvas width/height in JS based on the container's actual pixel width × devicePixelRatio

**Birth info line:**
```tsx
<p className="text-center text-sm text-[#6B7194] mb-6">
  3 March 2026 · 20:01 · City of London, United Kingdom
</p>
```

**Play button section:**
```tsx
<div className="flex flex-col items-center mb-10">
  <button className="w-14 h-14 rounded-full bg-[#3B82F6] flex items-center justify-center">
    {/* play icon */}
  </button>
  <span className="text-xs text-[#3D4167] mt-2">Listen to your cosmic sound</span>
</div>
```

**Section divider:**
```tsx
<div className="w-16 h-px bg-[#1E1F2E] mx-auto my-10" />
```

**Section headings:**
```tsx
<h2 className="text-center text-xl font-serif italic text-[#E8ECF4] mb-3">Your Cosmic Sound</h2>
<p className="text-center text-sm text-[#6B7194] max-w-sm mx-auto mb-8">
  Each planet was in a unique position...
</p>
```

**Dominant tone card:**
```tsx
<div className="bg-[#0A0B14] border border-[#3B4BDB] rounded-2xl p-5 mb-6 text-center">
  <p className="text-xs uppercase tracking-wider text-[#6B7194] mb-2">Your Dominant Tone</p>
  <p className="text-2xl font-serif" style={{ color: planetColour }}>Moon · 231.25 Hz</p>
  <p className="text-sm text-[#6B7194] mt-1">The tone of Moon in Virgo</p>
</div>
```

**Planet cards:**
```tsx
<div className="bg-[#0F1019] border border-[#1E1F2E] rounded-xl p-4 mb-3">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: planetColour }} />
      <span className="text-sm font-medium text-[#E8ECF4]">{planetName}</span>
      <span className="text-sm text-[#3D4167]">{symbol}</span>
    </div>
    <span className="text-sm text-[#6B7194]">{sign} {degree}°</span>
  </div>
  <div className="flex items-center justify-end mt-1">
    <span className="text-lg font-mono font-medium" style={{ color: planetColour }}>{freq} Hz</span>
  </div>
  <div className="border-t border-[#1E1F2E] mt-3 pt-2">
    <p className="text-xs text-[#3D4167] italic">{description}</p>
  </div>
</div>
```

**Aspect cards:**
```tsx
<div className="bg-[#0F1019] border border-[#1E1F2E] rounded-xl p-4 mb-2">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p1Colour }} />
      <span className="text-sm text-[#E8ECF4]">{planet1} & {planet2}</span>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p2Colour }} />
    </div>
    <span className="text-sm text-[#3B82F6]">{interval}</span>
  </div>
  <p className="text-xs text-[#3D4167] italic mt-2">{description}</p>
</div>
```

**Share section:**
```tsx
<div className="bg-[#0F1019] border border-[#1E1F2E] rounded-2xl p-6 text-center">
  <p className="text-sm font-medium text-[#E8ECF4] mb-4">Share your Cosmic Portrait</p>
  <button className="px-8 py-3 bg-[#3B82F6] text-white text-sm rounded-xl">
    Copy Link
  </button>
</div>
```

**"Create Another" button:**
```tsx
<button className="w-full max-w-sm mx-auto block mt-4 py-3 text-sm rounded-xl border border-[#1E1F2E] text-[#6B7194] hover:text-[#E8ECF4] hover:border-[#6B7194] transition">
  Create Another Portrait
</button>
```

**Ecosystem cards:**
```tsx
<div className="bg-[#0F1019] border border-[#1E1F2E] rounded-xl p-4 mb-3 flex items-center justify-between">
  <div>
    <p className="text-sm font-medium text-[#E8ECF4]">{appName}</p>
    <p className="text-xs text-[#6B7194]">{description}</p>
  </div>
  <span className="text-[#3D4167]">›</span>
</div>
```

### Header (all pages):
```tsx
<header className="fixed top-0 left-0 right-0 h-14 z-50 bg-[#04040A]/90 backdrop-blur-sm border-b border-[#1E1F2E]/50 flex items-center justify-between px-5">
  <a href="/" className="text-sm font-medium tracking-[0.15em] uppercase text-[#6B7194] hover:text-[#E8ECF4] transition">
    ASTRARA
  </a>
  {/* Language selector on the right */}
</header>
```

## Step 4: Test on mobile viewport

After all fixes, test the layout at these widths:
- 375px (iPhone SE / iPhone 12 mini)
- 390px (iPhone 14)
- 430px (iPhone 15 Pro Max)

Ensure:
- Nothing overflows horizontally (no horizontal scroll)
- No elements touch screen edges (minimum px-5 everywhere)
- No overlapping text or elements
- Cards have visible backgrounds and borders
- Inputs are clearly defined with backgrounds and borders
- Button looks like a button (has colour, padding, rounded corners)

## Step 5: Build and push

```bash
npm run build
git add -A
git commit -m "Root cause style fix: Tailwind config, all layouts, all components"
git push origin master:main
```

The MOST IMPORTANT thing: every element must have a visible background, visible border where specified, and proper spacing. If Tailwind theme classes don't work, use inline hex values `bg-[#0F1019]` — these ALWAYS work. Do not rely on custom theme names if they're not rendering.
