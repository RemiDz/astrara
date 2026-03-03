'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    brand: "ASTRARA",
    tagline: "What does your birth chart sound like?",
    subtitle: "Every person has a unique cosmic frequency. Discover yours.",
    dateLabel: "Date of Birth",
    timeLabel: "Time of Birth",
    timeHint: "Don't know? Use 12:00",
    cityLabel: "City of Birth",
    cityPlaceholder: "Search for your city...",
    coordsToggle: "Enter coordinates manually",
    latLabel: "Latitude",
    lngLabel: "Longitude",
    generateButton: "Reveal My Cosmic Portrait",
    generating: "Calculating planetary positions...",
    howItWorks: "How does it work?",
    partOfEcosystem: "Part of Harmonic Waves",
    cosmicPortrait: "Your Cosmic Frequency Portrait",
    listenCTA: "Listen to your cosmic sound",
    cosmicSound: "Your Cosmic Sound",
    cosmicSoundIntro: "Each planet was in a unique position when you were born. Astrara converts these positions into frequencies — creating a sound signature that belongs only to you.",
    frequencySignature: "Your Frequency Signature",
    dominantTone: "Your Dominant Tone",
    dominantDesc: "The tone of {planet} in {sign}",
    harmonicAspects: "Your Harmonic Aspects",
    harmonicConnections: "Your Harmonic Connections",
    harmonicConnectionsIntro: "The angles between your planets create musical harmonies — some flowing, some dynamic.",
    shareTitle: "Share your Cosmic Portrait",
    shareCopied: "Link copied!",
    shareButton: "Copy Link",
    createAnother: "Create Another Portrait",
    newPortrait: "New Portrait",
    sessionComplete: "Session complete",
    exploreEcosystem: "Explore Harmonic Waves",
    Sun: "Sun", Moon: "Moon", Mercury: "Mercury", Venus: "Venus",
    Mars: "Mars", Jupiter: "Jupiter", Saturn: "Saturn",
    Uranus: "Uranus", Neptune: "Neptune", Pluto: "Pluto",
    "desc_Sun": "Your core identity and vitality",
    "desc_Moon": "Your emotions and inner world",
    "desc_Mercury": "Your mind and communication style",
    "desc_Venus": "Your love nature and sense of beauty",
    "desc_Mars": "Your drive, energy, and courage",
    "desc_Jupiter": "Your growth, luck, and wisdom",
    "desc_Saturn": "Your discipline, structure, and lessons",
    "desc_Uranus": "Your originality and need for freedom",
    "desc_Neptune": "Your dreams, intuition, and spirituality",
    "desc_Pluto": "Your transformation and deepest power",
    Aries: "Aries", Taurus: "Taurus", Gemini: "Gemini", Cancer: "Cancer",
    Leo: "Leo", Virgo: "Virgo", Libra: "Libra", Scorpio: "Scorpio",
    Sagittarius: "Sagittarius", Capricorn: "Capricorn",
    Aquarius: "Aquarius", Pisces: "Pisces",
    conjunction: "Conjunction", opposition: "Opposition",
    trine: "Trine", square: "Square", sextile: "Sextile",
    "aspectDesc_conjunction": "United — these energies merge and amplify",
    "aspectDesc_trine": "Flowing — natural harmony and ease",
    "aspectDesc_sextile": "Supportive — gentle opportunity",
    "aspectDesc_square": "Dynamic — creative tension that drives growth",
    "aspectDesc_opposition": "Balancing — opposite forces seeking equilibrium",
    Unison: "Unison", "Minor Third": "Minor Third",
    "Perfect Fourth": "Perfect Fourth", "Perfect Fifth": "Perfect Fifth",
    Octave: "Octave",
    aboutTitle: "How It Works",
    aboutWhat: "What is a cosmic frequency portrait?",
    aboutWhatDesc: "Your birth chart — the positions of all planets at the exact moment you were born — converted into sound. Each planet becomes a frequency, and their relationships create harmonics.",
    aboutScience: "The Science",
    aboutScienceDesc: "Planetary positions are calculated using VSOP87 algorithms — the same mathematical models used by NASA. Frequencies are based on Hans Cousto's Cosmic Octave theory, which transposes planetary orbital periods into the audible range.",
    aboutUnique: "Why Every Portrait is Unique",
    aboutUniqueDesc: "10 planets × 360° of zodiac × countless aspect combinations = a sonic fingerprint that belongs only to you.",
    aboutCTA: "Discover your cosmic sound",
    lunataDesc: "Lunar intelligence for practitioners",
    binaraDesc: "Binaural beats and frequency tools",
    sonarusDesc: "Voice frequency analysis",
    builtBy: "Built with 🔮 by Harmonic Waves",
  },
  lt: {
    brand: "ASTRARA",
    tagline: "Kaip skamba tavo gimimo horoskopas?",
    subtitle: "Kiekvienas žmogus turi unikalų kosminį dažnį. Atrask savąjį.",
    dateLabel: "Gimimo data",
    timeLabel: "Gimimo laikas",
    timeHint: "Nežinai? Naudok 12:00",
    cityLabel: "Gimimo miestas",
    cityPlaceholder: "Ieškok savo miesto...",
    coordsToggle: "Įvesti koordinates rankiniu būdu",
    latLabel: "Platuma",
    lngLabel: "Ilguma",
    generateButton: "Atskleisk Savo Kosminį Portretą",
    generating: "Skaičiuojamos planetų pozicijos...",
    howItWorks: "Kaip tai veikia?",
    partOfEcosystem: "Harmonic Waves ekosistema",
    cosmicPortrait: "Tavo Kosminis Dažnių Portretas",
    listenCTA: "Klausytis savo kosminio garso",
    cosmicSound: "Tavo Kosminis Garsas",
    cosmicSoundIntro: "Kiekviena planeta buvo unikalioje pozicijoje kai gimei. Astrara paverčia šias pozicijas dažniais — sukurdama garsinį parašą, kuris priklauso tik tau.",
    frequencySignature: "Tavo Dažnių Parašas",
    dominantTone: "Tavo Dominuojantis Tonas",
    dominantDesc: "{planet} tonas {sign} ženkle",
    harmonicAspects: "Tavo Harmoniniai Aspektai",
    harmonicConnections: "Tavo Harmoniniai Ryšiai",
    harmonicConnectionsIntro: "Kampai tarp tavo planetų kuria muzikines harmonijas — vienų sklandžias, kitų dinamiškas.",
    shareTitle: "Pasidalink savo Kosminiu Portretu",
    shareCopied: "Nuoroda nukopijuota!",
    shareButton: "Kopijuoti nuorodą",
    createAnother: "Sukurti Kitą Portretą",
    newPortrait: "Naujas Portretas",
    sessionComplete: "Sesija baigta",
    exploreEcosystem: "Atrask Harmonic Waves",
    Sun: "Saulė", Moon: "Mėnulis", Mercury: "Merkurijus", Venus: "Venera",
    Mars: "Marsas", Jupiter: "Jupiteris", Saturn: "Saturnas",
    Uranus: "Uranas", Neptune: "Neptūnas", Pluto: "Plutonas",
    "desc_Sun": "Tavo esminė tapatybė ir gyvybingumas",
    "desc_Moon": "Tavo emocijos ir vidinis pasaulis",
    "desc_Mercury": "Tavo mąstymas ir bendravimo stilius",
    "desc_Venus": "Tavo meilės prigimtis ir grožio pojūtis",
    "desc_Mars": "Tavo varomoji jėga, energija ir drąsa",
    "desc_Jupiter": "Tavo augimas, sėkmė ir išmintis",
    "desc_Saturn": "Tavo disciplina, struktūra ir pamokos",
    "desc_Uranus": "Tavo originalumas ir laisvės poreikis",
    "desc_Neptune": "Tavo svajonės, intuicija ir dvasingumas",
    "desc_Pluto": "Tavo transformacija ir giliausia galia",
    Aries: "Avinas", Taurus: "Jautis", Gemini: "Dvyniai", Cancer: "Vėžys",
    Leo: "Liūtas", Virgo: "Mergelė", Libra: "Svarstyklės", Scorpio: "Skorpionas",
    Sagittarius: "Šaulys", Capricorn: "Ožiaragis",
    Aquarius: "Vandenis", Pisces: "Žuvys",
    conjunction: "Konjunkcija", opposition: "Opozicija",
    trine: "Trinas", square: "Kvadratūra", sextile: "Sekstilis",
    "aspectDesc_conjunction": "Suvienytos — šios energijos susilieja ir stiprėja",
    "aspectDesc_trine": "Tekančios — natūrali harmonija ir lengvumas",
    "aspectDesc_sextile": "Palaikančios — švelni galimybė",
    "aspectDesc_square": "Dinamiškos — kūrybinė įtampa, skatinanti augimą",
    "aspectDesc_opposition": "Balansuojančios — priešingos jėgos, ieškančios pusiausvyros",
    Unison: "Unisomas", "Minor Third": "Mažoji tercija",
    "Perfect Fourth": "Grynoji kvarta", "Perfect Fifth": "Grynoji kvinta",
    Octave: "Oktava",
    aboutTitle: "Kaip Tai Veikia",
    aboutWhat: "Kas yra kosminis dažnių portretas?",
    aboutWhatDesc: "Tavo gimimo horoskopas — visų planetų pozicijos tiksliu tavo gimimo momentu — paverstas garsu. Kiekviena planeta tampa dažniu, o jų tarpusavio ryšiai kuria harmonikas.",
    aboutScience: "Mokslas",
    aboutScienceDesc: "Planetų pozicijos apskaičiuojamos naudojant VSOP87 algoritmus — tuos pačius matematinius modelius, kuriuos naudoja NASA. Dažniai paremti Hans Cousto Kosminės Oktavos teorija.",
    aboutUnique: "Kodėl Kiekvienas Portretas Unikalus",
    aboutUniqueDesc: "10 planetų × 360° zodiako × daugybė aspektų kombinacijų = garsinis pirštų atspaudas, priklausantis tik tau.",
    aboutCTA: "Atrask savo kosminį garsą",
    lunataDesc: "Mėnulio intelektas praktikams",
    binaraDesc: "Binauraliniai ritmai ir dažnių įrankiai",
    sonarusDesc: "Balso dažnių analizė",
    builtBy: "Sukurta su 🔮 Harmonic Waves",
  },
} as const;

type Lang = 'en' | 'lt';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = localStorage.getItem('astrara-lang') as Lang | null;
    if (stored === 'en' || stored === 'lt') {
      setLangState(stored);
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('astrara-lang', newLang);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
  }, [lang]);

  return React.createElement(
    LanguageContext.Provider,
    { value: { lang, setLang, t } },
    children
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export type { TranslationKey, Lang };
