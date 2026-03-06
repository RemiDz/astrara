# ASTRARA — Solar System View: Manual Date Input

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## What to Add

A date input that allows users to jump to any date and see the exact planetary positions for that moment. Only visible in heliocentric (solar system) view.

Read all current heliocentric view, date state, autoplay, and header source files before making changes.

---

## 1. Placement

Add the date input BETWEEN the header date line and the wheel. It should sit as a single clean row, only visible in heliocentric view, fading in with `helioOpacity`.

```
ASTRARA                            🔇  ⓘ  ⚙️
Today's Cosmic Map
5 March 2026 · 14:20 GMT · Whickham

        ┌──────────────────────┐
        │  📅  5 March 2026  ▼ │    ← only in heliocentric view
        └──────────────────────┘

              [solar system]
```

Alternatively, place it next to or replacing the "Today" button in the autoplay controls row:

```
   ◀◀    ◀    [ 5 Mar 2026 ]    ▶    ▶▶
```

Choose whichever placement looks cleaner and fits naturally. The date input REPLACES the Today text button — tapping the date opens the picker, and there's no separate Today button needed (the user just picks today's date).

Actually — keep the Today button. Place the date input between the autoplay controls and the "Astro Wheel View" toggle:

```
         ◀◀    ◀    Today    ▶    ▶▶

              [ 5 Mar 2026 ]

           ✦ Astro Wheel View
```

---

## 2. Date Input Implementation

Use a native HTML date input styled to match Astrara's aesthetic. Native date inputs give us the OS date picker for free — no need to build a custom calendar.

```tsx
<div 
  className="flex items-center justify-center"
  style={{ opacity: helioOpacity }}
>
  <div className="relative">
    <input
      type="date"
      value={formatDateForInput(currentDisplayDate)}  // YYYY-MM-DD format
      onChange={(e) => {
        const newDate = new Date(e.target.value + 'T12:00:00')  // noon to avoid timezone issues
        if (!isNaN(newDate.getTime())) {
          handleDateJump(newDate)
        }
      }}
      className="
        bg-white/5 border border-white/10 rounded-full
        px-5 py-2 text-sm text-white/70 text-center
        backdrop-blur-md cursor-pointer
        hover:bg-white/8 hover:text-white/90
        focus:outline-none focus:border-white/20
        transition-all duration-200
        appearance-none
      "
      style={{
        colorScheme: 'dark',
        WebkitAppearance: 'none',
        minWidth: 0,
      }}
    />
  </div>
</div>
```

### Format Helper

```typescript
function formatDateForInput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
```

### iOS Safari Fixes

Critical for mobile — apply these styles to the date input:

```css
input[type="date"] {
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
  font-size: 16px;  /* prevents iOS zoom on focus */
  color-scheme: dark;
}

/* Remove the default calendar icon on some browsers and replace with consistent styling */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.7);
  cursor: pointer;
  opacity: 0.6;
}
```

---

## 3. Date Jump Handler

When the user selects a date, stop any active autoplay and jump to that date:

```typescript
function handleDateJump(newDate: Date) {
  // Stop autoplay
  animationSpeed.current = 0
  setAutoplayDirection('stopped')

  // Update animation time (for the solar system positions)
  animationTime.current = newDate.getTime()

  // Update display date (for cards and content)
  setDisplayDate(newDate)

  // Force recalculate positions for the new date
  // The useFrame loop will pick up the new animationTime automatically
}
```

---

## 4. Keep Date Input in Sync

The date input should always show the current date — including during autoplay.

### During Autoplay

The date input value should update to reflect the advancing date. Since we can't use React state updates during animation (performance), use a ref to update the input DOM directly:

```typescript
const dateInputRef = useRef<HTMLInputElement>(null)

// Inside useFrame, when autoplay is running:
if (animationSpeed.current !== 0 && dateInputRef.current) {
  const d = new Date(animationTime.current)
  const formatted = formatDateForInput(d)
  if (dateInputRef.current.value !== formatted) {
    dateInputRef.current.value = formatted
  }
}
```

### When Autoplay Stops

The React state `displayDate` syncs, and the input will show the correct date via its `value` prop.

---

## 5. Date Range

Allow a wide range of dates — astronomy-engine supports calculations across a broad timespan:

```tsx
<input
  type="date"
  min="1900-01-01"
  max="2100-12-31"
  ...
/>
```

---

## 6. Only in Heliocentric View

The date input must ONLY appear in heliocentric view. In geocentric view, the existing Yesterday/Today/Tomorrow buttons handle date navigation.

Wrap with a visibility check:

```tsx
{viewMode === 'heliocentric' && (
  <div style={{ opacity: helioOpacity }}>
    <input type="date" ... />
  </div>
)}
```

---

## Do NOT

- Do NOT remove the Today button from the autoplay controls — keep it
- Do NOT remove or change the autoplay buttons (◀◀ ◀ ▶ ▶▶)
- Do NOT change the geocentric Yesterday/Today/Tomorrow navigation
- Do NOT change planet positions, sizes, orbital rings, or any visual elements
- Do NOT change the transition animation between views
- Do NOT add a time picker — date only is sufficient

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: date input only appears in heliocentric view
3. Test: date input styled consistently — rounded pill, glass morphism, dark colour scheme
4. Test: tap date input → OS date picker opens (mobile) or calendar dropdown (desktop)
5. Test: select a date → autoplay stops, planets jump to that date's positions
6. Test: select a far future date (e.g. 2050) → planets positioned correctly
7. Test: select a past date (e.g. 1990) → planets positioned correctly
8. Test: during autoplay, date input shows the advancing date
9. Test: after stopping autoplay, date input shows the final date
10. Test: on iOS Safari — no zoom on focus, dark styling, picker works
11. Test: switch to geocentric → date input disappears
12. Commit: `feat: manual date input for solar system view`
13. Push to `main`
