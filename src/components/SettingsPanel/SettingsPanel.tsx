'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage, type Language } from '@/i18n/LanguageContext'
import { searchCity, type UserLocation } from '@/lib/location'
import Modal from '@/components/ui/Modal'

export interface AstraraSettings {
  planetScale: number
  rotationSpeed: number
  rotationSoundEnabled: boolean
  immersiveUniverse: boolean
}

export const DEFAULT_SETTINGS: AstraraSettings = {
  planetScale: 0.8,
  rotationSpeed: 2.5,
  rotationSoundEnabled: true,
  immersiveUniverse: false,
}

const LANGUAGES: { code: Language; flag: string; name: string }[] = [
  { code: 'en', flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'English' },
  { code: 'lt', flag: '\uD83C\uDDF1\uD83C\uDDF9', name: 'Lietuvi\u0173' },
]

const sliderClass =
  'w-full accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: AstraraSettings
  onSettingsChange: (s: AstraraSettings) => void
  location: UserLocation | null
  locationLoading: boolean
  onLocationChange: (loc: UserLocation) => void
}

export default function SettingsPanel({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  location,
  locationLoading,
  onLocationChange,
}: SettingsPanelProps) {
  const { t } = useTranslation()
  const { lang, setLang } = useLanguage()

  const [editingLocation, setEditingLocation] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserLocation[]>([])
  const [langOpen, setLangOpen] = useState(false)

  // Reset states when panel closes
  useEffect(() => {
    if (!isOpen) {
      setEditingLocation(false)
      setSearchQuery('')
      setSearchResults([])
      setLangOpen(false)
    }
  }, [isOpen])

  // Debounced city search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      const results = await searchCity(searchQuery)
      setSearchResults(results)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleCitySelect = (city: UserLocation) => {
    onLocationChange(city)
    setEditingLocation(false)
    setSearchQuery('')
    setSearchResults([])
  }

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0]

  function Toggle({
    value,
    onChange,
  }: {
    value: boolean
    onChange: () => void
  }) {
    return (
      <button
        type="button"
        onClick={onChange}
        className={`w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-0.5 cursor-pointer select-none flex-shrink-0 ${
          value ? 'bg-purple-500/60' : 'bg-white/10'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="font-[family-name:var(--font-display)] text-lg text-white/90 text-center mb-6">
        {t('settings.title')}
      </h2>

      {/* ── Location ─────────────────────────────── */}
      <div className="border-t border-white/5 pt-5">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
          {t('settings.location')}
        </div>

        {editingLocation ? (
          <div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('location.searchPlaceholder')}
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/20 transition-all box-border"
              style={{
                fontSize: '16px',
                WebkitAppearance: 'none',
                appearance: 'none',
                minWidth: 0,
              }}
            />
            {searchResults.length > 0 && (
              <ul className="mt-2 rounded-xl border border-white/10 bg-[#0D0D1A]/95 overflow-hidden max-h-48 overflow-y-auto">
                {searchResults.map((r, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleCitySelect(r)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 transition-colors select-none"
                    >
                      {r.city}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => {
                setEditingLocation(false)
                setSearchQuery('')
                setSearchResults([])
              }}
              className="mt-2 text-xs text-white/30 hover:text-white/50 transition-colors select-none"
            >
              {t('settings.cancel')}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70 truncate">
              {locationLoading
                ? t('location.detecting')
                : location?.city || 'Unknown'}
            </span>
            <button
              type="button"
              onClick={() => setEditingLocation(true)}
              className="text-xs text-purple-300/60 hover:text-purple-300/90 transition-colors select-none flex-shrink-0 ml-3"
            >
              {t('settings.change')}
            </button>
          </div>
        )}

        <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
          {t('settings.locationPrivacy')}
        </p>
      </div>

      {/* ── Language ──────────────────────────────── */}
      <div className="border-t border-white/5 mt-6 pt-5">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
          {t('settings.language')}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/15 transition-colors select-none"
          >
            <span className="flex items-center gap-2 text-sm text-white/70">
              <span>{currentLang.flag}</span>
              <span>{currentLang.name}</span>
            </span>
            <span
              className={`text-white/30 text-xs transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
            >
              {'\u25BE'}
            </span>
          </button>

          {langOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-white/10 bg-[#0D0D1A]/95 backdrop-blur-xl overflow-hidden z-10">
              {LANGUAGES.map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => {
                    setLang(l.code)
                    setLangOpen(false)
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors select-none ${
                    l.code === lang ? 'text-white/90' : 'text-white/50'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.name}</span>
                  {l.code === lang && (
                    <span className="ml-auto text-purple-400/60 text-xs">
                      {'\u2713'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Display ──────────────────────────────── */}
      <div className="border-t border-white/5 mt-6 pt-5">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-4">
          {t('settings.display')}
        </div>

        {/* Planet Size */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">
              {t('settings.planetSize')}
            </label>
            <span className="text-[10px] text-white/30">
              {Math.round(settings.planetScale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={settings.planetScale}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                planetScale: parseFloat(e.target.value),
              })
            }
            className={sliderClass}
          />
          <div className="flex justify-between text-[9px] text-white/20 mt-1">
            <span>{t('settings.small')}</span>
            <span>{t('settings.large')}</span>
          </div>
        </div>

        {/* Rotation Speed */}
        <div className="mb-5">
          <div className="flex justify-between mb-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">
              {t('settings.rotationSpeed')}
            </label>
            <span className="text-[10px] text-white/30">
              {settings.rotationSpeed === 0
                ? t('settings.paused')
                : `${Math.round(settings.rotationSpeed * 100)}%`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={settings.rotationSpeed}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                rotationSpeed: parseFloat(e.target.value),
              })
            }
            className={sliderClass}
          />
          <div className="flex justify-between text-[9px] text-white/20 mt-1">
            <span>{t('settings.paused')}</span>
            <span>{t('settings.fast')}</span>
          </div>
        </div>

        {/* Rotation Sound Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="mr-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 block">
              {t('settings.rotationSound')}
            </label>
            <span className="text-[9px] text-white/20">
              {t('settings.rotationSoundHint')}
            </span>
          </div>
          <Toggle
            value={settings.rotationSoundEnabled}
            onChange={() =>
              onSettingsChange({
                ...settings,
                rotationSoundEnabled: !settings.rotationSoundEnabled,
              })
            }
          />
        </div>

        {/* Immersive Universe Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="mr-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 block">
              {t('settings.immersiveUniverse')}
            </label>
            <span className="text-[9px] text-white/20">
              {t('settings.immersiveUniverseHint')}
            </span>
          </div>
          <Toggle
            value={settings.immersiveUniverse}
            onChange={() =>
              onSettingsChange({
                ...settings,
                immersiveUniverse: !settings.immersiveUniverse,
              })
            }
          />
        </div>
      </div>

      {/* ── About ─────────────────────────────────── */}
      <div className="border-t border-white/5 mt-6 pt-5">
        <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
          {t('settings.about')}
        </div>
        <p className="text-xs text-white/40 leading-relaxed">
          Astrara {t('footer.partOf').toLowerCase()}{' '}
          <a
            href="https://harmonicwaves.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-300/60 hover:text-purple-300/90 transition-colors"
          >
            Harmonic Waves
          </a>
        </p>
        <p className="text-[10px] text-white/20 mt-2">Version 2.0</p>
      </div>

      {/* ── Reset ─────────────────────────────────── */}
      <button
        type="button"
        onClick={() => onSettingsChange(DEFAULT_SETTINGS)}
        className="w-full mt-8 py-2.5 rounded-xl text-xs text-white/30 border border-white/8 hover:border-white/15 hover:text-white/50 transition-all select-none"
      >
        {t('settings.reset')}
      </button>
    </Modal>
  )
}
