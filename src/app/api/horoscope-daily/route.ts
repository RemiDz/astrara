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
