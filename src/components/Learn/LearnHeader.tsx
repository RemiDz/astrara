'use client'

import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'
import LanguageToggle from '@/components/LanguageToggle'

export default function LearnHeader() {
  const { t } = useTranslation()

  return (
    <header className="px-4 pt-6 pb-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-[13px] transition-colors"
            style={{ color: 'var(--accent-purple)' }}
          >
            &larr; {t('learn.backToAstrara')}
          </Link>
          <LanguageToggle />
        </div>

        <div
          className="rounded-2xl border p-6"
          style={{
            background: 'rgba(255,255,255,0.025)',
            borderColor: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-2"
            style={{ color: 'var(--text-muted)' }}
          >
            &#10022;
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wide text-white mb-1">
            {t('learn.title')}
          </h1>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            {t('learn.subtitle')}
          </p>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
            {t('learn.intro')}
          </p>
        </div>
      </div>
    </header>
  )
}
