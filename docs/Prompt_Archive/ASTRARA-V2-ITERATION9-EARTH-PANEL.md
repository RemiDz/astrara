# ASTRARA v2 — Iteration 9: Earth Panel — Live Planetary Intelligence

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

---

## Vision

When the user taps Earth at the centre of the astro wheel, a bottom sheet slides up showing **live Earth intelligence** — Schumann resonance, geomagnetic activity, solar wind, and how these conditions affect humans right now. This bridges the cosmic (planets around you) with the terrestrial (the planet beneath you). No other astrology app does this.

This feature connects Astrara to the existing Earth Pulse app (shumann.app) in the Harmonic Waves ecosystem, using the same NOAA data sources.

---

## Data Sources — All Free, No API Keys

### 1. Geomagnetic Kp Index (NOAA SWPC)
The planetary Kp index measures geomagnetic disturbance on a 0–9 scale.

```
Endpoint: https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json
Method: GET
Response: JSON array of arrays
Format: [["time_tag","Kp","Kp_fraction","a_running","station_count"], ...]
Example: ["2026-03-04 09:00:00.000","2","1.67","","8"]
Update frequency: Every 3 hours
CORS: Allowed (public government API)
```

### 2. Solar Wind Speed & Density (NOAA DSCOVR)
Real-time solar wind plasma data from the DSCOVR satellite at L1 point.

```
Endpoint: https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json
Method: GET
Response: JSON array of arrays
Format: [["time_tag","density","speed","temperature"], ...]
Example: ["2026-03-04 12:00:00.000","5.2","380.5","95000"]
Update frequency: Every few minutes
CORS: Allowed
```

### 3. Interplanetary Magnetic Field (NOAA DSCOVR)
Magnetic field strength and Bz component (southward Bz = more geomagnetic activity).

```
Endpoint: https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json
Method: GET
Response: JSON array of arrays
Format: [["time_tag","bx_gsm","by_gsm","bz_gsm","lon_gsm","lat_gsm","bt"], ...]
Update frequency: Every few minutes
CORS: Allowed
```

### 4. X-Ray Flux / Solar Flares (NOAA GOES)
Current solar X-ray flux level indicating flare activity.

```
Endpoint: https://services.swpc.noaa.gov/json/goes/primary/xray-flares-latest.json
Method: GET
Response: JSON array of flare events
CORS: Allowed
```

### 5. Schumann Resonance
There is NO official free real-time Schumann resonance API. The base frequency is a constant 7.83 Hz — display this as a fixed value with a note that amplitude varies. For the amplitude/spectrogram, we would need to scrape third-party sources which is unreliable. 

**Approach for Astrara:** Display the Schumann base frequency (7.83 Hz) as a constant with educational context, and focus the live data on the NOAA feeds which ARE reliable and real-time. Link to Earth Pulse (shumann.app) for deeper Schumann monitoring.

---

## Earth Panel — UI Design

### Trigger

When the user taps Earth at the centre of the wheel, the Earth Panel bottom sheet slides up.

### Make Earth Tappable

The Earth sphere at the wheel centre needs a tap target identical to planet/zodiac tap targets:

```tsx
<group position={[0, 0, 0]}>
  {/* Earth visual (existing sphere + atmosphere) */}
  <mesh ref={earthRef}>...</mesh>
  
  {/* Tap target */}
  <Html center zIndexRange={[100, 0]} style={{ pointerEvents: 'auto' }}>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onEarthTap()
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className="w-14 h-14 rounded-full cursor-pointer select-none
                 active:scale-90 transition-transform duration-150"
      style={{ background: 'transparent', border: 'none' }}
      aria-label="View Earth intelligence"
    />
  </Html>
</group>
```

### Panel Layout

```
┌─────────────────────────────────────────┐
│  ─── (drag handle)                   ✕  │
│                                         │
│       🌍 EARTH PULSE                    │
│       Live Planetary Intelligence       │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  HOW EARTH FEELS RIGHT NOW             │
│                                         │
│  "The geomagnetic field is calm today.  │
│   Your nervous system can rest in its   │
│   natural rhythm. A good day for deep   │
│   meditation and subtle energy work."   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ⚡ GEOMAGNETIC ACTIVITY                │
│  ┌─────────────────────────────────┐    │
│  │  Kp Index:  2  ████░░░░░  Quiet │    │
│  │  Updated: 12:00 UTC             │    │
│  │                                 │    │
│  │  0-1 Quiet · 2-3 Unsettled      │    │
│  │  4 Active · 5+ Storm            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ☀️ SOLAR WIND                          │
│  ┌─────────────────────────────────┐    │
│  │  Speed:    380 km/s   Normal    │    │
│  │  Density:  5.2 p/cm³  Normal    │    │
│  │  Bz:      -1.2 nT    Neutral   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  🔊 EARTH FREQUENCY                     │
│  ┌─────────────────────────────────┐    │
│  │  Schumann Resonance: 7.83 Hz   │    │
│  │  The Earth's electromagnetic    │    │
│  │  heartbeat — at the boundary    │    │
│  │  between Theta and Alpha        │    │
│  │  brainwaves.                    │    │
│  │                                 │    │
│  │  Harmonics: 14.07 · 20.25 ·    │    │
│  │  26.41 · 32.45 Hz              │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHAT THIS MEANS FOR YOU               │
│                                         │
│  Body: Calm geomagnetic conditions      │
│  support restful sleep and stable       │
│  blood pressure.                        │
│                                         │
│  Mind: Low Kp index correlates with     │
│  better focus and mental clarity.       │
│                                         │
│  Practice: Ideal conditions for         │
│  sound healing — the body is more       │
│  receptive when the field is quiet.     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  🔗 Deep dive → shumann.app            │
│  Full Schumann & geomagnetic dashboard  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Data Fetching (lib/earth-data.ts)

```typescript
export interface EarthData {
  kpIndex: number                // 0-9
  kpLabel: string                // "Quiet" | "Unsettled" | "Active" | "Storm" | "Severe Storm"
  kpTimestamp: string            // UTC timestamp
  solarWindSpeed: number         // km/s
  solarWindDensity: number       // protons/cm³
  solarWindSpeedLabel: string    // "Slow" | "Normal" | "Fast" | "Very Fast"
  bzComponent: number            // nT (negative = southward = more active)
  bzLabel: string                // "Northward" | "Neutral" | "Southward"
  schumannBase: number           // always 7.83
  schumannHarmonics: number[]    // [14.07, 20.25, 26.41, 32.45]
  lastUpdated: Date
  fetchError: boolean
}

export async function fetchEarthData(): Promise<EarthData> {
  const defaults: EarthData = {
    kpIndex: 0,
    kpLabel: 'Unknown',
    kpTimestamp: '',
    solarWindSpeed: 0,
    solarWindDensity: 0,
    solarWindSpeedLabel: 'Unknown',
    bzComponent: 0,
    bzLabel: 'Unknown',
    schumannBase: 7.83,
    schumannHarmonics: [14.07, 20.25, 26.41, 32.45],
    lastUpdated: new Date(),
    fetchError: false,
  }

  try {
    // Fetch all NOAA endpoints in parallel
    const [kpRes, plasmaRes, magRes] = await Promise.allSettled([
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
      fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-2-hour.json'),
      fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-2-hour.json'),
    ])

    // Parse Kp Index — get the most recent value
    if (kpRes.status === 'fulfilled' && kpRes.value.ok) {
      const kpData = await kpRes.value.json()
      // Skip header row [0], get last entry
      const latest = kpData[kpData.length - 1]
      const kp = parseFloat(latest[1])
      defaults.kpIndex = kp
      defaults.kpTimestamp = latest[0]
      defaults.kpLabel = getKpLabel(kp)
    }

    // Parse Solar Wind Plasma — get the most recent value
    if (plasmaRes.status === 'fulfilled' && plasmaRes.value.ok) {
      const plasmaData = await plasmaRes.value.json()
      const latest = plasmaData[plasmaData.length - 1]
      defaults.solarWindDensity = parseFloat(latest[1]) || 0
      defaults.solarWindSpeed = parseFloat(latest[2]) || 0
      defaults.solarWindSpeedLabel = getWindSpeedLabel(defaults.solarWindSpeed)
    }

    // Parse Magnetic Field — get the most recent Bz value
    if (magRes.status === 'fulfilled' && magRes.value.ok) {
      const magData = await magRes.value.json()
      const latest = magData[magData.length - 1]
      defaults.bzComponent = parseFloat(latest[3]) || 0  // bz_gsm is index 3
      defaults.bzLabel = getBzLabel(defaults.bzComponent)
    }

  } catch (error) {
    console.error('Failed to fetch Earth data:', error)
    defaults.fetchError = true
  }

  defaults.lastUpdated = new Date()
  return defaults
}

function getKpLabel(kp: number): string {
  if (kp <= 1) return 'Quiet'
  if (kp <= 3) return 'Unsettled'
  if (kp === 4) return 'Active'
  if (kp <= 6) return 'Storm'
  return 'Severe Storm'
}

function getWindSpeedLabel(speed: number): string {
  if (speed < 300) return 'Slow'
  if (speed < 450) return 'Normal'
  if (speed < 600) return 'Fast'
  return 'Very Fast'
}

function getBzLabel(bz: number): string {
  if (bz > 2) return 'Northward (Calm)'
  if (bz > -2) return 'Neutral'
  if (bz > -10) return 'Southward (Active)'
  return 'Strongly Southward (Stormy)'
}
```

### Data Hook

```typescript
// hooks/useEarthData.ts
export function useEarthData() {
  const [earthData, setEarthData] = useState<EarthData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch immediately
    fetchEarthData().then(data => {
      setEarthData(data)
      setLoading(false)
    })

    // Refresh every 15 minutes
    const interval = setInterval(() => {
      fetchEarthData().then(setEarthData)
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return { earthData, loading }
}
```

---

## Insight Text Engine — Earth Conditions

Generate a dynamic "How Earth Feels Right Now" insight based on the live data. This is NOT pre-written — it's composed from conditions:

```typescript
// lib/earth-insights.ts

export function getEarthInsight(data: EarthData, lang: 'en' | 'lt'): string {
  const insights = {
    en: {
      quiet: {
        low_wind: "The geomagnetic field is deeply calm today, and solar winds whisper gently. Your nervous system can rest in its natural rhythm. A beautiful day for deep meditation, subtle energy work, and sound healing — the body is most receptive when Earth is quiet.",
        normal_wind: "The geomagnetic field is calm with moderate solar wind. Conditions are stable and grounding. A good day for focused work and steady, intentional practice.",
        high_wind: "The geomagnetic field is calm despite elevated solar wind. A watchful peace — like the eye of a gentle storm. Stay grounded and hydrated.",
      },
      unsettled: {
        low_wind: "The geomagnetic field is mildly unsettled. You may notice subtle shifts in mood or energy levels. Some people feel slightly restless or emotionally sensitive. Gentle grounding practices can help.",
        normal_wind: "Earth's magnetic field is stirring today. Sensitivity may increase — headaches, vivid dreams, or unexpected emotions are common when the field is unsettled. Move slowly and listen to your body.",
        high_wind: "The field is unsettled with active solar wind pushing against Earth's magnetosphere. You may feel wired or scattered. Prioritise grounding: walk barefoot, use low frequencies, eat warm food.",
      },
      active: {
        any: "The geomagnetic field is active today — a minor storm is stirring Earth's magnetic shield. Many people report disrupted sleep, heightened anxiety, or intense dreams during active periods. This is also a time of accelerated inner growth. Be gentle with yourself.",
      },
      storm: {
        any: "A geomagnetic storm is in progress. Earth's magnetic field is significantly disturbed. Sensitive individuals may experience headaches, fatigue, emotional intensity, or unusual dream states. This is powerful energy — not harmful, but demanding. Rest when you can, drink water, and avoid major decisions if you feel foggy.",
      },
    },
    lt: {
      quiet: {
        low_wind: "Geomagnetinis laukas šiandien yra giliai ramus, o saulės vėjas švelniai šnabžda. Jūsų nervų sistema gali ilsėtis natūraliu ritmu. Puiki diena giliai meditacijai, subtiliam energetiniam darbui ir garso terapijai — kūnas yra imliausia, kai Žemė tyli.",
        normal_wind: "Geomagnetinis laukas ramus su vidutiniu saulės vėju. Sąlygos stabilios ir įžeminančios. Gera diena susikaupusiam darbui ir nuosekliai praktikai.",
        high_wind: "Geomagnetinis laukas ramus, nepaisant padidėjusio saulės vėjo. Budri ramybė — tarsi švelnios audros akis. Likite įsišakniję ir gerkite vandenį.",
      },
      unsettled: {
        low_wind: "Geomagnetinis laukas šiek tiek nerimsta. Galite pastebėti subtilius nuotaikos ar energijos pokyčius. Kai kurie žmonės jaučiasi truputį neramūs ar emociškai jautrūs. Švelnios įžeminimo praktikos gali padėti.",
        normal_wind: "Žemės magnetinis laukas šiandien juda. Jautrumas gali padidėti — galvos skausmai, ryškūs sapnai ar netikėtos emocijos dažnos, kai laukas nerimsta. Judėkite lėtai ir klausykite savo kūno.",
        high_wind: "Laukas nerimsta su aktyviu saulės vėju, stumiančiu Žemės magnetosferą. Galite jaustis įtempti ar išsiblaškę. Pirmenybę teikite įžeminimui: vaikščiokite basomis, naudokite žemus dažnius, valgykite šiltą maistą.",
      },
      active: {
        any: "Geomagnetinis laukas šiandien aktyvus — nedidelė audra drumščia Žemės magnetinį skydą. Daugelis žmonių praneša apie sutrikdytą miegą, padidėjusį nerimą ar intensyvius sapnus aktyviais periodais. Tai taip pat pagreitinto vidinio augimo laikas. Būkite švelnūs su savimi.",
      },
      storm: {
        any: "Vyksta geomagnetinė audra. Žemės magnetinis laukas stipriai sutrikdytas. Jautrūs žmonės gali patirti galvos skausmus, nuovargį, emocinį intensyvumą ar neįprastas sapnų būsenas. Tai galinga energija — ne žalinga, bet reikli. Ilsėkitės, kai galite, gerkite vandenį ir venkite svarbių sprendimų, jei jaučiatės apsiblaususiai.",
      },
    },
  }

  const langInsights = insights[lang]
  
  if (data.kpIndex >= 5) {
    return langInsights.storm.any
  }
  if (data.kpIndex === 4) {
    return langInsights.active.any
  }
  
  const level = data.kpIndex <= 1 ? 'quiet' : 'unsettled'
  const wind = data.solarWindSpeed < 350 ? 'low_wind' : data.solarWindSpeed < 500 ? 'normal_wind' : 'high_wind'
  
  return langInsights[level][wind]
}
```

This creates **dynamically composed insights** that change based on the actual live data — not static text. The combination of Kp level + solar wind speed gives different nuanced readings.

---

## Kp Index Visual Bar

Display the Kp index as a coloured bar with 9 segments:

```tsx
function KpBar({ kp }: { kp: number }) {
  const segments = Array.from({ length: 9 }, (_, i) => i + 1)
  
  const getColour = (index: number) => {
    if (index <= 1) return '#4ADE80'  // green — quiet
    if (index <= 3) return '#FACC15'  // yellow — unsettled
    if (index <= 4) return '#FB923C'  // orange — active  
    if (index <= 6) return '#F87171'  // red — storm
    return '#DC2626'                   // deep red — severe
  }
  
  return (
    <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
      {segments.map(i => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{
            background: i <= Math.round(kp) ? getColour(i) : 'rgba(255,255,255,0.06)',
          }}
        />
      ))}
    </div>
  )
}
```

---

## "What This Means For You" Section

Three short insights based on conditions:

```typescript
export function getBodyMindPractice(data: EarthData, lang: 'en' | 'lt') {
  const en = {
    body: data.kpIndex <= 2
      ? "Calm geomagnetic conditions support restful sleep and stable blood pressure."
      : data.kpIndex <= 4
      ? "Mild magnetic disturbance may cause headaches or fatigue in sensitive individuals."
      : "Geomagnetic storm conditions can disrupt sleep, increase blood pressure, and cause migraines.",
    mind: data.kpIndex <= 2
      ? "Low Kp index correlates with better focus and mental clarity."
      : data.kpIndex <= 4
      ? "Concentration may waver — allow extra time for important tasks."
      : "Mental fog and emotional intensity are common. Be patient with yourself.",
    practice: data.kpIndex <= 2
      ? "Ideal conditions for sound healing — the body is most receptive when the field is quiet."
      : data.kpIndex <= 4
      ? "Good for grounding practices. Lower frequencies (174-285 Hz) may be especially soothing."
      : "Focus on stabilising and grounding work. Root chakra frequencies. Avoid overly intense sessions.",
  }
  
  const lt = {
    body: data.kpIndex <= 2
      ? "Ramios geomagnetinės sąlygos palaiko poilsinį miegą ir stabilų kraujospūdį."
      : data.kpIndex <= 4
      ? "Silpnas magnetinis trikdymas gali sukelti galvos skausmą ar nuovargį jautriems žmonėms."
      : "Geomagnetinės audros sąlygos gali sutrikdyti miegą, padidinti kraujospūdį ir sukelti migreną.",
    mind: data.kpIndex <= 2
      ? "Žemas Kp indeksas koreliuoja su geresniu susikaupmu ir psichine aiškumu."
      : data.kpIndex <= 4
      ? "Koncentracija gali svyruoti — skirkite papildomo laiko svarbioms užduotims."
      : "Protinis rūkas ir emocinis intensyvumas yra įprasti. Būkite kantrūs su savimi.",
    practice: data.kpIndex <= 2
      ? "Idealios sąlygos garso terapijai — kūnas yra imliausias, kai laukas ramus."
      : data.kpIndex <= 4
      ? "Tinka įžeminimo praktikoms. Žemesni dažniai (174-285 Hz) gali būti ypač raminantys."
      : "Sutelkite dėmesį į stabilizavimą ir įžeminimą. Šaknies čakros dažniai. Venkite pernelyg intensyvių seansų.",
  }
  
  return lang === 'lt' ? lt : en
}
```

---

## Link to Earth Pulse

At the bottom of the panel, add a link to the full Earth Pulse dashboard:

```tsx
<a
  href="https://shumann.app"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-2 mt-6 py-3 rounded-xl
             bg-blue-500/10 border border-blue-400/20
             text-blue-300/70 text-sm
             hover:bg-blue-500/15 hover:text-blue-300
             transition-all select-none"
>
  <span>🌍</span>
  <span>{t('earth.deepDive') || 'Deep dive → Earth Pulse'}</span>
</a>
```

---

## i18n Keys to Add

**English:**
```json
{
  "earth.title": "Earth Pulse",
  "earth.subtitle": "Live Planetary Intelligence",
  "earth.howFeels": "How Earth Feels Right Now",
  "earth.geomagneticActivity": "Geomagnetic Activity",
  "earth.kpIndex": "Kp Index",
  "earth.updated": "Updated",
  "earth.solarWind": "Solar Wind",
  "earth.speed": "Speed",
  "earth.density": "Density",
  "earth.magneticField": "Magnetic Field (Bz)",
  "earth.frequency": "Earth Frequency",
  "earth.schumannResonance": "Schumann Resonance",
  "earth.harmonics": "Harmonics",
  "earth.whatThisMeans": "What This Means for You",
  "earth.body": "Body",
  "earth.mind": "Mind",
  "earth.practice": "Practice",
  "earth.deepDive": "Deep dive → Earth Pulse",
  "earth.loading": "Listening to Earth...",
  "earth.error": "Unable to reach Earth sensors. Showing base values."
}
```

**Lithuanian:**
```json
{
  "earth.title": "Žemės Pulsas",
  "earth.subtitle": "Gyva Planetinė Išmintis",
  "earth.howFeels": "Kaip Žemė Jaučiasi Dabar",
  "earth.geomagneticActivity": "Geomagnetinis Aktyvumas",
  "earth.kpIndex": "Kp Indeksas",
  "earth.updated": "Atnaujinta",
  "earth.solarWind": "Saulės Vėjas",
  "earth.speed": "Greitis",
  "earth.density": "Tankis",
  "earth.magneticField": "Magnetinis Laukas (Bz)",
  "earth.frequency": "Žemės Dažnis",
  "earth.schumannResonance": "Šumano Rezonansas",
  "earth.harmonics": "Harmonikos",
  "earth.whatThisMeans": "Ką Tai Reiškia Jums",
  "earth.body": "Kūnas",
  "earth.mind": "Protas",
  "earth.practice": "Praktika",
  "earth.deepDive": "Giliau → Žemės Pulsas",
  "earth.loading": "Klausomės Žemės...",
  "earth.error": "Nepavyko pasiekti Žemės jutiklių. Rodomi baziniai duomenys."
}
```

---

## Loading State

While NOAA data is fetching, show a subtle loading state inside the panel:

```tsx
{loading && (
  <div className="text-center py-8">
    <div className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
      {t('earth.loading')}
    </div>
  </div>
)}
```

## Error Handling

If NOAA APIs fail (they occasionally go down), show a graceful fallback:
- Display Schumann resonance section (it's static data, always available)
- Show "Unable to reach Earth sensors" message
- Still show the general insight text based on default calm conditions
- Don't break the UI — the panel should always open and show something useful

---

## Build Steps

1. Read current Earth component and wheel tap handler code
2. Create `lib/earth-data.ts` with all NOAA fetch functions
3. Create `lib/earth-insights.ts` with dynamic insight generation
4. Create `hooks/useEarthData.ts` hook
5. Make Earth tappable — add Html overlay tap target at wheel centre
6. Build EarthPanel component (bottom sheet with all sections)
7. Build KpBar visual component
8. Add all i18n keys to both en.json and lt.json
9. Wire up: Earth tap → fetch data → show panel with live data
10. Test: tap Earth → panel opens with real NOAA data
11. Test: loading state shows while fetching
12. Test: error state works if NOAA is down (test by blocking network requests)
13. Test: switch to Lithuanian → all content in Lithuanian
14. Test: deep dive link opens shumann.app in new tab
15. Push to **main** branch
16. Run `npm run build`
17. Commit: `feat: Earth Panel — live geomagnetic, solar wind, Schumann data from NOAA`
