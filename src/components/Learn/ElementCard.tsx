'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { LearnElement } from '@/i18n/content/en/learn-elements'
import { ELEMENT_COLOURS } from '@/lib/zodiac'

interface ElementCardProps {
  element: LearnElement
}

export default function ElementCard({ element }: ElementCardProps) {
  const { t } = useTranslation()
  const colour = ELEMENT_COLOURS[element.id] ?? '#fff'

  return (
    <div
      className="rounded-2xl border p-5 mb-3"
      style={{
        background: 'rgba(255,255,255,0.025)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <h3 className="text-base font-semibold mb-1" style={{ color: colour }}>
        {element.name}
      </h3>
      <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
        {element.signs}
      </p>

      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {element.description}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.approach')}
      </p>
      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {element.soundApproach}
      </p>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.frequencyRange')}: {element.frequencyRange}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.instruments')}: {element.instruments}
        </span>
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.caution')}
      </p>
      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {element.caution}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
        {t('learn.solfeggioConnections')}
      </p>
      <div className="space-y-1">
        {element.solfeggioConnections.map((c) => (
          <p key={c.sign} className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: colour }}>{c.sign}</span>: {c.frequency} ({c.quality})
          </p>
        ))}
      </div>
    </div>
  )
}
