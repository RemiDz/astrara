# ASTRARA — Zodiac Heat Map v2: Stronger Visuals + Impact Score + Transit Context

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `ultrathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This upgrades the zodiac heat map visuals, adds impact score to the zodiac tap modal, and adds contextual transit information. All existing features must continue working.

---

## PROBLEM 1: Heat Map Not Visible Enough

The current emissive/opacity changes are too subtle — users cannot see any difference between impacted and non-impacted signs. The heat map needs to be DRAMATICALLY more visible.

### Fix: Much Stronger Visual Changes

The current approach of tweaking emissive intensity from 0.05 to 0.6 is not enough contrast against the dark background. Apply ALL of the following together:

#### A. Background Opacity — Major Increase

The zodiac segments currently sit at `opacity: 0.08-0.1`. This range is too narrow for the heat map to read. Widen it dramatically:

```
Score 0.0 - 0.15  →  opacity: 0.06  (dimmer than default — cooler than normal)
Score 0.15 - 0.4  →  opacity: 0.12
Score 0.4 - 0.7   →  opacity: 0.22
Score 0.7 - 1.0   →  opacity: 0.35  (hot signs are clearly more solid/visible)
```

This alone should create an obvious visual difference — hot signs are 5-6x more opaque than cool signs.

#### B. Emissive Colour — Stronger and Warmer

Replace the subtle emissive tint with a STRONG colour shift:

```
Score 0.0 - 0.15  →  Keep element colour, emissiveIntensity: 0.05 (default)
Score 0.15 - 0.4  →  Emissive lerps to #FFD700 (gold), intensity: 0.3
Score 0.4 - 0.7   →  Emissive lerps to #FF8C00 (orange), intensity: 0.5
Score 0.7 - 1.0   →  Emissive lerps to #FF4444 (red), intensity: 0.8
```

#### C. Add Outer Glow Ring to Hot Signs

For signs with score > 0.4, add a SECOND mesh behind the segment — a slightly larger, blurred version that creates a visible glow/halo around that segment:

- Duplicate the segment geometry, scale it up by 1.05 on X/Z
- Material: `MeshBasicMaterial({ color: heatColor, transparent: true, opacity: score * 0.15, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })`
- This creates a visible bloom/glow around impacted signs WITHOUT relying on the post-processing bloom effect (which is disabled on mobile)
- Only create these glow meshes for signs with score > 0.4 (max 3-4 signs per day typically)

#### D. Zodiac Badge Border Glow

For signs with score > 0.3, update the zodiac badge `<Html>` overlay styling:

```
Score < 0.3:   border: current default purple border
Score 0.3-0.6: border-color shifts to rgba(255, 215, 0, 0.5) (gold)
               add box-shadow: 0 0 8px rgba(255, 215, 0, 0.2)
Score 0.6-1.0: border-color shifts to rgba(255, 68, 68, 0.6) (red)
               add box-shadow: 0 0 12px rgba(255, 68, 68, 0.3)
```

This reinforces the heat map on the badge layer too — users see both the ring AND the badge glowing for hot signs.

#### E. Pulse Animation — More Dramatic

For signs with score > 0.5:
```
emissiveIntensity oscillates by ±0.15 (not ±0.05) at 1.5 Hz
opacity oscillates by ±0.04
```

The hot signs should visibly throb with energy. Not violently — but clearly pulsing compared to cold signs which are completely still.

---

## PROBLEM 2: Impact Score in Zodiac Tap Modal

When the user taps a zodiac sign and the detail modal opens, add a **visual impact rating** at the top of the modal content.

### Implementation

Add a new section at the TOP of the zodiac detail panel (before the existing sign description content):

#### Impact Score Bar

A horizontal bar showing the sign's current impact score on a 1-10 scale:

```
┌─────────────────────────────────────────────┐
│  Today's Impact                    7/10     │
│  ████████████████████░░░░░░░░             │
│  High activity — 3 planets in transit       │
└─────────────────────────────────────────────┘
```

**Visual details:**
- Label: "Today's Impact" / "Šiandienos Poveikis" (LT)
- Score: round `impactScore * 10` to nearest integer, display as `N/10`
- Progress bar: filled portion coloured with the heat map gradient (green→gold→orange→red)
  - 1-3: `#4ADE80` (green — mild)
  - 4-5: `#FFD700` (gold — moderate)
  - 6-7: `#FF8C00` (orange — strong)
  - 8-10: `#FF4444` (red — intense)
- Bar background: `rgba(255,255,255,0.06)`
- Bar height: 6px, border-radius: 3px

#### Impact Summary Line

Below the bar, one line explaining WHY this sign has this score:

Build the summary dynamically:

```typescript
function getImpactSummary(sign, planets, aspects, lang): string {
  const planetsInSign = planets.filter(p => p.sign === sign);
  const aspectsInvolvingSign = aspects.filter(a => 
    a.planet1Sign === sign || a.planet2Sign === sign
  );
  
  const parts: string[] = [];
  
  if (planetsInSign.length > 0) {
    const names = planetsInSign.map(p => p.name).join(', ');
    parts.push(
      lang === 'en' 
        ? `${planetsInSign.length} planet${planetsInSign.length > 1 ? 's' : ''} in transit (${names})`
        : `${planetsInSign.length} planeta${planetsInSign.length > 1 ? 'os' : 'a'} tranzite (${names})`
    );
  }
  
  if (aspectsInvolvingSign.length > 0) {
    parts.push(
      lang === 'en'
        ? `${aspectsInvolvingSign.length} active aspect${aspectsInvolvingSign.length > 1 ? 's' : ''}`
        : `${aspectsInvolvingSign.length} aktyv${aspectsInvolvingSign.length > 1 ? 'ūs aspektai' : 'us aspektas'}`
    );
  }
  
  if (parts.length === 0) {
    return lang === 'en' ? 'Quiet — no major transits' : 'Ramu — jokių svarbių tranzitų';
  }
  
  return parts.join(' · ');
}
```

**Style:** `font-size: 11px`, `color: rgba(255,255,255,0.45)`, below the progress bar.

#### Impact Level Labels

Next to the score, add a qualitative word:

```
1-2:  "Quiet"    / "Ramu"
3-4:  "Mild"     / "Švelnu"  
5-6:  "Active"   / "Aktyvu"
7-8:  "Strong"   / "Stipru"
9-10: "Intense"  / "Intensyvu"
```

---

## PROBLEM 3: Contextual Transit Information

When the mother shape label says "Uranus entered Gemini" and the user taps on Gemini, the modal only shows generic Gemini information. It should show WHAT'S HAPPENING IN GEMINI RIGHT NOW.

### Implementation

Add a new section in the zodiac detail modal AFTER the impact score and BEFORE the generic sign description. This section only appears when there are planets transiting that sign.

#### Section: "Currently in [Sign]" / "Šiuo metu [Ženkle]"

For each planet currently in the tapped sign, show a transit card:

```
┌─────────────────────────────────────────────┐
│  ♅ Uranus in Gemini                         │
│  at 1° · Since [date if available]          │
│                                              │
│  Uranus brings sudden shifts, innovation,    │
│  and awakening to Gemini's realm of          │
│  communication, learning, and connection.    │
│  Expect unexpected ideas, disrupted          │
│  routines in communication, and flashes      │
│  of brilliance in how you think and speak.   │
│                                              │
│  ♫ Frequency: 207.36 Hz · Crown Chakra      │
└─────────────────────────────────────────────┘
```

**Content generation** — use TEMPLATES (not AI) combining:

1. **Planet-in-Sign meaning**: What does THIS planet do in THIS sign? Use the existing `planet-meanings` content files — these already contain 120 planet×sign combinations in both EN and LT (`src/i18n/content/{en,lt}/planet-meanings.ts` — noted as ~97KB each in ARCHITECTURE.md). Read these files and use the appropriate entry.

2. **Planet degree**: Show the planet's current degree in the sign (already available from astro data)

3. **Planet frequency**: The Cousto frequency for that planet (already in the About page data and the reading templates)

4. **Active aspects**: If this planet (while in this sign) is forming aspects with other planets, list them:
   ```
   Current aspects:
   ♅ Uranus □ ♄ Saturn (2.3° orb) — tension between change and structure
   ♅ Uranus △ ♇ Pluto (1.1° orb) — transformation flows with evolution
   ```

#### Section: "Active Aspects in [Sign]" / "Aktyvūs Aspektai [Ženkle]"

If there are aspects where at least one planet is in this sign, list them with brief meanings:

For each aspect involving a planet in this sign:
- Planet glyphs + aspect symbol + orb
- One-line meaning from existing `aspect-meanings` content files
- Colour-coded by aspect type (same colours as Cosmic Pulse modal: conjunction=gold, square=red, trine=blue, etc.)

If no planets are in this sign and no aspects involve it:
- Show: "No planetary transits in [Sign] today. The energy here is resting." / "Šiandien [Ženkle] jokių planetinių tranzitų. Čia energija ilsisi."

### Reorganised Zodiac Modal Structure

The complete modal content order should now be:

```
1. Impact Score bar (1-10) + summary line          ← NEW
2. Currently in [Sign] — planet transit cards       ← NEW (only if planets present)
3. Active Aspects in [Sign] — aspect list           ← NEW (only if aspects present)
4. ─── separator ───
5. Sign Overview (existing generic sign description)
6. Sign Attributes (element, modality, ruler, body area, themes, shadow)
7. Sound Healing Connection (frequency, instrument, keynote)
```

The existing content moves BELOW the new contextual information. This way, the user sees what's happening RIGHT NOW first, then can scroll down for the reference material about the sign.

---

## i18n

Add all new strings to both en.json and lt.json:
- Impact labels (Quiet/Mild/Active/Strong/Intense)
- "Today's Impact" / "Šiandienos Poveikis"
- "Currently in [Sign]" / "Šiuo metu [Ženkle]"
- "Active Aspects in [Sign]" / "Aktyvūs Aspektai [Ženkle]"
- "No planetary transits" message
- All impact summary template strings

For planet-in-sign meanings, use the EXISTING content from `planet-meanings.ts` files — do NOT write new content. These files already have comprehensive bilingual text for every combination.

---

## Build Steps

1. Read `AstroWheel3D.tsx` — find the zodiac segment rendering and DRAMATICALLY increase the colour contrast as described in Problem 1
2. Read the existing zodiac tap modal (WheelTooltip or equivalent) — understand its current content structure
3. Read `planet-meanings.ts` content files — understand how planet-in-sign text is structured
4. Read `aspect-meanings.ts` — understand aspect description format
5. Implement stronger heat map visuals: opacity 0.06→0.35 range, emissive 0.05→0.8 range, outer glow meshes, badge border glow, stronger pulse
6. Add impact score bar component to zodiac modal (top of content)
7. Add `getImpactSummary()` function for the summary line
8. Add "Currently in [Sign]" transit card section using planet-meanings content
9. Add "Active Aspects in [Sign]" section using aspect-meanings content  
10. Add planet frequencies from existing data
11. Reorganise modal content: impact → transits → aspects → separator → generic sign info
12. Add all i18n keys
13. Test: heat map is NOW clearly visible — obvious colour difference between hot and cool signs
14. Test: sign with Sun/Moon/Mars is visibly warm/hot coloured
15. Test: empty signs are clearly dim and cool
16. Test: zodiac badges for hot signs have coloured border glow
17. Test: tap a hot sign → modal shows impact score bar with correct rating
18. Test: modal shows which planets are currently in that sign with meanings
19. Test: modal shows active aspects involving planets in that sign
20. Test: tap an empty sign → modal shows "no transits" message + lower impact score
21. Test: navigate days → heat map updates, modal content updates
22. Test: switch to Lithuanian → all new content displays correctly
23. Test: mobile 375px → modal scrolls properly with new content
24. Test: ALL other features still work
25. Run `npm run build` — no errors
26. **UPDATE `engine/ARCHITECTURE.md`** — document the enhanced heat map system, impact score in modal, and contextual transit information
27. Commit: `feat: zodiac heat map v2 — stronger visuals, impact score, contextual transit info`
28. Push to **main** branch using `git push origin master:main`
