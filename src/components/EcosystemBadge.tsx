'use client';

import { motion } from 'framer-motion';
import { useLanguage, TranslationKey } from '@/lib/i18n';

interface EcosystemApp {
  name: string;
  url: string;
  descKey: TranslationKey;
  color: string;
}

const APPS: EcosystemApp[] = [
  {
    name: 'Lunata',
    url: 'https://lunata.app',
    descKey: 'lunataDesc',
    color: '#E2E8F0',
  },
  {
    name: 'Binara',
    url: 'https://binara.app',
    descKey: 'binaraDesc',
    color: '#8B5CF6',
  },
  {
    name: 'Sonarus',
    url: 'https://sonarus.app',
    descKey: 'sonarusDesc',
    color: '#3B82F6',
  },
];

export default function EcosystemBadge() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] text-center mb-4 font-sans">
        {t('exploreEcosystem')}
      </p>
      <div className="space-y-3">
        {APPS.map((app) => (
          <a
            key={app.name}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--space-card)] p-4 hover:border-[var(--border-active)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: `${app.color}15`, color: app.color }}
              >
                {app.name[0]}
              </div>
              <div>
                <span className="text-sm font-medium text-[var(--text-primary)] font-sans block">
                  {app.name}
                </span>
                <span className="text-xs text-[var(--text-secondary)] font-sans">
                  {t(app.descKey)}
                </span>
              </div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-dim)"
              strokeWidth="2"
              className="flex-shrink-0"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
