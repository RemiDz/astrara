# Astrara — Fix: Date-Aware Titles, Lithuanian Solar System, Distance Clarity

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## FIX 1 & 3: Date-Aware Titles (Combined — Same Root Cause)

### Issue
Both the Cosmic Reading header and the "Today's Cosmic Weather" section title above the planet cards are hardcoded to say "Today's..." regardless of what date the user has selected. The planet data and cards correctly update to the selected date, but the titles do not.

### Where
- Cosmic Reading overlay header (likely in `ReadingOverlay.tsx`, `PhaseCard.tsx`, or `ReadingSummaryCard.tsx`)
- Main page section title above planet cards (find the component rendering "Today's Cosmic Weather")

### Fix

Replace all hardcoded "Today's Cosmic Weather" / "Šiandienos Kosminė Orbitė" strings with a dynamic function that checks whether the selected date is today, yesterday, tomorrow, or another date:

```typescript
function getCosmicWeatherTitle(selectedDate: Date, language: 'en' | 'lt'): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isToday = isSameDay(selectedDate, today);
  const isTomorrow = isSameDay(selectedDate, tomorrow);
  const isYesterday = isSameDay(selectedDate, yesterday);

  if (language === 'lt') {
    if (isToday) return 'Šiandienos Kosminis Oras';
    if (isTomorrow) return 'Rytojaus Kosminis Oras';
    if (isYesterday) return 'Vakarykštis Kosminis Oras';
    // For other dates, format as: "Kosminis Oras — Kovo 12"
    return `Kosminis Oras — ${formatDateLT(selectedDate)}`;
  } else {
    if (isToday) return "Today's Cosmic Weather";
    if (isTomorrow) return "Tomorrow's Cosmic Weather";
    if (isYesterday) return "Yesterday's Cosmic Weather";
    // For other dates, format as: "Cosmic Weather — March 12"
    return `Cosmic Weather — ${formatDateEN(selectedDate)}`;
  }
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}
```

Date formatting for non-today/yesterday/tomorrow dates:
- EN: "March 12" (month name + day)
- LT: "Kovo 12" (Lithuanian month genitive + day)

Lithuanian month names in genitive case (used after dates):

| Month | LT Genitive |
|-------|------------|
| January | Sausio |
| February | Vasario |
| March | Kovo |
| April | Balandžio |
| May | Gegužės |
| June | Birželio |
| July | Liepos |
| August | Rugpjūčio |
| September | Rugsėjo |
| October | Spalio |
| November | Lapkričio |
| December | Gruodžio |

### Apply In Both Locations

1. **Main page section title** — replace hardcoded string with `getCosmicWeatherTitle(selectedDate, language)`
2. **Cosmic Reading overlay header** — same function, same logic. The reading must reflect the date the user selected BEFORE opening the reading.

Make sure `selectedDate` is passed through from whatever state/context manages the date picker (the Yesterday/Today/Tomorrow nav + calendar).

---

## FIX 2: Lithuanian Planet Names in Solar System View

### Issue
When user switches to "Saulės Sistema" (Solar System) view in Lithuanian mode, all planet name labels still display in English (Mercury, Venus, Mars, etc.) except the Sun which correctly shows in Lithuanian.

### Where
Find the Solar System view component — likely a separate view/component that renders the heliocentric or top-down solar system layout. Search:

```bash
grep -rn "Solar System\|SolarSystem\|solar-system\|solarSystem" src/
grep -rn "Saules sistem\|Saulės sistem" src/
```

### Fix

The planet name labels in the Solar System view must use the same language-aware planet name lookup used elsewhere in the app. Find where planet labels are rendered in this view and replace hardcoded English names with the translated versions:

| English | Lithuanian |
|---------|-----------|
| Sun | Saulė |
| Mercury | Merkurijus |
| Venus | Venera |
| Earth | Žemė |
| Mars | Marsas |
| Jupiter | Jupiteris |
| Saturn | Saturnas |
| Uranus | Uranas |
| Neptune | Neptūnas |
| Pluto | Plutonas |

**Note:** The Solar System view likely also shows Earth (since it's a heliocentric view), so include Earth/Žemė in the lookup.

If there's already a planet translation map used by other components, import and reuse it here. Do NOT create a duplicate.

---

## FIX 4: Distance Clarity — Earth-to-Planet Visual

### Issue
Planet cards show distance values (e.g. "5.2 AU") but users don't immediately understand what the distance represents. Adding a small visual indicator makes it instantly clear.

### Where
Planet cards on the main page — find where the AU distance is rendered.

### Fix

Replace the current distance display with a compact visual format:

**Current:**
```
5.2 AU
```

**New:**
```
🌍 → ♃  5.2 AU
```

The format is: Earth emoji → arrow → planet's own symbol → distance value.

Use the planet's existing Unicode symbol (☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇) — these are already used elsewhere in the app.

### Implementation Detail

```typescript
// Example rendering
<span className="distance-indicator">
  <span>🌍</span>
  <span style={{ opacity: 0.5, margin: '0 4px' }}>→</span>
  <span>{planetSymbol}</span>
  <span style={{ marginLeft: '6px' }}>{distance} AU</span>
</span>
```

Style notes:
- The arrow `→` at 50% opacity so it doesn't dominate
- Planet symbol in the planet's own colour
- Keep the whole thing on one line, compact
- Font size same as current distance text

**Special case — Moon:** The Moon's distance is typically shown in km, not AU. If the Moon card shows distance, use:
```
🌍 → ☽  384,400 km
```

---

## TESTING

- [ ] Select tomorrow → main page title says "Tomorrow's Cosmic Weather"
- [ ] Select yesterday → title says "Yesterday's Cosmic Weather"  
- [ ] Select a date 5 days ahead → title says "Cosmic Weather — March 13" (or appropriate date)
- [ ] Open Cosmic Reading on tomorrow → reading header says "Tomorrow's Cosmic Weather"
- [ ] Open Cosmic Reading on a custom date → header shows correct date
- [ ] Switch to Lithuanian → all date-aware titles display in Lithuanian with correct grammar
- [ ] Lithuanian month names use genitive case (Kovo, not Kovas)
- [ ] Solar System view in Lithuanian → all planet names in Lithuanian
- [ ] Solar System view in English → all planet names in English
- [ ] Planet distance cards show 🌍 → ♃ format with correct planet symbol
- [ ] Distance format works for all 10 planets
- [ ] Moon distance shows km not AU (if applicable)
- [ ] No regressions to existing card content, Cosmic Reading flow, or wheel
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: date-aware cosmic weather titles, Lithuanian solar system labels, distance clarity icons"
git push origin master:main
```
