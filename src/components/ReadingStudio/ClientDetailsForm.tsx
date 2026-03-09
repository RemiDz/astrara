'use client'

import { useTranslation } from '@/i18n/useTranslation'
import ZodiacGrid from './ZodiacGrid'

export interface NatalInfo {
  sunSign: string
  sunGlyph: string
  moonSign: string
  moonGlyph: string
}

interface ClientDetailsFormProps {
  clientName: string
  onClientNameChange: (name: string) => void
  inputMode: 'zodiac' | 'birthdate'
  onInputModeChange: (mode: 'zodiac' | 'birthdate') => void
  zodiacSign: string
  onZodiacSignChange: (signId: string) => void
  birthDate: string
  onBirthDateChange: (date: string) => void
  birthTime: string
  onBirthTimeChange: (time: string) => void
  birthCity: string
  onBirthCityChange: (city: string) => void
  natalInfo: NatalInfo | null
}

const inputStyle: React.CSSProperties = {
  WebkitAppearance: 'none',
  appearance: 'none',
  minWidth: 0,
  colorScheme: 'dark',
  fontSize: '16px',
}

export default function ClientDetailsForm({
  clientName, onClientNameChange,
  inputMode, onInputModeChange,
  zodiacSign, onZodiacSignChange,
  birthDate, onBirthDateChange,
  birthTime, onBirthTimeChange,
  birthCity, onBirthCityChange,
  natalInfo,
}: ClientDetailsFormProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-5">
      {/* Client Name */}
      <div>
        <label className="block text-xs text-white/30 uppercase tracking-wider mb-2">
          {t('studio.clientName')}
        </label>
        <input
          type="text"
          value={clientName}
          onChange={e => onClientNameChange(e.target.value)}
          placeholder={t('studio.clientNamePlaceholder')}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
          style={inputStyle}
        />
      </div>

      {/* Input Mode Toggle */}
      <div>
        <label className="block text-xs text-white/30 uppercase tracking-wider mb-2">
          {t('studio.inputMode')}
        </label>
        <div className="flex gap-2">
          {(['zodiac', 'birthdate'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => onInputModeChange(mode)}
              className="flex-1 py-2 px-4 rounded-lg text-sm transition-all cursor-pointer border"
              style={{
                background: inputMode === mode ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: inputMode === mode ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)',
                color: inputMode === mode ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {mode === 'zodiac' ? t('studio.inputModeZodiac') : t('studio.inputModeBirthdate')}
            </button>
          ))}
        </div>
      </div>

      {/* Zodiac Sign Selector */}
      {inputMode === 'zodiac' && (
        <ZodiacGrid selected={zodiacSign} onSelect={onZodiacSignChange} />
      )}

      {/* Birth Date Inputs */}
      {inputMode === 'birthdate' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/30 uppercase tracking-wider mb-2">
              {t('studio.birthDate')}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={e => onBirthDateChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs text-white/30 uppercase tracking-wider mb-2">
              {t('studio.birthTime')}
            </label>
            <input
              type="time"
              value={birthTime}
              onChange={e => onBirthTimeChange(e.target.value)}
              placeholder="12:00"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-colors"
              style={inputStyle}
            />
            <p className="text-xs text-white/20 mt-1">{t('studio.birthTimeHint')}</p>
          </div>
          <div>
            <label className="block text-xs text-white/30 uppercase tracking-wider mb-2">
              {t('studio.birthCity')}
            </label>
            <input
              type="text"
              value={birthCity}
              onChange={e => onBirthCityChange(e.target.value)}
              placeholder={t('studio.birthCityHint')}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
              style={inputStyle}
            />
          </div>

          {/* Calculated natal signs */}
          {natalInfo && (
            <div className="flex flex-wrap gap-3 py-2 px-3 rounded-lg text-sm" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <span className="text-white/70">
                {natalInfo.sunGlyph} {t('studio.sunIn')} {natalInfo.sunSign}
              </span>
              <span className="text-white/30">·</span>
              <span className="text-white/70">
                {natalInfo.moonGlyph} {t('studio.moonIn')} {natalInfo.moonSign}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
