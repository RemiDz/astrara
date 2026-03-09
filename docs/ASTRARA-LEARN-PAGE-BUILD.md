# Astrara — /learn Page Build

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable. Use ultrathink for this task.

---

## Vision

Build a `/learn` route in Astrara that serves as an interactive astrology education hub. This page teaches complete beginners what astrology is, how to read a chart, what planets and signs mean, and how it all connects to sound healing — all in Astrara's mystical-but-clear voice. It doubles as a reference tool for practitioners who want to look things up quickly.

The page is publicly accessible (linked from the main app header and footer) and is bilingual (EN/LT) using the existing i18n system.

---

## ⚠️ CRITICAL RULES

1. **Read all existing source files first** before making any changes — understand the current i18n system, routing, component patterns, and styling conventions.
2. **Do NOT break any existing features** — the main wheel, cosmic reading, promo page, about modal, all must continue working.
3. **Match the existing Astrara design system** — void-black background (#05050F), glassmorphism cards, silver/white structural elements, element colours for zodiac, purple for interactive UI only.
4. **Do NOT use framer-motion** — the project does not use it. Use CSS transitions/animations only.
5. **iOS Safari compatibility** — add `-webkit-appearance: none`, `appearance: none`, `min-width: 0` to any date/time inputs if used.
6. **No visible scrollbars** — the existing globals.css handles this, but verify.
7. **Push to main branch** — `git push origin master:main` for Vercel deployment.

---

## Page Structure — 4 Sections

### SECTION 1: Header

```
┌─────────────────────────────────────────────────┐
│  ← Back to Astrara          🇬🇧 EN ▾           │
│                                                  │
│  ✦ Learn Astrology                               │
│  Your guide to reading the cosmic map            │
│                                                  │
│  Everything you need to understand what the      │
│  planets are doing and why it matters.           │
└─────────────────────────────────────────────────┘
```

- "Back to Astrara" links to `/` (the main app)
- Language switcher uses the existing i18n language toggle
- Title and subtitle use the standard Astrara typography (DM Sans)
- Glassmorphism card background, consistent with the app aesthetic

---

### SECTION 2: Simplified 2D Astro Wheel (Interactive Reference)

A clean, flat 2D SVG wheel (NOT the 3D R3F wheel from the main page) that serves as a visual teaching tool. This is a separate, simpler component — do not import or reuse the 3D wheel.

```
         ♓  ♈  ♉
       ♒          ♊
     ♑    [planets]   ♋
       ♐          ♌
         ♏  ♎  ♍
```

**Requirements:**
- 12 zodiac segments around the outside, coloured by element (Fire red, Earth green, Air blue, Water purple — use the same ELEMENT_COLOURS from the existing codebase)
- Planet positions calculated using `astronomy-engine` for today's date (reuse the existing `useAstroData` hook or the astronomy utility functions)
- Planets rendered as small coloured dots with their glyph labels (☉☽☿♀♂♃♄♅♆♇)
- **Tappable planets** — tap a planet → highlights it on the wheel AND scrolls the briefing panel (Section 3) to that planet's entry
- **Tappable zodiac signs** — tap a sign → highlights the segment AND scrolls Section 3 to that sign's entry
- Aspect lines between planets, colour-coded by type (conjunction white, trine green, square red, opposition orange, sextile blue)
- Aspect lines are subtle (25% opacity default) and only fully visible when a connected planet is tapped
- Wheel does NOT rotate — it's a static reference diagram
- Responsive: ~90vw on mobile, ~500px max on desktop
- SVG-based for clean rendering and DOM interactivity

---

### SECTION 3: Today's Cosmic Briefing Panel

Below the wheel, a scrollable panel that explains today's sky in plain language. This panel uses the Claude API (the same `/api/reading` route pattern already in the app, or a new `/api/learn-briefing` route) to generate a fresh daily briefing.

**Panel Layout:**

```
┌─────────────────────────────────────────┐
│  ☀️ Today's Sky — 9 March 2026          │
│                                          │
│  ☉ Sun in Pisces (18°)                  │
│  Your willpower flows gently today...    │
│                                          │
│  ☽ Moon in Virgo (4°)                   │
│  The Moon asks you to refine, not rush.  │
│                                          │
│  ☿ Mercury in Pisces (12°) — Rx         │
│  Communications swim rather than march...│
│                                          │
│  [... all 10 planets ...]               │
│                                          │
│  ── Active Aspects ──                    │
│  ☉ trine ♃ — Easy expansion of will     │
│  ♀ square ♇ — Intensity in relationships │
│                                          │
│  ── Sound Healing Recommendation ──      │
│  Based on today's configuration:         │
│  Primary frequency: 528 Hz              │
│  Instruments: Crystal bowls, monochord   │
└─────────────────────────────────────────┘
```

**Two modes:**

1. **Static mode (default, instant):** Uses the pre-written content from `planet-meanings.ts`, `sign-meanings.ts`, and `aspect-meanings.ts` — the same data files the main app uses. This loads instantly, costs nothing, and works offline.

2. **AI-enhanced mode (optional, Pro feature):** A "Generate Deep Reading" button calls the Claude API to produce a richer, contextual briefing that considers the COMBINATION of all current transits together, not just each planet in isolation. This uses the existing Anthropic API key and route pattern.

**API Route (if creating a new one):**

```typescript
// src/app/api/learn-briefing/route.ts

const systemPrompt = `You are Astrara's cosmic intelligence — a warm, wise astrologer who explains 
the current sky to someone who is just learning. Your voice is mystical but clear: a poet who also 
gives practical advice. A 10-year-old should understand the meaning. A practitioner should appreciate 
the depth.

You are given today's planetary positions. Generate a briefing covering:
1. A 2-sentence overview of the day's energy
2. Each planet's current position and what it means (2-3 sentences each)
3. The most significant aspects active today and what they mean practically
4. A sound healing recommendation (frequency + instruments) based on the dominant energies

Use British English. Be warm, not clinical. Be specific, not vague.
Do NOT use the word "cosmic" more than once.
Do NOT use phrases like "the universe is telling you" or "the stars align".
DO mention specific degrees, signs, and aspects by name — teach while you guide.`
```

**Planet entry in the briefing should link back to the wheel** — when the user taps a planet name in the briefing, the wheel scrolls into view (if off-screen) and highlights that planet.

---

### SECTION 4: Learning Tabs — Reference Library

Below the briefing, a tabbed interface with 5 tabs:

```
[ Planets ] [ Signs ] [ Aspects ] [ Houses ] [ Elements & Sound ]
```

Each tab contains a scrollable list of cards with educational content.

#### Tab 1: Planets (10 entries)

Each planet card:
```
┌─────────────────────────────────────────┐
│  ☉ The Sun                              │
│  Rules: Leo · Element: Fire             │
│  Cycle: 1 year through all signs        │
│                                          │
│  The Sun represents your core identity,  │
│  willpower, and creative force. Where    │
│  the Sun sits in your chart shows what   │
│  drives you at the deepest level.        │
│                                          │
│  In transit: The Sun spends ~30 days in  │
│  each sign. When it enters a new sign,   │
│  the collective energy shifts.           │
│                                          │
│  Sound connection: Gold singing bowls,   │
│  126.22 Hz (Cousto's solar frequency)    │
└─────────────────────────────────────────┘
```

Include all 10: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto.

Content must be written fresh for this page — do NOT just copy the existing planet-meanings.ts content. The /learn content is educational and explanatory (teaching what each planet IS), while the existing content is interpretive (what a planet in a specific sign MEANS today).

#### Tab 2: Signs (12 entries)

Each sign card:
```
┌─────────────────────────────────────────┐
│  ♈ Aries — The Initiator                │
│  Element: Fire 🔥 · Modality: Cardinal  │
│  Ruling Planet: Mars ♂                   │
│  Dates: Mar 21 – Apr 19                 │
│  Body: Head, face, adrenal glands       │
│                                          │
│  Aries is the first sign — raw energy,   │
│  courage, and the impulse to begin.      │
│  When planets pass through Aries, the    │
│  world quickens. Action feels urgent.    │
│  Patience thins. New things demand to    │
│  be born.                                │
│                                          │
│  Shadow: Impatience, aggression,         │
│  recklessness                            │
│                                          │
│  Sound healing: 396 Hz (liberation),     │
│  drums, didgeridoo, Tibetan bowls        │
│  Keynote: C                              │
└─────────────────────────────────────────┘
```

Include all 12 signs with the same depth.

#### Tab 3: Aspects (5 major + brief mention of minor)

Each aspect card:
```
┌─────────────────────────────────────────┐
│  △ Trine (120°) — Flow                  │
│  Energy: Harmonious, easy, natural       │
│                                          │
│  A trine connects planets 120° apart —   │
│  always in signs of the same element.    │
│  This creates a natural flow of energy   │
│  between them, like a river finding its  │
│  easiest path.                           │
│                                          │
│  In practice: Trines feel effortless.    │
│  Talents come naturally. The risk is     │
│  complacency — when something is easy,   │
│  you may not develop it fully.           │
│                                          │
│  Visual: Green lines on the wheel        │
└─────────────────────────────────────────┘
```

Cover: Conjunction (0°), Sextile (60°), Square (90°), Trine (120°), Opposition (180°). Briefly mention minor aspects (semi-sextile, quincunx) at the bottom.

#### Tab 4: Houses (12 entries)

Each house card:
```
┌─────────────────────────────────────────┐
│  House 1 — The Self                      │
│  Natural sign: Aries · Planet: Mars      │
│                                          │
│  The first house represents how you      │
│  present yourself to the world — your    │
│  appearance, first impressions, and      │
│  physical body. Planets here are         │
│  expressed directly and visibly.         │
│                                          │
│  In readings: "Planets in your 1st       │
│  house shape how others see you."        │
└─────────────────────────────────────────┘
```

Include all 12 houses. Use the Whole Sign House System (consistent with the Cosmic Reading feature). Explain houses in practical, non-jargon language — "your daily routines and health" not "the sixth mundane house."

#### Tab 5: Elements & Sound Healing

This tab connects astrology to sound healing — the unique Astrara/Harmonic Waves angle.

```
┌─────────────────────────────────────────┐
│  🔥 Fire Signs (Aries, Leo, Sagittarius)│
│                                          │
│  Fire energy is active, creative, and    │
│  outward-moving. When multiple planets   │
│  are in fire signs, the collective       │
│  energy is bold and impatient.           │
│                                          │
│  Sound healing approach:                 │
│  • Frequency range: 396–741 Hz          │
│  • Instruments: Drums, gongs, djembe,   │
│    didgeridoo, singing                   │
│  • Approach: Rhythmic, activating,       │
│    building towards release              │
│  • Caution: Fire excess → use water      │
│    instruments (ocean drum, rain stick)  │
│    to balance                            │
│                                          │
│  Solfeggio connections:                  │
│  Aries: 396 Hz (liberation)             │
│  Leo: 741 Hz (expression)               │
│  Sagittarius: 963 Hz (awakening)        │
└─────────────────────────────────────────┘
```

Cover all 4 elements (Fire, Earth, Air, Water) plus Ether/Spirit as a 5th concept connecting to the Harmonic Waves ecosystem philosophy.

Include a section on Hans Cousto's planetary frequencies — the mathematical relationship between planetary orbital periods and audible frequencies. This is the science behind the sound healing frequencies used in Astrara.

---

## My Chart Mode

If the user has entered birth data (check `localStorage` for `astrara_birth_data` or `astrara_zodiac_profile`), show a toggle at the top:

```
[ General ] [ My Chart ]
```

**General mode:** Shows today's transits and educational content as described above.

**My Chart mode:** The wheel shows the user's natal chart (birth positions) with today's transits overlaid. The briefing panel explains how today's transits interact with THEIR specific placements. This requires the birth data to calculate natal positions using `astronomy-engine`.

If no birth data exists, the "My Chart" tab shows a friendly prompt: "Enter your birth details to see your personal chart" with a button linking to the birth chart entry modal.

---

## Static Content Requirements

All educational content for the tabs (Planets, Signs, Aspects, Houses, Elements & Sound) must be written directly into the codebase as static TypeScript data files:

```
src/i18n/content/
├── en/
│   ├── learn-planets.ts      ← NEW: 10 planet educational entries
│   ├── learn-signs.ts        ← NEW: 12 sign educational entries
│   ├── learn-aspects.ts      ← NEW: 5 major + minor aspects
│   ├── learn-houses.ts       ← NEW: 12 house explanations
│   └── learn-elements.ts     ← NEW: 4 elements + sound healing connections
└── lt/
    ├── learn-planets.ts      ← NEW: Lithuanian translations
    ├── learn-signs.ts
    ├── learn-aspects.ts
    ├── learn-houses.ts
    └── learn-elements.ts
```

**Content voice:** Educational, warm, practitioner-friendly. A sound healer should be able to read this to a client. A teenager should understand it. British English spelling.

**Lithuanian content:** Write naturally, not machine-translated. Use proper Lithuanian astrological terminology where it exists (e.g., "Avinas" for Aries, "Jautis" for Taurus, "trigonalis" for trine).

---

## File Structure

```
src/
├── app/
│   ├── learn/
│   │   └── page.tsx           ← NEW: /learn page
│   └── api/
│       └── learn-briefing/
│           └── route.ts       ← NEW: optional AI briefing endpoint
├── components/
│   ├── Learn/
│   │   ├── LearnHeader.tsx    ← NEW: page header with back link
│   │   ├── LearnWheel.tsx     ← NEW: simplified 2D SVG wheel
│   │   ├── BriefingPanel.tsx  ← NEW: today's cosmic briefing
│   │   ├── LearningTabs.tsx   ← NEW: tabbed reference library
│   │   ├── PlanetCard.tsx     ← NEW: individual planet education card
│   │   ├── SignCard.tsx       ← NEW: individual sign education card
│   │   ├── AspectCard.tsx     ← NEW: individual aspect education card
│   │   ├── HouseCard.tsx      ← NEW: individual house education card
│   │   └── ElementCard.tsx    ← NEW: element + sound healing card
│   └── ... (existing components untouched)
├── i18n/
│   └── content/
│       ├── en/
│       │   ├── learn-planets.ts
│       │   ├── learn-signs.ts
│       │   ├── learn-aspects.ts
│       │   ├── learn-houses.ts
│       │   └── learn-elements.ts
│       └── lt/
│           ├── learn-planets.ts
│           ├── learn-signs.ts
│           ├── learn-aspects.ts
│           ├── learn-houses.ts
│           └── learn-elements.ts
└── ... (existing files untouched)
```

---

## Styling Specifications

- Background: void-black `#05050F` (same as main app)
- Cards: glassmorphism — `bg-white/[0.025] border border-white/[0.06] backdrop-blur-sm`
- Tab buttons: purple when active (`bg-purple-500/20 text-purple-300`), silver when inactive (`text-white/40`)
- Planet/sign colours: use the existing `ELEMENT_COLOURS` and planet colour constants from the codebase
- Typography: DM Sans for body, consistent with the main app
- Section headings: `text-[10px] uppercase tracking-[0.2em] text-white/30`
- Card content: `text-[13px] text-white/55 leading-relaxed`
- Interactive elements (links, buttons): purple accent only
- No visible scrollbars (already handled in globals.css)
- Mobile-first: full-width cards on mobile, max-width constrained on desktop

---

## Navigation Integration

1. Add a "Learn" link in the main app header (next to the info button or in the settings panel)
2. Add a "Learn" link in the main app footer (next to the Harmonic Waves ecosystem link)
3. The /learn page header has a "Back to Astrara" link that returns to `/`

---

## Quality Bar

Before committing, verify:
- [ ] `/learn` loads without errors
- [ ] Back to Astrara link works
- [ ] Language switcher works (EN ↔ LT)
- [ ] 2D wheel renders with correct planet positions for today
- [ ] Tapping a planet on the wheel scrolls to its briefing entry
- [ ] Tapping a zodiac sign on the wheel scrolls to its entry
- [ ] All 5 learning tabs load with full content
- [ ] All 10 planet cards render in both EN and LT
- [ ] All 12 sign cards render in both EN and LT
- [ ] All 5 aspect cards render in both EN and LT
- [ ] All 12 house cards render in both EN and LT
- [ ] Elements & Sound tab has all 4 elements + Cousto frequencies
- [ ] My Chart toggle appears when birth data exists
- [ ] My Chart toggle shows prompt when no birth data
- [ ] Mobile layout is clean (test at 375px width)
- [ ] No scrollbar visible
- [ ] No regressions on the main app (`/` route)
- [ ] `npm run build` passes
- [ ] Committed and pushed to main

---

## Final Build Checklist

1. Read all existing source files
2. Create the `/learn` route and page component
3. Create the LearnWheel (2D SVG) component
4. Create the BriefingPanel component (static mode)
5. Create the LearningTabs component with 5 tabs
6. Create all educational content data files (EN)
7. Create all educational content data files (LT)
8. Create individual card components (PlanetCard, SignCard, etc.)
9. Optionally create the `/api/learn-briefing` route for AI mode
10. Add My Chart toggle (conditional on birth data)
11. Add navigation links from main app header/footer
12. Test all functionality listed in Quality Bar
13. Run `npm run build`
14. Push to **main** branch
15. Commit: `feat: /learn page — interactive astrology education hub with reference library`
