'use client'

import { useLanguage, type Language } from '@/i18n/LanguageContext'

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: 'en', flag: '\uD83C\uDDEC\uD83C\uDDE7', label: 'EN' },
  { code: 'lt', flag: '\uD83C\uDDF1\uD83C\uDDF9', label: 'LT' },
]

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-0.5 border border-white/10">
      {LANGUAGES.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
            lang === l.code
              ? 'bg-white/15 text-white/90'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  )
}
