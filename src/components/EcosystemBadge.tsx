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

interface Props {
  moonSign?: string;
}

export default function EcosystemBadge({ moonSign }: Props) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="space-y-3"
    >
      {APPS.map((app) => {
        let desc = t(app.descKey);
        if (moonSign) {
          desc = desc.replace('{sign}', moonSign);
        }

        return (
          <a
            key={app.name}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-[var(--border)] bg-[var(--space-card)] p-4 hover:border-[var(--border-active)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${app.color}15`, color: app.color }}
              >
                {app.name[0]}
              </div>
              <div>
                <span className="text-sm font-medium text-[var(--text-primary)] font-sans">
                  {app.name}
                </span>
                <p className="text-xs text-[var(--text-dim)] font-sans">{desc}</p>
              </div>
            </div>
          </a>
        );
      })}
    </motion.div>
  );
}
