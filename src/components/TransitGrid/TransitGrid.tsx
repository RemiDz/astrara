'use client'

import { useMemo } from 'react'
import type { MonthData, OverviewData, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_KEYS, CATEGORY_ICONS } from '@/types/transit-grid'
import TransitCard from './TransitCard'
import OverviewCard from './OverviewCard'
import { useTranslation } from '@/i18n/useTranslation'

/* ── Impact color: green → amber → red ── */
function lerpColor(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  t: number,
): string {
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${b})`
}

function getImpactColor(score: number): string {
  // 1-3 green #2D8E4E, 4-6 amber #D4960F, 7-10 red #C44536
  if (score <= 3) {
    const t = (score - 1) / 2
    return lerpColor(0x2D, 0x8E, 0x4E, 0xD4, 0x96, 0x0F, t)
  }
  if (score <= 6) {
    const t = (score - 4) / 2
    return lerpColor(0xD4, 0x96, 0x0F, 0xC4, 0x45, 0x36, t)
  }
  // 7-10: stay red
  const t = (score - 7) / 3
  return lerpColor(0xC4, 0x45, 0x36, 0x9E, 0x2A, 0x22, t)
}

/* ── Category colors ── */
const CATEGORY_COLORS: Record<CategoryKey | 'monthly_summary', string> = {
  finance: '#9B7D2E',
  relationships: '#B85C6F',
  career: '#3A5088',
  health: '#2A7B52',
  spiritual: '#6B4D8A',
  monthly_summary: '#7A6F5E',
}

const CATEGORY_LABELS: Record<CategoryKey | 'monthly_summary', { en: string; lt: string }> = {
  finance: { en: 'Finance & Abundance', lt: 'Finansai ir Perteklius' },
  relationships: { en: 'Relationships & Love', lt: 'Santykiai ir Meilė' },
  career: { en: 'Career & Purpose', lt: 'Karjera ir Paskirtis' },
  health: { en: 'Health & Wellbeing', lt: 'Sveikata ir Gerovė' },
  spiritual: { en: 'Spiritual Growth', lt: 'Dvasinis Augimas' },
  monthly_summary: { en: 'Monthly Summary', lt: 'Menesio Santrauka' },
}

interface TransitGridProps {
  months: (MonthData | null)[]
  overview: OverviewData | null
  monthLabels: string[]
  loading: boolean
  completedCount: number
  overviewLoading: boolean
  monthErrors?: (string | null)[]
  onRetryMonth?: (index: number) => void
  currentMonth?: number | null
}

export default function TransitGrid({ months, overview, monthLabels, loading, completedCount, overviewLoading, monthErrors, onRetryMonth, currentMonth }: TransitGridProps) {
  const { lang } = useTranslation()
  const allCategories: (CategoryKey | 'monthly_summary')[] = [...CATEGORY_KEYS, 'monthly_summary']

  // Compute column-level yearly averages
  const columnAverages = useMemo(() => {
    const avgs: Record<string, number> = {}
    for (const cat of allCategories) {
      const scores = months
        .filter((m): m is MonthData => m !== null)
        .map(m => {
          if (cat === 'monthly_summary') return m.categories.monthly_summary.impact_score
          return m.categories[cat].impact_score
        })
      avgs[cat] = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 : 0
    }
    return avgs
  }, [months])

  // Compute row-level monthly averages
  const rowAverages = useMemo(() => {
    return months.map(m => {
      if (!m) return 0
      const scores = CATEGORY_KEYS.map(cat => m.categories[cat].impact_score)
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
    })
  }, [months])

  return (
    <div className="w-full overflow-x-auto" style={{ background: '#FAF9F6' }}>
      <div
        className="grid min-w-[1600px]"
        style={{
          gridTemplateColumns: '140px repeat(6, 1fr)',
          gap: '12px',
          padding: '16px',
        }}
      >
        {/* ── Empty top-left cell ── */}
        <div />

        {/* ── Column headers ── */}
        {allCategories.map((cat) => {
          const avg = columnAverages[cat]
          const catColor = CATEGORY_COLORS[cat]
          const impactColor = avg > 0 ? getImpactColor(avg) : '#AAA'
          const isSummaryCol = cat === 'monthly_summary'

          return (
            <div
              key={cat}
              className="rounded-xl text-center relative"
              style={{
                background: isSummaryCol
                  ? 'linear-gradient(180deg, rgba(155,125,46,0.03) 0%, #FFFFFF 20%)'
                  : '#FFFFFF',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                borderTop: `3px solid ${catColor}`,
                padding: '16px 12px 14px',
              }}
            >
              {/* Category icon + name */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px' }}>{CATEGORY_ICONS[cat]}</span>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: catColor,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {CATEGORY_LABELS[cat][lang]}
                </span>
              </div>

              {/* Yearly average score */}
              {avg > 0 ? (
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: impactColor,
                    lineHeight: 1.1,
                  }}
                >
                  {avg}
                </div>
              ) : (
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#D0CEC8', lineHeight: 1.1 }}>
                  --
                </div>
              )}

              <div style={{ fontSize: '10px', color: '#6B6880', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'lt' ? 'Metinis vid.' : 'Yearly Avg'}
              </div>
            </div>
          )
        })}

        {/* ── Month rows ── */}
        {monthLabels.map((label, rowIdx) => {
          const monthData = months[rowIdx]
          const rowAvg = rowAverages[rowIdx]
          const rowImpactColor = rowAvg > 0 ? getImpactColor(rowAvg) : '#AAA'
          const isLoadingRow = !monthData && loading
          const rowError = monthErrors?.[rowIdx] ?? null
          const isRetrying = currentMonth === rowIdx && !loading

          return (
            <div key={label} className="contents">
              {/* Row header (month label) — sticky left */}
              <div
                className="rounded-xl flex flex-col justify-center"
                style={{
                  background: rowError ? '#FFF5F5' : '#F2F0EC',
                  padding: '14px 12px',
                  position: 'sticky',
                  left: 0,
                  zIndex: 10,
                  borderLeft: rowError ? '3px solid #E5A0A0' : 'none',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1A1A2E',
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </div>

                {rowAvg > 0 && (
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 700,
                      color: rowImpactColor,
                      lineHeight: 1.1,
                      marginTop: '4px',
                    }}
                  >
                    {rowAvg}
                  </div>
                )}

                {rowError && onRetryMonth && (
                  <button
                    onClick={() => onRetryMonth(rowIdx)}
                    disabled={isRetrying}
                    style={{
                      marginTop: '6px',
                      fontSize: '11px',
                      color: '#C44536',
                      background: 'none',
                      border: 'none',
                      cursor: isRetrying ? 'default' : 'pointer',
                      opacity: isRetrying ? 0.4 : 0.8,
                      padding: 0,
                      textAlign: 'left',
                    }}
                  >
                    {isRetrying ? '...' : '\u21BB Retry'}
                  </button>
                )}
              </div>

              {/* Category cells */}
              {CATEGORY_KEYS.map((cat) => (
                <TransitCard
                  key={`${rowIdx}-${cat}`}
                  data={monthData ? monthData.categories[cat] : null}
                  categoryKey={cat}
                  monthLabel={label}
                  isLoading={isLoadingRow || isRetrying}
                  error={rowError}
                />
              ))}

              {/* Monthly summary cell */}
              <TransitCard
                key={`${rowIdx}-summary`}
                data={monthData ? monthData.categories.monthly_summary : null}
                categoryKey="monthly_summary"
                monthLabel={label}
                isLoading={isLoadingRow || isRetrying}
                error={rowError}
              />
            </div>
          )
        })}

        {/* ── Overview row ── */}
        <div className="contents">
          {/* Overview row header */}
          <div
            className="rounded-xl flex flex-col justify-center"
            style={{
              background: '#F5F3EE',
              padding: '18px 12px',
              position: 'sticky',
              left: 0,
              zIndex: 10,
              borderLeft: '3px solid #6B4D8A',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#1A1A2E',
                lineHeight: 1.2,
              }}
            >
              {lang === 'lt' ? '12 Menesiu Apzvalga' : '12-Month Overview'}
            </div>
            <div style={{ fontSize: '11px', color: '#6B6880', marginTop: '3px' }}>
              {lang === 'lt' ? 'Metu sinteze' : 'Year synthesis'}
            </div>
          </div>

          {/* Overview category cells */}
          {CATEGORY_KEYS.map((cat) => (
            <OverviewCard
              key={`overview-${cat}`}
              data={overview ? overview.categories[cat] : null}
              categoryKey={cat}
              isLoading={overviewLoading}
            />
          ))}

          {/* Grand summary cell */}
          <OverviewCard
            key="overview-grand"
            data={overview ? (overview.categories.grand_summary as unknown as import('@/types/transit-grid').OverviewCategory) : null}
            categoryKey="grand_summary"
            isLoading={overviewLoading}
          />
        </div>
      </div>
    </div>
  )
}
