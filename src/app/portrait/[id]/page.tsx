'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { calculateBirthChart } from '@/lib/astro/birth-chart';
import { useCosmicSound } from '@/hooks/useCosmicSound';
import { useLanguage, TranslationKey } from '@/lib/i18n';
import StarField from '@/components/StarField';
import CosmicWheel from '@/components/CosmicWheel';
import PlanetCard from '@/components/PlanetCard';
import AspectCard from '@/components/AspectCard';
import PlayButton from '@/components/PlayButton';
import ShareCard from '@/components/ShareCard';
import EcosystemBadge from '@/components/EcosystemBadge';

function PortraitContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

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

  const moonPlanet = chart.planets.find((p) => p.planet === 'Moon');
  const moonSign = moonPlanet ? t(moonPlanet.sign as TranslationKey) : '';

  const dominantDesc = t('dominantDesc')
    .replace('{freq}', chart.dominantPlanet.frequency.toFixed(2))
    .replace('{planet}', t(chart.dominantPlanet.planet as TranslationKey))
    .replace('{sign}', t(chart.dominantPlanet.sign as TranslationKey));

  return (
    <main className="relative min-h-screen pb-32">
      <StarField />

      {/* Section A: Visualisation */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-6"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-[var(--text-secondary)] font-serif mb-2">
            {t('brand')}
          </p>
          <h1 className="text-2xl md:text-4xl font-serif italic text-[var(--text-primary)]">
            {t('cosmicPortrait')}
          </h1>
        </motion.div>

        <CosmicWheel chart={chart} isPlaying={isPlaying} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-center font-mono text-xs text-[var(--text-dim)]"
        >
          <p>{chart.date} · {chart.time} · {chart.location}</p>
        </motion.div>
      </section>

      {/* Section B: Frequency Breakdown */}
      <section className="relative z-10 max-w-lg mx-auto px-4 space-y-6 mb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-serif text-[var(--text-primary)] text-center"
        >
          {t('frequencySignature')}
        </motion.h2>

        {/* Planet cards */}
        <div className="space-y-3">
          {chart.planets.map((planet, i) => (
            <PlanetCard key={planet.planet} planet={planet} index={i} />
          ))}
        </div>

        {/* Dominant tone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border-2 border-[var(--accent)] bg-[var(--space-card)] p-6 text-center"
        >
          <h3 className="text-lg font-serif text-[var(--accent)] mb-2">
            {t('dominantTone')}
          </h3>
          <p className="text-3xl font-mono text-[var(--text-primary)] mb-2">
            {chart.dominantPlanet.frequency.toFixed(2)} Hz
          </p>
          <p className="text-sm text-[var(--text-secondary)] font-sans">
            {dominantDesc}
          </p>
        </motion.div>

        {/* Aspects */}
        {chart.aspects.length > 0 && (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xl font-serif text-[var(--text-primary)] text-center pt-4"
            >
              {t('harmonicAspects')}
            </motion.h2>
            <div className="space-y-2">
              {chart.aspects.map((aspect, i) => (
                <AspectCard key={`${aspect.planet1}-${aspect.planet2}`} aspect={aspect} index={i} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Section C: Share & Explore */}
      <section className="relative z-10 max-w-lg mx-auto px-4 space-y-6 mb-12">
        <ShareCard />
        <EcosystemBadge moonSign={moonSign} />

        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-sm text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors font-sans"
          >
            ← {t('createAnother')}
          </Link>
        </div>

        <footer className="text-center pt-8 pb-4">
          <a
            href="https://harmonicwaves.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors font-sans"
          >
            {t('builtBy')}
          </a>
        </footer>
      </section>

      {/* Play button */}
      <PlayButton isPlaying={isPlaying} onToggle={toggle} />
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
