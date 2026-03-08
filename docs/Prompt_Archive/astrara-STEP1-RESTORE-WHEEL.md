# Astrara — Step 1 of 2: Restore AstroWheel3D.tsx from Git History

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on. Use ultrathink for this task.

---

## OBJECTIVE

The file `src/components/AstroWheel/AstroWheel3D.tsx` has been damaged by multiple rounds of CSS changes to its container and Canvas wrapper. We need to restore it to the version that existed BEFORE any Cosmic Reading work began, then re-add ONLY the minimal reading integration.

---

## STEP 1: Find the original version in git

Run:
```bash
git log --oneline -- src/components/AstroWheel/AstroWheel3D.tsx
```

Find the commit BEFORE any Cosmic Reading changes were introduced (before any mention of `readingAnimation`, `isReadingMode`, `readingDimOpacity`, `PlanetHighlight`, `AspectLineOverlay`, or `ReadingCameraController` was added to this file).

Then restore that version:
```bash
git checkout <that-commit-hash> -- src/components/AstroWheel/AstroWheel3D.tsx
```

---

## STEP 2: Verify the restored file

The restored `AstroWheel3D.tsx` should:
- NOT import anything from `@/features/cosmic-reading/`
- NOT reference `readingAnimation`, `isReadingMode`, `readingDimOpacity`
- NOT contain `PlanetHighlight`, `AspectLineOverlay`, or `ReadingCameraController`
- Have its outer container div with `height: '95vw'`, `maxHeight: '550px'`, `overflow: 'visible'`
- Have its inner Canvas wrapper with `width: '100%'`, `height: '100%'`, `position: 'absolute'`, `inset: 0`

If git history doesn't have a clean pre-reading version, manually remove ALL reading-related code from the current file:
1. Remove the import of `SerializedReadingAnimation`, `PlanetHighlight`, `AspectLineOverlay`, `ReadingCameraController`
2. Remove `readingAnimation` from the props interface
3. Remove `isReadingMode` variable
4. Remove the `readingDimOpacity` prop from every `<PlanetOrb>` component
5. Remove the entire `{/* Reading animation layer */}` block (PlanetHighlight, AspectLineOverlay, ReadingCameraController)
6. Restore the outer container to: `height: '95vw'`, `maxHeight: '550px'`, `overflow: 'visible'` — no conditionals
7. Restore the inner Canvas wrapper to: `width: '100%'`, `height: '100%'`, `position: 'absolute'`, `inset: 0` — no transforms, no explicit height values

---

## STEP 3: Also restore AstroWheel3DWrapper.tsx

Check if `src/components/AstroWheel/AstroWheel3DWrapper.tsx` was modified. If it imports `SerializedReadingAnimation` or has a `readingAnimation` prop, restore it from git too:

```bash
git log --oneline -- src/components/AstroWheel/AstroWheel3DWrapper.tsx
git checkout <pre-reading-commit> -- src/components/AstroWheel/AstroWheel3DWrapper.tsx
```

Or manually remove the `readingAnimation` prop from the Props interface and from the `<AstroWheel3D {...props} />` spread.

---

## STEP 4: Update page.tsx to not pass readingAnimation

In `src/app/page.tsx`, find the `ReadingAwareWheel` component (around line 876-887). It currently passes `readingAnimation` to `AstroWheel3DWrapper`. Since the wrapper no longer accepts that prop, simplify it:

Change `ReadingAwareWheel` to just pass through props without reading animation:

```tsx
function ReadingAwareWheel(props: React.ComponentProps<typeof AstroWheel3DWrapper>) {
  return <AstroWheel3DWrapper {...props} />
}
```

Or even simpler — remove `ReadingAwareWheel` entirely and use `AstroWheel3DWrapper` directly in the JSX. But if that's too much refactoring, just remove the `readingAnimation` prop passing.

Keep the `useReadingAnimation` and `serializeAnimationState` imports for now — they'll be needed when we re-add animation properly in Step 2.

---

## STEP 5: Verify build and visual

```bash
npm run build
```

Must pass with no errors. Then deploy and verify:

- [ ] Wheel displays at FULL SIZE — identical to how it looked before Cosmic Reading work
- [ ] No clipping on any side
- [ ] No horizontal overflow
- [ ] Wheel interaction works (orbit, zoom, planet tap, sign tap)
- [ ] Solar System View works
- [ ] Loading animation works
- [ ] Cosmic Reading button still appears (it's in page.tsx, not in the wheel)
- [ ] Tapping Cosmic Reading opens the overlay with reading cards (they work independently of the wheel)
- [ ] The reading overlay shows on top of the wheel but the wheel has NO animation (no highlighting, no camera movement) — this is expected and OK for now

---

## DO NOT do anything else. Do not re-add reading animations. That is Step 2.

Git push: `git push origin master:main`
