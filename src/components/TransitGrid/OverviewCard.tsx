'use client'

import { useState, useEffect, useRef } from 'react'
import type { OverviewCategory, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_ICONS } from '@/types/transit-grid'
import { useTranslation } from '@/i18n/useTranslation'

function getImpactColor(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsl(${hue}, 80%, 50%)`
}

function getImpactBg(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsla(${hue}, 80%, 50%, 0.06)`
}

function getImpactBorder(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsla(${hue}, 80%, 50%, 0.2)`
}

const CATEGORY_LABELS: Record<CategoryKey | 'monthly_summary' | 'grand_summary', { en: string; lt: string }> = {
  finance: { en: 'Finance & Abundance', lt: 'Finansai ir Perteklius' },
  relationships: { en: 'Relationships & Love', lt: 'Santykiai ir Meilė' },
  career: { en: 'Career & Purpose', lt: 'Karjera ir Paskirtis' },
  health: { en: 'Health & Wellbeing', lt: 'Sveikata ir Gerovė' },
  spiritual: { en: 'Spiritual Growth', lt: 'Dvasinis Augimas' },
  monthly_summary: { en: 'Overall Summary', lt: 'Bendra Apžvalga' },
  grand_summary: { en: 'Year Overview', lt: 'Metų Apžvalga' },
}

interface OverviewCardProps {
  data: OverviewCategory | null
  categoryKey: CategoryKey | 'grand_summary'
  isLoading: boolean
}

export default function OverviewCard({ data, categoryKey, isLoading }: OverviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { lang } = useTranslation()

  if (isLoading || !data) {
    return (
      <div
        className="rounded-xl border p-3 min-h-[140px] animate-pulse"
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="h-3 w-24 rounded bg-white/5" />
          <div className="h-6 w-6 rounded-full bg-white/5" />
        </div>
        <div className="space-y-2 mt-3">
          <div className="h-2 w-full rounded bg-white/5" />
          <div className="h-2 w-3/4 rounded bg-white/5" />
          <div className="h-2 w-1/2 rounded bg-white/5" />
        </div>
      </div>
    )
  }

  const score = data.impact_score
  const color = getImpactColor(score)
  const isGrand = categoryKey === 'grand_summary'
  const label = CATEGORY_LABELS[categoryKey]?.[lang] ?? CATEGORY_LABELS[categoryKey]?.en ?? ''
  const icon = isGrand ? '🌟' : CATEGORY_ICONS[categoryKey as CategoryKey]

  // For grand_summary the data shape is different
  const dataAny = data as unknown as Record<string, unknown>
  const hasYearTrend = 'year_trend' in dataAny && typeof dataAny.year_trend === 'string'

  const summaryText = hasYearTrend
    ? data.year_trend
    : (dataAny.dominant_theme as string) ?? ''

  const trajectory = data.trajectory ?? ''
  const peakMonths = data.peak_months ?? []

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        className="rounded-xl border p-3 min-h-[140px] cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        style={{
          background: getImpactBg(score),
          borderColor: getImpactBorder(score),
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px]">{icon}</span>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: `${color}22`,
              color: color,
              border: `1.5px solid ${color}66`,
            }}
          >
            {score}
          </div>
        </div>

        <p className="text-[11px] leading-[1.4] text-white/70 line-clamp-3 mb-2">
          {summaryText}
        </p>

        {trajectory && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] uppercase tracking-wider text-white/25">Trajectory:</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${color}15`, color: `${color}cc` }}
            >
              {trajectory}
            </span>
          </div>
        )}

        {peakMonths.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-1.5">
            {peakMonths.slice(0, 3).map((m, i) => (
              <span
                key={i}
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {expanded && (
        <OverviewModal
          data={data}
          categoryKey={categoryKey}
          label={label}
          icon={icon}
          color={color}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  )
}

function OverviewModal({
  data, categoryKey, label, icon, color, onClose
}: {
  data: OverviewCategory
  categoryKey: string
  label: string
  icon: string
  color: string
  onClose: () => void
}) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const score = data.impact_score
  const hasYearTrend = 'year_trend' in data
  const hasFullReading = 'full_reading' in data

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
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{icon}</span>
              <h2 className="text-lg font-semibold text-white/90">{label}</h2>
            </div>
            <p className="text-sm text-white/40">12-Month Overview</p>
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

        <div className="space-y-5">
          {hasYearTrend && data.year_trend && (
            <div
              className="p-4 rounded-xl border"
              style={{ background: `${color}08`, borderColor: `${color}15` }}
            >
              <p className="text-sm text-white/80 leading-relaxed">{data.year_trend}</p>
            </div>
          )}

          {hasFullReading && data.full_reading && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Detailed Reading</h3>
              <p className="text-sm text-white/70 leading-relaxed">{data.full_reading}</p>
            </div>
          )}

          {data.trajectory && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Trajectory</h3>
              <span
                className="text-sm px-3 py-1 rounded-full inline-block"
                style={{ background: `${color}15`, color: `${color}cc` }}
              >
                {data.trajectory}
              </span>
            </div>
          )}

          {data.peak_months && data.peak_months.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Peak Months</h3>
              <div className="flex gap-2 flex-wrap">
                {data.peak_months.map((m, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.key_events && (
            <div>
              <h3 className="text-xs uppercase tracking-wider text-white/30 mb-2">Key Events</h3>
              <p className="text-sm text-white/65 leading-relaxed">{data.key_events}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
