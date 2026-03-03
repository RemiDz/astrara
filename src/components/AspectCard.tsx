'use client';

import { motion } from 'framer-motion';
import { Aspect, PlanetName } from '@/types';
import { useLanguage, TranslationKey } from '@/lib/i18n';

interface Props {
  aspect: Aspect;
  index: number;
}

const PLANET_COLORS: Record<PlanetName, string> = {
  Sun: '#FCD34D',
  Moon: '#E2E8F0',
  Mercury: '#A5B4FC',
  Venus: '#F9A8D4',
  Mars: '#EF4444',
  Jupiter: '#FB923C',
  Saturn: '#A78BFA',
  Uranus: '#22D3EE',
  Neptune: '#6366F1',
  Pluto: '#9CA3AF',
};

export default function AspectCard({ aspect, index }: Props) {
  const { t } = useLanguage();
  const descKey = `aspectDesc_${aspect.type}` as TranslationKey;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.06 }}
      className="bg-[#0F1019] border border-[#1E1F2E] rounded-xl p-4 mb-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: PLANET_COLORS[aspect.planet1] }}
          />
          <span className="text-sm text-[#E8ECF4] font-sans">
            {t(aspect.planet1 as TranslationKey)} & {t(aspect.planet2 as TranslationKey)}
          </span>
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: PLANET_COLORS[aspect.planet2] }}
          />
        </div>
        <span className="text-sm text-[#3B82F6] font-sans">
          {t(aspect.musicalInterval as TranslationKey)}
        </span>
      </div>
      <p className="text-xs text-[#3D4167] italic font-sans mt-2">
        {t(descKey)}
      </p>
    </motion.div>
  );
}
