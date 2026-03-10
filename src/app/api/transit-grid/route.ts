import { NextRequest, NextResponse } from 'next/server'
import { computeMonthTransitData } from '@/lib/transit-computation'
import type {
  CategoryReading, MonthlySummary, MonthData,
  OverviewCategory, OverviewData,
  PlanetaryBreakdown, TransitAspect,
} from '@/types/transit-grid'

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a professional astrologer. You receive NASA JPL ephemeris data.
Give specific, insightful interpretations. Reference actual planets and aspects.
Balance: ~40% positive, ~30% challenging, ~30% practical.
Respond ONLY in valid JSON. No markdown, no backticks, no preamble.
Be extremely concise — each field is MAX 2 sentences. Total response under 800 tokens.`

const OVERVIEW_SYSTEM_PROMPT = `You are a professional astrologer synthesising a 12-month overview.
Identify year-long trends, peak months, trajectory. Be honest about difficulties.
Respond ONLY in valid JSON. No markdown, no backticks, no preamble.
Be extremely concise. Total response under 800 tokens.`

// ---------------------------------------------------------------------------
// Prompt builders — compact transit data + minimal JSON schema
// ---------------------------------------------------------------------------

function buildCompactMonthPrompt(year: number, month: number, language: string, birthData?: string): string {
  const data = computeMonthTransitData(year, month)

  const pos1 = data.positions_1st.map(p =>
    `${p.name} ${p.sign.substring(0, 3)} ${p.degree}°${p.retrograde ? ' Rx' : ''}`
  ).join(', ')

  const pos15 = data.positions_15th.map(p =>
    `${p.name} ${p.sign.substring(0, 3)} ${p.degree}°${p.retrograde ? ' Rx' : ''}`
  ).join(', ')

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

Return JSON with this EXACT structure (short keys, max 2 sentences per field):
{"finance":{"s":<1-10>,"t":"theme","r":"reading","p":["Planet1△Planet2"],"g":"guidance"},"relationships":{"s":0,"t":"","r":"","p":[],"g":""},"career":{"s":0,"t":"","r":"","p":[],"g":""},"health":{"s":0,"t":"","r":"","p":[],"g":""},"spiritual":{"s":0,"t":"","r":"","p":[],"g":""},"summary":{"s":0,"t":"","r":""}}
Keys: s=impact score 1-10, t=theme, r=reading, p=key planetary aspects, g=guidance. Keep ALL values SHORT.`
}

function buildOverviewPrompt(monthSummaries: string[], language: string): string {
  const lang = language === 'lt' ? 'Write ALL text in Lithuanian.' : 'Write in British English.'

  return `Monthly summaries:\n${monthSummaries.join('\n---\n')}
${lang}

Return JSON with this EXACT structure (short keys, concise):
{"finance":{"s":<1-10>,"t":"year trend","pk":["month"],"tr":"improving|challenging|stable|transformative"},"relationships":{"s":0,"t":"","pk":[],"tr":""},"career":{"s":0,"t":"","pk":[],"tr":""},"health":{"s":0,"t":"","pk":[],"tr":""},"spiritual":{"s":0,"t":"","pk":[],"tr":""},"grand":{"s":0,"t":"theme","r":"reading","pk":[],"tr":""}}
Keys: s=score 1-10, t=trend/theme, r=reading, pk=peak months, tr=trajectory. Keep ALL values SHORT.`
}

// ---------------------------------------------------------------------------
// Planet / aspect helpers for expanding compact responses
// ---------------------------------------------------------------------------

const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
  Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
}

const ASPECT_CHARS = ['△', '□', '☍', '☌', '⚹']
const ASPECT_NAMES: Record<string, string> = {
  '△': 'trine', '□': 'square', '☍': 'opposition', '☌': 'conjunction', '⚹': 'sextile',
}

function parseAspectStr(s: string): { p1: string; sym: string; p2: string } | null {
  for (const ch of ASPECT_CHARS) {
    const idx = s.indexOf(ch)
    if (idx > 0) {
      return { p1: s.substring(0, idx), sym: ch, p2: s.substring(idx + ch.length) }
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Expand compact month response → full MonthData
// ---------------------------------------------------------------------------

interface CompactCat { s: number; t: string; r: string; p: string[]; g: string }
interface CompactSum { s: number; t: string; r: string }
interface CompactMonth {
  finance: CompactCat; relationships: CompactCat; career: CompactCat
  health: CompactCat; spiritual: CompactCat; summary: CompactSum
}

function expandCategory(c: CompactCat): CategoryReading {
  const planetMap = new Map<string, TransitAspect[]>()

  for (const raw of (c.p ?? [])) {
    const parsed = parseAspectStr(raw)
    if (parsed) {
      if (!planetMap.has(parsed.p1)) planetMap.set(parsed.p1, [])
      planetMap.get(parsed.p1)!.push({
        type: ASPECT_NAMES[parsed.sym] ?? 'aspect',
        symbol: parsed.sym,
        target: parsed.p2,
        target_symbol: PLANET_GLYPHS[parsed.p2] ?? '',
        interpretation: '',
      })
    }
  }

  const breakdown: PlanetaryBreakdown[] = []
  for (const [name, aspects] of planetMap) {
    breakdown.push({
      planet: name,
      symbol: PLANET_GLYPHS[name] ?? name.charAt(0),
      position: '',
      aspects,
      impact_contribution: 3,
      category_effect: '',
    })
  }

  return {
    impact_score: c.s ?? 5,
    key_theme: c.t ?? '',
    full_reading: c.r ?? '',
    planetary_breakdown: breakdown,
    practical_guidance: c.g ?? '',
    dates_to_watch: [],
  }
}

function expandSummary(c: CompactSum): MonthlySummary {
  return {
    impact_score: c.s ?? 5,
    dominant_theme: c.t ?? '',
    full_reading: c.r ?? '',
    key_players: [],
    opportunities: '',
    challenges: '',
    interrelations: '',
  }
}

function expandMonth(compact: CompactMonth, monthLabel: string, monthKey: string): MonthData {
  return {
    month: monthLabel,
    monthKey,
    categories: {
      finance: expandCategory(compact.finance),
      relationships: expandCategory(compact.relationships),
      career: expandCategory(compact.career),
      health: expandCategory(compact.health),
      spiritual: expandCategory(compact.spiritual),
      monthly_summary: expandSummary(compact.summary),
    },
  }
}

// ---------------------------------------------------------------------------
// Expand compact overview response → full OverviewData
// ---------------------------------------------------------------------------

interface CompactOvCat { s: number; t: string; pk: string[]; tr: string }
interface CompactGrand { s: number; t: string; r: string; pk: string[]; tr: string }
interface CompactOverview {
  finance: CompactOvCat; relationships: CompactOvCat; career: CompactOvCat
  health: CompactOvCat; spiritual: CompactOvCat; grand: CompactGrand
}

function expandOverviewCat(c: CompactOvCat): OverviewCategory {
  return {
    impact_score: c.s ?? 5,
    year_trend: c.t ?? '',
    peak_months: c.pk ?? [],
    trajectory: c.tr ?? '',
    key_events: '',
    full_reading: c.t ?? '', // re-use trend as full reading
  }
}

function expandOverview(compact: CompactOverview): OverviewData {
  const g = compact.grand
  return {
    categories: {
      finance: expandOverviewCat(compact.finance),
      relationships: expandOverviewCat(compact.relationships),
      career: expandOverviewCat(compact.career),
      health: expandOverviewCat(compact.health),
      spiritual: expandOverviewCat(compact.spiritual),
      grand_summary: {
        impact_score: g.s ?? 5,
        dominant_theme: g.t ?? '',
        full_reading: g.r ?? '',
        key_players: [],
        peak_months: g.pk ?? [],
        trajectory: g.tr ?? '',
      },
    },
  }
}

// ---------------------------------------------------------------------------
// API call with retry
// ---------------------------------------------------------------------------

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
        const backoffs = [5000, 10000, 20000]
        const delay = backoffs[attempt] ?? 20000
        console.warn(`[transit-grid] Rate limited (${response.status}), retrying in ${delay / 1000}s (attempt ${attempt + 1}/${retries})...`)
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
    console.log(`[transit-grid] Tokens: in=${data.usage?.input_tokens ?? '?'} out=${data.usage?.output_tokens ?? '?'} stop=${stopReason}`)

    if (stopReason === 'max_tokens') {
      console.warn(`[transit-grid] WARNING: Truncated at ${maxTokens} tokens`)
    }

    return rawText
  }

  throw new Error('Exhausted retries')
}

// ---------------------------------------------------------------------------
// Parse raw API text → JSON with fence stripping + truncation detection
// ---------------------------------------------------------------------------

function parseResponse(rawText: string, label: string): Record<string, unknown> {
  const cleaned = stripJsonFences(rawText)

  if (!cleaned.endsWith('}')) {
    console.error(`[transit-grid] ${label} truncated. Last 100:`, cleaned.slice(-100))
    throw new Error('Response truncated')
  }

  try {
    return JSON.parse(cleaned) as Record<string, unknown>
  } catch {
    console.error(`[transit-grid] ${label} JSON parse failed. First 500:`, cleaned.substring(0, 500))
    console.error(`[transit-grid] Last 200:`, cleaned.substring(cleaned.length - 200))
    throw new Error('JSON parse error')
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, year, month, language, birthData, monthSummaries } = body

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    if (type === 'month') {
      const monthNum = month + 1
      console.log(`[transit-grid] Generating month: ${year}-${monthNum}`)
      const userPrompt = buildCompactMonthPrompt(year, month, language || 'en', birthData)
      if (DEBUG) console.log(`[transit-grid] Prompt: ${userPrompt.length} chars`)

      try {
        const rawText = await callAnthropicWithRetry(apiKey, SYSTEM_PROMPT, userPrompt, 1200)
        const compact = parseResponse(rawText, `Month ${year}-${monthNum}`) as unknown as CompactMonth

        // Expand compact → full MonthData
        const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`
        const data = computeMonthTransitData(year, month)
        const expanded = expandMonth(compact, data.monthLabel, monthKey)

        console.log(`[transit-grid] Month ${year}-${monthNum}: OK`)
        return NextResponse.json({ data: expanded })
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error'
        console.error(`[transit-grid] Month ${year}-${monthNum} failed:`, msg)
        return NextResponse.json({ error: msg }, { status: 500 })
      }

    } else if (type === 'overview') {
      if (!monthSummaries || !Array.isArray(monthSummaries)) {
        return NextResponse.json({ error: 'Missing month summaries' }, { status: 400 })
      }

      console.log(`[transit-grid] Generating overview from ${monthSummaries.length} months`)
      const userPrompt = buildOverviewPrompt(monthSummaries, language || 'en')

      try {
        const rawText = await callAnthropicWithRetry(apiKey, OVERVIEW_SYSTEM_PROMPT, userPrompt, 1200)
        const compact = parseResponse(rawText, 'Overview') as unknown as CompactOverview
        const expanded = expandOverview(compact)

        console.log(`[transit-grid] Overview: OK`)
        return NextResponse.json({ data: expanded })
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
