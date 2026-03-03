Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use the --yes flag wherever applicable.

---

# ASTRARA — Your Cosmic Frequency Portrait

## IMPORTANT: Wipe all existing source code in src/ before starting. Delete everything inside src/. Keep config files (package.json, tsconfig, tailwind.config, next.config, .gitignore). This is a completely new app.

## What This App Is
Astrara calculates exact planetary positions at the moment of your birth and converts them into a unique audio frequency signature — your personal cosmic sound. Each planet maps to a frequency based on its zodiac position, their angular relationships create harmonics, and the result is generative evolving music mathematically unique to YOU. Zero APIs — everything client-side using the astronomy-engine npm package.

TikTok hook: "This app turned my birth chart into music — no two people sound the same"

**GitHub**: https://github.com/RemiDz/astrara
**Deploy**: Vercel as astrara.vercel.app
**Quality bar**: lunata.app, sonarus.app — exceed this.

## Stack
- Next.js 14+ (App Router, src/app/)
- TypeScript strict
- Tailwind CSS + CSS custom properties
- Framer Motion
- HTML Canvas for cosmic visualisation
- Web Audio API for generative sound
- astronomy-engine npm (planetary calculations, zero deps, MIT)
- nanoid for IDs
- Plausible analytics (data-domain placeholder)
- PWA manifest

```bash
npm install astronomy-engine framer-motion nanoid
```

---

## Design System — "Cosmic Observatory"

Premium, cinematic, awe-inspiring. Planetarium meets luxury watch. NOT typical astrology app (no purple mystical gradients, no zodiac clipart). Science meets beauty.

### Colours
```css
--space: #04040A;
--space-surface: #0A0B14;
--space-card: #0F1019;
--space-hover: #161722;
--border: #1E1F2E;
--border-active: #3B4BDB;
--accent: #3B82F6;
--accent-warm: #F59E0B;
--accent-cool: #8B5CF6;
--accent-luna: #E2E8F0;
--text-primary: #E8ECF4;
--text-secondary: #6B7194;
--text-dim: #3D4167;
--planet-sun: #FCD34D;
--planet-moon: #E2E8F0;
--planet-mercury: #A5B4FC;
--planet-venus: #F9A8D4;
--planet-mars: #EF4444;
--planet-jupiter: #FB923C;
--planet-saturn: #A78BFA;
--planet-uranus: #22D3EE;
--planet-neptune: #6366F1;
--planet-pluto: #9CA3AF;
```

### Typography (Google Fonts)
- Display: "Instrument Serif"
- Body/UI: "DM Sans"
- Mono/Data: "IBM Plex Mono"

### Visual Rules
- Deep space bg, never pure black
- Star field: 150+ CSS dots, 1-2px, random positions/opacity, 10-15 with twinkle animation
- Cards: solid bg, border, rounded-xl — NO glass morphism
- Planet colours as accent indicators
- Mobile-first. Hide all scrollbars.
- Framer Motion page transitions

---

## Internationalisation (EN/LT)

The app must support two languages: English (default) and Lithuanian. Same pattern as shumann.app.

### Implementation
- Create `src/lib/i18n.ts` with all translatable strings
- Use a React context provider `LanguageProvider` wrapping the app
- `useLanguage()` hook returns `{ lang, setLang, t }` where `t(key)` returns the translated string
- Language toggle: small button in top-right corner of every page — "EN | LT" pill toggle
- Store selected language in localStorage, default to English
- Language affects ALL UI text: headings, labels, descriptions, planet names, zodiac signs, button text, aspect names, error messages
- URL does NOT change with language — it's a client-side toggle only

### Translation keys (create comprehensive translations for ALL of these):

```typescript
const translations = {
  en: {
    // Landing
    brand: "ASTRARA",
    tagline: "Your Cosmic Frequency Portrait",
    subtitle: "Enter your birth details to hear the music of your stars",
    dateLabel: "Date of Birth",
    timeLabel: "Time of Birth",
    timeHint: "Don't know? Use 12:00",
    cityLabel: "City of Birth",
    cityPlaceholder: "Search for your city...",
    coordsToggle: "Enter coordinates manually",
    latLabel: "Latitude",
    lngLabel: "Longitude",
    generateButton: "Reveal My Cosmic Portrait",
    generating: "Calculating planetary positions...",
    howItWorks: "How does it work?",
    partOfEcosystem: "Part of Harmonic Waves",
    
    // Portrait
    cosmicPortrait: "Your Cosmic Frequency Portrait",
    listenCTA: "Listen to your cosmic sound",
    frequencySignature: "Your Frequency Signature",
    dominantTone: "Your Dominant Tone",
    dominantDesc: "Your cosmic signature is rooted in {freq} Hz — the tone of {planet} in {sign}",
    harmonicAspects: "Your Harmonic Aspects",
    shareTitle: "Share your Cosmic Portrait",
    shareCopied: "Link copied!",
    shareButton: "Copy Link",
    createAnother: "Create another portrait",
    sessionComplete: "Session complete",
    
    // Planets
    Sun: "Sun", Moon: "Moon", Mercury: "Mercury", Venus: "Venus",
    Mars: "Mars", Jupiter: "Jupiter", Saturn: "Saturn",
    Uranus: "Uranus", Neptune: "Neptune", Pluto: "Pluto",
    
    // Zodiac
    Aries: "Aries", Taurus: "Taurus", Gemini: "Gemini", Cancer: "Cancer",
    Leo: "Leo", Virgo: "Virgo", Libra: "Libra", Scorpio: "Scorpio",
    Sagittarius: "Sagittarius", Capricorn: "Capricorn",
    Aquarius: "Aquarius", Pisces: "Pisces",
    
    // Aspects
    conjunction: "Conjunction", opposition: "Opposition",
    trine: "Trine", square: "Square", sextile: "Sextile",
    
    // Musical intervals
    Unison: "Unison", "Minor Third": "Minor Third",
    "Perfect Fourth": "Perfect Fourth", "Perfect Fifth": "Perfect Fifth",
    Octave: "Octave",
    
    // About
    aboutTitle: "How It Works",
    aboutWhat: "What is a cosmic frequency portrait?",
    aboutWhatDesc: "Your birth chart — the positions of all planets at the exact moment you were born — converted into sound. Each planet becomes a frequency, and their relationships create harmonics.",
    aboutScience: "The Science",
    aboutScienceDesc: "Planetary positions are calculated using VSOP87 algorithms — the same mathematical models used by NASA. Frequencies are based on Hans Cousto's Cosmic Octave theory, which transposes planetary orbital periods into the audible range.",
    aboutUnique: "Why Every Portrait is Unique",
    aboutUniqueDesc: "10 planets × 360° of zodiac × countless aspect combinations = a sonic fingerprint that belongs only to you.",
    aboutCTA: "Discover your cosmic sound",
    
    // Ecosystem
    lunataDesc: "Track the Moon that was in {sign} when you were born",
    binaraDesc: "Experience your dominant frequency as a binaural beat",
    sonarusDesc: "Compare your voice to your cosmic frequency",
    
    // Footer
    builtBy: "Built with 🔮 by Harmonic Waves",
  },
  lt: {
    // Landing
    brand: "ASTRARA",
    tagline: "Tavo Kosminis Dažnių Portretas",
    subtitle: "Įvesk savo gimimo duomenis ir išgirsk savo žvaigždžių muziką",
    dateLabel: "Gimimo data",
    timeLabel: "Gimimo laikas",
    timeHint: "Nežinai? Naudok 12:00",
    cityLabel: "Gimimo miestas",
    cityPlaceholder: "Ieškok savo miesto...",
    coordsToggle: "Įvesti koordinates rankiniu būdu",
    latLabel: "Platuma",
    lngLabel: "Ilguma",
    generateButton: "Atskleisk Savo Kosminį Portretą",
    generating: "Skaičiuojamos planetų pozicijos...",
    howItWorks: "Kaip tai veikia?",
    partOfEcosystem: "Harmonic Waves ekosistema",
    
    // Portrait
    cosmicPortrait: "Tavo Kosminis Dažnių Portretas",
    listenCTA: "Klausytis savo kosminio garso",
    frequencySignature: "Tavo Dažnių Parašas",
    dominantTone: "Tavo Dominuojantis Tonas",
    dominantDesc: "Tavo kosminis parašas grindžiamas {freq} Hz — {planet} tone {sign} ženkle",
    harmonicAspects: "Tavo Harmoniniai Aspektai",
    shareTitle: "Pasidalink savo Kosminiu Portretu",
    shareCopied: "Nuoroda nukopijuota!",
    shareButton: "Kopijuoti nuorodą",
    createAnother: "Sukurti kitą portretą",
    sessionComplete: "Sesija baigta",
    
    // Planets
    Sun: "Saulė", Moon: "Mėnulis", Mercury: "Merkurijus", Venus: "Venera",
    Mars: "Marsas", Jupiter: "Jupiteris", Saturn: "Saturnas",
    Uranus: "Uranas", Neptune: "Neptūnas", Pluto: "Plutonas",
    
    // Zodiac
    Aries: "Avinas", Taurus: "Jautis", Gemini: "Dvyniai", Cancer: "Vėžys",
    Leo: "Liūtas", Virgo: "Mergelė", Libra: "Svarstyklės", Scorpio: "Skorpionas",
    Sagittarius: "Šaulys", Capricorn: "Ožiaragis",
    Aquarius: "Vandenis", Pisces: "Žuvys",
    
    // Aspects
    conjunction: "Konjunkcija", opposition: "Opozicija",
    trine: "Trinas", square: "Kvadratūra", sextile: "Sekstilis",
    
    // Musical intervals
    Unison: "Unisomas", "Minor Third": "Mažoji tercija",
    "Perfect Fourth": "Grynoji kvarta", "Perfect Fifth": "Grynoji kvinta",
    Octave: "Oktava",
    
    // About
    aboutTitle: "Kaip Tai Veikia",
    aboutWhat: "Kas yra kosminis dažnių portretas?",
    aboutWhatDesc: "Tavo gimimo horoskopas — visų planetų pozicijos tiksliu tavo gimimo momentu — paverstas garsu. Kiekviena planeta tampa dažniu, o jų tarpusavio ryšiai kuria harmonikas.",
    aboutScience: "Mokslas",
    aboutScienceDesc: "Planetų pozicijos apskaičiuojamos naudojant VSOP87 algoritmus — tuos pačius matematinius modelius, kuriuos naudoja NASA. Dažniai paremti Hans Cousto Kosminės Oktavos teorija.",
    aboutUnique: "Kodėl Kiekvienas Portretas Unikalus",
    aboutUniqueDesc: "10 planetų × 360° zodiako × daugybė aspektų kombinacijų = garsinis pirštų atspaudas, priklausantis tik tau.",
    aboutCTA: "Atrask savo kosminį garsą",
    
    // Ecosystem
    lunataDesc: "Sek Mėnulį, kuris buvo {sign} ženkle kai gimei",
    binaraDesc: "Patirk savo dominuojantį dažnį kaip binauralinį ritmą",
    sonarusDesc: "Palygink savo balsą su kosminiu dažniu",
    
    // Footer
    builtBy: "Sukurta su 🔮 Harmonic Waves",
  },
};
```

### Language Toggle Component
- Small pill in top-right corner (fixed position): "EN | LT"
- Active language highlighted with var(--accent)
- Clicking switches language instantly (no page reload)
- Persists in localStorage as 'astrara-lang'

### How to use in components
```typescript
const { t, lang } = useLanguage();
// Use: <h1>{t('tagline')}</h1>
// For interpolation: t('dominantDesc').replace('{freq}', '126.2').replace('{planet}', t('Sun')).replace('{sign}', t('Leo'))
```

### Planet names and zodiac signs in the Canvas wheel
The CosmicWheel Canvas must also use translated text. Pass the `t` function or current translations to the wheel drawing function so zodiac sign names and planet labels render in the selected language.

---

## Routes (only 3)
```
/              → Landing (input form)
/portrait/[id] → Cosmic frequency portrait
/about         → How it works
```

---

## Landing Page (/)

Background: var(--space) + CSS star field

Centred content (max-w-md):

- "ASTRARA" — Instrument Serif, text-sm, tracking-[0.3em], uppercase, var(--text-secondary)
- "Your Cosmic Frequency Portrait" — Instrument Serif italic, text-3xl md:text-5xl
- "Enter your birth details to hear the music of your stars" — DM Sans, var(--text-secondary)

**Form:**
- Date of Birth: date input
- Time of Birth: time input. Note: "Don't know? Use 12:00"
- City of Birth: text input with autocomplete from 500+ city list. Filter on type, show top 8 matches. Each city: { name, lat, lng }. Fallback: collapsible "Enter coordinates" with lat/lng inputs.
- "Reveal My Cosmic Portrait" — full width, bg var(--accent), rounded-xl, py-4. Disabled until filled.
- On click: calculate → nanoid → navigate /portrait/[id]?d=...&t=...&lat=...&lng=...&l=...
- Loading: "Calculating planetary positions..."

Below: "How does it work?" → /about, ecosystem badge → harmonicwaves.app

---

## Portrait Page (/portrait/[id])

Read birth data from URL query params. Calculate chart client-side.

### Section A: Visualisation (full viewport)

**Cosmic Wheel (Canvas, 85vmin mobile / 60vmin desktop):**

- Outer ring: 12 zodiac segments with thin circle + dividing lines
  - Element colour tints: Fire=amber, Earth=green, Air=blue, Water=violet (all at 0.05 opacity)
  - Zodiac symbols: ♈♉♊♋♌♍♎♏♐♑♒♓
- Planet dots at correct ecliptic longitude: Sun/Moon=12px, inner=8px, outer=6px
  - Planet-specific colours, radial glow, label with symbol + degree
- Aspect lines between planets (orb 8° for major, 6° for sextile):
  - Conjunction 0°: thick, amber
  - Trine 120°: solid, blue at 0.2
  - Square 90°: dotted, red at 0.15
  - Opposition 180°: dashed, red at 0.3
  - Sextile 60°: thin, blue at 0.1
- Centre: Seed of Life (7 circles), slowly rotating
- Animation: planets fade in 200ms stagger, then aspect lines draw in, continuous slow rotation

Below wheel: birth info in IBM Plex Mono

**Play Button** (bottom floating): 64px circle, var(--accent), play icon. "Listen to your cosmic sound". Tap starts audio + wheel animation intensifies. iOS: AudioContext.resume().

### Section B: Frequency Breakdown

"Your Frequency Signature" — Instrument Serif

**Planet Cards** (stack): Each with planet colour left border
- Planet dot + name + symbol | zodiac sign + degree | frequency Hz
- Thin sine wave bar (Canvas) in planet colour
- Order: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto

**Dominant Tone** highlight card: strongest planet frequency prominently displayed

**Harmonic Aspects** cards: each major aspect with musical interval name

### Section C: Share & Explore

Share card with copy URL button
Ecosystem cards: Lunata, Binara, Sonarus with contextual copy
Footer: harmonicwaves.app

---

## About Page (/about)

1. What is a cosmic frequency portrait
2. The science — VSOP87 algorithms (NASA-grade), Cousto's Cosmic Octave
3. Why every portrait is unique
4. Links to create portrait + ecosystem

---

## Core: Planetary Calculations

Use astronomy-engine:
```typescript
import * as Astronomy from 'astronomy-engine';

function calculateChart(date: Date) {
  const time = Astronomy.MakeTime(date);
  // Sun: Astronomy.EclipticLongitude(Astronomy.Body.Sun, time)
  // Moon: Astronomy.EclipticGeoMoon(time).lon
  // Others: Astronomy.EclipticLongitude(body, time)
  // Returns 0-360 ecliptic longitude per planet
  // Map to zodiac: floor(longitude/30) = sign index
}
```

## Core: Frequency Mapping (Cousto Cosmic Octave)

Base frequencies per planet (orbital periods octaved to audible):
```
Sun: 126.22, Moon: 210.42, Mercury: 141.27, Venus: 221.23,
Mars: 144.72, Jupiter: 183.58, Saturn: 147.85, Uranus: 207.36,
Neptune: 211.44, Pluto: 140.25
```

Zodiac modulation: longitude 0-360 maps to multiplier 0.75-1.5
```typescript
freq = base * (0.75 + (longitude / 360) * 0.75)
```

Every birth chart produces genuinely unique frequencies.

## Core: Generative Audio

10 oscillators (one per planet) through Web Audio API:
- Waveform by planet: Sun/Jupiter=sine, Moon/Venus/Neptune=triangle, Mars/Pluto=square, others=sine
- Volume: Sun loudest (0.15), outer planets quietest (0.03-0.04)
- Slow LFO per oscillator for organic breathing (0.1-0.4 Hz)
- Slight detuning per planet for warmth
- Delay node (0.3s, gain 0.2) for space/reverb
- 3-second fade in
- Sound must be BEAUTIFUL — like singing bowls in space, ambient, meditative, warm

---

## Cities Data (src/lib/cities.ts)

500+ cities. MUST include:
- ALL world capitals
- ALL Lithuanian cities: Vilnius, Kaunas, Klaipeda, Siauliai, Panevezys, Alytus, Marijampole
- Irish: Dublin, Cork, Galway, Limerick, Waterford
- Indonesian: Jakarta, Bali/Denpasar, Ubud area, Surabaya, Bandung, Yogyakarta
- Major UK: London, Manchester, Birmingham, Edinburgh, Glasgow, Bristol, Leeds, Liverpool
- Major US: all state capitals + NYC, LA, Chicago, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Francisco, Seattle, Denver, Boston, Miami, Atlanta, Portland
- Europe: comprehensive coverage of all countries
- Asia, Africa, South America, Oceania: all major cities
- Format: { name: "City, Country", lat: number, lng: number }[]

---

## File Structure
```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── portrait/[id]/
│   │   ├── page.tsx
│   │   └── opengraph-image.tsx
│   └── about/page.tsx
├── components/
│   ├── StarField.tsx, CosmicWheel.tsx, PlanetCard.tsx
│   ├── AspectCard.tsx, ShareCard.tsx, BirthForm.tsx
│   ├── CityAutocomplete.tsx, PlayButton.tsx
│   ├── FrequencyBar.tsx, EcosystemBadge.tsx
│   └── LanguageToggle.tsx
├── hooks/
│   ├── useCosmicSound.ts, usePortraitAnimation.ts
├── lib/
│   ├── astro/ (birth-chart.ts, aspects.ts, frequency-map.ts)
│   ├── audio/cosmic-synth.ts
│   ├── i18n.ts              # All EN/LT translations + LanguageProvider + useLanguage hook
│   ├── cities.ts
│   └── utils.ts
├── types/index.ts
└── public/ (manifest.json, icons/)
```

## Sharing
URL: /portrait/[nanoid]?d=1988-03-15&t=14:30&lat=51.5074&lng=-0.1278&l=London,UK

## OG Image
@vercel/og: 1200x630, space gradient, ASTRARA title, birth date, planet dots with Hz.

## Metadata
title: "Astrara — Your Cosmic Frequency Portrait"
themeColor: "#3B82F6"

## Deploy
```bash
git add -A && git commit -m "Astrara — Cosmic Frequency Portrait" && git push origin master:main
```

Build everything now. Cosmic sound must be genuinely beautiful. Visualisation genuinely stunning. Landing to hearing your cosmic sound: under 30 seconds. Make them want to share immediately.
