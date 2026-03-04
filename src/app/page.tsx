'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import { useRealTime } from '@/hooks/useRealTime'
import { useLocation } from '@/hooks/useLocation'
import { useAstroData } from '@/hooks/useAstroData'
import { searchCity, type UserLocation } from '@/lib/location'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import Starfield from '@/components/Starfield/Starfield'
import Header from '@/components/Header/Header'
import AstroWheel from '@/components/AstroWheel/AstroWheel'
import AstroWheel3DWrapper from '@/components/AstroWheel/AstroWheel3DWrapper'
import WheelTooltip, { type TooltipData } from '@/components/AstroWheel/WheelTooltip'
import CosmicWeather from '@/components/CosmicWeather/CosmicWeather'
import Shimmer from '@/components/ui/Shimmer'

function HomePage() {
  const { t } = useTranslation()
  const now = useRealTime(60000)
  const { location, loading: locationLoading, setLocation } = useLocation()
  const [dayOffset, setDayOffset] = useState(0)
  const [customDate, setCustomDate] = useState<Date | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [showBirthInput, setShowBirthInput] = useState(false)
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('12:00')
  const [birthCityQuery, setBirthCityQuery] = useState('')
  const [birthCityResults, setBirthCityResults] = useState<UserLocation[]>([])
  const [birthCity, setBirthCity] = useState<UserLocation | null>(null)
  const [birthSubmitted, setBirthSubmitted] = useState(false)
  const birthSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const baseDate = customDate ?? now
  const isToday = !customDate && dayOffset === 0

  const targetDate = useMemo(() => {
    const d = new Date(baseDate)
    d.setDate(d.getDate() + dayOffset)
    return d
  }, [baseDate, dayOffset])

  const lat = location?.lat ?? 51.5074
  const lng = location?.lng ?? -0.1278

  const astroData = useAstroData(targetDate, lat, lng)

  const handlePlanetTap = useCallback((planet: PlanetPosition) => {
    setSelectedPlanet(planet.id)
    setTooltip({ type: 'planet', data: planet })
  }, [])

  const handleSignTap = useCallback((signId: string) => {
    setTooltip({ type: 'sign', data: signId })
  }, [])

  const handleAspectTap = useCallback((aspect: AspectData) => {
    setTooltip({ type: 'aspect', data: aspect })
  }, [])

  const handleCloseTooltip = useCallback(() => {
    setTooltip(null)
    setSelectedPlanet(null)
  }, [])

  const trackEvent = (name: string, props?: Record<string, string>) => {
    if (typeof window !== 'undefined' && (window as unknown as { plausible?: (name: string, opts?: { props: Record<string, string> }) => void }).plausible) {
      (window as unknown as { plausible: (name: string, opts?: { props: Record<string, string> }) => void }).plausible(name, props ? { props } : undefined)
    }
  }

  const handleBirthCitySearch = (query: string) => {
    setBirthCityQuery(query)
    if (birthSearchTimerRef.current) clearTimeout(birthSearchTimerRef.current)
    if (query.length < 2) { setBirthCityResults([]); return }
    birthSearchTimerRef.current = setTimeout(async () => {
      const results = await searchCity(query)
      setBirthCityResults(results)
    }, 300)
  }

  const handleBirthSubmit = () => {
    const data = {
      date: birthDate,
      time: birthTime,
      city: birthCity?.city ?? birthCityQuery,
      lat: birthCity?.lat ?? null,
      lng: birthCity?.lng ?? null,
    }
    localStorage.setItem('astrara-birth-data', JSON.stringify(data))
    setBirthSubmitted(true)
    trackEvent('birth-chart-submit')
  }

  return (
    <div className="min-h-screen relative">
      <Starfield />

      <div className="relative z-10">
        <Header
          location={location}
          locationLoading={locationLoading}
          now={now}
          displayDate={targetDate}
          isToday={isToday}
          onLocationChange={(loc) => {
            setLocation(loc)
            trackEvent('location-detected', { city: loc.city })
          }}
          onDateChange={(date) => {
            setCustomDate(date)
            setDayOffset(0)
            trackEvent('date-pick', { date: date.toISOString().split('T')[0] })
          }}
        />

        <main className="max-w-5xl mx-auto px-4 pb-12">
          {/* Desktop layout: wheel left, weather right */}
          <div className="lg:flex lg:gap-8 lg:items-start">
            {/* Astro Wheel */}
            <div className="lg:flex-1 lg:sticky lg:top-4 py-4">
              {astroData ? (
                <AstroWheel3DWrapper
                  planets={astroData.planets}
                  aspects={astroData.aspects}
                  onPlanetTap={(p) => { handlePlanetTap(p); trackEvent('planet-tap', { planet: p.id }) }}
                  onSignTap={(s) => { handleSignTap(s); trackEvent('sign-tap', { sign: s }) }}
                  onAspectTap={(a) => { handleAspectTap(a); trackEvent('aspect-tap', { aspect: `${a.planet1}-${a.type}-${a.planet2}` }) }}
                  selectedPlanet={selectedPlanet}
                />
              ) : (
                <div className="w-full max-w-[90vw] md:max-w-[60vw] lg:max-w-[min(500px,45vw)] mx-auto aspect-square flex items-center justify-center">
                  <Shimmer className="w-full h-full rounded-full" />
                </div>
              )}

              {/* Day Navigation — directly below wheel */}
              <div className="flex items-center justify-center gap-2 py-4">
                <button
                  type="button"
                  onClick={() => { setDayOffset(prev => prev - 1); trackEvent('day-nav', { direction: 'yesterday' }) }}
                  className="px-4 py-2 rounded-xl text-sm select-none bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8 active:scale-95 transition-all duration-200"
                >
                  ← {t('nav.yesterday')}
                </button>
                <button
                  type="button"
                  onClick={() => { setCustomDate(null); setDayOffset(0) }}
                  className={`px-5 py-2 rounded-xl text-sm font-medium select-none active:scale-95 transition-all duration-200 ${
                    isToday
                      ? 'bg-purple-500/20 border border-purple-400/30 text-purple-300'
                      : 'bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8'
                  }`}
                >
                  {t('nav.today')}
                </button>
                <button
                  type="button"
                  onClick={() => { setDayOffset(prev => prev + 1); trackEvent('day-nav', { direction: 'tomorrow' }) }}
                  className="px-4 py-2 rounded-xl text-sm select-none bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8 active:scale-95 transition-all duration-200"
                >
                  {t('nav.tomorrow')} →
                </button>
              </div>

              {/* Birth chart CTA — subtle, always visible */}
              <button
                type="button"
                onClick={() => { setShowBirthInput(true); trackEvent('birth-chart-cta') }}
                className="flex items-center justify-center gap-1.5 mx-auto text-xs text-purple-300/50 hover:text-purple-300/80 transition-colors select-none py-2"
              >
                <span>✦</span>
                <span>{t('cta.birthChart')}</span>
                <span>→</span>
              </button>
            </div>

            {/* Cosmic Weather Panel */}
            <div className="lg:w-[400px] lg:flex-shrink-0 mt-6 lg:mt-4">
              {astroData ? (
                <CosmicWeather
                  planets={astroData.planets}
                  moon={astroData.moon}
                  notableAspects={astroData.notableAspects}
                  onPlanetClick={(p) => { handlePlanetTap(p); trackEvent('planet-tap', { planet: p.id }) }}
                  onAspectClick={(a) => { handleAspectTap(a); trackEvent('aspect-tap', { aspect: `${a.planet1}-${a.type}-${a.planet2}` }) }}
                />
              ) : (
                <div className="space-y-3">
                  <Shimmer className="h-24 w-full" />
                  <Shimmer className="h-20 w-full" />
                  <Shimmer className="h-20 w-full" />
                  <Shimmer className="h-20 w-full" />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center py-6 border-t border-white/5">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {t('footer.partOf')}{' '}
              <a
                href="https://harmonicwaves.app"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                style={{ color: 'var(--accent-purple)' }}
              >
                Harmonic Waves
              </a>
            </p>
          </footer>
        </main>
      </div>

      {/* Tooltip / Detail Panel */}
      <WheelTooltip
        tooltip={tooltip}
        planets={astroData?.planets ?? []}
        onClose={handleCloseTooltip}
      />

      {/* Birth Details Modal */}
      {showBirthInput && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowBirthInput(false); setBirthSubmitted(false) }}
          />
          <div className="relative z-10 w-full max-w-md mx-auto bg-[#0D0D1A]/95 backdrop-blur-xl border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 pb-8 animate-slide-up">
            {/* Handle bar (mobile) */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />

            {/* Close */}
            <button
              type="button"
              onClick={() => { setShowBirthInput(false); setBirthSubmitted(false) }}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors select-none text-lg"
              aria-label="Close"
            >
              ✕
            </button>

            {birthSubmitted ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-3">✦</p>
                <p className="text-white/80 text-sm">
                  {t('cta.comingSoon')}
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-[family-name:var(--font-display)] text-white/90 text-center mb-1">
                  {t('cta.birthChartTitle')}
                </h3>
                <p className="text-xs text-white/40 text-center mb-6">
                  {t('cta.birthChartSubtitle')}
                </p>

                {/* Date of Birth */}
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                  {t('form.dateOfBirth')}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mb-4 bg-white/5 border border-white/10 text-white/90 text-sm focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all"
                />

                {/* Time of Birth */}
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                  {t('form.timeOfBirth')}
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={e => setBirthTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl mb-1 bg-white/5 border border-white/10 text-white/90 text-sm focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all"
                />
                <p className="text-[10px] text-white/30 mb-4">
                  {t('form.timeHint')}
                </p>

                {/* City of Birth */}
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                  {t('form.cityOfBirth')}
                </label>
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={birthCity ? birthCity.city : birthCityQuery}
                    onChange={e => {
                      setBirthCity(null)
                      handleBirthCitySearch(e.target.value)
                    }}
                    placeholder={t('form.cityPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm placeholder:text-white/20 focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all"
                  />
                  {birthCityResults.length > 0 && !birthCity && (
                    <ul className="absolute top-full left-0 right-0 mt-1 bg-[#0D0D1A]/95 backdrop-blur-xl border border-white/10 rounded-xl py-1 z-10 max-h-40 overflow-y-auto">
                      {birthCityResults.map((r, i) => (
                        <li key={i}>
                          <button
                            type="button"
                            onClick={() => {
                              setBirthCity(r)
                              setBirthCityQuery(r.city)
                              setBirthCityResults([])
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors select-none"
                          >
                            {r.city}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="button"
                  onClick={handleBirthSubmit}
                  disabled={!birthDate}
                  className="w-full py-3.5 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 select-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t('cta.birthChartButton')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <LanguageProvider>
      <HomePage />
    </LanguageProvider>
  )
}
