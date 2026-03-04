'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage, type Language } from '@/i18n/LanguageContext'
import { searchCity, type UserLocation } from '@/lib/location'

interface HeaderProps {
  location: UserLocation | null
  locationLoading: boolean
  now: Date
  onLocationChange: (loc: UserLocation) => void
}

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'lt', flag: '🇱🇹', label: 'LT' },
]

export default function Header({ location, locationLoading, now, onLocationChange }: HeaderProps) {
  const { t } = useTranslation()
  const { lang, setLang } = useLanguage()
  const [langOpen, setLangOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserLocation[]>([])
  const langRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

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

  const timeStr = now.toLocaleTimeString(lang === 'lt' ? 'lt-LT' : 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })

  const dateStr = now.toLocaleDateString(lang === 'lt' ? 'lt-LT' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1.5 text-sm hover:text-white transition-colors"
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
                          onClick={() => {
                            onLocationChange(r)
                            setSearchOpen(false)
                            setSearchQuery('')
                          }}
                          className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-white/5 transition-colors"
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
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
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
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
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

      {/* Date + Time */}
      <div className="max-w-5xl mx-auto mt-1">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {dateStr} · {timeStr}
        </p>
      </div>
    </header>
  )
}
