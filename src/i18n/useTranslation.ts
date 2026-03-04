import { useLanguage } from './LanguageContext'
import en from './translations/en.json'
import lt from './translations/lt.json'

const translations: Record<string, Record<string, string>> = { en, lt }

export function useTranslation() {
  const { lang } = useLanguage()

  const t = (key: string): string => {
    return translations[lang]?.[key] ?? translations['en'][key] ?? key
  }

  return { t, lang }
}
