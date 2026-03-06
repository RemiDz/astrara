# ASTRARA — /promo: General Daily Cosmic Reading

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## What to Add

A "Daily Cosmic Reading" section at the TOP of the /promo page (above the zodiac rankings and individual sign readings). This is a general reading for EVERYONE — not specific to any zodiac sign. It summarises today's overall cosmic energy based on all planetary positions, moon phase, and earth data.

Read all current /promo page and API route source files before making changes.

---

## 1. Create API Route

Create `src/app/api/horoscope-daily/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { positions, moonPhase, kpIndex, solarClass, overallImpact, date } = await req.json()

    if (!positions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemPrompt = `You are Astrara's cosmic guide — warm, clear, and insightful. You create daily cosmic weather readings that help everyone understand today's energy. This is NOT a zodiac-specific horoscope — it's a universal daily reading about the sky.

WRITING RULES — follow these strictly:
- Write in short, simple sentences. Maximum 15 words per sentence where possible.
- Use everyday language. No jargon. No complex vocabulary.
- One idea per paragraph. Keep paragraphs to 2-3 sentences maximum.
- Never use markdown bold (**) or italic (*) formatting.
- Use plain text only — no special formatting characters.
- Use simple section headers with emoji prefixes.
- For bullet points, use → as the prefix.
- Be specific. Reference actual planet names, signs, and degrees from the data provided.
- Be warm and encouraging, never alarming or negative.
- Sound like a knowledgeable friend giving a morning briefing about the sky.
- Mention sound healing connections where naturally relevant — frequencies, instruments, or techniques.
- Write for social media — this will be posted on TikTok and Instagram.`

    const userPrompt = `Generate a general daily cosmic reading for ${date}. This is for EVERYONE, not a specific zodiac sign.

CURRENT PLANETARY POSITIONS (real astronomical data):
${positions.map((p: { glyph: string; name: string; sign: string; degree: number; isRetrograde: boolean }) => `${p.glyph} ${p.name} in ${p.sign} at ${p.degree}°${p.isRetrograde ? ' (retrograde)' : ''}`).join('\n')}

MOON PHASE: ${moonPhase.name} (${moonPhase.illumination}% illumination)

EARTH DATA:
- Kp Index: ${kpIndex} (geomagnetic activity)
- Solar Activity: ${solarClass}

OVERALL COSMIC IMPACT: ${overallImpact.score}/10 — ${overallImpact.level}

Write the reading in this exact format. Keep total length under 350 words. Use plain text only — no markdown bold or italic:

☀️ GOOD MORNING, COSMOS

2-3 sentences. A warm, inviting opening that captures today's overall energy. Set the tone for the day.

🪐 TODAY'S SKY

4-5 short paragraphs about the most important planetary placements today. Focus on what affects everyone — not specific signs. Explain what each placement means in simple, relatable terms. Reference actual planets, signs, and degrees.

🌙 MOON WISDOM

2-3 sentences about today's moon phase and sign. What does the moon invite us to do or feel today?

🌍 EARTH ENERGY

1-2 sentences about the geomagnetic and solar conditions. How might this affect our bodies and energy levels? Only include if Kp is above 3 or solar activity is above B-class. If both are low, skip this section entirely.

🔊 TODAY'S SOUND MEDICINE

2-3 sentences. What frequency, instrument, or sound practice aligns with today's cosmic weather? Be specific — mention Hz values, singing bowls, gongs, binaural beats, or other instruments. Tie it to the actual planetary energy.

🧭 TODAY'S INVITATION

One sentence. A simple, practical intention or action for the day inspired by the cosmic weather.

💫 TODAY IN ONE WORD

One evocative word.`

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
      return NextResponse.json({ error: 'Failed to generate daily reading', details: error }, { status: 500 })
    }

    const data = await response.json()
    const reading = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')

    return NextResponse.json({ reading })

  } catch (error) {
    console.error('Daily reading generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 2. Add Daily Cosmic Reading Section to /promo Page

Place this section at the TOP of the page, DIRECTLY BELOW the "Today's Cosmic Weather" data summary and ABOVE the "Zodiac Impact Rankings" section.

### State

```typescript
const [dailyReading, setDailyReading] = useState('')
const [isGeneratingDaily, setIsGeneratingDaily] = useState(false)
```

### Generate Function

```typescript
async function generateDailyReading() {
  setIsGeneratingDaily(true)
  setDailyReading('')

  try {
    const response = await fetch('/api/horoscope-daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        positions: planetPositions,
        moonPhase,
        kpIndex: kpData?.kp ?? 0,
        solarClass: solarData?.flareClass ?? 'B1.0',
        overallImpact,
        date: selectedDate.toLocaleDateString('en-GB', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        }),
      }),
    })

    if (!response.ok) throw new Error('Failed to generate daily reading')

    const data = await response.json()
    setDailyReading(data.reading)
  } catch (err) {
    console.error(err)
  } finally {
    setIsGeneratingDaily(false)
  }
}
```

### UI Section

```tsx
{/* DAILY COSMIC READING — top of page, below cosmic weather data */}
<div className="mt-8">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider">
      Daily Cosmic Reading
    </h2>
    <button
      onClick={generateDailyReading}
      disabled={isGeneratingDaily}
      className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10
                 text-white/50 hover:text-white/80 hover:bg-white/10
                 transition-all duration-200 active:scale-95
                 disabled:opacity-50"
    >
      {isGeneratingDaily ? 'Generating...' : dailyReading ? '↻ Regenerate' : '✨ Generate Daily Reading'}
    </button>
  </div>

  <div className="p-6 rounded-xl bg-white/3 border border-white/5 min-h-[150px]">
    {isGeneratingDaily && (
      <div className="flex items-center gap-3 text-white/40">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        <span className="text-sm">Reading today's cosmic weather...</span>
      </div>
    )}

    {dailyReading && !isGeneratingDaily && (
      <div>
        <ReactMarkdown components={markdownComponents}>
          {dailyReading}
        </ReactMarkdown>
        <div className="pt-4 flex gap-2">
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(dailyReading)
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

    {!dailyReading && !isGeneratingDaily && (
      <p className="text-white/30 text-sm italic">
        Click "Generate Daily Reading" for today's universal cosmic briefing.
      </p>
    )}
  </div>
</div>
```

---

## 3. Add Daily Social Caption

Add a social caption block specifically for the daily reading (separate from the sign-specific captions):

```tsx
{dailyReading && (
  <div className="mt-4 space-y-3">
    <CaptionBlock
      label="Daily TikTok Caption"
      content={generateDailyTikTokCaption()}
    />
    <CaptionBlock
      label="Daily Instagram Caption"
      content={generateDailyInstagramCaption()}
    />
  </div>
)}
```

```typescript
function generateDailyTikTokCaption(): string {
  const dateStr = selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const moonSign = planetPositions.find(p => p.name === 'Moon')
  const sunSign = planetPositions.find(p => p.name === 'Sun')

  // Extract one word from daily reading
  const oneWordMatch = dailyReading.match(/TODAY IN ONE WORD[\s\S]*?\n\n?(.+)/i)
  const oneWord = oneWordMatch ? oneWordMatch[1].trim() : ''

  // Extract the invitation
  const inviteMatch = dailyReading.match(/TODAY'S INVITATION[\s\S]*?\n\n?(.+)/i)
  const invitation = inviteMatch ? inviteMatch[1].trim() : ''

  return `☀️ Cosmic Weather · ${dateStr}\n\n` +
    (oneWord ? `Today in one word: ${oneWord}\n\n` : '') +
    `${sunSign?.glyph} Sun in ${sunSign?.sign} · ${moonSign?.glyph} Moon in ${moonSign?.sign}\n` +
    `${moonPhase.name} · ${moonPhase.illumination.toFixed(0)}%\n\n` +
    (invitation ? `${invitation}\n\n` : '') +
    `Cosmic impact: ${overallImpact.score}/10\n\n` +
    `Real planetary data. Real frequencies.\nastrara.app\n\n` +
    `#cosmicweather #todaysenergy #astrology #dailyhoroscope ` +
    `#soundhealing #frequencies #astrara #planetaryalignment`
}

function generateDailyInstagramCaption(): string {
  const dateStr = selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return `☀️ COSMIC WEATHER · ${dateStr}\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    `Cosmic Impact: ${'●'.repeat(overallImpact.score)}${'○'.repeat(10 - overallImpact.score)} ${overallImpact.score}/10\n\n` +
    `Today's sky:\n` +
    planetPositions.map(p => `${p.glyph} ${p.name} in ${p.sign} ${p.degree}°`).join('\n') +
    `\n\n` +
    `${moonPhase.name} · ${moonPhase.illumination.toFixed(0)}% illumination\n\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `Real planetary positions from NASA JPL data.\n` +
    `Sound frequencies based on Hans Cousto's Cosmic Octave.\n` +
    `Explore your own cosmic portrait at astrara.app\n\n` +
    `#cosmicweather #todaysenergy #astrology #dailyhoroscope ` +
    `#planetaryalignment #moonphase #${moonPhase.name.toLowerCase().replace(/\s+/g, '')} ` +
    `#soundhealing #frequencies #astrara #harmonicwaves`
}
```

---

## 4. Page Section Order

The full /promo page should now have sections in this order:

1. Header (Astrara Content Studio + date picker)
2. Today's Cosmic Weather (data summary — planets, moon, Kp, solar)
3. **Daily Cosmic Reading** (NEW — general reading + daily social captions)
4. Zodiac Impact Rankings (all 12 signs sorted)
5. Zodiac Sign Selector + Individual Sign Reading
6. Sign-specific Social Captions
7. Weekly Reading

---

## Do NOT

- Do NOT auto-generate the daily reading on page load — manual button click only (saves API cost)
- Do NOT change any existing sections or functionality
- Do NOT change the individual zodiac reading or weekly reading
- Do NOT change any main app pages

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: daily reading section appears above zodiac rankings
3. Test: click "Generate Daily Reading" → loading spinner → reading appears
4. Test: reading is general (not sign-specific) — mentions multiple signs and overall energy
5. Test: reading is easy to read — short sentences, emoji headers, no markdown characters
6. Test: "Copy Reading" copies the full text
7. Test: daily TikTok and Instagram captions appear below the reading
8. Test: copy buttons work on all captions
9. Test: change date → reading clears, ready for new generation
10. Test: regenerate → new fresh reading for same date
11. Commit: `feat: general daily cosmic reading for /promo content studio`
12. Push to `main`
