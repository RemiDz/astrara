# ASTRARA v2 — Iteration 5: Button Fix, Date Picker, Zodiac Icons

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Three issues to fix. Read all relevant source files before making changes.

---

## Bug 1: Day Navigation Buttons — Text Selection on Tap

When the user taps Yesterday/Tomorrow buttons, the button text gets highlighted/selected (browser text selection behaviour), which blocks further taps and feels broken.

### Fix

Add `user-select: none` to the buttons AND to the entire app globally:

**Global fix in globals.css:**
```css
/* Prevent text selection on interactive elements — app should feel native */
button, a, [role="button"] {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;  /* remove blue tap flash on mobile */
  -webkit-touch-callout: none;               /* prevent long-press callout on iOS */
}
```

Also add to the day navigation buttons specifically as a Tailwind class backup:
```tsx
className="... select-none"
```

Additionally, check if the buttons are using `<a>` tags or `<div>`s instead of proper `<button>` elements. They MUST be `<button type="button">` to behave correctly:

```tsx
<button type="button" onClick={...} className="... select-none">
  ← {t('nav.yesterday')}
</button>
```

---

## Bug 2: Manual Date Entry — Not Working + Bad Position

The manual date entry needs to be easily accessible and functional.

### Reposition: Add a Date Tap Target in the Header

The date displayed in the header ("4 March 2026 · 13:00 GMT") should be **tappable**. When tapped, it opens a date picker. This is the most intuitive placement — the date is already visible, tapping it to change it is natural.

```
┌──────────────────────────────────────────┐
│  ASTRARA              📍 Parkhill  🇬🇧 EN ▾  │
│  Live Cosmic Intelligence                │
│  4 March 2026 · 13:00 GMT  📅 ◄── tap    │
└──────────────────────────────────────────┘
```

### Implementation

Replace the static date text with a tappable element that opens a native date picker:

```tsx
<div className="flex items-center gap-2">
  {/* Visible date display — tappable */}
  <button
    type="button"
    onClick={() => dateInputRef.current?.showPicker()}
    className="text-purple-300/80 text-sm hover:text-purple-200 
               transition-colors select-none flex items-center gap-1.5"
  >
    <span>{formattedDate}</span>
    <span className="text-white/30 text-xs">📅</span>
  </button>
  
  {/* Hidden native date input — triggered by the button above */}
  <input
    ref={dateInputRef}
    type="date"
    value={selectedDate.toISOString().split('T')[0]}
    onChange={(e) => {
      const newDate = new Date(e.target.value + 'T12:00:00')
      setSelectedDate(newDate)
    }}
    className="absolute opacity-0 w-0 h-0 pointer-events-none"
    aria-label="Select date"
  />
</div>
```

This approach:
- Shows a clean, styled date in the header (not an ugly native input)
- On tap, opens the **native OS date picker** (which is the best UX on mobile — users know how to use it)
- The hidden `<input type="date">` is triggered via `.showPicker()`
- Works on iOS Safari, Android Chrome, and desktop browsers
- The 📅 icon is a subtle hint that the date is tappable

### Remove Old Date Entry

Remove any existing manual date entry button/form from the bottom of the page. The header date tap replaces it entirely.

### Date State Management

When the user picks a date:
1. Update the `selectedDate` state
2. Recalculate all planetary positions for the new date
3. Update the wheel (planets animate to new positions)
4. Update all insight cards
5. The Yesterday/Today/Tomorrow buttons should work relative to the selected date
6. If the selected date is today, show "Today" label + live time. Otherwise show just the date.

---

## Problem 3: Zodiac Icons Look Generic / AI-Style

The zodiac sign badges on the wheel currently use generic-looking icons that feel like default AI-generated assets. They need to be replaced with **proper astrological glyphs** — the universally recognised symbols that any astrology practitioner would expect.

### Solution: Use Unicode Astrological Symbols with Custom Styling

Remove any image-based or SVG icon zodiac badges. Replace with **pure text glyphs** styled beautifully:

```typescript
const ZODIAC_SIGNS = [
  { name: 'Aries',       glyph: '♈', element: 'fire',  colour: '#FF6B4A' },
  { name: 'Taurus',      glyph: '♉', element: 'earth', colour: '#4ADE80' },
  { name: 'Gemini',      glyph: '♊', element: 'air',   colour: '#60A5FA' },
  { name: 'Cancer',      glyph: '♋', element: 'water', colour: '#A78BFA' },
  { name: 'Leo',         glyph: '♌', element: 'fire',  colour: '#FF6B4A' },
  { name: 'Virgo',       glyph: '♍', element: 'earth', colour: '#4ADE80' },
  { name: 'Libra',       glyph: '♎', element: 'air',   colour: '#60A5FA' },
  { name: 'Scorpio',     glyph: '♏', element: 'water', colour: '#A78BFA' },
  { name: 'Sagittarius', glyph: '♐', element: 'fire',  colour: '#FF6B4A' },
  { name: 'Capricorn',   glyph: '♑', element: 'earth', colour: '#4ADE80' },
  { name: 'Aquarius',    glyph: '♒', element: 'air',   colour: '#60A5FA' },
  { name: 'Pisces',      glyph: '♓', element: 'water', colour: '#A78BFA' },
]
```

### Styling the Zodiac Badges on the Wheel

Each zodiac position on the wheel ring should render as a styled `<Html>` overlay:

```tsx
<Html center occlude={false} zIndexRange={[100, 0]}>
  <div
    className="flex items-center justify-center select-none"
    style={{
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      background: `${sign.colour}15`,           // element colour at ~8% opacity
      border: `1px solid ${sign.colour}30`,      // subtle border in element colour
      backdropFilter: 'blur(4px)',
      fontSize: '18px',
      color: sign.colour,
      textShadow: `0 0 12px ${sign.colour}60`,  // glowing text effect
      fontFamily: 'serif',                        // serif renders glyphs better
    }}
  >
    {sign.glyph}
  </div>
</Html>
```

This creates badges that:
- Use the **real astrological Unicode glyphs** (♈♉♊ etc.) — universally recognised, no custom assets needed
- Are tinted by their **element colour** (fire=red, earth=green, air=blue, water=purple)
- Have a **subtle glow** matching their element
- Look clean and mystical, not generic or clip-art-like
- Render consistently across all devices (Unicode astro symbols have excellent cross-platform support)

### Alternative: Custom SVG Glyphs (If Unicode Rendering Varies)

If the Unicode glyphs look inconsistent across devices (some Android fonts render them as emoji), create simple SVG paths for each glyph. Store them in a `zodiacGlyphs.tsx` file:

```tsx
// Only use this approach if Unicode glyphs look bad on testing
export const ZodiacGlyph = ({ sign, size = 18, colour }: Props) => {
  const paths: Record<string, string> = {
    aries: 'M12 2 C8 2 5 5 5 9 C5 13 8 14 12 14 C16 14 19 13 19 9 C19 5 16 2 12 2',
    // ... SVG path data for each sign
    // These are the traditional calligraphic astrological symbols
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d={paths[sign]} stroke={colour} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}
```

**Recommendation**: Start with Unicode glyphs (simpler, faster). Test on iOS and Android. Only switch to SVG if the Unicode rendering looks poor on specific devices.

### Also Fix Planet Glyphs

Apply the same approach to planet markers if they're also using generic icons. Planet glyphs should be:

```typescript
Sun: '☉'    Moon: '☽'    Mercury: '☿'
Venus: '♀'   Mars: '♂'    Jupiter: '♃'
Saturn: '♄'  Uranus: '♅'  Neptune: '♆'  Pluto: '♇'
```

Styled identically to the zodiac badges but using the planet's own colour.

---

## Build Steps

1. Read current button components and date handling logic
2. Fix text selection on day nav buttons — add global CSS + select-none + proper button elements
3. Remove old date entry from bottom of page
4. Add tappable date in header with hidden native date picker
5. Wire up date selection to recalculate all astro data
6. Replace zodiac icons on the wheel with Unicode glyph badges (styled as specified)
7. Verify planet glyphs are also using proper astrological symbols
8. Test: tap Yesterday/Tomorrow rapidly — no text selection, buttons work every time
9. Test: tap the date in header — native date picker opens, selecting a date updates everything
10. Test: zodiac signs on wheel show proper ♈♉♊ symbols, not generic icons
11. Run `npm run build`
12. Commit: `fix: button selection, date picker in header, proper zodiac glyphs`
