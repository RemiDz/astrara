'use client'

import type { PlanetPosition, MoonData, AspectData } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { useTranslation } from '@/i18n/useTranslation'
import { getNotableAspects } from '@/lib/aspects'

interface SkyGlanceProps {
  positions: PlanetPosition[]
  moonData: MoonData
  aspects: AspectData[]
}

export default function SkyGlance({ positions, moonData, aspects }: SkyGlanceProps) {
  const { t } = useTranslation()
  const notable = getNotableAspects(aspects)

  return (
    <div
      className="p-5 sm:p-6 rounded-2xl border"
      style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
    >
      <div className="space-y-1.5">
        {positions.map(p => {
          const sign = ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)
          return (
            <div key={p.id} className="flex items-center gap-2 text-sm">
              <span style={{ color: p.colour }} className="w-5 text-center">{p.glyph}</span>
              <span className="text-white/50 w-16">{t(`planet.${p.id}`)}</span>
              <span className="text-white/70">
                {sign?.name ?? p.zodiacSign} {p.degreeInSign}&deg;
              </span>
              {p.isRetrograde && (
                <span className="text-amber-400/80 text-xs font-mono ml-1">Rx</span>
              )}
            </div>
          )
        })}

        {/* Moon phase */}
        <div className="flex items-center gap-2 text-sm pt-2 border-t border-white/5 mt-2">
          <span className="w-5 text-center">{moonData.emoji}</span>
          <span className="text-white/50">{moonData.phase}</span>
          <span className="text-white/40">{Math.round(moonData.illumination * 100)}%</span>
        </div>
      </div>

      {/* Key aspects */}
      {notable.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-xs text-white/25 uppercase tracking-wider mb-2">{t('social.keyAspect')}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {notable.slice(0, 4).map((a, i) => (
              <span key={i} className="text-sm text-white/60">
                {a.planet1Glyph}
                <span className="mx-1" style={{ color: a.colour }}>{a.symbol}</span>
                {a.planet2Glyph}
                <span className="text-white/25 text-xs ml-1">({a.orb}&deg;)</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
