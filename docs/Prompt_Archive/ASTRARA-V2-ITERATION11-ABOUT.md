# ASTRARA v2 — Iteration 11: About & Info Modal

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Vision

An info button (ℹ️) in the header opens a beautifully designed About modal that explains how Astrara works — planetary calculations, sound frequencies, Earth data — in friendly, non-technical language that builds trust without overwhelming. Ends with an FAQ section addressing the questions practitioners and curious users ask most.

---

## Info Button — Header Placement

Add a small info icon to the header. Place it on the left side near the app name, or next to the sound toggle — wherever feels balanced:

```
┌──────────────────────────────────────────────┐
│  ASTRARA  ℹ️        📍Durham   🔈   🇬🇧 EN ▾  │
└──────────────────────────────────────────────┘
           ↑
      tap to open About
```

```tsx
<button
  type="button"
  onClick={() => setShowAbout(true)}
  className="text-white/30 hover:text-white/60 transition-colors select-none text-sm"
  aria-label="About Astrara"
>
  ℹ️
</button>
```

---

## About Modal — Bottom Sheet

Same bottom sheet pattern as zodiac/planet/earth panels. Scrollable, glassmorphism, slide-up animation.

### Content Structure

The content below is the FULL text to include in both English and Lithuanian. Implement it directly — do not abbreviate or summarise.

---

### ENGLISH CONTENT

```
SECTION: HEADER

Title: About Astrara
Subtitle: How it all works

---

SECTION: INTRO

Astrara shows you the sky as it actually is right now — where every planet sits, what signs they're moving through, and what that might mean for you today.

Nothing here is random or made up. Every planetary position is calculated to the arc-minute using the same astronomical algorithms NASA uses for space missions. The insights are drawn from centuries of astrological tradition. The sound frequencies come from real physics.

Here's how it all comes together.

---

SECTION: THE WHEEL
Icon: ✦ (or small wheel illustration)
Heading: The Astro Wheel

The wheel at the centre of Astrara is a live map of the solar system as seen from Earth. You are standing at the centre — the small blue Earth — and everything around you is positioned exactly where it appears in the sky right now.

The twelve zodiac signs mark the sections of the sky. The planets are placed at their real astronomical positions. As you swipe between days, the planets move to where they actually were or will be.

All positions are calculated locally on your device using an open-source astronomical library called astronomy-engine, which is accurate to within a fraction of a degree and verified against NASA JPL data. No internet connection is needed for the calculations — your phone does the maths.

---

SECTION: THE INSIGHTS
Icon: ☽
Heading: Planetary Insights

When you tap a planet or zodiac sign, you see an insight about what that placement means. These interpretations are based on traditional astrological meanings that have been developed and refined over thousands of years.

Each planet represents a different aspect of human experience — the Sun is your core identity, the Moon your emotions, Mercury your communication, Venus your relationships, Mars your drive, and so on. The zodiac sign a planet sits in colours how that energy expresses itself.

The insights are written to be genuinely useful, not vague. We aim for the kind of wisdom you might hear from a thoughtful astrologer rather than a fortune cookie.

---

SECTION: THE SOUND
Icon: 🔊
Heading: Cosmic Soundscape

When you tap the sound icon, Astrara generates a live ambient soundscape tuned to today's planetary configuration. This is not pre-recorded music — it's created in real time by your device.

The drone frequency is based on the zodiac sign the Moon currently occupies, using the solfeggio frequency scale — an ancient tuning system that maps specific frequencies to specific qualities of experience. For example, when the Moon is in Pisces, the drone is tuned to 852 Hz (intuition and inner vision).

The binaural beats layer creates a gentle pulsing effect best heard through headphones. Two slightly different frequencies are played in each ear — your brain perceives the difference as a rhythmic pulse that can help guide your brainwaves into specific states. The beat frequency changes based on the elemental energy of the day: water signs encourage Theta waves (meditation), fire signs encourage Beta waves (alertness), and so on.

When you tap a planet on the wheel, you hear its unique tone. These frequencies are based on the work of Swiss mathematician Hans Cousto, who calculated the audible octave equivalents of planetary orbital periods. Each planet has a real, measurable frequency derived from its orbit around the Sun — transposed up many octaves into the range human ears can hear.

---

SECTION: EARTH PULSE
Icon: 🌍
Heading: Earth Intelligence

Tapping the Earth at the centre of the wheel shows you live data about our planet's electromagnetic environment, pulled directly from NOAA (the US National Oceanic and Atmospheric Administration) satellites.

The Kp Index measures how disturbed Earth's magnetic field is on a scale of 0 to 9. Research has shown that geomagnetic activity can affect human sleep, mood, blood pressure, and even heart rate variability. Sound healing practitioners often find that sessions feel different during magnetically active periods.

The solar wind data shows the speed and density of charged particles streaming from the Sun. When the solar wind hits Earth's magnetosphere, it can amplify geomagnetic activity — which is why we track both.

The Schumann Resonance (7.83 Hz) is the electromagnetic frequency of the cavity between the Earth's surface and the ionosphere. It sits exactly at the boundary between Theta and Alpha brainwaves, and many practitioners consider it the Earth's natural heartbeat.

---

SECTION: FAQ
Heading: Questions & Answers

Q: Is this real astronomy or just astrology?
A: Both. The planetary positions are calculated using the same precise astronomical data that scientists use. The interpretations of what those positions mean draw from the astrological tradition — which you're free to take as literally or metaphorically as you like.

Q: How accurate are the planet positions?
A: Extremely accurate. The astronomy-engine library we use is verified against NASA's Jet Propulsion Laboratory data and is accurate to within fractions of a degree. These are the same algorithms used to navigate spacecraft.

Q: Do I need headphones for the sound?
A: The drone and planet tones work through speakers, but the binaural beats effect only works with headphones. When two slightly different frequencies are played in separate ears, your brain creates the beat — this can't happen through speakers where both ears hear everything.

Q: What are solfeggio frequencies?
A: The solfeggio frequencies (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) are a set of tones that many sound healing traditions associate with specific physical and emotional qualities. While scientific evidence for their specific healing properties is still emerging, they provide a meaningful and intentional framework for tuning the soundscape to the current cosmic energy.

Q: Where does the Earth data come from?
A: Directly from NOAA's Space Weather Prediction Center — the same data that power companies and airlines use to prepare for geomagnetic storms. It's updated every few minutes from satellites monitoring the Sun and Earth's magnetic field.

Q: Does this app track me or collect my data?
A: No. Astrara doesn't collect personal data. Your location is used only to show local time and is never sent to any server. If you enter birth details, they're stored on your device only. We use Plausible Analytics, which is privacy-focused and doesn't use cookies.

Q: Who made this?
A: Astrara is part of the Harmonic Waves ecosystem — a suite of free tools built for sound healing practitioners and anyone curious about the relationship between cosmic rhythms and human experience. Learn more at harmonicwaves.app.

---

SECTION: FOOTER

Links (as tappable buttons):
→ harmonicwaves.app — Explore the full ecosystem
→ shumann.app — Earth Pulse deep dive
→ binara.app — Dedicated binaural beats

Version: v2.0
```

---

### LITHUANIAN CONTENT

```
SECTION: HEADER

Title: Apie Astrara
Subtitle: Kaip viskas veikia

---

SECTION: INTRO

Astrara rodo dangų tokį, koks jis yra šiuo metu — kur yra kiekviena planeta, per kokius ženklus jos keliauja ir ką tai gali reikšti jums šiandien.

Čia niekas nėra atsitiktina ar sugalvota. Kiekviena planetos padėtis apskaičiuojama iki lanko minutės tikslumu, naudojant tuos pačius astronominius algoritmus, kuriuos NASA naudoja kosmoso misijoms. Įžvalgos remiasi šimtmečiais astrologinės tradicijos. Garso dažniai kyla iš tikros fizikos.

Štai kaip viskas susideda.

---

SECTION: THE WHEEL
Heading: Astro Ratas

Ratas Astrara centre yra gyvas Saulės sistemos žemėlapis, matomas nuo Žemės. Jūs stovite centre — mažoji mėlyna Žemė — o viskas aplink jus yra tiksliai ten, kur dabar matosi danguje.

Dvylika zodiako ženklų žymi dangaus sektorius. Planetos yra savo tikrose astronominėse padėtyse. Slinkdami tarp dienų, matote, kaip planetos juda ten, kur jos tikrai buvo ar bus.

Visos padėtys skaičiuojamos vietoje, jūsų įrenginyje, naudojant atvirojo kodo astronominę biblioteką astronomy-engine, kuri yra tikslinga iki laipsnio dalies ir patikrinta pagal NASA JPL duomenis. Skaičiavimams interneto ryšys nereikalingas — jūsų telefonas atlieka matematiką.

---

SECTION: THE INSIGHTS
Heading: Planetinės Įžvalgos

Palietus planetą ar zodiako ženklą, matote įžvalgą apie tai, ką ta padėtis reiškia. Šios interpretacijos remiasi tradicinėmis astrologinėmis reikšmėmis, kurios buvo plėtojamos ir tobulinamos tūkstančius metų.

Kiekviena planeta atspindi skirtingą žmogiškos patirties aspektą — Saulė yra jūsų esminė tapatybė, Mėnulis — emocijos, Merkurijus — bendravimas, Venera — santykiai, Marsas — varomoji jėga ir t.t. Zodiako ženklas, kuriame yra planeta, nuspalvina tai, kaip ta energija reiškiasi.

Įžvalgos parašytos taip, kad būtų tikrai naudingos, ne miglotos. Siekiame tokios išminties, kokią galėtumėte išgirsti iš mąslaus astrologo, o ne iš sausainio su pranašyste.

---

SECTION: THE SOUND
Heading: Kosminis Garsovaizdis

Palietus garso piktogramą, Astrara generuoja gyvą aplinkos garsovaizdį, suderintą su šiandienos planetine konfigūracija. Tai nėra iš anksto įrašyta muzika — tai sukuriama realiu laiku jūsų įrenginio.

Drono dažnis paremtas zodiako ženklu, kuriame šiuo metu yra Mėnulis, naudojant solfedžio dažnių skalę — senovinę derinimo sistemą, susiejančią konkrečius dažnius su konkrečiomis patirties kokybėmis. Pavyzdžiui, kai Mėnulis yra Žuvyse, dronas suderintas 852 Hz dažniu (intuicija ir vidinė regėjimas).

Binaurinių ritmų sluoksnis sukuria švelnų pulsavimo efektą, geriausiai girdimą per ausines. Du šiek tiek skirtingi dažniai grojami kiekvienoje ausyje — jūsų smegenys suvokia skirtumą kaip ritmingą pulsą, kuris gali padėti nukreipti smegenų bangas į konkrečias būsenas. Ritmo dažnis keičiasi pagal dienos elementinę energiją: vandens ženklai skatina Theta bangas (meditacija), ugnies ženklai — Beta bangas (budrumas) ir t.t.

Palietus planetą rate, girdite jos unikalų toną. Šie dažniai paremti Šveicarijos matematiko Hanso Cousto darbu, kuris apskaičiavo planetų orbitos periodų girdimuosius oktavinius atitikmenis. Kiekviena planeta turi realų, išmatuojamą dažnį, kilusį iš jos orbitos aplink Saulę — perkeltą daugeliu oktavų aukštyn į žmogaus ausiai girdimą diapazoną.

---

SECTION: EARTH PULSE
Heading: Žemės Išmintis

Palietus Žemę rato centre, matote gyvus duomenis apie mūsų planetos elektromagnetinę aplinką, tiesiogiai iš NOAA (JAV Nacionalinės vandenynų ir atmosferos administracijos) palydovų.

Kp indeksas matuoja, kiek yra sutrikdytas Žemės magnetinis laukas skalėje nuo 0 iki 9. Tyrimai parodė, kad geomagnetinis aktyvumas gali paveikti žmogaus miegą, nuotaiką, kraujospūdį ir net širdies ritmo kintamumą. Garso terapijos praktikai dažnai pastebi, kad seansai jaučiasi kitaip magnetiškai aktyviais periodais.

Saulės vėjo duomenys rodo įkrautų dalelių srauto nuo Saulės greitį ir tankį. Kai saulės vėjas atsitrenkia į Žemės magnetosferą, jis gali sustiprinti geomagnetinį aktyvumą — todėl stebime abu.

Šumano rezonansas (7,83 Hz) yra elektromagnetinis dažnis tarp Žemės paviršiaus ir jonosferos. Jis yra tiksliai ties riba tarp Theta ir Alpha smegenų bangų, ir daugelis praktikų laiko jį natūraliu Žemės širdies plakimu.

---

SECTION: FAQ
Heading: Klausimai ir Atsakymai

Q: Ar tai tikra astronomija, ar tik astrologija?
A: Abu. Planetų padėtys apskaičiuojamos naudojant tuos pačius tikslius astronominius duomenis, kuriuos naudoja mokslininkai. Interpretacijos, ką tos padėtys reiškia, kyla iš astrologinės tradicijos — kurią galite priimti taip pažodžiui ar metaforiškai, kaip norite.

Q: Kiek tikslios yra planetų padėtys?
A: Labai tikslios. Astronomy-engine biblioteka, kurią naudojame, patikrinta pagal NASA Reaktyvinės Propulsijos Laboratorijos duomenis ir yra tiksli iki laipsnio dalių. Tai tie patys algoritmai, naudojami navigacijai kosmose.

Q: Ar man reikia ausinių garsui?
A: Dronas ir planetų tonai veikia per garsiakalbius, bet binaurinių ritmų efektas veikia tik su ausinėmis. Kai du šiek tiek skirtingi dažniai grojami atskirose ausyse, jūsų smegenys sukuria ritmą — tai negali įvykti per garsiakalbius, kur abi ausys girdi viską.

Q: Kas yra solfedžio dažniai?
A: Solfedžio dažniai (174, 285, 396, 417, 528, 639, 741, 852, 963 Hz) yra tonų rinkinys, kurį daugelis garso terapijos tradicijų sieja su konkrečiomis fizinėmis ir emocinėmis savybėmis. Nors moksliniai jų specifinių gydomųjų savybių įrodymai vis dar formuojasi, jie suteikia prasmingą ir tyčinį pagrindą garsovaizdžio derinimui pagal esamą kosminę energiją.

Q: Iš kur gaunami Žemės duomenys?
A: Tiesiogiai iš NOAA Kosminio Oro Prognozių Centro — tuos pačius duomenis naudoja energetikos bendrovės ir aviakompanijos ruošdamosi geomagnetinėms audroms. Jie atnaujinami kas kelias minutes iš palydovų, stebinčių Saulę ir Žemės magnetinį lauką.

Q: Ar ši programėlė seka mane ar renka mano duomenis?
A: Ne. Astrara nerenka asmeninių duomenų. Jūsų vieta naudojama tik vietiniam laikui rodyti ir niekada nesiunčiama jokiam serveriui. Jei įvedate gimimo duomenis, jie saugomi tik jūsų įrenginyje. Naudojame Plausible Analytics, kuris orientuotas į privatumą ir nenaudoja slapukų.

Q: Kas tai sukūrė?
A: Astrara yra Harmonic Waves ekosistemos dalis — nemokamų įrankių rinkinys, sukurtas garso terapijos praktikams ir visiems, besidomintiems kosminių ritmų ir žmogiškos patirties ryšiu. Sužinokite daugiau harmonicwaves.app.

---

SECTION: FOOTER

Links:
→ harmonicwaves.app — Atrask visą ekosistemą
→ shumann.app — Žemės Pulsas giliau
→ binara.app — Binauriniai ritmai

Version: v2.0
```

---

## Modal Implementation

```tsx
export function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, lang } = useTranslation()
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto
                      bg-[#0D0D1A]/95 backdrop-blur-xl 
                      border border-white/10 
                      rounded-t-2xl sm:rounded-2xl 
                      p-6 pb-10
                      animate-slide-up
                      scrollbar-hide"
           style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        
        {/* Handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />
        
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 
                     transition-colors select-none text-lg"
        >✕</button>
        
        {/* Content rendered from i18n content files */}
        {/* Each section uses the same styling pattern: */}
        
        {/* Section heading */}
        {/* <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2 mt-8 flex items-center gap-2">
              <span>✦</span> <span>THE ASTRO WHEEL</span>
            </h3> */}
        
        {/* Section body */}
        {/* <p className="text-sm text-white/60 leading-relaxed mb-4">...</p> */}
        
        {/* FAQ uses alternating Q/A styling */}
        {/* Q: font-medium text-white/75 */}
        {/* A: text-white/50 italic mb-4 */}
        
        {/* Ecosystem links at bottom */}
        {/* Tappable cards linking to harmonicwaves.app, shumann.app, binara.app */}
      </div>
    </div>
  )
}
```

### Section Styling Guide

For the heading of each section:
```tsx
<h3 className="text-[10px] uppercase tracking-[0.2em] text-purple-300/50 mb-3 mt-8 
               flex items-center gap-2">
  <span>{sectionIcon}</span>
  <span>{sectionTitle}</span>
</h3>
```

For body text:
```tsx
<p className="text-[13px] text-white/55 leading-relaxed mb-3">
  {paragraphText}
</p>
```

For FAQ questions:
```tsx
<p className="text-[13px] text-white/75 font-medium mt-5 mb-1">
  {question}
</p>
<p className="text-[13px] text-white/45 leading-relaxed">
  {answer}
</p>
```

For ecosystem links at the bottom:
```tsx
<a
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-between px-4 py-3 rounded-xl
             bg-white/3 border border-white/6
             hover:bg-white/5 hover:border-white/10
             transition-all group"
>
  <span className="text-sm text-white/50 group-hover:text-white/70">{label}</span>
  <span className="text-white/20 group-hover:text-white/40 text-xs">→</span>
</a>
```

---

## Content Storage

Store the full About content in the i18n content system alongside the existing sign/planet meanings:

```
src/i18n/content/
├── en/
│   ├── sign-meanings.ts
│   ├── planet-meanings.ts
│   └── about.ts          ← NEW
└── lt/
    ├── sign-meanings.ts
    ├── planet-meanings.ts
    └── about.ts          ← NEW
```

Each `about.ts` exports the sections as structured data:

```typescript
export const aboutContent = {
  title: "About Astrara",
  subtitle: "How it all works",
  intro: "Astrara shows you the sky...",
  sections: [
    {
      icon: "✦",
      heading: "The Astro Wheel",
      paragraphs: [
        "The wheel at the centre of Astrara...",
        "All positions are calculated locally...",
      ],
    },
    // ... more sections
  ],
  faq: [
    {
      q: "Is this real astronomy or just astrology?",
      a: "Both. The planetary positions..."
    },
    // ... more Q&A pairs
  ],
  links: [
    { label: "Explore the full ecosystem", url: "https://harmonicwaves.app" },
    { label: "Earth Pulse deep dive", url: "https://shumann.app" },
    { label: "Dedicated binaural beats", url: "https://binara.app" },
  ],
}
```

---

## Build Steps

1. Read current header and modal components
2. Create `src/i18n/content/en/about.ts` with full English content as provided above
3. Create `src/i18n/content/lt/about.ts` with full Lithuanian content as provided above
4. Create `AboutModal` component with the glassmorphism bottom sheet design
5. Add ℹ️ button to header
6. Wire up: info tap → modal opens with correct language content
7. Ensure modal is scrollable on mobile with no content clipping
8. Ensure the backdrop tap and ✕ button both properly close the modal (no stuck dim state)
9. Test: open About → scroll through all sections → all content visible
10. Test: switch to Lithuanian → all content in Lithuanian
11. Test: tap ecosystem links → open in new tab
12. Test: close modal → no dim backdrop remaining
13. Run `npm run build`
14. Push to **main** branch
15. Commit: `feat: About modal with how-it-works explanation and FAQ`
