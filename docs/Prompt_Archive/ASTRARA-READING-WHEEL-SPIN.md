# Astrara — Fix: Allow Horizontal Wheel Spin in Cosmic Reading Mode

Do NOT ask for confirmation at any step. Do NOT stop to explain what you're about to do. Just implement each step and move on.

---

## ISSUE

During Cosmic Reading, orbit controls are fully disabled. Users cannot rotate the wheel to see planets hidden behind others. We want to allow left/right spinning while keeping everything else locked.

## FIX

When Cosmic Reading is active, configure OrbitControls to allow ONLY azimuthal (horizontal/left-right) rotation:

### What to Unlock
- **Azimuthal rotation (left/right spin):** ENABLED — free horizontal rotation
- **Auto-rotate:** DISABLED — stop the idle auto-spin so user has full manual control

### What to Keep Locked
- **Polar rotation (up/down tilt):** LOCKED at current angle
- **Zoom:** DISABLED
- **Pan:** DISABLED

### Implementation

Find where OrbitControls are configured during reading mode. Currently it likely sets `enabled = false`. Replace with:

```typescript
if (isReadingActive) {
  controls.enabled = true;                    // Re-enable controls
  controls.enableRotate = true;               // Allow rotation
  controls.enableZoom = false;                // No zoom
  controls.enablePan = false;                 // No pan
  controls.autoRotate = false;                // Stop auto-spin

  // Lock polar angle (vertical tilt) to current value
  const currentPolar = controls.getPolarAngle();
  controls.minPolarAngle = currentPolar;
  controls.maxPolarAngle = currentPolar;

  // Allow full horizontal rotation (no limits)
  controls.minAzimuthAngle = -Infinity;
  controls.maxAzimuthAngle = Infinity;

  // Optional: add damping for smooth feel
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
} else {
  // Restore normal controls (whatever the default config is)
  controls.enableZoom = true;
  controls.enablePan = true; // or false if pan was never enabled
  controls.autoRotate = true;
  
  // Unlock polar angle back to defaults
  controls.minPolarAngle = /* original min value */;
  controls.maxPolarAngle = /* original max value */;
}
```

### Important: Save and Restore Original Polar Angle

When entering reading mode, capture the current polar angle BEFORE locking it. When exiting, restore the original min/max polar angle limits — do NOT hardcode values.

```typescript
const savedPolarRef = useRef({ min: 0, max: Math.PI });

// On reading enter:
savedPolarRef.current = {
  min: controls.minPolarAngle,
  max: controls.maxPolarAngle,
};
const currentPolar = controls.getPolarAngle();
controls.minPolarAngle = currentPolar;
controls.maxPolarAngle = currentPolar;

// On reading exit:
controls.minPolarAngle = savedPolarRef.current.min;
controls.maxPolarAngle = savedPolarRef.current.max;
```

### Where

Find the OrbitControls configuration — likely in:
```bash
grep -rn "OrbitControls\|orbitControls\|useOrbitControls\|controls.enabled" src/
```

This may be in the main Canvas component, a camera controller component, or inside the reading animation hook.

---

## TESTING

- [ ] Enter Cosmic Reading → can spin wheel left and right by dragging
- [ ] Vertical tilt is locked — cannot tilt up or down
- [ ] Zoom is locked — pinch/scroll does nothing
- [ ] Pan is locked — cannot drag the whole scene
- [ ] Auto-rotation stops during reading
- [ ] Spin feels smooth with damping (not jerky)
- [ ] Exit Cosmic Reading → all controls restore to normal behaviour
- [ ] Auto-rotation resumes after exiting reading
- [ ] Tilt limits restore correctly after exiting
- [ ] Works on both touch (mobile) and mouse (desktop)
- [ ] Aspect beam animations still display correctly while wheel is rotated
- [ ] Build succeeds with zero TypeScript errors

---

## GIT

```bash
git add -A
git commit -m "feat: allow horizontal wheel spin during Cosmic Reading — lock tilt, zoom, pan"
git push origin master:main
```
