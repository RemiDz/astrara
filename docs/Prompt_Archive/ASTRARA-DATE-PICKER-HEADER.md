# ASTRARA — Fix Date Input: Header Tap + Today Sync

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Two Problems to Fix

---

## Problem 1: Date Picker Steals Space

The date input is placed below the autoplay buttons, pushing the solar system view up and stealing screen real estate.

### Fix: Remove the Visible Date Input Entirely

Delete the date input element from below the autoplay controls. Remove it completely from that location.

### Replace With: Invisible Date Input Triggered by Header Tap

Make the date line in the header ("5 March 2026 · 14:20 GMT · Whickham") tappable ONLY when in heliocentric view. Tapping it opens the native date picker without showing any visible input field.

Implementation — use a hidden date input layered over the header date text:

```tsx
{/* In the header date line */}
<div className="relative inline-block">
  <span 
    ref={headerDateRef}
    className={`text-sm ${viewMode === 'heliocentric' ? 'text-white/80 cursor-pointer' : 'text-white/60'}`}
  >
    {formatDisplayDate(displayDate)} · {formatTime(displayDate)} · {cityName}
  </span>

  {/* Invisible date input overlay — only in heliocentric view */}
  {viewMode === 'heliocentric' && (
    <input
      ref={dateInputRef}
      type="date"
      value={formatDateForInput(displayDate)}
      onChange={(e) => {
        const newDate = new Date(e.target.value + 'T12:00:00')
        if (!isNaN(newDate.getTime())) {
          handleDateJump(newDate)
        }
      }}
      min="1900-01-01"
      max="2100-12-31"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      style={{
        WebkitAppearance: 'none',
        appearance: 'none',
        minWidth: 0,
        fontSize: '16px',
      }}
    />
  )}
</div>
```

This way:
- The date text looks the same as always
- In heliocentric view, tapping the date opens the OS date picker
- In geocentric view, the date is not tappable (no hidden input)
- Zero extra screen space used
- The native picker opens as a modal overlay (iOS bottom sheet / Android dialog) — doesn't push content

### Visual Hint

To hint that the date is tappable in heliocentric view, add a subtle underline or slightly brighter text colour:

```tsx
<span 
  className={`text-sm transition-colors duration-200 ${
    viewMode === 'heliocentric' 
      ? 'text-white/80 underline decoration-white/20 decoration-dotted underline-offset-4 cursor-pointer' 
      : 'text-white/60'
  }`}
>
```

The dotted underline subtly signals "this is tappable" without being heavy-handed.

---

## Problem 2: Today Button Doesn't Sync Calendar Date

When the user taps Today, the planets reset to today but the hidden date input still holds the last selected date.

### Fix

In the Today button handler, explicitly update the date input's value:

```typescript
const handleToday = () => {
  animationSpeed.current = 0
  const now = new Date()
  animationTime.current = now.getTime()
  setAutoplayDirection('stopped')
  setDisplayDate(now)

  // Sync the hidden date input
  if (dateInputRef.current) {
    dateInputRef.current.value = formatDateForInput(now)
  }
}
```

Also sync when autoplay stops:

```typescript
// When autoplay stops, sync input to final date
useEffect(() => {
  if (autoplayDirection === 'stopped' && dateInputRef.current) {
    dateInputRef.current.value = formatDateForInput(displayDate)
  }
}, [autoplayDirection, displayDate])
```

And during autoplay, keep the input synced (so if the user taps the date mid-autoplay, the picker shows the current animation date, not a stale date):

```typescript
// In useFrame during autoplay:
if (animationSpeed.current !== 0 && dateInputRef.current) {
  const d = new Date(animationTime.current)
  const formatted = formatDateForInput(d)
  if (dateInputRef.current.value !== formatted) {
    dateInputRef.current.value = formatted
  }
}
```

---

## Do NOT

- Do NOT add any visible date input elements to the page layout
- Do NOT change the autoplay buttons layout or styling
- Do NOT change the solar system view or planet positions
- Do NOT change geocentric view header behaviour — date is NOT tappable in geocentric view
- Do NOT change any transition animations

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: NO visible date input anywhere below the autoplay controls — removed completely
3. Test: in heliocentric view, header date has subtle dotted underline hint
4. Test: tap header date in heliocentric view → OS date picker opens
5. Test: select a date → planets jump to that date, picker closes
6. Test: tap Today → planets return to today AND date input syncs to today
7. Test: run autoplay, then tap Today → both animation and date input reset
8. Test: run autoplay, tap header date → picker shows current animation date, not stale date
9. Test: in geocentric view, header date is NOT tappable — no underline, no picker
10. Test: solar system has full screen space — nothing pushed up
11. Test: on iOS Safari — picker opens as bottom sheet, no zoom, works correctly
12. Commit: `fix: date picker via header tap, no layout space used, today sync`
13. Push to `main`
