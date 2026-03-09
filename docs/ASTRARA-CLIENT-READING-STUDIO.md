# Astrara — /promo Page Rebuild: Client Reading Studio

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable. Use gigathink for this task.

---

## Vision

Completely rebuild the `/promo` route into a **Client Reading Studio** — a professional practitioner tool where you (the astrologer) can generate comprehensive, AI-powered astrological readings for individual clients during 1-to-1 sessions. The readings cover the current cosmic situation, upcoming months, and yearly forecasts — personalised to the client's zodiac sign or exact birth date.

This is your money-making tool. You sit with a client (in person or on a call), punch in their details, hit Generate, and Astrara produces a beautiful, comprehensive reading you can walk them through or send as a PDF/shareable report.

The page is hidden (not linked in navigation) and bilingual (EN/LT).

---

## ⚠️ CRITICAL RULES

1. **Read all existing source files first** — understand the current `/promo` route, API patterns, i18n system, and component structure.
2. **This REPLACES the existing /promo page entirely** — remove the old promo/social media content studio. The /promo route becomes the Client Reading Studio.
3. **Reuse the existing Anthropic API pattern** — there is already an API route calling Claude in this project (likely `/api/reading` or similar). Follow that same pattern for environment variables, error handling, and response parsing.
4. **Match Astrara design system** — void-black (#05050F), glassmorphism cards, silver/white structural, purple interactive UI only.
5. **Do NOT use framer-motion.**
6. **iOS Safari date/time inputs** — add `-webkit-appearance: none`, `appearance: none`, `min-width: 0` to all date/time inputs.
7. **Push to main** — `git push origin master:main` for Vercel deployment.

---

## Page Layout

```
┌─────────────────────────────────────────────────────────┐
│  ✦ ASTRARA READING STUDIO          🇬🇧 EN ▾            │
│  Professional Astrology Readings                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ── CLIENT DETAILS ──                                    │
│                                                          │
│  Name: [___________________] (optional, for report)      │
│                                                          │
│  Input Mode:  ( ) Zodiac Sign    ( ) Date of Birth       │
│                                                          │
│  [Zodiac selector / Date+Time+City inputs]               │
│                                                          │
│  ── READING SCOPE ──                                     │
│                                                          │
│  [✓] Current Situation (today's transits)                │
│  [✓] This Month Ahead                                   │
│  [✓] Next 3 Months Forecast                             │
│  [✓] This Year Overview (2026)                           │
│  [ ] Next Year Preview (2027)                            │
│  [ ] Relationship Compatibility (requires 2nd person)    │
│                                                          │
│  ── READING STYLE ──                                     │
│                                                          │
│  ( ) Practitioner (references chakras, elements, sound)  │
│  (•) Accessible (warm, clear, no jargon)                 │
│  ( ) Deep Mystical (poetic, symbolic, layered)           │
│                                                          │
│  Language: (•) English  ( ) Lithuanian                    │
│                                                          │
│  [ ✦ Generate Reading ]                                  │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ── GENERATED READING ──                                 │
│                                                          │
│  [Loading animation: "Reading the stars for [Name]..."]  │
│                                                          │
│  [Rendered reading sections appear here one by one]      │
│                                                          │
│  [ Copy All ]  [ Download PDF ]  [ New Reading ]         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Section 1: Client Details

### Input Mode Toggle

Two modes, toggled via radio buttons:

**Mode A — Zodiac Sign (quick):**
- Dropdown or tappable grid of all 12 zodiac signs with glyphs (♈♉♊ etc.)
- Uses the existing `ELEMENT_COLOURS` for sign styling
- Generates a Sun-sign-based reading (less personalised but fast)

**Mode B — Date of Birth (deep):**
- Date input (required): `input[type="date"]`
- Time input (optional): `input[type="time"]` — if provided, enables rising sign and house calculations
- City input (optional): text field with a note "For rising sign calculation" — if provided with time, use for ascendant calc
- When date is provided, calculate the client's natal Sun sign, Moon sign (using `astronomy-engine`), and if time+city are given, their rising sign
- Display calculated signs below the inputs: "☉ Sun in Scorpio · ☽ Moon in Cancer · ↑ Rising Gemini"

### Client Name
- Optional text input
- Used in the reading output header: "Reading for [Name]" and in the PDF export
- If empty, reading says "Your Cosmic Reading" instead

### Relationship Compatibility (optional, Phase 2 checkbox)
- When checked, shows a second set of inputs (name + zodiac/DOB) for a partner
- Adds a synastry section to the reading comparing both charts
- This can be a stub initially — show the UI but display "Coming soon" if not yet implemented

---

## Section 2: Reading Scope

Checkboxes that control which sections the AI generates. All checked by default except "Next Year" and "Relationship."

Each scope maps to a section in the AI prompt:

| Scope | What it covers |
|---|---|
| Current Situation | Today's exact transits and how they affect the client's sign/chart. What energies are active RIGHT NOW. |
| This Month Ahead | Key dates, transits entering/leaving their sign, lunations, retrogrades for the rest of this month. |
| Next 3 Months | Month-by-month forecast with specific dates and themes. What to expect, what to prepare for. |
| This Year Overview | The big themes of 2026 for their sign — major transits, eclipses, Jupiter/Saturn movements. |
| Next Year Preview | Early look at 2027 — what's shifting, what to plan for. |
| Relationship | Synastry reading comparing two charts (requires second person's data). |

---

## Section 3: Reading Style

Three voice presets that change the system prompt tone:

**Practitioner:** References chakras, elements, meridians, sound healing frequencies. Uses terminology a sound healer or yoga teacher would understand. Includes instrument and frequency recommendations per section.

**Accessible (default):** Warm, clear, friendly. Like a wise friend explaining the sky. No jargon. A 14-year-old should understand every sentence. This is the safest default for most clients.

**Deep Mystical:** Poetic, symbolic, layered. Rich metaphorical language. For clients who want the full esoteric experience. Still includes practical guidance but wrapped in evocative imagery.

---

## Section 4: Generate Reading — API Integration

### API Route

Create a new API route (or extend the existing one):

```
src/app/api/client-reading/route.ts
```

**Request body:**
```typescript
interface ReadingRequest {
  clientName?: string
  inputMode: 'zodiac' | 'birthdate'
  zodiacSign?: string                    // if inputMode === 'zodiac'
  birthDate?: string                     // ISO date string
  birthTime?: string                     // HH:mm
  birthCity?: string
  scope: {
    currentSituation: boolean
    thisMonth: boolean
    nextThreeMonths: boolean
    thisYear: boolean
    nextYear: boolean
    relationship: boolean
  }
  style: 'practitioner' | 'accessible' | 'mystical'
  language: 'en' | 'lt'
  // Calculated and injected server-side:
  currentTransits?: TransitData          // today's planetary positions
  natalPositions?: NatalData             // client's birth chart positions
  partnerData?: PartnerData              // if relationship scope is checked
}
```

**System prompt (construct dynamically based on style selection):**

```typescript
const systemPrompts = {
  accessible: `You are Astrara's cosmic intelligence — a warm, wise astrologer giving a personal reading.

VOICE: Like a trusted friend who happens to know the sky intimately. Clear, warm, grounded. 
A 14-year-old should understand everything. Use everyday language.
Never say "the universe wants you to" or "the stars align."
DO reference specific planets, signs, and dates — teach gently while you guide.

STRUCTURE your reading with clear section headers.
Each section should have:
- A clear opening that sets the theme
- Specific dates and transits mentioned by name
- Practical guidance: what to do, what to watch for, what to embrace
- A closing sentence that ties it together

Use British English spelling throughout.`,

  practitioner: `You are Astrara's cosmic intelligence — an experienced astrologer speaking to a client 
who works with energy, sound, and holistic practices.

VOICE: Professional but warm. Reference chakras, elements, meridians, and sound healing connections 
where relevant. Include frequency recommendations (solfeggio, planetary tones) for each major transit.
Mention which instruments would support each phase (singing bowls, gongs, tuning forks, monochord).

Each section should include:
- Astrological analysis with degrees and aspects named
- Energetic/elemental interpretation
- Sound healing recommendation (frequency + instrument + approach)
- Practical guidance for the client

Use British English spelling throughout.`,

  mystical: `You are Astrara's cosmic intelligence — an oracle who speaks in vivid imagery and deep symbolism.

VOICE: Poetic, evocative, layered with meaning. Use metaphor freely — but always land on something 
practical. The language should feel like reading a beautiful book. Each paragraph should be quotable.
Reference mythology, archetypes, and natural phenomena.

Still include specific dates and transits, but weave them into the narrative rather than listing them.
End each section with an actionable insight wrapped in poetic language.

Use British English spelling throughout.`
}
```

**Content prompt (constructed from scope checkboxes):**

```typescript
const buildContentPrompt = (req: ReadingRequest) => {
  const sections: string[] = []
  const today = new Date().toISOString().split('T')[0]
  
  // Include actual planetary position data calculated by astronomy-engine
  const transitContext = `
Current planetary positions (${today}):
${req.currentTransits?.map(t => 
  `${t.planet}: ${t.sign} ${t.degree}°${t.retrograde ? ' Rx' : ''}`
).join('\n')}

Moon phase: ${req.currentTransits?.moonPhase} (${req.currentTransits?.moonIllumination}%)
`

  const clientContext = req.inputMode === 'birthdate' 
    ? `Client's natal chart: Sun in ${req.natalPositions?.sunSign}, Moon in ${req.natalPositions?.moonSign}${req.natalPositions?.risingSign ? `, Rising ${req.natalPositions.risingSign}` : ''}, born ${req.birthDate}`
    : `Client's Sun sign: ${req.zodiacSign}`

  if (req.scope.currentSituation) {
    sections.push(`
## Current Situation — Right Now
Analyse how today's exact transits affect ${req.clientName || 'the client'} specifically.
What planetary energies are active for their sign/chart TODAY?
What should they be aware of? What opportunities or challenges are present?
Include the Moon's current sign and phase and what it means for them.
2-3 paragraphs.`)
  }

  if (req.scope.thisMonth) {
    sections.push(`
## This Month Ahead
Key dates and transits for the remainder of this month that affect their sign/chart.
When does the Moon transit their sign? Any significant aspects forming?
What's the theme of the next 2-3 weeks?
Mention specific dates where possible.
2-3 paragraphs.`)
  }

  if (req.scope.nextThreeMonths) {
    sections.push(`
## Next 3 Months — Month by Month

### [Month 1 Name]
Key transits, lunations, and themes. What to focus on, what to avoid. 1-2 paragraphs.

### [Month 2 Name] 
Key transits, lunations, and themes. 1-2 paragraphs.

### [Month 3 Name]
Key transits, lunations, and themes. 1-2 paragraphs.`)
  }

  if (req.scope.thisYear) {
    sections.push(`
## 2026 Overview — The Big Picture
The major astrological themes of 2026 for their sign/chart.
Where is Jupiter? Saturn? Any eclipses hitting their sign?
What is the overarching story of this year for them?
Career, relationships, health, growth — touch on the areas most activated.
3-4 paragraphs.`)
  }

  if (req.scope.nextYear) {
    sections.push(`
## 2027 Preview — What's Coming
Early look at the major shifts coming in 2027.
Any planets changing signs that affect them significantly?
What should they start preparing for?
2-3 paragraphs.`)
  }

  return `${transitContext}\n\n${clientContext}\n\nGenerate the following reading sections:\n${sections.join('\n')}`
}
```

**Language handling:**

If `language === 'lt'`, append to the system prompt:
```
IMPORTANT: Write the entire reading in Lithuanian. Use natural, fluent Lithuanian — not machine translation.
Use proper Lithuanian astrological terminology (e.g., Avinas for Aries, Jautis for Taurus, trigonalis for trine).
Maintain the same warmth and depth as the English version.
```

**API route implementation:**

```typescript
// src/app/api/client-reading/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
    
    const systemPrompt = systemPrompts[body.style] + 
      (body.language === 'lt' ? LITHUANIAN_INSTRUCTION : '')
    
    const contentPrompt = buildContentPrompt(body)
    
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: 'user', content: contentPrompt }
      ],
    })
    
    const reading = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
    
    return NextResponse.json({ reading })
  } catch (error) {
    console.error('Reading generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate reading' },
      { status: 500 }
    )
  }
}
```

**IMPORTANT:** The `ANTHROPIC_API_KEY` environment variable must be set for the **Production** environment in Vercel (not just Preview). Check this — it was a bug before.

---

## Section 5: Reading Output Display

Once the API returns, render the reading in a beautiful, scrollable container.

### Loading State
```
┌─────────────────────────────────────────┐
│                                          │
│         ✦ · · · ✦ · · · ✦               │
│                                          │
│   Reading the stars for Sarah...         │
│                                          │
│   Analysing current transits             │
│   ░░░░░░░░░░░░░░░░░░░░░░               │
│                                          │
└─────────────────────────────────────────┘
```

- Animated loading with a subtle star pulse
- Progress message that updates: "Analysing current transits..." → "Mapping the months ahead..." → "Composing your reading..."
- Show the client's name if provided

### Reading Display

Render the markdown response as styled HTML:

- `## Headers` → glassmorphism section cards with purple accent left border
- Body text → `text-[14px] text-white/70 leading-relaxed`
- Planet/sign references → highlighted with element colours inline (e.g., "Sun in ♓ Pisces" with Pisces in water-purple)
- Dates → slightly brighter (`text-white/90`) so they stand out
- Sound healing recommendations (practitioner mode) → separate tinted cards with frequency and instrument info
- Between sections → subtle `✦` divider

### Action Buttons (below the reading)

```
[ Copy All Text ]  [ Download as PDF ]  [ New Reading ]
```

**Copy All:** Copies the plain text reading to clipboard (strip markdown). Show "Copied!" feedback.

**Download as PDF:** Generate a clean PDF with:
- Astrara branding header (logo + "Astrara Reading Studio")
- Client name and date
- Reading scope summary (what was included)
- Full reading text with section headers
- Footer: "Generated by Astrara · astrara.app · Part of Harmonic Waves"
- Use the existing PDF generation pattern if one exists, otherwise use `html2canvas` + `jsPDF` or `@react-pdf/renderer`

**New Reading:** Scrolls back to the top and clears the reading output (but keeps the client details filled in for quick iteration).

---

## Transit Data Calculation

The API route needs actual planetary position data to feed the AI. Calculate this server-side (or pass from client-side where `astronomy-engine` is already available):

```typescript
// Calculate current transits using astronomy-engine
import * as Astronomy from 'astronomy-engine'

function getCurrentTransits(date: Date) {
  const bodies = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ]
  
  return bodies.map(body => {
    const ecliptic = Astronomy.EclipticGeoMoon(date) // for Moon
    // or Astronomy.Ecliptic(body, date) for planets
    const longitude = ecliptic.elon
    const signIndex = Math.floor(longitude / 30)
    const degree = longitude % 30
    const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo',
                   'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
    
    return {
      planet: body,
      sign: signs[signIndex],
      degree: Math.round(degree * 10) / 10,
      longitude,
      retrograde: isRetrograde(body, date), // check elongation change
    }
  })
}
```

For natal chart calculations (when birth date is provided), calculate the same for the birth date/time. If birth time and city are provided, calculate the Ascendant (rising sign) using local sidereal time.

---

## Bilingual UI

All UI labels, buttons, placeholders, and status messages must be available in both EN and LT. Use the existing i18n system.

Key translations:

| English | Lithuanian |
|---|---|
| Reading Studio | Skaitymų Studija |
| Client Details | Kliento Duomenys |
| Zodiac Sign | Zodiako Ženklas |
| Date of Birth | Gimimo Data |
| Time of Birth | Gimimo Laikas |
| City of Birth | Gimimo Miestas |
| Reading Scope | Skaitymo Apimtis |
| Current Situation | Dabartinė Situacija |
| This Month Ahead | Šis Mėnuo |
| Next 3 Months | Ateinantys 3 Mėnesiai |
| This Year Overview | 2026 Metų Apžvalga |
| Next Year Preview | 2027 Metų Peržiūra |
| Relationship Compatibility | Santykių Suderinamumas |
| Reading Style | Skaitymo Stilius |
| Practitioner | Praktikui |
| Accessible | Prieinamas |
| Deep Mystical | Gilus Mistinis |
| Generate Reading | Generuoti Skaitymą |
| Reading the stars for... | Skaitome žvaigždes... |
| Copy All Text | Kopijuoti Visą Tekstą |
| Download as PDF | Atsisiųsti PDF |
| New Reading | Naujas Skaitymas |
| Coming soon | Greitai |
| For rising sign calculation | Kylančio ženklo skaičiavimui |
| Your Cosmic Reading | Jūsų Kosminis Skaitymas |
| Reading for | Skaitymas |

---

## Reading History (localStorage)

Save the last 10 generated readings to `localStorage` under key `astrara_reading_history`:

```typescript
interface ReadingHistoryEntry {
  id: string                    // nanoid or timestamp
  timestamp: string             // ISO date
  clientName?: string
  inputMode: 'zodiac' | 'birthdate'
  zodiacSign?: string
  birthDate?: string
  scope: string[]               // which sections were generated
  style: string
  language: string
  readingText: string           // the full output
}
```

Add a small "History" section below the main form (collapsed by default):

```
── Recent Readings ──  [▾ expand]

• Sarah — Scorpio — 9 Mar 2026, 14:32
• Jonas — 1985-06-15 — 8 Mar 2026, 10:15
• Quick — Leo — 7 Mar 2026, 19:45

[Clear History]
```

Tapping a history entry loads the reading output (no re-generation needed) and scrolls down to the display section.

---

## File Structure

```
src/
├── app/
│   ├── promo/
│   │   └── page.tsx                    ← REBUILT: Client Reading Studio
│   └── api/
│       └── client-reading/
│           └── route.ts                ← NEW: AI reading generation endpoint
├── components/
│   ├── ReadingStudio/
│   │   ├── ClientDetailsForm.tsx       ← NEW: input form with zodiac/DOB modes
│   │   ├── ScopeSelector.tsx           ← NEW: checkboxes for reading sections
│   │   ├── StyleSelector.tsx           ← NEW: voice/style radio buttons
│   │   ├── ReadingOutput.tsx           ← NEW: rendered reading display
│   │   ├── ReadingHistory.tsx          ← NEW: localStorage history panel
│   │   ├── ZodiacGrid.tsx              ← NEW: tappable 12-sign grid
│   │   └── PdfExport.tsx              ← NEW: PDF generation utility
│   └── ... (existing components untouched)
└── i18n/
    └── ... (add new keys to existing translation files)
```

---

## Quality Bar

Before committing, verify:
- [ ] `/promo` loads the new Reading Studio (old social media promo is gone)
- [ ] Zodiac sign selection works — all 12 signs tappable
- [ ] Date of birth input works — calculates Sun/Moon sign from DOB
- [ ] Time + City input shows rising sign calculation
- [ ] iOS Safari date/time inputs render correctly (no overflow)
- [ ] All scope checkboxes toggle correctly
- [ ] All style radio buttons work
- [ ] Language toggle switches all UI labels EN ↔ LT
- [ ] Generate Reading calls the API and shows loading state
- [ ] Reading renders with proper formatting (headers, sections, highlights)
- [ ] Lithuanian reading is generated when LT is selected
- [ ] Copy All copies plain text to clipboard
- [ ] PDF download generates a clean document
- [ ] New Reading clears output and scrolls to top
- [ ] Reading history saves and loads correctly
- [ ] Mobile layout is clean (test at 375px)
- [ ] No regressions on main app (`/` route)
- [ ] `npm run build` passes
- [ ] Pushed to main branch

---

## Final Build Checklist

1. Read all existing source files (especially current /promo and existing API routes)
2. Remove old /promo social media content studio entirely
3. Build the Client Details form with dual input modes
4. Build the Scope and Style selectors
5. Create the `/api/client-reading` route with system prompts and transit data
6. Build the Reading Output display with markdown rendering
7. Build the Copy and PDF export functionality
8. Build the Reading History panel
9. Add all i18n translations (EN + LT)
10. Wire everything together
11. Test all functionality from Quality Bar
12. Run `npm run build`
13. Push to **main** branch
14. Commit: `feat: /promo rebuilt as Client Reading Studio — AI-powered 1-to-1 astrology readings`
