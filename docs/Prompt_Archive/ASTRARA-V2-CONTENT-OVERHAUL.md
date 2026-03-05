# ASTRARA v2 — Content Overhaul: Practical Voice

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Context

All written content in Astrara is being revised from a poetic/flowery tone to a practical, data-informed, practitioner-focused tone — consistent with the Harmonic Waves ecosystem (Lunata, Sonarus, Earth Pulse). The user is intelligent. Respect that. State facts, explain relevance, let the user draw their own conclusions.

**Voice rules:**
- Factual first, interpretation second
- Short, clear sentences
- No metaphors, no poetry, no "the cosmos whispers"
- Practitioner-relevant tips where appropriate
- Warm but professional — like a knowledgeable colleague

Replace ALL content in the relevant files with the exact text below. Do not paraphrase, shorten, or embellish.

---

## ENGLISH — Sign Meanings (src/i18n/content/en/sign-meanings.ts)

Replace the entire content of the signMeanings object with:

```typescript
export const signMeanings: Record<string, SignContent> = {
  aries: {
    energyDescription: "Aries is a cardinal fire sign ruled by Mars. Planets transiting Aries bring urgency, directness, and a push toward action. Energy levels tend to rise, patience tends to drop. Practitioners often notice clients are more physically restless and respond well to rhythmic, grounding work during strong Aries transits.",
    noPlanetsMessage: "No planets are currently transiting Aries. Its energy is not actively emphasised today.",
    elementDescription: "passion, courage, action",
    modalityDescription: "initiating, pioneering, starting",
    rulingPlanet: "Mars ♂",
    bodyArea: "Head, face, adrenal glands",
    themes: "Courage, independence, initiative, leadership, new beginnings, raw energy",
    shadow: "Impatience, aggression, recklessness, selfishness",
    frequency: "396 Hz (associated with releasing fear and grounding)",
    instruments: "Drums, didgeridoo, Tibetan bowls",
    keynote: "C",
    dateRange: "Mar 21 – Apr 19",
  },
  taurus: {
    energyDescription: "Taurus is a fixed earth sign ruled by Venus. Planets transiting Taurus slow down — stability, comfort, and the physical senses take priority. People tend to seek security and resist change. The throat and voice are Taurus-ruled, making this a particularly relevant transit for sound healing work and vocal practices.",
    noPlanetsMessage: "No planets are currently transiting Taurus. Its energy is not actively emphasised today.",
    elementDescription: "stability, sensuality, material world",
    modalityDescription: "sustaining, building, persisting",
    rulingPlanet: "Venus ♀",
    bodyArea: "Throat, neck, vocal cords",
    themes: "Security, patience, beauty, abundance, physical comfort, groundedness",
    shadow: "Stubbornness, possessiveness, resistance to change, overindulgence",
    frequency: "417 Hz (associated with facilitating change)",
    instruments: "Monochord, singing bowls, tuning forks",
    keynote: "C#/Db",
    dateRange: "Apr 20 – May 20",
  },
  gemini: {
    energyDescription: "Gemini is a mutable air sign ruled by Mercury. Planets transiting Gemini increase mental activity, communication, and the need for variety. Thinking speeds up but depth can suffer. Clients may find it harder to settle into stillness during sessions — shorter, more varied sound sequences often work better under this transit.",
    noPlanetsMessage: "No planets are currently transiting Gemini. Its energy is not actively emphasised today.",
    elementDescription: "intellect, communication, connection",
    modalityDescription: "adaptable, versatile, transitional",
    rulingPlanet: "Mercury ☿",
    bodyArea: "Hands, arms, lungs, nervous system",
    themes: "Communication, curiosity, duality, learning, social connection, information",
    shadow: "Restlessness, superficiality, inconsistency, scattered focus",
    frequency: "528 Hz (associated with transformation and clarity)",
    instruments: "Chimes, bells, flute, kalimba",
    keynote: "D",
    dateRange: "May 21 – Jun 20",
  },
  cancer: {
    energyDescription: "Cancer is a cardinal water sign ruled by the Moon. Planets transiting Cancer heighten emotional sensitivity, the need for safety, and connection to home and family. Emotional processing is closer to the surface. Practitioners may find clients more open to deep release work but also more vulnerable — adjust session intensity accordingly.",
    noPlanetsMessage: "No planets are currently transiting Cancer. Its energy is not actively emphasised today.",
    elementDescription: "emotion, intuition, nurturing",
    modalityDescription: "initiating, protecting, creating safety",
    rulingPlanet: "Moon ☽",
    bodyArea: "Chest, stomach, womb",
    themes: "Home, family, emotional security, nurturing, memory, belonging",
    shadow: "Clinginess, moodiness, over-protection, emotional manipulation",
    frequency: "639 Hz (associated with connection and relationships)",
    instruments: "Ocean drum, rain stick, crystal bowls, harp",
    keynote: "D#/Eb",
    dateRange: "Jun 21 – Jul 22",
  },
  leo: {
    energyDescription: "Leo is a fixed fire sign ruled by the Sun. Planets transiting Leo amplify self-expression, confidence, and the desire to be seen. Creativity increases but so can ego sensitivity. Heart-centred sound work tends to resonate strongly during Leo transits — the heart and upper back are Leo-ruled body areas.",
    noPlanetsMessage: "No planets are currently transiting Leo. Its energy is not actively emphasised today.",
    elementDescription: "passion, creativity, self-expression",
    modalityDescription: "sustaining, intensifying, committing",
    rulingPlanet: "Sun ☉",
    bodyArea: "Heart, spine, upper back",
    themes: "Creativity, leadership, generosity, romance, self-expression, confidence",
    shadow: "Pride, drama, need for validation, domination",
    frequency: "741 Hz (associated with expression and clarity)",
    instruments: "Gong, djembe, singing, brass bowls",
    keynote: "E",
    dateRange: "Jul 23 – Aug 22",
  },
  virgo: {
    energyDescription: "Virgo is a mutable earth sign ruled by Mercury. Planets transiting Virgo sharpen attention to detail, health awareness, and the impulse to improve and organise. The mind becomes more analytical. Precision instruments like tuning forks are particularly effective during Virgo transits — clients appreciate structured, methodical session formats.",
    noPlanetsMessage: "No planets are currently transiting Virgo. Its energy is not actively emphasised today.",
    elementDescription: "practicality, analysis, service",
    modalityDescription: "adaptable, discerning, refining",
    rulingPlanet: "Mercury ☿",
    bodyArea: "Digestive system, intestines",
    themes: "Health, service, precision, analysis, humility, craftsmanship",
    shadow: "Perfectionism, over-criticism, anxiety, excessive worry",
    frequency: "852 Hz (associated with intuition and inner clarity)",
    instruments: "Tuning forks, monochord, Tibetan bowls",
    keynote: "F",
    dateRange: "Aug 23 – Sep 22",
  },
  libra: {
    energyDescription: "Libra is a cardinal air sign ruled by Venus. Planets transiting Libra shift focus toward relationships, fairness, and aesthetic harmony. Decision-making can slow as the need to weigh all sides increases. Group sound sessions and partner work tend to be well-received during Libra transits. The kidneys and lower back are the associated body areas.",
    noPlanetsMessage: "No planets are currently transiting Libra. Its energy is not actively emphasised today.",
    elementDescription: "harmony, beauty, partnership",
    modalityDescription: "initiating, relating, balancing",
    rulingPlanet: "Venus ♀",
    bodyArea: "Kidneys, lower back, skin",
    themes: "Relationships, justice, beauty, diplomacy, harmony, partnership",
    shadow: "Indecisiveness, people-pleasing, conflict avoidance, vanity",
    frequency: "639 Hz (associated with harmony and connection)",
    instruments: "Crystal bowls, harp, wind chimes, handpan",
    keynote: "F#/Gb",
    dateRange: "Sep 23 – Oct 22",
  },
  scorpio: {
    energyDescription: "Scorpio is a fixed water sign ruled by Pluto (traditionally Mars). Planets transiting Scorpio intensify everything — emotions go deeper, hidden issues surface, and transformation becomes unavoidable. This is one of the most powerful transits for deep healing work. Practitioners should be prepared for strong emotional releases during sessions. Low frequencies and sustained tones work well.",
    noPlanetsMessage: "No planets are currently transiting Scorpio. Its energy is not actively emphasised today.",
    elementDescription: "depth, transformation, power",
    modalityDescription: "sustaining, intensifying, penetrating",
    rulingPlanet: "Pluto ♇ (traditional: Mars ♂)",
    bodyArea: "Reproductive organs, elimination system",
    themes: "Transformation, power, intimacy, death/rebirth, truth, shadow work",
    shadow: "Jealousy, obsession, control, vengefulness, manipulation",
    frequency: "174 Hz (associated with grounding and pain reduction)",
    instruments: "Gong, didgeridoo, low crystal bowls, drum",
    keynote: "G",
    dateRange: "Oct 23 – Nov 21",
  },
  sagittarius: {
    energyDescription: "Sagittarius is a mutable fire sign ruled by Jupiter. Planets transiting Sagittarius expand perspective, increase optimism, and create restlessness for growth and new experience. There is a strong pull toward meaning and bigger questions. Sessions that incorporate breath work alongside sound tend to be effective — the hips and thighs are Sagittarius-ruled areas where tension often stores.",
    noPlanetsMessage: "No planets are currently transiting Sagittarius. Its energy is not actively emphasised today.",
    elementDescription: "expansion, philosophy, adventure",
    modalityDescription: "adaptable, exploring, synthesising",
    rulingPlanet: "Jupiter ♃",
    bodyArea: "Hips, thighs, liver",
    themes: "Freedom, wisdom, travel, philosophy, optimism, higher learning",
    shadow: "Excess, carelessness, bluntness, restlessness, dogmatism",
    frequency: "963 Hz (associated with higher awareness and awakening)",
    instruments: "Didgeridoo, frame drum, large singing bowls, voice",
    keynote: "G#/Ab",
    dateRange: "Nov 22 – Dec 21",
  },
  capricorn: {
    energyDescription: "Capricorn is a cardinal earth sign ruled by Saturn. Planets transiting Capricorn bring discipline, structure, and a focus on long-term results. Emotional expression may feel restricted — people tend to push through rather than process. Practitioners should be aware that clients may resist vulnerability during these transits. Steady, rhythmic, structured sessions with consistent tempos work best.",
    noPlanetsMessage: "No planets are currently transiting Capricorn. Its energy is not actively emphasised today.",
    elementDescription: "structure, discipline, mastery",
    modalityDescription: "initiating, building, establishing",
    rulingPlanet: "Saturn ♄",
    bodyArea: "Bones, knees, joints, teeth",
    themes: "Ambition, discipline, responsibility, legacy, mastery, structure",
    shadow: "Rigidity, coldness, workaholism, pessimism, excessive control",
    frequency: "285 Hz (associated with tissue healing and energy restoration)",
    instruments: "Tibetan bowls, monochord, tuning forks, crystal bowls",
    keynote: "A",
    dateRange: "Dec 22 – Jan 19",
  },
  aquarius: {
    energyDescription: "Aquarius is a fixed air sign ruled by Uranus (traditionally Saturn). Planets transiting Aquarius encourage innovation, independence, and thinking outside existing frameworks. There can be emotional detachment as the mind prioritises ideas over feelings. Sound sessions using unconventional approaches or experimental combinations tend to resonate well. The ankles and circulation are Aquarius-ruled areas.",
    noPlanetsMessage: "No planets are currently transiting Aquarius. Its energy is not actively emphasised today.",
    elementDescription: "innovation, community, vision",
    modalityDescription: "sustaining, revolutionising, fixing ideals",
    rulingPlanet: "Uranus ♅ (traditional: Saturn ♄)",
    bodyArea: "Ankles, circulation, nervous system",
    themes: "Innovation, humanitarianism, freedom, originality, community, future vision",
    shadow: "Detachment, rebelliousness, aloofness, extremism, emotional avoidance",
    frequency: "963 Hz (associated with cosmic awareness)",
    instruments: "Electronic drones, crystal bowls, experimental tones",
    keynote: "A#/Bb",
    dateRange: "Jan 20 – Feb 18",
  },
  pisces: {
    energyDescription: "Pisces is a mutable water sign ruled by Neptune (traditionally Jupiter). Planets transiting Pisces heighten intuition, emotional sensitivity, and receptivity to subtle energy. Boundaries soften — people absorb more from their environment. This is one of the strongest transits for sound healing effectiveness, as clients tend to be deeply receptive. Crystal bowls and water-element instruments are particularly effective.",
    noPlanetsMessage: "No planets are currently transiting Pisces. Its energy is not actively emphasised today.",
    elementDescription: "intuition, compassion, transcendence",
    modalityDescription: "adaptable, dissolving, surrendering",
    rulingPlanet: "Neptune ♆ (traditional: Jupiter ♃)",
    bodyArea: "Feet, lymphatic system, pineal gland",
    themes: "Compassion, imagination, surrender, spirituality, healing, transcendence",
    shadow: "Escapism, confusion, over-sensitivity, martyrdom, boundary issues",
    frequency: "852 Hz (associated with intuition and third eye activation)",
    instruments: "Crystal singing bowls, ocean drum, rain stick, monochord",
    keynote: "B",
    dateRange: "Feb 19 – Mar 20",
  },
}
```

---

## ENGLISH — Earth Panel Insights (src/lib/earth-insights.ts or equivalent)

Replace the dynamic Earth insight text with:

```typescript
export function getEarthInsight(data: EarthData, lang: 'en' | 'lt'): string {
  const insights = {
    en: {
      quiet: {
        low_wind: "The geomagnetic field is calm and solar wind is low. These are stable conditions — research associates low Kp with better sleep quality, steady blood pressure, and improved focus. Ideal conditions for sound healing, as the body's electromagnetic environment is undisturbed.",
        normal_wind: "The geomagnetic field is calm with moderate solar wind. Conditions are stable. No significant electromagnetic interference expected. Good baseline conditions for energy work and therapeutic sessions.",
        high_wind: "The geomagnetic field is currently calm despite elevated solar wind speed. Geomagnetic conditions may shift in the coming hours as the solar wind interacts with Earth's magnetosphere. Worth monitoring if you have sessions planned.",
      },
      unsettled: {
        low_wind: "The geomagnetic field is mildly unsettled (Kp 2-3). Some research suggests sensitive individuals may notice subtle changes in mood, energy levels, or sleep quality during these periods. Grounding techniques and low-frequency sound work can be supportive.",
        normal_wind: "The geomagnetic field is unsettled with moderate solar wind. Studies have shown correlations between unsettled geomagnetic conditions and increased reports of headaches, fatigue, and emotional sensitivity. Allow extra integration time in sessions.",
        high_wind: "The geomagnetic field is unsettled with elevated solar wind. The magnetosphere is under pressure. Sensitive individuals may experience disrupted sleep, heightened anxiety, or physical tension. Prioritise grounding work and lower frequencies (174-285 Hz range).",
      },
      active: {
        any: "The geomagnetic field is active (Kp 4+). A minor geomagnetic storm is in progress. Published research has documented effects on human heart rate variability, blood pressure, and melatonin production during active periods. Clients may present with unusual fatigue or emotional intensity. Adjust session intensity accordingly — grounding and stabilising work is recommended.",
      },
      storm: {
        any: "A significant geomagnetic storm is in progress (Kp 5+). Earth's magnetic field is substantially disturbed. Multiple studies have documented measurable effects on the human autonomic nervous system during storms of this magnitude. Common reports include disrupted sleep, headaches, increased anxiety, and emotional volatility. Keep sessions gentle and grounding. Root chakra frequencies and steady, predictable rhythms are most supportive.",
      },
    },
    lt: {
      quiet: {
        low_wind: "Geomagnetinis laukas ramus ir saulės vėjas žemas. Tai stabilios sąlygos — tyrimai sieja žemą Kp su geresne miego kokybe, stabiliu kraujospūdžiu ir geresniu susikaupmu. Idealios sąlygos garso terapijai, nes kūno elektromagnetinė aplinka netrukdoma.",
        normal_wind: "Geomagnetinis laukas ramus su vidutiniu saulės vėju. Sąlygos stabilios. Nenumatoma reikšmingų elektromagnetinių trikdžių. Geros bazinės sąlygos energetiniam darbui ir terapiniams seansams.",
        high_wind: "Geomagnetinis laukas šiuo metu ramus, nepaisant padidėjusio saulės vėjo greičio. Geomagnetinės sąlygos gali keistis artimiausiomis valandomis. Verta stebėti, jei planuojate seansus.",
      },
      unsettled: {
        low_wind: "Geomagnetinis laukas šiek tiek nerimsta (Kp 2-3). Kai kurie tyrimai rodo, kad jautrūs žmonės gali pastebėti subtilius nuotaikos, energijos lygio ar miego kokybės pokyčius. Įžeminimo technikos ir žemo dažnio garso darbas gali padėti.",
        normal_wind: "Geomagnetinis laukas nerimsta su vidutiniu saulės vėju. Tyrimai parodė koreliacijas tarp neramių geomagnetinių sąlygų ir padidėjusių galvos skausmo, nuovargio bei emocinio jautrumo pranešimų. Skirkite papildomo integracijos laiko seansuose.",
        high_wind: "Geomagnetinis laukas nerimsta su padidėjusiu saulės vėju. Magnetosfera yra po spaudimu. Jautrūs žmonės gali patirti sutrikdytą miegą, padidėjusį nerimą ar fizinę įtampą. Pirmenybę teikite įžeminimo darbui ir žemesniems dažniams (174-285 Hz diapazonas).",
      },
      active: {
        any: "Geomagnetinis laukas aktyvus (Kp 4+). Vyksta nedidelė geomagnetinė audra. Publikuoti tyrimai dokumentavo poveikį žmogaus širdies ritmo kintamumui, kraujospūdžiui ir melatonino gamybai aktyviais periodais. Klientai gali pasireikšti neįprastu nuovargiu ar emociniu intensyvumu. Atitinkamai koreguokite seanso intensyvumą — rekomenduojamas įžeminantis ir stabilizuojantis darbas.",
      },
      storm: {
        any: "Vyksta reikšminga geomagnetinė audra (Kp 5+). Žemės magnetinis laukas yra stipriai sutrikdytas. Keli tyrimai dokumentavo išmatuojamą poveikį žmogaus autonominei nervų sistemai tokio masto audrų metu. Dažni pranešimai: sutrikdytas miegas, galvos skausmai, padidėjęs nerimas ir emocinis nepastovumas. Seansus darykite švelnius ir įžeminančius. Šaknies čakros dažniai ir pastovūs, nuspėjami ritmai yra palankiausi.",
      },
    },
  }

  const langInsights = insights[lang]
  
  if (data.kpIndex >= 5) return langInsights.storm.any
  if (data.kpIndex === 4) return langInsights.active.any
  
  const level = data.kpIndex <= 1 ? 'quiet' : 'unsettled'
  const wind = data.solarWindSpeed < 350 ? 'low_wind' : data.solarWindSpeed < 500 ? 'normal_wind' : 'high_wind'
  
  return langInsights[level][wind]
}
```

---

## ENGLISH — Body/Mind/Practice Insights (same file or lib/earth-insights.ts)

Replace:

```typescript
export function getBodyMindPractice(data: EarthData, lang: 'en' | 'lt') {
  const en = {
    body: data.kpIndex <= 2
      ? "Calm conditions. Research shows low geomagnetic activity supports stable blood pressure, restful sleep, and normal heart rate variability."
      : data.kpIndex <= 4
      ? "Mildly disturbed conditions. Some individuals may experience headaches, fatigue, or changes in blood pressure. Stay hydrated."
      : "Storm conditions. Documented effects include disrupted sleep, elevated blood pressure, headaches, and reduced heart rate variability.",
    mind: data.kpIndex <= 2
      ? "Low Kp correlates with better focus, mental clarity, and emotional stability in published studies."
      : data.kpIndex <= 4
      ? "Concentration may be affected. Allow extra time for complex tasks and important decisions."
      : "Cognitive function can be impaired during strong geomagnetic storms. Mental fog and emotional reactivity are commonly reported.",
    practice: data.kpIndex <= 2
      ? "Optimal conditions for sound healing. The body's electromagnetic environment is stable, which supports receptivity to subtle frequency work."
      : data.kpIndex <= 4
      ? "Good for grounding-focused sessions. Lower frequencies (174-285 Hz) and steady rhythms are recommended. Allow extra integration time."
      : "Focus on stabilisation and grounding. Root chakra frequencies, steady tempos, and gentle instruments. Avoid overly intense or lengthy sessions.",
  }
  
  const lt = {
    body: data.kpIndex <= 2
      ? "Ramios sąlygos. Tyrimai rodo, kad žemas geomagnetinis aktyvumas palaiko stabilų kraujospūdį, poilsinį miegą ir normalų širdies ritmo kintamumą."
      : data.kpIndex <= 4
      ? "Šiek tiek sutrikdytos sąlygos. Kai kurie žmonės gali patirti galvos skausmą, nuovargį ar kraujospūdžio pokyčius. Gerkite pakankamai vandens."
      : "Audros sąlygos. Dokumentuotas poveikis: sutrikdytas miegas, padidėjęs kraujospūdis, galvos skausmai ir sumažėjęs širdies ritmo kintamumas.",
    mind: data.kpIndex <= 2
      ? "Žemas Kp koreliuoja su geresniu susikaupmu, psichine aiškumu ir emociniu stabilumu publikuotuose tyrimuose."
      : data.kpIndex <= 4
      ? "Koncentracija gali būti paveikta. Skirkite papildomo laiko sudėtingoms užduotims ir svarbiems sprendimams."
      : "Pažintinės funkcijos gali būti susilpnėjusios stiprių geomagnetinių audrų metu. Protinis rūkas ir emocinis reaktyvumas dažnai pranešami.",
    practice: data.kpIndex <= 2
      ? "Optimalios sąlygos garso terapijai. Kūno elektromagnetinė aplinka stabili, kas palaiko imlumą subtiliam dažnių darbui."
      : data.kpIndex <= 4
      ? "Tinka į įžeminimą orientuotiems seansams. Rekomenduojami žemesni dažniai (174-285 Hz) ir pastovūs ritmai. Skirkite papildomo integracijos laiko."
      : "Sutelkite dėmesį į stabilizavimą ir įžeminimą. Šaknies čakros dažniai, pastovūs tempai ir švelnūs instrumentai. Venkite pernelyg intensyvių ar ilgų seansų.",
  }
  
  return lang === 'lt' ? lt : en
}
```

---

## ENGLISH — About Modal Intro (src/i18n/content/en/about.ts)

Replace only the intro paragraph:

```
OLD: "Nothing here is random or made up. Every planetary position is calculated to the arc-minute using the same astronomical algorithms NASA uses for space missions. The insights are drawn from centuries of astrological tradition. The sound frequencies come from real physics."

NEW: "Every planetary position in Astrara is calculated using the same astronomical algorithms used in space navigation, accurate to within fractions of a degree. The interpretive content draws from established astrological tradition. Sound frequencies are based on published acoustic research — Hans Cousto's planetary octave calculations and the solfeggio frequency framework. Earth data comes directly from NOAA satellite feeds."
```

Replace the "What Pisces Energy Feels Like" section heading across the app:

```
OLD heading: "What [Sign] Energy Feels Like"
NEW heading: "About [Sign] Transits" (EN) / "Apie [Sign] Tranzitus" (LT)
```

And the section labelled "What This Means for You" in the Earth Panel:

```
OLD: "What This Means for You"
NEW: "Practitioner Notes" (EN) / "Pastabos Praktikams" (LT)
```

---

## ENGLISH — "No planets" messages i18n key update

In the sign detail panels, the section heading for planets currently in a sign:

```
OLD: "Planets in [Sign] Right Now"
NEW: "Current Transits in [Sign]" (EN) / "Dabartiniai Tranzitai [Sign]" (LT)
```

---

## LITHUANIAN — Sign Meanings (src/i18n/content/lt/sign-meanings.ts)

Replace with:

```typescript
export const signMeanings: Record<string, SignContent> = {
  aries: {
    energyDescription: "Avinas yra kardinalinis ugnies ženklas, valdomas Marso. Planetos, tranzituojančios per Aviną, atneša skubumą, tiesumą ir postūmį veikti. Energijos lygis kyla, kantrybė mažėja. Praktikai dažnai pastebi, kad klientai yra fiziškai nerimstesni ir gerai reaguoja į ritminį, įžeminantį darbą stiprių Avino tranzitų metu.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Aviną. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "aistra, drąsa, veiksmas",
    modalityDescription: "inicijuojantis, pionieriška, pradedantis",
    rulingPlanet: "Marsas ♂",
    bodyArea: "Galva, veidas, antinksčiai",
    themes: "Drąsa, nepriklausomybė, iniciatyva, lyderystė, naujos pradžios, gryna energija",
    shadow: "Nekantrumas, agresija, neapdairumas, savanaudiškumas",
    frequency: "396 Hz (siejamas su baimės atpalaidavimu ir įžeminimu)",
    instruments: "Būgnai, didžeridū, tibetiečių dubenys",
    keynote: "C",
    dateRange: "Kov 21 – Bal 19",
  },
  taurus: {
    energyDescription: "Jautis yra fiksuotas žemės ženklas, valdomas Veneros. Planetos, tranzituojančios per Jautį, lėtėja — stabilumas, komfortas ir fiziniai pojūčiai tampa prioritetu. Žmonės ieško saugumo ir priešinasi pokyčiams. Gerklė ir balsas yra Jaučio valdomos sritys, todėl šis tranzitas ypač aktualus garso terapijos darbui ir vokalinėms praktikoms.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Jautį. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "stabilumas, juslumas, materialus pasaulis",
    modalityDescription: "palaikantis, kuriantis, atkaklus",
    rulingPlanet: "Venera ♀",
    bodyArea: "Gerklė, kaklas, balso stygos",
    themes: "Saugumas, kantrybė, grožis, gausa, fizinis komfortas, įsišaknijimas",
    shadow: "Užsispyrimas, pavydumas, pasipriešinimas pokyčiams, persisotinimas",
    frequency: "417 Hz (siejamas su pokyčių palengvinimu)",
    instruments: "Monochordas, dainavimo dubenys, derinimo šakutės",
    keynote: "C#/Db",
    dateRange: "Bal 20 – Geg 20",
  },
  gemini: {
    energyDescription: "Dvyniai yra kintamas oro ženklas, valdomas Merkurijaus. Planetos, tranzituojančios per Dvynius, padidina protinį aktyvumą, bendravimą ir įvairovės poreikį. Mąstymas pagreitėja, bet gilumas gali nukentėti. Klientams gali būti sunkiau nusiraminti seansų metu — trumpesnės, įvairesnės garso sekos dažnai veikia geriau šio tranzito metu.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Dvynius. Jų energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "intelektas, bendravimas, ryšys",
    modalityDescription: "prisitaikantis, universalus, pereinamasis",
    rulingPlanet: "Merkurijus ☿",
    bodyArea: "Rankos, plaučiai, nervų sistema",
    themes: "Bendravimas, smalsumas, dualumas, mokymasis, socialinis ryšys, informacija",
    shadow: "Nerimastingumas, paviršutiniškumas, nenuoseklumas, išblaškytas dėmesys",
    frequency: "528 Hz (siejamas su transformacija ir aiškumu)",
    instruments: "Varpeliai, skambučiai, fleita, kalimba",
    keynote: "D",
    dateRange: "Geg 21 – Bir 20",
  },
  cancer: {
    energyDescription: "Vėžys yra kardinalinis vandens ženklas, valdomas Mėnulio. Planetos, tranzituojančios per Vėžį, sustiprina emocinį jautrumą, saugumo poreikį ir ryšį su namais bei šeima. Emocinis apdorojimas yra arčiau paviršiaus. Praktikai gali pastebėti, kad klientai yra atviresni giliam atpalaidavimo darbui, bet ir labiau pažeidžiami — atitinkamai koreguokite seanso intensyvumą.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Vėžį. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "emocijos, intuicija, globa",
    modalityDescription: "inicijuojantis, saugantis, kuriantis saugumą",
    rulingPlanet: "Mėnulis ☽",
    bodyArea: "Krūtinė, skrandis, gimda",
    themes: "Namai, šeima, emocinis saugumas, globa, atmintis, priklausymas",
    shadow: "Prisirišimas, nuotaikų kaita, perdėta apsauga, emocinis manipuliavimas",
    frequency: "639 Hz (siejamas su ryšiu ir santykiais)",
    instruments: "Vandenyno būgnas, lietaus lazdelė, krištoliniai dubenys, arfa",
    keynote: "D#/Eb",
    dateRange: "Bir 21 – Lie 22",
  },
  leo: {
    energyDescription: "Liūtas yra fiksuotas ugnies ženklas, valdomas Saulės. Planetos, tranzituojančios per Liūtą, sustiprina saviraiška, pasitikėjimą ir norą būti pastebėtam. Kūrybiškumas didėja, bet kartu ir ego jautrumas. Širdies centro garso darbas stipriai rezonuoja Liūto tranzitų metu — širdis ir viršutinė nugaros dalis yra Liūto valdomos kūno sritys.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Liūtą. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "aistra, kūrybiškumas, saviraiška",
    modalityDescription: "palaikantis, stiprinantis, įsipareigojantis",
    rulingPlanet: "Saulė ☉",
    bodyArea: "Širdis, stuburas, viršutinė nugaros dalis",
    themes: "Kūrybiškumas, lyderystė, dosnumas, romantika, saviraiška, pasitikėjimas",
    shadow: "Puikybė, drama, patvirtinimo poreikis, dominavimas",
    frequency: "741 Hz (siejamas su raiška ir aiškumu)",
    instruments: "Gongas, džembė, dainavimas, žalvariniai dubenys",
    keynote: "E",
    dateRange: "Lie 23 – Rgp 22",
  },
  virgo: {
    energyDescription: "Mergelė yra kintamas žemės ženklas, valdomas Merkurijaus. Planetos, tranzituojančios per Mergelę, paaštrina dėmesį detalėms, sveikatos suvokimą ir impulsą tobulinti bei organizuoti. Protas tampa analitičkesnis. Tikslumo instrumentai kaip derinimo šakutės yra ypač efektyvūs Mergelės tranzitų metu — klientai vertina struktūrizuotus, metodiškus seanso formatus.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Mergelę. Jos energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "praktiškumas, analizė, tarnavimas",
    modalityDescription: "prisitaikantis, įžvalgus, tobulinantis",
    rulingPlanet: "Merkurijus ☿",
    bodyArea: "Virškinimo sistema, žarnos",
    themes: "Sveikata, tarnavimas, tikslumas, analizė, nuolankumas, meistriškumas",
    shadow: "Perfekcionizmas, perdėta kritika, nerimas, pernelyg didelis rūpestis",
    frequency: "852 Hz (siejamas su intuicija ir vidiniu aiškumu)",
    instruments: "Derinimo šakutės, monochordas, tibetiečių dubenys",
    keynote: "F",
    dateRange: "Rgp 23 – Rgs 22",
  },
  libra: {
    energyDescription: "Svarstyklės yra kardinalinis oro ženklas, valdomas Veneros. Planetos, tranzituojančios per Svarstykles, nukreipia dėmesį į santykius, teisingumą ir estetinę harmoniją. Sprendimų priėmimas gali sulėtėti, nes auga poreikis pasvarstyti visas puses. Grupiniai garso seansai ir darba poromis gerai priimami Svarstyklių tranzitų metu. Inkstai ir apatinė nugaros dalis yra susijusios kūno sritys.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Svarstykles. Jų energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "harmonija, grožis, partnerystė",
    modalityDescription: "inicijuojantis, siejantis, balansuojantis",
    rulingPlanet: "Venera ♀",
    bodyArea: "Inkstai, apatinė nugaros dalis, oda",
    themes: "Santykiai, teisingumas, grožis, diplomatija, harmonija, partnerystė",
    shadow: "Neryžtingumas, pataikavimas, konflikto vengimas, tuštybė",
    frequency: "639 Hz (siejamas su harmonija ir ryšiu)",
    instruments: "Krištoliniai dubenys, arfa, vėjo varpeliai, handpanas",
    keynote: "F#/Gb",
    dateRange: "Rgs 23 – Spa 22",
  },
  scorpio: {
    energyDescription: "Skorpionas yra fiksuotas vandens ženklas, valdomas Plutono (tradiciškai Marso). Planetos, tranzituojančios per Skorpioną, viską sustiprina — emocijos gilėja, paslėptos problemos iškyla, ir transformacija tampa neišvengiama. Tai vienas iš galingiausių tranzitų giliam gydymo darbui. Praktikai turėtų būti pasirengę stipriems emociniams išlaisvinimams seansų metu. Žemi dažniai ir ilgalaikiai tonai veikia gerai.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Skorpioną. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "gilumas, transformacija, galia",
    modalityDescription: "palaikantis, stiprinantis, skverbiantis",
    rulingPlanet: "Plutonas ♇ (tradicinis: Marsas ♂)",
    bodyArea: "Reprodukciniai organai, šalinimo sistema",
    themes: "Transformacija, galia, intymumas, mirtis/atgimimas, tiesa, šešėlio darbas",
    shadow: "Pavydas, obsesija, kontrolė, kerštingumas, manipuliavimas",
    frequency: "174 Hz (siejamas su įžeminimu ir skausmo mažinimu)",
    instruments: "Gongas, didžeridū, žemi krištoliniai dubenys, būgnas",
    keynote: "G",
    dateRange: "Spa 23 – Lap 21",
  },
  sagittarius: {
    energyDescription: "Šaulys yra kintamas ugnies ženklas, valdomas Jupiterio. Planetos, tranzituojančios per Šaulį, išplečia perspektyvą, padidina optimizmą ir sukuria nerimą dėl augimo bei naujos patirties. Stipriai traukia prasmės ieškojimas ir didesni klausimai. Seansai, kurie šalia garso įtraukia kvėpavimo praktikas, yra efektyvūs — klubai ir šlaunys yra Šaulio valdomos sritys, kur dažnai kaupiasi įtampa.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Šaulį. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "plėtra, filosofija, nuotykis",
    modalityDescription: "prisitaikantis, tyrinėjantis, sintezuojantis",
    rulingPlanet: "Jupiteris ♃",
    bodyArea: "Klubai, šlaunys, kepenys",
    themes: "Laisvė, išmintis, kelionės, filosofija, optimizmas, aukštasis mokymasis",
    shadow: "Perteklius, neatsargumas, šiurkštumas, nerimastingumas, dogmatizmas",
    frequency: "963 Hz (siejamas su aukštesniu suvokimu ir prabudimu)",
    instruments: "Didžeridū, rėminis būgnas, dideli dainavimo dubenys, balsas",
    keynote: "G#/Ab",
    dateRange: "Lap 22 – Gru 21",
  },
  capricorn: {
    energyDescription: "Ožiaragis yra kardinalinis žemės ženklas, valdomas Saturno. Planetos, tranzituojančios per Ožiaragį, atneša discipliną, struktūrą ir dėmesį ilgalaikiams rezultatams. Emocinė raiška gali jaustis ribota — žmonės linkę stumti pirmyn, o ne apdoroti. Praktikai turėtų žinoti, kad klientai gali priešintis pažeidžiamumui šių tranzitų metu. Pastovūs, ritmiški, struktūrizuoti seansai su nuosekliu tempu veikia geriausiai.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Ožiaragį. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "struktūra, disciplina, meistriškumas",
    modalityDescription: "inicijuojantis, kuriantis, įtvirtinantis",
    rulingPlanet: "Saturnas ♄",
    bodyArea: "Kaulai, keliai, sąnariai, dantys",
    themes: "Ambicija, disciplina, atsakomybė, palikimas, meistriškumas, struktūra",
    shadow: "Nelankstumas, šaltumas, darboholizmas, pesimizmas, perdėta kontrolė",
    frequency: "285 Hz (siejamas su audinių gydymu ir energijos atkūrimu)",
    instruments: "Tibetiečių dubenys, monochordas, derinimo šakutės, krištoliniai dubenys",
    keynote: "A",
    dateRange: "Gru 22 – Sau 19",
  },
  aquarius: {
    energyDescription: "Vandenis yra fiksuotas oro ženklas, valdomas Urano (tradiciškai Saturno). Planetos, tranzituojančios per Vandenį, skatina inovacijas, nepriklausomybę ir mąstymą už esamų ribų. Gali atsirasti emocinis atsiribojimas, nes protas teikia pirmenybę idėjoms, o ne jausmams. Garso seansai, naudojantys netradicines prieigas ar eksperimentines kombinacijas, gerai rezonuoja. Kulkšnys ir kraujotaka yra Vandenio valdomos sritys.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Vandenį. Jo energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "inovacijos, bendruomenė, vizija",
    modalityDescription: "palaikantis, revoliucionuojantis, fiksuojantis idealus",
    rulingPlanet: "Uranas ♅ (tradicinis: Saturnas ♄)",
    bodyArea: "Kulkšnys, kraujotaka, nervų sistema",
    themes: "Inovacijos, humanitarizmas, laisvė, originalumas, bendruomenė, ateities vizija",
    shadow: "Atsiribojimas, maištingumas, atšiaurumas, ekstremizmas, emocijų vengimas",
    frequency: "963 Hz (siejamas su kosmine sąmone)",
    instruments: "Elektroniniai dronai, krištoliniai dubenys, eksperimentiniai tonai",
    keynote: "A#/Bb",
    dateRange: "Sau 20 – Vas 18",
  },
  pisces: {
    energyDescription: "Žuvys yra kintamas vandens ženklas, valdomas Neptūno (tradiciškai Jupiterio). Planetos, tranzituojančios per Žuvis, sustiprina intuiciją, emocinį jautrumą ir imlumą subtiliai energijai. Ribos suminkštėja — žmonės absorbuoja daugiau iš savo aplinkos. Tai vienas stipriausių tranzitų garso terapijos efektyvumui, nes klientai yra giliai imlūs. Krištoliniai dubenys ir vandens elemento instrumentai yra ypač efektyvūs.",
    noPlanetsMessage: "Šiuo metu jokia planeta netranzituoja per Žuvis. Jų energija šiandien nėra aktyviai pabrėžta.",
    elementDescription: "intuicija, užuojauta, transcendencija",
    modalityDescription: "prisitaikantis, tirpinantis, pasiduodantis",
    rulingPlanet: "Neptūnas ♆ (tradicinis: Jupiteris ♃)",
    bodyArea: "Pėdos, limfinė sistema, epifizė",
    themes: "Užuojauta, vaizduotė, pasidavimas, dvasingumas, gydymas, transcendencija",
    shadow: "Eskapizmas, sumišimas, perdėtas jautrumas, kankinystė, ribų problemos",
    frequency: "852 Hz (siejamas su intuicija ir trečiosios akies aktyvacija)",
    instruments: "Krištoliniai dainavimo dubenys, vandenyno būgnas, lietaus lazdelė, monochordas",
    keynote: "B",
    dateRange: "Vas 19 – Kov 20",
  },
}
```

---

## Section Heading Updates (i18n JSON files)

### English (en.json) — find and replace these keys:

```json
{
  "sign.whatItFeelsLike": "About This Transit",
  "sign.planetsHere": "Current Transits",
  "earth.whatThisMeans": "Practitioner Notes"
}
```

### Lithuanian (lt.json) — find and replace these keys:

```json
{
  "sign.whatItFeelsLike": "Apie Šį Tranzitą",
  "sign.planetsHere": "Dabartiniai Tranzitai",
  "earth.whatThisMeans": "Pastabos Praktikams"
}
```

---

## About Modal Intro — Replace in Both Languages

### English (src/i18n/content/en/about.ts):

Find the intro paragraph and replace with:

"Every planetary position in Astrara is calculated using the same astronomical algorithms used in space navigation, accurate to within fractions of a degree. The interpretive content draws from established astrological tradition. Sound frequencies are based on published acoustic research — Hans Cousto's planetary octave calculations and the solfeggio frequency framework. Earth data comes directly from NOAA satellite feeds."

### Lithuanian (src/i18n/content/lt/about.ts):

Find the intro paragraph and replace with:

"Kiekviena planetos padėtis Astrara apskaičiuojama naudojant tuos pačius astronominius algoritmus, naudojamus kosminėje navigacijoje, tikslumu iki laipsnio dalių. Interpretacinis turinys remiasi nusistovėjusia astrologine tradicija. Garso dažniai paremti publikuotais akustiniais tyrimais — Hanso Cousto planetiniais oktavų skaičiavimais ir solfedžio dažnių sistema. Žemės duomenys gaunami tiesiogiai iš NOAA palydovinių srautų."

---

## Build Steps

1. Read all current content files — sign meanings, earth insights, about content
2. Replace English sign meanings with the exact content provided above
3. Replace Lithuanian sign meanings with the exact content provided above
4. Replace English Earth insight text with the exact content provided above
5. Replace Lithuanian Earth insight text with the exact content provided above
6. Replace Body/Mind/Practice text in both languages
7. Update section heading i18n keys in both en.json and lt.json
8. Update About modal intro in both languages
9. Test: open each zodiac sign detail panel — verify new practical text displays
10. Test: open Earth panel — verify new practical text displays
11. Test: switch to Lithuanian — all content in Lithuanian
12. Test: About modal shows updated intro
13. Do NOT change any component structure, styling, or logic — this is a content-only update
14. Run `npm run build`
15. Push to **main** branch
16. Commit: `content: replace poetic tone with practical practitioner-focused voice`
