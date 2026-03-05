# ASTRARA v2 — Phase 1: Live Cosmic Intelligence Dashboard

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Vision

Astrara is a **live cosmic intelligence app** — the first screen any human opens in the morning to understand the celestial weather affecting their day. Think of it as a weather app, but for planetary energy. It opens to **right now** — showing the live sky, planetary positions on an interactive astro wheel, and mystical-but-clear insights about how the current cosmic configuration affects humans.

**This is a complete rebuild from scratch.** Delete everything in the project directory except `.git` and start fresh.

---

## Architecture Overview

```
astrara.app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, fonts, metadata, Plausible
│   │   ├── page.tsx                # Home — Live cosmic dashboard
│   │   ├── globals.css             # Global styles, CSS variables, animations
│   │   ├── about/page.tsx          # How it works
│   │   └── birth-chart/page.tsx    # Personal natal chart (Phase 2 stub)
│   ├── components/
│   │   ├── AstroWheel/
│   │   │   ├── AstroWheel.tsx      # Main interactive wheel component
│   │   │   ├── ZodiacRing.tsx      # Outer ring with 12 signs
│   │   │   ├── PlanetMarker.tsx    # Individual planet with glow + label
│   │   │   ├── AspectLines.tsx     # Lines between planets showing aspects
│   │   │   └── WheelTooltip.tsx    # Expandable detail panel on tap/click
│   │   ├── CosmicWeather/
│   │   │   ├── CosmicWeather.tsx   # Main weather summary panel
│   │   │   ├── PlanetCard.tsx      # Individual planet insight card
│   │   │   ├── AspectHighlight.tsx # Notable aspect callout
│   │   │   └── MoonPhaseCard.tsx   # Current moon phase with visual
│   │   ├── Header/
│   │   │   └── Header.tsx          # ASTRARA wordmark + location + time
│   │   ├── Starfield/
│   │   │   └── Starfield.tsx       # Animated background (canvas-based)
│   │   └── ui/
│   │       ├── GlassCard.tsx       # Reusable glassmorphism container
│   │       ├── Modal.tsx           # Expandable detail modal
│   │       └── Shimmer.tsx         # Loading skeleton
│   ├── lib/
│   │   ├── astronomy.ts           # Wrapper around astronomy-engine
│   │   ├── zodiac.ts              # Ecliptic longitude → zodiac sign mapping
│   │   ├── aspects.ts             # Aspect calculation (conjunction, trine, etc.)
│   │   ├── insights.ts            # Insight text generation engine
│   │   ├── planets.ts             # Planet metadata (colors, meanings, glyphs)
│   │   └── location.ts            # Geolocation helper
│   ├── data/
│   │   ├── planet-meanings.ts     # Deep content for each planet
│   │   ├── sign-meanings.ts       # Deep content for each zodiac sign
│   │   ├── aspect-meanings.ts     # Meaning of each aspect type
│   │   ├── house-meanings.ts      # 12 houses explained
│   │   └── phase-meanings.ts      # Moon phase practitioner guidance
│   └── hooks/
│       ├── useAstroData.ts        # Main hook: computes all planetary data
│       ├── useLocation.ts         # Browser geolocation with fallback
│       └── useRealTime.ts         # Ticking clock for live updates
├── public/
│   ├── fonts/                     # Custom fonts
│   └── og-image.png              # Social sharing image
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Standard ecosystem stack |
| Language | TypeScript (strict) | Type safety |
| Styling | Tailwind CSS | Standard ecosystem stack |
| Ephemeris | `astronomy-engine` (npm) | MIT license, zero dependencies, runs entirely in browser, verified against NASA JPL & NOVAS. Gives ecliptic longitude, rise/set times, moon phases, aspects, retrogrades. ~150KB minified. No API keys needed. |
| Zodiac mapping | Custom `zodiac.ts` | Simple: ecliptic longitude ÷ 30 = sign index |
| Natal charts | `circular-natal-horoscope-js` | For Phase 2 — house systems, ascendant calc |
| Animations | Framer Motion + CSS | Wheel rotation, card transitions, planet pulses |
| Starfield BG | HTML Canvas | Lightweight, no Three.js dependency yet (Phase 3) |
| Moon visuals | CSS + SVG | Shadow mask based on illumination fraction |
| Location | Browser Geolocation API | With manual city search fallback (OpenStreetMap Nominatim for geocoding — free, no key) |
| Deployment | Vercel (free tier) | Standard |
| Analytics | Plausible | Ecosystem standard |
| PWA | next-pwa | For daily return habit |

### Why `astronomy-engine` over an API

- **Zero API calls, zero keys, zero cost, zero rate limits** — completely client-side
- Verified against NASA JPL Horizons to sub-arcminute accuracy — more than sufficient for astrological purposes
- Calculates ecliptic coordinates, which map directly to zodiac signs (longitude ÷ 30)
- Supports all 10 astrological bodies: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
- Moon phase, rise/set times, retrogrades — all built in
- MIT licensed, actively maintained, 19 dependents on npm
- ~150KB — smaller than a single API response payload over time
- Works offline (PWA-ready)
- **User location is used** for rise/set times and horizon calculations, but the zodiac positions themselves are geocentric (same for everyone on Earth at the same moment)

---

## Phase 1 — Screens & UX

### Home Screen (page.tsx) — "The Cosmic Now"

This is the default and only screen for Phase 1. It loads instantly showing the current celestial state.

#### Layout (mobile-first, scrollable)

```
┌─────────────────────────────┐
│  ASTRARA          📍London  │  ← Header: wordmark + detected location
│  4 March 2026 · 10:11 GMT   │  ← Live ticking time
├─────────────────────────────┤
│                             │
│     ╭─── ASTRO WHEEL ───╮  │  ← Interactive, slowly rotating
│     │  ☉ ☽ ♂ ♀ ♃ ♄ etc  │  │     Zodiac ring outer, planets inner
│     │    aspect lines     │  │     Tap any planet → detail panel
│     ╰────────────────────╯  │
│                             │
├─────────────────────────────┤
│  🌙 Waxing Gibbous · 78%   │  ← Moon phase card with visual
│  Moon in Virgo ♍            │
│  "The moon asks you to      │
│   refine, not rush."        │
├─────────────────────────────┤
│  TODAY'S COSMIC WEATHER     │  ← Section header
│                             │
│  ┌─ Sun in Pisces ─────┐   │  ← Scrollable planet cards
│  │ ♓ 14°               │   │     Each has: sign, degree, 
│  │ "Dreams hold more    │   │     one-line poetic insight,
│  │  truth than usual"   │   │     tap to expand full meaning
│  └──────────────────────┘   │
│  ┌─ Mercury in Pisces ──┐   │
│  │ ♓ 4°  □ (square)     │   │
│  │ "Words may tangle —  │   │
│  │  write, don't text"  │   │
│  └──────────────────────┘   │
│  ... more planet cards ...  │
│                             │
├─────────────────────────────┤
│  NOTABLE ASPECTS TODAY      │  ← Key planetary relationships
│                             │
│  ♀ □ ♇  Venus square Pluto │
│  "Deep emotions surface     │
│   in relationships today.   │
│   Let them. Don't force     │
│   resolution."              │
│                             │
├─────────────────────────────┤
│  ⏮ Yesterday · Today · Tomorrow ⏭  │ ← Simple 3-day nav
├─────────────────────────────┤
│  ☽ Want to know YOUR chart? │  ← CTA to birth chart (Phase 2)
│  [ Enter Birth Details → ]  │
├─────────────────────────────┤
│  Part of Harmonic Waves     │  ← Footer
│  harmonicwaves.app          │
└─────────────────────────────┘
```

---

## Interactive Astro Wheel — Detailed Spec

The wheel is the hero element. It must be **hypnotic** for TikTok screen recordings.

### Structure (SVG-based, not Canvas — for interactivity)

```
Outermost layer:  Zodiac sign segments (12 × 30°) with glyphs + names
Middle layer:     Degree markers (every 10° or 30°)
Inner layer:      Planet markers positioned by ecliptic longitude
Centre:           Subtle glow / Astrara logo watermark
Overlay:          Aspect lines connecting planets (dashed, colour-coded)
```

### Visual Design

- **Zodiac ring**: 12 segments, each tinted by element colour:
  - Fire (Aries, Leo, Sagittarius): warm red/orange `#FF6B4A`
  - Earth (Taurus, Virgo, Capricorn): rich green `#4ADE80`
  - Air (Gemini, Libra, Aquarius): sky blue `#60A5FA`
  - Water (Cancer, Scorpio, Pisces): deep purple `#A78BFA`
- **Planet markers**: Glowing orbs with the planet's traditional colour:
  - Sun: gold `#FFD700`, Moon: silver `#C0C0C0`, Mercury: cyan `#00E5FF`
  - Venus: pink `#FF69B4`, Mars: red `#FF4444`, Jupiter: orange `#FF8C00`
  - Saturn: grey-blue `#778899`, Uranus: electric teal `#00CED1`
  - Neptune: deep blue `#4169E1`, Pluto: dark purple `#8B008B`
- Each planet orb has a soft radial glow (CSS `box-shadow` or SVG filter)
- **Aspect lines**: Thin coloured lines between planets
  - Conjunction (0°): bright white
  - Trine (120°): green (harmonious)
  - Square (90°): red (tension)
  - Opposition (180°): orange (polarity)
  - Sextile (60°): blue (opportunity)
- **Rotation**: Entire wheel rotates very slowly (1 revolution per 5 minutes) — slow enough to feel alive, fast enough to be mesmerising on TikTok
- **Planet glyphs**: Use unicode astrological symbols: ☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇
  - Display degree next to each: e.g. `☉ 14°`

### Interactivity

- **Tap/click a planet marker** → Slide-up detail panel (not a full-page modal — a bottom sheet on mobile, side panel on desktop) containing:
  - Planet name + glyph + current sign + exact degree
  - "What this means" — 2-3 sentences, mystical but clear voice
  - "For your day" — practical guidance
  - Current speed / retrograde status
  - Rise and set times (using user location)
  - Which house it's transiting (Phase 2, when birth data available)
  - Close button / swipe down to dismiss

- **Tap/click a zodiac sign segment** → Similar detail panel:
  - Sign name + glyph + element + modality
  - Which planets are currently in this sign
  - "What [sign] energy feels like" — 2-3 sentences
  - Dates when this sign is active (for Sun)

- **Tap/click an aspect line** → Detail panel:
  - "Venus square Pluto" — aspect name + the two planets
  - What this aspect means in plain language
  - How long this aspect is active (applying/separating)
  - Practical guidance for navigating this energy

---

## Insight Text Engine (lib/insights.ts)

### Voice Guidelines

Every piece of text in Astrara should follow this voice:

**Mystical but clear** — poetic language that always explains what it means practically. Like a wise oracle who also gives you actionable advice.

Examples:
- ✅ "Mercury drifts through Pisces at 4°. Your thoughts may wander into dreamlike territory today — beautiful for creative work, but double-check any important messages before sending."
- ✅ "The Moon asks you to refine, not rush. This is a day for editing, not launching."
- ❌ "Mercury is in Pisces which means communication may be affected." (too clinical)
- ❌ "The cosmic vibrations of Mercury's piscean alignment activate your third eye chakra." (too jargon-heavy)

A 10-year-old should understand the practical meaning. A poet should appreciate the language.

### Content Structure per Planet

Each planet in a sign gets:
1. **Headline**: `[Planet] in [Sign] · [degree]°` 
2. **One-liner**: A single poetic sentence (shown on card)
3. **Full insight**: 2-3 paragraphs (shown in expanded detail panel)
4. **Practical tip**: One concrete action or awareness point
5. **Duration**: How long this transit lasts approximately

### Content Generation Strategy

For Phase 1, the insight text is **pre-written in data files** — not AI-generated. Each planet × sign combination (10 planets × 12 signs = 120 combinations) gets hand-crafted text stored in `data/planet-meanings.ts`. This keeps the app zero-API and instant.

The data structure:

```typescript
// data/planet-meanings.ts
export const planetInSign: Record<string, Record<string, PlanetInsight>> = {
  sun: {
    aries: {
      oneLiner: "Your willpower burns bright. Act on what sets you alight.",
      fullInsight: "The Sun in Aries is pure creative fire...",
      practicalTip: "Start something new today — even something small.",
      approxDuration: "~30 days",
    },
    taurus: { ... },
    // ... all 12 signs
  },
  moon: {
    aries: {
      oneLiner: "Emotions flash hot and fast. Feel them, then let them pass.",
      fullInsight: "When the Moon moves through Aries...",
      practicalTip: "Channel restless feelings into physical movement.",
      approxDuration: "~2.5 days",
    },
    // ...
  },
  mercury: { ... },
  venus: { ... },
  mars: { ... },
  jupiter: { ... },
  saturn: { ... },
  uranus: { ... },
  neptune: { ... },
  pluto: { ... },
}
```

Similarly for aspects:

```typescript
// data/aspect-meanings.ts
export const aspectMeanings: Record<string, AspectInsight> = {
  conjunction: {
    name: "Conjunction",
    symbol: "☌",
    nature: "fusion",
    generalMeaning: "Two forces merge into one. Their energies are inseparable today.",
  },
  trine: { name: "Trine", symbol: "△", nature: "harmony", ... },
  square: { name: "Square", symbol: "□", nature: "tension", ... },
  opposition: { name: "Opposition", symbol: "☍", nature: "polarity", ... },
  sextile: { name: "Sextile", symbol: "⚹", nature: "opportunity", ... },
}

// Specific planet-pair aspects (most impactful ones)
export const planetPairAspects: Record<string, Record<string, string>> = {
  "venus-pluto": {
    square: "Deep emotions surface in relationships today. Jealousy or intensity may arise — let feelings flow without forcing resolution.",
    trine: "Love deepens effortlessly. Vulnerability becomes a strength.",
    conjunction: "A transformative encounter is possible. Something — or someone — shifts your heart permanently.",
    // ...
  },
  "mars-saturn": {
    square: "Frustration builds when action meets resistance. Patience is your superpower today.",
    // ...
  },
  // ... key planet pairs
}
```

---

## Astronomy Engine Integration (lib/astronomy.ts)

```typescript
import * as Astronomy from 'astronomy-engine'

export interface PlanetPosition {
  name: string
  glyph: string
  eclipticLongitude: number    // 0-360°
  zodiacSign: string           // "aries" | "taurus" | etc.
  signGlyph: string            // ♈ ♉ etc.
  degreeInSign: number         // 0-30°
  isRetrograde: boolean
  riseTime: Date | null        // for user's location
  setTime: Date | null
  colour: string               // planet's display colour
}

export interface AspectData {
  planet1: string
  planet2: string
  type: string                 // "conjunction" | "trine" | "square" | etc.
  orb: number                  // how exact (0° = perfect)
  isApplying: boolean          // getting closer or separating
}

export interface MoonData {
  phase: string                // "Waxing Gibbous" etc.
  illumination: number         // 0-1
  zodiacSign: string
  degreeInSign: number
  age: number                  // days since new moon
  nextFullMoon: Date
  nextNewMoon: Date
}

const PLANETS = [
  { body: Astronomy.Body.Sun, name: 'Sun', glyph: '☉', colour: '#FFD700' },
  { body: Astronomy.Body.Moon, name: 'Moon', glyph: '☽', colour: '#C0C0C0' },
  { body: Astronomy.Body.Mercury, name: 'Mercury', glyph: '☿', colour: '#00E5FF' },
  { body: Astronomy.Body.Venus, name: 'Venus', glyph: '♀', colour: '#FF69B4' },
  { body: Astronomy.Body.Mars, name: 'Mars', glyph: '♂', colour: '#FF4444' },
  { body: Astronomy.Body.Jupiter, name: 'Jupiter', glyph: '♃', colour: '#FF8C00' },
  { body: Astronomy.Body.Saturn, name: 'Saturn', glyph: '♄', colour: '#778899' },
  { body: Astronomy.Body.Uranus, name: 'Uranus', glyph: '♅', colour: '#00CED1' },
  { body: Astronomy.Body.Neptune, name: 'Neptune', glyph: '♆', colour: '#4169E1' },
  { body: Astronomy.Body.Pluto, name: 'Pluto', glyph: '♇', colour: '#8B008B' },
]

export function getPlanetPositions(date: Date, lat: number, lng: number): PlanetPosition[] {
  const observer = new Astronomy.Observer(lat, lng, 0)
  
  return PLANETS.map(planet => {
    // Get ecliptic longitude
    const ecliptic = Astronomy.EclipticGeoMoon(date) // for Moon
    // For other bodies: convert equatorial → ecliptic
    // Astronomy.SunPosition(date) for Sun
    // Astronomy.EclipticLongitude(planet.body, date) for planets
    
    const longitude = Astronomy.EclipticLongitude(planet.body, date)
    const signIndex = Math.floor(longitude / 30)
    const degreeInSign = longitude % 30
    
    // Rise/set times using observer location
    let riseTime = null, setTime = null
    try {
      const rise = Astronomy.SearchRiseSet(planet.body, observer, +1, date, 1)
      const set = Astronomy.SearchRiseSet(planet.body, observer, -1, date, 1)
      riseTime = rise?.date ?? null
      setTime = set?.date ?? null
    } catch {}
    
    return {
      name: planet.name,
      glyph: planet.glyph,
      eclipticLongitude: longitude,
      zodiacSign: ZODIAC_SIGNS[signIndex].name,
      signGlyph: ZODIAC_SIGNS[signIndex].glyph,
      degreeInSign: Math.floor(degreeInSign),
      isRetrograde: false, // calculate from daily motion
      riseTime,
      setTime,
      colour: planet.colour,
    }
  })
}
```

**Important implementation notes for Claude Code:**

- `Astronomy.EclipticLongitude()` works for Mercury through Pluto
- For the **Sun**, use `Astronomy.SunPosition(date).elon` to get ecliptic longitude
- For the **Moon**, use `Astronomy.EclipticGeoMoon(date).lon` to get ecliptic longitude
- **Retrograde detection**: Calculate positions for date and date+1day. If longitude decreased, planet is retrograde
- **Aspects**: Compare all planet pairs. If |longitude1 - longitude2| is within orb of a known aspect angle (0°, 60°, 90°, 120°, 180°), record it. Standard orbs: Sun/Moon ±10°, others ±8° for conjunction/opposition, ±6° for trine/square, ±4° for sextile
- The Moon's ecliptic longitude changes ~13° per day, so update it every minute
- Other planets barely move in a day, so calculate once and cache

---

## Geolocation (lib/location.ts)

```typescript
export async function getUserLocation(): Promise<{ lat: number; lng: number; city: string }> {
  // 1. Try browser Geolocation API
  // 2. If denied/unavailable, use IP-based fallback:
  //    fetch('https://ipapi.co/json/') — free, no key, gives lat/lng/city
  // 3. If everything fails, default to London (51.5074, -0.1278)
  // 4. Allow manual city search via OpenStreetMap Nominatim:
  //    fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json`)
  //    Free, no API key, just needs User-Agent header
}
```

---

## Design System

### Colour Palette

```css
:root {
  --bg-deep:       #07070F;    /* Near-black with blue undertone */
  --bg-surface:    #0D0D1A;    /* Slightly lifted surface */
  --glass-bg:      rgba(255, 255, 255, 0.04);
  --glass-border:  rgba(255, 255, 255, 0.08);
  --glass-hover:   rgba(255, 255, 255, 0.06);
  --text-primary:  rgba(255, 255, 255, 0.90);
  --text-secondary: rgba(255, 255, 255, 0.55);
  --text-muted:    rgba(255, 255, 255, 0.30);
  --accent-purple: #8B5CF6;
  --accent-gold:   #FFD700;
  --fire:          #FF6B4A;
  --earth:         #4ADE80;
  --air:           #60A5FA;
  --water:         #A78BFA;
}
```

### Typography

Use **two fonts** (load via Google Fonts or next/font):

1. **Display/Headlines**: `Cormorant Garamond` (serif, elegant, mystical feel) — for headings, planet names, insight text
2. **Body/UI**: `DM Sans` (clean geometric sans) — for labels, degrees, times, UI elements

### Glassmorphism Standard (matching Lunata/Sonarus)

```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
}
```

### Animations

- **Wheel rotation**: `animation: spin 300s linear infinite` (very slow)
- **Planet pulse**: Each planet orb has a gentle breathing glow animation (2-4s cycle)
- **Card entrance**: Staggered fade-up with `framer-motion` (`y: 20 → 0, opacity: 0 → 1`)
- **Starfield**: Canvas with ~200 stars, subtle twinkle effect, parallax on scroll
- **Aspect lines**: Subtle pulse/glow animation on the connecting lines

---

## Yesterday / Tomorrow Navigation

Simple 3-button bar: `← Yesterday | Today | Tomorrow →`

When user taps Yesterday or Tomorrow:
1. Recalculate all planetary positions for that date (same time, same location)
2. Update the wheel smoothly (planets animate to new positions)
3. Update all insight cards
4. Show date label change

This is pure client-side — astronomy-engine handles any date. No API needed.

---

## SEO & Metadata

```typescript
export const metadata: Metadata = {
  title: 'Astrara — Live Cosmic Intelligence',
  description: 'See the sky right now. Understand how planetary positions affect your day. A live astrological guide by Harmonic Waves.',
  keywords: 'astrology, planetary positions, cosmic weather, daily horoscope, birth chart, zodiac',
  openGraph: {
    title: 'Astrara — What does the sky say right now?',
    description: 'Live planetary positions and cosmic weather. Your daily astrological guide.',
    url: 'https://astrara.app',
    siteName: 'Astrara',
    type: 'website',
  },
}
```

---

## Plausible Analytics

```html
<script defer data-domain="astrara.app" src="https://plausible.io/js/script.js"></script>
```

Track custom events:
- `planet-tap` (which planet)
- `sign-tap` (which sign)
- `aspect-tap` (which aspect)
- `day-nav` (yesterday/tomorrow)
- `location-detected` (city)
- `birth-chart-cta` (clicked personal chart CTA)

---

## Build Steps for Claude Code

1. **Wipe the project** — delete everything except `.git` folder
2. **Initialise fresh Next.js project**: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes`
3. **Install dependencies**: `npm install astronomy-engine framer-motion --yes`
4. **Set up the design system** — globals.css with CSS variables, fonts, glass utilities
5. **Build lib/astronomy.ts** — the wrapper around astronomy-engine that calculates all positions, aspects, moon data
6. **Build lib/zodiac.ts** — sign data, element mapping, glyph mapping
7. **Build lib/aspects.ts** — aspect calculation between planet pairs
8. **Build lib/location.ts** — geolocation with fallback
9. **Build data files** — planet-meanings.ts, sign-meanings.ts, aspect-meanings.ts, phase-meanings.ts. **Write ALL 120 planet-sign combinations** with full insight text in the mystical-but-clear voice. This is critical — the content IS the product.
10. **Build Starfield component** — animated canvas background
11. **Build AstroWheel component** — SVG-based interactive wheel with zodiac ring, planet markers, aspect lines
12. **Build CosmicWeather components** — moon card, planet cards, aspect highlights
13. **Build WheelTooltip / detail panels** — slide-up bottom sheet on mobile
14. **Build Header** — wordmark, location display, live time
15. **Build home page** — compose all components, wire up useAstroData hook
16. **Build yesterday/tomorrow navigation**
17. **Add Plausible analytics** with custom events
18. **PWA setup** — manifest.json, service worker basics
19. **Test mobile responsiveness** at 375px, 390px, 428px widths
20. **Test data accuracy** — verify planet positions against astro-seek.com for today's date
21. **Run `npm run build`** — fix any errors
22. **Commit**: `feat: Astrara v2 — live cosmic intelligence dashboard`

### CRITICAL: Content Quality

The insight text in data files is the single most important element. Every planet-sign combination MUST have:
- A genuinely poetic one-liner (not generic horoscope fluff)
- A substantive 2-3 paragraph insight that teaches something real about that planet in that sign
- A specific practical tip
- Written so a 10-year-old understands the practical meaning
- Written so a poet appreciates the language

Bad example: "Mercury in Pisces may affect your communication."
Good example: "Mercury drifts through Pisces at 4°. Your thoughts swim rather than march today — brilliant for poetry, music, and creative leaps, but terrible for spreadsheets. If you need to send an important email, read it twice before hitting send."

---

## What's NOT in Phase 1

- Personal birth chart / natal chart (Phase 2)
- 3D celestial sphere (Phase 3)
- Historical timeline slider beyond ±1 day (Phase 4)
- AI-generated insights (future)
- User accounts / saved data (future)
- Sound healing frequency recommendations per transit (future — will connect to ecosystem)

---

## Domain & Deployment

- Domain: astrara.app (already configured)
- Vercel project: astrara (already exists)
- DNS: Cloudflare (already configured)
- Just push to main → auto-deploys
