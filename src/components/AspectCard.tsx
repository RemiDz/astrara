'use client';

import { motion } from 'framer-motion';
import { Aspect, PLANET_SYMBOLS } from '@/types';
import { useLanguage, TranslationKey } from '@/lib/i18n';

interface Props {
  aspect: Aspect;
  index: number;
}

const ASPECT_COLORS: Record<string, string> = {
  conjunction: '#FCD34D',
  trine: '#3B82F6',
  square: '#EF4444',
  opposition: '#EF4444',
  sextile: '#8B5CF6',
};

export default function AspectCard({ aspect, index }: Props) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--space-card)] p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-primary)]">
            {PLANET_SYMBOLS[aspect.planet1]}
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              color: ASPECT_COLORS[aspect.type],
              backgroundColor: `${ASPECT_COLORS[aspect.type]}15`,
            }}
          >
            {t(aspect.type as TranslationKey)}
          </span>
          <span className="text-sm text-[var(--text-primary)]">
            {PLANET_SYMBOLS[aspect.planet2]}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[var(--text-dim)]">
            {t(aspect.musicalInterval as TranslationKey)}
          </span>
        </div>
      </div>
      <div className="mt-1 text-xs text-[var(--text-dim)] font-sans">
        {t(aspect.planet1 as TranslationKey)} — {t(aspect.planet2 as TranslationKey)} · {aspect.orb.toFixed(1)}° orb
      </div>
    </motion.div>
  );
}
