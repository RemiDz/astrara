# ASTRARA — /promo Step 2: Claude API Horoscope Generation

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Overview

Wire up the Claude API to generate unique, contextual horoscope readings on the /promo page. When the user selects a zodiac sign, the page sends the full planetary configuration to Claude and receives a personalised daily reading.

Read all current /promo page source files before making changes.

---

## 1. Environment Variable

The API key is stored as an environment variable, NOT hardcoded in source code.

Create or update `.env.local`:

```
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
```

Also add to `.env.example` (without the real key):

```
ANTHROPIC_API_KEY=your-anthropic-api-key-here
```

The key must also be added to Vercel environment variables for production deployment.

---

## 2. Create API Route

Create a Next.js API route to proxy requests to the Anthropic API. The API key must NEVER be exposed to the client — all calls go through this server-side route.

Create `src/app/api/horoscope/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { sign, positions, moonPhase, kpIndex, solarClass, impactScore, impactFactors, date } = await req.json()

    if (!sign || !positions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemPrompt = `You are Astrara's cosmic oracle — a warm, insightful astrologer who combines real astronomical data with astrological wisdom. You write horoscopes that are specific, actionable, and grounded in the actual planetary positions provided. Never vague fortune-cookie language. Always reference the specific planets and signs involved.

Your tone is: wise but approachable, poetic but practical, mystical but never woo-woo. Think of a thoughtful friend who happens to be an expert astrologer.

You write for social media — keep paragraphs short, use line breaks for readability. Every reading should feel unique to THIS specific day and THIS specific planetary configuration.

You are also a sound healing expert. Where relevant, mention how the current cosmic energy relates to sound healing practice — which frequencies, instruments, or techniques align with today's energy. Keep these mentions natural and brief, not forced.`

    const userPrompt = `Generate a daily horoscope for ${sign} for ${date}.

CURRENT PLANETARY POSITIONS (real astronomical data):
${positions.map((p: any) => `${p.glyph} ${p.name} in ${p.sign} at ${p.degree}°${p.isRetrograde ? ' (retrograde)' : ''}`).join('\n')}

MOON PHASE: ${moonPhase.name} (${moonPhase.illumination.toFixed(0)}% illumination)

EARTH DATA:
- Kp Index: ${kpIndex} (geomagnetic activity)
- Solar Activity: ${solarClass}

IMPACT SCORE FOR ${sign.toUpperCase()}: ${impactScore}/10
IMPACT FACTORS: ${impactFactors.join(', ')}

Generate the following sections. Use clear section headers. Keep the total response under 400 words:

1. TODAY'S ENERGY (2-3 sentences — the headline feeling for ${sign} today)

2. WHAT THE PLANETS ARE SAYING (3-4 short paragraphs — interpret the specific planetary positions and what they mean for ${sign}. Reference actual planets and degrees. Mention which planets are transiting through ${sign}, opposing it, or squaring it.)

3. PRACTICAL GUIDANCE (2-3 bullet points — specific, actionable advice for the day. Not generic — tied to the actual planetary configuration.)

4. SOUND HEALING NOTE (1-2 sentences — what frequency, instrument, or practice aligns with today's energy for ${sign}. Reference specific Hz values or instruments where appropriate.)

5. TODAY IN ONE WORD (a single evocative word that captures the day's energy for ${sign})`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json({ error: 'Failed to generate horoscope' }, { status: 500 })
    }

    const data = await response.json()
    const horoscope = data.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n')

    return NextResponse.json({ horoscope })

  } catch (error) {
    console.error('Horoscope generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 3. Client-Side: Call the API from /promo Page

In the /promo page component, add a function to generate the horoscope when a sign is selected:

```typescript
const [horoscope, setHoroscope] = useState<string>('')
const [isGenerating, setIsGenerating] = useState(false)
const [generationError, setGenerationError] = useState<string | null>(null)

async function generateHoroscope(sign: string) {
  setIsGenerating(true)
  setGenerationError(null)
  setHoroscope('')

  try {
    const selectedImpact = impacts.find(i => i.sign === sign)

    const response = await fetch('/api/horoscope', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sign,
        positions: planetPositions,
        moonPhase,
        kpIndex: kpData?.kp ?? 0,
        solarClass: solarData?.flareClass ?? 'B1.0',
        impactScore: selectedImpact?.score ?? 5,
        impactFactors: selectedImpact?.factors ?? [],
        date: selectedDate.toLocaleDateString('en-GB', { 
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
        }),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate horoscope')
    }

    const data = await response.json()
    setHoroscope(data.horoscope)

  } catch (err) {
    setGenerationError('Failed to generate horoscope. Check your API key.')
    console.error(err)
  } finally {
    setIsGenerating(false)
  }
}
```

### Trigger Generation

Generate automatically when a sign is selected OR when the date changes while a sign is selected:

```typescript
// When sign changes
useEffect(() => {
  if (selectedSign) {
    generateHoroscope(selectedSign)
  }
}, [selectedSign])

// When date changes and a sign is already selected
useEffect(() => {
  if (selectedSign) {
    generateHoroscope(selectedSign)
  }
}, [selectedDate])
```

Also add a "Regenerate" button to get a fresh reading:

```tsx
<button
  onClick={() => generateHoroscope(selectedSign)}
  disabled={isGenerating}
  className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10
             text-white/50 hover:text-white/80 hover:bg-white/10 
             transition-all duration-200 active:scale-95
             disabled:opacity-50"
>
  {isGenerating ? 'Generating...' : '↻ Regenerate'}
</button>
```

---

## 4. Display the Horoscope

Replace the placeholder in the Zodiac Reading section:

```tsx
<div className="mt-6 p-6 rounded-xl bg-white/3 border border-white/5 min-h-[200px]">
  {/* Header with sign name and regenerate button */}
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-white/80 text-lg font-medium">
      {selectedImpact?.glyph} {selectedSign} · Daily Reading
    </h3>
    <button
      onClick={() => generateHoroscope(selectedSign)}
      disabled={isGenerating}
      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10
                 text-white/50 hover:text-white/80 hover:bg-white/10 
                 transition-all duration-200 active:scale-95
                 disabled:opacity-50"
    >
      {isGenerating ? 'Generating...' : '↻ Regenerate'}
    </button>
  </div>

  {/* Loading state */}
  {isGenerating && (
    <div className="flex items-center gap-3 text-white/40">
      <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      <span className="text-sm">Reading the stars for {selectedSign}...</span>
    </div>
  )}

  {/* Error state */}
  {generationError && (
    <div className="text-red-400/80 text-sm">
      {generationError}
    </div>
  )}

  {/* Horoscope content */}
  {horoscope && !isGenerating && (
    <div className="space-y-1">
      <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
        {horoscope}
      </div>

      {/* Copy horoscope button */}
      <div className="pt-4">
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(horoscope)
          }}
          className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10
                     text-white/50 hover:text-white/80 hover:bg-white/10 
                     transition-all duration-200 active:scale-95"
        >
          Copy Reading
        </button>
      </div>
    </div>
  )}
</div>
```

---

## 5. Update Social Captions to Include Horoscope

When a horoscope has been generated, update the social media captions to incorporate key lines from it. Add to the TikTok and Instagram caption generators:

```typescript
function generateCaptions(/* ...existing params... */, horoscope?: string) {
  // If horoscope exists, extract the "TODAY IN ONE WORD" line
  const oneWordMatch = horoscope?.match(/TODAY IN ONE WORD[:\s]*(.+)/i)
  const oneWord = oneWordMatch ? oneWordMatch[1].trim() : ''

  // If horoscope exists, extract the "TODAY'S ENERGY" section (first paragraph after the header)
  const energyMatch = horoscope?.match(/TODAY'S ENERGY[:\s]*\n?([\s\S]*?)(?=\n\n[A-Z]|\n\nWHAT)/i)
  const energySummary = energyMatch ? energyMatch[1].trim() : ''

  // Incorporate into captions
  const tiktokShort = `${glyph} ${sign} — ${dateStr}\n\n` +
    (oneWord ? `Today in one word: ${oneWord}\n\n` : '') +
    (energySummary ? `${energySummary}\n\n` : '') +
    `Cosmic impact: ${impact.score}/10 ${impact.level === 'intense' ? '🔥' : impact.level === 'active' ? '✨' : '🌿'}\n\n` +
    `Real planetary data. Real frequencies.\nastrara.app`

  // ... similar updates for instagramLong
}
```

Regenerate captions whenever the horoscope updates.

---

## 6. Rate Limiting / Cost Protection

Add a simple client-side rate limit to prevent accidental rapid-fire API calls:

```typescript
const lastGenerationTime = useRef(0)
const MIN_GENERATION_INTERVAL = 5000  // 5 seconds between generations

async function generateHoroscope(sign: string) {
  const now = Date.now()
  if (now - lastGenerationTime.current < MIN_GENERATION_INTERVAL) {
    return  // too soon, skip
  }
  lastGenerationTime.current = now

  // ... rest of generation logic
}
```

---

## 7. Handle Missing API Key Gracefully

If `ANTHROPIC_API_KEY` is not set in the environment (e.g., local development without a key), show a helpful message instead of crashing:

```tsx
{generationError && generationError.includes('API key') && (
  <div className="text-amber-400/80 text-sm space-y-2">
    <p>Claude API key not configured.</p>
    <p className="text-white/40">
      Add ANTHROPIC_API_KEY to your .env.local file or Vercel environment variables.
    </p>
  </div>
)}
```

---

## 8. Vercel Environment Variable

For production deployment, the API key needs to be added to Vercel:

This is a MANUAL step the developer must do in the Vercel dashboard:
1. Go to the Astrara project in Vercel
2. Settings → Environment Variables
3. Add: Key = `ANTHROPIC_API_KEY`, Value = your API key
4. Apply to Production (and optionally Preview/Development)
5. Redeploy

Add a comment in the API route file reminding about this:

```typescript
// IMPORTANT: Set ANTHROPIC_API_KEY in Vercel Environment Variables
// Dashboard → Project Settings → Environment Variables
```

---

## Do NOT

- Do NOT hardcode the API key anywhere in source code
- Do NOT commit .env.local to git (ensure it's in .gitignore)
- Do NOT expose the API key to the client — all calls go through the API route
- Do NOT change any existing /promo page functionality from Step 1
- Do NOT change any main app pages or components
- Do NOT use a model other than claude-sonnet-4-20250514 (best balance of quality and cost)

---

## Build & Deploy

1. Create `.env.local` with the ANTHROPIC_API_KEY (developer must provide their own key)
2. Run `npm run build` — fix any TypeScript errors
3. Test: select a zodiac sign → loading spinner appears → horoscope generates
4. Test: horoscope content references actual planetary positions (not generic text)
5. Test: horoscope includes all 5 sections (energy, planets, guidance, sound healing, one word)
6. Test: "Regenerate" button generates a fresh reading
7. Test: "Copy Reading" button copies the full horoscope
8. Test: change date → new horoscope generates automatically
9. Test: change sign → new horoscope generates automatically
10. Test: rapid clicking doesn't cause multiple simultaneous API calls (rate limit works)
11. Test: without API key set → helpful error message, no crash
12. Test: social captions incorporate horoscope content when available
13. Commit: `feat: Claude API horoscope generation for /promo content studio`
14. Push to `main`
