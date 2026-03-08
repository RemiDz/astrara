# Astrara — Exact Fix Based on Actual Code

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## WHAT TO DO

Make these EXACT changes to these EXACT files. Do not change anything else.

---

## FILE 1: `src/components/AstroWheel/AstroWheel3D.tsx`

### Change A: Revert the outer container div (around line 1786-1800)

FIND this:
```tsx
<div
  className="relative w-full select-none"
  style={{
    height: isReadingMode ? '65vw' : '95vw',
    maxHeight: isReadingMode ? '380px' : '550px',
    overflowX: 'hidden',
    overflowY: 'hidden',
    touchAction: 'none',
    background: 'transparent',
    transition: 'height 0.5s ease-out, max-height 0.5s ease-out',
    WebkitTapHighlightColor: 'transparent',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    outline: 'none',
  }}
>
```

REPLACE WITH:
```tsx
<div
  className="relative w-full select-none"
  style={{
    height: '95vw',
    maxHeight: '550px',
    overflow: 'visible',
    touchAction: 'none',
    background: 'transparent',
    WebkitTapHighlightColor: 'transparent',
    WebkitUserSelect: 'none',
    userSelect: 'none',
    outline: 'none',
  }}
>
```

Removed: all conditional `isReadingMode` height, `overflowX`, `overflowY`, `transition`. Back to fixed `95vw`/`550px` and `overflow: 'visible'`.

### Change B: Revert the inner Canvas wrapper div (around line 1812-1823)

FIND this:
```tsx
<div style={{
  opacity: sceneReady ? 1 : 0,
  width: '100%',
  height: '95vw',
  maxHeight: '550px',
  position: 'absolute',
  left: 0,
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  overflow: 'hidden',
}}>
```

REPLACE WITH:
```tsx
<div style={{
  opacity: sceneReady ? 1 : 0,
  width: '100%',
  height: '100%',
  position: 'absolute',
  inset: 0,
}}>
```

Removed: the explicit `95vw` height, `left`/`right`/`top` positioning, `translateY(-50%)` transform, and `overflow: hidden`. Back to simple `inset: 0` which fills the parent.

### Change C: Remove the `isReadingMode` variable (around line 1783)

FIND:
```tsx
const isReadingMode = props.readingAnimation?.isActive === true
```

DELETE this line. It's no longer used.

---

## FILE 2: `src/app/page.tsx`

No changes needed. The `overflow-x-hidden` on line 331 stays. The `ReadingWheelPadding`, `ReadingDim`, `ReadingAwareHeader` components stay as they are — they correctly hide controls and reduce padding during reading.

---

## THAT'S IT. TWO CHANGES IN ONE FILE.

---

## VERIFICATION

- [ ] Wheel displays at FULL SIZE — not clipped on any side (top, bottom, left, right)
- [ ] Wheel looks identical to how it looked before Cosmic Reading was added
- [ ] During reading: controls are hidden, header is compact, CosmicWeather is hidden (these all still work from previous fixes)
- [ ] During reading: the reading card displays at bottom of screen
- [ ] No horizontal scrollbar
- [ ] Normal wheel interaction works (orbit, planet tap, sign tap)
- [ ] Solar System View works correctly
- [ ] Loading animation works correctly

## DO NOT CHANGE ANYTHING ELSE

Git push: `git push origin master:main`
