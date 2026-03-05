# ASTRARA v2 — Hotfix: Glass Cards, Birth Modal, Portrait State, Viewport

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

All interaction logic, tap handlers, modals, audio, wheel animations must remain working.

---

## Fix 1: Glass Card Styling — Blue Transparent Glossy

The current dark cards look flat and boring. Upgrade them to a blue-tinted glass style that feels premium and cosmic, while still letting the starfield show through.

### Card Style

Replace ALL content card backgrounds with:

```tsx
<div 
  className="mx-4 mb-3 rounded-2xl overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(88, 28, 135, 0.04) 100%)',
    border: '1px solid rgba(147, 197, 253, 0.08)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
  }}
>
  <div className="p-5">
    {/* card content */}
  </div>
</div>
```

Key properties:
- `linear-gradient` with very subtle blue-to-purple tint (8% and 4% opacity — barely there)
- `border` with a faint blue edge that catches the eye
- `backdropFilter: blur(8px)` creates the glass effect — background content is softly blurred through the card
- `inset box-shadow` adds a hair-thin light edge at the top for the glass reflection effect
- Outer `box-shadow` adds depth without looking heavy

### Apply to ALL Cards

This style should be applied to:
- Moon phase card
- Any planetary insight cards
- Any other content cards below the wheel
- The "What does YOUR chart look like?" area if it has a card background

### Moon Phase Card Specific

```tsx
<div 
  className="mx-4 mb-3 rounded-2xl overflow-hidden"
  style={{
    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(88, 28, 135, 0.04) 100%)',
    border: '1px solid rgba(147, 197, 253, 0.08)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
  }}
>
  <div className="p-5">
    <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-3 font-mono">
      Moon Phase
    </p>
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">🌕</span>
      <div>
        <h3 className="text-lg font-serif text-white/85">Full Moon</h3>
        <p className="text-xs text-white/35">98% illumination</p>
      </div>
    </div>
    <p className="text-sm text-white/45 mt-3">
      Moon in {moonSign} {moonGlyph} {moonDegree}°
    </p>
    <p className="text-[13px] text-white/40 leading-relaxed mt-3">
      {moonInsightText}
    </p>
  </div>
</div>
```

### Also Apply to Bottom Sheet Modals

Update the zodiac detail, planet detail, Earth panel, birth chart, About, and Settings bottom sheets to use the same glass style for consistency:

```tsx
{/* Bottom sheet panel — glass style */}
<div 
  className="relative z-10 w-full max-w-md mx-auto max-h-[85vh] overflow-y-auto
             rounded-t-2xl sm:rounded-2xl p-6 pb-8
             animate-slide-up"
  style={{
    background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.92) 0%, rgba(13, 13, 26, 0.97) 100%)',
    border: '1px solid rgba(147, 197, 253, 0.06)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  }}
>
```

Note: modals use a higher opacity (92-97%) and stronger blur (20px) because they need more contrast for readability. Cards use lower opacity (8%) because they sit over the starfield.

---

## Bug 2: Birth Modal — Input Fields Overflow Screen

The date of birth and time of birth input fields extend beyond the right edge of the screen.

### Root Cause

The input fields likely have a fixed width that exceeds the modal width, or the modal padding plus input width exceeds the viewport.

### Fix

Ensure all input fields inside the birth modal use `w-full` and `box-border`:

```tsx
<input
  type="date"
  className="w-full px-4 py-3 rounded-xl
             bg-white/5 border border-white/10 
             text-white/90 text-sm
             focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20
             outline-none transition-all
             box-border"
  style={{ maxWidth: '100%' }}
/>

<input
  type="time"
  className="w-full px-4 py-3 rounded-xl
             bg-white/5 border border-white/10 
             text-white/90 text-sm
             focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20
             outline-none transition-all
             box-border"
  style={{ maxWidth: '100%' }}
/>

<input
  type="text"
  placeholder="Search for your city..."
  className="w-full px-4 py-3 rounded-xl
             bg-white/5 border border-white/10 
             text-white/90 text-sm placeholder:text-white/20
             focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20
             outline-none transition-all
             box-border"
  style={{ maxWidth: '100%' }}
/>
```

Also check the modal container itself:

```tsx
{/* Birth modal container must not exceed viewport */}
<div className="relative z-10 w-full max-w-md mx-auto
                rounded-t-2xl sm:rounded-2xl 
                p-6 pb-8
                animate-slide-up
                overflow-hidden"
     style={{ 
       maxWidth: 'calc(100vw - 32px)',  /* 16px margin each side */
       ...glassStyles 
     }}
>
```

The key fix: add `maxWidth: 'calc(100vw - 32px)'` to the modal container so it never exceeds the screen width minus margins. And ensure every input has `box-border` class (so padding is included in the width calculation).

---

## Bug 3: "Cosmic Portrait Being Prepared" — Stuck State

When the user taps "Reveal My Cosmic Portrait", the app shows "Your personal cosmic portrait is being prepared..." and gets permanently stuck.

### Root Cause

The birth chart calculation is Phase 2 (not yet implemented), so the submit handler stores data to localStorage and shows this placeholder message — but there's no way to dismiss it or go back.

### Fix

Replace the stuck "being prepared" state with a proper coming-soon message that auto-dismisses or can be dismissed:

```tsx
const handleBirthSubmit = () => {
  // Store birth data
  const birthData = { 
    date: birthDate, 
    time: birthTime, 
    city: birthCity,
  }
  localStorage.setItem('astrara-birth-data', JSON.stringify(birthData))
  
  // Show coming soon state
  setShowComingSoon(true)
  
  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    setShowComingSoon(false)
    setShowBirthInput(false)  // close the entire birth modal
  }, 4000)
}
```

The coming-soon message inside the modal:

```tsx
{showComingSoon ? (
  <div className="text-center py-8">
    <div className="text-2xl mb-4">✦</div>
    <h3 className="text-base font-serif text-white/80 mb-2">
      {t('cta.birthSaved')}
    </h3>
    <p className="text-sm text-white/40 mb-6">
      {t('cta.birthComingSoon')}
    </p>
    <button
      type="button"
      onClick={() => {
        setShowComingSoon(false)
        setShowBirthInput(false)
      }}
      className="px-6 py-2.5 rounded-xl text-sm text-white/50
                 border border-white/10 hover:border-white/20
                 hover:text-white/70 transition-all select-none"
    >
      {t('cta.gotIt')}
    </button>
  </div>
) : (
  /* existing birth form fields */
)}
```

### i18n Keys to Add

**English:**
```json
{
  "cta.birthSaved": "Birth details saved",
  "cta.birthComingSoon": "Your personal birth chart overlay is coming in a future update. We've saved your details so it will be ready when it launches.",
  "cta.gotIt": "Got it"
}
```

**Lithuanian:**
```json
{
  "cta.birthSaved": "Gimimo duomenys išsaugoti",
  "cta.birthComingSoon": "Jūsų asmeninė gimimo žemėlapio funkcija bus prieinama būsimame atnaujinime. Jūsų duomenys išsaugoti ir bus paruošti kai funkcija bus paleista.",
  "cta.gotIt": "Supratau"
}
```

---

## Bug 4: Page Zooms Beyond Mobile Viewport

The app content sometimes extends beyond the mobile viewport, causing the page to zoom out or requiring the user to pinch-to-zoom to fit everything on screen.

### Root Cause

Either some element has a fixed width exceeding 100vw, or there's horizontal overflow somewhere. On mobile, any element wider than the viewport triggers zoom behaviour.

### Fix — Multiple Layers

**1. Add viewport meta tag with zoom prevention:**

In the `<head>` of the page (in `app/layout.tsx` or `_document.tsx`):

```html
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" 
/>
```

Check if this meta tag already exists. If it does but lacks `maximum-scale=1, user-scalable=no`, add those. The `viewport-fit=cover` handles notched phones.

**2. Global overflow prevention:**

In `globals.css`:

```css
html, body {
  overflow-x: hidden;
  max-width: 100vw;
  -webkit-text-size-adjust: 100%;
}

/* Prevent any element from causing horizontal scroll */
#__next, main, [data-nextjs-scroll-focus-boundary] {
  overflow-x: hidden;
  max-width: 100vw;
}
```

**3. Canvas container must not exceed viewport:**

```tsx
<div 
  className="relative w-full select-none"
  style={{ 
    height: '95vw',
    maxHeight: '550px',
    maxWidth: '100vw',
    overflow: 'visible',       /* allow 3D content to extend visually */
    touchAction: 'none',
  }}
>
```

Note: the canvas container keeps `overflow: visible` so the 3D wheel can extend beyond its box visually — but the container itself must not exceed 100vw.

**4. Check all Html overlays:**

The drei `<Html>` overlays (zodiac badges, planet labels) render as actual DOM elements. If they extend beyond the viewport, they cause horizontal scroll. Check that none of them have fixed positioning or margins that push them off-screen.

Add to globals.css:

```css
/* Prevent drei Html overlays from causing horizontal overflow */
[style*="transform: translate3d"] {
  max-width: 100vw;
}
```

**5. Check all modals and bottom sheets:**

Every modal must have `max-width: calc(100vw - 32px)` or similar to prevent exceeding the viewport:

```tsx
style={{ maxWidth: 'calc(100vw - 32px)' }}
```

---

## Build Steps

### Phase A: Glass Cards
1. Update all content card styles to the blue glass gradient
2. Update all bottom sheet modals to the glass style
3. Test: cards show subtle blue tint with glass blur effect
4. Test: starfield is softly visible through cards

### Phase B: Birth Modal Overflow
5. Add box-border and w-full to all input fields
6. Add maxWidth calc(100vw - 32px) to the modal container
7. Test: birth modal inputs stay within screen bounds on 375px viewport

### Phase C: Portrait Stuck State
8. Replace permanent "being prepared" message with dismissible coming-soon
9. Add auto-dismiss after 4 seconds
10. Add "Got it" button to dismiss manually
11. Add i18n keys
12. Test: submit birth details → see confirmation → modal closes

### Phase D: Viewport Zoom
13. Update viewport meta tag with maximum-scale=1 and user-scalable=no
14. Add overflow-x: hidden to html, body, and main containers
15. Ensure canvas container and all modals respect 100vw max
16. Test: load app on mobile — no horizontal scroll, no zoom required

### Phase E: Regression Test
17. Test ALL existing features still work
18. Run `npm run build`
19. Push to **main** branch
20. Commit: `fix: glass cards, birth modal overflow, portrait state, viewport zoom`
