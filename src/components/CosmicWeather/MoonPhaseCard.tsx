'use client'

import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          {/* Moon visual */}
          <div className="relative flex-shrink-0">
            <MoonVisual illumination={moon.illumination} phase={moon.phase} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{moon.emoji}</span>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
                {moon.phase}
              </h3>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {Math.round(moon.illumination * 100)}% {t('moon.illumination')}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {t('moon.in')} {t(`zodiac.${moon.zodiacSign}`)} {moon.signGlyph} {moon.degreeInSign}°
            </p>
          </div>
        </div>

        {phaseInsight && (
          <p className="font-[family-name:var(--font-display)] text-sm italic mt-3 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            &ldquo;{phaseInsight.guidance}&rdquo;
          </p>
        )}
      </GlassCard>
    </motion.div>
  )
}

function MoonVisual({ illumination, phase }: { illumination: number; phase: string }) {
  const size = 56
  const r = size / 2 - 2
  const isWaxing = phase.toLowerCase().includes('waxing') || phase.toLowerCase().includes('first')

  // Calculate the illuminated portion
  const illumFraction = illumination
  // Crescent effect using two arcs
  const dx = r * (1 - 2 * illumFraction)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Moon body (dark side) */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="#1a1a2e" stroke="rgba(192,192,192,0.2)" strokeWidth={1} />

      {/* Illuminated side */}
      <path
        d={`
          M ${size / 2} ${size / 2 - r}
          A ${r} ${r} 0 0 ${isWaxing ? 1 : 0} ${size / 2} ${size / 2 + r}
          A ${Math.abs(dx)} ${r} 0 0 ${illumFraction > 0.5 ? (isWaxing ? 1 : 0) : (isWaxing ? 0 : 1)} ${size / 2} ${size / 2 - r}
          Z
        `}
        fill="#C0C0C0"
        opacity={0.85}
      />

      {/* Subtle glow */}
      <circle cx={size / 2} cy={size / 2} r={r + 4} fill="none" stroke="#C0C0C0" strokeWidth={1} opacity={0.1} />
    </svg>
  )
}
