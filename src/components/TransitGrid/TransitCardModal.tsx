'use client'

import { useEffect, useRef } from 'react'
import type { CategoryReading, MonthlySummary, CategoryKey } from '@/types/transit-grid'
import { CATEGORY_ICONS } from '@/types/transit-grid'
import { useTranslation } from '@/i18n/useTranslation'

function getImpactColor(score: number): string {
  if (score <= 3) return '#2D8E4E'
  if (score <= 6) return '#D4960F'
  return '#C44536'
}

function getAspectColor(type: string): string {
  switch (type) {
    case 'trine': case 'sextile': return '#2D8E4E'
    case 'square': case 'opposition': return '#C44536'
    case 'conjunction': return '#7B5EA7'
    default: return '#6B6880'
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
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="w-full overflow-y-auto"
        style={{
          maxWidth: '672px',
          maxHeight: '85vh',
          background: '#FFFFFF',
          border: '1px solid #E8E6E2',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        {/* Responsive padding bump at sm */}
        <style>{`
          @media (min-width: 640px) {
            .transit-modal-inner { padding: 32px !important; }
          }
        `}</style>
        <div className="transit-modal-inner" style={{ padding: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between" style={{ marginBottom: '24px' }}>
            <div>
              <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '18px' }}>{CATEGORY_ICONS[categoryKey]}</span>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A2E', margin: 0 }}>{label}</h2>
              </div>
              <p style={{ fontSize: '14px', color: '#6B6880', margin: 0 }}>{monthLabel}</p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: `2px solid ${color}`,
                  color: color,
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                {score}
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B6880',
                  fontSize: '22px',
                  lineHeight: 1,
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#1A1A2E' }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#6B6880' }}
              >
                &times;
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
    </div>
  )
}

/* ─── Section Header ─── */
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: '#6B6880',
        margin: '0 0 8px 0',
      }}
    >
      {children}
    </h3>
  )
}

/* ─── Category Reading Content ─── */
function CategoryReadingContent({ data, color }: { data: CategoryReading; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Key Theme */}
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: '#F8F7F4',
          border: '1px solid #E8E6E2',
        }}
      >
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', fontWeight: 500, margin: 0 }}>
          {data.key_theme}
        </p>
      </div>

      {/* Full Reading */}
      <div>
        <SectionHeader>Reading</SectionHeader>
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>
          {data.full_reading}
        </p>
      </div>

      {/* Planetary Breakdown */}
      {data.planetary_breakdown && data.planetary_breakdown.length > 0 && (
        <div>
          <SectionHeader>Planetary Breakdown</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.planetary_breakdown.map((planet, i) => {
              const contribColor = getImpactColor(planet.impact_contribution * 2)
              return (
                <div
                  key={i}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E6E2',
                  }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '16px' }}>{planet.symbol}</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E' }}>{planet.planet}</span>
                      <span style={{ fontSize: '12px', color: '#6B6880' }}>{planet.position}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '2px 10px',
                        borderRadius: '9999px',
                        background: `${contribColor}14`,
                        color: contribColor,
                      }}
                    >
                      {planet.impact_contribution}/5
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#6B6880', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                    {planet.category_effect}
                  </p>

                  {planet.aspects && planet.aspects.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {planet.aspects.map((aspect, j) => (
                        <div key={j} className="flex items-center gap-2" style={{ fontSize: '12px' }}>
                          <span style={{ color: getAspectColor(aspect.type), fontWeight: 600 }}>{aspect.symbol}</span>
                          <span style={{ color: getAspectColor(aspect.type), fontWeight: 500 }}>{aspect.type}</span>
                          <span style={{ color: '#6B6880' }}>{aspect.target_symbol} {aspect.target}</span>
                          <span style={{ color: '#9E9BB0', fontSize: '11px' }}>&mdash; {aspect.interpretation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Practical Guidance */}
      {data.practical_guidance && (
        <div>
          <SectionHeader>Practical Guidance</SectionHeader>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>
            {data.practical_guidance}
          </p>
        </div>
      )}

      {/* Dates to Watch */}
      {data.dates_to_watch && data.dates_to_watch.length > 0 && (
        <div>
          <SectionHeader>Dates to Watch</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {data.dates_to_watch.map((date, i) => (
              <div key={i} className="flex items-start gap-2" style={{ fontSize: '13px' }}>
                <span style={{ color: '#D4960F', marginTop: '2px' }}>&#9670;</span>
                <span style={{ color: '#1A1A2E' }}>{date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Summary Content ─── */
function SummaryContent({ data, color }: { data: MonthlySummary; color: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dominant Theme */}
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          background: '#F8F7F4',
          border: '1px solid #E8E6E2',
        }}
      >
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', fontWeight: 500, margin: 0 }}>
          {data.dominant_theme}
        </p>
      </div>

      {/* Full Reading */}
      <div>
        <SectionHeader>Reading</SectionHeader>
        <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>
          {data.full_reading}
        </p>
      </div>

      {/* Key Players */}
      {data.key_players && data.key_players.length > 0 && (
        <div>
          <SectionHeader>Key Players</SectionHeader>
          <div className="flex gap-2 flex-wrap">
            {data.key_players.map((planet, i) => (
              <span
                key={i}
                style={{
                  fontSize: '12px',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  background: '#F3F0FB',
                  color: '#7B5EA7',
                  border: '1px solid #E0DAF0',
                  fontWeight: 500,
                }}
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
          <SectionHeader>Opportunities</SectionHeader>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>
            {data.opportunities}
          </p>
        </div>
      )}

      {/* Challenges */}
      {data.challenges && (
        <div>
          <SectionHeader>Challenges</SectionHeader>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>
            {data.challenges}
          </p>
        </div>
      )}

      {/* Interrelations */}
      {data.interrelations && (
        <div>
          <SectionHeader>How Categories Interrelate</SectionHeader>
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#1A1A2E', margin: 0 }}>
            {data.interrelations}
          </p>
        </div>
      )}
    </div>
  )
}
