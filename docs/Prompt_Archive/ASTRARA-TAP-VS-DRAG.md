# Astrara — Fix: Distinguish Tap vs Drag on Planets & Zodiac Signs

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

When users try to spin the Astro Wheel by dragging, if their finger/cursor starts on a planet or zodiac sign, the drag is blocked and a tap action fires instead. This creates frustration — users repeatedly try to spin but the wheel won't respond because they keep accidentally "tapping" interactive elements.

## ROOT CAUSE

Planet and zodiac click handlers use `onClick` or `onPointerDown` which fires immediately, consuming the event before OrbitControls can process it as a drag. The app cannot currently tell the difference between "user tapped to view info" and "user started a drag to spin the wheel."

## FIX

Implement a **tap vs drag detector** that distinguishes intent based on pointer movement and duration:

- **Tap** = pointer down + pointer up with less than 5px movement and less than 300ms duration → open info panel
- **Drag** = pointer moves more than 5px from start position → do NOT open info panel, let OrbitControls handle the spin

### Implementation: Create a Reusable Hook

```typescript
// src/hooks/useTapVsDrag.ts

import { useRef, useCallback } from 'react';

interface TapVsDragOptions {
  moveThreshold?: number;    // pixels — default 5
  timeThreshold?: number;    // ms — default 300
  onTap: () => void;
}

export function useTapVsDrag({ moveThreshold = 5, timeThreshold = 300, onTap }: TapVsDragOptions) {
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const startTime = useRef<number>(0);
  const isDragging = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent | any) => {
    // Get client coordinates — handle both React events and R3F events
    const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
    const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;
    
    startPos.current = { x: clientX, y: clientY };
    startTime.current = Date.now();
    isDragging.current = false;

    // IMPORTANT: Do NOT call e.stopPropagation()
    // Let the event bubble up to OrbitControls
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent | any) => {
    if (!startPos.current) return;
    
    const clientX = e.clientX ?? e.nativeEvent?.clientX ?? 0;
    const clientY = e.clientY ?? e.nativeEvent?.clientY ?? 0;

    const dx = clientX - startPos.current.x;
    const dy = clientY - startPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > moveThreshold) {
      isDragging.current = true;
    }
  }, [moveThreshold]);

  const onPointerUp = useCallback((e: React.PointerEvent | any) => {
    if (!startPos.current) return;

    const elapsed = Date.now() - startTime.current;

    if (!isDragging.current && elapsed < timeThreshold) {
      // This was a tap, not a drag
      onTap();
    }

    // Reset
    startPos.current = null;
    isDragging.current = false;
  }, [timeThreshold, onTap]);

  return { onPointerDown, onPointerMove, onPointerUp };
}
```

### Apply to Planet Meshes

Find where planet meshes handle clicks. Replace the current `onClick` / `onPointerDown` + `stopPropagation` pattern with the new hook:

```typescript
// BEFORE (broken — blocks drag):
<mesh onClick={(e) => { e.stopPropagation(); openPlanetInfo(planetId); }}>

// AFTER (tap vs drag aware):
const { onPointerDown, onPointerMove, onPointerUp } = useTapVsDrag({
  onTap: () => openPlanetInfo(planetId),
});

<mesh
  onPointerDown={onPointerDown}
  onPointerMove={onPointerMove}
  onPointerUp={onPointerUp}
>
```

### Apply to Zodiac Sign Elements

Same pattern for zodiac sign badges/labels:

```typescript
// BEFORE:
<Html onClick={(e) => { e.stopPropagation(); openSignInfo(signId); }}>

// AFTER:
const { onPointerDown, onPointerMove, onPointerUp } = useTapVsDrag({
  onTap: () => openSignInfo(signId),
});

<Html>
  <div
    onPointerDown={onPointerDown}
    onPointerMove={onPointerMove}
    onPointerUp={onPointerUp}
  >
```

### Critical: Do NOT stopPropagation on pointerDown

The key fix is removing `e.stopPropagation()` from `onPointerDown`. This is what was blocking OrbitControls from receiving the drag event. The event must bubble up so OrbitControls can track it.

If `stopPropagation` was added to fix a different issue (like preventing double-fire or camera jump), note what that issue was and find an alternative solution that doesn't block drag events.

### Search and Replace All Instances

```bash
grep -rn "stopPropagation" src/
grep -rn "onClick.*planet\|onClick.*sign\|onClick.*zodiac" src/
grep -rn "onPointerDown.*planet\|onPointerDown.*sign" src/
```

Replace ALL interactive element handlers on the wheel with the tap-vs-drag pattern.

### Edge Case: Reading Mode Guard

Remember to keep the reading mode guard from the previous fix. Combine both:

```typescript
const { state } = useReadingContext();
const isReadingActive = state !== 'IDLE';

const { onPointerDown, onPointerMove, onPointerUp } = useTapVsDrag({
  onTap: () => {
    if (isReadingActive) return; // Block during reading
    openPlanetInfo(planetId);
  },
});
```

---

## TESTING

- [ ] Drag starting on a planet → wheel spins normally, no info panel opens
- [ ] Drag starting on a zodiac sign → wheel spins normally, no info panel opens
- [ ] Quick tap on a planet → info panel opens as before
- [ ] Quick tap on a zodiac sign → info panel opens as before
- [ ] Fast flick/swipe across planets → wheel spins, nothing else happens
- [ ] Slow deliberate tap (under 300ms, no movement) → opens info
- [ ] Long press (over 300ms, no movement) → does NOT open info (prevents accidental taps)
- [ ] Drag on empty wheel space → still spins normally (no regression)
- [ ] Touch works correctly on mobile (finger drag vs finger tap)
- [ ] Mouse works correctly on desktop (click-drag vs click)
- [ ] During Cosmic Reading: taps still blocked (previous fix preserved)
- [ ] During Cosmic Reading: horizontal spin still works (previous fix preserved)
- [ ] No regressions to existing planet/zodiac info panel content
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "fix: distinguish tap vs drag on planets and zodiac signs — allow wheel spin through interactive elements"
git push origin master:main
```
