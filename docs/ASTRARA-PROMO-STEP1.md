# ASTRARA — /promo Page Step 1: Structure, Cosmic Weather, Impact Scoring

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Overview

Create a hidden `/promo` route — a private content studio page for generating daily social media content. This page is NOT linked from any navigation or UI. It's only accessible by typing the URL directly.

This page uses the SAME data sources already in the app (astronomy-engine, NOAA Kp, NOAA X-ray flux, moon phase) but presents them in a content-creation format.

---

## 1. Create the Route

Create `src/app/promo/page.tsx`

The page should NOT appear in any sitemap, robots.txt, or navigation. Add `noindex` meta tag:

```tsx
export const metadata = {
  robots: 'noindex, nofollow',
}
```

---

## 2. Page Layout & Styling

Dark background matching the main app aesthetic. Clean, readable layout optimised for desktop (this is a work tool, not a public-facing page). But must also work on mobile.

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ASTRARA · Content Studio                               │
│  [Date Picker: today's date]                            │
│                                                         │
│  ═══════════════════════════════════════════════════════ │
│                                                         │
│  TODAY'S COSMIC WEATHER                    Impact: 7/10 │
│  ● ● ● ● ● ● ● ○ ○ ○                        [Amber]   │
│                                                         │
│  [Summary paragraph combining all data]                 │
│                                                         │
│  Planetary Positions:                                   │
│  ☉ Sun in Pisces 15° · ☽ Moon in Libra 10° · ...      │
│                                                         │
│  Moon Phase: Waning Gibbous (95%)                       │
│  Kp Index: 2 (Quiet) · Solar: B2.1 (Low)              │
│                                                         │
│  ═══════════════════════════════════════════════════════ │
│                                                         │
│  ZODIAC IMPACT RANKINGS                                 │
│                                                         │
│  1. ♓ Pisces ████████░░ 8/10  [intense]               │
│  2. ♎ Libra  ███████░░░ 7/10  [active]                │
│  3. ♈ Aries  ██████░░░░ 6/10  [active]                │
│  ...                                                    │
│  12. ♌ Leo   ██░░░░░░░░ 2/10  [quiet]                 │
│                                                         │
│  ═══════════════════════════════════════════════════════ │
│                                                         │
│  ZODIAC READING                                         │
│  [Select: ♓ Pisces ▼]                                  │
│                                                         │
│  [Generated horoscope content here — Step 2]            │
│                                                         │
│  ═══════════════════════════════════════════════════════ │
│                                                         │
│  SOCIAL CAPTIONS                                        │
│                                                         │
│  TikTok Short:     [copy button]                        │
│  "..."                                                  │
│                                                         │
│  Instagram Long:   [copy button]                        │
│  "..."                                                  │
│                                                         │
│  Hashtags:         [copy button]                        │
│  #...                                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Date Picker

At the top of the page, a date picker to view any date's data:

```tsx
<input
  type="date"
  value={formatDateForInput(selectedDate)}
  onChange={(e) => {
    const d = new Date(e.target.value + 'T12:00:00')
    if (!isNaN(d.getTime())) setSelectedDate(d)
  }}
  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 
             text-white text-sm appearance-none"
  style={{ colorScheme: 'dark', WebkitAppearance: 'none', fontSize: '16px' }}
/>
```

Default to today's date on page load.

---

## 4. Cosmic Weather Summary

Calculate and display all current data for the selected date:

### Planetary Positions

Use `astronomy-engine` (same as the wheel) to calculate all planet positions:

```typescript
import * as Astronomy from 'astronomy-engine'

interface PlanetPosition {
  name: string
  glyph: string
  sign: string
  signGlyph: string
  degree: number
  isRetrograde: boolean
}

function calculateAllPositions(date: Date): PlanetPosition[] {
  const bodies = [
    { name: 'Sun', glyph: '☉', body: Astronomy.Body.Sun },
    { name: 'Moon', glyph: '☽', body: Astronomy.Body.Moon },
    { name: 'Mercury', glyph: '☿', body: Astronomy.Body.Mercury },
    { name: 'Venus', glyph: '♀', body: Astronomy.Body.Venus },
    { name: 'Mars', glyph: '♂', body: Astronomy.Body.Mars },
    { name: 'Jupiter', glyph: '♃', body: Astronomy.Body.Jupiter },
    { name: 'Saturn', glyph: '♄', body: Astronomy.Body.Saturn },
    { name: 'Uranus', glyph: '♅', body: Astronomy.Body.Uranus },
    { name: 'Neptune', glyph: '♆', body: Astronomy.Body.Neptune },
    { name: 'Pluto', glyph: '♇', body: Astronomy.Body.Pluto },
  ]

  return bodies.map(({ name, glyph, body }) => {
    const equ = Astronomy.Equator(body, date, null, true, true)
    // Convert to ecliptic longitude
    const ecl = Astronomy.Ecliptic(equ.vec)
    const longitude = ecl.elon  // 0–360 degrees

    const signIndex = Math.floor(longitude / 30)
    const degree = Math.floor(longitude % 30)
    const signs = [
      { name: 'Aries', glyph: '♈' },
      { name: 'Taurus', glyph: '♉' },
      { name: 'Gemini', glyph: '♊' },
      { name: 'Cancer', glyph: '♋' },
      { name: 'Leo', glyph: '♌' },
      { name: 'Virgo', glyph: '♍' },
      { name: 'Libra', glyph: '♎' },
      { name: 'Scorpio', glyph: '♏' },
      { name: 'Sagittarius', glyph: '♐' },
      { name: 'Capricorn', glyph: '♑' },
      { name: 'Aquarius', glyph: '♒' },
      { name: 'Pisces', glyph: '♓' },
    ]

    return {
      name,
      glyph,
      sign: signs[signIndex].name,
      signGlyph: signs[signIndex].glyph,
      degree,
      longitude,
      isRetrograde: false, // TODO: detect retrograde from elongation
    }
  })
}
```

### Moon Phase

Calculate moon phase for the selected date:

```typescript
const moonPhase = Astronomy.MoonPhase(date)
// Returns angle: 0=new, 90=first quarter, 180=full, 270=last quarter

function getMoonPhaseName(angle: number): { name: string; illumination: number } {
  const illum = Astronomy.Illumination(Astronomy.Body.Moon, date)
  
  if (angle < 22.5) return { name: 'New Moon', illumination: illum.phase_fraction * 100 }
  if (angle < 67.5) return { name: 'Waxing Crescent', illumination: illum.phase_fraction * 100 }
  if (angle < 112.5) return { name: 'First Quarter', illumination: illum.phase_fraction * 100 }
  if (angle < 157.5) return { name: 'Waxing Gibbous', illumination: illum.phase_fraction * 100 }
  if (angle < 202.5) return { name: 'Full Moon', illumination: illum.phase_fraction * 100 }
  if (angle < 247.5) return { name: 'Waning Gibbous', illumination: illum.phase_fraction * 100 }
  if (angle < 292.5) return { name: 'Last Quarter', illumination: illum.phase_fraction * 100 }
  if (angle < 337.5) return { name: 'Waning Crescent', illumination: illum.phase_fraction * 100 }
  return { name: 'New Moon', illumination: illum.phase_fraction * 100 }
}
```

### NOAA Data

Fetch Kp index and solar X-ray flux using the same endpoints as the main app:
- Kp: `https://services.swpc.noaa.gov/json/planetary_k_index_1m.json`
- X-ray: `https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json`

Note: NOAA data is only available for recent/current dates. For past dates beyond NOAA availability, show "Data unavailable" for Kp and solar activity.

---

## 5. Zodiac Impact Scoring System

Calculate an impact score (1–10) for EACH of the 12 zodiac signs for the selected date.

```typescript
interface ZodiacImpact {
  sign: string
  glyph: string
  score: number          // 1–10
  level: 'quiet' | 'active' | 'intense'
  colour: string         // green → amber → red
  factors: string[]      // list of contributing factors
}

function calculateZodiacImpacts(
  positions: PlanetPosition[],
  moonPhase: { name: string; angle: number },
  kpIndex: number,
  solarClass: string
): ZodiacImpact[] {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]
  const glyphs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

  return signs.map((sign, signIndex) => {
    let score = 0
    const factors: string[] = []
    const signStart = signIndex * 30
    const signEnd = signStart + 30
    const oppositeStart = ((signIndex + 6) % 12) * 30
    const squareStart1 = ((signIndex + 3) % 12) * 30
    const squareStart2 = ((signIndex + 9) % 12) * 30

    for (const planet of positions) {
      const pLong = planet.longitude

      // Planet IN this sign
      if (pLong >= signStart && pLong < signEnd) {
        if (planet.name === 'Sun') { score += 3; factors.push(`Sun in ${sign}`) }
        else if (planet.name === 'Moon') { score += 2; factors.push(`Moon in ${sign}`) }
        else { score += 1; factors.push(`${planet.name} in ${sign}`) }
      }

      // Planet in OPPOSITION (180°)
      if (pLong >= oppositeStart && pLong < oppositeStart + 30) {
        if (planet.name === 'Sun' || planet.name === 'Moon') {
          score += 2; factors.push(`${planet.name} opposing ${sign}`)
        } else {
          score += 1; factors.push(`${planet.name} opposing ${sign}`)
        }
      }

      // Planet in SQUARE (90°)
      if ((pLong >= squareStart1 && pLong < squareStart1 + 30) ||
          (pLong >= squareStart2 && pLong < squareStart2 + 30)) {
        score += 0.5
      }
    }

    // Moon phase bonus
    const moonSign = positions.find(p => p.name === 'Moon')?.sign
    if (moonPhase.name === 'Full Moon' && moonSign === sign) { score += 3; factors.push('Full Moon in sign') }
    if (moonPhase.name === 'New Moon' && moonSign === sign) { score += 2; factors.push('New Moon in sign') }

    // Geomagnetic bonus (affects everyone equally)
    if (kpIndex >= 5) { score += 1; factors.push(`Geomagnetic storm (Kp ${kpIndex})`) }

    // Solar flare bonus
    if (solarClass.startsWith('M') || solarClass.startsWith('X')) {
      score += 1; factors.push(`Solar flare: ${solarClass}`)
    }

    // Clamp to 1–10
    score = Math.max(1, Math.min(10, Math.round(score)))

    // Colour and level
    let colour: string
    let level: 'quiet' | 'active' | 'intense'
    if (score <= 3) { colour = '#22c55e'; level = 'quiet' }
    else if (score <= 6) { colour = '#f59e0b'; level = 'active' }
    else { colour = '#ef4444'; level = 'intense' }

    return { sign, glyph: glyphs[signIndex], score, level, colour, factors }
  })
  .sort((a, b) => b.score - a.score)  // Sort highest impact first
}
```

### Display

Show all 12 signs in a sorted list with visual impact bars:

```tsx
{impacts.map((impact, i) => (
  <div 
    key={impact.sign}
    className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
    onClick={() => setSelectedSign(impact.sign)}
  >
    <span className="text-white/40 text-xs w-5">{i + 1}.</span>
    <span className="text-lg w-7">{impact.glyph}</span>
    <span className="text-white/80 text-sm w-24">{impact.sign}</span>
    
    {/* Impact bar */}
    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500"
        style={{ 
          width: `${impact.score * 10}%`,
          backgroundColor: impact.colour,
        }}
      />
    </div>
    
    <span 
      className="text-sm font-mono w-10 text-right"
      style={{ color: impact.colour }}
    >
      {impact.score}/10
    </span>
    
    <span 
      className="text-xs px-2 py-0.5 rounded-full"
      style={{ 
        backgroundColor: `${impact.colour}15`,
        color: impact.colour,
      }}
    >
      {impact.level}
    </span>
  </div>
))}
```

Clicking a sign in the ranking list selects it for the Zodiac Reading section below.

---

## 6. Zodiac Sign Selector

A dropdown to select which sign to generate content for. Pre-selects the highest-impact sign by default:

```tsx
<select
  value={selectedSign}
  onChange={(e) => setSelectedSign(e.target.value)}
  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5
             text-white text-sm appearance-none cursor-pointer"
  style={{ colorScheme: 'dark' }}
>
  {impacts.map(impact => (
    <option key={impact.sign} value={impact.sign}>
      {impact.glyph} {impact.sign} — {impact.score}/10 ({impact.level})
    </option>
  ))}
</select>
```

Below the selector, show the selected sign's impact factors:

```tsx
<div className="mt-3 flex flex-wrap gap-2">
  {selectedImpact.factors.map((factor, i) => (
    <span 
      key={i}
      className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/60"
    >
      {factor}
    </span>
  ))}
</div>
```

Below this, a placeholder area for the Claude API-generated horoscope (Step 2):

```tsx
<div className="mt-6 p-6 rounded-xl bg-white/3 border border-white/5 min-h-[200px]">
  <p className="text-white/30 text-sm italic">
    Horoscope generation will be added in the next update.
  </p>
</div>
```

---

## 7. Social Media Captions

Generate social media captions based on the selected date and sign. For now (before Claude API integration in Step 2), use template-based captions:

```typescript
function generateCaptions(
  sign: string,
  glyph: string,
  positions: PlanetPosition[],
  moonPhase: { name: string; illumination: number },
  impact: ZodiacImpact,
  date: Date
): { tiktokShort: string; instagramLong: string; hashtags: string } {

  const sunSign = positions.find(p => p.name === 'Sun')
  const moonSign = positions.find(p => p.name === 'Moon')
  const planetsInSign = positions.filter(p => p.sign === sign)

  const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const tiktokShort = `${glyph} ${sign} — ${dateStr}\n\n` +
    `Today's impact: ${impact.score}/10 ${impact.level === 'intense' ? '🔥' : impact.level === 'active' ? '✨' : '🌿'}\n\n` +
    `${sunSign?.glyph} Sun in ${sunSign?.sign} ${sunSign?.degree}°\n` +
    `${moonSign?.glyph} Moon in ${moonSign?.sign} ${moonSign?.degree}° — ${moonPhase.name}\n\n` +
    (planetsInSign.length > 0
      ? `${planetsInSign.map(p => p.name).join(' & ')} visiting ${sign} today.`
      : `No planets visiting ${sign} right now — a day of inner reflection.`) +
    `\n\n#${sign.toLowerCase()} #astrology #cosmicweather`

  const instagramLong = `${glyph} ${sign.toUpperCase()} · ${dateStr}\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    `Cosmic Impact: ${'●'.repeat(impact.score)}${'○'.repeat(10 - impact.score)} ${impact.score}/10\n\n` +
    `Today's sky:\n` +
    positions.map(p => `${p.glyph} ${p.name} in ${p.sign} ${p.degree}°`).join('\n') +
    `\n\n` +
    `${moonPhase.name} · ${moonPhase.illumination.toFixed(0)}% illumination\n\n` +
    `What this means for ${sign}:\n` +
    impact.factors.map(f => `→ ${f}`).join('\n') +
    `\n\n━━━━━━━━━━━━━━━━━━━\n` +
    `Real planetary positions calculated from NASA JPL data.\n` +
    `Explore your own cosmic portrait at astrara.app`

  const hashtags = `#${sign.toLowerCase()} #horoscope #astrology #cosmicweather #zodiac ` +
    `#${sign.toLowerCase()}horoscope #todayshoroscope #planetaryalignment ` +
    `#${moonPhase.name.toLowerCase().replace(/\s+/g, '')} #soundhealing ` +
    `#astrara #cosmicportrait #harmonicwaves ` +
    `#${sunSign?.sign.toLowerCase()}season`

  return { tiktokShort, instagramLong, hashtags }
}
```

### Display with Copy Buttons

```tsx
function CaptionBlock({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-4 rounded-xl bg-white/3 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/40 text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10
                     text-white/50 hover:text-white/80 hover:bg-white/10 
                     transition-all duration-200 active:scale-95"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <pre className="text-white/70 text-sm whitespace-pre-wrap font-sans leading-relaxed">
        {content}
      </pre>
    </div>
  )
}
```

---

## 8. Overall Cosmic Impact Score

Calculate an OVERALL day impact score (not per-sign) for the cosmic weather header:

```typescript
function calculateOverallImpact(
  positions: PlanetPosition[],
  moonPhase: { name: string; angle: number },
  kpIndex: number,
  solarClass: string
): { score: number; colour: string; level: string } {
  let score = 3  // baseline

  // Count planets in same sign (conjunction clusters)
  const signCounts: Record<string, number> = {}
  positions.forEach(p => {
    signCounts[p.sign] = (signCounts[p.sign] || 0) + 1
  })
  const maxCluster = Math.max(...Object.values(signCounts))
  if (maxCluster >= 4) { score += 3 }  // stellium
  else if (maxCluster >= 3) { score += 2 }

  // Full/New Moon
  if (moonPhase.name === 'Full Moon') score += 2
  if (moonPhase.name === 'New Moon') score += 1.5

  // Geomagnetic
  if (kpIndex >= 7) score += 2
  else if (kpIndex >= 5) score += 1

  // Solar
  if (solarClass.startsWith('X')) score += 2
  else if (solarClass.startsWith('M')) score += 1

  score = Math.max(1, Math.min(10, Math.round(score)))

  let colour: string, level: string
  if (score <= 3) { colour = '#22c55e'; level = 'Quiet cosmic day' }
  else if (score <= 6) { colour = '#f59e0b'; level = 'Active cosmic energy' }
  else { colour = '#ef4444'; level = 'Intense cosmic weather' }

  return { score, colour, level }
}
```

Display with visual dots:

```tsx
<div className="flex items-center gap-3">
  <div className="flex gap-1">
    {Array.from({ length: 10 }, (_, i) => (
      <div
        key={i}
        className="w-2.5 h-2.5 rounded-full transition-colors"
        style={{
          backgroundColor: i < overallImpact.score ? overallImpact.colour : 'rgba(255,255,255,0.08)',
        }}
      />
    ))}
  </div>
  <span style={{ color: overallImpact.colour }} className="text-sm font-medium">
    {overallImpact.score}/10
  </span>
  <span className="text-white/40 text-sm">{overallImpact.level}</span>
</div>
```

---

## Do NOT

- Do NOT link the /promo page from any public navigation, footer, or header
- Do NOT add the route to any sitemap
- Do NOT change any existing app pages, components, or functionality
- Do NOT add Claude API integration yet (that's Step 2)
- Do NOT add authentication (it's hidden by URL only, like /sell)

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: navigate to /promo → page loads with dark cosmic styling
3. Test: date picker defaults to today, changing date recalculates everything
4. Test: cosmic weather section shows all planet positions, moon phase, Kp, solar
5. Test: overall impact score displays with coloured dots
6. Test: zodiac rankings show all 12 signs sorted by impact score
7. Test: clicking a sign in the rankings selects it
8. Test: sign selector dropdown shows all signs with scores
9. Test: social captions generate based on selected sign and date
10. Test: copy buttons work for all three caption types
11. Test: page is NOT accessible from any main app navigation
12. Test: change date to tomorrow → all scores and positions recalculate
13. Commit: `feat: /promo content studio — cosmic weather, impact scoring, social captions`
14. Push to `main`
