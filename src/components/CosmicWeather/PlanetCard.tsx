'use client'

import { motion } from 'framer-motion'
import type { PlanetPosition } from '@/lib/astronomy'
import { useTranslation } from '@/i18n/useTranslation'
import { useContent } from '@/i18n/useContent'
import GlassCard from '@/components/ui/GlassCard'

interface PlanetCardProps {
  planet: PlanetPosition
  index: number
  onClick: () => void
}

export default function PlanetCard({ planet, index, onClick }: PlanetCardProps) {
  const { t } = useTranslation()
  const content = useContent()
  const insight = content?.planetMeanings?.[planet.id]?.[planet.zodiacSign]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
    >
      <GlassCard onClick={onClick} className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0" style={{ color: planet.colour }}>
            {planet.glyph}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-white">
                {t(`planet.${planet.id}`)} {t('moon.in').toLowerCase() === 'moon in' ? 'in' : ''} {t(`zodiac.${planet.zodiacSign}`)}
              </h3>
              {planet.isRetrograde && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                  Rx
                </span>
              )}
            </div>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              {planet.signGlyph} {planet.degreeInSign}°
            </p>
            {insight && (
              <p className="font-[family-name:var(--font-display)] text-sm italic leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                &ldquo;{insight.oneLiner}&rdquo;
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
