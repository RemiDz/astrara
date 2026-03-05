# ASTRARA — Header Restructure & Settings Panel

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

The current header is unstable — the city input field overflows on mobile, the language dropdown pushes elements around when opened, and interactive elements compete for space. We're fixing this by simplifying the header to only static elements and moving all settings into a dedicated settings panel.

Read all current header, navigation, language switcher, location input, and settings-related source files before making changes.

---

## 1. New Header Layout

The header becomes a simple, rock-solid layout that NEVER changes shape or shifts:

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ASTRARA                            🔇  ⓘ  ⚙️  │
│  Today's Cosmic Map                             │
│  5 March 2026 · 12:03 GMT · London              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Left Side
- **ASTRARA** — logo/title, same styling as current
- **Today's Cosmic Map** — subtitle, muted text, smaller font
- **Date · Time · City** — one line, muted text. The city name is plain text (NOT a button, NOT an input field, NOT tappable). It simply displays the current location name.

### Right Side
- **🔇 Sound toggle** — mute/unmute icon. Use a subtle custom icon consistent with the app's aesthetic (not a raw emoji). Tap toggles sound on/off with a brief visual feedback (icon pulses or swaps between muted/unmuted state).
- **ⓘ Info** — opens the About/Info modal (same as current behaviour)
- **⚙️ Settings** — opens the new settings panel

### CSS Structure

```tsx
<header className="flex items-start justify-between w-full px-4 pt-4 pb-2">
  {/* Left side — text block */}
  <div className="flex flex-col min-w-0">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-serif tracking-wide text-white">ASTRARA</h1>
    </div>
    <span className="text-xs text-white/40 mt-0.5">Today's Cosmic Map</span>
    <span className="text-sm text-white/60 mt-1">
      {formattedDate} · {formattedTime} · {cityName}
    </span>
  </div>

  {/* Right side — icon row */}
  <div className="flex items-center gap-3 pt-1 flex-shrink-0">
    <button aria-label="Toggle sound" className="...">
      {/* sound icon */}
    </button>
    <button aria-label="About" className="...">
      {/* info icon */}
    </button>
    <button aria-label="Settings" className="...">
      {/* settings icon */}
    </button>
  </div>
</header>
```

**CRITICAL:**
- `min-w-0` on the left div prevents text from pushing the icons off screen
- `flex-shrink-0` on the right div ensures icons never shrink or wrap
- The city name in the date line should truncate with ellipsis if too long: `truncate` class or `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` on the date/time/city line
- NO interactive elements on the left side — everything is plain text display
- Icon buttons should be exactly 36×36px tap targets with no text labels

---

## 2. Icon Styling

All three icons should be visually consistent:

- 36×36px tap target
- Icon itself ~20px, centred
- `text-white/50` default, `text-white/80` on hover/active
- No borders, no backgrounds — just the icon
- Subtle `active:scale-90 transition-transform duration-150` on tap
- Use simple line icons (not filled, not emoji). If the app uses lucide-react or a similar icon library, use icons from there. If not, use clean SVG icons:
  - Sound on: speaker with waves
  - Sound off: speaker with X or slash
  - Info: circle with "i"
  - Settings: gear/cog

The current ⓘ and ⚙️ styling with the circular purple borders can be simplified — remove the circular border rings. Just clean icons, no containers.

---

## 3. Settings Panel

Create a new settings panel that slides in from the right (desktop) or slides up as a bottom sheet (mobile), consistent with how planet detail panels work.

### Panel Content

```
┌─────────────────────────────────────────────────┐
│  ─── (drag handle on mobile)                 ✕  │
│                                                 │
│  Settings                                       │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  LOCATION                                       │
│                                                 │
│  📍 London                            [Change]  │
│                                                 │
│  Tap Change to search for a city.               │
│  Your location is used for local time           │
│  and horizon calculations only — it's           │
│  never sent to any server.                      │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  LANGUAGE                                       │
│                                                 │
│  🇬🇧 English                              ▼     │
│                                                 │
│  (dropdown with EN and LT options)              │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  DISPLAY                                        │
│                                                 │
│  Immersive Universe                   [toggle]  │
│  Adds nebula clouds and distant galaxies        │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ABOUT                                          │
│                                                 │
│  Astrara is part of the Harmonic Waves          │
│  ecosystem · harmonicwaves.app                  │
│                                                 │
│  Version 2.x                                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Location Input

When the user taps [Change]:
- The city name becomes an editable input field WITH full width of the settings panel
- The input has proper padding, visible border, and a clear search UX
- Autocomplete / search-as-you-type if the app already has city search functionality
- Once a city is selected, the input collapses back to showing the city name with [Change] button
- The header date line updates to show the new city name

This is the key fix — the city input now has the full panel width to expand into, not the cramped header space.

### Language Dropdown

- Full-width dropdown inside the settings panel
- When opened, it does NOT push any other elements — it overlays or expands in place
- Currently supported: English (🇬🇧 EN), Lithuanian (🇱🇹 LT)
- Selecting a language immediately updates the app and closes the dropdown

### Panel Styling

- Same glass morphism / dark backdrop blur as existing detail panels
- Smooth slide-in animation (300ms ease-out)
- Dismiss: tap ✕, tap outside the panel, or swipe down (mobile)
- `z-index` above the wheel but below any active modals

---

## 4. Remove from Header

**Completely remove** the following from the header component:
- The location pin emoji and city name button/link (replaced by plain text city name in date line)
- The city search input field
- The language flag, language code text, and language dropdown
- Any wrapper divs that contained these elements

**Do NOT remove:**
- The sound toggle functionality (just restyle the icon)
- The info button functionality (just restyle the icon)

---

## 5. Migrate State

- Location/city state should now be read by both the header (display only) and the settings panel (editable)
- Language state should now be controlled only from the settings panel
- Sound mute/unmute state stays on the header icon
- Immersive Universe state should be readable by the starfield component and controllable from settings
- All preferences should persist in localStorage

---

## 6. Internationalisation

Add new strings for both languages:

**English:**
- "Settings"
- "Location"
- "Change"
- "Your location is used for local time and horizon calculations only — it's never sent to any server."
- "Language"
- "Display"
- "Immersive Universe"
- "Adds nebula clouds and distant galaxies"
- "About"

**Lithuanian:**
- "Nustatymai"
- "Vieta"
- "Keisti"
- "Jūsų vieta naudojama tik vietiniam laikui ir horizonto skaičiavimams — ji niekada nesiunčiama į jokį serverį."
- "Kalba"
- "Vaizdas"
- "Įtraukiantis visata"
- "Prideda ūko debesis ir tolimas galaktikas"
- "Apie"

---

## 7. iOS Safari Fixes

Apply to any input fields in the settings panel:

```css
input, select {
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
  font-size: 16px;  /* prevents iOS zoom on focus */
}
```

---

## 8. Do NOT

- Do NOT add any interactive elements to the header left side
- Do NOT allow any header element to wrap to a second line
- Do NOT use emoji for the header icons — use SVG or icon library
- Do NOT change the info modal content or behaviour — only move its trigger button
- Do NOT change sound functionality — only restyle the icon
- Do NOT remove any existing functionality — everything moves to settings, nothing is deleted
- Do NOT touch the wheel, planets, starfield, Earth aura, or Sun glow

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: header displays correctly on 375px width (iPhone SE) — no overflow, no wrapping
3. Test: header displays correctly on 428px width (iPhone 14 Pro Max)
4. Test: header displays correctly on desktop (>768px)
5. Test: tap ⚙️ — settings panel slides in smoothly
6. Test: change location in settings — header date line updates with new city name
7. Test: change language in settings — entire app updates, settings panel text updates
8. Test: toggle Immersive Universe — starfield responds correctly
9. Test: tap sound icon — toggles mute/unmute, icon changes
10. Test: tap ⓘ — info modal opens as before
11. Test: long city name (e.g. "São Paulo do Olivença") truncates in header, shows full in settings
12. Test: dismiss settings panel — tap ✕, tap outside, swipe down all work
13. Commit: `refactor: clean header + settings panel — move location and language out of header`
14. Push to `main`
