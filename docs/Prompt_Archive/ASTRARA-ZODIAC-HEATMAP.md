# ASTRARA — Zodiac Impact Heat Map: Colour-Coded Sign Activity

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This modifies the zodiac sign segment colours on the wheel to reflect planetary impact. All existing interactions (zodiac taps, planet taps, rotation, reading, audio, etc.) must continue working.

---

## Concept

Each of the 12 zodiac sign segments on the outer wheel ring gets a dynamic colour intensity based on how much planetary activity is affecting that sign right now. Signs with heavy planetary presence and tight aspects glow warm/hot (amber → red). Signs with no activity remain cool and dim. The wheel becomes a live heat map of cosmic activity.

---

## Impact Score Calculation

Create a function `calculateZodiacImpact(planets, aspects)` that returns a score for each of the 12 signs:

```typescript
function calculateZodiacImpact(
  planets: PlanetPosition[],
  aspects: AspectData[]
): Record<string, number> {
  // Initialise all 12 signs at 0
  const scores: Record<string, number> = {
    Aries: 0, Taurus: 0, Gemini: 0, Cancer: 0,
    Leo: 0, Virgo: 0, Libra: 0, Scorpio: 0,
    Sagittarius: 0, Capricorn: 0, Aquarius: 0, Pisces: 0,
  };

  // FACTOR 1: Planet presence (biggest impact)
  // A planet sitting IN a sign directly activates that sign
  for (const planet of planets) {
    const weight = getPresenceWeight(planet.name);
    scores[planet.sign] += weight;
  }

  // FACTOR 2: Aspect involvement
  // When two planets form a tight aspect, both signs they occupy get a boost
  for (const aspect of aspects) {
    const orbFactor = Math.max(0, 1 - (aspect.orb / 5)); // tighter orb = more impact
    const aspectWeight = getAspectWeight(aspect.type);
    scores[aspect.planet1Sign] += orbFactor * aspectWeight;
    scores[aspect.planet2Sign] += orbFactor * aspectWeight;
  }

  // FACTOR 3: Ruling planet activity
  // If a sign's ruling planet is involved in a tight aspect, the sign gets a small boost
  // (e.g. if Mars is in a tight square, Aries gets a secondary boost)
  const rulers: Record<string, string> = {
    Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon',
    Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Pluto',
    Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Uranus', Pisces: 'Neptune',
  };
  
  for (const [sign, ruler] of Object.entries(rulers)) {
    for (const aspect of aspects) {
      if (aspect.planet1 === ruler || aspect.planet2 === ruler) {
        const orbFactor = Math.max(0, 1 - (aspect.orb / 5));
        scores[sign] += orbFactor * 0.5; // smaller boost than direct involvement
      }
    }
  }

  // Normalise to 0-1 range
  const maxScore = Math.max(...Object.values(scores), 1); // avoid division by zero
  for (const sign of Object.keys(scores)) {
    scores[sign] = scores[sign] / maxScore;
  }

  return scores;
}
```

### Planet Presence Weights

Not all planets carry equal weight. Luminaries and personal planets have more felt impact:

```typescript
function getPresenceWeight(planetName: string): number {
  switch (planetName) {
    case 'Sun': return 3.0;      // strongest personal impact
    case 'Moon': return 2.5;     // emotional/daily impact
    case 'Mercury': return 1.5;  // communication/thought
    case 'Venus': return 1.5;    // relationships/values
    case 'Mars': return 2.0;     // action/energy
    case 'Jupiter': return 1.5;  // expansion/luck
    case 'Saturn': return 1.5;   // structure/lessons
    case 'Uranus': return 1.0;   // generational
    case 'Neptune': return 1.0;  // generational
    case 'Pluto': return 1.0;    // generational
    default: return 1.0;
  }
}
```

### Aspect Type Weights

Some aspects are more dynamic than others:

```typescript
function getAspectWeight(aspectType: string): number {
  switch (aspectType.toLowerCase()) {
    case 'conjunction': return 2.0;  // strongest - fusion
    case 'opposition': return 1.8;   // very dynamic - polarity
    case 'square': return 1.5;       // tension/action
    case 'trine': return 1.0;        // harmonious flow
    case 'sextile': return 0.8;      // gentle opportunity
    default: return 0.5;
  }
}
```

---

## Colour Mapping: Score → Visual

Map the normalised 0-1 score to a colour gradient. The gradient goes from the sign's current dim state (cool) through warm to hot:

### Colour Stops

```
Score 0.0 - 0.15  →  No change — keep the existing element colour at current dim opacity
                      (most signs will be here on any given day)

Score 0.15 - 0.4  →  Subtle warm tint — blend toward amber
                      Emissive colour: lerp from current element colour toward #FFD700 (gold)
                      Emissive intensity: 0.1 → 0.2

Score 0.4 - 0.7   →  Warm glow — clearly amber/gold
                      Emissive colour: #FFD700 to #FF8C00 (gold to orange)
                      Emissive intensity: 0.2 → 0.4

Score 0.7 - 1.0   →  Hot — deep amber to red-hot
                      Emissive colour: #FF8C00 to #FF4444 (orange to red)
                      Emissive intensity: 0.4 → 0.6
```

### Implementation in the Wheel

Find where zodiac sign segments are rendered in `AstroWheel3D.tsx`. Currently each segment has:
- A base colour by element (fire=#FF6B4A, earth=#4ADE80, air=#60A5FA, water=#A78BFA)
- Low opacity (0.08-0.1)
- An emissive tint

Modify EACH segment's material to incorporate the impact score:

1. **Keep the base element colour** — do not replace it entirely. The element colour identity should still be recognisable
2. **Add emissive boost** — blend the emissive colour from the element colour toward the heat map colour based on the score
3. **Increase opacity slightly** for high-impact signs — from the base 0.08-0.1 up to max 0.2 for the hottest sign. This makes impacted signs more visually solid/present
4. **Add a subtle pulse** to high-impact signs (score > 0.5): emissive intensity oscillates by ±0.05 at `2 Hz` — the sign gently pulses with energy. Low-impact signs do not pulse.

### Colour Lerp Formula

```typescript
// In useFrame or material update:
const score = zodiacImpactScores[signName]; // 0 to 1

// Base element colour
const baseColor = new THREE.Color(elementColors[element]);

// Heat colour based on score
const heatColor = new THREE.Color();
if (score < 0.15) {
  heatColor.copy(baseColor); // no change
} else if (score < 0.4) {
  heatColor.copy(baseColor).lerp(new THREE.Color('#FFD700'), (score - 0.15) / 0.25);
} else if (score < 0.7) {
  heatColor.set('#FFD700').lerp(new THREE.Color('#FF8C00'), (score - 0.4) / 0.3);
} else {
  heatColor.set('#FF8C00').lerp(new THREE.Color('#FF4444'), (score - 0.7) / 0.3);
}

// Apply to segment material
segmentMaterial.emissive = heatColor;
segmentMaterial.emissiveIntensity = 0.05 + score * 0.55;
segmentMaterial.opacity = 0.08 + score * 0.12;

// Pulse for hot signs
if (score > 0.5) {
  segmentMaterial.emissiveIntensity += 0.05 * Math.sin(time * 4.0);
}
```

---

## Smooth Transitions

When the user navigates days (Yesterday/Tomorrow), the impact scores change. The colours must transition smoothly:

- Store previous scores and target scores
- Lerp between them over 1 second in `useFrame`
- This creates a smooth heat map shift — signs warming up or cooling down as the day changes
- Do NOT snap instantly — the smooth transition is part of the visual appeal

---

## Zodiac Badge Glow

The zodiac glyph badges (the purple Html overlay buttons) could also reflect the heat map:

- High-impact signs (score > 0.5): add a subtle coloured border glow or background tint matching the heat colour
- This reinforces the heat map on the badge layer, not just the ring segments
- Keep it subtle — maybe just `border-color` shifts from the current `rgba(168,85,247,0.4)` toward the heat colour
- If this adds too much complexity or visual noise, skip it — the ring segments alone are enough

---

## Does NOT Affect

- Planet orb colours — planets keep their own colours
- Planet tap behaviour
- Zodiac tap behaviour — tapping still opens the sign detail panel
- Cosmic Reading — during reading, the heat map should remain visible (it provides context for the reading)
- Mother shape connections — these are independent
- The sacred geometry polygon lines
- Any audio behaviour

---

## Performance

- Impact calculation runs once when astro data changes (day navigation) — not every frame
- Colour lerping in useFrame is just a few colour operations per segment — negligible
- No new geometries, no new meshes, no new materials — just modifying existing material properties

---

## Build Steps

1. Read `AstroWheel3D.tsx` — find where zodiac sign segments are rendered and how their materials are set up
2. Read `useAstroData` — understand how planet positions and aspects are structured
3. Create `calculateZodiacImpact()` utility function with planet presence, aspect involvement, and ruling planet factors
4. Integrate impact scores into the zodiac segment material updates (emissive colour, intensity, opacity)
5. Add smooth score transition (lerp over 1s when day changes)
6. Add subtle pulse animation for high-impact signs (score > 0.5)
7. Optionally add badge glow for high-impact signs
8. Test: today's view — signs with planets clearly glow warmer than empty signs
9. Test: sign with Sun shows as one of the hottest
10. Test: empty signs (no planets, no aspects) remain cool and dim
11. Test: navigate days — heat map smoothly shifts
12. Test: the colour changes don't break zodiac tap targets
13. Test: Cosmic Reading — heat map stays visible
14. Test: Heliocentric View — heat map applies to geocentric only (if zodiac ring is hidden in helio, no changes needed)
15. Test: mobile 375px — colour differences clearly visible
16. Test: ALL other features still work
17. Run `npm run build` — no errors
18. **UPDATE `engine/ARCHITECTURE.md`** — document the zodiac impact heat map system, scoring algorithm, colour mapping, and transition behaviour
19. Commit: `feat: zodiac sign impact heat map — colour-coded planetary activity`
20. Push to **main** branch using `git push origin master:main`
