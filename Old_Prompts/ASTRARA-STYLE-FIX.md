Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# ASTRARA — Comprehensive Style & UX Overhaul

The app has functional bones but looks unpolished. Every screen needs a styling pass to reach the quality bar of lunata.app and sonarus.app. Fix ALL of the following issues.

---

## 1. APP HEADER — Create a proper beautiful header

The current app name overlaps with page content. Create a proper fixed header consistent with the Harmonic Waves ecosystem.

**Header component (use on ALL pages):**
- Fixed top, full width, z-50
- Height: 56px
- Background: var(--space) with subtle bottom border (var(--border) at 0.5 opacity)
- Optional: very subtle backdrop-blur-sm for depth when scrolling

**Header layout:**
- Left: "ASTRARA" — DM Sans, text-sm, font-medium, tracking-[0.2em], uppercase, var(--text-secondary). Clicking navigates to /
- Centre: empty (clean, minimal)
- Right: Language selector dropdown (move it INTO the header, remove the fixed-position floating one)

**Spacing**: All page content must start BELOW the header. Add pt-[72px] or similar to the main content area to account for the fixed header height.

**On the landing page**: the header can be transparent/blended with the background since the bg is the same colour. On the portrait page: keep the subtle bottom border to separate header from content.

---

## 2. LANDING PAGE — Professional form design

The form fields are stretched edge-to-edge and look amateur. Fix the entire landing page layout.

**Container:**
- max-w-md (448px) centred on desktop
- On mobile: px-6 (24px padding on each side) — fields should NOT touch screen edges
- Vertically centred on viewport (min-h-screen with flex items-center justify-center)

**Title section (above form):**
- The animated cosmic ring: make it 160px diameter (not too large), centred, mb-8
- "ASTRARA" — text-xs, tracking-[0.4em], mb-2
- "What does your birth chart sound like?" — Instrument Serif italic, text-2xl md:text-4xl (NOT text-5xl — too large on mobile), text-center, mb-3
- Subtitle: text-sm, var(--text-secondary), text-center, max-w-xs mx-auto, mb-10

**Form card:**
- Wrap the entire form in a card: bg var(--space-surface), border var(--border), rounded-2xl, p-6 md:p-8
- This frames the form and separates it from the background — looks professional

**Input fields (inside the card):**
- Each input group: mb-5 (last one mb-6)
- Labels: text-xs, uppercase, tracking-wider, font-medium, var(--text-secondary), mb-2
- Inputs: w-full, bg var(--space-card), border var(--border), rounded-lg, py-3 px-4, text-sm, var(--text-primary)
- Focus: border-[var(--border-active)], outline-none, ring-1 ring-[var(--border-active)], transition-all duration-200
- Placeholder: var(--text-dim)
- The date and time inputs should look clean — if the browser's native date/time picker looks ugly, style the inputs to at least have consistent padding, font, and border

**City search dropdown (when open):**
- Positioned absolutely below the city input
- bg var(--space-card), border var(--border), rounded-lg, mt-1
- shadow-xl shadow-black/30 (dark shadow for depth)
- max-h-48 overflow-y-auto
- Each result: px-4 py-3, text-sm, var(--text-primary), hover:bg-[var(--space-hover)], cursor-pointer, transition
- Border-b var(--border) between items (except last)
- Loading state: show "Searching..." in var(--text-dim), italic, centred
- No results: "No cities found" in var(--text-dim), centred

**Generate button:**
- NOT stretched to full width. Instead: w-full max-w-xs, mx-auto, displayed as block
- OR: full width within the card BUT with proper rounded-xl and good padding
- Actually, within the card full-width is fine — the card constrains it
- bg: gradient from var(--accent) to var(--accent-cool)
- text-white, font-medium, text-sm, rounded-xl, py-3.5
- Hover: brightness-110, subtle transform scale-[1.01]
- Disabled: opacity-40, no hover effect
- Loading: show spinner + "Calculating..." text, disable button

**Below the card:**
- mt-8
- "How does it work?" link: text-sm, var(--text-secondary), hover:var(--text-primary), flex items-center gap-1 with a small → arrow
- mt-4: ecosystem badge, small and subtle

---

## 3. PORTRAIT PAGE — Clean layout with proper spacing

**Content structure (scrollable, single column, centred):**

```
[Fixed Header: ASTRARA ... Language]
[Cosmic Wheel section — full width, centred, generous padding]
[Birth info + Play button — centred below wheel]
[Divider]
[Your Cosmic Sound section — explaining what the frequencies mean]
[Planet cards — clean grid]
[Divider]
[Your Harmonic Connections — aspects explained simply]
[Divider]  
[Share + Ecosystem]
[Footer]
```

**Cosmic Wheel section:**
- pt-8 (space below header)
- Wheel centred with mx-auto
- Max width: 380px on mobile, 500px on desktop
- px-4 minimum padding from screen edges
- mb-4 below the wheel

**Birth info + Play:**
- Birth info: centred text, DM Sans, text-sm, var(--text-secondary)
- Format: "3 June 1981 · 10:00 · Kaunas, Lithuania"
- mb-6
- Play button: centred, 56px circle (not 64 — slightly smaller feels more refined), bg var(--accent), white play icon
- "Listen to your cosmic sound" — text-xs, var(--text-dim), mt-2
- mb-8

**Section dividers:**
- Use a subtle horizontal line: w-16, h-px, bg var(--border), mx-auto, my-10
- This creates breathing room between sections

---

## 4. PLANET FREQUENCY SECTION — Make it meaningful to users

**The current planet list with "cinematic waves" means nothing to regular users. Completely rethink this section.**

**New heading: "Your Cosmic Sound"** (not "Your Frequency Signature" — that's too technical)

**Add an intro paragraph before the planet cards:**
- EN: "Each planet was in a unique position when you were born. Astrara converts these positions into frequencies — creating a sound signature that belongs only to you."
- LT: "Kiekviena planeta buvo unikalioje pozicijoje kai gimei. Astrara paverčia šias pozicijas dažniais — sukurdama garsinį parašą, kuris priklauso tik tau."
- Style: text-sm, var(--text-secondary), text-center, max-w-md mx-auto, mb-8

**Planet cards — redesigned:**

Remove the waveform bars — they add visual noise without meaning. Replace with a cleaner card design:

Each planet card (contained within max-w-md mx-auto, px-4):
```
┌─────────────────────────────────────────────┐
│  ● Sun                          ♌ Leo 15°  │
│  ☉                              126.2 Hz    │
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔  │
│  Your core identity and vitality             │
└─────────────────────────────────────────────┘
```

**Card structure:**
- bg var(--space-card), border var(--border), rounded-xl, p-4, mb-3
- **Top row** (flex, justify-between, items-center):
  - Left: planet colour dot (8px, rounded-full) + planet name (DM Sans, text-sm, font-medium, var(--text-primary)) + planet symbol in var(--text-dim)
  - Right: zodiac symbol + sign name + degree (DM Sans, text-sm, var(--text-secondary))
- **Second row** (flex, justify-between, items-center, mt-1):
  - Left: empty or planet symbol larger
  - Right: frequency in Hz — IBM Plex Mono, text-lg, font-medium, planet colour — this is the standout data point
- **Bottom row** (mt-2, pt-2, border-t border-[var(--border)]):
  - A one-line human-readable description of what this planet represents
  - text-xs, var(--text-dim), italic

**Planet descriptions (add to translations):**

```typescript
// English
planetDescriptions: {
  Sun: "Your core identity and vitality",
  Moon: "Your emotions and inner world",
  Mercury: "Your mind and communication style",
  Venus: "Your love nature and sense of beauty",
  Mars: "Your drive, energy, and courage",
  Jupiter: "Your growth, luck, and wisdom",
  Saturn: "Your discipline, structure, and lessons",
  Uranus: "Your originality and need for freedom",
  Neptune: "Your dreams, intuition, and spirituality",
  Pluto: "Your transformation and deepest power",
},

// Lithuanian
planetDescriptions: {
  Sun: "Tavo esminė tapatybė ir gyvybingumas",
  Moon: "Tavo emocijos ir vidinis pasaulis",
  Mercury: "Tavo mąstymas ir bendravimo stilius",
  Venus: "Tavo meilės prigimtis ir grožio pojūtis",
  Mars: "Tavo varomoji jėga, energija ir drąsa",
  Jupiter: "Tavo augimas, sėkmė ir išmintis",
  Saturn: "Tavo disciplina, struktūra ir pamokos",
  Uranus: "Tavo originalumas ir laisvės poreikis",
  Neptune: "Tavo svajonės, intuicija ir dvasingumas",
  Pluto: "Tavo transformacija ir giliausia galia",
},
```

**Dominant Tone card:**
- Separate from the planet list, placed ABOVE it
- bg var(--space-surface), border var(--border-active), rounded-2xl, p-5
- "Your Dominant Tone" — DM Sans, text-xs, uppercase, tracking-wider, var(--text-secondary), mb-2
- The dominant planet name + frequency: Instrument Serif, text-2xl, planet colour
- "The tone of [Planet] in [Sign]" — text-sm, var(--text-secondary)
- This tells users "THIS is your main frequency" before they see the full list

---

## 5. ASPECTS SECTION — Explain simply

**New heading: "Your Harmonic Connections"** (not "Your Harmonic Aspects" — users don't know what "aspects" means)

**Intro text:**
- EN: "The angles between your planets create musical harmonies — some flowing, some dynamic."
- LT: "Kampai tarp tavo planetų kuria muzikines harmonijas — vienų sklandžias, kitų dinamiškas."
- text-sm, var(--text-secondary), text-center, max-w-md mx-auto, mb-6

**Aspect cards — simplified:**
Each aspect card (max-w-md mx-auto):
- bg var(--space-card), border var(--border), rounded-xl, p-4, mb-2
- Left: two planet colour dots connected by a line (matching aspect line style from the wheel)
- Centre: "[Planet 1] & [Planet 2]" — text-sm, var(--text-primary)
- Right: musical interval name — text-sm, var(--accent)
- Below: one-line description of what this aspect means
  - Conjunction: "United — these energies merge and amplify"
  - Trine: "Flowing — natural harmony and ease"
  - Sextile: "Supportive — gentle opportunity"
  - Square: "Dynamic — creative tension that drives growth"
  - Opposition: "Balancing — opposite forces seeking equilibrium"

Add these descriptions to translations for both EN and LT.

---

## 6. GENERAL SPACING RULES (apply everywhere)

- **No element should touch screen edges on mobile**: minimum px-4 (16px) padding, prefer px-6 (24px) for content sections
- **Section spacing**: use my-10 or py-10 between major sections, with the subtle divider line between them
- **Card spacing**: mb-3 between cards in a list
- **Text hierarchy**: only ONE large text element per section (the heading). Everything else is text-sm or text-xs.
- **Max content width**: max-w-md (448px) for all text content and cards. The cosmic wheel can be wider (max-w-lg).
- **Centred layout**: everything mx-auto text-center unless it's a card with left-aligned content

---

## 7. SCROLLBAR

Verify scrollbars are hidden globally. Add to globals.css if not present:
```css
* { scrollbar-width: none; -ms-overflow-style: none; }
*::-webkit-scrollbar { display: none; }
html, body { overflow-x: hidden; }
```

---

## 8. SHARE SECTION

- "Share your Cosmic Portrait" card: max-w-md mx-auto, bg var(--space-card), border var(--border), rounded-2xl, p-6, text-center
- Share button: NOT full-width. w-auto px-8 py-3, bg var(--accent), text-white, rounded-xl, mx-auto
- "Create Another Portrait" button below: same width, but bg transparent, border var(--border), var(--text-secondary), hover var(--text-primary)
- Toast notification for "Link copied!" — small, bottom-centre, bg var(--space-card), border var(--border), text-sm, Framer Motion fade in/out, auto-dismiss after 2s

---

## 9. ECOSYSTEM SECTION

- Section heading: "Explore Harmonic Waves" — text-xs, uppercase, tracking-wider, var(--text-secondary), text-center, mb-4
- 3 cards in a column (max-w-md mx-auto):
  - Each: bg var(--space-card), border var(--border), rounded-xl, p-4, mb-3
  - App name: text-sm, font-medium, var(--text-primary)
  - Description: text-xs, var(--text-secondary)
  - Link arrow on the right
  - Do NOT show the personalised messages (e.g., "Your Moon was in Virgo") — too complex for now, just show generic app descriptions:
    - Lunata: "Lunar intelligence for practitioners"
    - Binara: "Binaural beats and frequency tools"  
    - Sonarus: "Voice frequency analysis"

---

## After all fixes:
```bash
npm run build
git add -A
git commit -m "Style overhaul: header, form, planet cards, spacing, UX copy"
git push origin master:main
```

Every screen should feel intentional, spacious, and premium after these changes. No overlapping elements, no edge-touching content, no mystery data without context. Go.
