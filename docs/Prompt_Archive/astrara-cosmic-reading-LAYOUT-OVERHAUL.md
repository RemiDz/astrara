# Astrara — Cosmic Reading: Layout Overhaul — Maximise Wheel Visibility

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## THE CORE PROBLEM

During Cosmic Reading, the screen space is wasted on controls the user will never interact with mid-reading: the view toggle buttons ("✦ Kosminis" / "☉ Saulės sistema"), the day navigation ("Vakar / Šiandien / Rytoj"), and the birth chart CTA. These elements sit between the wheel and the reading card, squeezing the wheel into a tiny area while providing zero value during a reading session.

Additionally, there is persistent wasted vertical space between the page header and the wheel's top edge that has not been resolved.

## THE SOLUTION

When Cosmic Reading is active:
1. **HIDE** the view toggle buttons (Cosmic Reading + Solar System View)
2. **HIDE** the day navigation (Yesterday / Today / Tomorrow)
3. **HIDE** the birth chart CTA link
4. **HIDE** the header subtitle line (date/time/location) to reclaim even more space
5. The wheel gets ALL the space from just below the "ASTRARA" title to the top of the reading card
6. The reading card stays compact at the bottom

When reading exits, everything smoothly reappears.

---

## STEP 1: Hide controls during reading

### 1a. Identify the wrapper component

Phase C added a `ReadingDim` wrapper (or similar component) that dims controls during reading. Find it — it's the component that wraps the view toggle row, day navigation, and birth chart CTA, and applies `opacity-30 pointer-events-none` when reading is active.

**Change it from dimming to HIDING:**

```tsx
function ReadingDim({ children }: { children: React.ReactNode }) {
  const { isReadingActive } = useReadingContext()
  
  if (isReadingActive) return null  // COMPLETELY HIDE, not just dim
  
  return <>{children}</>
}
```

Or if it uses conditional classes:

```tsx
<div className={isReadingActive ? 'hidden' : ''}>
  {children}
</div>
```

Using `hidden` (display: none) is better than opacity because it removes the elements from layout flow, giving the space back to the wheel.

### 1b. Verify what's wrapped by ReadingDim

Make sure ALL of these are wrapped and will be hidden:
- The view toggle row (Cosmic Reading button + Solar System View button)
- The day navigation (Yesterday / Today / Tomorrow row)
- The birth chart CTA ("✦ Discover Your Cosmic Portrait →")

If any of these are NOT inside the ReadingDim wrapper, wrap them.

### 1c. Also hide the header date/location line during reading

The header currently shows:
```
ASTRARA                    [audio] [info] [settings]
Šiandienos Kosminis Žemėlapis
2026 m. kovo 6 d. · 19:51; GMT+0 · Whick...
```

During reading, the subtitle ("Šiandienos Kosminis Žemėlapis") and the date/location line provide no value. Hide them to reclaim ~40px of vertical space.

In the Header component (or in page.tsx where the Header is configured), pass a prop indicating reading is active:

```tsx
<Header
  ... existing props ...
  compact={isReadingActive}  // NEW prop
/>
```

Inside the Header component, when `compact` is true:
- Hide the subtitle line ("Today's Cosmic Map" / "Šiandienos Kosminis Žemėlapis")
- Hide the date/time/location line
- Keep showing: "ASTRARA" title + the audio/info/settings icons
- This reduces the header from ~3 lines to ~1 line

If modifying the Header component is complex, an alternative is to wrap those lines with a conditional:

```tsx
{!compact && (
  <>
    <p className="...">{t('header.subtitle')}</p>
    <p className="...">{dateString}</p>
  </>
)}
```

Use `transition-all duration-300` for smooth collapse if feasible, or just instant hide — either works.

---

## STEP 2: Remove the gap between header and wheel

### 2a. Reduce wheel container top padding to zero

The wheel container div currently has padding that creates a gap. Find it and remove ALL top padding when reading is active, and minimize it when not active:

```tsx
<div className={`relative ${isReadingActive ? 'pt-0 pb-0' : 'pt-1 pb-4'}`}>
  <AstroWheel3DWrapper ... />
</div>
```

When reading is active: `pt-0 pb-0` — zero padding, wheel takes maximum space.
When not active: `pt-1 pb-4` — minimal top padding (4px), normal bottom padding.

### 2b. Check for margins on the main content area

In page.tsx, the `<main>` tag has `className="max-w-5xl mx-auto px-4 pb-12"`. The `pb-12` is fine (footer spacing). But check if there's any `mt-*` or `pt-*` adding space above the wheel section.

---

## STEP 3: Ensure the wheel does NOT shrink

### The Problem
The wheel container's height is set to `height: '95vw', maxHeight: '550px'` (line ~1782 in AstroWheel3D.tsx). This is a FIXED size — it should NOT be shrinking. If the wheel appears smaller, it's because the container is being constrained by a flex parent or an overflow issue.

### Check
1. Verify the wheel container div still has `style={{ height: '95vw', maxHeight: '550px' }}`
2. Verify no parent has `flex` with `flex-shrink` that would compress the wheel
3. Verify the `overflow-hidden` we added in the previous fix is on the WRAPPER div, not on the Canvas container itself (overflow-hidden on the Canvas container could clip the wheel)

### Fix if the wheel appears small

If the wheel is shrinking because `overflow-hidden` on the wrapper div is clipping the 3D scene:

Move `overflow-hidden` from the wheel's immediate wrapper to the PAGE ROOT only:

```tsx
{/* Page root — prevents horizontal scroll */}
<div className="min-h-screen relative overflow-x-hidden">
```

Remove `overflow-hidden` from the wheel container div:
```tsx
{/* Wheel container — NO overflow-hidden here */}
<div className={`relative ${isReadingActive ? 'pt-0 pb-0' : 'pt-1 pb-4'}`}>
  <AstroWheel3DWrapper ... />
</div>
```

The `overflow-x-hidden` on the page root prevents horizontal scroll without clipping the wheel vertically.

---

## STEP 4: Keep reading card compact

Verify these values are in place from the previous fix:
- PhaseCard scrollable content: `max-h-[30vh]`
- Card padding: `p-4` (not `p-6`)
- Text: `text-sm leading-snug`
- Personal readings: `text-xs leading-snug`
- Progress dots spacing: `mb-2`

The reading card + button + safe area should occupy no more than ~40% of the screen.

---

## STEP 5: Smooth transitions when entering/exiting reading

When the user starts a reading:
1. View toggle buttons, day nav, birth chart CTA **disappear** (instant or quick 200ms fade)
2. Header collapses to compact mode (subtitle + date line hide)
3. The space is reclaimed — the wheel stays at its fixed size but is now centred in more available space
4. Reading card slides up from the bottom

When the user exits the reading:
1. Reading card slides down and disappears
2. Header expands back (subtitle + date line reappear)
3. View toggle, day nav, birth chart CTA reappear

The controls reappearing should use a quick transition (`transition-all duration-200`) so it doesn't feel jarring.

---

## EXPECTED SCREEN LAYOUT DURING READING

```
┌─────────────────────────────────┐
│ ASTRARA          [🔇] [ℹ] [⚙]  │  ← Compact header (1 line only)
│                                 │
│                                 │
│         ┌─────────────┐         │
│         │             │         │
│         │  ASTRO      │         │  ← Full-size wheel, centred
│         │  WHEEL      │         │     ~55-60% of screen
│         │             │         │
│         └─────────────┘         │
│                                 │
├─────────────────────────────────┤
│ ● ● ● ○ ○               [✕]   │  ← Card header (dots + close)
│ 🌙 Moon Phase                   │
│ Waning Gibbous in Libra · 23°   │  ← Compact card
│                                 │     ~35% of screen
│ Reading text...                  │     scrollable
│                                 │
│ [        Toliau ✦         ]     │  ← Button, above safe area
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔│  ← Safe area spacer
└─────────────────────────────────┘
```

---

## VERIFICATION

### During reading:
- [ ] View toggle buttons (Cosmic Reading + Solar System View) are HIDDEN (not just dimmed)
- [ ] Day navigation (Yesterday / Today / Tomorrow) is HIDDEN
- [ ] Birth chart CTA is HIDDEN
- [ ] Header shows only "ASTRARA" + icon buttons (no subtitle, no date line)
- [ ] Wheel is full size (same dimensions as normal view) — NOT shrunk
- [ ] No horizontal overflow — wheel stays within screen bounds
- [ ] Wheel takes up ~55-60% of screen, card takes ~35-40%
- [ ] No visible gap between header area and wheel
- [ ] Card and "Next" button are visually continuous (no background gap)
- [ ] "Toliau ✦" button is fully visible above phone bottom bar
- [ ] Text content fades smoothly between phases (no card close/reopen flash)

### After exiting reading:
- [ ] All hidden controls smoothly reappear
- [ ] Header returns to full display (subtitle + date line)
- [ ] Wheel interaction restored (orbit, planet tap, etc.)
- [ ] Day navigation works
- [ ] View toggle works
- [ ] No layout shift or jump when controls reappear

### General:
- [ ] Normal app (no reading) looks EXACTLY the same as before — no spacing changes when reading is not active
- [ ] Lithuanian and English both work correctly
- [ ] Mobile: no horizontal scroll at any point

---

## TECHNICAL CONSTRAINTS

- **Do NOT apply CSS transforms (translate/translateY) to the wheel container or any Canvas parent**
- **Do NOT change the wheel's height/maxHeight CSS values** (95vw / 550px)
- **Use `overflow-x-hidden` on page root, NOT `overflow-hidden` on the wheel container**
- **No framer-motion**
- **Git push**: `git push origin master:main`
- **All scrollbars hidden**
