'use client'

import { useState, useMemo, useCallback } from 'react'
import { LanguageProvider } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'
import { useRealTime } from '@/hooks/useRealTime'
import { useLocation } from '@/hooks/useLocation'
import { useAstroData } from '@/hooks/useAstroData'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import Starfield from '@/components/Starfield/Starfield'
import Header from '@/components/Header/Header'
import AstroWheel from '@/components/AstroWheel/AstroWheel'
import WheelTooltip, { type TooltipData } from '@/components/AstroWheel/WheelTooltip'
import CosmicWeather from '@/components/CosmicWeather/CosmicWeather'
import Shimmer from '@/components/ui/Shimmer'

function HomePage() {
  const { t } = useTranslation()
  const now = useRealTime(60000)
  const { location, loading: locationLoading, setLocation } = useLocation()
  const [dayOffset, setDayOffset] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipData>(null)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)

  const targetDate = useMemo(() => {
    const d = new Date(now)
    d.setDate(d.getDate() + dayOffset)
    return d
  }, [now, dayOffset])

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

  return (
    <div className="min-h-screen relative">
      <Starfield />

      <div className="relative z-10">
        <Header
          location={location}
          locationLoading={locationLoading}
          now={now}
          onLocationChange={(loc) => {
            setLocation(loc)
            trackEvent('location-detected', { city: loc.city })
          }}
        />

        <main className="max-w-5xl mx-auto px-4 pb-12">
          {/* Desktop layout: wheel left, weather right */}
          <div className="lg:flex lg:gap-8 lg:items-start">
            {/* Astro Wheel */}
            <div className="lg:flex-1 lg:sticky lg:top-4 py-4">
              {astroData ? (
                <AstroWheel
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

          {/* Day Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8 mb-8">
            <button
              onClick={() => { setDayOffset(prev => prev - 1); trackEvent('day-nav', { direction: 'yesterday' }) }}
              className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              ← {t('nav.yesterday')}
            </button>
            <button
              onClick={() => setDayOffset(0)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                dayOffset === 0 ? 'bg-white/10 text-white' : 'hover:bg-white/5'
              }`}
              style={dayOffset !== 0 ? { color: 'var(--text-secondary)' } : undefined}
            >
              {t('nav.today')}
            </button>
            <button
              onClick={() => { setDayOffset(prev => prev + 1); trackEvent('day-nav', { direction: 'tomorrow' }) }}
              className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t('nav.tomorrow')} →
            </button>
          </div>

          {/* Birth Chart CTA */}
          <div className="glass-card p-6 text-center mb-8">
            <p className="font-[family-name:var(--font-display)] text-lg mb-3 text-white">
              {t('cta.birthChart')}
            </p>
            <button
              onClick={() => trackEvent('birth-chart-cta')}
              className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--accent-purple), #6D28D9)',
                color: 'white',
              }}
            >
              {t('cta.birthChartButton')} →
            </button>
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
