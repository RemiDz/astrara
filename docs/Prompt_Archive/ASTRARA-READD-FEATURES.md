# ASTRARA — Re-Add Features Lost in Git Reset

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `gigathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES. DO NOT ADD ANY GLOW OR SHADOW TO ZODIAC BADGES.

---

## Context

A git reset removed several working features. This spec re-adds them. All of these were previously confirmed working.

---

## FEATURE 1: Badge Background Colour Heat Map

The zodiac sign badges on the wheel should have their `backgroundColor` change based on planetary impact score. NO glow, NO boxShadow, NO textShadow, NO new elements. ONLY backgroundColor.

### Scoring

The `calculateZodiacImpact()` function may have been removed in the reset. If so, create it in `src/lib/zodiac-impact.ts`:

```typescript
export function calculateZodiacImpact(
  planets: PlanetPosition[],
  aspects: AspectData[]
): Record<string, number> {
  const elementSigns: Record<string, string[]> = {
    fire: ['Aries', 'Leo', 'Sagittarius'],
    earth: ['Taurus', 'Virgo', 'Capricorn'],
    air: ['Gemini', 'Libra', 'Aquarius'],
    water: ['Cancer', 'Scorpio', 'Pisces'],
  };

  const rulers: Record<string, string> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Pluto',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Uranus', Pisces: 'Neptune',
  };

  const scores: Record<string, number> = {};
  const allSigns = Object.values(elementSigns).flat();
  allSigns.forEach(s => scores[s] = 0);

  // Planet presence (weighted)
  for (const planet of planets) {
    const sign = planet.sign || planet.zodiacSign;
    if (!sign || !scores.hasOwnProperty(sign)) continue;
    const weight = (planet.name === 'Sun') ? 3.0
      : (planet.name === 'Moon') ? 2.5
      : (planet.name === 'Mars') ? 2.0
      : ['Mercury', 'Venus', 'Jupiter', 'Saturn'].includes(planet.name) ? 1.5
      : 1.0;
    scores[sign] += weight;
  }

  // Aspect involvement
  for (const aspect of aspects) {
    if (aspect.orb > 5) continue;
    const orbFactor = Math.max(0, 1 - aspect.orb / 5);
    const aspectWeight = aspect.type === 'conjunction' ? 2.0
      : aspect.type === 'opposition' ? 1.8
      : aspect.type === 'square' ? 1.5
      : aspect.type === 'trine' ? 1.0
      : 0.8;
    const boost = orbFactor * aspectWeight;
    if (aspect.planet1Sign) scores[aspect.planet1Sign] = (scores[aspect.planet1Sign] || 0) + boost;
    if (aspect.planet2Sign) scores[aspect.planet2Sign] = (scores[aspect.planet2Sign] || 0) + boost;
  }

  // Ruling planet activity
  for (const [sign, ruler] of Object.entries(rulers)) {
    for (const aspect of aspects) {
      if (aspect.orb > 5) continue;
      if (aspect.planet1 === ruler || aspect.planet2 === ruler) {
        const orbFactor = Math.max(0, 1 - aspect.orb / 5);
        scores[sign] += orbFactor * 0.5;
      }
    }
  }

  // Normalise to 0–1
  const max = Math.max(...Object.values(scores), 1);
  for (const sign of Object.keys(scores)) {
    scores[sign] = scores[sign] / max;
  }

  return scores;
}
```

Adapt property names (sign, zodiacSign, planet1Sign, etc.) to match the actual data shapes in `useAstroData`.

### Calculate in page.tsx

```typescript
const zodiacImpact = useMemo(
  () => calculateZodiacImpact(planets, aspects),
  [planets, aspects]
);
```

Pass `zodiacImpact` as a prop through `AstroWheel3DWrapper` → `AstroWheel3D`.

### Apply to badges

In `AstroWheel3D.tsx`, find where zodiac glyph badges are rendered. Each badge currently has `background: 'transparent'`. Replace with:

```typescript
const signId = sign.name; // however the sign name is accessed
const score = zodiacImpact?.[signId] ?? 0;

const backgroundColor = score >= 0.7
  ? 'rgba(220, 50, 50, 0.35)'
  : score >= 0.4
    ? 'rgba(220, 140, 0, 0.30)'
    : score >= 0.2
      ? 'rgba(200, 175, 50, 0.25)'
      : 'transparent';
```

Set this as the badge's `backgroundColor`. Do NOT add boxShadow, textShadow, or any other property.

---

## FEATURE 2: Lithuanian Grammar Fix

In the mother shape floating label (`CrystallineCore.tsx`), zodiac sign names after "į" (into) need accusative case.

Add this lookup and use it when generating Lithuanian ingress labels:

```typescript
const ZODIAC_ACCUSATIVE_LT: Record<string, string> = {
  'Aries': 'Aviną', 'Taurus': 'Jautį', 'Gemini': 'Dvynius',
  'Cancer': 'Vėžį', 'Leo': 'Liūtą', 'Virgo': 'Mergelę',
  'Libra': 'Svarstykles', 'Scorpio': 'Skorpioną', 'Sagittarius': 'Šaulį',
  'Capricorn': 'Ožiaragį', 'Aquarius': 'Vandenį', 'Pisces': 'Žuvis',
};
```

When building the Lithuanian label for ingress events (pattern: "[Planet] įeina į [Sign]"), use `ZODIAC_ACCUSATIVE_LT[sign]` instead of the nominative form.

---

## FEATURE 3: Zodiac Modal — Impact Score + Transit Context

When user taps a zodiac sign and the detail modal opens (`WheelTooltip.tsx`), add contextual information ABOVE the existing generic sign description.

### 3A: Impact Score Bar

At the top of the modal content:

- Label: "Today's Impact" / "Šiandienos Poveikis"
- Score: `Math.round(zodiacImpact[signName] * 10)` displayed as N/10
- Horizontal progress bar: filled portion coloured by score
  - 1-3: `#4ADE80` (green)
  - 4-5: `#FFD700` (gold)
  - 6-7: `#FF8C00` (orange)
  - 8-10: `#FF4444` (red)
- Bar: `height: 6px`, `border-radius: 3px`, background `rgba(255,255,255,0.06)`
- Qualitative label: Quiet (1-2) / Mild (3-4) / Active (5-6) / Strong (7-8) / Intense (9-10)
- LT labels: Ramu / Švelnu / Aktyvu / Stipru / Intensyvu
- Summary line showing which planets are in that sign and how many aspects involve it

### 3B: Transit Cards

If any planets are currently in the tapped sign, show a "Currently in [Sign]" section:

For each planet in the sign:
- Planet glyph + name + degree
- One-line meaning from `planet-meanings.ts` content (these files already exist with 120 planet×sign combos in EN and LT)
- Planet's Cousto frequency
- Any active aspects this planet is forming

### 3C: Active Aspects

If any aspects involve planets in this sign, list them:
- Planet A glyph → aspect symbol → Planet B glyph (orb)
- Colour by aspect type: conjunction=#FFD700, square=#FF4444, trine=#60A5FA, opposition=#A78BFA, sextile=#4DCCB0
- Brief meaning from `aspect-meanings.ts`

### 3D: Modal Order

1. Impact Score Bar (new)
2. Currently in [Sign] — transit cards (new, only if planets present)
3. Active Aspects in [Sign] (new, only if aspects present)
4. Separator line
5. Existing sign description, attributes, sound healing

Pass `zodiacImpact`, `planets`, and `aspects` to `WheelTooltip`.

---

## FEATURE 4: KPI Card Explanations

In the Cosmic Pulse modal (`CrystalMessage.tsx` / kpi components), add a collapsible explanation under each KPI card.

Add a small "What does this mean?" / "Ką tai reiškia?" link under each KPI. Tapping expands a paragraph of explanation text. Tapping again collapses. Default state: collapsed.

Use `framer-motion` `AnimatePresence` for smooth height animation.

Explanation content for each KPI — keep it warm, practitioner-oriented, bilingual (EN + LT). Cover:
- Element Balance: what the four elements mean, how dominance affects the day
- Key Player: why this planet matters most today, frequency connection
- Cosmic Intensity: what the score means, high vs low intensity days
- Kp Index: geomagnetic field, how it affects sensitive people, healing session guidance
- Schumann Resonance: Earth's heartbeat, alpha-theta boundary, sound healing tuning
- Solar Activity: solar wind, flares, Bz component explained simply
- Planetary Aspects: what aspects are, how tighter orbs mean stronger influence

---

## Build Steps

1. Create/restore `calculateZodiacImpact()` in `src/lib/zodiac-impact.ts`
2. Calculate scores in page.tsx, pass through prop chain
3. Apply badge backgroundColor based on score — ONLY backgroundColor, nothing else
4. Add Lithuanian accusative case lookup for ingress labels
5. Add impact score bar to zodiac tap modal
6. Add transit cards and active aspects to zodiac tap modal
7. Add collapsible KPI explanations to Cosmic Pulse modal
8. Add all i18n keys to en.json and lt.json
9. Test: hot sign badges have warm background, cold signs stay transparent
10. Test: NO glow, NO shadow, NO halos on badges
11. Test: Lithuanian label shows correct grammar ("į Dvynius" not "į Dvyniai")
12. Test: zodiac tap modal shows impact score + transit info
13. Test: KPI explanations expand/collapse
14. Test: ALL other features still work
15. Run `npm run build` — no errors
16. **UPDATE `engine/ARCHITECTURE.md`**
17. Commit: `feat: re-add heat map badges, Lithuanian grammar, zodiac modal context, KPI explanations`
18. Push to **main** branch using `git push origin master:main`
