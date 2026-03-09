'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { LearnPlanet } from '@/i18n/content/en/learn-planets'
import { PLANETS } from '@/lib/planets'

interface PlanetCardProps {
  planet: LearnPlanet
}

export default function PlanetCard({ planet }: PlanetCardProps) {
  const { t } = useTranslation()
  const meta = PLANETS.find(p => p.id === planet.id)
  const colour = meta?.colour ?? '#fff'

  return (
    <div
      className="rounded-2xl border p-5 mb-3"
      style={{
        background: 'rgba(255,255,255,0.025)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl" style={{ color: colour }}>{planet.glyph}</span>
        <h3 className="text-base font-semibold text-white">{planet.title}</h3>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.rules')}: {planet.rules}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.element')}: {planet.element}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.cycle')}: {planet.cycle}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {planet.description}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.inTransit')}
      </p>
      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {planet.inTransit}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.soundConnection')}
      </p>
      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {planet.soundConnection}
      </p>
    </div>
  )
}
