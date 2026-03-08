'use client'

import { useMemo } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import type { PlanetPosition, AspectData, MoonData } from '@/lib/astronomy'
import type { EarthData } from '@/lib/earth-data'
import Modal from '@/components/ui/Modal'
import { getKeyPlanet } from './getKeyPlanet'
import ElementBalance from './kpis/ElementBalance'
import KeyPlayer from './kpis/KeyPlayer'
import CosmicIntensity from './kpis/CosmicIntensity'
import KpIndex from './kpis/KpIndex'
import SchumannResonance from './kpis/SchumannResonance'
import SolarActivity from './kpis/SolarActivity'
import AspectMap from './kpis/AspectMap'

interface CrystalMessageProps {
  isOpen: boolean
  onClose: () => void
  planets: PlanetPosition[]
  aspects: AspectData[]
  notableAspects: AspectData[]
  moon: MoonData
  date: Date
  earthData: EarthData | null
  earthLoading: boolean
}

export default function CrystalMessage({
  isOpen,
  onClose,
  planets,
  aspects,
  notableAspects,
  moon,
  date,
  earthData,
  earthLoading,
}: CrystalMessageProps) {
  const { lang } = useTranslation()

  const keyPlanet = useMemo(
    () => getKeyPlanet(planets, aspects, moon),
    [planets, aspects, moon],
  )

  const dateStr = date.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="font-[family-name:var(--font-display)] text-lg text-white/90 mb-1">
          {lang === 'lt' ? 'Kosminis Pulsas' : 'Cosmic Pulse'}
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
          {dateStr}
        </p>
      </div>

      {/* KPI Cards — stacked with 12px gap */}
      <div className="flex flex-col gap-3">
        {/* KPI 1: Element Balance */}
        <ElementBalance planets={planets} />

        {/* KPI 2: Key Player */}
        <KeyPlayer keyPlanet={keyPlanet} planets={planets} />

        {/* KPI 3: Cosmic Intensity */}
        <CosmicIntensity planets={planets} aspects={aspects} moon={moon} />

        {/* KPI 4: Kp Index */}
        <KpIndex kpIndex={earthData?.kpIndex ?? null} loading={earthLoading} />

        {/* KPI 5: Schumann Resonance */}
        <SchumannResonance />

        {/* KPI 6: Solar Activity */}
        <SolarActivity
          solarWindSpeed={earthData?.solarWindSpeed ?? null}
          solarFlareClass={earthData?.solarFlareClass ?? null}
          bzComponent={earthData?.bzComponent ?? null}
          loading={earthLoading}
        />

        {/* KPI 7: Aspect Map */}
        <AspectMap aspects={notableAspects} />
      </div>
    </Modal>
  )
}
