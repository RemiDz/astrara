'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n';

interface Props {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function PlayButton({ isPlaying, onToggle }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
          isPlaying
            ? 'bg-[var(--accent-warm)] shadow-[var(--accent-warm)]/20'
            : 'bg-[var(--accent)] shadow-[var(--accent)]/20 animate-gentle-pulse'
        }`}
      >
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border-2 border-[var(--accent-warm)] animate-ping opacity-20" />
        )}
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
        )}
      </motion.button>
      <span className="text-xs text-[var(--text-dim)] font-sans">
        {isPlaying ? t('sessionComplete') : t('listenCTA')}
      </span>
    </div>
  );
}
