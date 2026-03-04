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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 * index }}
    >
      <GlassCard onClick={onClick} className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0" style={{ color: planet.colour }}>
            {planet.glyph}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-serif text-white/85">
                {t(`planet.${planet.id}`)} in {t(`zodiac.${planet.zodiacSign}`)}
              </h3>
              {planet.isRetrograde && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                  Rx
                </span>
              )}
            </div>
            <p className="text-xs text-white/25 mb-2">
              {planet.signGlyph} {planet.degreeInSign}°
            </p>
            {insight && (
              <p className="text-[13px] text-white/40 leading-relaxed">
                {insight.oneLiner}
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}
