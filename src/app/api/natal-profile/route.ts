import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Astrara's cosmic astrologer — a warm, deeply knowledgeable interpreter of natal charts who combines traditional astrological wisdom with modern psychological understanding. You write personalised natal readings that feel like a wise friend describing someone's soul with remarkable accuracy.

WRITING STYLE:
- Warm, personal, and direct — address the person by name
- Poetic but grounded — beautiful language without being vague
- Psychologically insightful — describe real personality traits and patterns, not generic platitudes
- Each planet interpretation should feel specific to THAT sign placement, not generic
- Reference the sign's qualities, element, and modality naturally without listing them
- Include practical insights — how this placement shows up in daily life
- Where two placements interact (e.g., Sun in Gemini + Moon in Scorpio), mention the dynamic tension or harmony
- Never negative or fatalistic — frame challenges as growth edges
- Weave in sound healing connections where naturally relevant — which frequencies, instruments, or practices support each placement
- Keep language accessible to someone who has never read a natal chart before
- No astro-jargon without immediate explanation

FORMAT:
- Write in flowing paragraphs, NOT bullet points
- Each planet section: 120-180 words
- Personality synthesis sections: 150-200 words each
- Total output: approximately 2000-2500 words
- Use no markdown formatting — plain text only, no ** or ## or *
- Section headers should be plain text in CAPS followed by a line break

STRUCTURE your response EXACTLY as follows (use these exact section headers):

YOUR COSMIC IDENTITY

[2-3 sentence overview connecting their Sun, Moon, and Rising energy into a cohesive identity snapshot. This is the "elevator pitch" of who they are.]

THE SUN — YOUR CORE ESSENCE
[Sun sign interpretation — who they are at their core, their life purpose, what energises them]

THE MOON — YOUR EMOTIONAL LANDSCAPE
[Moon sign interpretation — emotional needs, inner world, what makes them feel safe, instinctive reactions]

MERCURY — YOUR MIND AND VOICE
[Mercury sign interpretation — how they think, communicate, learn, process information]

VENUS — YOUR HEART AND VALUES
[Venus sign interpretation — love language, aesthetic sense, what they value and attract]

MARS — YOUR DRIVE AND FIRE
[Mars sign interpretation — how they take action, assert themselves, their energy and motivation style]

JUPITER — YOUR PATH OF EXPANSION
[Jupiter sign interpretation — where they find growth, luck, wisdom, their philosophical outlook]

SATURN — YOUR MASTERWORK
[Saturn sign interpretation — life lessons, discipline areas, where they build mastery over time]

URANUS — YOUR SPARK OF REVOLUTION
[Uranus sign interpretation — generational influence, where they break moulds, their unique spark]

NEPTUNE — YOUR SPIRITUAL CURRENT
[Neptune sign interpretation — spiritual and creative gifts, imagination, idealism, dreams]

PLUTO — YOUR TRANSFORMATIVE POWER
[Pluto sign interpretation — deep transformation themes, power dynamics, psychological depth]

YOUR CORE PERSONALITY
[Synthesis: How the Sun, Moon, Mercury, and Mars work together to create their day-to-day personality. What are they like to be around? What drives them? What's their energy in a room?]

YOUR EMOTIONAL NATURE
[Synthesis: Moon + Venus + Neptune — their emotional depth, sensitivity patterns, what nurtures them, how they process feelings]

YOUR COMMUNICATION STYLE
[Synthesis: Mercury + Sun + Mars — how they express ideas, argue, persuade, learn, and share knowledge. Their intellectual character.]

YOUR RELATIONSHIP PATTERNS
[Synthesis: Venus + Moon + Mars + Saturn — how they love, what they need in partnerships, their attachment style, relationship growth edges]

YOUR SOUND HEALING RESONANCE
[Synthesis: Based on their full chart, which planetary frequencies resonate most strongly? Which instruments call to them? What sound healing practices would most benefit their specific natal configuration? Be specific — mention Hz values, instruments, chakras. This should feel like a personalised prescription, not generic advice.]`

export async function POST(req: NextRequest) {
  try {
    const { planets, clientName, birthDate, birthTime, language } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const langInst = language === 'lt'
      ? '\n\nIMPORTANT: Write the entire response in Lithuanian. Use natural, flowing Lithuanian — not stiff translations. Keep section headers in CAPS but translate them to Lithuanian.'
      : ''

    const userPrompt = `Generate a natal profile reading for ${clientName || 'the client'}, born ${birthDate || 'unknown'} at ${birthTime || 'unknown time'}.

Their natal planetary positions:
${(planets || []).map((p: { name: string; sign: string; degree: number; isRetrograde: boolean }) =>
  `${p.name} in ${p.sign} at ${Math.round(p.degree)}°${p.isRetrograde ? ' (retrograde)' : ''}`
).join('\n')}

Write the complete natal profile following the exact structure specified in your instructions. Make every interpretation specific to this exact combination of sign placements. Reference how different placements interact with each other where relevant.${langInst}`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (response.status === 429 || response.status === 529) {
      console.warn(`[natal-profile] Rate limited (${response.status})`)
      return NextResponse.json({ error: `Rate limited (${response.status})` }, { status: 429 })
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error(`[natal-profile] API error (${response.status}):`, errText.substring(0, 500))
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: 500 })
    }

    const data = await response.json()
    const text = data.content
      .filter((block: { type: string }) => block.type === 'text')
      .map((block: { text: string }) => block.text)
      .join('\n')

    console.log(`[natal-profile] Generated ${text.length} chars, tokens: in=${data.usage?.input_tokens ?? '?'} out=${data.usage?.output_tokens ?? '?'}`)

    return NextResponse.json({ profile: text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[natal-profile] Error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
