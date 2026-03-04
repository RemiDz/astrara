'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage, type Language } from '@/i18n/LanguageContext'
import { searchCity, type UserLocation } from '@/lib/location'

interface HeaderProps {
  location: UserLocation | null
  locationLoading: boolean
  now: Date
  displayDate: Date
  isToday: boolean
  onLocationChange: (loc: UserLocation) => void
  onDateChange: (date: Date) => void
  audioPlaying: boolean
  audioWantsOn: boolean
  onAudioToggle: () => void
  onAboutOpen: () => void
}

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'lt', flag: '🇱🇹', label: 'LT' },
]

export default function Header({
  location,
  locationLoading,
  now,
  displayDate,
  isToday,
  onLocationChange,
  onDateChange,
  audioPlaying,
  audioWantsOn,
  onAudioToggle,
  onAboutOpen,
}: HeaderProps) {
  const { t } = useTranslation()
  const { lang, setLang } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserLocation[]>([])
  const langRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      const results = await searchCity(searchQuery)
      setSearchResults(results)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]
  const locale = lang === 'lt' ? 'lt-LT' : 'en-GB'

  const timeStr = isToday
    ? now.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : null

  const dateStr = displayDate.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Format for hidden date input value (YYYY-MM-DD)
  const dateInputValue = `${displayDate.getFullYear()}-${String(displayDate.getMonth() + 1).padStart(2, '0')}-${String(displayDate.getDate()).padStart(2, '0')}`

  return (
    <header className="relative z-30 px-4 pt-4 pb-2">
      <div className="max-w-5xl mx-auto flex items-start justify-between">
        {/* Left column: App name + subtitle + date */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider text-white">
              ASTRARA
            </h1>
            {/* Info button */}
            <button
              type="button"
              onClick={onAboutOpen}
              className="w-6 h-6 rounded-full border border-white/25
                         flex items-center justify-center
                         text-white/40 text-xs font-serif
                         hover:border-white/40 hover:text-white/60
                         active:scale-90
                         transition-all select-none cursor-pointer"
              aria-label="About Astrara"
            >
              i
            </button>
          </div>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t('app.tagline')}
          </p>
          {/* Date + Time — tappable for date picker */}
          <div className="relative mt-1">
            <button
              type="button"
              onClick={() => {
                try {
                  dateInputRef.current?.showPicker()
                } catch {
                  dateInputRef.current?.focus()
                }
              }}
              className="text-sm hover:text-purple-200 transition-colors select-none"
              style={{ color: 'var(--text-muted)' }}
            >
              {dateStr}{timeStr ? ` · ${timeStr}` : ''}
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={dateInputValue}
              onChange={(e) => {
                if (e.target.value) {
                  const newDate = new Date(e.target.value + 'T12:00:00')
                  onDateChange(newDate)
                }
              }}
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              aria-label="Select date"
            />
          </div>
        </div>

        {/* Right column: Location + Sound + Language */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Location */}
          <div ref={searchRef} className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1 min-w-[80px] justify-end select-none"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="text-xs">📍</span>
              <span className="text-xs truncate max-w-[100px]" style={{ color: 'var(--text-secondary)' }}>
                {locationLoading ? t('location.detecting') : (location?.city || 'Unknown')}
              </span>
            </button>

            {searchOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 glass-card p-3 z-50">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('location.searchPlaceholder')}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
                  autoFocus
                />
                {searchResults.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {searchResults.map((r, i) => (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => {
                            onLocationChange(r)
                            setSearchOpen(false)
                            setSearchQuery('')
                          }}
                          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-white/5 select-none"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {r.city}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Sound toggle */}
          <button
            type="button"
            onClick={onAudioToggle}
            className={`text-lg select-none ${
              audioPlaying
                ? 'text-purple-400/80 hover:text-purple-300'
                : audioWantsOn
                  ? 'text-white/40 hover:text-white/70 animate-pulse'
                  : 'text-white/40 hover:text-white/70'
            }`}
            aria-label={audioPlaying ? 'Mute cosmic soundscape' : 'Play cosmic soundscape'}
          >
            {audioPlaying ? '\uD83D\uDD08' : '\uD83D\uDD07'}
          </button>

          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-xs select-none"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <span className="text-white/30">▾</span>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-1 glass-card py-1 z-50 min-w-[100px]">
                {LANGUAGES.map(l => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 select-none ${
                      l.code === lang ? 'text-white' : ''
                    }`}
                    style={{ color: l.code === lang ? undefined : 'var(--text-secondary)' }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
