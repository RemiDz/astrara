import { NextRequest, NextResponse } from 'next/server'
import { computeMonthTransitData } from '@/lib/transit-computation'
import type { TransitDataForMonth } from '@/types/transit-grid'

const SYSTEM_PROMPT = `You are a professional astrologer providing detailed transit readings for a client consultation.
You are given exact planetary positions and aspects computed from NASA JPL-accurate ephemeris data.
Provide practitioner-quality interpretations — specific, insightful, and actionable.
Do NOT give vague horoscope-style generalisations.
Reference the actual planets and aspects in your interpretations.

CRITICAL — BALANCED AND HONEST READINGS:
1. CHALLENGES ARE MANDATORY: Include difficult transits, squares, oppositions, retrogrades.
2. For every challenging transit, state what the problem is, when it peaks, and how to navigate it.
3. BALANCE RATIO: Roughly 40% positive / 30% challenging / 30% neutral-practical.
4. Use direct, honest language for challenges — no "gentle nudges" or "growth opportunities" as euphemisms.
5. Be specific about what goes wrong during retrogrades.
6. Call difficult aspects what they are: squares = friction, oppositions = confrontation, malefic conjunctions = intensity.

Respond ONLY in valid JSON with no markdown formatting, backticks, or code fences.`

const OVERVIEW_SYSTEM_PROMPT = `You are a professional astrologer providing a 12-month overview synthesis for a client consultation.
You are given monthly summaries computed from NASA JPL-accurate ephemeris data.
Synthesise year-long trends, identify peak months, and provide trajectory analysis.
Be honest about difficult periods — name them clearly.

Respond ONLY in valid JSON with no markdown formatting, backticks, or code fences.`

function buildMonthPrompt(data: TransitDataForMonth, language: string, birthData?: string): string {
  const pos1 = data.positions_1st.map(p =>
    `${p.glyph} ${p.name}: ${p.sign} ${p.degree}°${p.retrograde ? ' Rx' : ''}`
  ).join('\n')

  const pos15 = data.positions_15th.map(p =>
    `${p.glyph} ${p.name}: ${p.sign} ${p.degree}°${p.retrograde ? ' Rx' : ''}`
  ).join('\n')

  const asp1 = data.aspects_1st.map(a =>
    `${a.planet1Glyph} ${a.planet1} ${a.symbol} ${a.planet2Glyph} ${a.planet2} (${a.type}, orb ${a.orb}°, ${a.isApplying ? 'applying' : 'separating'})`
  ).join('\n')

  const asp15 = data.aspects_15th.map(a =>
    `${a.planet1Glyph} ${a.planet1} ${a.symbol} ${a.planet2Glyph} ${a.planet2} (${a.type}, orb ${a.orb}°, ${a.isApplying ? 'applying' : 'separating'})`
  ).join('\n')

  const ingresses = data.ingresses.length > 0 ? `Sign ingresses this month:\n${data.ingresses.join('\n')}` : 'No sign ingresses this month.'
  const retrogrades = data.retrogrades.length > 0 ? `Retrograde activity:\n${data.retrogrades.join('\n')}` : 'No retrograde stations this month.'
  const moonPhases = data.moonPhases.length > 0 ? `Moon phases:\n${data.moonPhases.join('\n')}` : ''

  const langInstruction = language === 'lt'
    ? '\n\nIMPORTANT: Write ALL text content (key_theme, full_reading, practical_guidance, category_effect, interpretation, dates_to_watch, dominant_theme, opportunities, challenges, interrelations) in Lithuanian. Use proper Lithuanian astrological terminology. Keep planet names and symbols in their standard form.'
    : '\n\nWrite all content in British English.'

  const birthContext = birthData ? `\n\nClient birth data:\n${birthData}\nAccount for personal transits (transiting planets aspecting natal positions).` : '\n\nGenerate general transit readings (no birth chart provided).'

  return `Month: ${data.monthLabel}

Planetary positions (1st of month):
${pos1}

Planetary positions (15th of month):
${pos15}

Major aspects (1st of month):
${asp1}

Major aspects (15th of month):
${asp15}

${ingresses}
${retrogrades}
${moonPhases}
${birthContext}
${langInstruction}

Generate transit readings for this month across 5 life categories plus a monthly summary.
Return JSON in this exact structure:
{
  "month": "${data.monthLabel}",
  "categories": {
    "finance": {
      "impact_score": <1-10>,
      "key_theme": "<1-2 sentence headline>",
      "full_reading": "<3-5 sentences practitioner-quality interpretation>",
      "planetary_breakdown": [
        {
          "planet": "<name>",
          "symbol": "<glyph>",
          "position": "<sign degree°>",
          "aspects": [
            { "type": "<aspect name>", "symbol": "<aspect glyph>", "target": "<planet name>", "target_symbol": "<planet glyph>", "interpretation": "<1 sentence>" }
          ],
          "impact_contribution": <1-5>,
          "category_effect": "<1 sentence effect on this category>"
        }
      ],
      "practical_guidance": "<actionable advice>",
      "dates_to_watch": ["<date — event description>"]
    },
    "relationships": { <same structure> },
    "career": { <same structure> },
    "health": { <same structure> },
    "spiritual": { <same structure> },
    "monthly_summary": {
      "impact_score": <1-10 weighted average>,
      "dominant_theme": "<1-2 sentences>",
      "full_reading": "<3-5 sentences>",
      "key_players": ["<planet names>"],
      "opportunities": "<key opportunities>",
      "challenges": "<key challenges>",
      "interrelations": "<how categories interrelate>"
    }
  }
}`
}

function buildOverviewPrompt(monthSummaries: string[], language: string): string {
  const langInstruction = language === 'lt'
    ? '\n\nIMPORTANT: Write ALL text content in Lithuanian. Use proper Lithuanian astrological terminology.'
    : '\n\nWrite all content in British English.'

  return `Here are the monthly transit summaries for 12 months:

${monthSummaries.join('\n\n---\n\n')}
${langInstruction}

Synthesise these into a 12-month overview. Return JSON in this exact structure:
{
  "categories": {
    "finance": {
      "impact_score": <1-10 yearly average>,
      "year_trend": "<3-5 sentence year-long narrative>",
      "peak_months": ["<month names with highest impact>"],
      "trajectory": "<improving/challenging/stable/transformative>",
      "key_events": "<major planetary ingresses or retrogrades affecting this category>",
      "full_reading": "<3-5 sentence detailed overview>"
    },
    "relationships": { <same structure> },
    "career": { <same structure> },
    "health": { <same structure> },
    "spiritual": { <same structure> },
    "grand_summary": {
      "impact_score": <1-10>,
      "dominant_theme": "<the overarching theme of the year>",
      "full_reading": "<5-7 sentence grand synthesis>",
      "key_players": ["<most influential planets>"],
      "peak_months": ["<most intense months>"],
      "trajectory": "<overall year trajectory>"
    }
  }
}`
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
      // Compute transit data server-side
      const transitData = computeMonthTransitData(year, month)
      const userPrompt = buildMonthPrompt(transitData, language || 'en', birthData)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('Anthropic API error:', errText)
        return NextResponse.json({ error: 'Failed to generate reading' }, { status: 500 })
      }

      const data = await response.json()
      if (!data.content || !Array.isArray(data.content)) {
        return NextResponse.json({ error: 'Unexpected API response' }, { status: 500 })
      }

      const text = data.content
        .filter((block: { type: string }) => block.type === 'text')
        .map((block: { text: string }) => block.text)
        .join('')

      try {
        const parsed = JSON.parse(text)
        return NextResponse.json({ data: parsed })
      } catch {
        console.error('Failed to parse JSON response:', text.substring(0, 200))
        return NextResponse.json({ error: 'Invalid JSON in API response' }, { status: 500 })
      }

    } else if (type === 'overview') {
      if (!monthSummaries || !Array.isArray(monthSummaries)) {
        return NextResponse.json({ error: 'Missing month summaries for overview' }, { status: 400 })
      }

      const userPrompt = buildOverviewPrompt(monthSummaries, language || 'en')

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: OVERVIEW_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('Anthropic API error:', errText)
        return NextResponse.json({ error: 'Failed to generate overview' }, { status: 500 })
      }

      const data = await response.json()
      const text = data.content
        .filter((block: { type: string }) => block.type === 'text')
        .map((block: { text: string }) => block.text)
        .join('')

      try {
        const parsed = JSON.parse(text)
        return NextResponse.json({ data: parsed })
      } catch {
        console.error('Failed to parse overview JSON:', text.substring(0, 200))
        return NextResponse.json({ error: 'Invalid JSON in overview response' }, { status: 500 })
      }
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  } catch (error) {
    console.error('Transit grid error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
