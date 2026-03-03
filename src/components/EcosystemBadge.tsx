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
      <p className="text-xs uppercase tracking-wider text-[#6B7194] text-center mb-4 font-sans">
        {t('exploreEcosystem')}
      </p>
      <div className="space-y-3">
        {APPS.map((app) => (
          <a
            key={app.name}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#0F1019] border border-[#1E1F2E] rounded-xl p-4 mb-3 flex items-center justify-between hover:border-[#6B7194] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: `${app.color}15`, color: app.color }}
              >
                {app.name[0]}
              </div>
              <div>
                <span className="text-sm font-medium text-[#E8ECF4] font-sans block">
                  {app.name}
                </span>
                <span className="text-xs text-[#6B7194] font-sans">
                  {t(app.descKey)}
                </span>
              </div>
            </div>
            <span className="text-[#3D4167] flex-shrink-0">›</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
