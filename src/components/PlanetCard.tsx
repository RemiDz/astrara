'use client';

import { motion } from 'framer-motion';
import { PlanetPosition, PLANET_SYMBOLS, PlanetName } from '@/types';
import { useLanguage, TranslationKey } from '@/lib/i18n';

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

interface Props {
  planet: PlanetPosition;
  index: number;
}

export default function PlanetCard({ planet, index }: Props) {
  const { t } = useLanguage();
  const color = PLANET_COLORS[planet.planet];
  const descKey = `desc_${planet.planet}` as TranslationKey;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-[#0F1019] border border-[#1E1F2E] rounded-xl p-4 mb-3"
    >
      {/* Top row: planet name + zodiac info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm font-medium text-[#E8ECF4] font-sans">
            {t(planet.planet as TranslationKey)}
          </span>
          <span className="text-[#3D4167] text-xs">
            {PLANET_SYMBOLS[planet.planet]}
          </span>
        </div>
        <span className="text-sm text-[#6B7194] font-sans">
          {t(planet.sign as TranslationKey)} {planet.degree.toFixed(1)}°
        </span>
      </div>

      {/* Second row: frequency */}
      <div className="flex items-center justify-end mt-1">
        <span
          className="text-lg font-medium font-mono"
          style={{ color }}
        >
          {planet.frequency.toFixed(2)} Hz
        </span>
      </div>

      {/* Description */}
      <div className="border-t border-[#1E1F2E] mt-3 pt-2">
        <p className="text-xs text-[#3D4167] italic font-sans">
          {t(descKey)}
        </p>
      </div>
    </motion.div>
  );
}
