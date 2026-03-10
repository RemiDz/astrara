'use client'

import { useMemo } from 'react'
import type { MonthData, OverviewData, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_KEYS, CATEGORY_ICONS } from '@/types/transit-grid'
import TransitCard from './TransitCard'
import OverviewCard from './OverviewCard'
import { useTranslation } from '@/i18n/useTranslation'

function getImpactColor(score: number): string {
  const hue = 120 - ((score - 1) / 9) * 120
  return `hsl(${hue}, 80%, 50%)`
}

const CATEGORY_LABELS: Record<CategoryKey | 'monthly_summary', { en: string; lt: string }> = {
  finance: { en: 'Finance & Abundance', lt: 'Finansai ir Perteklius' },
  relationships: { en: 'Relationships & Love', lt: 'Santykiai ir Meilė' },
  career: { en: 'Career & Purpose', lt: 'Karjera ir Paskirtis' },
  health: { en: 'Health & Wellbeing', lt: 'Sveikata ir Gerovė' },
  spiritual: { en: 'Spiritual Growth', lt: 'Dvasinis Augimas' },
  monthly_summary: { en: 'Monthly Summary', lt: 'Mėnesio Santrauka' },
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
    <div className="w-full overflow-x-auto">
      <div
        className="grid gap-2 min-w-[1600px]"
        style={{
          gridTemplateColumns: '140px repeat(6, 1fr)',
          gridTemplateRows: 'auto',
        }}
      >
        {/* Empty top-left cell */}
        <div />

        {/* Column headers */}
        {allCategories.map((cat) => {
          const avg = columnAverages[cat]
          const color = avg > 0 ? getImpactColor(avg) : 'rgba(255,255,255,0.3)'
          return (
            <div
              key={cat}
              className="p-3 rounded-xl border text-center sticky top-0 z-10"
              style={{
                background: 'rgba(13,13,26,0.95)',
                borderColor: avg > 0 ? `${color}33` : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="text-sm mb-1">{CATEGORY_ICONS[cat]}</div>
              <div className="text-[11px] font-medium text-white/70 mb-1">
                {CATEGORY_LABELS[cat][lang]}
              </div>
              {avg > 0 && (
                <div
                  className="text-[10px] font-bold mx-auto w-fit px-2 py-0.5 rounded-full"
                  style={{ background: `${color}22`, color }}
                >
                  {avg}
                </div>
              )}
            </div>
          )
        })}

        {/* Month rows */}
        {monthLabels.map((label, rowIdx) => {
          const monthData = months[rowIdx]
          const rowAvg = rowAverages[rowIdx]
          const rowColor = rowAvg > 0 ? getImpactColor(rowAvg) : 'rgba(255,255,255,0.3)'
          const isLoadingRow = !monthData && loading
          const rowError = monthErrors?.[rowIdx] ?? null
          const isRetrying = currentMonth === rowIdx && !loading

          return (
            <div key={label} className="contents">
              {/* Row header (month label) */}
              <div
                className="p-3 rounded-xl border flex flex-col justify-center sticky left-0 z-10"
                style={{
                  background: rowError
                    ? 'rgba(248,113,113,0.04)'
                    : 'rgba(13,13,26,0.95)',
                  borderColor: rowError
                    ? 'rgba(248,113,113,0.2)'
                    : rowAvg > 0 ? `${rowColor}33` : 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="text-xs font-medium text-white/70">{label}</div>
                {rowAvg > 0 && (
                  <div
                    className="text-[10px] font-bold mt-1 w-fit px-2 py-0.5 rounded-full"
                    style={{ background: `${rowColor}22`, color: rowColor }}
                  >
                    {rowAvg}
                  </div>
                )}
                {rowError && onRetryMonth && (
                  <button
                    onClick={() => onRetryMonth(rowIdx)}
                    disabled={isRetrying}
                    className="mt-1.5 text-[9px] text-red-400/80 hover:text-red-300 cursor-pointer disabled:opacity-40"
                  >
                    {isRetrying ? '...' : '↻ Retry'}
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

        {/* Overview row */}
        <div className="contents">
          {/* Overview row header */}
          <div
            className="p-3 rounded-xl border flex flex-col justify-center sticky left-0 z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(13,13,26,0.95))',
              borderColor: 'rgba(139,92,246,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="text-xs font-medium text-white/80">
              {lang === 'lt' ? '12 Mėnesių Apžvalga' : '12-Month Overview'}
            </div>
            <div className="text-[9px] text-white/30 mt-0.5">
              {lang === 'lt' ? 'Metų sintezė' : 'Year synthesis'}
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
