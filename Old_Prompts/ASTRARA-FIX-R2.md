Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# ASTRARA — Round 2 Fixes

## Fix 1: NAVIGATION — Users are stuck on the portrait page

The portrait page has no way to go back and enter a new birth date. This is a critical UX failure.

**Add these navigation elements to the portrait page (/portrait/[id]):**

- **Top-left**: "← New Portrait" button (fixed position, top-left corner, z-50)
  - Style: bg transparent, var(--text-secondary), DM Sans text-sm, hover var(--text-primary)
  - On click: navigate to / (landing page)
  - Always visible (don't auto-hide)

- **Bottom of the page** (in the Share & Explore section):
  - "Create Another Portrait" — prominent button, same style as the landing page generate button (gradient bg var(--accent) to var(--accent-cool), white text, rounded-xl, py-3, full width max-w-sm)
  - On click: navigate to / (landing page)

- **Landing page**: when user arrives back from a portrait, the form should be EMPTY (clear all fields). Don't pre-fill with previous birth data. Use React state, not localStorage, for form values so they reset on navigation.

---

## Fix 2: LANGUAGE SELECTOR — Replace toggle with dropdown + flags

The current EN|LT toggle won't scale when more languages are added. Replace it with a proper dropdown.

**New LanguageSelector component:**

- **Trigger button** (fixed top-right, z-50):
  - Shows current language flag emoji + language code
  - English: 🇬🇧 EN
  - Lithuanian: 🇱🇹 LT
  - Style: bg var(--space-card), border var(--border), rounded-lg, px-3 py-1.5, text-sm, DM Sans
  - Small chevron-down icon after the text
  - On click: toggles dropdown open/closed

- **Dropdown** (appears below trigger):
  - bg var(--space-card), border var(--border), rounded-lg, shadow-2xl
  - Each option: flag emoji + full language name
    - 🇬🇧 English
    - 🇱🇹 Lietuvių
  - Active language has a subtle checkmark ✓ or accent-coloured left border
  - On click: switch language, close dropdown
  - Click outside: close dropdown
  - Framer Motion: dropdown fades in + slides down slightly

- **Position**: fixed top-right corner on ALL pages, with enough padding from edges (top-4 right-4)
- **Must not overlap** with any other UI element

**Future-proof**: the language list should be defined as an array so adding new languages is just adding an entry:
```typescript
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  // Future: { code: 'es', name: 'Español', flag: '🇪🇸' },
];
```

---

## Fix 3: VISUAL POLISH — Clean up the messiness

The portrait page looks "close to WOW" but has layout/spacing issues. Fix these specific things:

### Cosmic Wheel cleanup:
- **Planet labels are overlapping**: When planets are close together (conjunction), their labels overlap and become unreadable. Fix by:
  - Detect when two labels would overlap (check if their angles are within 15° of each other)
  - If overlapping: offset one label radially outward (push it further from the centre) and draw a thin connecting line back to the planet dot
  - This is a common technique in chart visualisation
- **Zodiac sign names**: Make them more subtle — they're competing with the planet data. Reduce opacity to 0.3 and make font smaller (10px). The zodiac SYMBOLS (♈♉♊ etc) should be more prominent than the text names.
- **Aspect lines**: Currently they look chaotic with too many lines. Only draw the TOP 5 strongest aspects (smallest orb values). This declutters the wheel massively.
- **Overall wheel**: add a very subtle outer glow ring — a thin circle (1px) at 110% of the wheel radius, var(--accent) at 0.1 opacity. This frames the wheel nicely.

### Typography hierarchy:
- The title "Your Cosmic Frequency Portrait" on the portrait page should be SMALLER and more subtle — it's not the hero here, the wheel is. Use text-lg, var(--text-secondary), Instrument Serif italic. Don't compete with the visualisation.
- Birth info line ("1981-06-03 · 10:00 · Kaunas, Lithuania") — format the date nicely: "3 June 1981" not "1981-06-03". Use Intl.DateTimeFormat for locale-aware formatting.

### Spacing:
- Add more vertical space between the wheel and the frequency cards section (at least 48px / py-12)
- Planet frequency cards: ensure consistent alignment — planet name left-aligned, zodiac info centred, Hz right-aligned. Use a clean grid or flex layout with fixed widths.
- On mobile: the wheel should have breathing room — add px-4 padding on the sides so it doesn't touch screen edges

### Play button:
- Move the play button so it's BELOW the wheel and birth info, not overlapping the wheel
- Give it more vertical space from the wheel (mt-8)
- Make the "Listen to your cosmic sound" text slightly larger and more inviting
- When playing: change button colour to var(--accent-warm) (amber) and show a subtle audio waveform animation inside the button (or just a pulsing ring)

### Colour consistency:
- Make sure ALL planet dots on the wheel use the exact same colours as the planet frequency cards below. They must match perfectly.
- The cosmic wheel background should be slightly differentiated from the page background — add a very subtle circular gradient behind the wheel (var(--space-surface) at 0.5 fading to transparent) to make it feel like it's floating.

---

## Fix 4: LANDING PAGE — Ensure form resets

When navigating back to the landing page from a portrait:
- All form fields must be empty
- The city search dropdown must be cleared
- The generate button must be disabled
- No cached/stale state from the previous portrait

If the form state is stored in React state (useState), this should happen automatically on remount. If there's any localStorage caching of form values, remove it.

---

## Fix 5: DATE FORMATTING

Throughout the app, display dates in human-readable format, not ISO:

```typescript
function formatBirthDate(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
// English: "3 June 1981"
// Lithuanian: "1981 m. birželio 3 d."
```

Use this everywhere birth dates are displayed (portrait page, share card, OG image).

---

## After all fixes:
```bash
npm run build
git add -A
git commit -m "Fix: navigation, language dropdown, visual polish, date formatting"
git push origin master:main
```

Focus on making the portrait page feel clean and intentional — every element should have a clear purpose and clear spacing. Remove clutter, add breathing room, ensure nothing overlaps. The wheel is the star — everything else supports it.
