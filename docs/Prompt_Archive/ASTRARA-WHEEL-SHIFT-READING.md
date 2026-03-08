# Astrara — Fix: Shift Astro Wheel Up During Cosmic Reading

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

When Cosmic Reading mode is active, the bottom portion of the Astro Wheel gets hidden behind the reading modal overlay. There is wasted empty space above the wheel (between the header and the top of the wheel) because the wheel container reserves vertical space for user-controlled rotation to 2D view. During Cosmic Reading, orbit controls are locked so this reserved space is unnecessary.

## FIX

When Cosmic Reading is active, apply a CSS `translateY` shift to move the wheel upward into the unused space, making the full wheel visible above the reading modal.

### Implementation

1. Find the wheel's canvas container (the element wrapping the `<Canvas>` or the Three.js scene).

2. When the reading state is NOT `IDLE` (i.e. Cosmic Reading is active), apply:

```css
transform: translateY(-[X]px);
transition: transform 600ms ease-in-out;
```

3. When reading exits (state returns to `IDLE`), remove the transform:

```css
transform: translateY(0);
transition: transform 600ms ease-in-out;
```

### Finding the Right Offset Value

The exact pixel value depends on the layout. To determine it:

1. Measure the gap between the header bottom and the top of the visible wheel in the default 3D perspective view
2. That gap (approximately) is how far the wheel can shift up
3. A reasonable starting value is likely **60–80px** but test visually on mobile viewport (375px width)

Use a CSS custom property so it's easy to tune:

```css
:root {
  --reading-wheel-offset: -70px; /* adjust as needed */
}
```

### Where to Apply

The `translateY` should go on the **canvas container div**, NOT on the Three.js camera or scene objects. Moving the DOM container is cleaner than adjusting the 3D camera position, and it transitions smoothly with CSS.

### How to Toggle

The reading state is available via `useReadingContext()` or the reading state machine. Check if the current state is anything other than `IDLE`:

```typescript
const { state } = useReadingContext();
const isReadingActive = state !== 'IDLE';

// On the canvas container:
style={{
  transform: isReadingActive ? 'translateY(var(--reading-wheel-offset))' : 'translateY(0)',
  transition: 'transform 600ms ease-in-out',
}}
```

### Important Constraints

- Do NOT change the wheel size or scale — only shift its vertical position
- Do NOT modify the camera position or Three.js scene — this is a DOM-level shift only
- The shift must animate smoothly (600ms ease-in-out) when entering and exiting reading mode
- The header must NOT be overlapped — if the wheel shifts too far up, planets or zodiac signs at the top could clip behind the header. Add `overflow: hidden` to the canvas container if needed, OR cap the offset so the topmost wheel elements stay below the header
- Test on mobile (375px viewport) — the wheel must be fully visible between header and reading modal

---

## TESTING

- [ ] Open Cosmic Reading → wheel smoothly shifts up (~600ms)
- [ ] Full wheel visible — bottom no longer hidden by modal
- [ ] Top of wheel does not overlap or clip behind the header
- [ ] Close Cosmic Reading → wheel smoothly shifts back down to original position
- [ ] Wheel rotation/interaction still works normally when not in reading mode
- [ ] Test on mobile viewport (375px width)
- [ ] No layout jumps or flicker during transition
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: shift astro wheel up during Cosmic Reading to prevent modal clipping"
git push origin master:main
```
