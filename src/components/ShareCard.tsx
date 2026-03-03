'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

export default function ShareCard() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--space-card)] p-6 text-center"
    >
      <h3 className="text-lg font-serif text-[var(--text-primary)] mb-4">
        {t('shareTitle')}
      </h3>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--space-hover)] px-6 py-3 text-sm text-[var(--text-primary)] hover:border-[var(--border-active)] transition-colors font-sans"
      >
        {copied ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {t('shareCopied')}
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {t('shareButton')}
          </>
        )}
      </button>
    </motion.div>
  );
}
