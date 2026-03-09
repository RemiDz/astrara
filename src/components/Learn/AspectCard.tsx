'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { LearnAspect } from '@/i18n/content/en/learn-aspects'

const ASPECT_COLOUR_MAP: Record<string, string> = {
  conjunction: '#FBBF24',
  sextile: '#60A5FA',
  square: '#F87171',
  trine: '#34D399',
  opposition: '#FB923C',
}

interface AspectCardProps {
  aspect: LearnAspect
}

export default function AspectCard({ aspect }: AspectCardProps) {
  const { t } = useTranslation()
  const colour = ASPECT_COLOUR_MAP[aspect.id] ?? '#fff'

  return (
    <div
      className="rounded-2xl border p-5 mb-3"
      style={{
        background: 'rgba(255,255,255,0.025)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl" style={{ color: colour }}>{aspect.symbol}</span>
        <h3 className="text-base font-semibold text-white">
          {aspect.name} ({aspect.angle}) &mdash; {aspect.title}
        </h3>
      </div>

      <p className="text-[11px] mb-3" style={{ color: 'var(--text-muted)' }}>
        {t('learn.energy')}: {aspect.energy}
      </p>

      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {aspect.description}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.inPractice')}
      </p>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
        {aspect.inPractice}
      </p>

      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
        {t('learn.visual')}: {aspect.visualColour}
      </p>
    </div>
  )
}
