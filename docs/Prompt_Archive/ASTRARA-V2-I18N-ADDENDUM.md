# ASTRARA v2 — Internationalisation (i18n) Addendum

Do NOT ask for confirmation at any step. Auto-accept all file changes. Run all commands without prompting. Choose Yes for every decision. Work autonomously from start to finish. Use `--yes` flag wherever applicable.

**IMPORTANT**: This addendum MUST be applied together with the main `ASTRARA-V2-PHASE1-BUILD.md` spec and the `ASTRARA-V2-WHEEL-ADDENDUM.md`. It adds multilanguage support throughout the app.

---

## Internationalisation Architecture

Astrara is a multilanguage app from day one. Phase 1 ships with **English (EN)** and **Lithuanian (LT)**. The architecture must make adding future languages trivial (just add a new JSON file).

### Language Switcher — Header

Position: **Top right of the header**, next to the location display.

```
┌──────────────────────────────────────────┐
│  ASTRARA          📍London    🇬🇧 EN ▾  │
└──────────────────────────────────────────┘
```

- Display: Flag emoji + 2-letter language code + dropdown chevron
- Flags: 🇬🇧 for English, 🇱🇹 for Lithuanian
- On tap/click: dropdown opens showing all available languages
- Selected language is highlighted
- Selection persists via `localStorage` (key: `astrara-lang`)
- Default: detect from `navigator.language` — if it starts with `lt`, use Lithuanian. Otherwise English.
- The dropdown should be a clean, glassmorphism-styled popover matching the app aesthetic (not a native `<select>`)

### Implementation Approach — Client-Side i18n (No Library Needed)

Keep it simple. No `next-intl`, no `react-i18next`. Just a lightweight custom hook + JSON dictionaries. This avoids adding dependencies and keeps the app fast.

#### File Structure

```
src/
├── i18n/
│   ├── translations/
│   │   ├── en.json          # English UI strings
│   │   └── lt.json          # Lithuanian UI strings
│   ├── content/
│   │   ├── en/
│   │   │   ├── planet-meanings.ts    # English insight texts
│   │   │   ├── sign-meanings.ts
│   │   │   ├── aspect-meanings.ts
│   │   │   └── phase-meanings.ts
│   │   └── lt/
│   │       ├── planet-meanings.ts    # Lithuanian insight texts
│   │       ├── sign-meanings.ts
│   │       ├── aspect-meanings.ts
│   │       └── phase-meanings.ts
│   ├── useTranslation.ts    # Hook: returns t() function
│   └── LanguageContext.tsx   # React context for current language
```

#### Language Context

```typescript
// src/i18n/LanguageContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'en' | 'lt'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en')

  useEffect(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem('astrara-lang') as Language
    if (saved && ['en', 'lt'].includes(saved)) {
      setLangState(saved)
      return
    }
    // 2. Detect from browser
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('lt')) {
      setLangState('lt')
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('astrara-lang', newLang)
    document.documentElement.lang = newLang
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
```

#### Translation Hook

```typescript
// src/i18n/useTranslation.ts
import { useLanguage } from './LanguageContext'
import en from './translations/en.json'
import lt from './translations/lt.json'

const translations: Record<string, Record<string, string>> = { en, lt }

export function useTranslation() {
  const { lang } = useLanguage()

  const t = (key: string): string => {
    return translations[lang]?.[key] ?? translations['en'][key] ?? key
  }

  return { t, lang }
}
```

### UI Strings — Translation Files

These cover all fixed UI text (NOT the insight content — that's separate).

```jsonc
// src/i18n/translations/en.json
{
  "app.tagline": "Live Cosmic Intelligence",
  "header.language": "EN",
  "weather.title": "Today's Cosmic Weather",
  "weather.notableAspects": "Notable Aspects Today",
  "moon.phase": "Moon Phase",
  "moon.illumination": "illumination",
  "moon.in": "Moon in",
  "planet.retrograde": "Retrograde",
  "planet.riseTime": "Rises",
  "planet.setTime": "Sets",
  "planet.whatThisMeans": "What this means",
  "planet.forYourDay": "For your day",
  "planet.duration": "This transit lasts approximately",
  "sign.element": "Element",
  "sign.modality": "Modality",
  "sign.planetsHere": "Planets currently here",
  "sign.whatItFeelsLike": "What this energy feels like",
  "aspect.applying": "Getting stronger",
  "aspect.separating": "Fading",
  "nav.yesterday": "Yesterday",
  "nav.today": "Today",
  "nav.tomorrow": "Tomorrow",
  "cta.birthChart": "Want to know YOUR chart?",
  "cta.birthChartButton": "Enter Birth Details",
  "footer.partOf": "Part of",
  "location.detecting": "Detecting location...",
  "location.manual": "Set location manually",
  "location.searchPlaceholder": "Search for your city...",
  "about.title": "How does it work?",
  "zodiac.aries": "Aries",
  "zodiac.taurus": "Taurus",
  "zodiac.gemini": "Gemini",
  "zodiac.cancer": "Cancer",
  "zodiac.leo": "Leo",
  "zodiac.virgo": "Virgo",
  "zodiac.libra": "Libra",
  "zodiac.scorpio": "Scorpio",
  "zodiac.sagittarius": "Sagittarius",
  "zodiac.capricorn": "Capricorn",
  "zodiac.aquarius": "Aquarius",
  "zodiac.pisces": "Pisces",
  "planet.sun": "Sun",
  "planet.moon": "Moon",
  "planet.mercury": "Mercury",
  "planet.venus": "Venus",
  "planet.mars": "Mars",
  "planet.jupiter": "Jupiter",
  "planet.saturn": "Saturn",
  "planet.uranus": "Uranus",
  "planet.neptune": "Neptune",
  "planet.pluto": "Pluto",
  "element.fire": "Fire",
  "element.earth": "Earth",
  "element.air": "Air",
  "element.water": "Water",
  "modality.cardinal": "Cardinal",
  "modality.fixed": "Fixed",
  "modality.mutable": "Mutable",
  "aspect.conjunction": "Conjunction",
  "aspect.opposition": "Opposition",
  "aspect.trine": "Trine",
  "aspect.square": "Square",
  "aspect.sextile": "Sextile"
}
```

```jsonc
// src/i18n/translations/lt.json
{
  "app.tagline": "Gyva Kosminė Išmintis",
  "header.language": "LT",
  "weather.title": "Šiandienos Kosminis Oras",
  "weather.notableAspects": "Svarbiausi Šiandienos Aspektai",
  "moon.phase": "Mėnulio Fazė",
  "moon.illumination": "apšvietimas",
  "moon.in": "Mėnulis",
  "planet.retrograde": "Retrogradas",
  "planet.riseTime": "Teka",
  "planet.setTime": "Leidžiasi",
  "planet.whatThisMeans": "Ką tai reiškia",
  "planet.forYourDay": "Tavo dienai",
  "planet.duration": "Šis tranzitas trunka maždaug",
  "sign.element": "Stichija",
  "sign.modality": "Modalumas",
  "sign.planetsHere": "Planetos čia dabar",
  "sign.whatItFeelsLike": "Kaip jaučiama ši energija",
  "aspect.applying": "Stiprėja",
  "aspect.separating": "Silpnėja",
  "nav.yesterday": "Vakar",
  "nav.today": "Šiandien",
  "nav.tomorrow": "Rytoj",
  "cta.birthChart": "Nori sužinoti SAVO žvaigždėlapį?",
  "cta.birthChartButton": "Įvesti gimimo duomenis",
  "footer.partOf": "Dalis",
  "location.detecting": "Nustatoma vieta...",
  "location.manual": "Nustatyti vietą rankiniu būdu",
  "location.searchPlaceholder": "Ieškoti miesto...",
  "about.title": "Kaip tai veikia?",
  "zodiac.aries": "Avinas",
  "zodiac.taurus": "Jautis",
  "zodiac.gemini": "Dvyniai",
  "zodiac.cancer": "Vėžys",
  "zodiac.leo": "Liūtas",
  "zodiac.virgo": "Mergelė",
  "zodiac.libra": "Svarstyklės",
  "zodiac.scorpio": "Skorpionas",
  "zodiac.sagittarius": "Šaulys",
  "zodiac.capricorn": "Ožiaragis",
  "zodiac.aquarius": "Vandenis",
  "zodiac.pisces": "Žuvys",
  "planet.sun": "Saulė",
  "planet.moon": "Mėnulis",
  "planet.mercury": "Merkurijus",
  "planet.venus": "Venera",
  "planet.mars": "Marsas",
  "planet.jupiter": "Jupiteris",
  "planet.saturn": "Saturnas",
  "planet.uranus": "Uranas",
  "planet.neptune": "Neptūnas",
  "planet.pluto": "Plutonas",
  "element.fire": "Ugnis",
  "element.earth": "Žemė",
  "element.air": "Oras",
  "element.water": "Vanduo",
  "modality.cardinal": "Kardinalus",
  "modality.fixed": "Fiksuotas",
  "modality.mutable": "Kintamas",
  "aspect.conjunction": "Konjunkcija",
  "aspect.opposition": "Opozicija",
  "aspect.trine": "Trinas",
  "aspect.square": "Kvadratūra",
  "aspect.sextile": "Sekstilis"
}
```

### Insight Content — Bilingual

The insight texts (planet-in-sign meanings, aspect meanings, phase guidance) MUST also be fully translated. The data files are structured per language:

```typescript
// src/i18n/content/en/planet-meanings.ts
export const planetInSign = {
  sun: {
    pisces: {
      oneLiner: "Dreams hold more truth than usual today.",
      fullInsight: "The Sun drifts through Pisces...",
      practicalTip: "Trust your intuition over your spreadsheet.",
    },
    // ... all 12 signs
  },
  // ... all 10 planets
}

// src/i18n/content/lt/planet-meanings.ts
export const planetInSign = {
  sun: {
    pisces: {
      oneLiner: "Šiandien sapnai slepia daugiau tiesos nei įprasta.",
      fullInsight: "Saulė keliauja per Žuvis...",
      practicalTip: "Pasitikėk intuicija labiau nei skaičiuokle.",
    },
    // ... all 12 signs
  },
  // ... all 10 planets
}
```

The `useAstroData` hook (or a content helper) loads the correct language file based on current `lang` context:

```typescript
import { useLanguage } from '@/i18n/LanguageContext'

export function useAstroContent() {
  const { lang } = useLanguage()
  
  const [content, setContent] = useState(null)
  
  useEffect(() => {
    // Dynamic import based on language
    import(`@/i18n/content/${lang}/planet-meanings`).then(mod => {
      setContent(mod.planetInSign)
    })
  }, [lang])
  
  return content
}
```

### Lithuanian Content Quality

The Lithuanian translations must be **natural, fluent Lithuanian** — not Google Translate output. The mystical-but-clear voice should feel equally poetic in Lithuanian. Lithuanian is a beautifully archaic Indo-European language with rich poetic potential — lean into that.

Example quality bar:
- EN: "Mercury drifts through Pisces. Your thoughts swim rather than march today."
- LT: "Merkurijus plaukia per Žuvis. Šiandien mintys plūduriuoja, o ne žygiuoja."

NOT:
- LT: "Merkurijus yra Žuvyse. Jūsų mintys gali būti paveiktos." (too clinical, feels translated)

### Adding Future Languages

To add a new language (e.g. Spanish):
1. Add `es.json` to `src/i18n/translations/`
2. Add `src/i18n/content/es/` folder with all meaning files
3. Add `'es'` to the Language type union
4. Add flag + label to the dropdown component
5. Done — no other code changes needed

### HTML `lang` Attribute

Update `document.documentElement.lang` whenever language changes (already in the LanguageContext above). This helps screen readers and SEO.

### URL Strategy

For Phase 1: **No URL-based locale** (no `/en/` or `/lt/` prefixes). Language is purely client-side state via localStorage + context. This keeps routing simple and avoids SSR hydration mismatches.

Future consideration: If SEO for Lithuanian becomes important, can add `next-intl` middleware later for URL-based locales.
