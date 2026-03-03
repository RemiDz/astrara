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

function Divider() {
  return <div className="w-16 h-px bg-[var(--border)] mx-auto my-10" />;
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
        <p className="text-[var(--text-secondary)]">No birth data provided</p>
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

  return (
    <main className="relative min-h-screen pb-12">
      <StarField />

      {/* Cosmic Wheel section */}
      <section className="relative z-10 flex flex-col items-center px-4 pt-22 pb-4">
        {/* Wheel */}
        <div className="relative w-full max-w-[380px] md:max-w-[500px] mx-auto">
          <div
            className="absolute inset-0 rounded-full -m-4"
            style={{
              background: 'radial-gradient(circle, rgba(10, 11, 20, 0.5) 0%, transparent 70%)',
            }}
          />
          <CosmicWheel chart={chart} isPlaying={isPlaying} />
        </div>

        {/* Birth info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 text-center"
        >
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            {formattedDate} · {chart.time} · {chart.location}
          </p>
        </motion.div>

        {/* Play button */}
        <div className="mt-6 mb-8">
          <PlayButton isPlaying={isPlaying} onToggle={toggle} />
        </div>
      </section>

      <Divider />

      {/* Your Cosmic Sound section */}
      <section className="relative z-10 max-w-md mx-auto px-6 py-10">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl font-serif text-[var(--text-primary)] text-center mb-3"
        >
          {t('cosmicSound')}
        </motion.h2>

        <p className="text-sm text-[var(--text-secondary)] text-center max-w-md mx-auto mb-8 font-sans">
          {t('cosmicSoundIntro')}
        </p>

        {/* Dominant Tone — above planet cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-[var(--border-active)] bg-[var(--space-surface)] p-5 text-center mb-6"
        >
          <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-sans">
            {t('dominantTone')}
          </p>
          <p className="text-2xl font-serif mb-1" style={{ color: `var(--planet-${chart.dominantPlanet.planet.toLowerCase()})` }}>
            {t(chart.dominantPlanet.planet as TranslationKey)} · {chart.dominantPlanet.frequency.toFixed(2)} Hz
          </p>
          <p className="text-sm text-[var(--text-secondary)] font-sans">
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

          <section className="relative z-10 max-w-md mx-auto px-6 py-10">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl font-serif text-[var(--text-primary)] text-center mb-3"
            >
              {t('harmonicConnections')}
            </motion.h2>

            <p className="text-sm text-[var(--text-secondary)] text-center max-w-md mx-auto mb-6 font-sans">
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
      <section className="relative z-10 max-w-md mx-auto px-6 py-10 space-y-6">
        <ShareCard />

        {/* Create Another — outlined button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="w-full rounded-xl py-3 text-center text-sm border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-active)] transition-colors font-sans"
          >
            {t('createAnother')}
          </Link>
        </div>
      </section>

      <Divider />

      {/* Ecosystem */}
      <section className="relative z-10 max-w-md mx-auto px-6 py-10">
        <EcosystemBadge />
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8">
        <a
          href="https://harmonicwaves.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors font-sans"
        >
          {t('builtBy')}
        </a>
      </footer>
    </main>
  );
}

export default function PortraitPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    }>
      <PortraitContent />
    </Suspense>
  );
}
