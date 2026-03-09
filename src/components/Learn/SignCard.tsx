'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { LearnSign } from '@/i18n/content/en/learn-signs'
import { ZODIAC_SIGNS, ELEMENT_COLOURS } from '@/lib/zodiac'

interface SignCardProps {
  sign: LearnSign
}

export default function SignCard({ sign }: SignCardProps) {
  const { t } = useTranslation()
  const zodiacSign = ZODIAC_SIGNS.find(z => z.id === sign.id)
  const colour = zodiacSign ? ELEMENT_COLOURS[zodiacSign.element] : '#fff'

  return (
    <div
      className="rounded-2xl border p-5 mb-3"
      style={{
        background: 'rgba(255,255,255,0.025)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl" style={{ color: colour }}>{sign.glyph}</span>
        <h3 className="text-base font-semibold text-white">
          {sign.name} &mdash; {sign.title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.element')}: {sign.element}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.modality')}: {sign.modality}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.rulingPlanet')}: {sign.rulingPlanet}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.dates')}: {sign.dates}
        </span>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {t('learn.body')}: {sign.body}
        </span>
      </div>

      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {sign.description}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.shadow')}
      </p>
      <p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>
        {sign.shadow}
      </p>

      <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--text-muted)' }}>
        {t('learn.soundHealing')}
      </p>
      <p className="text-[13px] leading-relaxed mb-1" style={{ color: 'var(--text-secondary)' }}>
        {sign.soundHealing}
      </p>
      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
        {t('learn.keynote')}: {sign.keynote}
      </p>
    </div>
  )
}
