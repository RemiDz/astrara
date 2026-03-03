'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import { useLanguage } from '@/lib/i18n';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <StarField />

      <div className="relative z-10 w-full max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-[var(--text-secondary)] font-serif mb-3">
            {t('brand')}
          </p>
          <h1 className="text-3xl md:text-5xl font-serif italic text-[var(--text-primary)] mb-4 leading-tight">
            {t('tagline')}
          </h1>
          <p className="text-[var(--text-secondary)] font-sans text-sm md:text-base">
            {t('subtitle')}
          </p>
        </motion.div>

        <BirthForm />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <Link
            href="/about"
            className="text-sm text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors font-sans"
          >
            {t('howItWorks')} →
          </Link>
          <a
            href="https://harmonicwaves.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--text-dim)] hover:text-[var(--text-secondary)] transition-colors font-sans"
          >
            {t('partOfEcosystem')}
          </a>
        </motion.div>
      </div>
    </main>
  );
}
