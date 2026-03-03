'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import { useLanguage } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useLanguage();

  const sections = [
    { title: t('aboutWhat'), desc: t('aboutWhatDesc') },
    { title: t('aboutScience'), desc: t('aboutScienceDesc') },
    { title: t('aboutUnique'), desc: t('aboutUniqueDesc') },
  ];

  return (
    <main className="relative min-h-screen px-4 py-16">
      <StarField />

      <div className="relative z-10 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-[var(--text-secondary)] font-serif mb-3">
            {t('brand')}
          </p>
          <h1 className="text-3xl md:text-4xl font-serif italic text-[var(--text-primary)]">
            {t('aboutTitle')}
          </h1>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="rounded-xl border border-[var(--border)] bg-[var(--space-card)] p-6"
            >
              <h2 className="text-lg font-serif text-[var(--text-primary)] mb-3">
                {section.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
                {section.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center space-y-4"
        >
          <Link
            href="/"
            className="inline-block rounded-xl bg-[var(--accent)] px-8 py-3 text-white font-medium hover:brightness-110 transition-all font-sans"
          >
            {t('aboutCTA')} →
          </Link>

          <div>
            <a
              href="https://harmonicwaves.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors font-sans"
            >
              {t('builtBy')}
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
