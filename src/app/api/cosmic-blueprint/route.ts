import { NextRequest, NextResponse } from 'next/server'
import { computeMonthTransitData, computeEclipseRetroSummary } from '@/lib/transit-computation'
import type { BlueprintMonthNarrative, BlueprintYearOverview, BlueprintEclipseRetroData } from '@/types/cosmic-blueprint'

// ---------------------------------------------------------------------------
// System prompt — rich narrative for premium PDF
// ---------------------------------------------------------------------------

function buildSystemPrompt(
  clientName: string,
  birthDate: string,
  birthTime: string,
  sunSign: string,
  language: string,
): string {
  const langInst = language === 'lt'
    ? 'Write in Lithuanian. Use natural, flowing Lithuanian — not stiff translations.'
    : 'Write in English.'

  return `You are a renowned professional astrologer and certified sound healing practitioner writing a personal 12-month transit reading for a client. This reading is a premium paid product — the client expects depth, insight, and care.

Your writing style:
- Warm, wise, and personal — as if speaking directly to the client
- Weave planetary positions and aspects naturally into the narrative (don't list them separately)
- Be specific about what the transits mean for each life area — avoid vague generalisations
- Include practical guidance naturally within the narrative
- Mention specific dates when exact aspects occur ("Around March 14th, as Venus trines Jupiter...")
- Each monthly reading should tell a story — the energy builds, peaks, and transitions
- Reference connections between categories ("The financial confidence you're building this month is supported by the same Jupiter energy opening doors in your career...")
- Use evocative but grounded language — mystical without being fluffy

NARRATIVE ARC — CRITICAL:
These 12 months tell ONE continuous story, not 12 isolated readings.
For months 2+, reference what came before ("The seeds planted in March begin to sprout...", "That relationship tension from April finds resolution now...").
For months before the final month, foreshadow what's coming ("Pay attention to the financial opportunities emerging now — they become central next month...").
Each month's opening paragraph should bridge from the previous month's energy. The client should feel compelled to read the whole report like a story.

SOUND HEALING PRESCRIPTIONS:
For each month and each category, include a "sonic_rx" field — a personalised sound healing prescription. The prescriptions must be specific and professional:
- Reference specific frequencies tied to planetary correspondences (Hans Cousto's cosmic octave): Sun=126.22Hz, Moon=210.42Hz, Mercury=141.27Hz, Venus=221.23Hz, Mars=144.72Hz, Jupiter=183.58Hz, Saturn=147.85Hz, Uranus=207.36Hz, Neptune=211.44Hz, Pluto=140.25Hz
- Recommend specific instruments: crystal singing bowls (specify note/chakra), monochord, gongs, tuning forks, didgeridoo, overtone singing, ocean drums, Tibetan bowls, frame drums
- Suggest specific chakras to work with based on the planetary energy
- Include timing guidance ("best practised during the waning moon phase" or "ideal around March 14th when the aspect is exact")
- Keep each sonic_rx 2-3 sentences — specific and actionable, not vague

Also include a "month_sonic_focus" (1-2 sentences on the PRIMARY sound healing focus for the month) and an "affirmation" — a powerful, specific affirmation tied to this month's dominant planetary energy (not generic positivity — connected to actual planetary themes, e.g. "I move through Saturn's lessons with patience, knowing that every limitation I face is shaping a stronger foundation.").

VARIETY RULES — follow strictly:
- NEVER start two consecutive months with the same sentence structure
- NEVER start two consecutive life area readings with "The [Planet]..." — vary between starting with an action, a metaphor, a direct address to the reader, or a time reference
- Month opening paragraphs must use DIFFERENT narrative devices: some start with imagery, some with a question, some with a direct statement, some with a metaphor
- Closing affirmations must vary in structure: some as "I am...", some as "I trust...", some as "My [noun]...", some as questions, some as declarations
- Within a single month, no two life area readings should begin with the same word
- Avoid these overused phrases: "creates a powerful", "brings profound", "marks a significant", "offers a beautiful opportunity"

The client's data:
- Name: ${clientName || 'Dear Client'}
- Birth date: ${birthDate || 'Not provided'}
- Birth time: ${birthTime || 'Not provided'}
- Sun sign: ${sunSign || 'Not specified'}

${langInst}

Respond ONLY in valid JSON with no markdown backticks, no preamble, no trailing text.`
}

// ---------------------------------------------------------------------------
// Build transit data block for a set of months
// ---------------------------------------------------------------------------

function buildTransitBlock(months: { year: number; month: number }[]): string {
  const blocks: string[] = []

  for (const { year, month } of months) {
    const data = computeMonthTransitData(year, month)

    const pos1 = data.positions_1st.map(p =>
      `${p.name} in ${p.sign} ${p.degree}°${p.retrograde ? ' (Rx)' : ''}`
    ).join(', ')

    const pos15 = data.positions_15th.map(p =>
      `${p.name} in ${p.sign} ${p.degree}°${p.retrograde ? ' (Rx)' : ''}`
    ).join(', ')

    const asp1 = data.aspects_1st.slice(0, 8).map(a =>
      `${a.planet1} ${a.symbol} ${a.planet2} (orb ${a.orb}°${a.isApplying ? ', applying' : ''})`
    ).join('; ')

    const asp15 = data.aspects_15th.slice(0, 8).map(a =>
      `${a.planet1} ${a.symbol} ${a.planet2} (orb ${a.orb}°${a.isApplying ? ', applying' : ''})`
    ).join('; ')

    const extras: string[] = []
    if (data.ingresses.length > 0) extras.push(`Sign ingresses: ${data.ingresses.join('; ')}`)
    if (data.retrogrades.length > 0) extras.push(`Retrograde activity: ${data.retrogrades.join('; ')}`)
    if (data.moonPhases.length > 0) extras.push(`Lunar events: ${data.moonPhases.join('; ')}`)

    blocks.push(`=== ${data.monthLabel} ===
Positions (1st): ${pos1}
Positions (15th): ${pos15}
Aspects (1st): ${asp1 || 'none significant'}
Aspects (15th): ${asp15 || 'none significant'}
${extras.join('\n')}`)
  }

  return blocks.join('\n\n')
}

// ---------------------------------------------------------------------------
// Prompt builders for each of the 3 calls
// ---------------------------------------------------------------------------

function buildMonthsPrompt(transitBlock: string, narrativeThread?: string): string {
  const threadSection = narrativeThread
    ? `\nStory so far (continue the narrative arc from these previous months):\n${narrativeThread}\n`
    : ''

  return `Transit data for this period:

${transitBlock}
${threadSection}
Write rich, flowing narrative readings for each month. Use this JSON structure:

{
  "months": [
    {
      "month": "Month Year",
      "overall_score": 7,
      "opening": "A 2-3 sentence atmospheric opening setting the energetic tone for the month. For months 2+, bridge from the previous month's energy.",
      "finance": {
        "score": 6,
        "narrative": "A rich 4-6 sentence narrative about financial energy this month. Weave in the specific planetary transits naturally. Include dates where relevant. End with practical guidance.",
        "sonic_rx": "2-3 sentence sound healing prescription specific to this category's planetary activity. Reference specific Hz frequencies, instruments, chakras, and timing."
      },
      "relationships": { "score": 8, "narrative": "4-6 sentences...", "sonic_rx": "2-3 sentences..." },
      "career": { "score": 7, "narrative": "4-6 sentences...", "sonic_rx": "2-3 sentences..." },
      "health": { "score": 5, "narrative": "4-6 sentences...", "sonic_rx": "2-3 sentences..." },
      "spiritual": { "score": 9, "narrative": "4-6 sentences...", "sonic_rx": "2-3 sentences..." },
      "month_synthesis": "A 3-4 sentence closing that weaves all themes together and bridges to the next month's energy",
      "month_sonic_focus": "1-2 sentences on the PRIMARY sound healing focus for the month overall",
      "affirmation": "A powerful, specific affirmation tied to this month's dominant planetary energy — not generic positivity"
    }
  ]
}`
}

function buildOverviewPrompt(allMonthsSummary: string, eclipseRetroSummary: string): string {
  const eclipseSection = eclipseRetroSummary
    ? `\nEclipses and retrogrades during this 12-month period (use these ACCURATE dates):\n${eclipseRetroSummary}\n`
    : ''

  return `Here is a summary of all 12 months of this client's transit readings:

${allMonthsSummary}
${eclipseSection}
Now write a comprehensive YEAR OVERVIEW that synthesises the entire 12-month arc, plus an eclipses_and_retrogrades section. Use this JSON structure:

{
  "year_overview": {
    "opening": "2-3 sentence overview of the year's dominant energy",
    "major_themes": "3-4 sentence description of the year's major planetary themes",
    "peak_periods": "2-3 sentences highlighting the most significant months and why",
    "growth_trajectory": "3-4 sentences about the client's overall growth arc across the year",
    "closing_message": "A warm, empowering 2-3 sentence personal closing message to the client",
    "eclipses_and_retrogrades": {
      "intro": "2 sentences demystifying eclipses and retrogrades — reassuring, not fear-based",
      "events": [
        {
          "name": "Solar Eclipse in Aries",
          "date": "March 29, 2026",
          "type": "eclipse_solar",
          "narrative": "3-4 sentences explaining what this means for the client specifically",
          "sonic_rx": "Sound healing recommendation for navigating this event"
        }
      ]
    }
  }
}`
}

// ---------------------------------------------------------------------------
// API call with retry (same pattern as transit-grid)
// ---------------------------------------------------------------------------

const DEBUG = process.env.NODE_ENV === 'development'

async function callClaude(
  apiKey: string,
  system: string,
  userPrompt: string,
  maxTokens: number,
  retries: number = 2,
): Promise<{ text: string; stopReason: string }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: maxTokens,
        temperature: 0.7,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (response.status === 429 || response.status === 529) {
      if (attempt < retries) {
        const delay = [5000, 10000, 20000][attempt] ?? 20000
        console.warn(`[cosmic-blueprint] Rate limited (${response.status}), retrying in ${delay / 1000}s...`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error(`[cosmic-blueprint] API error (${response.status}):`, errText.substring(0, 500))
      throw new Error(`API returned ${response.status}: ${errText.substring(0, 200)}`)
    }

    const data = await response.json()
    if (!data.content || !Array.isArray(data.content)) {
      throw new Error('Unexpected API response structure')
    }

    const rawText = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('')

    const stopReason = data.stop_reason || 'unknown'
    console.log(`[cosmic-blueprint] Tokens: in=${data.usage?.input_tokens ?? '?'} out=${data.usage?.output_tokens ?? '?'} stop=${stopReason}`)

    if (stopReason === 'max_tokens') {
      console.warn(`[cosmic-blueprint] WARNING: Truncated at ${maxTokens} tokens`)
    }

    return { text: rawText, stopReason }
  }

  throw new Error('Exhausted retries')
}

function extractJSON<T>(rawText: string, label: string): T {
  if (DEBUG) {
    console.log(`[cosmic-blueprint] ${label} raw response length: ${rawText.length} chars`)
    console.log(`[cosmic-blueprint] ${label} first 500:`, rawText.substring(0, 500))
    console.log(`[cosmic-blueprint] ${label} last 200:`, rawText.substring(rawText.length - 200))
  }

  let text = rawText.trim()

  // Strip markdown code fences
  if (text.startsWith('```json')) text = text.slice(7)
  else if (text.startsWith('```')) text = text.slice(3)
  if (text.endsWith('```')) text = text.slice(0, -3)
  text = text.trim()

  // Strip any preamble before the first {
  const firstBrace = text.indexOf('{')
  if (firstBrace < 0) {
    console.error(`[cosmic-blueprint] ${label}: No JSON object found in response. First 300:`, text.substring(0, 300))
    throw new Error(`No JSON found in ${label} response`)
  }
  if (firstBrace > 0) {
    console.warn(`[cosmic-blueprint] ${label}: Stripped ${firstBrace} chars of preamble`)
    text = text.substring(firstBrace)
  }

  // Handle truncation — find the last valid closing brace
  if (!text.endsWith('}')) {
    console.warn(`[cosmic-blueprint] ${label}: Response appears truncated. Last 100 chars:`, text.slice(-100))
    const lastBrace = text.lastIndexOf('}')
    if (lastBrace > 0) {
      text = text.substring(0, lastBrace + 1)
      console.warn(`[cosmic-blueprint] ${label}: Truncation salvage — trimmed to position ${lastBrace + 1}`)
    } else {
      throw new Error(`${label} response is truncated beyond repair — increase max_tokens`)
    }
  }

  try {
    return JSON.parse(text) as T
  } catch (e) {
    // Log detailed context for debugging
    console.error(`[cosmic-blueprint] ${label} JSON parse failed.`)
    console.error(`[cosmic-blueprint] ${label} cleaned length: ${text.length}`)
    console.error(`[cosmic-blueprint] ${label} first 500:`, text.substring(0, 500))
    console.error(`[cosmic-blueprint] ${label} last 200:`, text.substring(text.length - 200))
    console.error(`[cosmic-blueprint] ${label} parse error:`, e instanceof Error ? e.message : e)
    throw new Error(`JSON parse error in ${label}`)
  }
}

// ---------------------------------------------------------------------------
// Determine sun sign from birth date
// ---------------------------------------------------------------------------

function getSunSign(birthDate: string): string {
  if (!birthDate) return ''
  const d = new Date(birthDate)
  const month = d.getMonth() + 1
  const day = d.getDate()

  const signs = [
    { sign: 'Capricorn', start: [1, 1], end: [1, 19] },
    { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
    { sign: 'Pisces', start: [2, 19], end: [3, 20] },
    { sign: 'Aries', start: [3, 21], end: [4, 19] },
    { sign: 'Taurus', start: [4, 20], end: [5, 20] },
    { sign: 'Gemini', start: [5, 21], end: [6, 20] },
    { sign: 'Cancer', start: [6, 21], end: [7, 22] },
    { sign: 'Leo', start: [7, 23], end: [8, 22] },
    { sign: 'Virgo', start: [8, 23], end: [9, 22] },
    { sign: 'Libra', start: [9, 23], end: [10, 22] },
    { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
    { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
    { sign: 'Capricorn', start: [12, 22], end: [12, 31] },
  ]

  for (const s of signs) {
    const afterStart = month > s.start[0] || (month === s.start[0] && day >= s.start[1])
    const beforeEnd = month < s.end[0] || (month === s.end[0] && day <= s.end[1])
    if (afterStart && beforeEnd) return s.sign
  }
  return 'Capricorn'
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      part,
      overview, // true for the year-overview-only call (part 7)
      monthDates, // array of { year, month } (2 items for month calls)
      allMonthDates, // full 12-month array (for eclipse/retro computation)
      language,
      clientName,
      birthDate,
      birthTime,
      narrativeThread, // summary of previous parts' narrative threads
      allMonthsSummary, // only for overview call
    } = body

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const sunSign = getSunSign(birthDate || '')
    const systemPrompt = buildSystemPrompt(
      clientName || '',
      birthDate || '',
      birthTime || '',
      sunSign,
      language || 'en',
    )

    // ── Year Overview call (no months) ──
    if (overview && allMonthsSummary) {
      const eclipseRetroSummary = allMonthDates
        ? computeEclipseRetroSummary(allMonthDates)
        : ''
      const userPrompt = buildOverviewPrompt(allMonthsSummary, eclipseRetroSummary)

      console.log(`[cosmic-blueprint] Part ${part} (overview): prompt ${userPrompt.length} chars`)

      const { text: rawText, stopReason } = await callClaude(apiKey, systemPrompt, userPrompt, 4096)

      if (stopReason === 'max_tokens') {
        console.error(`[cosmic-blueprint] Part ${part} (overview): TRUNCATED`)
        // Still attempt to parse — extractJSON handles truncation salvage
      }

      const result = extractJSON<{
        year_overview: BlueprintYearOverview & { eclipses_and_retrogrades?: BlueprintEclipseRetroData }
      }>(rawText, `Part ${part} (overview)`)

      const yearOverview = result.year_overview || null
      let eclipseRetroData: BlueprintEclipseRetroData | undefined
      if (yearOverview?.eclipses_and_retrogrades) {
        eclipseRetroData = yearOverview.eclipses_and_retrogrades
      }

      return NextResponse.json({
        year_overview: yearOverview,
        eclipseRetroData: eclipseRetroData || null,
      })
    }

    // ── Monthly narrative call (2 months per call) ──
    if (!monthDates || !Array.isArray(monthDates) || monthDates.length === 0) {
      return NextResponse.json({ error: 'Missing month dates' }, { status: 400 })
    }

    const transitBlock = buildTransitBlock(monthDates)
    const userPrompt = buildMonthsPrompt(transitBlock, narrativeThread || undefined)
    const maxTokens = 4096

    console.log(`[cosmic-blueprint] Part ${part}: generating narrative for ${monthDates.length} months (prompt ${userPrompt.length} chars)`)

    const { text: rawText, stopReason } = await callClaude(apiKey, systemPrompt, userPrompt, maxTokens)

    if (stopReason === 'max_tokens') {
      console.error(`[cosmic-blueprint] Part ${part}: TRUNCATED at ${maxTokens} tokens`)
      // Still attempt to parse — extractJSON handles truncation salvage
    }

    const result = extractJSON<{
      months: BlueprintMonthNarrative[]
    }>(rawText, `Part ${part}`)

    return NextResponse.json({
      months: result.months || [],
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[cosmic-blueprint] Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
