'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    brand: "ASTRARA",
    tagline: "Your Cosmic Frequency Portrait",
    subtitle: "Enter your birth details to hear the music of your stars",
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
    frequencySignature: "Your Frequency Signature",
    dominantTone: "Your Dominant Tone",
    dominantDesc: "Your cosmic signature is rooted in {freq} Hz — the tone of {planet} in {sign}",
    harmonicAspects: "Your Harmonic Aspects",
    shareTitle: "Share your Cosmic Portrait",
    shareCopied: "Link copied!",
    shareButton: "Copy Link",
    createAnother: "Create another portrait",
    sessionComplete: "Session complete",
    Sun: "Sun", Moon: "Moon", Mercury: "Mercury", Venus: "Venus",
    Mars: "Mars", Jupiter: "Jupiter", Saturn: "Saturn",
    Uranus: "Uranus", Neptune: "Neptune", Pluto: "Pluto",
    Aries: "Aries", Taurus: "Taurus", Gemini: "Gemini", Cancer: "Cancer",
    Leo: "Leo", Virgo: "Virgo", Libra: "Libra", Scorpio: "Scorpio",
    Sagittarius: "Sagittarius", Capricorn: "Capricorn",
    Aquarius: "Aquarius", Pisces: "Pisces",
    conjunction: "Conjunction", opposition: "Opposition",
    trine: "Trine", square: "Square", sextile: "Sextile",
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
    lunataDesc: "Track the Moon that was in {sign} when you were born",
    binaraDesc: "Experience your dominant frequency as a binaural beat",
    sonarusDesc: "Compare your voice to your cosmic frequency",
    builtBy: "Built with 🔮 by Harmonic Waves",
  },
  lt: {
    brand: "ASTRARA",
    tagline: "Tavo Kosminis Dažnių Portretas",
    subtitle: "Įvesk savo gimimo duomenis ir išgirsk savo žvaigždžių muziką",
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
    frequencySignature: "Tavo Dažnių Parašas",
    dominantTone: "Tavo Dominuojantis Tonas",
    dominantDesc: "Tavo kosminis parašas grindžiamas {freq} Hz — {planet} tone {sign} ženkle",
    harmonicAspects: "Tavo Harmoniniai Aspektai",
    shareTitle: "Pasidalink savo Kosminiu Portretu",
    shareCopied: "Nuoroda nukopijuota!",
    shareButton: "Kopijuoti nuorodą",
    createAnother: "Sukurti kitą portretą",
    sessionComplete: "Sesija baigta",
    Sun: "Saulė", Moon: "Mėnulis", Mercury: "Merkurijus", Venus: "Venera",
    Mars: "Marsas", Jupiter: "Jupiteris", Saturn: "Saturnas",
    Uranus: "Uranas", Neptune: "Neptūnas", Pluto: "Plutonas",
    Aries: "Avinas", Taurus: "Jautis", Gemini: "Dvyniai", Cancer: "Vėžys",
    Leo: "Liūtas", Virgo: "Mergelė", Libra: "Svarstyklės", Scorpio: "Skorpionas",
    Sagittarius: "Šaulys", Capricorn: "Ožiaragis",
    Aquarius: "Vandenis", Pisces: "Žuvys",
    conjunction: "Konjunkcija", opposition: "Opozicija",
    trine: "Trinas", square: "Kvadratūra", sextile: "Sekstilis",
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
    lunataDesc: "Sek Mėnulį, kuris buvo {sign} ženkle kai gimei",
    binaraDesc: "Patirk savo dominuojantį dažnį kaip binauralinį ritmą",
    sonarusDesc: "Palygink savo balsą su kosminiu dažniu",
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
