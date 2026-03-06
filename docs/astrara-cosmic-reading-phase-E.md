# Astrara — Cosmic Reading: Phase E — Personal Readings (House-Based Interpretations)

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## MASTER ARCHITECTURE REFERENCE

Before implementing, read the master architecture document at:
**`src/features/cosmic-reading/ARCHITECTURE.md`**

This spec implements Section 3.4 (Whole Sign House System) and the personal reading layer. It builds on all previous phases: A (zodiac profile), B (content engine + templates), C (state machine + overlay UI), D (animations).

---

## PHASE E SCOPE

This phase creates:
1. Full personal reading templates — 12 signs × 12 houses for Moon, Sun, aspects, and retrogrades
2. Updates to `generateReading.ts` to populate `personalReading` field on every ReadingPhase
3. Updates to `ReadingSummaryCard.tsx` to show `personalSummary`
4. A personal summary generator

This phase does **NOT** touch:
- The Three.js / R3F scene or animations (Phase D)
- The state machine or overlay structure (Phase C)
- The zodiac selector or storage (Phase A)

**Deliverable**: Users who have set their Sun sign (or have birth data) see a "For You" section in every phase card with personalised house-based interpretation. The summary card includes a personal summary.

---

## CONTEXT: WHOLE SIGN HOUSE SYSTEM

When a user's Sun sign is known, we can determine which house each transiting planet activates:

- The user's Sun sign = their 1st house
- Each subsequent zodiac sign = next house number
- Example: User is Scorpio → Scorpio = 1st house, Sagittarius = 2nd, Capricorn = 3rd, ... Libra = 12th

The function `getHouseForTransit()` from `src/features/cosmic-reading/utils/zodiacHelpers.ts` (created in Phase A) already implements this.

Each house governs a life area. The `HOUSE_THEMES` from `houseTemplates.ts` (Phase B) provides these themes. Personal readings combine "what the planet is doing" (general) with "which area of YOUR life it touches" (house).

---

## STEP 1: Expand moonTemplates.ts with personal readings

**File**: `src/features/cosmic-reading/content/templates/moonTemplates.ts`

Add a `personalByHouse` record to `MoonInSignReading`:

```typescript
export interface MoonInSignReading {
  general: string
  themeKeywords: string[]
  personalByHouse: Record<number, string>  // house number (1-12) → personal reading
}
```

Update the existing `MOON_IN_SIGN` record. For EACH of the 12 signs, add 12 house readings (144 entries total).

### Writing Guidelines for Personal House Readings

Each personal reading should be 2-3 sentences that:
1. Name the house area naturally (don't say "your 6th house" — say "your daily routines and health habits")
2. Combine the Moon-in-sign energy with the house theme
3. Give actionable guidance specific to that life area
4. Use second person ("you may feel...", "this is a good time for you to...")

### Example Pattern

Moon in Aries, landing in user's...
- **1st house** (Self): "You feel an electric surge of personal confidence. Trust your instincts about who you are and what you want — bold self-expression is favoured."
- **4th house** (Home): "Restless energy stirs in your home life. You might feel the urge to rearrange, declutter, or have a direct conversation with family about something you've been holding back."
- **7th house** (Relationships): "Passion and directness colour your closest relationships. Speak honestly with your partner or collaborator — they'll respect your candour."
- **10th house** (Career): "An impulsive career idea may surface. Don't dismiss it — this Aries Moon activates your ambition. Take one bold step toward a professional goal."

Write ALL 144 entries (12 signs × 12 houses). Quality matters — each entry should feel specific and genuinely useful, not formulaic. Vary the sentence structures. Some can be encouraging, some cautionary, some reflective.

---

## STEP 2: Expand sunTemplates.ts with personal readings

**File**: `src/features/cosmic-reading/content/templates/sunTemplates.ts`

Add `personalByHouse` to `SunInSignReading`:

```typescript
export interface SunInSignReading {
  general: string
  themeKeywords: string[]
  personalByHouse: Record<number, string>
}
```

Write 144 entries (12 signs × 12 houses). The Sun represents conscious identity and vitality, so personal readings should focus on WHERE in the user's life that solar energy is most active.

### Example Pattern

Sun in Pisces, landing in user's...
- **1st house** (Self): "The Piscean Sun infuses your identity with heightened sensitivity and creative vision. Others may see you as more compassionate and intuitive than usual. Lean into this — your empathy is a strength."
- **5th house** (Creativity): "Your creative expression deepens profoundly. Artistic projects, playful exploration, and romantic connections all carry a dreamlike, inspired quality. Follow what moves you emotionally."
- **12th house** (Spirituality): "This is a potent time for your inner life. Meditation, journaling, and solitary reflection feel especially nourishing. You may have vivid dreams or unexpected spiritual insights."

---

## STEP 3: Expand aspectTemplates.ts with personal context

**File**: `src/features/cosmic-reading/content/templates/aspectTemplates.ts`

For aspects, personal readings work differently. An aspect involves TWO planets, each in a sign, each activating a different house for the user. The personal reading should address both houses.

Add a function:

```typescript
export function generatePersonalAspectReading(
  planet1Id: string,
  planet1Sign: string,   // ZodiacSign of planet1's current position
  planet2Id: string,
  planet2Sign: string,   // ZodiacSign of planet2's current position
  aspectType: AspectType,
  userSunSign: string    // ZodiacSign
): string
```

This function:
1. Calculates the house for each planet using `getHouseForTransit(userSunSign, planet1Sign)` and `getHouseForTransit(userSunSign, planet2Sign)`
2. Looks up house themes from `HOUSE_THEMES`
3. Composes a 2-3 sentence personal reading that connects both houses

### Example Output

"This conjunction links your 5th house of creativity with your 10th house of career — a powerful bridge between what brings you joy and what brings you recognition. Creative professional projects or public artistic expression are strongly favoured."

### Template Approach

Since writing unique text for every house pair × aspect type × planet pair is infeasible, use a composable template:

```typescript
const personalText = `This ${aspectDesc.name.toLowerCase()} connects your ${house1Theme.area} with your ${house2Theme.area}. ${getHouseInteractionText(house1, house2, aspectType)}`
```

Create a `getHouseInteractionText(house1: number, house2: number, aspectType: AspectType): string` helper that returns a sentence about how two life areas interact through the given aspect energy. Write at least:
- Specific text for when both houses are the SAME (planet in same sign as user's Sun sign → both in 1st house — "This energy concentrates powerfully in your sense of self")
- Specific text for key house axis pairs: 1-7 (self/relationships), 2-8 (resources/transformation), 4-10 (home/career), 5-11 (creativity/community)
- A general composable template for all other combinations

---

## STEP 4: Expand retrogradeTemplates.ts with personal context

**File**: `src/features/cosmic-reading/content/templates/retrogradeTemplates.ts`

Add `personalByHouse` to `RetrogradeReading`:

```typescript
export interface RetrogradeReading {
  general: string
  practiceAdvice: string
  personalByHouse: Record<number, string>  // Where the retrograde falls in user's chart
}
```

Write 12 house entries for each retrograde planet (Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto — 8 planets × 12 houses = 96 entries).

### Example Pattern

Mercury retrograde in user's...
- **3rd house** (Communication): "Mercury retrograde hits especially close to home for you — miscommunications with siblings, neighbours, or in daily exchanges are likely. Re-read messages before sending. Old conversations may resurface for resolution."
- **6th house** (Health): "Your daily routines may feel disrupted. Old health concerns could flare up briefly — take it as a prompt to revisit wellness habits you've neglected. Slow down at work."
- **10th house** (Career): "Professional communications need extra care. Double-check emails to superiors, review contracts thoroughly, and avoid launching major career initiatives until Mercury goes direct."

---

## STEP 5: Update generateReading.ts to populate personalReading

**File**: `src/features/cosmic-reading/content/generateReading.ts`

Modify each phase generator function to include `personalReading` when a `zodiacProfile` is provided.

### 5a. Moon Phase — personal reading

```typescript
function generateMoonPhase(moon, planets, zodiacProfile?): ReadingPhase {
  // ... existing general reading logic ...
  
  let personalReading: string | undefined
  if (zodiacProfile) {
    const house = getHouseForTransit(zodiacProfile.sunSign, moon.zodiacSign as ZodiacSign)
    const moonSignData = MOON_IN_SIGN[moon.zodiacSign as ZodiacSign]
    personalReading = moonSignData?.personalByHouse?.[house]
  }
  
  return {
    // ... existing fields ...
    personalReading,
  }
}
```

### 5b. Sun Phase — personal reading

Same pattern: get house for Sun's current sign relative to user's Sun sign, look up `personalByHouse`.

### 5c. Aspect Phase — personal reading

Use the new `generatePersonalAspectReading()` function. Pass both planets' current signs and the user's Sun sign.

### 5d. Retrograde Phase — personal reading

For the combined retrograde summary phase, generate personal readings for EACH retrograde planet and combine them into one paragraph:

```typescript
if (zodiacProfile) {
  const personalParts = retrogradePlanets.map(planet => {
    const house = getHouseForTransit(zodiacProfile.sunSign, planet.zodiacSign as ZodiacSign)
    const retroData = RETROGRADE_READINGS[planet.id as CelestialBodyId]
    return retroData?.personalByHouse?.[house] ?? ''
  }).filter(Boolean)
  
  personalReading = personalParts.join(' ')
}
```

### 5e. Frequency Phase — personal reading

For the frequency recommendation, add a personal touch:

```typescript
if (zodiacProfile) {
  const house = getHouseForTransit(zodiacProfile.sunSign, dominantPlanet.zodiacSign as ZodiacSign)
  const houseTheme = HOUSE_THEMES[house]
  personalReading = `As a ${capitalize(zodiacProfile.sunSign)}, this frequency resonates particularly with your ${houseTheme.area.toLowerCase()}. Consider a sound session focused on ${houseTheme.keywords.slice(0, 2).join(' and ')}.`
}
```

---

## STEP 6: Generate personal summary

**File**: `src/features/cosmic-reading/content/generateReading.ts`

Update the `generateSummary` function to produce `personalSummary` when a zodiac profile exists.

```typescript
function generateSummary(phases, zodiacProfile?): CosmicReading['summary'] {
  // ... existing general summary logic ...
  
  let personalSummary: string | undefined
  if (zodiacProfile) {
    // Identify the most activated houses across all phases
    const activatedHouses = new Set<number>()
    
    for (const phase of phases) {
      // Extract which houses are activated from celestialData
      if (phase.celestialData.sign) {
        activatedHouses.add(
          getHouseForTransit(zodiacProfile.sunSign, phase.celestialData.sign)
        )
      }
    }
    
    const houseAreas = Array.from(activatedHouses)
      .slice(0, 3)
      .map(h => HOUSE_THEMES[h].area.toLowerCase())
    
    personalSummary = `For you as a ${capitalize(zodiacProfile.sunSign)}, today's cosmic energy is most active in your ${houseAreas.join(', ')} areas. ${getPersonalAdvice(zodiacProfile.sunSign, phases)}`
  }
  
  return {
    // ... existing fields ...
    personalSummary,
  }
}
```

Create a `getPersonalAdvice(sunSign, phases)` helper that returns 1-2 sentences of personalised daily advice based on which houses are most strongly activated. This can be template-based:

- If 1st house active: "Focus on yourself today — your energy and presence are amplified."
- If 4th house active: "Home and family matters deserve your attention."
- If 7th house active: "Partnerships and close relationships take centre stage."
- If 10th house active: "Career and public reputation are highlighted — act with intention."
- Combine the top 2 active houses into a coherent sentence.

---

## STEP 7: Ensure PhaseCard renders personalReading correctly

Check that `PhaseCard.tsx` (from Phase C) already handles the `personalReading` field. It should:

1. Check if `phase.personalReading` exists and is non-empty
2. If yes, render the "For You" section with the divider and personal text
3. The sign name in the divider should come from the zodiac profile (e.g. "For You (Scorpio)")

This was designed in Phase C but may not have been fully wired since no personal readings existed then. Verify and fix if needed.

Also verify `ReadingSummaryCard.tsx` renders `summary.personalSummary` when present.

---

## STEP 8: Verify

After implementing, verify:

1. `npm run build` completes without errors
2. **With zodiac profile set** (e.g. Scorpio):
   - Moon phase card shows general reading + "For You (Scorpio)" section with house-specific text
   - Sun phase card shows general + personal
   - Aspect phases show general + personal (mentioning both activated houses)
   - Retrograde phase shows general + personal
   - Frequency phase shows general + personal (connecting frequency to user's activated house)
   - Summary card shows general summary + personal summary with activated house areas
3. **Without zodiac profile** (clear localStorage key `astrara_zodiac_profile`):
   - All phase cards show ONLY general readings — no "For You" section visible
   - Summary shows only general summary
4. **Different signs produce different readings**: Change profile to Aries, verify that personal readings reference different house areas than Scorpio
5. **Quality check**: Read through several personal readings. They should feel specific and useful, not robotic or repetitive. If any feel generic, improve them.
6. **No regressions**: Full reading flow still works end-to-end (button → selector → phases → animations → summary → close). All Phase D animations still function. All Phase C UI still renders correctly.

---

## CONTENT QUALITY GUIDELINES (same as Phase B, reinforced)

1. **Accessible to non-astrologers** — never say "your 6th house", say "your daily routines and health"
2. **Practitioner-friendly** — sound healers will read this to clients
3. **Warm but not fluffy** — specific, grounded, actionable
4. **British English spelling** — favour, colour, centre, practise (verb)
5. **2-3 sentences per personal reading** — concise but meaningful
6. **Varied sentence structures** — don't start every entry with "The Moon/Sun activates your..."
7. **No exclamation marks** — calm, considered tone

---

## TECHNICAL CONSTRAINTS

- **No UI layout changes** — PhaseCard and ReadingSummaryCard structure unchanged, just newly populated fields
- **No animation changes** — Phase D animations untouched
- **No state machine changes** — Phase C flow untouched
- **Git push**: `git push origin master:main` for Vercel deployment
- Import `getHouseForTransit` from `@/features/cosmic-reading/utils/zodiacHelpers`
- Import `HOUSE_THEMES` from `@/features/cosmic-reading/content/templates/houseTemplates`
- All new template text goes in existing template files — no new files needed
