'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-[#1E1F2E] bg-[#0F1019] px-5 py-3 text-sm text-[#E8ECF4] font-sans shadow-2xl flex items-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {message}
    </motion.div>
  );
}

export default function ShareCard() {
  const { t } = useLanguage();
  const [showToast, setShowToast] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setShowToast(true);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-[#0F1019] border border-[#1E1F2E] rounded-2xl p-6 text-center"
      >
        <p className="text-sm font-medium text-[#E8ECF4] mb-4 font-sans">
          {t('shareTitle')}
        </p>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#3B82F6] text-white text-sm rounded-xl font-sans hover:brightness-110 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {t('shareButton')}
        </button>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <Toast message={t('shareCopied')} onDone={() => setShowToast(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
