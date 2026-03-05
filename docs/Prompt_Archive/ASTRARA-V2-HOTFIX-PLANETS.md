# ASTRARA v2 — Hotfix: Planet Sizes & Tap Targets

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Planets on the astro wheel are too small — hard to see and hard to tap on mobile. The zodiac sign badges are nicely sized at ~44px but the planets feel like tiny dots by comparison. Planets are the PRIMARY interactive elements (live, changing data) and should be visually prominent. Read the current wheel/planet component code before making changes.

---

## 1. Increase Planet Orb Sizes

Update the 3D sphere radius for each planet. These are the NEW sizes (roughly 1.5–2x the current sizes):

```typescript
const PLANET_SIZES: Record<string, number> = {
  Sun:     0.28,   // largest — the star, dominant presence
  Moon:    0.22,   // second largest — emotionally important
  Jupiter: 0.20,   // gas giant — big and expansive
  Saturn:  0.19,   // gas giant with ring
  Mars:    0.17,   // inner planet, strong energy
  Venus:   0.17,   // inner planet, strong energy
  Mercury: 0.14,   // smallest inner planet
  Uranus:  0.15,   // outer planet
  Neptune: 0.15,   // outer planet
  Pluto:   0.12,   // smallest — dwarf planet, mysterious
}
```

Also increase the **glow/emissive radius** proportionally for each planet so the glow halo scales with the orb.

---

## 2. Increase Tap Target Areas

Regardless of the visible planet size, EVERY planet must have a minimum 48×48px invisible tap target. This is the `<Html>` overlay button that captures taps.

```tsx
<Html center zIndexRange={[100, 0]} style={{ pointerEvents: 'auto' }}>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation()
      onPlanetTap(planet)
    }}
    onPointerDown={(e) => e.stopPropagation()}
    className="flex items-center justify-center select-none cursor-pointer
               active:scale-90 transition-transform duration-150"
    style={{
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'transparent',
      border: 'none',
    }}
    aria-label={`View ${planet.name} details`}
  />
</Html>
```

48px is Apple's recommended minimum for comfortable tapping. Do NOT make the tap target the same size as the visible orb — it must always be at least 48×48px even for small planets like Pluto.

---

## 3. Planet Label Sizing

The planet labels (glyph + degree, e.g. "☉ 17°") should also scale up slightly to remain readable against the larger orbs:

```tsx
<div
  className="whitespace-nowrap select-none pointer-events-none"
  style={{
    fontSize: '12px',
    fontFamily: "'DM Sans', sans-serif",
    color: 'white',
    opacity: 0.85,
    textShadow: `0 0 8px ${planet.colour}80, 0 1px 3px rgba(0,0,0,0.8)`,
    background: 'rgba(0,0,0,0.45)',
    backdropFilter: 'blur(4px)',
    padding: '2px 6px',
    borderRadius: '6px',
  }}
>
  {planet.glyph} {planet.degreeInSign}°
</div>
```

Labels should be positioned just below each planet orb, offset enough that they don't overlap the tap target.

---

## 4. Overlap Prevention

With larger planets, some may overlap when they're close together in the same zodiac sign (conjunction). Handle this:

**If two planets are within 8° of each other:**
- Offset them slightly on the Y axis (one higher, one lower on the wheel plane)
- Or offset their orbital radius slightly (one on an inner track, one on outer track)

```typescript
// Simple overlap detection
function adjustForOverlap(planets: PlacedPlanet[]): PlacedPlanet[] {
  const sorted = [...planets].sort((a, b) => a.longitude - b.longitude)
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    const gap = Math.abs(curr.longitude - prev.longitude)
    
    if (gap < 8) {
      // Offset on Y axis: push one up, one down
      prev.yOffset = -0.15
      curr.yOffset = 0.15
    }
  }
  
  return sorted
}
```

This prevents planets from stacking directly on top of each other and making both untappable.

---

## 5. Visual Hierarchy Check

After resizing, the visual hierarchy should be:

1. **Sun & Moon** — immediately eye-catching, largest orbs, brightest glow
2. **Inner planets** (Mercury, Venus, Mars) — clearly visible, distinct colours
3. **Gas giants** (Jupiter, Saturn) — large, Saturn has its ring identifier
4. **Outer planets** (Uranus, Neptune, Pluto) — smaller but still clearly tappable

The zodiac sign badges should NOT visually overpower the planets. If the badges are currently larger than the planets after this fix, reduce the badge size slightly (from w-11 h-11 to w-9 h-9) so planets remain the visual focus.

---

## Build Steps

1. Read the current planet rendering code — find where sizes are defined
2. Update all planet sphere radii to the new sizes above
3. Update glow/emissive halos proportionally
4. Ensure all planet tap targets are 48×48px minimum
5. Update planet label font size to 12px
6. Add overlap prevention for conjunctions
7. Check zodiac badge sizes vs planet sizes — planets should be visually dominant
8. Test: all planets are clearly visible on mobile (375px viewport)
9. Test: tap every planet — taps register reliably first time
10. Test: when planets are close together (check current sky for conjunctions), both are tappable
11. Run `npm run build`
12. Push to **main** branch
13. Commit: `fix: increase planet sizes and tap targets for mobile usability`
