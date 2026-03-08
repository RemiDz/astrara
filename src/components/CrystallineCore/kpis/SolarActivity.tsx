'use client'

import { useTranslation } from '@/i18n/useTranslation'

interface Props {
  solarWindSpeed: number | null
  solarFlareClass: string | null
  bzComponent: number | null
  loading?: boolean
}

function getWindColour(speed: number | null): string {
  if (!speed) return 'rgba(255,255,255,0.3)'
  if (speed < 400) return '#4ADE80'
  if (speed <= 600) return '#FFD700'
  return '#FF6B4A'
}

function getFlareColour(cls: string | null): string {
  if (!cls) return 'rgba(255,255,255,0.3)'
  const letter = cls.charAt(0).toUpperCase()
  if (letter === 'A' || letter === 'B') return '#4ADE80'
  if (letter === 'C') return '#FFD700'
  if (letter === 'M') return '#FF8C00'
  if (letter === 'X') return '#FF4444'
  return 'rgba(255,255,255,0.3)'
}

function getBzColour(bz: number | null): string {
  if (bz === null) return 'rgba(255,255,255,0.3)'
  return bz >= 0 ? '#4ADE80' : '#FF6B4A'
}

export default function SolarActivity({ solarWindSpeed, solarFlareClass, bzComponent, loading }: Props) {
  const { lang } = useTranslation()

  if (loading) {
    return (
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
          {lang === 'lt' ? 'Saulės Aktyvumas' : 'Solar Activity'}
        </p>
        <div className="h-12 rounded bg-white/5 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
        {lang === 'lt' ? 'Saulės Aktyvumas' : 'Solar Activity'}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {/* Solar Wind */}
        <div className="text-center">
          <p className="text-lg font-light" style={{ color: getWindColour(solarWindSpeed) }}>
            {solarWindSpeed !== null ? Math.round(solarWindSpeed) : '—'}
          </p>
          <p className="text-[9px] text-white/30 mt-0.5">km/s</p>
          <p className="text-[9px] text-white/20 mt-0.5">
            {lang === 'lt' ? 'Vėjas' : 'Wind'}
          </p>
        </div>

        {/* Flare Class */}
        <div className="text-center">
          <p className="text-lg font-light" style={{ color: getFlareColour(solarFlareClass) }}>
            {solarFlareClass ?? '—'}
          </p>
          <p className="text-[9px] text-white/30 mt-0.5">
            {lang === 'lt' ? 'klasė' : 'class'}
          </p>
          <p className="text-[9px] text-white/20 mt-0.5">
            {lang === 'lt' ? 'Žybsnis' : 'Flare'}
          </p>
        </div>

        {/* Bz */}
        <div className="text-center">
          <p className="text-lg font-light" style={{ color: getBzColour(bzComponent) }}>
            {bzComponent !== null ? bzComponent.toFixed(1) : '—'}
          </p>
          <p className="text-[9px] text-white/30 mt-0.5">nT</p>
          <p className="text-[9px] text-white/20 mt-0.5">Bz</p>
        </div>
      </div>
    </div>
  )
}
