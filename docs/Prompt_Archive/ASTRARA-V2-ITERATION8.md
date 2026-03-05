# ASTRARA v2 — Iteration 8: Clickable Zodiac Signs + Detail Panels

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

Zodiac sign badges on the astro wheel are currently not interactive. Users should be able to tap any zodiac sign to view detailed insights about that sign relevant to the current date and planetary configuration. Read all current source files before making changes.

---

## 1. Make Zodiac Signs Tappable on the Wheel

### Add Tap Targets

Each zodiac sign badge on the wheel needs an invisible tap target, identical to how planet tap targets work. Use the `<Html>` overlay approach:

```tsx
<Html center zIndexRange={[100, 0]} style={{ pointerEvents: 'auto' }}>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation()
      onSignTap(sign)
    }}
    className="flex items-center justify-center select-none cursor-pointer
               w-11 h-11 rounded-lg
               active:scale-90 transition-transform duration-150"
    style={{
      background: `${sign.colour}15`,
      border: `1px solid ${sign.colour}30`,
      backdropFilter: 'blur(4px)',
      fontSize: '18px',
      color: sign.colour,
      textShadow: `0 0 12px ${sign.colour}60`,
      fontFamily: 'serif',
    }}
    aria-label={`View ${sign.name} details`}
  >
    {sign.glyph}
  </button>
</Html>
```

Key points:
- `pointerEvents: 'auto'` so taps register through the Three.js canvas
- `active:scale-90` gives instant visual feedback on tap
- `e.stopPropagation()` prevents the tap from triggering OrbitControls drag
- Tap area is 44×44px minimum for comfortable mobile tapping

### Visual Feedback on Tap

When a zodiac sign is tapped:
1. The badge briefly pulses brighter (border and glow intensify for 300ms)
2. Any planets currently IN that sign get highlighted (their glow increases)
3. The detail panel slides up

---

## 2. Zodiac Sign Detail Panel — Bottom Sheet

When a zodiac sign is tapped, a bottom sheet slides up containing rich, detailed information about that sign in the context of TODAY's planetary configuration.

### Panel Structure

```
┌─────────────────────────────────────────┐
│  ─── (drag handle)                   ✕  │
│                                         │
│       ♓ PISCES                          │
│       Water · Mutable                   │
│       Feb 19 – Mar 20                   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHAT PISCES ENERGY FEELS LIKE          │
│                                         │
│  "Pisces dissolves boundaries between   │
│   the real and the imagined. When       │
│   planets move through this sign,       │
│   intuition sharpens, empathy deepens,  │
│   and the world feels more like a       │
│   dream than a spreadsheet."            │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PLANETS IN PISCES RIGHT NOW            │
│                                         │
│  ☉ Sun at 14°                           │
│  "Dreams hold more truth than usual."   │
│                                         │
│  ☿ Mercury at 4°                        │
│  "Thoughts swim rather than march."     │
│                                         │
│  ♂ Mars at 23°                          │
│  "Action flows from feeling, not logic."│
│                                         │
│  (if no planets: "No planets are        │
│   visiting Pisces right now. Its        │
│   energy rests quietly in the           │
│   background.")                         │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PISCES IN YOUR LIFE                    │
│                                         │
│  Element: Water — emotion, intuition,   │
│           flow, the subconscious        │
│                                         │
│  Modality: Mutable — adaptable,         │
│            flexible, transitional       │
│                                         │
│  Ruling Planet: Neptune ♆               │
│                                         │
│  Body Area: Feet, lymphatic system      │
│                                         │
│  Themes: Compassion, imagination,       │
│          surrender, spirituality,       │
│          healing, transcendence         │
│                                         │
│  Shadow: Escapism, confusion,           │
│          over-sensitivity, martyrdom    │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  SOUND HEALING CONNECTION               │
│                                         │
│  Frequency: 852 Hz (intuition,          │
│             third eye activation)       │
│  Instruments: Crystal singing bowls,    │
│               ocean drum, rain stick    │
│  Keynote: B (connecting to crown        │
│           and third eye)                │
│                                         │
└─────────────────────────────────────────┘
```

### Implementation

Reuse the same bottom sheet / modal pattern used for planet detail panels. If a shared `DetailPanel` component exists, extend it. If not, create one:

```tsx
interface ZodiacDetailProps {
  sign: ZodiacSign
  planetsInSign: PlanetPosition[]  // filtered from current planetary data
  onClose: () => void
  isOpen: boolean
}

export function ZodiacDetailPanel({ sign, planetsInSign, onClose, isOpen }: ZodiacDetailProps) {
  const { t, lang } = useTranslation()
  const signContent = useSignContent(sign.key, lang) // loads from i18n content files
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative z-10 w-full max-w-md mx-auto max-h-[85vh] overflow-y-auto
                      bg-[#0D0D1A]/95 backdrop-blur-xl 
                      border border-white/10 
                      rounded-t-2xl sm:rounded-2xl 
                      p-6 pb-8
                      animate-slide-up
                      scrollbar-hide">
        
        {/* Drag handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 
                     transition-colors select-none text-lg"
        >✕</button>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2" style={{ color: sign.colour }}>
            {sign.glyph}
          </div>
          <h2 className="text-xl font-serif text-white/90 tracking-wide">
            {t(`zodiac.${sign.key}`).toUpperCase()}
          </h2>
          <p className="text-xs text-white/40 mt-1">
            {t(`element.${sign.element}`)} · {t(`modality.${sign.modality}`)}
          </p>
          <p className="text-xs text-white/30 mt-0.5">
            {sign.dateRange}
          </p>
        </div>
        
        <div className="w-full h-px bg-white/8 mb-5" />
        
        {/* What this energy feels like */}
        <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
          {t('sign.whatItFeelsLike')}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed font-serif italic mb-6">
          "{signContent.energyDescription}"
        </p>
        
        <div className="w-full h-px bg-white/8 mb-5" />
        
        {/* Planets currently in this sign */}
        <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
          {t('sign.planetsHere')}
        </h3>
        {planetsInSign.length > 0 ? (
          <div className="space-y-3 mb-6">
            {planetsInSign.map(planet => (
              <div key={planet.name} className="flex items-start gap-3">
                <span className="text-lg" style={{ color: planet.colour }}>
                  {planet.glyph}
                </span>
                <div>
                  <p className="text-sm text-white/80">
                    {t(`planet.${planet.name.toLowerCase()}`)} at {planet.degreeInSign}°
                  </p>
                  <p className="text-xs text-white/50 italic mt-0.5">
                    "{planet.oneLiner}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/40 italic mb-6">
            {signContent.noPlanetsMessage}
          </p>
        )}
        
        <div className="w-full h-px bg-white/8 mb-5" />
        
        {/* Sign details */}
        <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
          {t('sign.details') || 'About This Sign'}
        </h3>
        <div className="space-y-2.5 text-sm text-white/60 mb-6">
          <div className="flex justify-between">
            <span className="text-white/35">{t('sign.element')}</span>
            <span>{t(`element.${sign.element}`)} — {signContent.elementDescription}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/35">{t('sign.modality')}</span>
            <span>{t(`modality.${sign.modality}`)} — {signContent.modalityDescription}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/35">{t('sign.rulingPlanet') || 'Ruling Planet'}</span>
            <span>{signContent.rulingPlanet}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/35">{t('sign.bodyArea') || 'Body Area'}</span>
            <span>{signContent.bodyArea}</span>
          </div>
          <div>
            <span className="text-white/35 block mb-1">{t('sign.themes') || 'Themes'}</span>
            <span>{signContent.themes}</span>
          </div>
          <div>
            <span className="text-white/35 block mb-1">{t('sign.shadow') || 'Shadow Side'}</span>
            <span>{signContent.shadow}</span>
          </div>
        </div>
        
        <div className="w-full h-px bg-white/8 mb-5" />
        
        {/* Sound healing connection */}
        <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
          {t('sign.soundHealing') || 'Sound Healing Connection'}
        </h3>
        <div className="space-y-2.5 text-sm text-white/60">
          <div className="flex justify-between">
            <span className="text-white/35">{t('sign.frequency') || 'Frequency'}</span>
            <span>{signContent.frequency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/35">{t('sign.instruments') || 'Instruments'}</span>
            <span>{signContent.instruments}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/35">{t('sign.keynote') || 'Keynote'}</span>
            <span>{signContent.keynote}</span>
          </div>
        </div>
        
      </div>
    </div>
  )
}
```

---

## 3. Sign Content Data — Full 12-Sign Dataset

Create (or update) the sign meanings data file with complete content for all 12 signs in BOTH English and Lithuanian. Every sign must have all fields populated.

### Data Structure

```typescript
// src/i18n/content/en/sign-meanings.ts

export interface SignContent {
  energyDescription: string        // 2-3 sentence poetic description
  noPlanetsMessage: string         // what to show when no planets visit
  elementDescription: string       // short element meaning
  modalityDescription: string      // short modality meaning
  rulingPlanet: string             // e.g. "Neptune ♆"
  bodyArea: string                 // e.g. "Feet, lymphatic system"
  themes: string                   // comma-separated key themes
  shadow: string                   // comma-separated shadow qualities
  frequency: string                // e.g. "852 Hz (intuition)"
  instruments: string              // e.g. "Crystal bowls, ocean drum"
  keynote: string                  // e.g. "B"
  dateRange: string                // e.g. "Feb 19 – Mar 20"
}

export const signMeanings: Record<string, SignContent> = {
  aries: {
    energyDescription: "Aries ignites the sky like a struck match. When planets pass through here, the world quickens — courage rises, patience thins, and new beginnings demand to be born. This is the energy of the first breath, the first step, the spark before the fire.",
    noPlanetsMessage: "No planets are charging through Aries right now. The ram rests — but its fire is never truly out.",
    elementDescription: "passion, courage, action",
    modalityDescription: "initiating, pioneering, starting",
    rulingPlanet: "Mars ♂",
    bodyArea: "Head, face, adrenal glands",
    themes: "Courage, independence, initiative, leadership, new beginnings, raw energy",
    shadow: "Impatience, aggression, recklessness, selfishness",
    frequency: "396 Hz (liberation, releasing fear)",
    instruments: "Drums, didgeridoo, Tibetan bowls",
    keynote: "C",
    dateRange: "Mar 21 – Apr 19",
  },
  taurus: {
    energyDescription: "Taurus slows the cosmos to a gentle pulse. Planets here move through honey — everything becomes about what you can touch, taste, and hold. This is the energy of the garden, the long meal, the hand resting on warm earth.",
    noPlanetsMessage: "No planets graze in Taurus today. The bull stands still, grounded and patient.",
    elementDescription: "stability, sensuality, material world",
    modalityDescription: "sustaining, building, persisting",
    rulingPlanet: "Venus ♀",
    bodyArea: "Throat, neck, vocal cords",
    themes: "Security, pleasure, patience, beauty, abundance, groundedness",
    shadow: "Stubbornness, possessiveness, resistance to change, overindulgence",
    frequency: "417 Hz (facilitating change)",
    instruments: "Monochord, singing bowls, tuning forks",
    keynote: "C#/Db",
    dateRange: "Apr 20 – May 20",
  },
  gemini: {
    energyDescription: "Gemini electrifies the air with questions. Planets here scatter into a thousand conversations — curiosity multiplies, ideas cross-pollinate, and the mind refuses to sit still. This is the energy of the open book, the crossroads, the delicious rumour.",
    noPlanetsMessage: "No planets flutter through Gemini today. The twins rest their voices — briefly.",
    elementDescription: "intellect, communication, connection",
    modalityDescription: "adaptable, versatile, transitional",
    rulingPlanet: "Mercury ☿",
    bodyArea: "Hands, arms, lungs, nervous system",
    themes: "Communication, curiosity, duality, learning, wit, social connection",
    shadow: "Restlessness, superficiality, inconsistency, gossip",
    frequency: "528 Hz (transformation, DNA repair)",
    instruments: "Chimes, bells, flute, kalimba",
    keynote: "D",
    dateRange: "May 21 – Jun 20",
  },
  cancer: {
    energyDescription: "Cancer draws the cosmos inward. Planets here turn toward home, toward memory, toward the ache of what we love. This is the energy of the full kitchen, the old photograph, the lullaby you never forgot.",
    noPlanetsMessage: "No planets shelter in Cancer right now. The crab guards an empty shore — but the tide will return.",
    elementDescription: "emotion, intuition, nurturing",
    modalityDescription: "initiating, protecting, creating safety",
    rulingPlanet: "Moon ☽",
    bodyArea: "Chest, stomach, womb",
    themes: "Home, family, emotional security, nurturing, memory, belonging",
    shadow: "Clinginess, moodiness, over-protection, manipulation through guilt",
    frequency: "639 Hz (connection, relationships)",
    instruments: "Ocean drum, rain stick, crystal bowls, harp",
    keynote: "D#/Eb",
    dateRange: "Jun 21 – Jul 22",
  },
  leo: {
    energyDescription: "Leo floods the sky with gold. Planets here demand to be seen — creativity roars, hearts open wider, and the world becomes a stage. This is the energy of the standing ovation, the love letter signed with your whole name.",
    noPlanetsMessage: "No planets bask in Leo's light right now. The lion sleeps — but even sleeping, it commands the room.",
    elementDescription: "passion, creativity, self-expression",
    modalityDescription: "sustaining, intensifying, committing",
    rulingPlanet: "Sun ☉",
    bodyArea: "Heart, spine, upper back",
    themes: "Creativity, leadership, generosity, romance, self-expression, courage",
    shadow: "Pride, drama, need for validation, domination",
    frequency: "741 Hz (expression, solutions)",
    instruments: "Gong, djembe, singing, brass bowls",
    keynote: "E",
    dateRange: "Jul 23 – Aug 22",
  },
  virgo: {
    energyDescription: "Virgo sharpens the cosmos to a fine point. Planets here become meticulous — the details matter, the body speaks, and what was messy asks to be made whole. This is the energy of the healer's hands, the morning routine, the garden tended with love.",
    noPlanetsMessage: "No planets refine themselves in Virgo today. The maiden rests — the work will wait.",
    elementDescription: "practicality, analysis, service",
    modalityDescription: "adaptable, discerning, refining",
    rulingPlanet: "Mercury ☿",
    bodyArea: "Digestive system, intestines",
    themes: "Health, service, precision, analysis, humility, craftsmanship",
    shadow: "Perfectionism, over-criticism, anxiety, excessive worry",
    frequency: "852 Hz (intuition, inner vision)",
    instruments: "Tuning forks, monochord, Tibetan bowls",
    keynote: "F",
    dateRange: "Aug 23 – Sep 22",
  },
  libra: {
    energyDescription: "Libra balances the sky on a knife's edge. Planets here seek beauty, fairness, and the other — relationships sharpen into focus, aesthetics matter more, and justice feels personal. This is the energy of the first date, the treaty, the perfectly composed photograph.",
    noPlanetsMessage: "No planets weigh in Libra today. The scales rest level — a rare and brief equilibrium.",
    elementDescription: "harmony, beauty, partnership",
    modalityDescription: "initiating, relating, balancing",
    rulingPlanet: "Venus ♀",
    bodyArea: "Kidneys, lower back, skin",
    themes: "Relationships, justice, beauty, diplomacy, harmony, partnership",
    shadow: "Indecisiveness, people-pleasing, avoidance of conflict, vanity",
    frequency: "639 Hz (connection, relationships)",
    instruments: "Crystal bowls, harp, wind chimes, handpan",
    keynote: "F#/Gb",
    dateRange: "Sep 23 – Oct 22",
  },
  scorpio: {
    energyDescription: "Scorpio pulls the cosmos underground. Planets here descend into truth — secrets surface, intensity builds, and transformation stops being optional. This is the energy of the confession, the chrysalis, the door you've been afraid to open.",
    noPlanetsMessage: "No planets dive into Scorpio today. The scorpion waits in the dark — patient, always patient.",
    elementDescription: "depth, transformation, power",
    modalityDescription: "sustaining, intensifying, penetrating",
    rulingPlanet: "Pluto ♇ (traditional: Mars ♂)",
    bodyArea: "Reproductive organs, elimination system",
    themes: "Transformation, power, intimacy, death/rebirth, truth, shadow work",
    shadow: "Jealousy, obsession, control, vengefulness, manipulation",
    frequency: "174 Hz (foundation, grounding pain)",
    instruments: "Gong, didgeridoo, low crystal bowls, drum",
    keynote: "G",
    dateRange: "Oct 23 – Nov 21",
  },
  sagittarius: {
    energyDescription: "Sagittarius flings the cosmos wide open. Planets here chase horizons — faith expands, restlessness grows, and the biggest questions demand attention. This is the energy of the departure gate, the philosophical debate at 3am, the arrow released without knowing where it lands.",
    noPlanetsMessage: "No planets roam through Sagittarius right now. The archer has set down the bow — but never for long.",
    elementDescription: "expansion, philosophy, adventure",
    modalityDescription: "adaptable, exploring, synthesising",
    rulingPlanet: "Jupiter ♃",
    bodyArea: "Hips, thighs, liver",
    themes: "Freedom, wisdom, travel, philosophy, optimism, higher learning",
    shadow: "Excess, carelessness, bluntness, restlessness, dogmatism",
    frequency: "963 Hz (divine connection, awakening)",
    instruments: "Didgeridoo, frame drum, large singing bowls, voice",
    keynote: "G#/Ab",
    dateRange: "Nov 22 – Dec 21",
  },
  capricorn: {
    energyDescription: "Capricorn builds the cosmos from stone. Planets here become serious — ambition crystallises, structures demand respect, and the long game is the only game. This is the energy of the mountain summit, the signed contract, the cathedral that took a century.",
    noPlanetsMessage: "No planets climb Capricorn's mountain today. The goat stands at the peak — surveying in silence.",
    elementDescription: "structure, discipline, mastery",
    modalityDescription: "initiating, building, establishing",
    rulingPlanet: "Saturn ♄",
    bodyArea: "Bones, knees, joints, teeth",
    themes: "Ambition, discipline, responsibility, legacy, mastery, structure",
    shadow: "Rigidity, coldness, workaholism, pessimism, excessive control",
    frequency: "285 Hz (healing tissue, restoring energy)",
    instruments: "Tibetan bowls, monochord, tuning forks, crystal bowls",
    keynote: "A",
    dateRange: "Dec 22 – Jan 19",
  },
  aquarius: {
    energyDescription: "Aquarius rewires the cosmos. Planets here break patterns — the future calls louder than the past, the collective matters more than the self, and ideas arrive like lightning. This is the energy of the invention, the revolution, the stranger who changes everything.",
    noPlanetsMessage: "No planets orbit Aquarius right now. The water-bearer pours into empty space — waiting for the world to catch up.",
    elementDescription: "innovation, community, vision",
    modalityDescription: "sustaining, revolutionising, fixing ideals",
    rulingPlanet: "Uranus ♅ (traditional: Saturn ♄)",
    bodyArea: "Ankles, circulation, nervous system",
    themes: "Innovation, humanitarianism, freedom, originality, community, future vision",
    shadow: "Detachment, rebelliousness, aloofness, extremism, emotional avoidance",
    frequency: "963 Hz (awakening, cosmic consciousness)",
    instruments: "Electronic drones, crystal bowls, theremin-like tones",
    keynote: "A#/Bb",
    dateRange: "Jan 20 – Feb 18",
  },
  pisces: {
    energyDescription: "Pisces dissolves the cosmos into a dream. Planets here lose their edges — intuition deepens, empathy overflows, and reality softens into something more like poetry. This is the energy of the prayer, the painting that moves you to tears, the ocean at midnight.",
    noPlanetsMessage: "No planets drift through Pisces today. The fish swim in deeper waters — felt but unseen.",
    elementDescription: "intuition, compassion, transcendence",
    modalityDescription: "adaptable, dissolving, surrendering",
    rulingPlanet: "Neptune ♆ (traditional: Jupiter ♃)",
    bodyArea: "Feet, lymphatic system, pineal gland",
    themes: "Compassion, imagination, surrender, spirituality, healing, transcendence",
    shadow: "Escapism, confusion, over-sensitivity, martyrdom, addiction",
    frequency: "852 Hz (intuition, third eye activation)",
    instruments: "Crystal singing bowls, ocean drum, rain stick, monochord",
    keynote: "B",
    dateRange: "Feb 19 – Mar 20",
  },
}
```

### Lithuanian Version

Create the equivalent file at `src/i18n/content/lt/sign-meanings.ts` with ALL the same fields translated into natural, poetic Lithuanian. The descriptions should feel equally evocative in Lithuanian — not like a Google Translate output. Here are the first two as examples of the quality bar:

```typescript
aries: {
  energyDescription: "Avinas uždega dangų kaip degtukas. Kai planetos keliauja per čia, pasaulis pagreitėja — drąsa kyla, kantrybė tirpsta, ir naujos pradžios reikalauja gimti. Tai pirmo kvėpavimo, pirmo žingsnio, kibirkšties prieš ugnį energija.",
  noPlanetsMessage: "Šiuo metu jokia planeta neužkuria Avino. Avinas ilsisi — bet jo ugnis niekada tikrai neužgęsta.",
  // ... all other fields in Lithuanian
},
taurus: {
  energyDescription: "Jautis sulėtina kosmosą iki švelnaus pulso. Planetos čia juda per medų — viskas tampa apie tai, ką gali paliesti, paragauti ir laikyti. Tai sodo, ilgos vakarienės, rankos ant šiltos žemės energija.",
  noPlanetsMessage: "Šiandien jokia planeta neganosi Jaučio žolėje. Bulius stovi ramiai, įsišaknijęs ir kantrus.",
  // ... all other fields in Lithuanian
},
// ... complete all 12 signs
```

---

## 4. Sound Healing Connection Section

This section in the detail panel is unique to Astrara and connects it to the broader Harmonic Waves ecosystem. The frequency, instrument, and keynote data for each sign should be based on established correspondences:

| Sign | Frequency | Keynote | Instruments |
|---|---|---|---|
| Aries | 396 Hz (liberation) | C | Drums, didgeridoo, Tibetan bowls |
| Taurus | 417 Hz (change) | C#/Db | Monochord, singing bowls, tuning forks |
| Gemini | 528 Hz (transformation) | D | Chimes, bells, flute, kalimba |
| Cancer | 639 Hz (connection) | D#/Eb | Ocean drum, rain stick, crystal bowls |
| Leo | 741 Hz (expression) | E | Gong, djembe, singing, brass bowls |
| Virgo | 852 Hz (intuition) | F | Tuning forks, monochord, Tibetan bowls |
| Libra | 639 Hz (harmony) | F#/Gb | Crystal bowls, harp, wind chimes |
| Scorpio | 174 Hz (foundation) | G | Gong, didgeridoo, low crystal bowls |
| Sagittarius | 963 Hz (awakening) | G#/Ab | Didgeridoo, frame drum, large bowls |
| Capricorn | 285 Hz (healing) | A | Tibetan bowls, monochord, tuning forks |
| Aquarius | 963 Hz (cosmic) | A#/Bb | Electronic drones, crystal bowls |
| Pisces | 852 Hz (third eye) | B | Crystal bowls, ocean drum, monochord |

---

## 5. i18n Keys to Add

Add to both `en.json` and `lt.json`:

**English:**
```json
{
  "sign.details": "About This Sign",
  "sign.rulingPlanet": "Ruling Planet",
  "sign.bodyArea": "Body Area",
  "sign.themes": "Themes",
  "sign.shadow": "Shadow Side",
  "sign.soundHealing": "Sound Healing Connection",
  "sign.frequency": "Frequency",
  "sign.instruments": "Instruments",
  "sign.keynote": "Keynote",
  "sign.dateRange": "Dates"
}
```

**Lithuanian:**
```json
{
  "sign.details": "Apie Šį Ženklą",
  "sign.rulingPlanet": "Valdanti Planeta",
  "sign.bodyArea": "Kūno Sritis",
  "sign.themes": "Temos",
  "sign.shadow": "Šešėlinė Pusė",
  "sign.soundHealing": "Garso Terapijos Ryšys",
  "sign.frequency": "Dažnis",
  "sign.instruments": "Instrumentai",
  "sign.keynote": "Pagrindinis Tonas",
  "sign.dateRange": "Datos"
}
```

---

## Build Steps

1. Read current wheel component and existing detail panel components
2. Add tap targets to all 12 zodiac sign badges on the wheel
3. Create or extend the detail panel component for zodiac signs
4. Create the full 12-sign content data files in English
5. Create the full 12-sign content data files in Lithuanian
6. Wire up: sign tap → filter planets in that sign → open detail panel with content
7. Add tap visual feedback (badge pulse on tap)
8. Add all new i18n keys to both translation files
9. Test: tap each zodiac sign → correct detail panel opens with correct content
10. Test: planets listed in the detail panel match the actual current planetary positions
11. Test: switch to Lithuanian → all content displays in Lithuanian
12. Test: scrollable panel on mobile for signs with lots of content
13. Run `npm run build`
14. Commit: `feat: clickable zodiac signs with detailed insight panels + sound healing connections`
