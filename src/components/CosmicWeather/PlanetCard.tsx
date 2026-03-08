'use client'

import type { PlanetPosition } from '@/lib/astronomy'
import { calculateDistance } from '@/lib/distance'
import { useTranslation } from '@/i18n/useTranslation'
import { useContent } from '@/i18n/useContent'
import GlassCard from '@/components/ui/GlassCard'
import { PLANET_DOMAINS } from '@/features/cosmic-reading/content/templates/planetDomains'
import GlossaryTerm from '@/components/GlossaryTerm'

interface PlanetCardProps {
  planet: PlanetPosition
  index: number
  onClick: () => void
}

export default function PlanetCard({ planet, index, onClick }: PlanetCardProps) {
  const { t, lang } = useTranslation()
  const content = useContent()
  const insight = content?.planetMeanings?.[planet.id]?.[planet.zodiacSign]
  const dist = calculateDistance(planet.distanceAU)
  const domain = PLANET_DOMAINS[planet.id]

  return (
    <GlassCard onClick={onClick}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" style={{ color: planet.colour }}>
          {planet.glyph}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-base font-serif text-white/85">
              {lang === 'lt'
                ? `${t(`planet.${planet.id}`)} ${t(`zodiac.${planet.zodiacSign}.loc`)}`
                : `${t(`planet.${planet.id}`)} in ${t(`zodiac.${planet.zodiacSign}`)}`}
            </h3>
            {planet.isRetrograde && (
              <GlossaryTerm termKey="retrograde">
                <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400">
                  Rx
                </span>
              </GlossaryTerm>
            )}
          </div>
          {domain && (
            <p className="text-[11px] mb-1" style={{ color: planet.colour, opacity: 0.6 }}>
              {domain[lang as 'en' | 'lt'] ?? domain.en}
            </p>
          )}
          <p className="text-xs text-white/25 mb-1">
            {planet.signGlyph} {planet.degreeInSign}°
          </p>
          <p className="text-[11px] text-white/30 mb-2">
            <span className="text-white/20">🌍</span>
            <span className="mx-1" style={{ opacity: 0.5 }}>&rarr;</span>
            <span style={{ color: planet.colour }}>{planet.glyph}</span>
            <span className="ml-1.5"><span style={{ color: planet.colour }}>{dist.formattedKm}</span> km · <span style={{ color: planet.colour }}>{dist.formattedMiles}</span> mi · ✦ {dist.formattedLightTravel}</span>
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
