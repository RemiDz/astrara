'use client'

import { useRef, useCallback } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage } from '@/i18n/LanguageContext'
import { useContent } from '@/i18n/useContent'
import { PLANETS } from '@/lib/planets'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'

interface BriefingPanelProps {
  planets: PlanetPosition[]
  aspects: AspectData[]
  displayDate: Date
  onPlanetTap: (id: string) => void
}

const SOUND_RECOMMENDATIONS: Record<string, { frequency: string; instruments: string }> = {
  fire: { frequency: '396 Hz', instruments: 'Drums, gongs, didgeridoo' },
  earth: { frequency: '174 Hz', instruments: 'Monochord, singing bowls, tuning forks' },
  air: { frequency: '528 Hz', instruments: 'Chimes, bells, flute, crystal bowls' },
  water: { frequency: '639 Hz', instruments: 'Crystal bowls, ocean drums, harmonium' },
}

function getDominantElement(planets: PlanetPosition[]): string {
  const counts: Record<string, number> = { fire: 0, earth: 0, air: 0, water: 0 }
  for (const p of planets) {
    const sign = ZODIAC_SIGNS.find(s => s.id === p.zodiacSign)
    if (sign) counts[sign.element]++
  }
  let max = 'fire'
  for (const [el, count] of Object.entries(counts)) {
    if (count > counts[max]) max = el
  }
  return max
}

export default function BriefingPanel({ planets, aspects, displayDate, onPlanetTap }: BriefingPanelProps) {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const { planetMeanings, signMeanings, aspectMeanings, planetPairAspects } = useContent()
  const locale = lang === 'lt' ? 'lt-LT' : 'en-GB'
  const planetRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const dateStr = displayDate.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const dominantElement = getDominantElement(planets)
  const recommendation = SOUND_RECOMMENDATIONS[dominantElement]

  const scrollToRef = useCallback((id: string) => {
    planetRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  // Expose scrollToRef so parent can call it
  // The parent uses onPlanetTap to scroll the wheel, and we handle scroll here
  // We use the planet id as ref keys

  const notableAspects = aspects.filter(a => a.orb < 5).slice(0, 8)

  return (
    <div className="px-4 mt-6">
      <div className="max-w-2xl mx-auto">
        <div
          className="rounded-2xl border p-5"
          style={{
            background: 'rgba(255,255,255,0.025)',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <h2 className="text-base font-semibold text-white mb-4">
            {t('learn.todaysSky')} &mdash; {dateStr}
          </h2>

          {/* Planet entries */}
          {planets.map(p => {
            const meta = PLANETS.find(m => m.id === p.id)
            if (!meta) return null
            const meaning = planetMeanings[p.id]?.[p.zodiacSign]
            const signName = t(`zodiac.${p.zodiacSign}`)

            return (
              <div
                key={p.id}
                ref={el => { planetRefs.current[p.id] = el }}
                className="mb-4 pb-4 border-b last:border-b-0"
                style={{ borderColor: 'rgba(255,255,255,0.05)' }}
              >
                <button
                  type="button"
                  onClick={() => onPlanetTap(p.id)}
                  className="flex items-center gap-2 mb-1 cursor-pointer"
                >
                  <span style={{ color: meta.colour }}>{meta.glyph}</span>
                  <span className="text-[13px] font-medium text-white">
                    {t(`planet.${p.id}`)} {t('learn.in')} {signName} ({p.degreeInSign}&deg;)
                    {p.isRetrograde ? ' — Rx' : ''}
                  </span>
                </button>
                {meaning && (
                  <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {meaning.oneLiner}
                  </p>
                )}
              </div>
            )
          })}

          {/* Aspects */}
          {notableAspects.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-3 mt-2" style={{ color: 'var(--text-muted)' }}>
                &mdash; {t('learn.activeAspects')} &mdash;
              </p>
              {notableAspects.map((a, i) => {
                const meaning = aspectMeanings[a.type]
                const pairKey1 = `${a.planet1}-${a.planet2}`
                const pairKey2 = `${a.planet2}-${a.planet1}`
                const pairMeaning = planetPairAspects[pairKey1]?.[a.type] || planetPairAspects[pairKey2]?.[a.type]

                return (
                  <div key={i} className="mb-2">
                    <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: a.colour }}>{a.planet1Glyph}</span>
                      {' '}{meaning?.name || a.type}{' '}
                      <span style={{ color: a.colour }}>{a.planet2Glyph}</span>
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                        {' '}({a.orb}&deg; orb)
                      </span>
                    </p>
                    {pairMeaning && (
                      <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {pairMeaning.length > 120 ? pairMeaning.slice(0, 120) + '...' : pairMeaning}
                      </p>
                    )}
                  </div>
                )
              })}
            </>
          )}

          {/* Sound recommendation */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
              &mdash; {t('learn.soundRecommendation')} &mdash;
            </p>
            <p className="text-[12px] mb-1" style={{ color: 'var(--text-muted)' }}>
              {t('learn.basedOnConfig')}
            </p>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              {t('learn.primaryFrequency')}: {recommendation.frequency}
            </p>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              {t('learn.instruments')}: {recommendation.instruments}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
