'use client'

import { useState } from 'react'
import type { CategoryReading, MonthlySummary, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_ICONS } from '@/types/transit-grid'
import TransitCardModal from './TransitCardModal'

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

/**
 * Impact color: green (low) -> amber (mid) -> red (high)
 *   1-3: #2D8E4E (green)
 *   4-6: #D4960F (amber)
 *   7-10: #C44536 (red)
 * Interpolates linearly between anchor points.
 */
function getImpactColor(score: number): string {
  const s = Math.max(1, Math.min(10, score))

  if (s <= 3) {
    // Green #2D8E4E to Amber #D4960F  (score 1-3, t=0..1)
    const t = (s - 1) / 2
    const r = Math.round(0x2D + (0xD4 - 0x2D) * t)
    const g = Math.round(0x8E + (0x96 - 0x8E) * t)
    const b = Math.round(0x4E + (0x0F - 0x4E) * t)
    return `rgb(${r},${g},${b})`
  }
  if (s <= 6) {
    // Amber #D4960F to Red #C44536  (score 4-6, t=0..1)
    const t = (s - 4) / 2
    const r = Math.round(0xD4 + (0xC4 - 0xD4) * t)
    const g = Math.round(0x96 + (0x45 - 0x96) * t)
    const b = Math.round(0x0F + (0x36 - 0x0F) * t)
    return `rgb(${r},${g},${b})`
  }
  // 7-10: solid red
  return '#C44536'
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

  // ── Error state ──────────────────────────────────────────────
  if (!data && error && !isLoading) {
    return (
      <div
        style={{
          fontFamily: FONT_STACK,
          background: '#FFFFFF',
          border: '1px solid #E8E6E2',
          borderLeft: '3px solid #C44536',
          borderRadius: 8,
          padding: 20,
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: '#C44536', marginBottom: 4 }}>
          Failed
        </span>
        <span style={{ fontSize: 12, color: '#C44536', opacity: 0.7 }}>
          Retry
        </span>
      </div>
    )
  }

  // ── Loading / skeleton state ─────────────────────────────────
  if (isLoading || !data) {
    return (
      <div
        style={{
          fontFamily: FONT_STACK,
          background: '#FFFFFF',
          border: '1px solid #E8E6E2',
          borderLeft: '3px solid #E8E6E2',
          borderRadius: 8,
          padding: 20,
          minHeight: 140,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        {/* Score skeleton */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <div
            className="animate-pulse"
            style={{
              width: 32,
              height: 40,
              borderRadius: 6,
              background: '#E8E6E2',
            }}
          />
        </div>
        {/* Theme skeleton lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            className="animate-pulse"
            style={{ height: 10, width: '85%', borderRadius: 4, background: '#E8E6E2' }}
          />
          <div
            className="animate-pulse"
            style={{ height: 10, width: '60%', borderRadius: 4, background: '#E8E6E2' }}
          />
        </div>
        {/* Pill skeletons */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
          <div
            className="animate-pulse"
            style={{ height: 20, width: 36, borderRadius: 10, background: '#E8E6E2' }}
          />
          <div
            className="animate-pulse"
            style={{ height: 20, width: 36, borderRadius: 10, background: '#E8E6E2' }}
          />
          <div
            className="animate-pulse"
            style={{ height: 20, width: 36, borderRadius: 10, background: '#E8E6E2' }}
          />
        </div>
      </div>
    )
  }

  // ── Data present — render full card ──────────────────────────
  const score = data.impact_score
  const impactColor = getImpactColor(score)
  const isCategoryReading = 'key_theme' in data
  const isSummary = 'dominant_theme' in data

  const theme = isCategoryReading
    ? (data as CategoryReading).key_theme
    : isSummary
      ? (data as MonthlySummary).dominant_theme
      : ''

  const reading = data.full_reading || ''

  const planets = isCategoryReading
    ? (data as CategoryReading).planetary_breakdown.map(p => p.symbol)
    : isSummary
      ? (data as MonthlySummary).key_players.map(name => {
          const glyphs: Record<string, string> = {
            Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
            Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
          }
          return glyphs[name] || name.charAt(0)
        })
      : []

  return (
    <>
      <div
        onClick={() => setExpanded(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(true) }}
        style={{
          fontFamily: FONT_STACK,
          background: '#FFFFFF',
          border: '1px solid #E8E6E2',
          borderLeft: `3px solid ${impactColor}`,
          borderRadius: 8,
          padding: 20,
          minHeight: isOverview ? 160 : 140,
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          transition: 'transform 200ms ease, box-shadow 200ms ease',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(-1px)'
          el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)'
        }}
      >
        {/* Top row: category icon left, score top-right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#9B97A8',
              userSelect: 'none',
            }}
          >
            {CATEGORY_ICONS[categoryKey]}
          </span>

          {/* Score — top right */}
          <div style={{ textAlign: 'right', lineHeight: 1, flexShrink: 0 }}>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: impactColor,
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: 11,
                color: '#6B6880',
                fontWeight: 400,
                display: 'block',
                marginTop: 1,
              }}
            >
              /10
            </span>
          </div>
        </div>

        {/* Theme headline */}
        <p
          className="line-clamp-3"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#1A1A2E',
            lineHeight: 1.4,
            margin: '0 0 6px 0',
          }}
        >
          {theme}
        </p>

        {/* Reading text (brief) */}
        {reading && (
          <p
            className="line-clamp-3"
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: '#1A1A2E',
              lineHeight: 1.6,
              margin: '0 0 auto 0',
              opacity: 0.72,
            }}
          >
            {reading}
          </p>
        )}

        {/* Planet pills */}
        {planets.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 12 }}>
            {planets.slice(0, 5).map((glyph, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  padding: '3px 9px',
                  borderRadius: 20,
                  background: '#F2F0EC',
                  color: '#1A1A2E',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}
              >
                {glyph}
              </span>
            ))}
            {planets.length > 5 && (
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 6px',
                  color: '#9B97A8',
                }}
              >
                +{planets.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Modal on click */}
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
