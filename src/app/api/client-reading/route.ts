// IMPORTANT: Set ANTHROPIC_API_KEY in Vercel Environment Variables
// Dashboard -> Project Settings -> Environment Variables (Production!)

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      style, language, scope, clientName, inputMode,
      zodiacSign, birthDate, birthTime,
      currentTransits, natalPositions,
    } = body

    if (!style || !scope) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // System prompts based on style
    const systemPrompts: Record<string, string> = {
      accessible: `You are Astrara's cosmic intelligence — a warm, wise astrologer giving a personal reading.

VOICE: Like a trusted friend who happens to know the sky intimately. Clear, warm, grounded.
A 14-year-old should understand everything. Use everyday language.
Never say "the universe wants you to" or "the stars align."
DO reference specific planets, signs, and dates — teach gently while you guide.

STRUCTURE your reading with clear section headers using ## markdown.
Each section should have:
- A clear opening that sets the theme
- Specific dates and transits mentioned by name
- Practical guidance: what to do, what to watch for, what to embrace
- A closing sentence that ties it together

Use British English spelling throughout.`,

      practitioner: `You are Astrara's cosmic intelligence — an experienced astrologer speaking to a client who works with energy, sound, and holistic practices.

VOICE: Professional but warm. Reference chakras, elements, meridians, and sound healing connections where relevant. Include frequency recommendations (solfeggio, planetary tones) for each major transit.
Mention which instruments would support each phase (singing bowls, gongs, tuning forks, monochord).

Each section should include:
- Astrological analysis with degrees and aspects named
- Energetic/elemental interpretation
- Sound healing recommendation (frequency + instrument + approach)
- Practical guidance for the client

STRUCTURE your reading with clear section headers using ## markdown.
Use British English spelling throughout.`,

      mystical: `You are Astrara's cosmic intelligence — an oracle who speaks in vivid imagery and deep symbolism.

VOICE: Poetic, evocative, layered with meaning. Use metaphor freely — but always land on something practical. The language should feel like reading a beautiful book. Each paragraph should be quotable.
Reference mythology, archetypes, and natural phenomena.

Still include specific dates and transits, but weave them into the narrative rather than listing them.
End each section with an actionable insight wrapped in poetic language.

STRUCTURE your reading with clear section headers using ## markdown.
Use British English spelling throughout.`,
    }

    let systemPrompt = systemPrompts[style] || systemPrompts.accessible

    if (language === 'lt') {
      systemPrompt += `

IMPORTANT: Write the entire reading in Lithuanian. Use natural, fluent Lithuanian — not machine translation.
Use proper Lithuanian astrological terminology (e.g., Avinas for Aries, Jautis for Taurus, trigonalis for trine).
Maintain the same warmth and depth as the English version.`
    }

    // Build transit context
    const today = new Date().toISOString().split('T')[0]
    let transitContext = ''
    if (currentTransits && Array.isArray(currentTransits.positions)) {
      transitContext = `Current planetary positions (${today}):\n${
        currentTransits.positions.map((t: { glyph: string; name: string; sign: string; degree: number; retrograde: boolean }) =>
          `${t.glyph} ${t.name}: ${t.sign} ${t.degree}°${t.retrograde ? ' Rx' : ''}`
        ).join('\n')
      }\n\nMoon phase: ${currentTransits.moonPhase} (${currentTransits.moonIllumination}%)`
    }

    // Build client context
    let clientContext = ''
    if (inputMode === 'birthdate' && natalPositions) {
      clientContext = `Client's natal chart: Sun in ${natalPositions.sunSign}, Moon in ${natalPositions.moonSign}${
        natalPositions.risingSign ? `, Rising ${natalPositions.risingSign}` : ''
      }, born ${birthDate}${birthTime ? ` at ${birthTime}` : ''}`
    } else if (zodiacSign) {
      clientContext = `Client's Sun sign: ${zodiacSign}`
    }

    if (clientName) {
      clientContext += `\nClient's name: ${clientName}`
    }

    // Build sections based on scope
    const sections: string[] = []
    const name = clientName || 'the client'

    if (scope.currentSituation) {
      sections.push(`## Current Situation — Right Now
Analyse how today's exact transits affect ${name} specifically.
What planetary energies are active for their sign/chart TODAY?
What should they be aware of? What opportunities or challenges are present?
Include the Moon's current sign and phase and what it means for them.
2-3 paragraphs.`)
    }

    if (scope.thisMonth) {
      sections.push(`## This Month Ahead
Key dates and transits for the remainder of this month that affect their sign/chart.
When does the Moon transit their sign? Any significant aspects forming?
What's the theme of the next 2-3 weeks?
Mention specific dates where possible.
2-3 paragraphs.`)
    }

    if (scope.nextThreeMonths) {
      const now = new Date()
      const m1 = new Date(now.getFullYear(), now.getMonth() + 1).toLocaleDateString('en-GB', { month: 'long' })
      const m2 = new Date(now.getFullYear(), now.getMonth() + 2).toLocaleDateString('en-GB', { month: 'long' })
      const m3 = new Date(now.getFullYear(), now.getMonth() + 3).toLocaleDateString('en-GB', { month: 'long' })

      sections.push(`## Next 3 Months — Month by Month

### ${m1}
Key transits, lunations, and themes. What to focus on, what to avoid. 1-2 paragraphs.

### ${m2}
Key transits, lunations, and themes. 1-2 paragraphs.

### ${m3}
Key transits, lunations, and themes. 1-2 paragraphs.`)
    }

    if (scope.thisYear) {
      const year = new Date().getFullYear()
      sections.push(`## ${year} Overview — The Big Picture
The major astrological themes of ${year} for their sign/chart.
Where is Jupiter? Saturn? Any eclipses hitting their sign?
What is the overarching story of this year for them?
Career, relationships, health, growth — touch on the areas most activated.
3-4 paragraphs.`)
    }

    if (scope.nextYear) {
      const nextYear = new Date().getFullYear() + 1
      sections.push(`## ${nextYear} Preview — What's Coming
Early look at the major shifts coming in ${nextYear}.
Any planets changing signs that affect them significantly?
What should they start preparing for?
2-3 paragraphs.`)
    }

    const userPrompt = `${transitContext}\n\n${clientContext}\n\nGenerate the following reading sections:\n\n${sections.join('\n\n')}`

    // Scale max_tokens based on number of sections
    const sectionCount = Object.values(scope).filter(Boolean).length
    const maxTokens = Math.min(8000, 1500 + sectionCount * 1200)

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
        system: systemPrompt,
        messages: [
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to generate reading' }, { status: 500 })
    }

    const data = await response.json()
    if (!data.content || !Array.isArray(data.content)) {
      return NextResponse.json({ error: 'Unexpected API response' }, { status: 500 })
    }

    const reading = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')

    return NextResponse.json({ reading })

  } catch (error) {
    console.error('Client reading generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
