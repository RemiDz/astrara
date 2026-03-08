# Astrara — Cosmic Reading: UX Clarity Improvements

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use megathink for this task.

---

## CONTEXT

The Cosmic Reading feature is functional but user testing revealed that people without astrology knowledge find the reading flow confusing. They don't understand terms like "Waning Gibbous" or "Sextile", can't tell what's coming next, and don't know what each planet represents. These changes bring clarity without dumbing things down.

**Reference the master architecture document at:**
`src/features/cosmic-reading/ARCHITECTURE.md`

---

## CHANGE 1: Lithuanian Button Label Fix

### What
When app language is Lithuanian (`lt`), change the Cosmic Reading button label from `'Kosminis'` to `'Horoskopas'`.

### Where
`src/features/cosmic-reading/components/CosmicReadingButton.tsx`

### Implementation
Find the Lithuanian translation string for the button and replace it. The English label stays as `'Cosmic Reading'` (or whatever it currently is). Only the `lt` locale string changes.

If translations are handled via a central i18n file or object, update it there instead.

---

## CHANGE 2: Reading Flow Reorder — Summary First

### What
Currently the reading phases go: Moon → Sun → Aspects → Retrogrades → Frequency.

**New order:** Summary → Moon → Sun → Aspects → Retrogrades → Frequency.

The Summary card (currently shown at the end) becomes the FIRST card. It serves as the "headline" — a clear, punchy overview of the day's cosmic weather. Users who want a quick read stop here. Curious users tap "Next ✦" to explore details.

### Where
`src/features/cosmic-reading/content/generateReading.ts` — the function that builds the reading phases array.

### Implementation

1. In `generateCosmicReading()` (or equivalent), after generating all phases and the summary, restructure the output so the summary is `phases[0]` and the detail phases follow.

2. The summary phase should have:
   - `type: 'summary'` (or add a new type if needed)
   - A title like "Today's Cosmic Weather" / LT: "Šiandienos Kosminė Orbitė"
   - The existing summary text content (theme, keywords, overall guidance)
   - Keep it concise: 3-4 sentences max. Direct and clear. No jargon.

3. The final card in the reading should now be the Frequency/Sound Healing card (which was previously second-to-last). There is NO duplicate summary at the end — the reading simply ends after the last detail phase.

4. Update the state machine phase count and any index-based logic to account for the new ordering.

### Summary Card Content Guidelines
The summary text should read like a daily weather forecast, e.g.:
- EN: "Today carries a reflective, inward energy. The Moon is releasing in Libra, encouraging you to share insights and seek balance. Venus and Mars in supportive connection bring warmth to relationships. A good day to listen more than you speak."
- LT: equivalent translation

This tone: warm, clear, actionable, zero jargon. A 12-year-old should understand it.

---

## CHANGE 3: Phase Navigation Icons (Replace Progress Dots)

### What
Replace the small progress dots at the top of the reading overlay with a row of small, labelled icons representing each phase. The user can see the full reading agenda at a glance and optionally tap any icon to jump to that phase.

### Where
- `src/features/cosmic-reading/components/PhaseCard.tsx` — remove existing dots
- Create new component: `src/features/cosmic-reading/components/PhaseProgressBar.tsx`
- Wire into `ReadingOverlay.tsx`

### Icon Design

Each phase gets a small icon + short label. Use Unicode symbols or simple SVG icons. Layout: horizontal row, centred at top of the reading overlay, above the card.

| Phase | Icon | EN Label | LT Label |
|-------|------|----------|----------|
| Summary | ✦ | Overview | Apžvalga |
| Moon | ☽ | Moon | Mėnulis |
| Sun | ☉ | Sun | Saulė |
| Aspects | △ | Aspects | Aspektai |
| Retrogrades | ℞ | Retro | Retro |
| Frequency | ♫ | Sound | Garsas |

**Note:** Retrogrades phase may not always be present (only shown when planets are retrograde). The icon bar must be dynamic — only show icons for phases that exist in the current reading.

### Visual Style
```
Container:
  - Horizontal flex row, centred, gap: 12px
  - Position: top of ReadingOverlay, above the PhaseCard
  - padding: 12px 16px
  - No background (transparent, sits over the gradient backdrop)

Each icon item:
  - Flex column: icon on top, label below
  - Icon: 18px font size, element colour when active, white/30% opacity when inactive
  - Label: 10px uppercase, same opacity rules
  - Active state: full white opacity + subtle glow (text-shadow: 0 0 8px currentColor)
  - Completed state: white/60% opacity (brighter than inactive but no glow)
  - Tappable: 44px minimum hit area
  - Tap action: dispatch JUMP_TO_PHASE action (see state machine update below)

Transition: opacity and text-shadow with 300ms ease
```

### State Machine Update

Add a new action to `useReadingStateMachine.ts`:

```typescript
type ReadingAction =
  | { type: 'JUMP_TO_PHASE'; phaseIndex: number }
  // ... existing actions
```

`JUMP_TO_PHASE` should:
- Only be valid from `PHASE_READING` state (user must be viewing a card, not mid-animation)
- Set `currentPhaseIndex` to the target index
- Transition to `PHASE_TRANSITIONING` → then auto-advance to `PHASE_ANIMATING` → `PHASE_READING` as normal
- If jumping backwards, still works the same way

---

## CHANGE 4: Plain-English Subtitles for Astrology Terms

### What
Every astrology term that appears in reading cards gets a plain-English (and plain-Lithuanian) subtitle explaining what it means in everyday language.

### Where
Templates in `src/features/cosmic-reading/content/templates/`

### Implementation

#### 4A: Moon Phase Subtitles

Add a `plainName` field to each Moon phase in `moonTemplates.ts`:

| Technical Term | EN Plain Name | LT Plain Name |
|---------------|---------------|---------------|
| New Moon | New Beginnings | Nauja Pradžia |
| Waxing Crescent | Building Momentum | Augantis Pagreitis |
| First Quarter | Taking Action | Veikimo Laikas |
| Waxing Gibbous | Refining & Perfecting | Tobulinimas |
| Full Moon | Peak Energy & Clarity | Pilna Energija |
| Waning Gibbous | Sharing & Teaching | Dalijimasis |
| Last Quarter | Releasing & Letting Go | Atleidimas |
| Waning Crescent | Rest & Reflection | Poilsis ir Apmąstymai |

Display format on the card:
```
☽ Waning Gibbous
  Sharing & Teaching          ← plainName, smaller text, 60% opacity
```

In Lithuanian mode, show Lithuanian plain name instead.

#### 4B: Aspect Type Subtitles

Add `plainName` to each aspect type in `aspectTemplates.ts`:

| Technical Term | EN Plain Name | LT Plain Name |
|---------------|---------------|---------------|
| Conjunction | Merging Energies | Susijungimas |
| Sextile | Supportive Connection | Palaikantis Ryšys |
| Square | Creative Tension | Kūrybinė Įtampa |
| Trine | Natural Flow | Natūralus Srautas |
| Opposition | Balancing Act | Pusiausvyra |

Display format:
```
△ Venus ☍ Mars — Opposition
  Balancing Act              ← plainName
```

#### 4C: Planet Meaning Labels

This is critical. Every time a planet is mentioned on a reading card, show its core meaning domain underneath or beside its name.

Add a `domain` field to planet data (or create a small lookup if one doesn't exist):

| Planet | EN Domain | LT Domain |
|--------|-----------|-----------|
| Sun ☉ | Identity & Vitality | Tapatybė ir Gyvybingumas |
| Moon ☽ | Emotions & Intuition | Emocijos ir Intuicija |
| Mercury ☿ | Communication & Mind | Bendravimas ir Protas |
| Venus ♀ | Love, Beauty & Values | Meilė, Grožis ir Vertybės |
| Mars ♂ | Drive, Action & Energy | Valia, Veiksmas ir Energija |
| Jupiter ♃ | Growth, Luck & Wisdom | Augimas, Sėkmė ir Išmintis |
| Saturn ♄ | Discipline & Structure | Disciplina ir Struktūra |
| Uranus ♅ | Innovation & Change | Inovacijos ir Pokyčiai |
| Neptune ♆ | Dreams & Spirituality | Svajonės ir Dvasingumas |
| Pluto ♇ | Transformation & Power | Transformacija ir Galia |

Display format on cards — whenever a planet name appears in a phase card header or body:
```
♀ Venus
  Love, Beauty & Values      ← domain, smaller text, planet's element colour at 60% opacity
```

### Where to put the lookup
Create a small utility file if one doesn't already exist:
`src/features/cosmic-reading/content/templates/planetDomains.ts`

Export a simple map:
```typescript
export const planetDomains: Record<string, { en: string; lt: string }> = {
  Sun: { en: 'Identity & Vitality', lt: 'Tapatybė ir Gyvybingumas' },
  Moon: { en: 'Emotions & Intuition', lt: 'Emocijos ir Intuicija' },
  // ... etc
};
```

Then import and use in PhaseCard.tsx wherever planet names are rendered.

---

## CHANGE 5: Card Content Display — Planet Domains in "Today's Cosmic Weather" Cards

### What
In the existing "Today's Cosmic Weather" section (the main page planet cards below the wheel, NOT the Cosmic Reading overlay), each planet card should also show the planet's domain meaning.

### Where
The planet info cards/sections on the main page — find the component that renders the planet list below the Astro Wheel.

### Implementation
Use the same `planetDomains` lookup from Change 4C. Add the domain subtitle beneath each planet's name in the card, same styling pattern: smaller text, planet colour at 60% opacity.

---

## TESTING CHECKLIST

After all changes, verify:

- [ ] Lithuanian mode shows "Horoskopas" on the Cosmic Reading button
- [ ] English mode still shows the original English label
- [ ] Cosmic Reading opens with Summary card first
- [ ] Summary card text is clear, jargon-free, 3-4 sentences
- [ ] Tapping "Next ✦" goes to Moon phase (second card)
- [ ] Phase progress icons show at top of reading overlay
- [ ] Active phase icon is highlighted, others are dimmed
- [ ] Tapping a phase icon jumps to that phase
- [ ] Retrogrades icon only appears when retrograde planets exist
- [ ] Moon phase cards show plain-English subtitle below the technical name
- [ ] Aspect cards show plain-English subtitle below the aspect type
- [ ] Planet names on reading cards show domain meaning underneath
- [ ] Main page "Today's Cosmic Weather" planet cards show domain meaning
- [ ] All plain names and domains appear in Lithuanian when in LT mode
- [ ] No regressions: existing reading flow, animations, wheel interaction all still work
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

After all changes pass:
```bash
git add -A
git commit -m "feat: cosmic reading UX clarity - summary first, phase icons, plain terms, planet domains"
git push origin master:main
```
