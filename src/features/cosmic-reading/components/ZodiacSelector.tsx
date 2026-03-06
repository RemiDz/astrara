'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { ZODIAC_SIGNS, ZODIAC_ORDER } from '../utils/zodiacHelpers'
import { getExistingBirthData, saveZodiacProfile } from '../utils/storage'
import { getPlanetPositions } from '@/lib/astronomy'
import type { ZodiacProfile, ZodiacSign } from '../types'

interface ZodiacSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (profile: ZodiacProfile) => void
  initialSign?: ZodiacSign | null
}

export default function ZodiacSelector({ isOpen, onClose, onSelect, initialSign }: ZodiacSelectorProps) {
  const { t } = useTranslation()
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(initialSign ?? null)
  const [hasBirthData, setHasBirthData] = useState(false)

  // Check for existing birth data and auto-derive sign
  useEffect(() => {
    if (!isOpen) return
    const birthData = getExistingBirthData()
    if (!birthData) { setHasBirthData(false); return }
    setHasBirthData(true)

    if (!selectedSign) {
      try {
        const [year, month, day] = birthData.date.split('-').map(Number)
        const [hours, minutes] = birthData.time.split(':').map(Number)
        const birthDateTime = new Date(year, month - 1, day, hours, minutes)
        const planets = getPlanetPositions(birthDateTime, birthData.lat, birthData.lng)
        const sun = planets.find(p => p.id === 'sun')
        if (sun) setSelectedSign(sun.zodiacSign as ZodiacSign)
      } catch { /* ignore */ }
    }
  }, [isOpen, selectedSign])

  // Sync initialSign when modal opens
  useEffect(() => {
    if (isOpen && initialSign) setSelectedSign(initialSign)
  }, [isOpen, initialSign])

  if (!isOpen) return null

  const handleContinue = () => {
    if (!selectedSign) return
    const now = new Date().toISOString()
    const profile: ZodiacProfile = {
      sunSign: selectedSign,
      createdAt: now,
      updatedAt: now,
    }
    saveZodiacProfile(profile)
    onSelect(profile)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Glass card */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 sm:mx-auto rounded-t-2xl sm:rounded-2xl p-6 pb-8 zodiac-selector-enter"
        style={{
          maxWidth: 'min(32rem, calc(100vw - 32px))',
          background: 'linear-gradient(180deg, rgba(13, 13, 26, 0.92) 0%, rgba(13, 13, 26, 0.97) 100%)',
          border: '1px solid rgba(147, 197, 253, 0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
        }}
      >
        {/* Handle bar (mobile) */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6 sm:hidden" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors select-none text-lg"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="text-lg font-[family-name:var(--font-display)] text-white/90 text-center mb-1">
          {t('reading.selectSign')}
        </h3>
        <p className="text-xs text-white/40 text-center mb-5">
          {t('reading.selectSignSubtitle')}
        </p>

        {/* 4×3 zodiac grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {ZODIAC_ORDER.map(sign => {
            const info = ZODIAC_SIGNS[sign]
            const isSelected = selectedSign === sign
            return (
              <button
                key={sign}
                type="button"
                onClick={() => setSelectedSign(sign)}
                className={`flex flex-col items-center py-3 px-1 rounded-xl transition-all duration-200 active:scale-95 select-none ${
                  isSelected
                    ? 'bg-purple-500/15 border-purple-400/40 shadow-[0_0_12px_rgba(167,139,250,0.2)]'
                    : 'bg-white/4 border-white/6 hover:bg-white/8'
                }`}
                style={{ border: `1px solid ${isSelected ? 'rgba(167, 139, 250, 0.4)' : 'rgba(255, 255, 255, 0.06)'}` }}
              >
                <span className="text-2xl mb-1" style={{ color: info.colour }}>{info.symbol}</span>
                <span className="text-[11px] text-white/80">{t(`zodiac.${sign}`)}</span>
                <span className="text-[9px] text-white/30 mt-0.5">{info.dateRange}</span>
              </button>
            )
          })}
        </div>

        {/* Birth chart link */}
        {hasBirthData && (
          <p className="text-[10px] text-purple-300/50 text-center mb-4">
            {t('reading.useBirthChart')}
          </p>
        )}

        {/* Continue button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedSign}
          className="w-full py-3.5 rounded-xl font-medium text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200 select-none disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('reading.continue')}
        </button>
      </div>

      <style>{`
        @keyframes zodiacSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .zodiac-selector-enter {
          animation: zodiacSlideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
