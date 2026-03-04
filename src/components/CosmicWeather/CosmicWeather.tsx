'use client'

import type { PlanetPosition, MoonData, AspectData } from '@/lib/astronomy'
import { useTranslation } from '@/i18n/useTranslation'
import MoonPhaseCard from './MoonPhaseCard'
import PlanetCard from './PlanetCard'
import AspectHighlight from './AspectHighlight'

interface CosmicWeatherProps {
  planets: PlanetPosition[]
  moon: MoonData
  notableAspects: AspectData[]
  onPlanetClick: (planet: PlanetPosition) => void
  onAspectClick: (aspect: AspectData) => void
}

export default function CosmicWeather({ planets, moon, notableAspects, onPlanetClick, onAspectClick }: CosmicWeatherProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Moon Phase */}
      <MoonPhaseCard moon={moon} />

      {/* Planet Cards */}
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-3 tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {t('weather.title')}
        </h2>
        <div className="space-y-3">
          {planets.map((planet, i) => (
            <PlanetCard
              key={planet.id}
              planet={planet}
              index={i}
              onClick={() => onPlanetClick(planet)}
            />
          ))}
        </div>
      </section>

      {/* Notable Aspects */}
      {notableAspects.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold mb-3 tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {t('weather.notableAspects')}
          </h2>
          <div className="space-y-3">
            {notableAspects.map((aspect, i) => (
              <AspectHighlight
                key={`${aspect.planet1}-${aspect.planet2}-${aspect.type}`}
                aspect={aspect}
                index={i}
                onClick={() => onAspectClick(aspect)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
