# ASTRARA — Remove Star Shape Around Earth

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## What to Do

There is a star/hexagram shape visible around the Earth in the centre of the astro wheel. This shape is formed by aspect lines connecting planets. DELETE IT COMPLETELY.

Read all current aspect line, planet connection, and wheel source files before making changes.

---

## Step 1: Find and Delete ALL Aspect Lines

Search the entire codebase for ANY code that draws lines between planets on the wheel. This includes:

- Lines connecting planet pairs (trines, sextiles, squares, oppositions)
- Any `<line>`, `<Line>`, `LineBasicMaterial`, `BufferGeometry` used for connecting planets
- Any component named AspectLines, AspectLine, PlanetConnections, or similar
- Any geometry that creates a star, hexagram, or polygon shape from planet positions

DELETE ALL OF IT. Every single line of code that draws connections between planets on the wheel must be removed.

## Step 2: Verify Nothing Remains

After deletion, search the codebase for these terms and confirm zero visual rendering results:
- "aspect" (in the context of visual lines, not data/text)
- "connection" (in the context of visual lines between planets)
- Lines between planet positions

## Step 3: Keep Aspect DATA for Text Content

If there is aspect interpretation TEXT used in detail panels (like "Sun trine Jupiter means..."), keep that data. Only remove the VISUAL lines on the wheel. The text content about aspects is fine — only the geometric lines must go.

---

## Do NOT

- Do NOT keep any aspect lines "but make them subtle" — remove them completely
- Do NOT replace them with anything — just remove them
- Do NOT argue that they are astronomical not religious — just delete them
- Do NOT change any other visual elements on the wheel
- Do NOT touch planet positions, zodiac signs, orbital rings, Earth Kp aura, Sun corona, or starfield

---

## Build & Deploy

1. Run `npm run build` — fix any TypeScript errors
2. Test: the wheel shows planets, zodiac signs, and rings — NO lines connecting planets
3. Test: NO star or hexagram shape visible anywhere on the wheel
4. Test: the area around Earth is clean — only the Kp aura glow, nothing else
5. Test: planet detail panels still show aspect text if they had it before
6. Commit: `fix: remove all aspect lines from wheel`
7. Push to `main`
