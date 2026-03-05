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
