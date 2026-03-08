'use client'

import type { MoonData } from '@/lib/astronomy'
import { useTranslation } from '@/i18n/useTranslation'
import { useContent } from '@/i18n/useContent'
import GlassCard from '@/components/ui/GlassCard'

interface MoonPhaseCardProps {
  moon: MoonData
}

const MOON_PHASE_NAMES_LT: Record<string, string> = {
  'New Moon': 'Jaunatis',
  'Waxing Crescent': 'Augantis Pjautuvas',
  'First Quarter': 'Pirmasis Ketvirtis',
  'Waxing Gibbous': 'Augantis Priešpilnis',
  'Full Moon': 'Pilnatis',
  'Waning Gibbous': 'Dylantis Priešpilnis',
  'Last Quarter': 'Paskutinis Ketvirtis',
  'Waning Crescent': 'Dylantis Pjautuvas',
}

export default function MoonPhaseCard({ moon }: MoonPhaseCardProps) {
  const { t, lang } = useTranslation()
  const content = useContent()
  const phaseKey = moon.phase.toLowerCase().replace(/\s+/g, '-')
  const phaseInsight = content?.phaseMeanings?.[phaseKey]
  const phaseName = lang === 'lt' ? (MOON_PHASE_NAMES_LT[moon.phase] ?? moon.phase) : moon.phase

  return (
    <GlassCard>
      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 mb-3 font-mono">
        {t('moon.phase')}
      </p>

      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{moon.emoji}</span>
        <div>
          <h3 className="text-lg font-serif text-white/85">
            {phaseName}
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
