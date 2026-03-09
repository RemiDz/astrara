// Light Claude API call for social media captions

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { positions, moonPhase, moonIllumination, lang } = await req.json()

    if (!positions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const systemPrompt = `You are a social media copywriter for Astrara, an astrology app.
Write a TikTok/Instagram caption based on today's planetary positions.

RULES:
- 3-4 short paragraphs, punchy and scroll-stopping
- First line must be a HOOK that makes people stop scrolling
- Include 1 specific warning or challenge (honest, not sugarcoated)
- Mention 2-3 zodiac signs that are most affected today
- End with a subtle CTA to astrara.app
- Include 5-8 relevant hashtags at the end
- Keep it under 300 words
- Sound like a knowledgeable friend, not a brand
- British English spelling
- Do NOT use "the universe" or "the stars align"
- DO use specific degrees, sign names, and aspect names${lang === 'lt' ? '\n- Write the entire caption in Lithuanian. Use natural, conversational Lithuanian.' : ''}`

    const userPrompt = `Today's planetary positions:\n${
      positions.map((p: { glyph: string; name: string; sign: string; degree: number; retrograde: boolean }) =>
        `${p.glyph} ${p.name}: ${p.sign} ${p.degree}\u00B0${p.retrograde ? ' Rx' : ''}`
      ).join('\n')
    }\n\nMoon: ${moonPhase} (${moonIllumination}%)\n\nWrite a social media caption for today.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 800,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 })
    }

    const data = await response.json()
    if (!data.content || !Array.isArray(data.content)) {
      return NextResponse.json({ error: 'Unexpected API response' }, { status: 500 })
    }

    const caption = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')

    return NextResponse.json({ caption })

  } catch (error) {
    console.error('Social caption generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
