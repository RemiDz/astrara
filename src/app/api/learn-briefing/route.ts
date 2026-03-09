import { NextRequest, NextResponse } from 'next/server'

const systemPrompt = `You are Astrara's cosmic intelligence — a warm, wise astrologer who explains
the current sky to someone who is just learning. Your voice is mystical but clear: a poet who also
gives practical advice. A 10-year-old should understand the meaning. A practitioner should appreciate
the depth.

You are given today's planetary positions. Generate a briefing covering:
1. A 2-sentence overview of the day's energy
2. Each planet's current position and what it means (2-3 sentences each)
3. The most significant aspects active today and what they mean practically
4. A sound healing recommendation (frequency + instruments) based on the dominant energies

Use British English. Be warm, not clinical. Be specific, not vague.
Do NOT use the word "cosmic" more than once.
Do NOT use phrases like "the universe is telling you" or "the stars align".
DO mention specific degrees, signs, and aspects by name — teach while you guide.`

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const { positions, lang = 'en' } = await req.json()

    if (!positions || !Array.isArray(positions)) {
      return NextResponse.json({ error: 'Missing positions data' }, { status: 400 })
    }

    const positionsSummary = positions.map((p: { name: string; zodiacSign: string; degreeInSign: number; isRetrograde: boolean }) =>
      `${p.name}: ${p.zodiacSign} ${p.degreeInSign}°${p.isRetrograde ? ' Rx' : ''}`
    ).join('\n')

    const langInstruction = lang === 'lt'
      ? '\n\nIMPORTANT: Write the entire response in Lithuanian. Use proper Lithuanian astrological terminology.'
      : ''

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt + langInstruction,
        messages: [
          {
            role: 'user',
            content: `Today's planetary positions:\n${positionsSummary}\n\nGenerate today's cosmic briefing.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to generate briefing' }, { status: 500 })
    }

    const data = await response.json()
    if (!data.content || !Array.isArray(data.content)) {
      return NextResponse.json({ error: 'Unexpected API response' }, { status: 500 })
    }

    const briefing = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')

    return NextResponse.json({ briefing })
  } catch (error) {
    console.error('Learn briefing error:', error)
    return NextResponse.json({ error: 'Failed to generate briefing' }, { status: 500 })
  }
}
