# ASTRARA v2 — Hotfix: Header Layout, Info Button, Location Flicker

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The header has three bugs. Read the current header component source code carefully before making any changes.

---

## Bug 1: Info Button — Not Visible, Not Working

The info button is almost invisible and does not open the About modal when tapped.

### Requirements

Delete whatever the current info button implementation is and replace it with this EXACT implementation:

```tsx
<button
  type="button"
  onClick={() => setShowAbout(true)}
  className="w-6 h-6 rounded-full border border-white/25 
             flex items-center justify-center
             text-white/40 text-xs font-serif
             hover:border-white/40 hover:text-white/60
             active:scale-90
             transition-all select-none cursor-pointer"
  aria-label="About Astrara"
>
  i
</button>
```

This creates a small, elegant circle with a serif "i" inside it — clean, minimal, clearly tappable. The key requirements:
- `w-6 h-6` — 24px circle, visible but not dominant
- `border-white/25` — clearly visible border, not invisible
- `text-white/40` — visible text, not invisible
- `cursor-pointer` — shows it's clickable
- `active:scale-90` — gives tap feedback
- `onClick={() => setShowAbout(true)}` — MUST trigger the About modal state. Verify this state variable exists and is connected to the AboutModal component.

**CRITICAL**: After implementing the button, verify that:
1. The `setShowAbout` function exists and is a valid state setter
2. The `showAbout` state is passed to the `<AboutModal>` component as `isOpen={showAbout}`
3. The `<AboutModal>` component is actually rendered in the page JSX (not missing)
4. Click the button in the browser — the modal MUST open

---

## Bug 2: Header Alignment — App Name Misaligned

The ASTRARA title, subtitle, and the right-side elements (location, sound, language) are not vertically aligned properly. The info button insertion broke the layout.

### Fix: Rebuild the Header Layout

The header should use a simple two-column flexbox layout:

```tsx
<header className="px-4 pt-4 pb-2">
  {/* Row 1: App name (left) + Controls (right) */}
  <div className="flex items-start justify-between">
    
    {/* Left column: App name + subtitle + date */}
    <div className="flex-shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-serif text-white/90 tracking-wide">
          ASTRARA
        </h1>
        {/* Info button — sits next to the title */}
        <button
          type="button"
          onClick={() => setShowAbout(true)}
          className="w-6 h-6 rounded-full border border-white/25 
                     flex items-center justify-center
                     text-white/40 text-xs font-serif
                     hover:border-white/40 hover:text-white/60
                     active:scale-90
                     transition-all select-none cursor-pointer"
          aria-label="About Astrara"
        >
          i
        </button>
      </div>
      <p className="text-purple-300/50 text-xs mt-0.5">
        {t('subtitle')}
      </p>
      <p className="text-purple-300/70 text-sm mt-1">
        {formattedDate}
      </p>
    </div>
    
    {/* Right column: Location + Sound + Language */}
    <div className="flex items-center gap-3 flex-shrink-0">
      {/* Location */}
      <div className="flex items-center gap-1 min-w-[80px] justify-end">
        <span className="text-red-400 text-xs">📍</span>
        <span className="text-white/60 text-xs truncate max-w-[100px]">
          {locationName || t('location.detecting')}
        </span>
      </div>
      
      {/* Sound toggle */}
      <button
        type="button"
        onClick={toggleAudio}
        className="text-white/40 hover:text-white/60 transition-colors select-none"
        aria-label={isPlaying ? 'Mute' : 'Unmute'}
      >
        {isPlaying ? '🔈' : '🔇'}
      </button>
      
      {/* Language switcher */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="flex items-center gap-1 text-white/50 hover:text-white/70 
                   transition-colors select-none text-xs"
      >
        <span>{lang === 'en' ? '🇬🇧' : '🇱🇹'}</span>
        <span>{lang.toUpperCase()}</span>
        <span className="text-white/30">▾</span>
      </button>
    </div>
    
  </div>
</header>
```

The key structural rules:
- `flex items-start justify-between` — left and right columns align to the top
- Left column: title + info button on same line, subtitle below, date below that
- Right column: all controls in a single horizontal row, right-aligned
- No element should push another out of alignment

---

## Bug 3: Location Text Flickers/Jumps on Page Load

When the page loads, the location shows "Detecting location..." which is wider than the final city name. When the city loads in, everything shifts left then snaps back.

### Fix

Give the location container a **fixed width** so it never changes size regardless of content:

```tsx
<div className="flex items-center gap-1 min-w-[80px] justify-end">
  <span className="text-red-400 text-xs">📍</span>
  <span className="text-white/60 text-xs truncate max-w-[100px]">
    {locationName || t('location.detecting')}
  </span>
</div>
```

Key properties:
- `min-w-[80px]` — container never shrinks below 80px
- `justify-end` — text is right-aligned within the container, so width changes don't shift the layout
- `truncate max-w-[100px]` — long city names get truncated with ellipsis instead of expanding the container

Additionally, do NOT use any CSS transitions or animations on the location text container. The text should just swap instantly from "Detecting location..." to the city name — no sliding, no fading, no movement.

If there is any `transition` or `animate-` class on the location element or its parents, REMOVE IT.

---

## Build Steps

1. Read the current header component in full
2. Delete the current broken info button implementation
3. Rebuild the entire header layout using the exact structure above
4. Verify the info button opens the About modal — click it and confirm
5. Verify location text does not jump or flicker on page load
6. Verify all header elements are aligned (title + controls at top, everything balanced)
7. Test on mobile viewport (375px) — header should not wrap or overflow
8. Run `npm run build`
9. Push to **main** branch
10. Commit: `fix: header layout, info button visibility and click, location flicker`
