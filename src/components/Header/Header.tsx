'use client'

import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage } from '@/i18n/LanguageContext'
import type { UserLocation } from '@/lib/location'

interface HeaderProps {
  location: UserLocation | null
  locationLoading: boolean
  now: Date
  displayDate: Date
  isToday: boolean
  audioPlaying: boolean
  audioWantsOn: boolean
  onAudioToggle: () => void
  onAboutOpen: () => void
  onSettingsOpen: () => void
}

const iconBtn =
  'w-9 h-9 flex items-center justify-center text-white/50 hover:text-white/80 active:scale-90 transition-all duration-150 select-none cursor-pointer'

export default function Header({
  location,
  locationLoading,
  now,
  displayDate,
  isToday,
  audioPlaying,
  audioWantsOn,
  onAudioToggle,
  onAboutOpen,
  onSettingsOpen,
}: HeaderProps) {
  const { t } = useTranslation()
  const { lang } = useLanguage()
  const locale = lang === 'lt' ? 'lt-LT' : 'en-GB'

  const dateStr = displayDate.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const timeStr = isToday
    ? now.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : null

  const cityName = locationLoading
    ? t('location.detecting')
    : location?.city || ''

  return (
    <header className="relative z-30 px-4 pt-4 pb-2">
      <div className="max-w-5xl mx-auto flex items-start justify-between">
        {/* Left — text block */}
        <div className="flex flex-col min-w-0">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider text-white">
            ASTRARA
          </h1>
          <span className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t('app.tagline')}
          </span>
          <span
            className="text-sm mt-1 truncate"
            style={{ color: 'var(--text-muted)' }}
          >
            {dateStr}
            {timeStr ? ` \u00B7 ${timeStr}` : ''}
            {cityName ? ` \u00B7 ${cityName}` : ''}
          </span>
        </div>

        {/* Right — icon row */}
        <div className="flex items-center gap-3 pt-1 flex-shrink-0">
          {/* Sound toggle */}
          <button
            type="button"
            onClick={onAudioToggle}
            className={`${iconBtn} ${
              audioPlaying
                ? 'text-white/60'
                : audioWantsOn
                  ? 'text-white/40 animate-pulse'
                  : 'text-white/40'
            }`}
            aria-label={audioPlaying ? 'Mute' : 'Unmute'}
          >
            {audioPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          {/* Info */}
          <button
            type="button"
            onClick={onAboutOpen}
            className={iconBtn}
            aria-label="About"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onSettingsOpen}
            className={iconBtn}
            aria-label="Settings"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
