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
    <header className="relative z-30 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo + tagline */}
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider text-white">
            ASTRARA
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('app.tagline')}
          </p>
        </div>

        {/* Right side: location + language */}
        <div className="flex items-center gap-3">
          {/* Location */}
          <div ref={searchRef} className="relative">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1.5 text-sm hover:text-white transition-colors select-none"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>📍</span>
              <span>{locationLoading ? t('location.detecting') : (location?.city || 'Unknown')}</span>
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
                          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-white/5 transition-colors select-none"
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

          {/* Language switcher */}
          <div ref={langRef} className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg hover:bg-white/5 transition-colors select-none"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <span className="text-xs">▾</span>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-1 glass-card py-1 z-50 min-w-[100px]">
                {LANGUAGES.map(l => (
                  <button
                    type="button"
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors select-none ${
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

      {/* Date + Time — tappable for date picker */}
      <div className="max-w-5xl mx-auto mt-1 relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                dateInputRef.current?.showPicker()
              } catch {
                dateInputRef.current?.focus()
              }
            }}
            className="text-sm hover:text-purple-200 transition-colors select-none flex items-center gap-1.5"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>{dateStr}{timeStr ? ` · ${timeStr}` : ''}</span>
            <span className="text-xs opacity-50">📅</span>
          </button>

          {/* Hidden native date input */}
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
    </header>
  )
}
