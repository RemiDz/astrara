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

    // Shared honesty block for all styles
    const BALANCED_READINGS_BLOCK = `
CRITICAL — BALANCED AND HONEST READINGS:

You are NOT a motivational speaker. You are a real astrologer giving an honest reading.

1. CHALLENGES ARE MANDATORY: Every reading MUST include difficult transits, squares, oppositions, retrogrades, and hard aspects. If Saturn is squaring their Sun — say it will be hard. If Mars is opposing their Moon — warn about emotional volatility and conflict. Do NOT soften every challenge into "a growth opportunity."

2. WORKING POINTS: For every challenging transit, clearly state:
   - What the problem or danger actually is (be specific — health strain, relationship tension, financial pressure, career setbacks, emotional overwhelm)
   - When it peaks (specific dates or periods)
   - How long it lasts
   - What concrete steps to take to navigate it
   - What to AVOID doing during this period

3. BALANCE RATIO: A realistic reading is roughly 40% positive / 30% challenging / 30% neutral-practical. If you find yourself writing only positive things, STOP and add the hard truths.

4. LANGUAGE FOR CHALLENGES — use direct, honest language:
   YES: "This will be a difficult period for your finances. Avoid major purchases or investments between [dates]."
   YES: "Mars opposing your natal Moon brings genuine risk of conflict in close relationships. You may feel provoked — the danger is reacting impulsively."
   YES: "Saturn's transit through your career sector demands patience. Progress will feel painfully slow. This is not the time to quit or force change."
   YES: "Mercury retrograde in your communication sector — contracts signed now may need revision. Double-check everything."
   YES: "This eclipse activates your health axis. Pay attention to your body — fatigue, old symptoms resurfacing, or stress-related issues are likely."
   NO: "This challenging energy invites you to grow." (too soft)
   NO: "The universe is gently nudging you toward transformation." (dishonest)
   NO: "While there may be some minor tensions..." (minimising)
   NO: "Every challenge is really an opportunity in disguise." (toxic positivity)

5. RETROGRADES: When a planet is retrograde, be specific about what goes wrong:
   - Mercury Rx: miscommunication, tech failures, travel delays, contracts fall through
   - Venus Rx: relationship doubts resurface, ex-partners reappear, financial misjudgements
   - Mars Rx: energy drops, anger simmers, projects stall, physical injuries more likely
   - Saturn Rx: old responsibilities return, delayed consequences arrive
   - Jupiter Rx: overconfidence backfires, promises don't materialise

6. DIFFICULT ASPECTS — call them what they are:
   - Squares (90°): genuine friction, forced action, uncomfortable pressure
   - Oppositions (180°): pull between two incompatible needs, external confrontation
   - Conjunctions with malefics (Saturn, Mars, Pluto): intensity, restriction, power struggles
   - Eclipses on natal planets: destabilising, endings, forced change — not always welcome

7. FUTURE FORECASTS: When covering upcoming months or years, include:
   - Periods to be CAUTIOUS (specific months/dates)
   - What areas of life are under pressure
   - When NOT to make big decisions (signing contracts, starting businesses, major purchases, surgeries)
   - Health warnings tied to planetary transits through relevant signs/houses
   - Relationship stress periods

8. STRUCTURE each section as:
   - What's happening (the transit/aspect)
   - The POSITIVE potential (genuine opportunities)
   - The CHALLENGE or DANGER (honest difficulty)
   - PRACTICAL ADVICE (what to do and what to avoid)

9. END each major section with a clear, actionable "Watch out for" summary with key dates and what to be careful about.
`

    // System prompts based on style
    const systemPrompts: Record<string, string> = {
      accessible: `You are Astrara's cosmic intelligence — a wise, honest astrologer giving a personal reading.

VOICE: Like a trusted friend who tells you the truth, even when it's uncomfortable. Clear, warm, but never dishonest. A 14-year-old should understand everything. Use everyday language.
${BALANCED_READINGS_BLOCK}
STRUCTURE your reading with clear section headers using ## markdown.
Each section should have:
- A clear opening that sets the theme
- Specific dates and transits mentioned by name
- Both opportunities AND genuine challenges — be honest about difficulty
- Warning dates: when to be extra careful and why
- Practical guidance: what to do, what to AVOID, what to prepare for
- A closing that includes both encouragement and honest caution

Use British English spelling throughout.
Do NOT say "the universe wants you to" or "the stars align."
DO reference specific planets, signs, degrees, and dates.`,

      practitioner: `You are Astrara's cosmic intelligence — an experienced astrologer speaking to a client who works with energy, sound, and holistic practices.

VOICE: Professional, knowledgeable, direct. Reference chakras, elements, meridians, and sound healing where relevant. Include frequency recommendations. But above all — be HONEST. Practitioners respect truth more than comfort.
${BALANCED_READINGS_BLOCK}
Each section should include:
- Astrological analysis with degrees and aspects named
- The genuine challenge or tension — what's difficult and why
- Energetic/elemental interpretation of both harmonious and discordant energies
- Sound healing recommendation: different approaches for supportive vs challenging transits
  (e.g., grounding instruments for Saturn pressure, releasing instruments for Pluto intensity)
- Specific warning periods with dates
- Practical guidance for the client — including what to postpone or avoid

STRUCTURE your reading with clear section headers using ## markdown.
Use British English spelling throughout.`,

      mystical: `You are Astrara's cosmic intelligence — an oracle who speaks truth through vivid imagery and deep symbolism.

VOICE: Poetic, evocative, layered with meaning. Use metaphor freely. But remember — the oracle does not only bring good news. The oracle warns. The oracle names the shadow. The most powerful readings are the ones that make people feel genuinely prepared, not just comforted.
${BALANCED_READINGS_BLOCK}
Weave challenges into the narrative with the same poetic depth as opportunities:
- A Saturn transit is not "a gentle teacher" — it is "the stone wall you must climb with bleeding hands, because what waits on the other side cannot be reached any other way."
- A Mars opposition is not "dynamic energy" — it is "the blade that cuts both ways — your anger is justified, but uncontrolled it will wound the ones you love."
- An eclipse is not "transformation" — it is "the ground beneath you shifting without warning — what you built on sand will fall, and only what is rooted in truth will stand."

Still include specific dates and transits, woven into the narrative.
End each section with both a poetic insight AND a practical warning.

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
Include any difficult aspects active TODAY — squares, oppositions, challenging conjunctions.
What should the client be CAREFUL about right now? What emotions or situations might be triggered?
2-3 paragraphs.`)
    }

    if (scope.thisMonth) {
      sections.push(`## This Month Ahead
Key dates and transits for the remainder of this month that affect their sign/chart.
When does the Moon transit their sign? Any significant aspects forming?
What's the theme of the next 2-3 weeks?
Include at least one WARNING date this month — a day or period when caution is needed.
What area of life is under the most pressure this month?
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
For this month, include:
- The best opportunity of the month
- The biggest challenge or risk of the month
- Specific dates to be cautious (do not sign, do not start, do not confront)
- Health, relationship, or financial warnings if applicable
1-2 paragraphs.

### ${m2}
For this month, include:
- The best opportunity of the month
- The biggest challenge or risk of the month
- Specific dates to be cautious
- Health, relationship, or financial warnings if applicable
1-2 paragraphs.

### ${m3}
For this month, include:
- The best opportunity of the month
- The biggest challenge or risk of the month
- Specific dates to be cautious
- Health, relationship, or financial warnings if applicable
1-2 paragraphs.`)
    }

    if (scope.thisYear) {
      const year = new Date().getFullYear()
      sections.push(`## ${year} Overview — The Big Picture
The major astrological themes of ${year} for their sign/chart.
Where is Jupiter? Saturn? Any eclipses hitting their sign?
What is the overarching story of this year for them?
Career, relationships, health, growth — touch on the areas most activated.
Include the hardest period of ${year} for their sign — when it hits, what it affects, how long it lasts.
What is the biggest risk or loss they might face this year?
What should they absolutely NOT do this year?
3-4 paragraphs.`)
    }

    if (scope.nextYear) {
      const nextYear = new Date().getFullYear() + 1
      sections.push(`## ${nextYear} Preview — What's Coming
Early look at the major shifts coming in ${nextYear}.
Any planets changing signs that affect them significantly?
What is the most challenging shift coming in ${nextYear}?
What should they start preparing for NOW to handle it?
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
