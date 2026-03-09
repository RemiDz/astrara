'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { LearnHouse } from '@/i18n/content/en/learn-houses'

interface HouseCardProps {
  house: LearnHouse
}

export default function HouseCard({ house }: HouseCardProps) {
  const { t } = useTranslation()

  return (
    <div
      className="rounded-2xl border p-5 mb-3"
      style={{
        background: 'rgba(255,255,255,0.025)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <h3 className="text-base font-semibold text-white mb-1">
        {t('learn.house')} {house.number} &mdash; {house.name}
      </h3>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.naturalSign')}: {house.naturalSign}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.naturalPlanet')}: {house.naturalPlanet}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {house.description}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.inReadings')}
      </p>
      <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {house.inReadings}
      </p>
    </div>
  )
}
