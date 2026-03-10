# Astrara — /social Page: Daily Social Media Captions

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use megathink for this task.

---

## Vision

Build a hidden `/social` route that generates daily social media captions and hooks for TikTok and Instagram. You screen-record the Astrara wheel spinning, then come to this page to grab ready-to-post text — hooks, captions, hashtags, and story text overlays. Same pattern as shumann.app/promo but tailored to Astrara's astrology data.

This page is for YOU only — not linked anywhere in the app.

---

## ⚠️ CRITICAL RULES

1. **Read all existing source files first** — understand the current routing, i18n, `useAstroData` hook, and existing component patterns.
2. **Do NOT touch /promo** — the Client Reading Studio stays as-is. This is a NEW route at `/social`.
3. **Use live astronomical data** — pull today's planetary positions, Moon phase, retrogrades, and active aspects from the existing `useAstroData` hook or `astronomy-engine` utilities already in the codebase.
4. **Match Astrara design system** — void-black, glassmorphism, silver/white structural, purple interactive.
5. **Do NOT use framer-motion.**
6. **Bilingual** — EN/LT using existing i18n system.
7. **Push to main** — `git push origin master:main`.

---

## Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  ✦ ASTRARA SOCIAL STUDIO           9 Mar 2026  🇬🇧 EN ▾ │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ── TODAY'S SKY AT A GLANCE ──                           │
│                                                           │
│  ☉ Sun: Pisces 18°                                       │
│  ☽ Moon: Virgo 4° · Waxing Gibbous 82%                  │
│  ☿ Mercury: Pisces 12° Rx                                │
│  ♀ Venus: Aries 25°                                      │
│  ♂ Mars: Cancer 8°                                       │
│  ♃ Jupiter: Gemini 15°                                   │
│  ♄ Saturn: Pisces 22°                                    │
│  Key aspect: ☉ trine ♃ · ♀ square ♇                     │
│                                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ── TIKTOK HOOKS (tap to copy) ──                        │
│                                                           │
│  1. "Mercury is retrograde in Pisces right now.          │
│      Here's what that actually means for you today 👇"    │
│                                                [📋 Copy] │
│                                                           │
│  2. "The Moon is in Virgo today and your energy           │
│      is about to shift. Watch this 👀"                    │
│                                                [📋 Copy] │
│                                                           │
│  3. "POV: you check the actual sky and realise why        │
│      today felt so intense"                               │
│                                                [📋 Copy] │
│                                                           │
│  4. "If you're a [top 3 affected signs] — pay             │
│      attention to this ⚠️"                                │
│                                                [📋 Copy] │
│                                                           │
│  5. "This is what the planets are actually doing           │
│      right now. Not horoscope fluff — real positions 🌌"  │
│                                                [📋 Copy] │
│                                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ── INSTAGRAM CAPTIONS (tap to copy) ──                  │
│                                                           │
│  📱 Reel Caption (short):                                │
│  "Mercury retrograde in Pisces (12°) — communications    │
│   swim rather than march today. Double-check everything   │
│   before you send it.                                     │
│                                                           │
│   Real planetary positions. Real-time. Free.              │
│   🔗 astrara.app                                         │
│                                                           │
│   #astrology #mercuryretrograde #cosmicweather            │
│   #piscesseason #astrara"                                 │
│                                                [📋 Copy] │
│                                                           │
│  📸 Post Caption (longer):                               │
│  [2-3 paragraph caption covering today's key transits,    │
│   what they mean practically, which signs are most        │
│   affected, and a CTA to the app]                         │
│                                                [📋 Copy] │
│                                                           │
│  📖 Story Text Overlays:                                 │
│  ┌─────────────────────────┐                              │
│  │ Slide 1: "Today's Sky"  │  [📋]                       │
│  │ Slide 2: Key transit     │  [📋]                       │
│  │ Slide 3: Warning/tip     │  [📋]                       │
│  │ Slide 4: CTA             │  [📋]                       │
│  └─────────────────────────┘                              │
│                                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ── HASHTAG SETS (tap to copy) ──                        │
│                                                           │
│  🔥 Trending today:                                      │
│  #mercuryretrograde #piscesseason #mooninvirgo            │
│  #astrology #cosmicweather                       [📋]    │
│                                                           │
│  🌙 Evergreen:                                           │
│  #astrology #zodiac #horoscope #spirituality              │
│  #planets #starsalign #cosmicenergy              [📋]    │
│                                                           │
│  🎵 Sound healing crossover:                             │
│  #soundhealing #frequencies #432hz #singingbowls          │
│  #astrology #cosmicsound #harmonicwaves          [📋]    │
│                                                           │
│  📱 TikTok growth:                                       │
│  #astrologytok #spiritualtok #fyp #viral                  │
│  #zodiacsigns #dailyhoroscope                    [📋]    │
│                                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ── AI ENHANCED CAPTION (optional) ──                    │
│                                                           │
│  [ ✦ Generate AI Caption ]                               │
│                                                           │
│  Uses Claude API to create a unique, contextual caption   │
│  based on today's exact planetary configuration.          │
│  Includes hooks, warnings, and affected signs.            │
│                                                           │
│  [Generated caption appears here with copy button]        │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Data Source

All content is generated from **live astronomical data** — the same `astronomy-engine` calculations the main app uses. Pull from the existing hooks/utilities:

```typescript
// Reuse existing astronomy utilities
// Get today's planetary positions, Moon phase, aspects, retrogrades
// These are already calculated somewhere in the codebase — find and reuse them
```

The page needs:
- All 10 planet positions (sign + degree + retrograde status)
- Moon phase name + illumination percentage
- Active aspects (conjunction, trine, square, opposition, sextile) between planets
- Which zodiac signs are most "activated" today (have the most planetary traffic or tense aspects)

---

## Content Generation Logic (No AI Needed for Most Content)

### TikTok Hooks — Template Engine

Generate 5-7 hooks dynamically from templates. The templates use today's data to fill in specifics:

```typescript
const generateHooks = (transits: TransitData) => {
  const hooks: string[] = []
  
  // Hook 1: Lead with the most dramatic transit
  const mostDramatic = findMostDramaticTransit(transits)
  // e.g., retrograde, eclipse, exact square/opposition
  hooks.push(`${mostDramatic.planet} is ${mostDramatic.description} right now. Here's what that actually means for you today 👇`)
  
  // Hook 2: Moon-based (changes daily)
  hooks.push(`The Moon is in ${transits.moon.sign} today and your energy is about to shift. Watch this 👀`)
  
  // Hook 3: POV format
  hooks.push(`POV: you check the actual sky and realise why today felt so ${getDayFeeling(transits)}`)
  
  // Hook 4: Sign callout (most affected signs)
  const affectedSigns = getTopAffectedSigns(transits, 3)
  hooks.push(`If you're a ${affectedSigns.join(', ')} — pay attention to this ⚠️`)
  
  // Hook 5: Educational/authority
  hooks.push(`This is what the planets are actually doing right now. Not horoscope fluff — real positions, calculated to the degree 🌌`)
  
  // Hook 6: Warning hook (if challenging aspects exist)
  const challengingAspect = findChallengingAspect(transits)
  if (challengingAspect) {
    hooks.push(`${challengingAspect.planet1} ${challengingAspect.aspectName} ${challengingAspect.planet2} today. Here's why you might be feeling off ⚡`)
  }
  
  // Hook 7: Curiosity gap
  hooks.push(`The sky looks like THIS right now and nobody's talking about it`)
  
  return hooks
}
```

**Helper functions to implement:**

```typescript
// Find the most newsworthy transit today
function findMostDramaticTransit(transits): Transit {
  // Priority: retrograde station > exact aspect (within 1°) > eclipse > 
  // planet changing signs > tight square/opposition > anything else
}

// Get the "vibe" of the day based on dominant aspects
function getDayFeeling(transits): string {
  // If lots of squares/oppositions: "intense" / "heavy" / "chaotic"
  // If lots of trines/sextiles: "flowing" / "electric" / "expansive"  
  // If retrogrades dominate: "stuck" / "foggy" / "backwards"
  // If Moon is void of course: "weird" / "ungrounded"
}

// Find which signs have the most planetary action or tension
function getTopAffectedSigns(transits, count: number): string[] {
  // Count planets per sign, weight by aspect difficulty
  // Signs with squares/oppositions hitting them rank higher
}

// Find the most challenging active aspect
function findChallengingAspect(transits): Aspect | null {
  // Return tightest square or opposition, preferring malefics (Mars, Saturn, Pluto)
}
```

### Instagram Captions

**Reel Caption (short):** 2-3 sentences about the most notable transit + practical meaning + CTA. Auto-generated from templates.

**Post Caption (longer):** 2-3 paragraphs covering:
1. Today's headline transit (what's happening in the sky)
2. What it means practically (who's affected, what to watch for)
3. A warning or challenge (keep it honest — same philosophy as the reading fix)
4. CTA: "Real planetary positions, calculated to the degree. Free. astrara.app"
5. Hashtags

**Story Text Overlays:** 4 short text snippets designed to be pasted onto Instagram story frames:
- Slide 1: "TODAY'S SKY · [date]" (title card)
- Slide 2: "[Most notable transit in 1 sentence]" (the hook)
- Slide 3: "⚠️ [Warning or tip for today]" (the value)
- Slide 4: "Track the planets live → astrara.app" (the CTA)

### Hashtag Sets

4 pre-built sets, each copyable with one tap:

1. **Trending today** — dynamically generated based on what's happening (e.g., #mercuryretrograde only appears when Mercury IS retrograde, #piscesseason only during Pisces season, #fullmoon only near full moon)
2. **Evergreen astrology** — static set that always works
3. **Sound healing crossover** — bridges to the Harmonic Waves ecosystem audience
4. **TikTok growth** — platform-specific discovery tags

### AI Enhanced Caption (Optional)

A button that calls the Claude API to generate a richer, more contextual caption. Uses a lighter prompt than the full reading — just 500-800 tokens:

```typescript
// API route: src/app/api/social-caption/route.ts

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
- DO use specific degrees, sign names, and aspect names`
```

---

## Copy Button Behaviour

Every copyable element gets a button:

```tsx
<button
  onClick={() => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }}
  className="text-xs text-white/30 hover:text-purple-400 transition-colors"
>
  {copied === id ? '✓ Copied' : '📋 Copy'}
</button>
```

---

## Bilingual

All UI labels in EN/LT. The generated hooks and captions should be in the currently selected language. When LT is selected:
- Hooks are in Lithuanian
- Captions are in Lithuanian  
- Hashtags stay in English (they perform better internationally)
- AI caption is generated in the selected language

Key translations:

| English | Lithuanian |
|---|---|
| Social Studio | Socialinė Studija |
| Today's Sky at a Glance | Šiandienos Dangus |
| TikTok Hooks | TikTok Kabliukai |
| Instagram Captions | Instagram Aprašymai |
| Reel Caption | Reel Aprašymas |
| Post Caption | Įrašo Aprašymas |
| Story Text Overlays | Stories Tekstai |
| Hashtag Sets | Grotažymių Rinkiniai |
| Trending today | Populiarūs šiandien |
| Evergreen | Universalūs |
| Sound healing crossover | Garso terapija |
| TikTok growth | TikTok augimas |
| Generate AI Caption | Generuoti AI Aprašymą |
| Copy | Kopijuoti |
| Copied | Nukopijuota |
| tap to copy | palieskite kopijuoti |
| Key aspect | Pagrindinis aspektas |

---

## File Structure

```
src/
├── app/
│   ├── social/
│   │   └── page.tsx                  ← NEW: /social page
│   └── api/
│       └── social-caption/
│           └── route.ts              ← NEW: optional AI caption endpoint
├── components/
│   ├── SocialStudio/
│   │   ├── SkyGlance.tsx             ← NEW: today's planetary overview
│   │   ├── TikTokHooks.tsx           ← NEW: generated hooks with copy
│   │   ├── InstagramCaptions.tsx     ← NEW: reel + post + story captions
│   │   ├── HashtagSets.tsx           ← NEW: 4 copyable hashtag groups
│   │   └── AiCaption.tsx             ← NEW: optional AI-generated caption
│   └── ... (existing components untouched)
├── lib/
│   └── social-content.ts             ← NEW: template engine + helper functions
└── i18n/
    └── ... (add new social.* keys to existing translation files)
```

---

## Quality Bar

- [ ] `/social` loads with today's live planetary data
- [ ] Sky overview shows all 10 planets with correct signs/degrees
- [ ] Retrogrades are marked (Rx)
- [ ] Active aspects are listed
- [ ] 5-7 TikTok hooks generated, each unique and data-driven
- [ ] All copy buttons work with "Copied" feedback
- [ ] Instagram reel caption is concise and punchy
- [ ] Instagram post caption is 2-3 paragraphs with hashtags
- [ ] Story overlays are 4 short text snippets
- [ ] Hashtag sets include at least 1 dynamic/trending set
- [ ] AI caption button calls API and renders result
- [ ] Language toggle switches all content EN ↔ LT
- [ ] Hashtags stay in English regardless of language selection
- [ ] `/social` is NOT linked from any navigation
- [ ] No regressions on `/` or `/promo`
- [ ] Mobile layout is clean (375px)
- [ ] `npm run build` passes
- [ ] Pushed to main

---

## Build Steps

1. Read existing source — find `useAstroData`, astronomy utilities, i18n pattern, API route pattern
2. Create `src/lib/social-content.ts` with template engine and helper functions
3. Create all SocialStudio components
4. Create the `/social` page composing the components
5. Create the `/api/social-caption` route (light Claude API call)
6. Add all i18n translations (EN + LT)
7. Test with today's actual data — verify hooks reference real transits
8. Test copy buttons on mobile
9. Test AI caption generation
10. Run `npm run build`
11. Push to **main** branch
12. Commit: `feat: /social page — daily social media caption studio with live astro data`
