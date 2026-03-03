'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import { useLanguage } from '@/lib/i18n';

const RING_PLANETS = [
  { angle: 30, color: '#FCD34D', size: 5 },
  { angle: 105, color: '#F9A8D4', size: 4 },
  { angle: 195, color: '#EF4444', size: 5 },
  { angle: 260, color: '#A5B4FC', size: 4 },
  { angle: 330, color: '#FB923C', size: 6 },
];

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 pt-20 pb-12">
      <StarField />

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center">
        {/* Cosmic ring — 160px */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative w-[160px] h-[160px] mb-8"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full animate-cosmic-rotate"
          >
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="0.75"
              strokeDasharray="6 4"
              opacity="0.2"
            />
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="0.5"
              strokeDasharray="3 6"
              opacity="0.1"
            />
            {RING_PLANETS.map((p, i) => {
              const rad = (p.angle * Math.PI) / 180;
              const cx = 100 + Math.cos(rad) * 90;
              const cy = 100 + Math.sin(rad) * 90;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={p.size / 2}
                  fill={p.color}
                  opacity="0.8"
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-[#6B7194] font-serif mb-2">
            {t('brand')}
          </p>
          <h1 className="text-2xl md:text-4xl font-serif italic text-[#E8ECF4] mb-3 leading-tight">
            {t('tagline')}
          </h1>
          <p className="text-sm text-[#6B7194] font-sans max-w-xs mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full bg-[#0A0B14] border border-[#1E1F2E] rounded-2xl p-6 md:p-8"
        >
          <BirthForm />
        </motion.div>

        {/* Below card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <Link
            href="/about"
            className="text-sm text-[#6B7194] hover:text-[#E8ECF4] transition-colors font-sans flex items-center gap-1"
          >
            {t('howItWorks')} <span>→</span>
          </Link>
          <a
            href="https://harmonicwaves.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#3D4167] hover:text-[#6B7194] transition-colors font-sans"
          >
            {t('partOfEcosystem')}
          </a>
        </motion.div>
      </div>
    </main>
  );
}
