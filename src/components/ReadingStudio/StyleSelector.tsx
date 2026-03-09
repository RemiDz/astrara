'use client'

import { useTranslation } from '@/i18n/useTranslation'

export type ReadingStyle = 'practitioner' | 'accessible' | 'mystical'

interface StyleSelectorProps {
  style: ReadingStyle
  onStyleChange: (style: ReadingStyle) => void
  readingLanguage: 'en' | 'lt'
  onLanguageChange: (lang: 'en' | 'lt') => void
}

const STYLES: { value: ReadingStyle; labelKey: string; descKey: string }[] = [
  { value: 'practitioner', labelKey: 'studio.stylePractitioner', descKey: 'studio.stylePractitionerDesc' },
  { value: 'accessible', labelKey: 'studio.styleAccessible', descKey: 'studio.styleAccessibleDesc' },
  { value: 'mystical', labelKey: 'studio.styleMystical', descKey: 'studio.styleMysticalDesc' },
]

export default function StyleSelector({ style, onStyleChange, readingLanguage, onLanguageChange }: StyleSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        {STYLES.map(s => (
          <label
            key={s.value}
            className="flex items-start gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-colors"
            style={{ background: style === s.value ? 'rgba(255,255,255,0.04)' : 'transparent' }}
          >
            <input
              type="radio"
              name="readingStyle"
              checked={style === s.value}
              onChange={() => onStyleChange(s.value)}
              className="mt-0.5 w-4 h-4 accent-[#8B5CF6] cursor-pointer"
            />
            <div>
              <span className="text-sm text-white/80">{t(s.labelKey)}</span>
              <p className="text-xs text-white/40 mt-0.5">{t(s.descKey)}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="pt-3 border-t border-white/6">
        <p className="text-xs text-white/30 uppercase tracking-wider mb-2">{t('studio.readingLanguage')}</p>
        <div className="flex gap-4">
          {(['en', 'lt'] as const).map(l => (
            <label key={l} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="readingLang"
                checked={readingLanguage === l}
                onChange={() => onLanguageChange(l)}
                className="w-4 h-4 accent-[#8B5CF6] cursor-pointer"
              />
              <span
                className="text-sm"
                style={{ color: readingLanguage === l ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}
              >
                {l === 'en' ? 'English' : 'Lietuviu'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
