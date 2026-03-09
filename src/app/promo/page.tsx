'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { getPlanetPositions, getMoonData } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useLanguage } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import LanguageToggle from '@/components/LanguageToggle'
import ClientDetailsForm, { type NatalInfo } from '@/components/ReadingStudio/ClientDetailsForm'
import ScopeSelector, { type ScopeState } from '@/components/ReadingStudio/ScopeSelector'
import StyleSelector, { type ReadingStyle } from '@/components/ReadingStudio/StyleSelector'
import ReadingOutput from '@/components/ReadingStudio/ReadingOutput'
import ReadingHistory, { type ReadingHistoryEntry } from '@/components/ReadingStudio/ReadingHistory'

const HISTORY_KEY = 'astrara_reading_history'
const MAX_HISTORY = 10

export default function Page() {
  return (
    <LanguageProvider>
      <ReadingStudioPage />
    </LanguageProvider>
  )
}

function ReadingStudioPage() {
  const { t, lang } = useTranslation()
  const { lang: uiLang } = useLanguage()

  // Enable text selection on this page
  useEffect(() => {
    document.body.classList.add('allow-select')
    return () => { document.body.classList.remove('allow-select') }
  }, [])

  // --- Client Details State ---
  const [clientName, setClientName] = useState('')
  const [inputMode, setInputMode] = useState<'zodiac' | 'birthdate'>('zodiac')
  const [zodiacSign, setZodiacSign] = useState('aries')
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthCity, setBirthCity] = useState('')

  // --- Scope State ---
  const [scope, setScope] = useState<ScopeState>({
    currentSituation: true,
    thisMonth: true,
    nextThreeMonths: true,
    thisYear: true,
    nextYear: false,
    relationship: false,
  })

  // --- Style State ---
  const [style, setStyle] = useState<ReadingStyle>('accessible')
  const [readingLanguage, setReadingLanguage] = useState<'en' | 'lt'>(uiLang)

  // Sync reading language with UI language on mount
  useEffect(() => { setReadingLanguage(uiLang) }, [uiLang])

  // --- Output State ---
  const [reading, setReading] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- History State ---
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([])

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) setHistory(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  function saveHistory(entries: ReadingHistoryEntry[]) {
    setHistory(entries)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
  }

  // --- Astronomy Calculations ---
  const currentTransits = useMemo(() => {
    const now = new Date()
    const positions = getPlanetPositions(now, 0, 0)
    const moon = getMoonData(now)
    return {
      positions: positions.map(p => ({
        glyph: p.glyph,
        name: p.name,
        sign: ZODIAC_SIGNS.find(z => z.id === p.zodiacSign)?.name ?? p.zodiacSign,
        degree: p.degreeInSign,
        retrograde: p.isRetrograde,
      })),
      moonPhase: moon.phase,
      moonIllumination: Math.round(moon.illumination * 100),
    }
  }, [])

  // Natal chart calculations from birth date
  const natalInfo: NatalInfo | null = useMemo(() => {
    if (inputMode !== 'birthdate' || !birthDate) return null
    const date = birthTime
      ? new Date(`${birthDate}T${birthTime}:00`)
      : new Date(`${birthDate}T12:00:00`)
    if (isNaN(date.getTime())) return null

    const positions = getPlanetPositions(date, 0, 0)
    const sun = positions.find(p => p.id === 'sun')
    const moon = positions.find(p => p.id === 'moon')

    const sunSign = sun ? ZODIAC_SIGNS.find(z => z.id === sun.zodiacSign) : null
    const moonSign = moon ? ZODIAC_SIGNS.find(z => z.id === moon.zodiacSign) : null

    return {
      sunSign: sunSign?.name ?? '',
      sunGlyph: sunSign?.glyph ?? '',
      moonSign: moonSign?.name ?? '',
      moonGlyph: moonSign?.glyph ?? '',
    }
  }, [inputMode, birthDate, birthTime])

  // --- Sign/DOB label for output ---
  const signOrDob = useMemo(() => {
    if (inputMode === 'zodiac') {
      const sign = ZODIAC_SIGNS.find(z => z.id === zodiacSign)
      return sign ? `${sign.glyph} ${sign.name}` : zodiacSign
    }
    if (natalInfo) {
      return `Sun in ${natalInfo.sunSign}, Moon in ${natalInfo.moonSign}`
    }
    return birthDate || ''
  }, [inputMode, zodiacSign, natalInfo, birthDate])

  // --- Generate Reading ---
  const topRef = useRef<HTMLDivElement>(null)
  const lastGenTime = useRef(0)

  const generateReading = useCallback(async () => {
    const now = Date.now()
    if (now - lastGenTime.current < 5000) return
    lastGenTime.current = now

    // Validation
    if (inputMode === 'zodiac' && !zodiacSign) return
    if (inputMode === 'birthdate' && !birthDate) return

    setIsGenerating(true)
    setError(null)
    setReading('')

    try {
      const zodiacSignName = inputMode === 'zodiac'
        ? ZODIAC_SIGNS.find(z => z.id === zodiacSign)?.name ?? zodiacSign
        : undefined

      const response = await fetch('/api/client-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName || undefined,
          inputMode,
          zodiacSign: zodiacSignName,
          birthDate: inputMode === 'birthdate' ? birthDate : undefined,
          birthTime: inputMode === 'birthdate' ? birthTime || undefined : undefined,
          birthCity: inputMode === 'birthdate' ? birthCity || undefined : undefined,
          scope,
          style,
          language: readingLanguage,
          currentTransits,
          natalPositions: natalInfo ? {
            sunSign: natalInfo.sunSign,
            moonSign: natalInfo.moonSign,
          } : undefined,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate reading')
      const data = await response.json()
      const readingText = data.reading

      setReading(readingText)

      // Save to history
      const scopeLabels = Object.entries(scope)
        .filter(([, v]) => v)
        .map(([k]) => k)

      const entry: ReadingHistoryEntry = {
        id: String(Date.now()),
        timestamp: new Date().toISOString(),
        clientName: clientName || undefined,
        inputMode,
        zodiacSign: inputMode === 'zodiac' ? zodiacSignName : undefined,
        birthDate: inputMode === 'birthdate' ? birthDate : undefined,
        scope: scopeLabels,
        style,
        language: readingLanguage,
        readingText,
      }

      const updated = [entry, ...history].slice(0, MAX_HISTORY)
      saveHistory(updated)

    } catch {
      setError(t('studio.failedGenerate'))
    } finally {
      setIsGenerating(false)
    }
  }, [
    inputMode, zodiacSign, birthDate, birthTime, birthCity,
    clientName, scope, style, readingLanguage,
    currentTransits, natalInfo, history, t,
  ])

  // --- Load from history ---
  function loadFromHistory(entry: ReadingHistoryEntry) {
    setReading(entry.readingText)
    if (entry.clientName) setClientName(entry.clientName)
    if (entry.inputMode) setInputMode(entry.inputMode)
    if (entry.zodiacSign) {
      const sign = ZODIAC_SIGNS.find(z => z.name === entry.zodiacSign)
      if (sign) setZodiacSign(sign.id)
    }
    if (entry.birthDate) setBirthDate(entry.birthDate)
  }

  // --- New Reading ---
  function handleNewReading() {
    setReading('')
    setError(null)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // --- Check if generate is possible ---
  const canGenerate = inputMode === 'zodiac'
    ? !!zodiacSign
    : !!birthDate

  const hasScopeSelected = Object.entries(scope).some(([k, v]) => k !== 'relationship' && v)

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--bg-deep, #07070F)' }} ref={topRef}>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold tracking-wide text-white/90">
              <span className="text-white/25 mr-2">✦</span>
              ASTRARA{' '}
              <span className="text-white/30 font-normal">{t('studio.title')}</span>
            </h1>
            <LanguageToggle />
          </div>
          <p className="text-white/30 text-sm mt-2">{t('studio.subtitle')}</p>
        </div>

        {/* ── CLIENT DETAILS ── */}
        <SectionHeader label={t('studio.clientDetails')} />
        <div
          className="mb-8 p-5 sm:p-6 rounded-2xl border"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <ClientDetailsForm
            clientName={clientName}
            onClientNameChange={setClientName}
            inputMode={inputMode}
            onInputModeChange={setInputMode}
            zodiacSign={zodiacSign}
            onZodiacSignChange={setZodiacSign}
            birthDate={birthDate}
            onBirthDateChange={setBirthDate}
            birthTime={birthTime}
            onBirthTimeChange={setBirthTime}
            birthCity={birthCity}
            onBirthCityChange={setBirthCity}
            natalInfo={natalInfo}
          />
        </div>

        {/* ── READING SCOPE ── */}
        <SectionHeader label={t('studio.readingScope')} />
        <div
          className="mb-8 p-5 sm:p-6 rounded-2xl border"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <ScopeSelector scope={scope} onChange={setScope} />
        </div>

        {/* ── READING STYLE ── */}
        <SectionHeader label={t('studio.readingStyle')} />
        <div
          className="mb-8 p-5 sm:p-6 rounded-2xl border"
          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <StyleSelector
            style={style}
            onStyleChange={setStyle}
            readingLanguage={readingLanguage}
            onLanguageChange={setReadingLanguage}
          />
        </div>

        {/* Generate Button */}
        <div className="mb-10">
          <button
            onClick={generateReading}
            disabled={isGenerating || !canGenerate || !hasScopeSelected}
            className="w-full py-3.5 rounded-xl text-sm font-medium tracking-wide transition-all cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: isGenerating
                ? 'rgba(139,92,246,0.1)'
                : 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(139,92,246,0.15))',
              border: '1px solid rgba(139,92,246,0.3)',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                {t('studio.generating')}
              </span>
            ) : (
              <span>✦ {t('studio.generate')}</span>
            )}
          </button>

          {error && (
            <p className="text-amber-400/70 text-sm mt-3 text-center">{error}</p>
          )}
        </div>

        {/* ── READING OUTPUT ── */}
        <ReadingOutput
          reading={reading}
          isGenerating={isGenerating}
          clientName={clientName}
          readingLanguage={readingLanguage}
          style={style}
          signOrDob={signOrDob}
          scope={scope}
          onNewReading={handleNewReading}
        />

        {/* Spacing before history */}
        {(reading || isGenerating) && <div className="h-10" />}

        {/* ── READING HISTORY ── */}
        <div className="mt-8 mb-12">
          <ReadingHistory
            history={history}
            onLoadReading={loadFromHistory}
            onClearHistory={() => saveHistory([])}
          />
        </div>

      </div>
    </div>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-white/15 text-xs">——</span>
      <span className="text-white/30 text-xs font-medium uppercase tracking-widest">{label}</span>
      <span className="text-white/15 text-xs">——</span>
    </div>
  )
}
