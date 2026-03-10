'use client'

import { useState, useEffect, useRef } from 'react'
import type { OverviewCategory, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_ICONS } from '@/types/transit-grid'
import { useTranslation } from '@/i18n/useTranslation'

/* ─── Impact color (bright backgrounds) ─── */

function getImpactColor(score: number): string {
  if (score <= 3) return '#2D8E4E'
  if (score <= 6) return '#D4960F'
  return '#C44536'
}

function getImpactBgLight(score: number): string {
  const base = getImpactColor(score)
  // Return a very light tint of the impact color for pill backgrounds
  if (score <= 3) return '#E8F5EC'
  if (score <= 6) return '#FDF3E0'
  return '#FDEAE8'
}

/* ─── Category labels ─── */

const CATEGORY_LABELS: Record<CategoryKey | 'monthly_summary' | 'grand_summary', { en: string; lt: string }> = {
  finance: { en: 'Finance & Abundance', lt: 'Finansai ir Perteklius' },
  relationships: { en: 'Relationships & Love', lt: 'Santykiai ir Meilė' },
  career: { en: 'Career & Purpose', lt: 'Karjera ir Paskirtis' },
  health: { en: 'Health & Wellbeing', lt: 'Sveikata ir Gerovė' },
  spiritual: { en: 'Spiritual Growth', lt: 'Dvasinis Augimas' },
  monthly_summary: { en: 'Overall Summary', lt: 'Bendra Apžvalga' },
  grand_summary: { en: 'Year Overview', lt: 'Metų Apžvalga' },
}

/* ─── Props ─── */

interface OverviewCardProps {
  data: OverviewCategory | null
  categoryKey: CategoryKey | 'grand_summary'
  isLoading: boolean
}

/* ═══════════════════════════════════════════
   OverviewCard
   ═══════════════════════════════════════════ */

export default function OverviewCard({ data, categoryKey, isLoading }: OverviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const { lang } = useTranslation()

  /* ─── Skeleton state ─── */
  if (isLoading || !data) {
    return (
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E6E2',
          borderRadius: 12,
          padding: 20,
          minHeight: 160,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div
            style={{
              height: 14,
              width: 120,
              borderRadius: 6,
              background: '#E8E6E2',
              animation: 'overviewPulse 1.8s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: 32,
              width: 32,
              borderRadius: '50%',
              background: '#E8E6E2',
              animation: 'overviewPulse 1.8s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
          <div
            style={{
              height: 10,
              width: '100%',
              borderRadius: 4,
              background: '#E8E6E2',
              animation: 'overviewPulse 1.8s ease-in-out infinite',
              animationDelay: '0.3s',
            }}
          />
          <div
            style={{
              height: 10,
              width: '75%',
              borderRadius: 4,
              background: '#E8E6E2',
              animation: 'overviewPulse 1.8s ease-in-out infinite',
              animationDelay: '0.4s',
            }}
          />
          <div
            style={{
              height: 10,
              width: '50%',
              borderRadius: 4,
              background: '#E8E6E2',
              animation: 'overviewPulse 1.8s ease-in-out infinite',
              animationDelay: '0.5s',
            }}
          />
        </div>
        <style>{`
          @keyframes overviewPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  /* ─── Resolved data ─── */
  const score = data.impact_score
  const color = getImpactColor(score)
  const isGrand = categoryKey === 'grand_summary'
  const label = CATEGORY_LABELS[categoryKey]?.[lang] ?? CATEGORY_LABELS[categoryKey]?.en ?? ''
  const icon = isGrand ? '🌟' : CATEGORY_ICONS[categoryKey as CategoryKey]

  // grand_summary has a slightly different shape
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
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E6E2',
          borderLeft: `3px solid ${color}`,
          borderRadius: 12,
          padding: 20,
          minHeight: 160,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          position: 'relative',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        {/* Header row: icon + label on left, score on right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#6B6880',
              }}
            >
              {label}
            </span>
          </div>

          {/* Score: top-right, 28pt bold */}
          <div style={{ textAlign: 'right', lineHeight: 1 }}>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: color,
                lineHeight: 1,
              }}
            >
              {score}
            </span>
            <div style={{ fontSize: 11, color: '#6B6880', marginTop: 2 }}>/10</div>
          </div>
        </div>

        {/* Summary text */}
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.6,
            color: '#1A1A2E',
            margin: '0 0 10px 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {summaryText}
        </p>

        {/* Trajectory badge */}
        {trajectory && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6880' }}>
              Trajectory
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: '3px 10px',
                borderRadius: 999,
                background: getImpactBgLight(score),
                color: color,
              }}
            >
              {trajectory}
            </span>
          </div>
        )}

        {/* Peak month pills */}
        {peakMonths.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {peakMonths.slice(0, 3).map((m, i) => (
              <span
                key={i}
                style={{
                  fontSize: 10,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: '#F2F0EC',
                  color: '#6B6880',
                  fontWeight: 500,
                }}
              >
                {m}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Expanded modal */}
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

/* ═══════════════════════════════════════════
   OverviewModal (bright redesign)
   ═══════════════════════════════════════════ */

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
  const impactColor = getImpactColor(score)
  const hasYearTrend = 'year_trend' in data
  const hasFullReading = 'full_reading' in data

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: 16,
          border: '1px solid #E8E6E2',
          background: '#FFFFFF',
          padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
        }}
      >
        {/* ─── Modal header ─── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{label}</h2>
            </div>
            <p style={{ fontSize: 13, color: '#6B6880', margin: 0 }}>12-Month Overview</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Score circle */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#FFFFFF',
                border: `2.5px solid ${impactColor}`,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: impactColor, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 9, color: '#6B6880', lineHeight: 1, marginTop: 1 }}>/10</span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 22,
                lineHeight: 1,
                color: '#A8A5B5',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 6,
                transition: 'color 0.15s ease, background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1A1A2E'
                e.currentTarget.style.background = '#F2F0EC'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#A8A5B5'
                e.currentTarget.style.background = 'none'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* ─── Modal body ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Year trend / dominant theme */}
          {hasYearTrend && data.year_trend && (
            <div
              style={{
                padding: 16,
                borderRadius: 10,
                background: getImpactBgLight(score),
                border: `1px solid ${impactColor}20`,
              }}
            >
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>{data.year_trend}</p>
            </div>
          )}

          {/* Full reading */}
          {hasFullReading && data.full_reading && (
            <div>
              <h3
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B6880',
                  margin: '0 0 8px 0',
                }}
              >
                Detailed Reading
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>{data.full_reading}</p>
            </div>
          )}

          {/* Trajectory */}
          {data.trajectory && (
            <div>
              <h3
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B6880',
                  margin: '0 0 8px 0',
                }}
              >
                Trajectory
              </h3>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '5px 14px',
                  borderRadius: 999,
                  background: getImpactBgLight(score),
                  color: impactColor,
                }}
              >
                {data.trajectory}
              </span>
            </div>
          )}

          {/* Peak months */}
          {data.peak_months && data.peak_months.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B6880',
                  margin: '0 0 8px 0',
                }}
              >
                Peak Months
              </h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {data.peak_months.map((m, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      padding: '5px 14px',
                      borderRadius: 999,
                      background: '#F2F0EC',
                      color: '#1A1A2E',
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key events */}
          {data.key_events && (
            <div>
              <h3
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6B6880',
                  margin: '0 0 8px 0',
                }}
              >
                Key Events
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: '#1A1A2E', opacity: 0.8, margin: 0 }}>
                {data.key_events}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
