# ASTRARA — Update Astro Wheel Info Text

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Task

Find the About/Info modal or page that contains the "The Astro Wheel" section and replace its text content. Do NOT change any styling, layout, animations, or other sections — only update the text for the Astro Wheel section.

---

## Find

Search all source files for the current text: `"positioned exactly where it appears in the sky right now"` — this will locate the correct component or data file.

---

## Replace the Astro Wheel section text with this exact copy:

```
The wheel at the centre of Astrara is a live map of the zodiac as seen from Earth. You are standing at the centre — the small blue Earth — and the planets are placed at their real angular positions along the ecliptic, the band of sky through which all planets travel.

The twelve zodiac signs mark 30° sections of this band. Each planet sits at the exact degree where it actually appears in the sky right now. As you swipe between days, the planets move to where they actually were or will be.

The distance of each planet from the centre is arranged for visual clarity — it does not represent real astronomical distance. Think of it like a clock face: the angle is precise, the distance from the middle is just layout.

All positions are calculated locally on your device using an open-source astronomical library called astronomy-engine, which is accurate to within a fraction of a degree and verified against NASA JPL data. No internet connection is needed for the calculations — your phone does the maths.
```

---

## Keep the heading and icon exactly as they are (✦ The Astro Wheel)

## Do NOT touch any other sections (Planetary Insights, Cosmic Soundscape, Earth Intelligence, Q&A)

---

## Build & Deploy

1. Run `npm run build` to verify no errors
2. Commit: `content: clarify astro wheel shows angular position not distance`
3. Push to `main`
