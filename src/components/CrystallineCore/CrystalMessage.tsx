'use client'

import { useMemo, useState, useCallback } from 'react'
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

// ── Collapsible explanation wrapper ──

function KpiExplanation({ i18nKey, t }: { i18nKey: string; t: (k: string) => string }) {
  const [open, setOpen] = useState(false)
  const toggle = useCallback(() => setOpen(v => !v), [])

  return (
    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <button
        type="button"
        onClick={toggle}
        className="text-[10px] text-white/25 hover:text-white/40 transition-colors select-none"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        {t('pulse.explain')} {open ? '▾' : '▸'}
      </button>
      {open && (
        <p
          className="text-xs leading-relaxed mt-2"
          style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-body)' }}
        >
          {t(i18nKey)}
        </p>
      )}
    </div>
  )
}

// ── Main component ──

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
  const { t, lang } = useTranslation()

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
        <div>
          <ElementBalance planets={planets} />
          <KpiExplanation i18nKey="pulse.explain.elementBalance" t={t} />
        </div>

        {/* KPI 2: Key Player */}
        <div>
          <KeyPlayer keyPlanet={keyPlanet} planets={planets} />
          <KpiExplanation i18nKey="pulse.explain.keyPlayer" t={t} />
        </div>

        {/* KPI 3: Cosmic Intensity */}
        <div>
          <CosmicIntensity planets={planets} aspects={aspects} moon={moon} />
          <KpiExplanation i18nKey="pulse.explain.cosmicIntensity" t={t} />
        </div>

        {/* KPI 4: Kp Index */}
        <div>
          <KpIndex kpIndex={earthData?.kpIndex ?? null} loading={earthLoading} />
          <KpiExplanation i18nKey="pulse.explain.kpIndex" t={t} />
        </div>

        {/* KPI 5: Schumann Resonance */}
        <div>
          <SchumannResonance />
          <KpiExplanation i18nKey="pulse.explain.schumann" t={t} />
        </div>

        {/* KPI 6: Solar Activity */}
        <div>
          <SolarActivity
            solarWindSpeed={earthData?.solarWindSpeed ?? null}
            solarFlareClass={earthData?.solarFlareClass ?? null}
            bzComponent={earthData?.bzComponent ?? null}
            loading={earthLoading}
          />
          <KpiExplanation i18nKey="pulse.explain.solarActivity" t={t} />
        </div>

        {/* KPI 7: Aspect Map */}
        <div>
          <AspectMap aspects={notableAspects} />
          <KpiExplanation i18nKey="pulse.explain.aspects" t={t} />
        </div>
      </div>
    </Modal>
  )
}
