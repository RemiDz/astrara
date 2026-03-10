import { NextRequest, NextResponse } from 'next/server'
import { computeMonthTransitData } from '@/lib/transit-computation'

const SYSTEM_PROMPT = `You are a professional astrologer providing transit readings for a client consultation.
You receive exact planetary positions and aspects from NASA JPL-accurate ephemeris.
Give specific, insightful, actionable interpretations. Reference actual planets and aspects.
Balance: ~40% positive, ~30% challenging, ~30% practical. Be honest about difficulties.
Respond ONLY in valid JSON. No markdown, backticks, or code fences.`

const OVERVIEW_SYSTEM_PROMPT = `You are a professional astrologer synthesising a 12-month overview.
Given monthly summaries from NASA JPL data, identify year-long trends, peak months, trajectory.
Be honest about difficult periods. Respond ONLY in valid JSON. No markdown, backticks, or code fences.`

function buildCompactMonthPrompt(year: number, month: number, language: string, birthData?: string): string {
  const data = computeMonthTransitData(year, month)

  // Compact planet positions: "Sun Ari 15°, Moon Lib 22° Rx"
  const pos1 = data.positions_1st.map(p =>
    `${p.name} ${p.sign.substring(0, 3)} ${p.degree}°${p.retrograde ? ' Rx' : ''}`
  ).join(', ')

  const pos15 = data.positions_15th.map(p =>
    `${p.name} ${p.sign.substring(0, 3)} ${p.degree}°${p.retrograde ? ' Rx' : ''}`
  ).join(', ')

  // Compact aspects: "Sun□Saturn(2.1°), Venus△Jupiter(1.3°)"
  const asp1 = data.aspects_1st.map(a =>
    `${a.planet1}${a.symbol}${a.planet2}(${a.orb}°)`
  ).join(', ')

  const asp15 = data.aspects_15th.map(a =>
    `${a.planet1}${a.symbol}${a.planet2}(${a.orb}°)`
  ).join(', ')

  const extras: string[] = []
  if (data.ingresses.length > 0) extras.push(`Ingresses: ${data.ingresses.join('; ')}`)
  if (data.retrogrades.length > 0) extras.push(`Retrogrades: ${data.retrogrades.join('; ')}`)
  if (data.moonPhases.length > 0) extras.push(`Moon: ${data.moonPhases.join('; ')}`)

  const lang = language === 'lt' ? 'Write ALL text in Lithuanian.' : 'Write in British English.'
  const birth = birthData ? `\nClient: ${birthData}` : ''

  return `${data.monthLabel}
1st: ${pos1}
15th: ${pos15}
Aspects 1st: ${asp1 || 'none'}
Aspects 15th: ${asp15 || 'none'}
${extras.join('\n')}${birth}
${lang}

Return JSON: {"month":"${data.monthLabel}","categories":{"finance":{"impact_score":<1-10>,"key_theme":"<1-2 sentences>","full_reading":"<3-5 sentences>","planetary_breakdown":[{"planet":"<name>","symbol":"<glyph>","position":"<sign deg°>","aspects":[{"type":"<name>","symbol":"<glyph>","target":"<planet>","target_symbol":"<glyph>","interpretation":"<1 sentence>"}],"impact_contribution":<1-5>,"category_effect":"<1 sentence>"}],"practical_guidance":"<advice>","dates_to_watch":["<date — event>"]},"relationships":{same},"career":{same},"health":{same},"spiritual":{same},"monthly_summary":{"impact_score":<1-10>,"dominant_theme":"<1-2 sentences>","full_reading":"<3-5 sentences>","key_players":["<planets>"],"opportunities":"<text>","challenges":"<text>","interrelations":"<text>"}}}`
}

function buildOverviewPrompt(monthSummaries: string[], language: string): string {
  const lang = language === 'lt' ? 'Write ALL text in Lithuanian.' : 'Write in British English.'

  return `Monthly summaries:\n${monthSummaries.join('\n---\n')}
${lang}

Return JSON: {"categories":{"finance":{"impact_score":<1-10>,"year_trend":"<3-5 sentences>","peak_months":["<months>"],"trajectory":"<improving/challenging/stable/transformative>","key_events":"<text>","full_reading":"<3-5 sentences>"},"relationships":{same},"career":{same},"health":{same},"spiritual":{same},"grand_summary":{"impact_score":<1-10>,"dominant_theme":"<theme>","full_reading":"<5-7 sentences>","key_players":["<planets>"],"peak_months":["<months>"],"trajectory":"<trajectory>"}}}`
}

const DEBUG = process.env.NODE_ENV === 'development'

function stripJsonFences(raw: string): string {
  let s = raw.trim()
  if (s.startsWith('```json')) s = s.slice(7)
  else if (s.startsWith('```')) s = s.slice(3)
  if (s.endsWith('```')) s = s.slice(0, -3)
  return s.trim()
}

async function callAnthropicWithRetry(
  apiKey: string,
  system: string,
  userPrompt: string,
  maxTokens: number,
  retries: number = 2,
): Promise<string> {
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
        system,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (response.status === 429 || response.status === 529) {
      if (attempt < retries) {
        const delay = 3000 * (attempt + 1)
        console.warn(`[transit-grid] Rate limited (${response.status}), retrying in ${delay}ms...`)
        await new Promise(r => setTimeout(r, delay))
        continue
      }
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error(`[transit-grid] API error (${response.status}):`, errText.substring(0, 300))
      throw new Error(`API error ${response.status}`)
    }

    const data = await response.json()
    if (!data.content || !Array.isArray(data.content)) {
      throw new Error('Unexpected API response structure')
    }

    const rawText = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('')

    const stopReason = data.stop_reason
    console.log(`[transit-grid] Response tokens: input=${data.usage?.input_tokens ?? '?'} output=${data.usage?.output_tokens ?? '?'} stop=${stopReason}`)

    // Warn if response was truncated (hit token limit)
    if (stopReason === 'max_tokens') {
      console.warn(`[transit-grid] WARNING: Response truncated at max_tokens (${maxTokens}). Increase max_tokens.`)
    }

    return rawText
  }

  throw new Error('Exhausted retries')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, year, month, language, birthData, monthSummaries } = body

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    if (type === 'month') {
      console.log(`[transit-grid] Generating month: ${year}-${month + 1}`)
      const userPrompt = buildCompactMonthPrompt(year, month, language || 'en', birthData)
      if (DEBUG) console.log(`[transit-grid] Prompt length: ${userPrompt.length} chars`)

      try {
        const rawText = await callAnthropicWithRetry(apiKey, SYSTEM_PROMPT, userPrompt, 3000)
        const cleaned = stripJsonFences(rawText)

        try {
          const parsed = JSON.parse(cleaned)
          console.log(`[transit-grid] Month ${year}-${month + 1}: OK`)
          return NextResponse.json({ data: parsed })
        } catch (parseErr) {
          console.error(`[transit-grid] Month ${year}-${month + 1} JSON parse failed. Raw (first 500):`, cleaned.substring(0, 500))
          console.error(`[transit-grid] Raw (last 200):`, cleaned.substring(cleaned.length - 200))
          return NextResponse.json({ error: 'JSON parse error — response may be truncated' }, { status: 500 })
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error'
        console.error(`[transit-grid] Month ${year}-${month + 1} failed:`, msg)
        return NextResponse.json({ error: msg }, { status: 500 })
      }

    } else if (type === 'overview') {
      if (!monthSummaries || !Array.isArray(monthSummaries)) {
        return NextResponse.json({ error: 'Missing month summaries' }, { status: 400 })
      }

      console.log(`[transit-grid] Generating overview from ${monthSummaries.length} months`)
      const userPrompt = buildOverviewPrompt(monthSummaries, language || 'en')

      try {
        const rawText = await callAnthropicWithRetry(apiKey, OVERVIEW_SYSTEM_PROMPT, userPrompt, 3000)
        const cleaned = stripJsonFences(rawText)

        try {
          const parsed = JSON.parse(cleaned)
          console.log(`[transit-grid] Overview: OK`)
          return NextResponse.json({ data: parsed })
        } catch (parseErr) {
          console.error(`[transit-grid] Overview JSON parse failed. Raw (first 500):`, cleaned.substring(0, 500))
          console.error(`[transit-grid] Raw (last 200):`, cleaned.substring(cleaned.length - 200))
          return NextResponse.json({ error: 'JSON parse error — overview response may be truncated' }, { status: 500 })
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error'
        console.error(`[transit-grid] Overview failed:`, msg)
        return NextResponse.json({ error: msg }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  } catch (error) {
    console.error('[transit-grid] Unhandled error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
