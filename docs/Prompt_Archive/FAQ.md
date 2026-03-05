# Astrara — Frequently Asked Questions

## General

### What is Astrara?

Astrara is a **live cosmic intelligence app** — a real-time astrological guide that shows you exactly where every planet sits in the sky right now, what signs they're moving through, and what that might mean for your day. Think of it as a weather app, but for planetary energy.

### Who is Astrara for?

Anyone curious about the sky — from seasoned astrologers to complete beginners. Sound healing practitioners, meditators, yogis, and anyone who wants to understand the cosmic rhythms affecting daily life.

### Is Astrara free?

Yes. Astrara is completely free to use with no accounts, no subscriptions, and no paywalls.

### Who made Astrara?

Astrara is part of the **Harmonic Waves** ecosystem — a suite of free tools built for sound healing practitioners and anyone curious about the relationship between cosmic rhythms and human experience. Learn more at [harmonicwaves.app](https://harmonicwaves.app).

---

## Astronomy & Accuracy

### Is this real astronomy or just astrology?

Both. The planetary positions are calculated using the same precise astronomical algorithms that scientists use (verified against NASA JPL data). The interpretations of what those positions mean draw from the astrological tradition — which you're free to take as literally or metaphorically as you like.

### How accurate are the planet positions?

Extremely accurate. Astrara uses the **astronomy-engine** library, which is verified against NASA's Jet Propulsion Laboratory (JPL) data and is accurate to within fractions of a degree. These are the same algorithms used to navigate spacecraft.

### Which celestial bodies does Astrara track?

All 10 traditional astrological bodies: **Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto**.

### Does Astrara need an internet connection for planet positions?

No. All astronomical calculations run entirely on your device — no API calls, no server round-trips. Your phone does the maths using the same algorithms NASA uses. The only features requiring internet are the Earth Intelligence panel (live NOAA satellite data) and initial location detection.

### Can I view planets for different days?

Yes. Use the **Yesterday / Today / Tomorrow** navigation below the wheel, or tap the date in the header to pick any date. The wheel recalculates all positions instantly on your device.

---

## The Astro Wheel

### What am I looking at?

The wheel is a live map of the solar system as seen from Earth. **You are standing at the centre** — the small blue Earth — and everything around you is positioned exactly where it appears in the sky right now. The twelve zodiac signs mark the sections of the sky. The planets are placed at their real astronomical positions.

### Can I interact with the wheel?

Yes — tap or click on:
- **A planet** → see its zodiac sign, degree, retrograde status, rise/set times, and a detailed interpretation
- **A zodiac sign segment** → see its element, modality, ruling planet, themes, and which planets currently occupy it
- **An aspect line** (coloured line between planets) → see the aspect type, orb, and what it means for your day
- **The Earth** at the centre → opens the Earth Intelligence panel with live geomagnetic data

### Can I customise the wheel?

Yes. Tap the **⚙ Settings** icon in the header to adjust:
- **Planet size** (50–150%)
- **Rotation speed** (0–500%, or paused)
- **Rotation sound** (on/off)

Settings are saved automatically and persist between visits.

---

## Cosmic Soundscape

### What is the cosmic soundscape?

When you tap the **🔊 sound icon**, Astrara generates a live ambient soundscape tuned to today's planetary configuration. This is **not pre-recorded music** — it's synthesised in real time by your device using the Web Audio API.

### What layers make up the soundscape?

1. **Drone** — a base frequency tied to the Moon's current zodiac sign, using solfeggio frequencies (e.g., Moon in Pisces = 852 Hz for intuition)
2. **Binaural beats** — a gentle pulsing effect that varies by the Moon's element (Fire → Beta 14 Hz for alertness, Water → Theta 6 Hz for calm, Air → Alpha 10 Hz for focus, Earth → Delta 3.5 Hz for rest)
3. **Planet tones** — each planet has a unique tone based on Hans Cousto's calculations of planetary orbital frequencies, heard when you tap a planet
4. **Rotation sound** (optional) — a vortex hum that shifts pitch based on wheel spin velocity

### Do I need headphones?

The drone and planet tones work through speakers, but **binaural beats only work with headphones**. Two slightly different frequencies are played in each ear — your brain perceives the difference as a rhythmic pulse that can help guide brainwaves. This effect can't happen through speakers where both ears hear everything.

### What are solfeggio frequencies?

The solfeggio frequencies (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) are a set of tones that many sound healing traditions associate with specific physical and emotional qualities. While scientific evidence for their specific healing properties is still emerging, they provide a meaningful and intentional framework for tuning the soundscape to the current cosmic energy.

### What are Hans Cousto's planetary frequencies?

Swiss mathematician Hans Cousto calculated the audible octave equivalents of planetary orbital periods. Each planet has a real, measurable frequency derived from its orbit around the Sun — transposed up many octaves into the range human ears can hear. Examples: Sun = 126.22 Hz, Moon = 210.42 Hz, Venus = 221.23 Hz.

---

## Earth Intelligence

### What is the Earth Intelligence panel?

Tapping the **Earth** at the centre of the wheel shows live data about our planet's electromagnetic environment, pulled directly from **NOAA** (the US National Oceanic and Atmospheric Administration) satellites.

### What is the Kp Index?

The Kp Index measures how disturbed Earth's magnetic field is on a scale of 0 to 9. Research has shown that geomagnetic activity can affect human sleep, mood, blood pressure, and even heart rate variability. Sound healing practitioners often find that sessions feel different during magnetically active periods.

### What is the solar wind data?

The solar wind is a stream of charged particles flowing from the Sun. Astrara shows its **speed** (km/s), **density** (particles/cm³), and **magnetic field component**. When the solar wind hits Earth's magnetosphere, it can amplify geomagnetic activity.

### What is the Schumann Resonance?

The Schumann Resonance (7.83 Hz) is the electromagnetic frequency of the cavity between the Earth's surface and the ionosphere. It sits exactly at the boundary between Theta and Alpha brainwaves, and many practitioners consider it the Earth's natural heartbeat. For a deeper dive, visit [shumann.app](https://shumann.app).

### Where does the Earth data come from?

Directly from **NOAA's Space Weather Prediction Center** — the same data that power companies and airlines use to prepare for geomagnetic storms. It updates every few minutes from satellites monitoring the Sun and Earth's magnetic field.

---

## Insights & Content

### How are the planetary insights generated?

All insights are **pre-written by humans** — not AI-generated. Each of the 120 planet × sign combinations has hand-crafted text: a poetic one-liner, a 2–3 paragraph deep insight, and a practical tip. The voice is "mystical but clear" — poetic language that always explains what it means practically.

### What do the aspect lines mean?

Aspects are geometric relationships between planets:
- **Conjunction (0°)** — two forces merging, intensification
- **Sextile (60°)** — gentle opportunity, cooperation
- **Square (90°)** — tension, challenge, growth through friction
- **Trine (120°)** — harmony, ease, natural flow
- **Opposition (180°)** — polarity, awareness, balancing act

Tap any aspect line on the wheel to read what that specific planet pair means today.

### Does Astrara include retrograde information?

Yes. Astrara detects retrograde motion by comparing a planet's position across consecutive days. Retrograde status is shown on planet detail cards.

---

## Privacy & Data

### Does Astrara collect my data?

No. Astrara doesn't collect personal data. Your location is used only on your device to calculate local rise/set times and is **never sent to any server**. If you enter birth details (for the upcoming birth chart feature), they're stored only on your device in localStorage.

### What analytics does Astrara use?

Astrara uses **Plausible Analytics**, which is privacy-focused, open-source, and **doesn't use cookies**. It counts page views without tracking individuals.

### What does Astrara store on my device?

Astrara saves preferences to **localStorage** (your browser's local storage):
- Language preference (English / Lithuanian)
- Settings (planet size, rotation speed, rotation sound toggle)
- Audio on/off preference
- Birth data (if entered — stored locally only)

---

## Languages & Accessibility

### What languages does Astrara support?

Currently **English** and **Lithuanian**. The language is auto-detected from your browser settings and can be switched with the flag toggle in the header.

### Does Astrara work on mobile?

Yes. Astrara is designed **mobile-first** and is fully responsive. On mobile, the layout stacks vertically (wheel on top, cosmic weather below). On desktop, it uses a two-column layout.

### Can I install Astrara as an app?

Yes. Astrara is a **Progressive Web App (PWA)**. On most devices, you can add it to your home screen from the browser menu for an app-like experience without browser chrome.

---

## Technical

### What is Astrara built with?

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (React 19) |
| Language | TypeScript |
| 3D Rendering | Three.js with React Three Fiber |
| Astronomy | astronomy-engine (NASA-verified) |
| Audio | Web Audio API (browser-native) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Analytics | Plausible |

### Does Astrara work offline?

Partially. The **astronomical calculations, audio synthesis, and UI** all work offline. The **Earth Intelligence panel** requires a live internet connection for NOAA satellite data and will show a graceful error notice when offline.

### What browsers are supported?

Astrara works in all modern browsers that support WebGL (for the 3D wheel) and the Web Audio API (for the soundscape). This includes Chrome, Firefox, Safari, and Edge on both desktop and mobile.

---

## Upcoming Features

### What's coming next?

- **Personal birth chart** — enter your birth date, time, and location to see your natal chart overlaid on the live sky
- **Extended timeline** — navigate beyond ±1 day to explore any date in history or future
- **3D celestial sphere** — enhanced visualisation of the full sky dome
- **AI-generated insights** — personalised interpretations based on your birth chart + current transits
- **Ecosystem integration** — sound healing frequency recommendations per transit, connecting to the broader Harmonic Waves suite

---

*Part of the [Harmonic Waves](https://harmonicwaves.app) ecosystem — free tools for sound healing practitioners and cosmic explorers.*
