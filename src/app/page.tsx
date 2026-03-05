'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { LanguageProvider, useLanguage } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import { useRealTime } from '@/hooks/useRealTime'
import { useLocation } from '@/hooks/useLocation'
import { useAstroData } from '@/hooks/useAstroData'
import { useCosmicAudio } from '@/audio/useCosmicAudio'
import { useEarthData } from '@/hooks/useEarthData'
import { searchCity, type UserLocation } from '@/lib/location'
import { getPlanetPositions, type PlanetPosition, type AspectData } from '@/lib/astronomy'
import { calculateAllHelioData, type HelioData } from '@/lib/heliocentric'
import { calculateAspects } from '@/lib/aspects'
import CosmicBackground from '@/components/Starfield/CosmicBackground'
import Header from '@/components/Header/Header'
import AstroWheel from '@/components/AstroWheel/AstroWheel'
import AstroWheel3DWrapper from '@/components/AstroWheel/AstroWheel3DWrapper'
import WheelTooltip, { type TooltipData } from '@/components/AstroWheel/WheelTooltip'
import CosmicWeather from '@/components/CosmicWeather/CosmicWeather'
import EarthPanel from '@/components/EarthPanel/EarthPanel'
import AboutModal from '@/components/AboutModal/AboutModal'
import SettingsPanel, { type AstraraSettings, DEFAULT_SETTINGS } from '@/components/SettingsPanel/SettingsPanel'
import Shimmer from '@/components/ui/Shimmer'

function HomePage() {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const now = useRealTime(60000)
  const { location, loading: locationLoading, setLocation } = useLocation()
  const [dayOffset, setDayOffset] = useState(0)
  const [customDate, setCustomDate] = useState<Date | null>(null)
  const [tooltip, setTooltip] = useState<TooltipData>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [showBirthInput, setShowBirthInput] = useState(false)
  const [showEarthPanel, setShowEarthPanel] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<AstraraSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('astrara-settings')
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      } catch { /* ignore */ }
    }
    return DEFAULT_SETTINGS
  })
  type ViewMode = 'geocentric' | 'heliocentric'
  const [viewMode, setViewMode] = useState<ViewMode>('geocentric')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showHelioLabels, setShowHelioLabels] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('astrara-helio-labels')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  useEffect(() => {
    localStorage.setItem('astrara-helio-labels', String(showHelioLabels))
  }, [showHelioLabels])

  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('12:00')
  const [birthCityQuery, setBirthCityQuery] = useState('')
  const [birthCityResults, setBirthCityResults] = useState<UserLocation[]>([])
  const [birthCity, setBirthCity] = useState<UserLocation | null>(null)
  const [birthSubmitted, setBirthSubmitted] = useState(false)
  const [birthChartData, setBirthChartData] = useState<{ planets: PlanetPosition[], aspects: AspectData[] } | null>(null)
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
  const { earthData, loading: earthLoading } = useEarthData()

  // Continuous autoplay time controls (helio view only)
  type AutoplayDir = 'backward-fast' | 'backward' | 'stopped' | 'forward' | 'forward-fast'
  const [autoplayDirection, setAutoplayDirection] = useState<AutoplayDir>('stopped')
  const isAutoplayActive = autoplayDirection !== 'stopped'

  // Continuous time refs — driven by useFrame inside AstroWheel3D
  const animationTimeRef = useRef(Date.now())
  const animationSpeedRef = useRef(0)

  // Speed: days per second of real time
  const SPEED_NORMAL = 2    // 2 days per second
  const SPEED_FAST = 14     // 14 days per second (2 weeks per second)
  function daysPerSecondToMultiplier(daysPerSec: number): number {
    return daysPerSec * 86400000 / 1000
  }

  // Helio data for static rendering (initial positions / when autoplay stopped)
  const helioData = useMemo(() => calculateAllHelioData(targetDate), [targetDate])

  // Header date display ref — updated by rAF during autoplay, avoids re-renders
  const headerDateRef = useRef<HTMLSpanElement>(null)
  const headerRafRef = useRef<number | null>(null)

  // rAF loop to update header date during autoplay
  useEffect(() => {
    if (!isAutoplayActive) {
      if (headerRafRef.current) cancelAnimationFrame(headerRafRef.current)
      headerRafRef.current = null
      return
    }

    let lastUpdate = 0
    const tick = (time: number) => {
      if (time - lastUpdate > 200) {
        lastUpdate = time
        if (headerDateRef.current) {
          const d = new Date(animationTimeRef.current)
          headerDateRef.current.textContent = d.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          })
        }
      }
      headerRafRef.current = requestAnimationFrame(tick)
    }
    headerRafRef.current = requestAnimationFrame(tick)
    return () => {
      if (headerRafRef.current) cancelAnimationFrame(headerRafRef.current)
    }
  }, [isAutoplayActive, lang])

  // Autoplay toggle — set speed ref, sync dates on start/stop
  const handleAutoplayToggle = useCallback((dir: AutoplayDir) => {
    const willStop = autoplayDirection === dir

    if (willStop) {
      // Stopping — sync display date to current animation time
      animationSpeedRef.current = 0
      setCustomDate(new Date(animationTimeRef.current))
      setDayOffset(0)
      setAutoplayDirection('stopped')
    } else {
      // Starting or switching direction — init animation time from display date
      if (autoplayDirection === 'stopped') {
        animationTimeRef.current = targetDate.getTime()
      }
      const isFast = dir === 'forward-fast' || dir === 'backward-fast'
      const isBackward = dir === 'backward' || dir === 'backward-fast'
      const speed = isFast ? SPEED_FAST : SPEED_NORMAL
      animationSpeedRef.current = daysPerSecondToMultiplier(isBackward ? -speed : speed)
      setAutoplayDirection(dir)
    }
  }, [autoplayDirection, targetDate])

  // Stop autoplay when switching back to geocentric — sync display date
  useEffect(() => {
    if (viewMode === 'geocentric' && autoplayDirection !== 'stopped') {
      animationSpeedRef.current = 0
      setCustomDate(new Date(animationTimeRef.current))
      setDayOffset(0)
      setAutoplayDirection('stopped')
    }
  }, [viewMode, autoplayDirection])

  // Sync animationTime when not autoplaying and date changes manually
  useEffect(() => {
    if (autoplayDirection === 'stopped') {
      animationTimeRef.current = targetDate.getTime()
    }
  }, [targetDate, autoplayDirection])

  const moonSign = astroData?.moon?.zodiacSign ?? 'aries'
  const { isPlaying: audioPlaying, wantsAudio, toggle: toggleAudio, onPlanetTap: audioOnPlanetTap, onSignTap: audioOnSignTap, startRotationSound, stopRotationSound, updateRotationVelocity } = useCosmicAudio(astroData?.planets ?? [], moonSign)
  const [showHeadphoneHint, setShowHeadphoneHint] = useState(false)

  const handleAudioToggle = useCallback(async () => {
    await toggleAudio()
    // Show headphones hint on first enable
    if (!audioPlaying && typeof window !== 'undefined') {
      const hintShown = localStorage.getItem('astrara-audio-hint')
      if (!hintShown) {
        setShowHeadphoneHint(true)
        localStorage.setItem('astrara-audio-hint', '1')
        setTimeout(() => setShowHeadphoneHint(false), 3000)
      }
    }
  }, [toggleAudio, audioPlaying])

  const handlePlanetTap = useCallback((planet: PlanetPosition) => {
    setSelectedPlanet(planet.id)
    setTooltip({ type: 'planet', data: planet })
    audioOnPlanetTap(planet.id)
  }, [audioOnPlanetTap])

  const handleSignTap = useCallback((signId: string) => {
    setTooltip({ type: 'sign', data: signId })
    audioOnSignTap(signId)
  }, [audioOnSignTap])

  const handleAspectTap = useCallback((aspect: AspectData) => {
    setTooltip({ type: 'aspect', data: aspect })
  }, [])

  const handleSettingsChange = useCallback((s: AstraraSettings) => {
    setSettings(s)
    localStorage.setItem('astrara-settings', JSON.stringify(s))
  }, [])

  // Start/stop rotation sound based on setting — independent of main audio
  useEffect(() => {
    if (settings.rotationSoundEnabled) {
      startRotationSound()
    } else {
      stopRotationSound()
    }
  }, [settings.rotationSoundEnabled, startRotationSound, stopRotationSound])

  const handleRotationVelocity = useCallback((velocity: number) => {
    if (settings.rotationSoundEnabled) {
      updateRotationVelocity(velocity)
    }
  }, [settings.rotationSoundEnabled, updateRotationVelocity])

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

  const birthDateTimeRef = useRef<Date | null>(null)

  const handleBirthSubmit = () => {
    const [year, month, day] = birthDate.split('-').map(Number)
    const [hours, minutes] = birthTime.split(':').map(Number)
    const birthDateTime = new Date(year, month - 1, day, hours, minutes)

    const bLat = birthCity?.lat ?? 51.5074
    const bLng = birthCity?.lng ?? -0.1278

    const planets = getPlanetPositions(birthDateTime, bLat, bLng)
    const aspects = calculateAspects(planets)

    setBirthChartData({ planets, aspects })
    setBirthSubmitted(true)
    birthDateTimeRef.current = birthDateTime

    const data = {
      date: birthDate,
      time: birthTime,
      city: birthCity?.city ?? birthCityQuery,
      lat: bLat,
      lng: bLng,
    }
    localStorage.setItem('astrara-birth-data', JSON.stringify(data))
    trackEvent('birth-chart-submit')
  }

  const handleBirthModalClose = () => {
    if (birthDateTimeRef.current && birthSubmitted) {
      setCustomDate(birthDateTimeRef.current)
      setDayOffset(0)
    }
    setShowBirthInput(false)
    setBirthSubmitted(false)
    setBirthChartData(null)
    birthDateTimeRef.current = null
  }

  return (
    <div className="min-h-screen relative">
      <CosmicBackground immersiveUniverse={settings.immersiveUniverse} />

      <div className="relative z-10">
        <Header
          location={location}
          locationLoading={locationLoading}
          now={now}
          displayDate={targetDate}
          headerDateRef={headerDateRef}
          isToday={isToday && !isAutoplayActive}
          audioPlaying={audioPlaying}
          audioWantsOn={wantsAudio}
          onAudioToggle={() => { handleAudioToggle(); trackEvent('audio-toggle') }}
          onAboutOpen={() => { setShowAbout(true); trackEvent('about-open') }}
          onSettingsOpen={() => { setShowSettings(true); trackEvent('settings-open') }}
        />

        <main className="max-w-5xl mx-auto px-4 pb-12">
          {/* Desktop layout: wheel left, weather right */}
          <div className="lg:flex lg:gap-8 lg:items-start">
            {/* Astro Wheel */}
            <div className="lg:flex-1 lg:sticky lg:top-4 py-4 relative">
              {astroData ? (
                <AstroWheel3DWrapper
                  planets={astroData.planets}
                  aspects={astroData.aspects}
                  onPlanetTap={(p) => { handlePlanetTap(p); trackEvent('planet-tap', { planet: p.id }) }}
                  onSignTap={(s) => { handleSignTap(s); trackEvent('sign-tap', { sign: s }) }}
                  onAspectTap={(a) => { handleAspectTap(a); trackEvent('aspect-tap', { aspect: `${a.planet1}-${a.type}-${a.planet2}` }) }}
                  onEarthTap={() => { setShowEarthPanel(true); trackEvent('earth-tap') }}
                  selectedPlanet={selectedPlanet}
                  planetScale={settings.planetScale}
                  rotationSpeed={settings.rotationSpeed}
                  onRotationVelocity={handleRotationVelocity}
                  kpIndex={earthData?.kpIndex ?? null}
                  solarFlareClass={earthData?.solarFlareClass ?? null}
                  solarFluxValue={earthData?.solarFluxValue ?? null}
                  viewMode={viewMode}
                  isTransitioning={isTransitioning}
                  helioData={helioData}
                  onTransitionComplete={() => setIsTransitioning(false)}
                  animationTimeRef={animationTimeRef}
                  animationSpeedRef={animationSpeedRef}
                  showHelioLabels={showHelioLabels}
                />
              ) : (
                <div className="relative w-full flex items-center justify-center" style={{ height: '95vw', maxHeight: '550px' }}>
                  <div className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
                    Reading the stars...
                  </div>
                </div>
              )}

              {/* Label visibility toggle — helio view only */}
              {viewMode === 'heliocentric' && (
                <button
                  onClick={() => setShowHelioLabels(prev => !prev)}
                  aria-label={showHelioLabels ? 'Hide planet labels' : 'Show planet labels'}
                  className="absolute top-2 right-4 z-10
                             w-9 h-9 rounded-full flex items-center justify-center
                             backdrop-blur-md transition-all duration-200 active:scale-90
                             bg-white/5 border border-white/8 text-white/45
                             hover:text-white/70 hover:bg-white/8"
                >
                  {showHelioLabels ? (
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7V4h16v3" />
                      <path d="M9 20h6" />
                      <path d="M12 4v16" />
                    </svg>
                  ) : (
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 7V4h16v3" />
                      <path d="M9 20h6" />
                      <path d="M12 4v16" />
                      <line x1="3" y1="3" x2="21" y2="21" />
                    </svg>
                  )}
                </button>
              )}

              {/* View Toggle — below wheel, above day nav */}
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true)
                      setViewMode(prev => prev === 'geocentric' ? 'heliocentric' : 'geocentric')
                    }
                  }}
                  disabled={isTransitioning}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-sm transition-all duration-200 hover:bg-white/10 hover:text-white/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {viewMode === 'geocentric' ? (
                    <>
                      <span>&#9737;</span>
                      <span>{t('helio.solarSystemView')}</span>
                    </>
                  ) : (
                    <>
                      <span>&#10022;</span>
                      <span>{t('helio.astroWheelView')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Day Navigation — directly below wheel */}
              {viewMode === 'heliocentric' ? (
                <div className="flex items-center justify-center gap-2.5 py-4">
                  <button
                    type="button"
                    disabled={isTransitioning}
                    onClick={() => handleAutoplayToggle('backward-fast')}
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed ${
                      autoplayDirection === 'backward-fast'
                        ? 'bg-white/15 border border-white/25 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                        : 'bg-white/5 border border-white/8 text-white/45 hover:text-white/70 hover:bg-white/8'
                    }`}
                    aria-label="Fast rewind — 7 days per step"
                  >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                  </button>
                  <button
                    type="button"
                    disabled={isTransitioning}
                    onClick={() => handleAutoplayToggle('backward')}
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed ${
                      autoplayDirection === 'backward'
                        ? 'bg-white/15 border border-white/25 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                        : 'bg-white/5 border border-white/8 text-white/45 hover:text-white/70 hover:bg-white/8'
                    }`}
                    aria-label="Rewind — 1 day per step"
                  >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => { animationSpeedRef.current = 0; animationTimeRef.current = Date.now(); setAutoplayDirection('stopped'); setCustomDate(null); setDayOffset(0) }}
                    className="px-5 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-white/5 border border-white/8 text-white/60 text-sm font-medium hover:bg-white/10 hover:text-white/80 active:scale-95 transition-all duration-200"
                  >
                    {t('nav.today')}
                  </button>
                  <button
                    type="button"
                    disabled={isTransitioning}
                    onClick={() => handleAutoplayToggle('forward')}
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed ${
                      autoplayDirection === 'forward'
                        ? 'bg-white/15 border border-white/25 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                        : 'bg-white/5 border border-white/8 text-white/45 hover:text-white/70 hover:bg-white/8'
                    }`}
                    aria-label="Forward — 1 day per step"
                  >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                  <button
                    type="button"
                    disabled={isTransitioning}
                    onClick={() => handleAutoplayToggle('forward-fast')}
                    className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed ${
                      autoplayDirection === 'forward-fast'
                        ? 'bg-white/15 border border-white/25 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                        : 'bg-white/5 border border-white/8 text-white/45 hover:text-white/70 hover:bg-white/8'
                    }`}
                    aria-label="Fast forward — 7 days per step"
                  >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
                  </button>
                </div>
              ) : (() => {
                const formatShortDate = (date: Date) => {
                  const day = date.getDate()
                  const monthNames = lang === 'lt'
                    ? ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir', 'Lie', 'Rgp', 'Rgs', 'Spa', 'Lap', 'Gru']
                    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  return `${day} ${monthNames[date.getMonth()]}`
                }

                const prevDate = new Date(targetDate)
                prevDate.setDate(prevDate.getDate() - 1)
                const nextDate = new Date(targetDate)
                nextDate.setDate(nextDate.getDate() + 1)

                const prevLabel = isToday ? `← ${t('nav.yesterday')}` : `← ${formatShortDate(prevDate)}`
                const nextLabel = isToday ? `${t('nav.tomorrow')} →` : `${formatShortDate(nextDate)} →`
                const centreLabel = isToday ? t('nav.today') : formatShortDate(targetDate)

                return (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <button
                      type="button"
                      disabled={isTransitioning}
                      onClick={() => { setDayOffset(prev => prev - 1); trackEvent('day-nav', { direction: 'prev' }) }}
                      className="px-4 py-2 rounded-xl text-sm select-none border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {prevLabel}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCustomDate(null); setDayOffset(0) }}
                      className={`px-4 py-2 rounded-xl text-sm select-none active:scale-95 transition-all ${
                        isToday
                          ? 'bg-white/8 border border-white/20 text-white/90'
                          : 'border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                      }`}
                    >
                      {centreLabel}
                    </button>
                    <button
                      type="button"
                      disabled={isTransitioning}
                      onClick={() => { setDayOffset(prev => prev + 1); trackEvent('day-nav', { direction: 'next' }) }}
                      className="px-4 py-2 rounded-xl text-sm select-none border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {nextLabel}
                    </button>
                  </div>
                )
              })()}

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
        solarFlareClass={earthData?.solarFlareClass ?? null}
        solarFluxValue={earthData?.solarFluxValue ?? null}
      />

      {/* Earth Panel */}
      <EarthPanel isOpen={showEarthPanel} onClose={() => setShowEarthPanel(false)} earthData={earthData} loading={earthLoading} />

      {/* About Modal */}
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        location={location}
        locationLoading={locationLoading}
        onLocationChange={(loc) => {
          setLocation(loc)
          trackEvent('location-change', { city: loc.city })
        }}
      />

      {/* Headphones hint toast */}
      {showHeadphoneHint && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10 text-white/60 text-xs animate-fade-in-out select-none">
          {t('audio.headphones')}
        </div>
      )}

      {/* Birth Details Modal */}
      {showBirthInput && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBirthModalClose}
          />
          <div
            className="relative z-10 w-full max-w-md mx-4 sm:mx-auto rounded-t-2xl sm:rounded-2xl p-6 pb-8 animate-slide-up"
            style={{
              maxWidth: 'min(28rem, calc(100vw - 32px))',
              background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.92) 0%, rgba(13, 13, 26, 0.97) 100%)',
              border: '1px solid rgba(147, 197, 253, 0.06)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
            }}
          >
            {/* Handle bar (mobile) */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />

            {/* Close */}
            <button
              type="button"
              onClick={handleBirthModalClose}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors select-none text-lg"
              aria-label="Close"
            >
              ✕
            </button>

            {birthSubmitted && birthChartData ? (
              <div className="max-h-[70vh] overflow-y-auto py-2 -mx-2 px-2">
                <h3 className="text-lg font-[family-name:var(--font-display)] text-white/90 text-center mb-1">
                  {t('cta.birthChartTitle')}
                </h3>
                <p className="text-xs text-white/40 text-center mb-5">
                  {birthDate} · {birthTime}{birthCity ? ` · ${birthCity.city}` : birthCityQuery ? ` · ${birthCityQuery}` : ''}
                </p>

                {/* Sun & Moon highlights */}
                {(() => {
                  const sun = birthChartData.planets.find(p => p.id === 'sun')!
                  const moon = birthChartData.planets.find(p => p.id === 'moon')!
                  return (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="text-2xl mb-1" style={{ color: sun.colour }}>{sun.signGlyph}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{t('planet.sun')}</div>
                        <div className="text-sm text-white/80">{t(`zodiac.${sun.zodiacSign}`)}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{sun.degreeInSign}°</div>
                      </div>
                      <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="text-2xl mb-1" style={{ color: moon.colour }}>{moon.signGlyph}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mb-0.5">{t('planet.moon')}</div>
                        <div className="text-sm text-white/80">{t(`zodiac.${moon.zodiacSign}`)}</div>
                        <div className="text-[10px] text-white/30 mt-0.5">{moon.degreeInSign}°</div>
                      </div>
                    </div>
                  )
                })()}

                {/* All other planet positions */}
                <div className="space-y-1 mb-4">
                  {birthChartData.planets.filter(p => p.id !== 'sun' && p.id !== 'moon').map(planet => (
                    <div key={planet.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: planet.colour }}>{planet.glyph}</span>
                        <span className="text-xs text-white/60">{t(`planet.${planet.id}`)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-white/80">{t(`zodiac.${planet.zodiacSign}`)}</span>
                        <span className="text-[10px] text-white/30">{planet.degreeInSign}°</span>
                        {planet.isRetrograde && <span className="text-[9px] text-orange-400/60">℞</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Notable aspects */}
                {birthChartData.aspects.filter(a => a.orb < 5).length > 0 && (
                  <div className="mb-2">
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{t('weather.notableAspects')}</div>
                    <div className="space-y-1">
                      {birthChartData.aspects.filter(a => a.orb < 5).slice(0, 6).map((aspect, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                          <span style={{ color: aspect.colour }}>{aspect.planet1Glyph} {aspect.symbol} {aspect.planet2Glyph}</span>
                          <span className="text-white/40">{t(`aspect.${aspect.type}`)}</span>
                          <span className="text-white/20 text-[10px]">{aspect.orb}°</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                <div className="relative mb-4">
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full min-w-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm placeholder:text-white/20 focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all box-border appearance-none"
                    style={{ maxWidth: '100%', WebkitAppearance: 'none' }}
                  />
                </div>

                {/* Time of Birth */}
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">
                  {t('form.timeOfBirth')}
                </label>
                <div className="relative mb-1">
                  <input
                    type="time"
                    value={birthTime}
                    onChange={e => setBirthTime(e.target.value)}
                    className="w-full min-w-0 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm placeholder:text-white/20 focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all box-border appearance-none"
                    style={{ maxWidth: '100%', WebkitAppearance: 'none' }}
                  />
                </div>
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
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 text-sm placeholder:text-white/20 focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all box-border"
                    style={{ maxWidth: '100%' }}
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
