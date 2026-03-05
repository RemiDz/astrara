# ASTRARA v2 — Colour Scheme Overhaul: Silver Structure, Purposeful Purple

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This is a visual-only change. All interaction logic, tap handlers, modals, audio, data fetching, and animations must remain working. Test everything after completing.

---

## Problem

Everything is purple — wheel rings, zodiac glyphs, buttons, text, glows, backgrounds. This flattens the visual hierarchy. Nothing stands out because everything is the same colour. The app looks monotone instead of cosmic.

## Design Principle

**Purple = interactive.** Everything else = neutral silver/white/blue cosmic palette. When the user sees purple, it means "tap me." When they see silver, it means "structure." When they see colour, it means "element data."

---

## Colour Palette

```typescript
// STRUCTURAL (wheel rings, lines, borders, labels)
const SILVER_LIGHT = 'rgba(255, 255, 255, 0.15)'    // ring fills
const SILVER_EDGE = 'rgba(255, 255, 255, 0.25)'      // ring borders, divider lines
const SILVER_GLOW = 'rgba(200, 210, 230, 0.12)'      // subtle structural glow
const LABEL_PRIMARY = 'rgba(255, 255, 255, 0.75)'    // important text
const LABEL_SECONDARY = 'rgba(255, 255, 255, 0.45)'  // secondary text
const LABEL_MUTED = 'rgba(255, 255, 255, 0.25)'      // hints, timestamps

// ELEMENT COLOURS (zodiac signs, planet associations)
const FIRE = '#FF6B4A'       // Aries, Leo, Sagittarius
const EARTH = '#4ADE80'      // Taurus, Virgo, Capricorn
const AIR = '#60A5FA'        // Gemini, Libra, Aquarius
const WATER = '#A78BFA'      // Cancer, Scorpio, Pisces (purple here is correct — it's the water element)

// INTERACTIVE (buttons, CTAs, selected states, toggles)
const INTERACTIVE = '#A855F7'           // purple — only for tappable UI
const INTERACTIVE_SUBTLE = '#A855F720'  // purple at 12% — hover/active backgrounds
const INTERACTIVE_BORDER = '#A855F730'  // purple at 19% — active button borders

// ASPECT LINES (colour-coded by meaning)
const ASPECT_CONJUNCTION = '#FBBF24'   // gold — planets together
const ASPECT_TRINE = '#34D399'         // green — harmonious flow
const ASPECT_SEXTILE = '#60A5FA'       // blue — opportunity
const ASPECT_SQUARE = '#F87171'        // red — tension/challenge
const ASPECT_OPPOSITION = '#FB923C'    // orange — polarity/awareness

// BACKGROUNDS
const BG_DEEP = '#07070F'             // page background (keep as is)
const BG_SURFACE = '#0D0D1A'          // card/modal backgrounds (keep as is)
```

---

## Changes by Component

### 1. Wheel Rings — Silver/White Glass

Find all wheel ring materials. Change from purple tint to neutral silver:

```tsx
// BEFORE (purple):
<meshPhysicalMaterial
  color="#a78bfa"
  ...
/>

// AFTER (silver):
<meshPhysicalMaterial
  color="#c0c8e0"               // cool silver-blue
  transparent
  opacity={0.1}
  roughness={0.05}
  metalness={0.6}               // more metallic = silver look
  clearcoat={1.0}
  clearcoatRoughness={0.05}
  side={THREE.DoubleSide}
/>
```

Ring edge glow lines (if using thin torus geometries for ring borders):

```tsx
// BEFORE:
color="#a78bfa"

// AFTER:
color="#ffffff"
opacity={0.15}
```

### 2. Zodiac Glyphs — Keep Element Colours, Remove Any Purple Override

The zodiac glyphs should ONLY use their element colour. Check that no global purple tint is overriding the element colours:

```typescript
// These should already be correct — verify they're being used:
fire signs (♈♌♐):  colour = '#FF6B4A'
earth signs (♉♍♑): colour = '#4ADE80'
air signs (♊♎♒):   colour = '#60A5FA'
water signs (♋♏♓): colour = '#A78BFA'  // purple here is correct
```

If all zodiac glyphs are rendering as the same purple, the element colour mapping is broken. Fix it so each sign uses its own element colour.

### 3. Day Navigation Buttons — Neutral with Purple Only on Active

```tsx
{/* Inactive button (Yesterday, Tomorrow) */}
<button
  className="px-4 py-2 rounded-xl text-sm select-none
             text-white/50 
             border border-white/12
             hover:border-white/20 hover:text-white/70
             active:scale-95 transition-all"
>

{/* Active button (Today / current date) */}
<button
  className="px-4 py-2 rounded-xl text-sm select-none
             text-white/90
             bg-white/8 border border-white/20
             active:scale-95 transition-all"
>
```

No purple on day nav buttons at all. The active state uses a brighter white treatment, not purple. This keeps the buttons feeling structural, not interactive-purple.

### 4. Aspect Lines — Colour-Coded by Type

Find where aspect lines are rendered. Currently they're likely all one colour. Change to aspect-specific colours:

```typescript
function getAspectColour(aspectType: string): string {
  switch (aspectType) {
    case 'conjunction': return '#FBBF24'  // gold
    case 'trine':       return '#34D399'  // green
    case 'sextile':     return '#60A5FA'  // blue
    case 'square':      return '#F87171'  // red
    case 'opposition':  return '#FB923C'  // orange
    default:            return '#ffffff'   // white fallback
  }
}
```

Apply to line materials:

```tsx
<Line
  points={[pos1, pos2]}
  color={getAspectColour(aspect.type)}
  lineWidth={1}
  transparent
  opacity={0.2}
/>
```

This adds real informational value — users can see at a glance which aspects are harmonious (green/blue) and which are tense (red/orange).

### 5. Header Text — White, Not Purple

```tsx
{/* App title */}
<h1 className="text-2xl font-serif text-white/90 tracking-wide">ASTRARA</h1>

{/* Subtitle — was purple, now white/muted */}
<p className="text-white/35 text-xs mt-0.5">
  {t('subtitle')}
</p>

{/* Date — was purple, now white/muted */}
<p className="text-white/55 text-sm mt-1">
  {formattedDate}
</p>

{/* Location text */}
<span className="text-white/50 text-xs">{locationName}</span>

{/* Language switcher text */}
<span className="text-white/50 text-xs">{lang.toUpperCase()}</span>
```

### 6. Info & Settings Buttons — Keep Purple (These Are Interactive)

These are correct as purple because they're interactive elements:

```tsx
{/* Info button — keep purple accent */}
<button className="w-6 h-6 rounded-full border border-purple-400/25 
                   text-purple-300/40 ...">
  i
</button>

{/* Settings button — keep purple accent */}
<button className="w-6 h-6 rounded-full border border-purple-400/25 
                   text-purple-300/40 ...">
  ⚙
</button>
```

### 7. Sound Toggle — Neutral

```tsx
{/* Sound icon — neutral white, not purple */}
<button className="text-white/40 hover:text-white/60 transition-colors select-none">
  {isPlaying ? '🔈' : '🔇'}
</button>
```

### 8. "What Does YOUR Chart Look Like?" CTA — Keep Purple

This is a call-to-action, so purple is correct here:

```tsx
<button className="text-purple-300/50 hover:text-purple-300/80 text-xs ...">
  ✦ {t('cta.birthChart')} →
</button>
```

### 9. Cosmic Weather Cards (below the wheel) — Neutral

If the moon phase card, planetary insight cards, or any content cards below the wheel use purple backgrounds or borders, change them to neutral:

```tsx
{/* Card styling */}
<div className="bg-white/3 border border-white/8 rounded-2xl p-4">
  {/* Card title */}
  <h3 className="text-white/80 text-sm font-medium">Full Moon</h3>
  {/* Card subtitle */}
  <p className="text-white/40 text-xs">98% illumination</p>
</div>
```

### 10. Modal/Bottom Sheet Styling — Neutral Structure, Purple Only for Submit Buttons

```tsx
{/* Modal background — keep dark, neutral */}
<div className="bg-[#0D0D1A]/95 backdrop-blur-xl border border-white/10 ...">

{/* Section headings inside modals */}
<h3 className="text-[10px] uppercase tracking-widest text-white/35 mb-3">

{/* Divider lines */}
<div className="w-full h-px bg-white/8 mb-5" />

{/* Submit/action buttons inside modals — purple (interactive) */}
<button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white ...">

{/* Close button — neutral */}
<button className="text-white/30 hover:text-white/60 ...">✕</button>
```

### 11. Settings Sliders — Purple Accent (Interactive)

The slider thumbs and tracks should remain purple since they're interactive:

```tsx
{/* Slider thumb — purple (correct, it's interactive) */}
[&::-webkit-slider-thumb]:bg-purple-400

{/* Slider track — neutral */}
className="h-1 bg-white/10 rounded-full"

{/* Toggle switch — purple when on, neutral when off */}
className={settings.rotationSoundEnabled ? 'bg-purple-500/60' : 'bg-white/10'}
```

### 12. Starfield Background Particles

If the background star particles are purple-tinted, change them to white:

```tsx
// Star particles
<PointMaterial
  color="#ffffff"       // pure white, not purple
  size={0.01}
  transparent
  opacity={0.6}
/>
```

### 13. Orbiting Light — Neutral

```tsx
// BEFORE:
<pointLight color="#c4b5fd" ... />  // purple light

// AFTER:
<pointLight color="#e0e8ff" ... />  // cool white light
```

### 14. "YOU ARE HERE" Label — Neutral

```tsx
// BEFORE: text-blue-300/40 (probably fine) or text-purple-300/40
// AFTER:
<div className="text-[9px] text-white/30 whitespace-nowrap select-none tracking-widest uppercase">
```

---

## Visual Hierarchy Summary (After Changes)

| Element | Colour | Why |
|---|---|---|
| Wheel rings | Silver/white glass | Structural — framing the data |
| Zodiac glyphs | Element colours (red/green/blue/purple) | Data — which element |
| Planets | Individual planet colours | Data — which planet |
| Aspect lines | Aspect colours (gold/green/blue/red/orange) | Data — what relationship |
| Earth | Blue/green (natural) | Data — recognisable Earth |
| Day nav buttons | White/grey | Structural — navigation |
| Header text | White at various opacities | Structural — information |
| Info/Settings icons | Purple accent | Interactive — tap me |
| Birth chart CTA | Purple text | Interactive — tap me |
| Modal submit buttons | Purple gradient | Interactive — tap me |
| Slider thumbs/toggles | Purple | Interactive — drag/toggle me |
| Star background | White | Atmospheric — not distracting |

---

## Build Steps

1. Read all current component files — identify every instance of purple/violet colour
2. Update wheel ring materials to silver/white glass
3. Update ring edge lines to white
4. Verify zodiac glyphs use element colours (not a blanket purple)
5. Update day navigation buttons to neutral white styling
6. Colour-code aspect lines by aspect type
7. Update header text colours to white at various opacities
8. Update cosmic weather cards to neutral styling
9. Update modal/bottom sheet neutral elements
10. Update orbiting light colour to cool white
11. Update background particles to white
12. Keep purple ONLY on: info/settings buttons, birth chart CTA, modal submit buttons, slider thumbs, toggles
13. Test: wheel looks silver/white, not purple
14. Test: zodiac signs show four distinct element colours
15. Test: aspect lines show different colours for different types
16. Test: buttons and CTAs are clearly interactive (purple stands out)
17. Test: overall app feels cosmic and balanced, not monotone
18. Test ALL existing features still work
19. Run `npm run build`
20. Push to **main** branch
21. Commit: `design: colour scheme overhaul — silver structure, element colours, purposeful purple`
