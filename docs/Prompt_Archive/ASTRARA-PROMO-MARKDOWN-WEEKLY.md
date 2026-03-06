# ASTRARA — /promo Fix: Markdown Rendering, Weekly Readings, Dyslexia-Friendly Format

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Three Things to Do

Read all current /promo page and horoscope API route source files before making changes.

---

## 1. Fix Markdown Rendering

The horoscope content is returned as markdown (with `##`, `**`, etc.) but displayed as raw text. Install a markdown renderer and apply it.

### Install react-markdown

```bash
npm install react-markdown
```

### Render Horoscope as Markdown

In the /promo page, replace the raw text display with a markdown renderer:

```tsx
import ReactMarkdown from 'react-markdown'

// Replace the raw whitespace-pre-wrap display with:
{horoscope && !isGenerating && (
  <div className="space-y-1">
    <div className="prose prose-invert prose-sm max-w-none
                    prose-headings:text-white/80 prose-headings:text-base prose-headings:font-medium prose-headings:mt-6 prose-headings:mb-2
                    prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-3
                    prose-strong:text-white/90
                    prose-li:text-white/70 prose-li:leading-relaxed
                    prose-ul:space-y-2">
      <ReactMarkdown>{horoscope}</ReactMarkdown>
    </div>

    <div className="pt-4">
      <button onClick={handleCopyReading} className="...">
        Copy Reading
      </button>
    </div>
  </div>
)}
```

If `prose` classes from Tailwind Typography plugin are not available, add basic styling directly:

```tsx
<div className="horoscope-content">
  <ReactMarkdown
    components={{
      h2: ({ children }) => (
        <h2 className="text-white/80 text-base font-medium mt-6 mb-2 uppercase tracking-wide">
          {children}
        </h2>
      ),
      p: ({ children }) => (
        <p className="text-white/70 text-sm leading-relaxed mb-3">
          {children}
        </p>
      ),
      strong: ({ children }) => (
        <strong className="text-white/90 font-medium">{children}</strong>
      ),
      ul: ({ children }) => (
        <ul className="space-y-2 my-3">{children}</ul>
      ),
      li: ({ children }) => (
        <li className="text-white/70 text-sm leading-relaxed flex gap-2">
          <span className="text-white/30 mt-0.5">→</span>
          <span>{children}</span>
        </li>
      ),
    }}
  >
    {horoscope}
  </ReactMarkdown>
</div>
```

---

## 2. Update the System Prompt for Dyslexia-Friendly Format

In `src/app/api/horoscope/route.ts`, update the system prompt to produce cleaner, friendlier, easier-to-read content:

Replace the existing `systemPrompt` with:

```typescript
const systemPrompt = `You are Astrara's cosmic guide — warm, clear, and insightful. You combine real astronomical data with astrological wisdom to create readings that feel like advice from a wise, caring friend.

WRITING RULES — follow these strictly:
- Write in short, simple sentences. Maximum 15 words per sentence where possible.
- Use everyday language. No jargon. No complex vocabulary.
- One idea per paragraph. Keep paragraphs to 2-3 sentences maximum.
- Use line breaks generously for breathing room.
- Never use markdown bold (**) or italic (*) formatting.
- Use plain text only — no special formatting characters.
- Use simple section headers with emoji prefixes, like: ✨ TODAY'S ENERGY
- For bullet points, use → as the prefix, not - or •
- Be specific. Reference actual planet names, signs, and degrees from the data provided.
- Be warm and encouraging, never alarming or negative.
- Sound like a knowledgeable friend, not a textbook or fortune cookie.
- Where relevant, briefly mention sound healing connections — frequencies, instruments, or techniques that align with today's energy. Keep these natural, not forced.`
```

Also update the `userPrompt` format to request the cleaner structure:

```typescript
const userPrompt = `Generate a daily horoscope for ${sign} for ${date}.

CURRENT PLANETARY POSITIONS (real astronomical data):
${positions.map((p: { glyph: string; name: string; sign: string; degree: number; isRetrograde: boolean }) => `${p.glyph} ${p.name} in ${p.sign} at ${p.degree}°${p.isRetrograde ? ' (retrograde)' : ''}`).join('\n')}

MOON PHASE: ${moonPhase.name} (${moonPhase.illumination}% illumination)

EARTH DATA:
- Kp Index: ${kpIndex} (geomagnetic activity)
- Solar Activity: ${solarClass}

IMPACT SCORE FOR ${sign.toUpperCase()}: ${impactScore}/10
IMPACT FACTORS: ${impactFactors.join(', ')}

Write the reading in this exact format. Keep total length under 300 words. Use plain text only — no markdown bold or italic:

✨ TODAY'S ENERGY

2-3 simple sentences capturing today's headline feeling for ${sign}.

🪐 WHAT THE SKY IS TELLING YOU

3-4 short paragraphs. Each about one specific planet and what it means for ${sign} today. Reference the planet name, sign, and degree. Keep it conversational and easy to understand.

🧭 WHAT TO DO TODAY

→ First practical tip tied to today's planets
→ Second practical tip
→ Third practical tip

🔊 SOUND HEALING TIP

1-2 sentences about which frequency, instrument, or practice suits today's energy. Mention specific Hz values or instruments.

💫 TODAY IN ONE WORD

One evocative word.`
```

---

## 3. Add Weekly Reading Generator

Add a new section to the /promo page BELOW the daily reading section.

### Weekly Reading API Route

Create `src/app/api/horoscope-weekly/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { sign, weekPositions, weekStart, weekEnd } = await req.json()

    if (!sign || !weekPositions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemPrompt = `You are Astrara's cosmic guide — warm, clear, and insightful. You create weekly horoscope readings that help people plan their week with cosmic awareness.

WRITING RULES — follow these strictly:
- Write in short, simple sentences. Maximum 15 words per sentence where possible.
- Use everyday language. No jargon. No complex vocabulary.
- One idea per paragraph. Keep paragraphs to 2-3 sentences maximum.
- Never use markdown bold (**) or italic (*) formatting.
- Use plain text only — no special formatting characters.
- Use simple section headers with emoji prefixes.
- For bullet points, use → as the prefix.
- Be specific. Reference actual planet names, signs, and degrees.
- Be warm and encouraging, never alarming or negative.
- Sound like a knowledgeable friend giving weekly advice.
- Mention sound healing tips where naturally relevant.`

    const userPrompt = `Generate a WEEKLY horoscope for ${sign} for the week of ${weekStart} to ${weekEnd}.

PLANETARY POSITIONS AT START OF WEEK:
${weekPositions.start.map((p: { glyph: string; name: string; sign: string; degree: number }) => `${p.glyph} ${p.name} in ${p.sign} at ${p.degree}°`).join('\n')}

PLANETARY POSITIONS AT END OF WEEK:
${weekPositions.end.map((p: { glyph: string; name: string; sign: string; degree: number }) => `${p.glyph} ${p.name} in ${p.sign} at ${p.degree}°`).join('\n')}

KEY PLANETARY MOVEMENTS THIS WEEK:
${weekPositions.movements.join('\n')}

Write the weekly reading in this exact format. Keep total length under 400 words. Use plain text only — no markdown bold or italic:

✨ THIS WEEK'S THEME

2-3 sentences capturing the overall energy of the week for ${sign}.

📅 DAY BY DAY HIGHLIGHTS

Mention the 2-3 most significant days of the week for ${sign} and why. Keep each to 1-2 sentences.

🪐 KEY PLANETARY INFLUENCES

3-4 short paragraphs about the most important planetary movements affecting ${sign} this week. Focus on planets that change sign, station retrograde/direct, or form exact aspects.

🧭 WEEKLY GUIDANCE

→ Best day this week for: [specific activity based on planets]
→ Watch out for: [specific challenge with constructive framing]
→ Focus your energy on: [specific area of life]

🔊 WEEKLY SOUND HEALING

1-2 sentences about frequencies or practices for the week.

💫 WEEK IN ONE WORD

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
        max_tokens: 1200,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt }
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Anthropic API error:', error)
      return NextResponse.json({ error: 'Failed to generate weekly horoscope', details: error }, { status: 500 })
    }

    const data = await response.json()
    const horoscope = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')

    return NextResponse.json({ horoscope })

  } catch (error) {
    console.error('Weekly horoscope generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Calculate Weekly Data

In the /promo page, add a function to calculate planetary movements across a week:

```typescript
function calculateWeekData(startDate: Date) {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 6)

  const startPositions = calculateAllPositions(startDate)
  const endPositions = calculateAllPositions(endDate)

  // Detect significant movements
  const movements: string[] = []
  for (let i = 0; i < startPositions.length; i++) {
    const start = startPositions[i]
    const end = endPositions[i]
    if (start.sign !== end.sign) {
      movements.push(`${start.glyph} ${start.name} moves from ${start.sign} into ${end.sign}`)
    }
  }

  // Check moon phases during the week
  for (let d = 0; d <= 6; d++) {
    const checkDate = new Date(startDate)
    checkDate.setDate(checkDate.getDate() + d)
    const phase = Astronomy.MoonPhase(checkDate)
    if (phase < 5 || phase > 355) {
      const dayName = checkDate.toLocaleDateString('en-GB', { weekday: 'long' })
      movements.push(`New Moon on ${dayName}`)
    }
    if (phase > 175 && phase < 185) {
      const dayName = checkDate.toLocaleDateString('en-GB', { weekday: 'long' })
      movements.push(`Full Moon on ${dayName}`)
    }
  }

  if (movements.length === 0) {
    movements.push('A relatively stable week — planets hold their positions')
  }

  return {
    start: startPositions,
    end: endPositions,
    movements,
    weekStart: startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    weekEnd: endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
}
```

### Weekly Reading UI Section

Add below the daily reading section:

```tsx
<div className="mt-12">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider">
      Weekly Reading
    </h2>
    <div className="flex items-center gap-3">
      <span className="text-white/40 text-sm">
        Week of {weekData.weekStart}
      </span>
      <button
        onClick={() => generateWeeklyHoroscope(selectedSign)}
        disabled={isGeneratingWeekly}
        className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10
                   text-white/50 hover:text-white/80 hover:bg-white/10
                   transition-all duration-200 active:scale-95
                   disabled:opacity-50"
      >
        {isGeneratingWeekly ? 'Generating...' : '↻ Generate Weekly'}
      </button>
    </div>
  </div>

  <div className="p-6 rounded-xl bg-white/3 border border-white/5 min-h-[200px]">
    {isGeneratingWeekly && (
      <div className="flex items-center gap-3 text-white/40">
        <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        <span className="text-sm">Reading the stars for {selectedSign}'s week ahead...</span>
      </div>
    )}

    {weeklyHoroscope && !isGeneratingWeekly && (
      <div>
        <ReactMarkdown components={markdownComponents}>
          {weeklyHoroscope}
        </ReactMarkdown>
        <div className="pt-4">
          <button onClick={handleCopyWeekly} className="...">
            Copy Weekly Reading
          </button>
        </div>
      </div>
    )}

    {!weeklyHoroscope && !isGeneratingWeekly && (
      <p className="text-white/30 text-sm italic">
        Click "Generate Weekly" to create a weekly reading for {selectedSign}.
      </p>
    )}
  </div>
</div>
```

### Weekly Reading State & Function

```typescript
const [weeklyHoroscope, setWeeklyHoroscope] = useState('')
const [isGeneratingWeekly, setIsGeneratingWeekly] = useState(false)

// Calculate week start (next Monday, or this Monday if today is Sunday)
function getWeekStart(fromDate: Date): Date {
  const d = new Date(fromDate)
  const day = d.getDay()
  // If Sunday (0), use tomorrow (Monday). Otherwise, find next Monday.
  const daysUntilMonday = day === 0 ? 1 : (8 - day)
  d.setDate(d.getDate() + daysUntilMonday)
  return d
}

const weekStart = getWeekStart(selectedDate)
const weekData = calculateWeekData(weekStart)

async function generateWeeklyHoroscope(sign: string) {
  setIsGeneratingWeekly(true)
  setWeeklyHoroscope('')

  try {
    const response = await fetch('/api/horoscope-weekly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sign,
        weekPositions: weekData,
        weekStart: weekData.weekStart,
        weekEnd: weekData.weekEnd,
      }),
    })

    if (!response.ok) throw new Error('Failed to generate weekly horoscope')

    const data = await response.json()
    setWeeklyHoroscope(data.horoscope)
  } catch (err) {
    console.error(err)
  } finally {
    setIsGeneratingWeekly(false)
  }
}
```

### Weekly does NOT auto-generate

Unlike the daily reading which generates automatically when a sign is selected, the weekly reading only generates when the user clicks "Generate Weekly". This saves API costs since you might not need a weekly reading every time.

---

## 4. Update Social Captions for Weekly

Add a separate caption block for weekly content when a weekly reading exists:

```tsx
{weeklyHoroscope && (
  <CaptionBlock
    label="Instagram Weekly"
    content={generateWeeklyCaption(selectedSign, weekData, weeklyHoroscope)}
  />
)}
```

```typescript
function generateWeeklyCaption(sign: string, weekData: any, horoscope: string): string {
  const glyph = impacts.find(i => i.sign === sign)?.glyph || ''
  
  // Extract the one-word summary
  const oneWordMatch = horoscope.match(/WEEK IN ONE WORD[\s\S]*?\n\n?(.+)/i)
  const oneWord = oneWordMatch ? oneWordMatch[1].trim() : ''

  return `${glyph} ${sign.toUpperCase()} · WEEKLY FORECAST\n` +
    `${weekData.weekStart} — ${weekData.weekEnd}\n` +
    `━━━━━━━━━━━━━━━━━━━\n\n` +
    (oneWord ? `Week in one word: ${oneWord}\n\n` : '') +
    (weekData.movements.length > 0
      ? `Key cosmic shifts:\n${weekData.movements.map((m: string) => `→ ${m}`).join('\n')}\n\n`
      : '') +
    `Real planetary data from NASA JPL algorithms.\n` +
    `Your cosmic portrait at astrara.app\n\n` +
    `#${sign.toLowerCase()} #weeklyhoroscope #astrology #cosmicweather ` +
    `#zodiac #weekahead #soundhealing #astrara`
}
```

---

## Do NOT

- Do NOT change any main app pages or components
- Do NOT change the API key handling
- Do NOT change the impact scoring system
- Do NOT auto-generate weekly readings (manual button only)
- Do NOT change any existing social caption templates — add weekly alongside them

---

## Build & Deploy

1. Run `npm install react-markdown` if not already installed
2. Run `npm run build` — fix any TypeScript errors
3. Test: daily reading renders with clean formatted sections, no raw markdown characters
4. Test: text is short sentences, easy to read, no jargon
5. Test: no ** or ## visible in the output
6. Test: "Generate Weekly" button appears below daily reading
7. Test: click Generate Weekly → weekly reading generates with week date range
8. Test: weekly reading references planetary movements across the week
9. Test: weekly Instagram caption generates when weekly reading exists
10. Test: copy buttons work for all sections
11. Test: regenerate daily → fresh reading in clean format
12. Commit: `feat: markdown rendering, weekly readings, dyslexia-friendly format`
13. Push to `main`
