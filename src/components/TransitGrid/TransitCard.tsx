'use client'

import { useState } from 'react'
import type { CategoryReading, MonthlySummary, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_ICONS } from '@/types/transit-grid'
import TransitCardModal from './TransitCardModal'

function getImpactColor(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsl(${hue}, 80%, 50%)`
}

function getImpactBg(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsla(${hue}, 80%, 50%, 0.08)`
}

function getImpactBorder(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsla(${hue}, 80%, 50%, 0.25)`
}

interface TransitCardProps {
  data: CategoryReading | MonthlySummary | null
  categoryKey: CategoryKey | 'monthly_summary'
  monthLabel: string
  isLoading: boolean
  isOverview?: boolean
  error?: string | null
}

export default function TransitCard({ data, categoryKey, monthLabel, isLoading, isOverview, error }: TransitCardProps) {
  const [expanded, setExpanded] = useState(false)

  // Error state — no data and there's an error for this row
  if (!data && error && !isLoading) {
    return (
      <div
        className="rounded-xl border p-3 min-h-[120px] flex flex-col items-center justify-center text-center"
        style={{
          background: 'rgba(248,113,113,0.03)',
          borderColor: 'rgba(248,113,113,0.15)',
        }}
      >
        <span className="text-red-400/50 text-lg mb-1">!</span>
        <span className="text-[9px] text-red-400/40">Failed</span>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div
        className="rounded-xl border p-3 min-h-[120px] animate-pulse"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderColor: 'rgba(255,255,255,0.05)',
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="h-3 w-20 rounded bg-white/5" />
          <div className="h-6 w-6 rounded-full bg-white/5" />
        </div>
        <div className="space-y-2 mt-3">
          <div className="h-2 w-full rounded bg-white/5" />
          <div className="h-2 w-3/4 rounded bg-white/5" />
        </div>
      </div>
    )
  }

  const score = data.impact_score
  const color = getImpactColor(score)
  const isHighImpact = score >= 7
  const isCategoryReading = 'key_theme' in data
  const isSummary = 'dominant_theme' in data

  const theme = isCategoryReading
    ? (data as CategoryReading).key_theme
    : isSummary
      ? (data as MonthlySummary).dominant_theme
      : ''

  const planets = isCategoryReading
    ? (data as CategoryReading).planetary_breakdown.map(p => p.symbol)
    : isSummary
      ? (data as MonthlySummary).key_players.map(name => {
          const glyphs: Record<string, string> = { Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇' }
          return glyphs[name] || name.charAt(0)
        })
      : []

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        className={`rounded-xl border p-3 min-h-[120px] cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg relative ${isOverview ? 'min-h-[140px]' : ''}`}
        style={{
          background: getImpactBg(score),
          borderColor: getImpactBorder(score),
          boxShadow: isHighImpact
            ? `0 0 20px hsla(${120 - ((score - 1) / 9) * 120}, 80%, 50%, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)`
            : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* High impact glow animation */}
        {isHighImpact && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              border: `1px solid ${color}`,
              opacity: 0.3,
              animation: 'pulseGlow 3s ease-in-out infinite',
            }}
          />
        )}

        {/* Impact score badge */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase tracking-wider text-white/25">
            {CATEGORY_ICONS[categoryKey]}
          </span>
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

        {/* Theme */}
        <p className="text-[11px] leading-[1.4] text-white/70 line-clamp-3 mb-2">
          {theme}
        </p>

        {/* Planet glyphs */}
        {planets.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-auto">
            {planets.slice(0, 5).map((glyph, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {glyph}
              </span>
            ))}
            {planets.length > 5 && (
              <span className="text-[10px] px-1.5 py-0.5 text-white/25">
                +{planets.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded modal */}
      {expanded && (
        <TransitCardModal
          data={data}
          categoryKey={categoryKey}
          monthLabel={monthLabel}
          onClose={() => setExpanded(false)}
        />
      )}
    </>
  )
}
