'use client'

import { useTranslation } from '@/i18n/useTranslation'
import { useReadingContext } from '../ReadingContext'

interface CosmicReadingButtonProps {
  disabled?: boolean
}

export default function CosmicReadingButton({ disabled }: CosmicReadingButtonProps) {
  const { t } = useTranslation()
  const { startReading } = useReadingContext()

  return (
    <>
      <button
        type="button"
        onClick={startReading}
        disabled={disabled}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 text-sm transition-all duration-200 hover:bg-white/10 hover:text-white/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="reading-shimmer">✦</span>
        <span>{t('reading.cosmicReading')}</span>
      </button>

      <style>{`
        @keyframes cosmicShimmer {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; text-shadow: 0 0 8px rgba(167, 139, 250, 0.6); }
        }
        .reading-shimmer {
          animation: cosmicShimmer 3s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
