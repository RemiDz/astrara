# ASTRARA — /about Page: Private Learning Reference

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Overview

Create a hidden `/about` route — a deep learning reference document for understanding planetary astrology and how to read zodiac charts using Astrara's data. This is a private page for the app creator only. NOT linked from any navigation.

The page should read like a beautifully formatted reference book — thorough, educational, and easy to navigate.

---

## 1. Create the Route

Create `src/app/about/page.tsx`

Add `noindex` meta tag:

```tsx
export const metadata = {
  title: 'Astrara · Learning Reference',
  robots: 'noindex, nofollow',
}
```

---

## 2. Page Styling

Dark background matching the main app. Clean, readable, long-form layout. Optimised for comfortable reading — max width ~720px centred, generous line height, clear section hierarchy.

```tsx
<div className="min-h-screen bg-[#05050F] text-white/80">
  <div className="max-w-3xl mx-auto px-6 py-12">
    {/* Content here */}
  </div>
</div>
```

Typography:
- Main headings: `text-2xl font-serif text-white/90`
- Sub headings: `text-lg font-medium text-white/80 mt-12 mb-4`
- Body text: `text-sm leading-relaxed text-white/65`
- Accent highlights: `text-white/80`
- Section dividers: subtle `border-t border-white/5 my-12`

Add a floating table of contents on desktop (sticky left sidebar) that links to each section. On mobile, show a collapsible TOC at the top.

---

## 3. Page Content — Write ALL of This

The page must contain ALL of the following content. Write it in full — do NOT use placeholder text. The writing style should be clear, educational, and accessible — like a thoughtful teacher explaining to a curious student.

---

### SECTION 1: Header

```
ASTRARA · Learning Reference
A practitioner's guide to reading the cosmic map

This reference covers the astrological meaning of each planet, 
how zodiac signs shape planetary expression, and how to interpret 
the data Astrara provides for readings and sound healing sessions.
```

---

### SECTION 2: The Ten Celestial Bodies

For EACH of the following 10 bodies, write a comprehensive entry that includes:
- The body's glyph and name
- What it represents in astrology (its domain, theme, archetype)
- How it affects daily life when emphasised
- Its orbital period (how long it stays in each sign)
- Its associated frequency based on Hans Cousto's Cosmic Octave calculations
- Which instrument or sound healing technique resonates with it
- What it means when this planet is prominent in someone's chart

Write entries for:

1. **☉ Sun** — Core identity, vitality, life purpose, ego, consciousness. Orbital period: ~1 month per sign. Cousto frequency: 126.22 Hz. Associated with the heart centre. When the Sun transits a sign, that sign's themes illuminate everyone's life.

2. **☽ Moon** — Emotions, instincts, subconscious, nurturing, inner world. Orbital period: ~2.5 days per sign (fastest mover). Cousto frequency: 210.42 Hz. Associated with the sacral centre. The Moon's sign sets the emotional tone of each day — crucial for timing sound healing sessions.

3. **☿ Mercury** — Communication, thinking, learning, travel, technology. Orbital period: ~14-30 days per sign. Cousto frequency: 141.27 Hz. Associated with the throat centre. Mercury retrograde is the most well-known astrological event — communication and tech disruptions.

4. **♀ Venus** — Love, beauty, relationships, values, pleasure, art. Orbital period: ~23-60 days per sign. Cousto frequency: 221.23 Hz. Associated with the heart and sacral centres. Venus placements influence relationship energy and aesthetic sensitivity.

5. **♂ Mars** — Drive, energy, action, courage, conflict, sexuality. Orbital period: ~6-7 weeks per sign. Cousto frequency: 144.72 Hz. Associated with the root and solar plexus centres. Mars placements determine where we feel motivated or frustrated.

6. **♃ Jupiter** — Growth, expansion, luck, wisdom, abundance, travel. Orbital period: ~1 year per sign. Cousto frequency: 183.58 Hz. Associated with the crown centre. Jupiter transits bring growth and opportunity to the sign it occupies.

7. **♄ Saturn** — Structure, discipline, responsibility, limitations, karma, time. Orbital period: ~2.5 years per sign. Cousto frequency: 147.85 Hz. Associated with the root centre. Saturn transits bring lessons, challenges, and maturity.

8. **♅ Uranus** — Revolution, innovation, sudden change, freedom, awakening. Orbital period: ~7 years per sign. Cousto frequency: 207.36 Hz. Associated with the third eye. Uranus transits shake up established patterns.

9. **♆ Neptune** — Spirituality, dreams, illusion, intuition, transcendence, compassion. Orbital period: ~14 years per sign. Cousto frequency: 211.44 Hz. Associated with the crown centre. Neptune dissolves boundaries between real and imagined.

10. **♇ Pluto** — Transformation, death and rebirth, power, the unconscious, evolution. Orbital period: ~12-31 years per sign (varies due to elliptical orbit). Cousto frequency: 140.25 Hz. Associated with the root centre. Pluto transits transform entire generations.

---

### SECTION 3: The Twelve Zodiac Signs

For EACH of the 12 signs, write a comprehensive entry that includes:
- The sign's glyph, name, and date range
- Element (Fire, Earth, Air, Water) and what that means
- Modality (Cardinal, Fixed, Mutable) and what that means
- Ruling planet and what that connection means
- Key themes and energy of the sign
- Body area associated with the sign
- Shadow side / challenges
- Sound healing connection — which frequencies, instruments, and techniques best serve this sign's energy
- What it means when multiple planets are transiting through this sign

Write entries for all 12:
Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces

---

### SECTION 4: How to Read a Daily Chart

Write a practical guide explaining how to use Astrara's data to give someone a daily reading. Cover:

- **Step 1: Check the Sun sign** — What season are we in? What sign is the Sun illuminating? This sets the overall background energy for everyone.

- **Step 2: Check the Moon sign and phase** — The Moon moves fastest and sets the emotional tone of each day. A Full Moon amplifies and reveals. A New Moon invites fresh starts. The Moon's sign colours HOW we feel.

- **Step 3: Look at planet clusters** — Are multiple planets gathered in one or two signs? This creates a stellium — concentrated energy in that area of life. The more planets in one sign, the more intense that sign's themes become.

- **Step 4: Check for oppositions and squares** — Planets opposite each other (180°) create tension and awareness. Planets square each other (90°) create friction and motivation to act. These are where the drama and growth happen.

- **Step 5: Note the slow movers** — Jupiter, Saturn, Uranus, Neptune, Pluto move slowly and set the generational backdrop. Their sign placements are the deep currents that affect everyone for months or years.

- **Step 6: Personalise for the person's sign** — For a specific person, look at what planets are transiting through their Sun sign, opposing their sign, and squaring their sign. This tells you how intensely today's energy affects them personally.

- **Step 7: Add the Earth data** — High Kp index (5+) means the geomagnetic field is disturbed — many people report poor sleep, heightened emotions, headaches. Solar flares can amplify sensitivity. Sound healing sessions may feel more intense during geomagnetic storms.

- **Step 8: Choose the sound** — Use the Moon sign to determine the drone frequency. Use the overall energy to choose binaural beat speed. Use the dominant element (Fire/Earth/Air/Water) to select instruments.

---

### SECTION 5: Planetary Aspects Explained

Explain the major aspects and what they mean in practice:

- **Conjunction (0°)** — Planets in the same sign. Their energies merge and amplify each other. Like two musicians playing the same note — powerful and focused.

- **Sextile (60°)** — Planets two signs apart. A harmonious, supportive connection. Opportunities that require a small effort to activate.

- **Square (90°)** — Planets three signs apart. Friction, tension, challenge. These are growth aspects — uncomfortable but productive.

- **Trine (120°)** — Planets four signs apart. Natural harmony and flow. Talents and gifts that come easily. Can also mean complacency.

- **Opposition (180°)** — Planets six signs apart. Awareness, polarity, balance. Forces you to see both sides. Relationships and external events.

---

### SECTION 6: Elements and Their Sound Connections

Write about how the four elements connect to sound healing practice:

- **Fire (Aries, Leo, Sagittarius)** — High energy, Beta brainwaves (14-30 Hz binaural beats), fast rhythms, frame drums, didgeridoo, fire gong. Frequencies that energise and activate.

- **Earth (Taurus, Virgo, Capricorn)** — Grounding energy, Alpha brainwaves (8-14 Hz binaural beats), steady drones, monochord, crystal bowls in lower octaves, root frequency 256 Hz. Frequencies that stabilise and anchor.

- **Air (Gemini, Libra, Aquarius)** — Mental clarity, Alpha-Beta bridge (12-15 Hz binaural beats), singing bowls, wind chimes, tuning forks, higher octave tones. Frequencies that clarify and open.

- **Water (Cancer, Scorpio, Pisces)** — Deep feeling, Theta brainwaves (4-8 Hz binaural beats), ocean drum, rain stick, gong baths, 432 Hz tuning, solfeggio frequencies. Frequencies that dissolve and heal.

---

### SECTION 7: Data Sources

For each data source used in Astrara, write a clear explanation:

1. **astronomy-engine (npm package)**
   - What: Open-source astronomical calculation library by Don Cross
   - Accuracy: Verified against NASA JPL (Jet Propulsion Laboratory) ephemeris data, accurate to fractions of a degree
   - Used for: All planetary positions (ecliptic longitude, distance, rise/set times), moon phase calculations, heliocentric positions for the solar system view
   - Runs entirely client-side — no server or internet needed for position calculations
   - Source: github.com/cosinekitty/astronomy

2. **NOAA Space Weather Prediction Center**
   - What: US National Oceanic and Atmospheric Administration's space weather monitoring service
   - Kp Index endpoint: `https://services.swpc.noaa.gov/json/planetary_k_index_1m.json`
   - X-ray Flux endpoint: `https://services.swpc.noaa.gov/json/goes/primary/xrays-1-day.json`
   - Used for: Earth's geomagnetic activity (Kp 0-9), solar flare classification (A/B/C/M/X class), solar wind data
   - Updated every few minutes from GOES satellites
   - Same data used by power companies and airlines for geomagnetic storm preparation
   - Practitioner relevance: Research links geomagnetic activity to sleep quality, mood, blood pressure, and heart rate variability

3. **Hans Cousto's Cosmic Octave**
   - What: Mathematical system created by Swiss mathematician Hans Cousto in 1978
   - How it works: Takes a planet's orbital period, converts it to a frequency (1/period), then octave-transposes it up into the audible range by repeatedly doubling
   - Example: Earth's year = 365.25 days → base frequency → octave up 32 times → 136.10 Hz (the "Om" frequency)
   - Used for: Planet tone frequencies when tapping planets on the wheel, drone tuning for the soundscape
   - Published in: "The Cosmic Octave" (1978)
   - Practitioner relevance: Provides a scientific basis for tuning instruments and sound healing sessions to planetary frequencies

4. **Solfeggio Frequencies**
   - What: A set of specific frequencies (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) associated with different healing qualities
   - Origin: Historically linked to Gregorian chants, though the modern framework is a contemporary interpretation
   - Used for: Moon-sign-based drone tuning in the soundscape, mapping zodiac signs to specific solfeggio tones
   - Scientific status: Evidence for specific healing properties is still emerging, but the frequencies provide a meaningful and intentional framework
   - Practitioner relevance: Widely used in sound healing practice as a tuning reference

5. **Claude API (Anthropic)**
   - What: AI language model API used for generating personalised horoscope readings
   - Used for: Daily general readings, individual zodiac readings, weekly forecasts on the /promo content studio page
   - How: Real astronomical data (positions, aspects, moon phase, earth data) is sent as context — Claude generates interpretive readings grounded in the actual sky
   - Model: Claude Sonnet 4
   - Not used for: Planetary calculations (those are pure astronomy-engine maths)

6. **Plausible Analytics**
   - What: Privacy-focused, cookie-free web analytics
   - Used for: Anonymous usage statistics across all Harmonic Waves ecosystem apps
   - Does NOT collect personal data, use cookies, or track individual users

---

### SECTION 8: Frequency Reference Table

Create a reference table showing:

| Planet | Cousto Frequency (Hz) | Musical Note | Chakra | Colour |
|--------|----------------------|--------------|--------|--------|
| Sun | 126.22 | B | Solar Plexus / Heart | Gold / Orange |
| Moon | 210.42 | G# | Sacral | Silver / Violet |
| Mercury | 141.27 | C# / D | Throat | Yellow-Green |
| Venus | 221.23 | A | Heart / Sacral | Green / Pink |
| Mars | 144.72 | D | Solar Plexus / Root | Red |
| Jupiter | 183.58 | F# | Crown | Blue / Purple |
| Saturn | 147.85 | D | Root | Dark Blue / Black |
| Uranus | 207.36 | G# | Third Eye | Electric Blue |
| Neptune | 211.44 | G# | Crown | Turquoise / Sea Green |
| Pluto | 140.25 | C# | Root | Deep Crimson / Black |

Also create a solfeggio-to-zodiac mapping table:

| Zodiac Sign | Solfeggio Frequency (Hz) | Quality |
|------------|------------------------|---------|
| Aries | 396 | Liberation, releasing fear |
| Taurus | 417 | Facilitating change |
| Gemini | 528 | Transformation, DNA repair |
| Cancer | 639 | Connecting, relationships |
| Leo | 741 | Expression, solutions |
| Virgo | 852 | Returning to spiritual order |
| Libra | 639 | Connecting, harmony |
| Scorpio | 174 | Foundation, pain reduction |
| Sagittarius | 741 | Expression, awakening intuition |
| Capricorn | 285 | Influence, energy field healing |
| Aquarius | 963 | Awakening, cosmic consciousness |
| Pisces | 852 | Intuition, inner vision |

---

### SECTION 9: Quick Reference — Reading Cheat Sheet

A condensed one-page cheat sheet for doing a quick reading:

```
DAILY READING CHECKLIST

1. What sign is the Sun in?         → Season energy
2. What sign is the Moon in?        → Today's emotional tone
3. What phase is the Moon?          → Doing (waxing) or releasing (waning)?
4. Any planet clusters?             → Where is energy concentrated?
5. Any oppositions?                 → Where is there tension?
6. Kp index above 4?               → Bodies may feel it
7. What element dominates?          → Choose instruments accordingly
8. What is the person's Sun sign?   → How does today hit them specifically?
```

---

## 4. Render Tables Properly

If using react-markdown, add table support. Install the GFM plugin:

```bash
npm install remark-gfm
```

Use in the component:

```tsx
import remarkGfm from 'remark-gfm'

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {content}
</ReactMarkdown>
```

Or render the tables as styled HTML directly in JSX rather than markdown.

Style tables to match the dark cosmic aesthetic:

```css
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.5);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
td {
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.65);
  font-size: 0.875rem;
}
```

---

## Do NOT

- Do NOT link this page from any public navigation
- Do NOT add to sitemap
- Do NOT use placeholder or Lorem Ipsum text — write ALL content in full
- Do NOT make this page interactive — it's a static reference document
- Do NOT change any existing app pages or components

---

## Build & Deploy

1. Run `npm install remark-gfm` if not already installed
2. Run `npm run build` — fix any TypeScript errors
3. Test: navigate to /about → full reference document loads
4. Test: table of contents links jump to correct sections
5. Test: all 10 planet entries are written in full
6. Test: all 12 zodiac sign entries are written in full
7. Test: data sources section covers all 6 sources
8. Test: frequency tables render correctly with styling
9. Test: page is NOT accessible from any main navigation
10. Test: page reads well on mobile (single column, no overflow)
11. Commit: `feat: /about private learning reference — planets, signs, data sources`
12. Push to `main`
