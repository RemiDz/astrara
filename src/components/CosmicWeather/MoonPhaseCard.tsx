'use client'

import type { MoonData } from '@/lib/astronomy'
import { useTranslation } from '@/i18n/useTranslation'
import { useContent } from '@/i18n/useContent'
import GlassCard from '@/components/ui/GlassCard'

interface MoonPhaseCardProps {
  moon: MoonData
}

export default function MoonPhaseCard({ moon }: MoonPhaseCardProps) {
  const { t } = useTranslation()
  const content = useContent()
  const phaseKey = moon.phase.toLowerCase().replace(/\s+/g, '-')
  const phaseInsight = content?.phaseMeanings?.[phaseKey]

  return (
    <GlassCard>
      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-3 font-mono">
        {t('moon.phase')}
      </p>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{moon.emoji}</span>
        <div>
          <h3 className="text-lg font-serif text-white/85">
            {moon.phase}
          </h3>
          <p className="text-xs text-white/35">
            {Math.round(moon.illumination * 100)}% {t('moon.illumination')}
          </p>
        </div>
      </div>

      <p className="text-sm text-white/45 mt-3">
        {t('moon.in')} {t(`zodiac.${moon.zodiacSign}`)} {moon.signGlyph} {moon.degreeInSign}°
      </p>

      {phaseInsight && (
        <p className="text-[13px] text-white/40 leading-relaxed mt-3">
          {phaseInsight.guidance}
        </p>
      )}
    </GlassCard>
  )
}
