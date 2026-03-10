'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import LanguageToggle from '@/components/LanguageToggle'
import TransitGrid from '@/components/TransitGrid/TransitGrid'
import type { MonthData, OverviewData } from '@/types/transit-grid'
import { CATEGORY_KEYS } from '@/types/transit-grid'
import { generateCosmicBlueprint } from '@/lib/cosmic-blueprint-pdf'

const STORAGE_KEY = 'astrara-transit-grid'
const MAX_CONCURRENT = 4

export default function Page() {
  return (
    <LanguageProvider>
      <TransitGridPage />
    </LanguageProvider>
  )
}

function getMonthLabels(): { labels: string[]; dates: { year: number; month: number }[] } {
  const now = new Date()
  const labels: string[] = []
  const dates: { year: number; month: number }[] = []

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    labels.push(d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))
    dates.push({ year: d.getFullYear(), month: d.getMonth() })
  }

  return { labels, dates }
}

function TransitGridPage() {
  const { t } = useTranslation()
  const { lang: uiLang } = useLanguage()

  const { labels: monthLabels, dates: monthDates } = getMonthLabels()

  // State
  const [months, setMonths] = useState<(MonthData | null)[]>(Array(12).fill(null))
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [overviewLoading, setOverviewLoading] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [cachedLang, setCachedLang] = useState<string | null>(null)

  // Birth chart data (optional)
  const [clientName, setClientName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')

  // Ref to track if generation is in progress
  const generatingRef = useRef(false)

  // Enable text selection
  useEffect(() => {
    document.body.classList.add('allow-select')
    return () => { document.body.classList.remove('allow-select') }
  }, [])

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.months && Array.isArray(parsed.months)) {
          setMonths(parsed.months)
          setCompletedCount(parsed.months.filter((m: MonthData | null) => m !== null).length)
        }
        if (parsed.overview) setOverview(parsed.overview)
        if (parsed.lang) setCachedLang(parsed.lang)
      }
    } catch { /* ignore */ }
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    if (months.some(m => m !== null) || overview) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        months,
        overview,
        lang: cachedLang,
        timestamp: Date.now(),
      }))
    }
  }, [months, overview, cachedLang])

  const buildBirthData = (): string | undefined => {
    if (!birthDate) return undefined
    let s = `Born: ${birthDate}`
    if (birthTime) s += ` at ${birthTime}`
    return s
  }

  // Generate all readings
  const generateReadings = useCallback(async () => {
    if (generatingRef.current) return
    generatingRef.current = true
    setLoading(true)
    setError(null)
    setCompletedCount(0)
    setMonths(Array(12).fill(null))
    setOverview(null)
    setCachedLang(uiLang)

    const birthData = buildBirthData()
    const results: (MonthData | null)[] = Array(12).fill(null)

    // Rate-limited parallel fetching
    const queue = monthDates.map((d, i) => ({ ...d, index: i }))
    let active = 0
    let queueIdx = 0
    let completed = 0

    await new Promise<void>((resolve) => {
      const processNext = () => {
        if (completed === 12) {
          resolve()
          return
        }

        while (active < MAX_CONCURRENT && queueIdx < queue.length) {
          const item = queue[queueIdx++]
          active++

          fetch('/api/transit-grid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'month',
              year: item.year,
              month: item.month,
              language: uiLang,
              birthData,
            }),
          })
            .then(res => res.json())
            .then(json => {
              if (json.error) {
                console.error(`Month ${item.index} error:`, json.error)
                results[item.index] = null
              } else {
                results[item.index] = json.data as MonthData
              }
            })
            .catch(err => {
              console.error(`Month ${item.index} fetch error:`, err)
              results[item.index] = null
            })
            .finally(() => {
              active--
              completed++
              setCompletedCount(completed)
              setMonths([...results])
              processNext()
            })
        }
      }

      processNext()
    })

    // Now generate the overview with all monthly data
    setOverviewLoading(true)
    try {
      const summaries = results
        .filter((m): m is MonthData => m !== null)
        .map(m => {
          const catSummaries = CATEGORY_KEYS.map(cat => {
            const c = m.categories[cat]
            return `${cat}: impact ${c.impact_score}/10 — ${c.key_theme}`
          }).join('\n')
          const ms = m.categories.monthly_summary
          return `Month: ${m.month}\n${catSummaries}\nOverall: ${ms.impact_score}/10 — ${ms.dominant_theme}`
        })

      if (summaries.length > 0) {
        const overviewRes = await fetch('/api/transit-grid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'overview',
            language: uiLang,
            monthSummaries: summaries,
          }),
        })

        const overviewJson = await overviewRes.json()
        if (overviewJson.data) {
          setOverview(overviewJson.data as OverviewData)
        }
      }
    } catch (err) {
      console.error('Overview generation error:', err)
    } finally {
      setOverviewLoading(false)
    }

    setLoading(false)
    generatingRef.current = false
  }, [uiLang, birthDate, birthTime, monthDates])

  const handleDownloadPdf = useCallback(async () => {
    const validMonths = months.filter((m): m is MonthData => m !== null)
    if (validMonths.length === 0) return
    await generateCosmicBlueprint({
      months: validMonths,
      overview,
      clientName,
      birthDate,
      birthTime,
      language: uiLang,
    })
  }, [months, overview, clientName, birthDate, birthTime, uiLang])

  const hasData = months.some(m => m !== null)
  const isLangMismatch = cachedLang !== null && cachedLang !== uiLang && hasData
  const totalCalls = 13
  const progressPct = loading || overviewLoading
    ? Math.round((completedCount + (overview ? 1 : 0)) / totalCalls * 100)
    : 0

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-deep, #07070F)' }}>
      {/* Top Bar */}
      <div
        className="sticky top-0 z-50 border-b px-4 py-3"
        style={{
          background: 'rgba(7,7,15,0.9)',
          borderColor: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-semibold tracking-wide text-white/90">
              <span className="text-white/25 mr-1.5">✦</span>
              ASTRARA
              <span className="text-white/30 font-normal ml-2">
                {t('grid.title')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Client info inputs */}
            <input
              type="text"
              placeholder={t('grid.clientName')}
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border bg-transparent text-white/70 placeholder-white/20 outline-none focus:border-white/20 w-32"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            />
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border bg-transparent text-white/70 outline-none focus:border-white/20"
              style={{ borderColor: 'rgba(255,255,255,0.08)', colorScheme: 'dark' }}
            />
            <input
              type="time"
              value={birthTime}
              onChange={e => setBirthTime(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border bg-transparent text-white/70 outline-none focus:border-white/20"
              style={{ borderColor: 'rgba(255,255,255,0.08)', colorScheme: 'dark' }}
            />

            <LanguageToggle />

            <button
              onClick={generateReadings}
              disabled={loading || overviewLoading}
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? 'rgba(139,92,246,0.1)'
                  : 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(139,92,246,0.15))',
                border: '1px solid rgba(139,92,246,0.3)',
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {loading || overviewLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  {t('grid.generating')}
                </span>
              ) : hasData ? (
                <span>↻ {t('grid.regenerate')}</span>
              ) : (
                <span>✦ {t('grid.generate')}</span>
              )}
            </button>

            {hasData && !loading && !overviewLoading && (
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))',
                  border: '1px solid rgba(201,168,76,0.3)',
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                {t('grid.downloadPdf')}
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {(loading || overviewLoading) && (
          <div className="max-w-[1800px] mx-auto mt-2">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: 'linear-gradient(90deg, #8B5CF6, #A78BFA)',
                  }}
                />
              </div>
              <span className="text-[10px] text-white/40 whitespace-nowrap">
                {completedCount}/{totalCalls} {t('grid.complete')}
              </span>
            </div>
          </div>
        )}

        {/* Language mismatch warning */}
        {isLangMismatch && !loading && (
          <div className="max-w-[1800px] mx-auto mt-2">
            <div className="flex items-center gap-2 text-[10px] text-amber-400/60">
              <span>⚠</span>
              <span>{t('grid.langMismatch')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        {!hasData && !loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="text-4xl mb-4 opacity-30">✦</div>
            <h2 className="text-lg text-white/50 mb-2">
              {t('grid.emptyTitle')}
            </h2>
            <p className="text-sm text-white/25 max-w-md mb-6">
              {t('grid.emptyDesc')}
            </p>
            <p className="text-xs text-white/15">
              {t('grid.emptyHint')}
            </p>
          </div>
        )}

        {(hasData || loading) && (
          <>
            {/* Client name display */}
            {clientName && (
              <div className="mb-4">
                <span className="text-xs text-white/30">
                  {t('grid.readingFor')}
                </span>
                <span className="text-sm text-white/60 ml-2">{clientName}</span>
                {birthDate && (
                  <span className="text-xs text-white/25 ml-3">
                    ({birthDate}{birthTime ? ` ${birthTime}` : ''})
                  </span>
                )}
              </div>
            )}

            <TransitGrid
              months={months}
              overview={overview}
              monthLabels={monthLabels}
              loading={loading}
              completedCount={completedCount}
              overviewLoading={overviewLoading}
            />
          </>
        )}

        {error && (
          <div className="mt-4 p-4 rounded-xl border text-center" style={{ background: 'rgba(248,113,113,0.05)', borderColor: 'rgba(248,113,113,0.2)' }}>
            <p className="text-sm text-red-400/70">{error}</p>
          </div>
        )}
      </div>

      {/* Pulse glow keyframe */}
      <style jsx global>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
