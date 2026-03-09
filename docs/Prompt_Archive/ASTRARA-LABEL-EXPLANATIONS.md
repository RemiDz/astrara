# ASTRARA — Mother Shape: Floating Label + KPI Explanations

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

Think mode: `megathink`

---

## ⚠️ DO NOT BREAK EXISTING FEATURES

This adds (1) a floating text label above the mother shape and (2) explanatory text under each KPI card in the Cosmic Pulse modal. No existing behaviour changes.

---

## PART A: FLOATING LABEL ABOVE MOTHER SHAPE

### Concept

A few words of transparent, ethereal text floating just above the mother shape that describes the current cosmic situation. This gives users an instant hint about what the mother shape is communicating — the headline of the day's cosmic weather.

### Position

- Use R3F `<Html>` from `@react-three/drei` to render the label in screen space, anchored to a position above the mother shape
- Position: `[0, 2.05, 0]` — just above the top of the sacred geometry form (adjust if needed based on actual mother shape size)
- `<Html center>` so the text is horizontally centred
- `zIndexRange={[1, 0]}` — sits behind modal UI but above the 3D scene

### Styling

```css
font-family: var(--font-display)  /* Cormorant Garamond — matches app headings */
font-size: 11px
letter-spacing: 2px
text-transform: uppercase
color: rgba(255, 255, 255, 0.35)  /* very transparent — ethereal, not shouty */
text-align: center
white-space: nowrap
pointer-events: none  /* does not interfere with crystal tap target */
user-select: none
text-shadow: 0 0 12px rgba(elementColor, 0.3)  /* subtle glow in element colour */
```

The text should feel like it's barely there — like reading words written in starlight. NOT a bold label. If the user isn't looking for it, they might not even notice it at first.

### Content — Dynamic Based on Cosmic State

The label text changes based on what's happening in the sky. Use the data already available from `useAstroData` and `useEarthData`.

Generate the label using this priority system (first matching condition wins):

**Priority 1 — Extraordinary Events:**

| Condition | English | Lithuanian |
|-----------|---------|------------|
| Any planet stationed retrograde today | "✦ [Planet] turns inward" | "✦ [Planeta] pasisuka į vidų" |
| Any planet stationed direct today | "✦ [Planet] moves forward" | "✦ [Planeta] juda pirmyn" |
| Full Moon | "✦ Full Moon illumination" | "✦ Pilnaties apšvietimas" |
| New Moon | "✦ New Moon inception" | "✦ Jaunaties pradžia" |
| Any planet ingress (changed sign today) | "✦ [Planet] enters [Sign]" | "✦ [Planeta] įeina į [Ženklą]" |

**Priority 2 — Dominant Energy:**

| Condition | English | Lithuanian |
|-----------|---------|------------|
| Fire dominant | "✦ Fire shapes this moment" | "✦ Ugnis formuoja šią akimirką" |
| Earth dominant | "✦ Earth grounds this moment" | "✦ Žemė įžemina šią akimirką" |
| Air dominant | "✦ Air moves through this moment" | "✦ Oras juda per šią akimirką" |
| Water dominant | "✦ Water flows through this moment" | "✦ Vanduo teka per šią akimirką" |

**Priority 3 — Tightest Aspect (fallback):**

| Condition | English | Lithuanian |
|-----------|---------|------------|
| Tightest aspect is conjunction | "✦ [Planet A] meets [Planet B]" | "✦ [Planeta A] sutinka [Planetą B]" |
| Tightest aspect is opposition | "✦ [Planet A] faces [Planet B]" | "✦ [Planeta A] stoja prieš [Planetą B]" |
| Tightest aspect is trine | "✦ [Planet A] flows with [Planet B]" | "✦ [Planeta A] teka su [Planeta B]" |
| Tightest aspect is square | "✦ [Planet A] challenges [Planet B]" | "✦ [Planeta A] meta iššūkį [Planetai B]" |
| Tightest aspect is sextile | "✦ [Planet A] supports [Planet B]" | "✦ [Planeta A] palaiko [Planetą B]" |

**Priority 4 — Absolute fallback:**

| English | Lithuanian |
|---------|------------|
| "✦ The cosmos speaks" | "✦ Kosmosas kalba" |

### Animation

- Fade in with the mother shape after entrance animation (800ms delay after crystal appears)
- Opacity breathes gently: `0.3 + 0.08 * Math.sin(time * 0.6)` — matching the mother shape rhythm
- When the label text changes (day navigation), crossfade: current text fades to 0 over 400ms, new text fades in from 0 over 400ms
- During Cosmic Reading: fade to `opacity: 0.15` (same dimming as mother shape)
- During Heliocentric View: hidden (same as mother shape)

### Label Updates

The label text should recalculate when:
- Day changes (Yesterday/Tomorrow navigation)
- Language switches (EN ↔ LT)
- App first loads

Use `useMemo` with dependencies on `astroData`, `language`, and `dayOffset`.

### Lithuanian Grammar Note

Lithuanian planet and sign names need correct grammatical cases depending on the sentence structure. Use the existing `PLANET_DECLENSIONS_LT` from the Cosmic Reading content templates if available. If exact declensions are complex, use the base nominative form — grammatical perfection is secondary to having the feature work.

---

## PART B: KPI CARD EXPLANATIONS IN COSMIC PULSE MODAL

### Concept

Each KPI card in the Cosmic Pulse modal currently shows data but doesn't explain what it means. Add a clear, friendly explanation beneath each card's visual that tells the user WHY this matters and WHAT it means for them.

### Implementation

Under each KPI card's visual/data section, add an explanation paragraph:

```css
font-family: var(--font-body)  /* DM Sans */
font-size: 12px
line-height: 1.6
color: rgba(255, 255, 255, 0.4)  /* subtle — there for those who want it */
margin-top: 8px
padding-top: 8px
border-top: 1px solid rgba(255, 255, 255, 0.04)  /* faint separator */
```

The explanations should be warm, clear, and practitioner-oriented — not academic astrology jargon.

### Explanations Per KPI Card

#### KPI 1: Element Balance (Donut Chart)

**English:**
"The four elements — Fire, Earth, Air, and Water — represent fundamental energies flowing through today's sky. When one element dominates, its qualities colour the day's experience. Fire brings action and courage. Earth brings stability and form. Air brings communication and ideas. Water brings intuition and emotional depth. The balance shifts daily as planets move through the zodiac."

**Lithuanian:**
"Keturi elementai — Ugnis, Žemė, Oras ir Vanduo — atspindi pagrindines energijas, tekančias per šiandienos dangų. Kai vienas elementas dominuoja, jo savybės nuspalvina dienos patirtį. Ugnis neša veiksmą ir drąsą. Žemė neša stabilumą ir formą. Oras neša bendravimą ir idėjas. Vanduo neša intuiciją ir emocinę gelmę. Balansas keičiasi kasdien planetoms judant per zodiaką."

#### KPI 2: Key Player (Planet Card)

**English:**
"Each day, one celestial body speaks loudest. This planet is making the most significant move right now — whether entering a new sign, forming an exact aspect, or stationing retrograde. Pay attention to the life areas this planet governs. Its frequency can be used in sound healing sessions for deeper alignment."

**Lithuanian:**
"Kiekvieną dieną vienas dangaus kūnas kalba garsiausiai. Ši planeta šiuo metu atlieka reikšmingiausią judesį — nesvarbu, ar įeina į naują ženklą, formuoja tikslų aspektą, ar stoja retrogradinėje. Atkreipkite dėmesį į gyvenimo sritis, kurias ši planeta valdo. Jos dažnį galima naudoti garso gydymo sesijose gilesniam suderinimui."

#### KPI 3: Cosmic Intensity (Gauge)

**English:**
"This score reflects how active the sky is today. More planetary aspects, tighter orbs, retrogrades, and significant lunar phases increase the intensity. High intensity days are potent for deep work but can feel overwhelming. Low intensity days offer spaciousness and calm. Sound healing sessions during high intensity can help channel the energy constructively."

**Lithuanian:**
"Šis rodiklis atspindi, kiek aktyvus dangus šiandien. Daugiau planetų aspektų, mažesni orbai, retrogradai ir reikšmingos Mėnulio fazės didina intensyvumą. Didelio intensyvumo dienos yra galingos giliam darbui, bet gali jaustis slegiantys. Mažo intensyvumo dienos suteikia erdvumo ir ramybės. Garso gydymo sesijos didelio intensyvumo metu padeda konstruktyviai nukreipti energiją."

#### KPI 4: Kp Index (Geomagnetic Bar)

**English:**
"The Kp Index measures Earth's geomagnetic field activity, driven by solar wind. Higher values mean stronger geomagnetic storms. Many practitioners and sensitive individuals report feeling changes in mood, sleep quality, and energy levels during geomagnetic disturbances. Values 0-3 are quiet — ideal for sensitive healing work. Values 4+ indicate active conditions — grounding practices are recommended."

**Lithuanian:**
"Kp indeksas matuoja Žemės geomagnetinio lauko aktyvumą, kurį sukelia saulės vėjas. Didesnės reikšmės reiškia stipresnes geomagnetines audras. Daugelis praktikų ir jautrių žmonių praneša apie nuotaikos, miego kokybės ir energijos lygio pokyčius geomagnetinių trikdžių metu. Reikšmės 0-3 yra ramios — idealios jautriam gydymo darbui. Reikšmės 4+ rodo aktyvias sąlygas — rekomenduojamos įžeminimo praktikos."

#### KPI 5: Schumann Resonance

**English:**
"The Schumann Resonance is Earth's electromagnetic heartbeat — a standing wave between the planet's surface and ionosphere at 7.83 Hz. This frequency falls within the alpha-theta brainwave boundary, associated with deep relaxation and meditation. Its harmonics (14.3, 20.8, 27.3, 33.8 Hz) map across the brainwave spectrum. Sound healers often tune instruments and sessions to align with these Earth frequencies."

**Lithuanian:**
"Šumano rezonansas yra Žemės elektromagnetinis širdies ritmas — stovinčioji banga tarp planetos paviršiaus ir jonosferos, 7.83 Hz dažniu. Šis dažnis patenka į alfa-teta smegenų bangų ribą, susijusią su giliu atsipalaidavimu ir meditacija. Jo harmonikos (14.3, 20.8, 27.3, 33.8 Hz) apima visą smegenų bangų spektrą. Garso gydytojai dažnai derina instrumentus ir sesijas pagal šiuos Žemės dažnius."

#### KPI 6: Solar Activity

**English:**
"Solar weather directly influences Earth's magnetic field and upper atmosphere. Solar wind speed indicates how fast charged particles reach Earth. Solar flare class (A through X) shows the Sun's electromagnetic output — M and X class flares can affect sensitive electronics and human wellbeing. The Bz component of the interplanetary magnetic field determines whether solar energy couples into Earth's magnetosphere — negative (southward) Bz opens the door to geomagnetic storms."

**Lithuanian:**
"Saulės orai tiesiogiai veikia Žemės magnetinį lauką ir viršutinę atmosferą. Saulės vėjo greitis rodo, kaip greitai įkrautos dalelės pasiekia Žemę. Saulės žybsnio klasė (nuo A iki X) rodo Saulės elektromagnetinę emisiją — M ir X klasės žybsniai gali paveikti jautrią elektroniką ir žmonių savijautą. Tarpplanetinio magnetinio lauko Bz komponentas nulemia, ar saulės energija patenka į Žemės magnetosferą — neigiamas (pietų kryptimi) Bz atveria kelią geomagnetinėms audroms."

#### KPI 7: Planetary Aspects

**English:**
"Aspects are angular relationships between planets — they describe how planetary energies interact. A conjunction (0°) merges two forces. A sextile (60°) creates opportunity. A square (90°) generates creative tension. A trine (120°) flows harmoniously. An opposition (180°) creates awareness through polarity. Tighter orbs (closer to exact angle) mean stronger influence. These interactions shape the day's energetic landscape."

**Lithuanian:**
"Aspektai yra kampiniai ryšiai tarp planetų — jie aprašo, kaip planetų energijos sąveikauja. Konjunkcija (0°) sujungia dvi jėgas. Sekstilis (60°) sukuria galimybę. Kvadratūra (90°) generuoja kūrybinę įtampą. Trinas (120°) teka harmoningai. Opozicija (180°) kuria suvokimą per poliarumą. Mažesni orbai (arčiau tikslaus kampo) reiškia stipresnę įtaką. Šios sąveikos formuoja dienos energetinį kraštovaizdį."

---

### Collapsible Explanations (Optional Enhancement)

If the explanations make the modal feel too long, make them collapsible:
- Show a small "What does this mean?" / "Ką tai reiškia?" link under each KPI
- Tapping it smoothly expands the explanation text (use framer-motion `AnimatePresence` / `motion.div` with height animation)
- Tapping again collapses it
- Default state: collapsed (keeps the modal clean, explanation is there for those who want it)
- Store no preference — always start collapsed

If collapsible adds too much complexity, just show the text always visible at reduced opacity. Either approach works.

---

## i18n

Add ALL new label text, explanations, and condition strings to both `en.json` and `lt.json`. Every user-facing string must be translatable via `useTranslation`.

---

## Build Steps

1. Read the existing CrystallineCore component to understand where to add the Html label
2. Read the existing Cosmic Pulse modal (CrystalMessage.tsx) to understand the KPI card structure
3. Create the dynamic label text generator function with the priority system
4. Add `<Html>` label above the mother shape with breathing opacity animation
5. Add crossfade animation when label text changes
6. Add explanatory text section to each of the 7 KPI cards in the modal
7. Implement collapsible "What does this mean?" toggle (or always-visible at lower opacity)
8. Add all i18n keys for labels and explanations to en.json and lt.json
9. Test: label appears above mother shape with correct text for today
10. Test: label changes when navigating days
11. Test: label switches language when toggling EN/LT
12. Test: label dims during Cosmic Reading
13. Test: label hidden during Heliocentric View
14. Test: each KPI card has explanation text visible
15. Test: explanations display in Lithuanian when language switched
16. Test: modal still scrolls smoothly with added content
17. Test: mobile 375px — label readable, modal not overflowing
18. Test: ALL other features still work
19. Run `npm run build` — no errors
20. **UPDATE `engine/ARCHITECTURE.md`** — document the floating label system (priority conditions, animation) and KPI explanation text
21. Commit: `feat: floating cosmic label above mother shape + KPI card explanations`
22. Push to **main** branch using `git push origin master:main`
