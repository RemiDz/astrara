'use client';

import { useLanguage } from '@/lib/i18n';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center rounded-full border border-[var(--border)] bg-[var(--space-card)] px-1 py-1 text-xs font-mono">
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          lang === 'en'
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang('lt')}
        className={`px-2.5 py-1 rounded-full transition-colors ${
          lang === 'lt'
            ? 'bg-[var(--accent)] text-white'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        LT
      </button>
    </div>
  );
}
