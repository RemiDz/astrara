'use client'

import type { PlanetPosition } from '@/lib/astronomy'
import { calculateDistance } from '@/lib/distance'
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
  const dist = calculateDistance(planet.distanceAU)

  return (
    <GlassCard onClick={onClick}>
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
          <p className="text-xs text-white/25 mb-1">
            {planet.signGlyph} {planet.degreeInSign}°
          </p>
          <p className="text-[11px] text-white/30 mb-2">
            <span style={{ color: planet.colour }}>{dist.formattedKm}</span> km · <span style={{ color: planet.colour }}>{dist.formattedMiles}</span> mi · ✦ {dist.formattedLightTravel}
          </p>
          {insight && (
            <p className="text-[13px] text-white/40 leading-relaxed">
              {insight.oneLiner}
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
