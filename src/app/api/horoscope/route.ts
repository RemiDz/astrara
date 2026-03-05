// IMPORTANT: Set ANTHROPIC_API_KEY in Vercel Environment Variables
// Dashboard -> Project Settings -> Environment Variables

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
${positions.map((p: { glyph: string; name: string; sign: string; degree: number; isRetrograde: boolean }) => `${p.glyph} ${p.name} in ${p.sign} at ${p.degree}\u00B0${p.isRetrograde ? ' (retrograde)' : ''}`).join('\n')}

MOON PHASE: ${moonPhase.name} (${moonPhase.illumination}% illumination)

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
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')

    return NextResponse.json({ horoscope })

  } catch (error) {
    console.error('Horoscope generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
