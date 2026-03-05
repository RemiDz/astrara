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
      return NextResponse.json({ error: 'Failed to generate horoscope', details: error }, { status: 500 })
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
