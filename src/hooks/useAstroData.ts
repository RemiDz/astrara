'use client'

import { useState, useEffect, useMemo } from 'react'
import { getPlanetPositions, getMoonData, type PlanetPosition, type MoonData, type AspectData } from '@/lib/astronomy'
import { calculateAspects, getNotableAspects } from '@/lib/aspects'

interface AstroData {
  planets: PlanetPosition[]
  moon: MoonData
  aspects: AspectData[]
  notableAspects: AspectData[]
}

export function useAstroData(date: Date, lat: number, lng: number): AstroData | null {
  const [data, setData] = useState<AstroData | null>(null)

  const dateKey = useMemo(() => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${Math.floor(date.getMinutes() / 1)}`
  }, [date])

  useEffect(() => {
    try {
      const planets = getPlanetPositions(date, lat, lng)
      const moon = getMoonData(date)
      const aspects = calculateAspects(planets)
      const notableAspects = getNotableAspects(aspects)
      setData({ planets, moon, aspects, notableAspects })
    } catch (e) {
      console.error('Astronomy calculation error:', e)
    }
  }, [dateKey, lat, lng, date])

  return data
}
