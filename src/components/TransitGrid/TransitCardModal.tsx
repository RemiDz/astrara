'use client'

import { useEffect, useRef } from 'react'
import type { CategoryReading, MonthlySummary, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_ICONS } from '@/types/transit-grid'
import { useTranslation } from '@/i18n/useTranslation'

function getImpactColor(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsl(${hue}, 80%, 50%)`
}

function getAspectColor(type: string): string {
  switch (type) {
    case 'trine': case 'sextile': return '#34D399'
    case 'square': case 'opposition': return '#FB923C'
    case 'conjunction': return '#A78BFA'
    default: return 'rgba(255,255,255,0.5)'
  }
}

const CATEGORY_LABELS: Record<CategoryKey | 'monthly_summary', { en: string; lt: string }> = {
  finance: { en: 'Finance & Abundance', lt: 'Finansai ir Perteklius' },
  relationships: { en: 'Relationships & Love', lt: 'Santykiai ir Meilė' },
  career: { en: 'Career & Purpose', lt: 'Karjera ir Paskirtis' },
  health: { en: 'Health & Wellbeing', lt: 'Sveikata ir Gerovė' },
  spiritual: { en: 'Spiritual Growth', lt: 'Dvasinis Augimas' },
  monthly_summary: { en: 'Monthly Summary', lt: 'Mėnesio Apžvalga' },
}

interface TransitCardModalProps {
  data: CategoryReading | MonthlySummary
  categoryKey: CategoryKey | 'monthly_summary'
  monthLabel: string
  onClose: () => void
}

export default function TransitCardModal({ data, categoryKey, monthLabel, onClose }: TransitCardModalProps) {
  const { lang } = useTranslation()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const score = data.impact_score
  const color = getImpactColor(score)
  const isCategoryReading = 'key_theme' in data
  const isSummary = 'dominant_theme' in data
  const label = CATEGORY_LABELS[categoryKey][lang]

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-6 sm:p-8"
        style={{
          background: 'rgba(13,13,26,0.95)',
          borderColor: `${color}33`,
          boxShadow: `0 0 40px ${color}15`,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{CATEGORY_ICONS[categoryKey]}</span>
              <h2 className="text-lg font-semibold text-white/90">{label}</h2>
            </div>
            <p className="text-sm text-white/40">{monthLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
              style={{
                background: `${color}22`,
                color: color,
                border: `2px solid ${color}66`,
              }}
            >
              {score}
            </div>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white/60 transition-colors text-xl leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>

        {isCategoryReading && (
          <CategoryReadingContent data={data as CategoryReading} color={color} />
        )}

        {isSummary && (
          <SummaryContent data={data as MonthlySummary} color={color} />
        )}
      </div>
    </div>
  )
}

function CategoryReadingContent({ data, color }: { data: CategoryReading; color: string }) {
  return (
    <div className="space-y-5">
      {/* Key Theme */}
      <div
        className="p-4 rounded-xl border"
        style={{ background: `${color}08`, borderColor: `${color}15` }}
      >
        <p className="text-sm text-white/80 leading-relaxed font-medium">{data.key_theme}</p>
      </div>

      {/* Full Reading */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Reading</h3>
        <p className="text-sm text-white/70 leading-relaxed">{data.full_reading}</p>
      </div>

      {/* Planetary Breakdown */}
      {data.planetary_breakdown && data.planetary_breakdown.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/30 mb-3">Planetary Breakdown</h3>
          <div className="space-y-3">
            {data.planetary_breakdown.map((planet, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{planet.symbol}</span>
                    <span className="text-sm font-medium text-white/80">{planet.planet}</span>
                    <span className="text-xs text-white/35">{planet.position}</span>
                  </div>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${getImpactColor(planet.impact_contribution * 2)}22`,
                      color: getImpactColor(planet.impact_contribution * 2),
                    }}
                  >
                    {planet.impact_contribution}/5
                  </div>
                </div>

                <p className="text-xs text-white/50 mb-2">{planet.category_effect}</p>

                {planet.aspects && planet.aspects.length > 0 && (
                  <div className="space-y-1">
                    {planet.aspects.map((aspect, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs">
                        <span style={{ color: getAspectColor(aspect.type) }}>{aspect.symbol}</span>
                        <span className="text-white/50">{aspect.type}</span>
                        <span className="text-white/40">{aspect.target_symbol} {aspect.target}</span>
                        <span className="text-white/30 text-[10px]">— {aspect.interpretation}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practical Guidance */}
      {data.practical_guidance && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Practical Guidance</h3>
          <p className="text-sm text-white/65 leading-relaxed">{data.practical_guidance}</p>
        </div>
      )}

      {/* Dates to Watch */}
      {data.dates_to_watch && data.dates_to_watch.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Dates to Watch</h3>
          <div className="space-y-1">
            {data.dates_to_watch.map((date, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-amber-400/60 mt-0.5">◆</span>
                <span className="text-white/55">{date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryContent({ data, color }: { data: MonthlySummary; color: string }) {
  return (
    <div className="space-y-5">
      {/* Dominant Theme */}
      <div
        className="p-4 rounded-xl border"
        style={{ background: `${color}08`, borderColor: `${color}15` }}
      >
        <p className="text-sm text-white/80 leading-relaxed font-medium">{data.dominant_theme}</p>
      </div>

      {/* Full Reading */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Reading</h3>
        <p className="text-sm text-white/70 leading-relaxed">{data.full_reading}</p>
      </div>

      {/* Key Players */}
      {data.key_players && data.key_players.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Key Players</h3>
          <div className="flex gap-2 flex-wrap">
            {data.key_players.map((planet, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full"
                style={{ background: 'rgba(139,92,246,0.1)', color: 'rgba(139,92,246,0.7)', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                {planet}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {data.opportunities && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Opportunities</h3>
          <p className="text-sm text-white/65 leading-relaxed">{data.opportunities}</p>
        </div>
      )}

      {/* Challenges */}
      {data.challenges && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Challenges</h3>
          <p className="text-sm text-white/65 leading-relaxed">{data.challenges}</p>
        </div>
      )}

      {/* Interrelations */}
      {data.interrelations && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">How Categories Interrelate</h3>
          <p className="text-sm text-white/65 leading-relaxed">{data.interrelations}</p>
        </div>
      )}
    </div>
  )
}
