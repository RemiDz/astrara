'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import LanguageToggle from '@/components/LanguageToggle'
import TransitGrid from '@/components/TransitGrid/TransitGrid'
import type { MonthData, OverviewData } from '@/types/transit-grid'
import { CATEGORY_KEYS } from '@/types/transit-grid'
import { generateBlueprintPdf } from '@/lib/cosmic-blueprint-pdf'
import type { BlueprintMonthNarrative, BlueprintYearOverview, BlueprintData, BlueprintEclipseRetroData } from '@/types/cosmic-blueprint'
import { computeRitualCalendarData } from '@/lib/transit-computation'

const STORAGE_KEY = 'astrara-transit-grid'
const BLUEPRINT_STORAGE_KEY = 'astrara-cosmic-blueprint'
const DELAY_BETWEEN_CALLS = 2000
const BLUEPRINT_DELAY = 3000

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

// ─── Blueprint Progress Modal ───

function BlueprintModal({
  stage,
  partProgress,
  onClose,
  error,
}: {
  stage: 'transits' | 'narrative' | 'pdf' | 'done' | 'error'
  partProgress: number // 0, 1, 2, 3
  onClose: () => void
  error: string | null
}) {
  const stageLabels = {
    transits: 'Computing planetary transits...',
    narrative: `Writing your personal reading... Part ${partProgress} of 3`,
    pdf: 'Designing your report...',
    done: 'Your Cosmic Blueprint is ready!',
    error: 'Generation failed',
  }

  const stageIcons = {
    transits: '🪐',
    narrative: '✍️',
    pdf: '📄',
    done: '✨',
    error: '⚠️',
  }

  const pct = stage === 'transits' ? 10
    : stage === 'narrative' ? 10 + (partProgress / 3) * 70
    : stage === 'pdf' ? 90
    : stage === 'done' ? 100
    : 0

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative w-full max-w-md mx-4 p-8 rounded-2xl border"
        style={{
          background: 'linear-gradient(180deg, #0D0D1A 0%, #12122A 100%)',
          borderColor: 'rgba(196,162,101,0.2)',
        }}
      >
        {/* Close button (only when done or error) */}
        {(stage === 'done' || stage === 'error') && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/30 hover:text-white/60 text-lg cursor-pointer"
          >
            ✕
          </button>
        )}

        {/* Icon */}
        <div className="text-center mb-6">
          <span className="text-4xl">{stageIcons[stage]}</span>
        </div>

        {/* Title */}
        <h3
          className="text-center text-lg font-semibold mb-2 tracking-wide"
          style={{ color: 'rgba(196,162,101,0.9)' }}
        >
          Crafting your Cosmic Blueprint
        </h3>

        {/* Stage label */}
        <p className="text-center text-sm text-white/50 mb-6">
          {stageLabels[stage]}
        </p>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #C4A265, #D4B878)',
            }}
          />
        </div>

        {/* Three stage indicators */}
        <div className="flex justify-between text-[10px] text-white/30 mb-4">
          <span className={stage === 'transits' ? 'text-white/70' : ''}>Transits</span>
          <span className={stage === 'narrative' ? 'text-white/70' : ''}>Narrative</span>
          <span className={stage === 'pdf' || stage === 'done' ? 'text-white/70' : ''}>Design</span>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-center text-xs text-red-400/70 mt-2">{error}</p>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ───

function TransitGridPage() {
  const { t } = useTranslation()
  const { lang: uiLang } = useLanguage()

  const { labels: monthLabels, dates: monthDates } = getMonthLabels()

  // Grid state
  const [months, setMonths] = useState<(MonthData | null)[]>(Array(12).fill(null))
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(false)
  const [overviewLoading, setOverviewLoading] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [cachedLang, setCachedLang] = useState<string | null>(null)
  const [monthErrors, setMonthErrors] = useState<(string | null)[]>(Array(12).fill(null))
  const [currentMonth, setCurrentMonth] = useState<number | null>(null)
  const [generationDone, setGenerationDone] = useState(false)

  // Blueprint state
  const [blueprintLoading, setBlueprintLoading] = useState(false)
  const [blueprintStage, setBlueprintStage] = useState<'transits' | 'narrative' | 'pdf' | 'done' | 'error'>('transits')
  const [blueprintPart, setBlueprintPart] = useState(0)
  const [blueprintError, setBlueprintError] = useState<string | null>(null)
  const [, setBlueprintCached] = useState(false)

  // Birth chart data (optional)
  const [clientName, setClientName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')

  const generatingRef = useRef(false)
  const blueprintRef = useRef(false)

  // Enable text selection
  useEffect(() => {
    document.body.classList.add('allow-select')
    return () => { document.body.classList.remove('allow-select') }
  }, [])

  // Load grid from localStorage
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

    // Check for cached blueprint
    try {
      const bp = localStorage.getItem(BLUEPRINT_STORAGE_KEY)
      if (bp) setBlueprintCached(true)
    } catch { /* ignore */ }
  }, [])

  // Save grid to localStorage
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

  // Fetch a single month reading (grid)
  const fetchMonth = useCallback(async (
    year: number, month: number, language: string, birthData?: string
  ): Promise<{ data: MonthData | null; error: string | null }> => {
    try {
      const res = await fetch('/api/transit-grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'month', year, month, language, birthData }),
      })
      const json = await res.json()
      if (json.error) return { data: null, error: json.error }
      return { data: json.data as MonthData, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Network error' }
    }
  }, [])

  // Retry a single failed month
  const retrySingleMonth = useCallback(async (index: number) => {
    const d = monthDates[index]
    const birthData = buildBirthData()

    setMonthErrors(prev => { const n = [...prev]; n[index] = null; return n })
    setCurrentMonth(index)

    const { data, error: err } = await fetchMonth(d.year, d.month, uiLang, birthData)

    setMonths(prev => { const n = [...prev]; n[index] = data; return n })
    setMonthErrors(prev => { const n = [...prev]; n[index] = err; return n })
    setCurrentMonth(null)
  }, [monthDates, uiLang, fetchMonth, birthDate, birthTime])

  // Generate grid readings
  const generateReadings = useCallback(async () => {
    if (generatingRef.current) return
    generatingRef.current = true
    setLoading(true)
    setError(null)
    setCompletedCount(0)
    setMonths(Array(12).fill(null))
    setOverview(null)
    setCachedLang(uiLang)
    setMonthErrors(Array(12).fill(null))
    setGenerationDone(false)

    const birthData = buildBirthData()
    const results: (MonthData | null)[] = Array(12).fill(null)
    const errors: (string | null)[] = Array(12).fill(null)

    // Generate month 1 first as test
    {
      const d = monthDates[0]
      setCurrentMonth(0)
      const { data, error: err } = await fetchMonth(d.year, d.month, uiLang, birthData)
      results[0] = data
      errors[0] = err
      setCompletedCount(1)
      setMonths([...results])
      setMonthErrors([...errors])

      if (err) {
        setError(`First month failed: ${err}. Check API configuration.`)
        setCurrentMonth(null)
        setLoading(false)
        setGenerationDone(true)
        generatingRef.current = false
        return
      }
    }

    // Months 2–12
    for (let i = 1; i < monthDates.length; i++) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_CALLS))
      const d = monthDates[i]
      setCurrentMonth(i)
      const { data, error: err } = await fetchMonth(d.year, d.month, uiLang, birthData)
      results[i] = data
      errors[i] = err
      if (err) console.error(`[promo] Month ${i + 1} failed:`, err)
      setCompletedCount(i + 1)
      setMonths([...results])
      setMonthErrors([...errors])
    }
    setCurrentMonth(null)

    // Overview
    const successCount = results.filter(m => m !== null).length
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
          body: JSON.stringify({ type: 'overview', language: uiLang, monthSummaries: summaries }),
        })
        const overviewJson = await overviewRes.json()
        if (overviewJson.data) setOverview(overviewJson.data as OverviewData)
      }
    } catch (err) {
      console.error('Overview generation error:', err)
    } finally {
      setOverviewLoading(false)
    }

    const failedCount = errors.filter(e => e !== null).length
    if (failedCount > 0) {
      setError(`${successCount}/12 months generated. ${failedCount} failed — click retry on failed cards.`)
    }

    setLoading(false)
    setGenerationDone(true)
    generatingRef.current = false
  }, [uiLang, birthDate, birthTime, monthDates, fetchMonth])

  // ─── Generate Cosmic Blueprint (Premium PDF) ───

  const generateBlueprint = useCallback(async (forceRegenerate: boolean = false) => {
    if (blueprintRef.current) return
    blueprintRef.current = true
    setBlueprintLoading(true)
    setBlueprintError(null)
    setBlueprintStage('transits')
    setBlueprintPart(0)

    // Check cache first
    if (!forceRegenerate) {
      try {
        const cached = localStorage.getItem(BLUEPRINT_STORAGE_KEY)
        if (cached) {
          const data = JSON.parse(cached) as BlueprintData
          // Validate cache — same client, same language, less than 24h old
          const isValid =
            data.clientName === clientName &&
            data.birthDate === birthDate &&
            data.language === uiLang &&
            Date.now() - data.generatedAt < 24 * 60 * 60 * 1000

          if (isValid && data.months.length >= 12) {
            // Use cached — skip to PDF generation
            setBlueprintStage('pdf')
            // Recompute ritual calendar (fast, pure computation)
            const cachedRitualCal = data.ritualCalendar || computeRitualCalendarData(monthDates)
            await generateBlueprintPdf({
              months: data.months,
              yearOverview: data.year_overview,
              eclipseRetroData: data.year_overview?.eclipses_and_retrogrades || null,
              ritualCalendar: cachedRitualCal,
              clientName: data.clientName,
              birthDate: data.birthDate,
              birthTime: data.birthTime,
              language: data.language,
            })
            setBlueprintStage('done')
            setBlueprintLoading(false)
            blueprintRef.current = false
            return
          }
        }
      } catch { /* ignore cache errors */ }
    }

    try {
      // Stage 1: Transit data computation + ritual calendar
      setBlueprintStage('transits')
      const ritualCalendar = computeRitualCalendarData(monthDates)
      await new Promise(r => setTimeout(r, 300)) // Brief visual pause

      // Stage 2: Narrative generation (3 API calls)
      setBlueprintStage('narrative')

      const allMonths: BlueprintMonthNarrative[] = []
      let yearOverview: BlueprintYearOverview | null = null
      let eclipseRetroData: BlueprintEclipseRetroData | null = null

      // Part 1: Months 1-4
      setBlueprintPart(1)
      const part1Dates = monthDates.slice(0, 4)
      const res1 = await fetch('/api/cosmic-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part: 1,
          monthDates: part1Dates,
          language: uiLang,
          clientName,
          birthDate,
          birthTime,
        }),
      })
      const json1 = await res1.json()
      if (json1.error) throw new Error(json1.error)
      allMonths.push(...(json1.months || []))

      // Extract narrative thread from Part 1 for continuity
      const thread1 = allMonths.map(m =>
        `${m.month}: ${m.opening} Key themes: ${m.month_synthesis?.substring(0, 100) || ''}`
      ).join('\n')

      await new Promise(r => setTimeout(r, BLUEPRINT_DELAY))

      // Part 2: Months 5-8 (with narrative thread from Part 1)
      setBlueprintPart(2)
      const part2Dates = monthDates.slice(4, 8)
      const res2 = await fetch('/api/cosmic-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part: 2,
          monthDates: part2Dates,
          language: uiLang,
          clientName,
          birthDate,
          birthTime,
          narrativeThread: thread1,
        }),
      })
      const json2 = await res2.json()
      if (json2.error) throw new Error(json2.error)
      allMonths.push(...(json2.months || []))

      await new Promise(r => setTimeout(r, BLUEPRINT_DELAY))

      // Part 3: Months 9-12 + Year Overview + Eclipse/Retro
      setBlueprintPart(3)
      const part3Dates = monthDates.slice(8, 12)

      // Build full summary of months 1-8 for year overview + narrative thread
      const summaryOfPrev = allMonths.map(m =>
        `${m.month}: Overall ${m.overall_score}/10. ${m.opening} ${m.month_synthesis?.substring(0, 80) || ''}`
      ).join('\n')

      const res3 = await fetch('/api/cosmic-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part: 3,
          monthDates: part3Dates,
          allMonthDates: monthDates,
          language: uiLang,
          clientName,
          birthDate,
          birthTime,
          allMonthsSummary: summaryOfPrev,
        }),
      })
      const json3 = await res3.json()
      if (json3.error) throw new Error(json3.error)
      allMonths.push(...(json3.months || []))
      yearOverview = json3.year_overview || null
      eclipseRetroData = json3.eclipseRetroData || null

      // Cache the data
      const blueprintData: BlueprintData = {
        months: allMonths,
        year_overview: yearOverview,
        ritualCalendar,
        clientName,
        birthDate,
        birthTime,
        language: uiLang,
        generatedAt: Date.now(),
      }
      try {
        localStorage.setItem(BLUEPRINT_STORAGE_KEY, JSON.stringify(blueprintData))
        setBlueprintCached(true)
      } catch { /* localStorage might be full */ }

      // Stage 3: PDF generation
      setBlueprintStage('pdf')
      await generateBlueprintPdf({
        months: allMonths,
        yearOverview,
        eclipseRetroData,
        ritualCalendar,
        clientName,
        birthDate,
        birthTime,
        language: uiLang,
      })

      setBlueprintStage('done')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[blueprint] Error:', msg)
      setBlueprintError(msg)
      setBlueprintStage('error')
    } finally {
      setBlueprintLoading(false)
      blueprintRef.current = false
    }
  }, [monthDates, uiLang, clientName, birthDate, birthTime])

  const hasData = months.some(m => m !== null)
  const isLangMismatch = cachedLang !== null && cachedLang !== uiLang && hasData
  const totalCalls = 13
  const progressPct = loading || overviewLoading
    ? Math.round((completedCount + (overview ? 1 : 0)) / totalCalls * 100)
    : 0

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-deep, #07070F)' }}>
      {/* Blueprint Progress Modal */}
      {blueprintLoading && (
        <BlueprintModal
          stage={blueprintStage}
          partProgress={blueprintPart}
          onClose={() => setBlueprintLoading(false)}
          error={blueprintError}
        />
      )}
      {/* Show done/error modal briefly */}
      {!blueprintLoading && (blueprintStage === 'done' || blueprintStage === 'error') && blueprintError !== null && (
        <BlueprintModal
          stage={blueprintStage}
          partProgress={3}
          onClose={() => { setBlueprintStage('transits'); setBlueprintError(null) }}
          error={blueprintError}
        />
      )}

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

            {/* Button 1: Generate Grid (purple) */}
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
                  {completedCount > 0 ? `${completedCount}/12` : t('grid.generating')}
                </span>
              ) : hasData ? (
                <span>↻ {t('grid.regenerate')}</span>
              ) : (
                <span>✦ {t('grid.generate')}</span>
              )}
            </button>

            {/* Button 2: Cosmic Blueprint (gold) — always visible, independent */}
            <button
              onClick={() => generateBlueprint(false)}
              disabled={blueprintLoading}
              className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer active:scale-[0.97] disabled:cursor-not-allowed"
              style={{
                background: blueprintLoading
                  ? 'rgba(196,162,101,0.08)'
                  : 'linear-gradient(135deg, rgba(196,162,101,0.15), rgba(196,162,101,0.05))',
                border: '1px solid rgba(196,162,101,0.4)',
                color: 'rgba(196,162,101,0.9)',
                backdropFilter: 'blur(8px)',
                opacity: blueprintLoading ? 0.7 : 1,
              }}
            >
              {blueprintLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-current/20 border-t-current/60 rounded-full animate-spin" />
                  {blueprintStage === 'narrative'
                    ? `Crafting... ${blueprintPart}/3`
                    : blueprintStage === 'pdf'
                      ? 'Building PDF...'
                      : 'Preparing...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span style={{ fontSize: '11px' }}>&#11015;</span>
                  Cosmic Blueprint
                </span>
              )}
            </button>
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
                {currentMonth !== null && !overviewLoading
                  ? `${monthLabels[currentMonth]} (${completedCount + 1}/13)`
                  : overviewLoading
                    ? `Overview (${totalCalls}/${totalCalls})`
                    : `${completedCount}/${totalCalls}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Generation complete summary */}
        {generationDone && !loading && !overviewLoading && (
          <div className="max-w-[1800px] mx-auto mt-2">
            <span className="text-[10px] text-white/30">
              {months.filter(m => m !== null).length}/12 months + {overview ? '1' : '0'} overview generated
            </span>
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
              monthErrors={monthErrors}
              onRetryMonth={retrySingleMonth}
              currentMonth={currentMonth}
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
