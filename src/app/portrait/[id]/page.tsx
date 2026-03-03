'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { calculateBirthChart } from '@/lib/astro/birth-chart';
import { formatBirthDate } from '@/lib/utils';
import { useCosmicSound } from '@/hooks/useCosmicSound';
import { useLanguage, TranslationKey } from '@/lib/i18n';
import StarField from '@/components/StarField';
import CosmicWheel from '@/components/CosmicWheel';
import PlanetCard from '@/components/PlanetCard';
import AspectCard from '@/components/AspectCard';
import PlayButton from '@/components/PlayButton';
import ShareCard from '@/components/ShareCard';
import EcosystemBadge from '@/components/EcosystemBadge';

const PLANET_COLORS: Record<string, string> = {
  sun: '#FCD34D',
  moon: '#E2E8F0',
  mercury: '#A5B4FC',
  venus: '#F9A8D4',
  mars: '#EF4444',
  jupiter: '#FB923C',
  saturn: '#A78BFA',
  uranus: '#22D3EE',
  neptune: '#6366F1',
  pluto: '#9CA3AF',
};

function Divider() {
  return <div className="w-16 h-px bg-[#1E1F2E] mx-auto my-10" />;
}

function PortraitContent() {
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();

  const chart = useMemo(() => {
    const d = searchParams.get('d') || '';
    const time = searchParams.get('t') || '12:00';
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const location = searchParams.get('l') || '';

    if (!d) return null;
    return calculateBirthChart(d, time, lat, lng, location);
  }, [searchParams]);

  const { isPlaying, toggle } = useCosmicSound(chart?.planets || []);

  if (!chart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#6B7194]">No birth data provided</p>
      </div>
    );
  }

  const dominantDesc = t('dominantDesc')
    .replace('{planet}', t(chart.dominantPlanet.planet as TranslationKey))
    .replace('{sign}', t(chart.dominantPlanet.sign as TranslationKey));

  const topAspects = [...chart.aspects]
    .sort((a, b) => a.orb - b.orb)
    .slice(0, 5);

  const formattedDate = formatBirthDate(chart.date, lang);
  const dominantColor = PLANET_COLORS[chart.dominantPlanet.planet.toLowerCase()] || '#E8ECF4';

  return (
    <main className="min-h-screen bg-[#04040A] pt-[72px]">
      <StarField />

      <div className="max-w-lg mx-auto px-5">
        {/* Cosmic Wheel section */}
        <section className="relative z-10 flex flex-col items-center pb-4">
          {/* Wheel */}
          <div className="relative w-full max-w-[380px] md:max-w-[500px] mx-auto mb-4">
            <div
              className="absolute inset-0 rounded-full -m-4"
              style={{
                background: 'radial-gradient(circle, rgba(10, 11, 20, 0.5) 0%, transparent 70%)',
              }}
            />
            <CosmicWheel chart={chart} isPlaying={isPlaying} />
          </div>

          {/* Birth info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-sm text-[#6B7194] mb-6 font-sans"
          >
            {formattedDate} · {chart.time} · {chart.location}
          </motion.p>

          {/* Play button */}
          <div className="flex flex-col items-center mb-10">
            <PlayButton isPlaying={isPlaying} onToggle={toggle} />
          </div>
        </section>

        <Divider />

        {/* Your Cosmic Sound section */}
        <section className="relative z-10 py-10">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xl font-serif italic text-[#E8ECF4] mb-3"
          >
            {t('cosmicSound')}
          </motion.h2>

          <p className="text-center text-sm text-[#6B7194] max-w-sm mx-auto mb-8 font-sans">
            {t('cosmicSoundIntro')}
          </p>

          {/* Dominant Tone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0B14] border border-[#3B4BDB] rounded-2xl p-5 mb-6 text-center"
          >
            <p className="text-xs uppercase tracking-wider text-[#6B7194] mb-2 font-sans">
              {t('dominantTone')}
            </p>
            <p className="text-2xl font-serif" style={{ color: dominantColor }}>
              {t(chart.dominantPlanet.planet as TranslationKey)} · {chart.dominantPlanet.frequency.toFixed(2)} Hz
            </p>
            <p className="text-sm text-[#6B7194] mt-1 font-sans">
              {dominantDesc}
            </p>
          </motion.div>

          {/* Planet cards */}
          <div className="space-y-3">
            {chart.planets.map((planet, i) => (
              <PlanetCard key={planet.planet} planet={planet} index={i} />
            ))}
          </div>
        </section>

        {/* Harmonic Connections section */}
        {topAspects.length > 0 && (
          <>
            <Divider />

            <section className="relative z-10 py-10">
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center text-xl font-serif italic text-[#E8ECF4] mb-3"
              >
                {t('harmonicConnections')}
              </motion.h2>

              <p className="text-center text-sm text-[#6B7194] max-w-sm mx-auto mb-6 font-sans">
                {t('harmonicConnectionsIntro')}
              </p>

              <div className="space-y-3">
                {topAspects.map((aspect, i) => (
                  <AspectCard key={`${aspect.planet1}-${aspect.planet2}`} aspect={aspect} index={i} />
                ))}
              </div>
            </section>
          </>
        )}

        <Divider />

        {/* Share & Explore */}
        <section className="relative z-10 py-10 space-y-6">
          <ShareCard />

          {/* Create Another */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="w-full max-w-sm mx-auto block mt-4 py-3 text-sm rounded-xl border border-[#1E1F2E] text-[#6B7194] hover:text-[#E8ECF4] hover:border-[#6B7194] transition text-center font-sans"
            >
              {t('createAnother')}
            </Link>
          </div>
        </section>

        <Divider />

        {/* Ecosystem */}
        <section className="relative z-10 py-10">
          <EcosystemBadge />
        </section>

        {/* Footer */}
        <footer className="relative z-10 text-center py-8">
          <a
            href="https://harmonicwaves.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#3D4167] hover:text-[#6B7194] transition-colors font-sans"
          >
            {t('builtBy')}
          </a>
        </footer>
      </div>
    </main>
  );
}

export default function PortraitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3B82F6]/30 border-t-[#3B82F6] rounded-full animate-spin" />
      </div>
    }>
      <PortraitContent />
    </Suspense>
  );
}
