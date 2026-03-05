# ASTRARA v2 — Glass Card Implementation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This changes only card styling and the CSS. All interaction logic, tap handlers, modals, audio, wheel must remain working.

---

## What This Does

Replaces the current content card styling with transparent glass cards that show the starfield through them with a soft blur, animated light refraction shimmer, rotating gradient border, and edge light sweep. Text stays crisp above the blur.

---

## Step 1: Add Glass Card CSS to globals.css

Add ALL of the following CSS to your globals.css file. Do not modify it — use it exactly as written:

```css
/* =============================================
   GLASS CARDS — Astrara
   ============================================= */

.glass-card {
  position: relative;
  border-radius: 20px;
  margin-bottom: 14px;
  background: none;
  border: none;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 rgba(255, 255, 255, 0.02),
    inset 1px 0 0 rgba(255, 255, 255, 0.02),
    inset -1px 0 0 rgba(255, 255, 255, 0.02),
    0 0 0 1px rgba(147, 197, 253, 0.07);
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  will-change: transform;
  isolation: isolate;
}

/* Glass tint — separate child so backdrop-filter blurs the background THROUGH the card */
.glass-tint {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(10, 10, 30, 0.35);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  z-index: 0;
}

@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .glass-tint {
    background: rgba(10, 10, 30, 0.7);
  }
}

/* Rotating gradient border — respects border-radius via mask */
@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

@keyframes glass-borderRotate {
  to { --border-angle: 360deg; }
}

.glass-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(
    var(--border-angle),
    rgba(147, 197, 253, 0.12),
    rgba(167, 139, 250, 0.08),
    rgba(96, 165, 250, 0.12),
    rgba(192, 168, 255, 0.06),
    rgba(147, 197, 253, 0.12)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 4;
  animation: glass-borderRotate 20s linear infinite;
}

/* Top edge — light sweep */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(147, 197, 253, 0.12) 30%, 
    rgba(255, 255, 255, 0.2) 50%, 
    rgba(167, 139, 250, 0.12) 70%, 
    transparent 100%
  );
  background-size: 200% 100%;
  animation: glass-edgeSweep 10s linear infinite;
  z-index: 2;
}

@keyframes glass-edgeSweep {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.glass-card:nth-child(1)::before { animation-delay: 0s; animation-duration: 10s; }
.glass-card:nth-child(2)::before { animation-delay: 2.5s; animation-duration: 11s; }
.glass-card:nth-child(3)::before { animation-delay: 5s; animation-duration: 12s; }
.glass-card:nth-child(4)::before { animation-delay: 7.5s; animation-duration: 13s; }

/* Refraction shimmer */
.glass-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: 
    linear-gradient(
      135deg,
      transparent 0%,
      rgba(120, 160, 255, 0.04) 20%,
      rgba(180, 140, 255, 0.06) 35%,
      rgba(100, 220, 255, 0.04) 50%,
      rgba(200, 160, 255, 0.03) 65%,
      rgba(80, 180, 255, 0.05) 80%,
      transparent 100%
    ),
    radial-gradient(
      ellipse at 50% 50%,
      rgba(147, 197, 253, 0.06) 0%,
      rgba(167, 139, 250, 0.03) 40%,
      transparent 70%
    );
  background-size: 300% 300%, 200% 200%;
  pointer-events: none;
  z-index: 1;
  animation: glass-refract 16s ease-in-out infinite;
}

@keyframes glass-refract {
  0%   { background-position: 0% 0%, 0% 0%; }
  25%  { background-position: 50% 100%, 100% 0%; }
  50%  { background-position: 100% 50%, 50% 100%; }
  75%  { background-position: 50% 0%, 0% 50%; }
  100% { background-position: 0% 0%, 0% 0%; }
}

.glass-card:nth-child(1)::after { animation-delay: 0s; }
.glass-card:nth-child(2)::after { animation-delay: 4s; }
.glass-card:nth-child(3)::after { animation-delay: 8s; }
.glass-card:nth-child(4)::after { animation-delay: 12s; }

/* Hover */
.glass-card:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.35),
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 0 50px rgba(100, 160, 255, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.03),
    inset 1px 0 0 rgba(255, 255, 255, 0.03),
    inset -1px 0 0 rgba(255, 255, 255, 0.03),
    0 0 0 1px rgba(147, 197, 253, 0.12);
}

/* Text container — crisp, above blur */
.glass-card-inner {
  position: relative;
  z-index: 5;
  padding: 22px 24px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: translateZ(1px);
  backface-visibility: hidden;
}

/* Card divider */
.glass-card .card-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.04) 70%, transparent);
  margin: 16px 0;
}

/* Entrance animation */
@keyframes glass-cardFloat {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-card {
  opacity: 0;
  transform: translateY(20px);
  animation: glass-cardFloat 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.glass-card:nth-child(1) { animation-delay: 0.1s; }
.glass-card:nth-child(2) { animation-delay: 0.25s; }
.glass-card:nth-child(3) { animation-delay: 0.4s; }
.glass-card:nth-child(4) { animation-delay: 0.55s; }

/* Breathing */
@keyframes glass-breathe {
  0%, 100% { 
    box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2), 
                inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(255,255,255,0.02),
                0 0 0 1px rgba(147, 197, 253, 0.07); 
  }
  50% { 
    box-shadow: 0 10px 36px rgba(0,0,0,0.28), 0 3px 10px rgba(0,0,0,0.18), 
                0 0 50px rgba(100, 160, 255, 0.015),
                inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(255,255,255,0.025),
                0 0 0 1px rgba(147, 197, 253, 0.09); 
  }
}

.glass-card.breathing {
  animation: glass-borderRotate 20s linear infinite,
             glass-cardFloat 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards,
             glass-breathe 10s ease-in-out infinite 1.5s;
}
```

---

## Step 2: Update Card HTML Structure

Every content card below the wheel must use this EXACT structure:

```tsx
<div className="glass-card breathing mx-4">
  <div className="glass-tint" />
  <div className="glass-border" />
  <div className="glass-card-inner">
    {/* card content goes here */}
  </div>
</div>
```

The three child divs are critical:
- `.glass-tint` — handles the blur transparency (z-index 0)
- `.glass-border` — handles the rotating gradient border (z-index 4)
- `.glass-card-inner` — holds the text content (z-index 5, above blur)

Find every content card component and update its structure. Remove any old card styling (bg-white/3, border-white/8, backdrop-blur classes, etc.).

---

## Step 3: Ensure Parent Containers Are Transparent

For backdrop-filter to work, EVERY element between the starfield/canvas background and the glass cards must be transparent. Check:

1. The `<main>` element — must have `background: transparent` or no background at all
2. The cards container/wrapper div — must have no background
3. Any section or layout div wrapping the cards — no background

If any parent has `bg-[#07070F]` or `bg-[#0D0D1A]` or any solid Tailwind bg class, REMOVE IT. The page background colour should only exist on `<html>` or `<body>`.

---

## Step 4: Typography in Cards

Use these text styles inside `.glass-card-inner`:

```tsx
{/* Section label */}
<p className="text-[9px] font-mono font-light tracking-[0.18em] uppercase text-white/35 mb-3.5">
  {label}
</p>

{/* Title */}
<h3 className="text-[22px] font-serif font-medium text-white/95 leading-tight mb-1">
  {title}
</h3>

{/* Subtitle */}
<p className="text-[13px] font-light text-white/45 mb-4">
  {subtitle}
</p>

{/* Body text */}
<p className="text-[13px] font-light text-white/50 leading-relaxed">
  {body}
</p>

{/* Data row */}
<div className="flex justify-between items-baseline py-2 border-b border-white/[0.03] last:border-b-0">
  <span className="text-xs font-light text-white/40">{label}</span>
  <span className="text-[13px] font-mono text-white/75">{value}</span>
</div>

{/* Divider */}
<div className="card-divider" />
```

Key: titles at 95% opacity, body at 50%, labels at 35-40%, values at 75%. This keeps text crisp and readable above the glass.

---

## Step 5: Google Fonts

Ensure these fonts are loaded (they may already be in the project):

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
```

If using Next.js font imports instead, ensure DM Mono is available alongside DM Sans and Cormorant Garamond.

---

## Build Steps

1. Add all glass card CSS to globals.css exactly as provided
2. Update every content card component to use the glass-card structure (glass-tint + glass-border + glass-card-inner)
3. Remove any old card backgrounds and inline styles
4. Verify all parent containers between background and cards are transparent
5. Verify fonts are loaded (DM Mono, DM Sans, Cormorant Garamond)
6. Test: stars/starfield visible through cards with soft blur
7. Test: text is crisp and readable, not blurry
8. Test: edge light sweeps smoothly across card tops
9. Test: shimmer refraction moves smoothly without jumping
10. Test: cards float up with staggered entrance on page load
11. Test ALL existing features still work
12. Run `npm run build`
13. Push to **main** branch
14. Commit: `design: glass transparent cards with animated refraction and blur`
