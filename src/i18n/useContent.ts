'use client'

import { useMemo } from 'react'
import { useLanguage } from './LanguageContext'
import type { PlanetInsight } from '@/lib/insights'

import { planetInSign as enPlanetMeanings } from './content/en/planet-meanings'
import { aspectMeanings as enAspectMeanings, planetPairAspects as enPlanetPairAspects } from './content/en/aspect-meanings'
import { signMeanings as enSignMeanings } from './content/en/sign-meanings'
import { phaseMeanings as enPhaseMeanings } from './content/en/phase-meanings'

import { planetInSign as ltPlanetMeanings } from './content/lt/planet-meanings'
import { aspectMeanings as ltAspectMeanings, planetPairAspects as ltPlanetPairAspects } from './content/lt/aspect-meanings'
import { signMeanings as ltSignMeanings } from './content/lt/sign-meanings'
import { phaseMeanings as ltPhaseMeanings } from './content/lt/phase-meanings'

interface ContentData {
  planetMeanings: Record<string, Record<string, PlanetInsight>>
  aspectMeanings: Record<string, { name: string; symbol: string; nature: string; generalMeaning: string }>
  planetPairAspects: Record<string, Record<string, string>>
  signMeanings: Record<string, {
    energyDescription: string
    noPlanetsMessage: string
    elementDescription: string
    modalityDescription: string
    rulingPlanet: string
    bodyArea: string
    themes: string
    shadow: string
    frequency: string
    instruments: string
    keynote: string
    dateRange: string
  }>
  phaseMeanings: Record<string, { meaning: string; guidance: string }>
}

const contentMap: Record<string, ContentData> = {
  en: {
    planetMeanings: enPlanetMeanings,
    aspectMeanings: enAspectMeanings,
    planetPairAspects: enPlanetPairAspects,
    signMeanings: enSignMeanings,
    phaseMeanings: enPhaseMeanings,
  },
  lt: {
    planetMeanings: ltPlanetMeanings,
    aspectMeanings: ltAspectMeanings,
    planetPairAspects: ltPlanetPairAspects,
    signMeanings: ltSignMeanings,
    phaseMeanings: ltPhaseMeanings,
  },
}

export function useContent(): ContentData {
  const { lang } = useLanguage()
  return useMemo(() => contentMap[lang] || contentMap.en, [lang])
}
