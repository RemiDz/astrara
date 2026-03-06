# ASTRARA — Solar System View: Label Visibility Toggle

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## What to Add

A small toggle button in heliocentric (solar system) view that hides/shows all planet text labels. When labels are hidden, only the planet spheres and orbital rings are visible — a clean, cinematic view.

Read all current heliocentric view, label, and button source files before making changes.

---

## 1. State

```typescript
const [showHelioLabels, setShowHelioLabels] = useState(true)
```

Persist in localStorage so the preference survives page refreshes:

```typescript
// On mount, read from localStorage
const [showHelioLabels, setShowHelioLabels] = useState(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('astrara-helio-labels')
    return saved !== null ? saved === 'true' : true
  }
  return true
})

// On change, save to localStorage
useEffect(() => {
  localStorage.setItem('astrara-helio-labels', String(showHelioLabels))
}, [showHelioLabels])
```

---

## 2. Toggle Button Placement & Styling

Place the toggle button in the TOP-RIGHT area of the wheel, floating above the solar system view. It should only appear in heliocentric view — fade in with `helioOpacity` and be completely hidden in geocentric view.

Use the EXACT same styling as the header icon buttons (sound, info, settings) for consistency — same size, same glass morphism, same hover/active states:

```tsx
{viewMode === 'heliocentric' && (
  <button
    onClick={() => setShowHelioLabels(prev => !prev)}
    aria-label={showHelioLabels ? 'Hide planet labels' : 'Show planet labels'}
    className="absolute top-2 right-4 z-10
               w-9 h-9 rounded-full flex items-center justify-center
               backdrop-blur-md transition-all duration-200 active:scale-90
               bg-white/5 border border-white/8 text-white/45 
               hover:text-white/70 hover:bg-white/8"
    style={{ opacity: helioOpacity }}
  >
    {showHelioLabels ? <TagIcon size={16} /> : <TagOffIcon size={16} />}
  </button>
)}
```

Position it relative to the wheel container so it floats over the solar system.

### SVG Icons

Use clean inline SVG icons consistent with the autoplay chevron icons:

```tsx
// Tag icon — labels visible (a small "T" or text/tag icon)
function TagIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  )
}

// Tag off icon — labels hidden (same icon with a diagonal slash)
function TagOffIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  )
}
```

---

## 3. Hide/Show Labels with Animation

When the toggle is tapped, labels should FADE out/in smoothly — not snap on/off.

Use a ref to track the label opacity target and lerp in useFrame:

```typescript
const labelVisibilityTarget = showHelioLabels ? 1 : 0
const currentLabelOpacity = useRef(1)

// In useFrame:
currentLabelOpacity.current += (labelVisibilityTarget - currentLabelOpacity.current) * delta * 5
// ~200ms fade
```

Apply `currentLabelOpacity.current` to ALL planet labels in heliocentric view:

- Planet name labels (♂ Mars, ♀ Venus, etc.)
- Sun centre label (☉ Sun)
- Earth "Home" label
- Moon glyph (☽)

```typescript
// On each label's Html wrapper:
style={{
  opacity: helioOpacity * currentLabelOpacity.current,
  pointerEvents: currentLabelOpacity.current < 0.1 ? 'none' : 'auto',
}}
```

---

## 4. What Labels Hidden Looks Like

With labels OFF:
- Only planet spheres visible (with their colours, sizes, glows)
- Orbital rings still visible
- Sun corona still visible
- Earth Kp aura still visible
- Starfield/nebulae still visible
- The toggle button itself still visible
- Autoplay controls still visible
- Header still visible

Essentially a pure, cinematic solar system — just orbits and glowing planets against the cosmic backdrop.

---

## 5. Planet Taps Still Work with Labels Hidden

Even with labels hidden, tapping a planet sphere should still open its detail panel. The tap targets are on the planet meshes/Html overlays, not the labels. Ensure tap targets remain active when labels are invisible.

---

## Do NOT

- Do NOT change any planet positions, sizes, or colours
- Do NOT change orbital rings
- Do NOT change autoplay controls or animation
- Do NOT change the geocentric/heliocentric transition
- Do NOT change geocentric view labels
- Do NOT hide the toggle button itself when labels are off
- Do NOT hide autoplay controls when labels are off

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: toggle button only appears in heliocentric view
3. Test: toggle button matches header icon styling (same size, same glass morphism)
4. Test: tap toggle → labels fade out smoothly (~200ms)
5. Test: tap toggle again → labels fade back in smoothly
6. Test: with labels off, only planet spheres and orbital rings visible — clean cinematic look
7. Test: with labels off, tap a planet → detail panel still opens
8. Test: preference persists after page refresh
9. Test: switch to geocentric → toggle disappears, labels show normally on wheel
10. Test: switch back to heliocentric → toggle reappears, label state preserved
11. Commit: `feat: label visibility toggle for solar system view`
12. Push to `main`
