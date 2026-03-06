'use client'

import { useTranslation } from '@/i18n/useTranslation'

interface PhaseNavigationProps {
  onNext: () => void
  onExit: () => void
  isLastPhase: boolean
  isSummary: boolean
}

export default function PhaseNavigation({ onNext, onExit, isLastPhase, isSummary }: PhaseNavigationProps) {
  const { t } = useTranslation()

  if (isSummary) {
    return (
      <button
        type="button"
        onClick={onExit}
        className="w-full py-3.5 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 select-none"
      >
        {t('reading.close')}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onNext}
      className="w-full py-3.5 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 select-none"
    >
      {isLastPhase ? `${t('reading.summary')} ✦` : t('reading.next')}
    </button>
  )
}
