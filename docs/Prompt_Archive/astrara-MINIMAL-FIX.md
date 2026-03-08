# Astrara — Minimal Fix: Hide Moon Card + Expand Reading + Debug Overflow

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## THREE THINGS TO DO. NOTHING ELSE.

---

## 1. HIDE the CosmicWeather panel (Moon Phase card etc.) during reading

The "MĖNULIO FAZĖ / Waning Gibbous" card that appears between the wheel and the reading card is the existing `CosmicWeather` component. It serves no purpose during Cosmic Reading and steals vertical space.

In `page.tsx`, find where `<CosmicWeather />` is rendered. It's inside a `<div className="mt-6">` wrapper. Hide it during reading using the same method used for the view toggle buttons and day navigation.

Either wrap it with the existing ReadingDim component (if ReadingDim now returns null during reading), OR add a direct conditional:

```tsx
{!isReadingActive && (
  <div className="mt-6">
    <CosmicWeather ... />
  </div>
)}
```

Make sure `isReadingActive` is accessible at this point in the JSX. If it's not directly available, use the same pattern used elsewhere in page.tsx to read from ReadingContext (e.g. through a wrapper component or by checking the context).

Also hide the shimmer loading placeholder for CosmicWeather during reading:

```tsx
{!isReadingActive && (
  <div className="mt-6">
    {astroData ? (
      <CosmicWeather ... />
    ) : (
      <div className="space-y-3">
        <Shimmer ... />
      </div>
    )}
  </div>
)}
```

---

## 2. EXPAND the reading card to use the freed space

Now that CosmicWeather is hidden, there's more room for the reading card. Increase the card's max height.

In `src/features/cosmic-reading/components/PhaseCard.tsx`, find the scrollable content area's `max-h-[30vh]` (or whatever it currently is) and change to:

```tsx
max-h-[45vh]
```

Do the same in `ReadingSummaryCard.tsx`.

This lets the reading text fill the space previously occupied by the Moon Phase card. Users can read more content without scrolling.

---

## 3. FIX the right-side wheel overflow — CC MUST DEBUG THIS

Previous attempts to fix this via CSS property guessing have failed repeatedly. This time, do not guess. Debug it properly.

### Step A: Find the overflow source

Run this command in the browser console on the deployed app (or add it temporarily to page.tsx as a useEffect):

```javascript
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > document.documentElement.clientWidth) {
    console.log('OVERFLOW:', el.tagName, el.className, el.id, 'scrollWidth:', el.scrollWidth, 'clientWidth:', document.documentElement.clientWidth);
  }
});
```

Or alternatively, add this temporary CSS to the global stylesheet to visually identify the overflowing element:

```css
* { outline: 1px solid rgba(255,0,0,0.1) !important; }
```

### Step B: Identify the EXACT element

The overflowing element is likely one of:
- The `<canvas>` element itself (rendered by R3F)
- The div wrapping the Canvas with `position: absolute`
- The outer wheel container div
- Something inside the 3D scene that extends beyond bounds

### Step C: Fix it based on findings

Whatever element is overflowing, constrain it. The most likely fix is adding `overflow: hidden` to the correct container. But the key is to find the RIGHT container first.

If it turns out the `<Canvas>` element itself is wider than the viewport:
- The R3F Canvas may need an explicit `width` style or the container needs `overflow: hidden` at the right level
- Try setting `style={{ width: '100%', maxWidth: '100vw' }}` on the Canvas element

If it's the absolutely positioned inner wrapper:
- Ensure it has `width: '100%'` AND `maxWidth: '100%'` AND `overflow: hidden`

**Report what you find** — add a comment in the code next to the fix explaining which element was overflowing and why.

---

## VERIFICATION

- [ ] Moon Phase card ("MĖNULIO FAZĖ / Waning Gibbous") is NOT visible during Cosmic Reading
- [ ] Reading card content area is taller — approximately 45vh
- [ ] The wheel does NOT extend beyond the right edge of the screen
- [ ] No horizontal scrollbar
- [ ] When reading exits, the Moon Phase card reappears
- [ ] All other functionality unchanged

## DO NOT CHANGE ANYTHING ELSE

Do not modify:
- Planet highlight glow values
- Wheel container height (keep the 65vw/95vw toggle from previous fix)
- Transition timing
- Camera controller
- Template content
- Header compact mode

Git push: `git push origin master:main`
