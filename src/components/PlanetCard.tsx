'use client';

import { motion } from 'framer-motion';
import { PlanetPosition, PLANET_SYMBOLS, PlanetName } from '@/types';
import { useLanguage, TranslationKey } from '@/lib/i18n';
import FrequencyBar from './FrequencyBar';

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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--space-card)] p-4 overflow-hidden"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium text-[var(--text-primary)] font-sans">
            {t(planet.planet as TranslationKey)}
          </span>
          <span className="text-[var(--text-dim)] text-sm">
            {PLANET_SYMBOLS[planet.planet]}
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm text-[var(--text-secondary)] font-mono">
            {t(planet.sign as TranslationKey)} {planet.degree.toFixed(1)}°
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--text-dim)]">
          {planet.frequency.toFixed(2)} Hz
        </span>
      </div>
      <FrequencyBar frequency={planet.frequency} color={color} />
    </motion.div>
  );
}
