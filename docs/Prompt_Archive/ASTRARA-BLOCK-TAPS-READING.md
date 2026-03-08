# Astrara — Fix: Disable Planet & Zodiac Taps During Cosmic Reading

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

When Cosmic Reading modal is open, tapping planets or zodiac signs on the wheel still opens their detail info panels. These panels render behind the reading modal, making the app look broken. Planet/zodiac taps should be completely disabled during Cosmic Reading.

## FIX

Find the click/tap handlers on planet meshes and zodiac sign elements. Wrap them with a guard that checks if Cosmic Reading is active — if yes, do nothing.

### Implementation

```typescript
const { state } = useReadingContext();
const isReadingActive = state !== 'IDLE';

// In planet/zodiac click handlers:
const handlePlanetClick = (planetId: string) => {
  if (isReadingActive) return; // Block during reading
  // ... existing logic
};

const handleZodiacClick = (signId: string) => {
  if (isReadingActive) return; // Block during reading
  // ... existing logic
};
```

### Where

Search for all tap/click handlers on planets and zodiac signs:

```bash
grep -rn "onClick\|onPointerDown\|onPointerUp\|handlePlanet\|handleZodiac\|handleSign" src/
```

Add the guard to EVERY handler that opens an info panel or detail view from the wheel.

### Also Close Any Open Panels on Reading Enter

If a planet or zodiac info panel is already open when the user taps "Cosmic Reading", close it automatically:

```typescript
// When reading state transitions from IDLE to any other state:
// Dispatch close/dismiss action for any open planet or zodiac detail panel
```

Search for the state that controls panel visibility:

```bash
grep -rn "selectedPlanet\|activePlanet\|showPlanet\|planetDetail\|selectedSign\|activeSign" src/
```

Set it to `null` or `false` when reading begins.

---

## TESTING

- [ ] Open Cosmic Reading → tap any planet on wheel → nothing happens
- [ ] Open Cosmic Reading → tap any zodiac sign → nothing happens
- [ ] Have a planet info panel open → tap Cosmic Reading → panel closes automatically
- [ ] Exit Cosmic Reading → planet and zodiac taps work normally again
- [ ] Horizontal wheel spin still works during reading (from previous fix)
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: disable planet and zodiac taps during Cosmic Reading, auto-close open panels"
git push origin master:main
```
