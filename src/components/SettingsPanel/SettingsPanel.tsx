'use client'

import { useTranslation } from '@/i18n/useTranslation'
import Modal from '@/components/ui/Modal'

export interface AstraraSettings {
  planetScale: number
  rotationSpeed: number
  rotationSoundEnabled: boolean
}

export const DEFAULT_SETTINGS: AstraraSettings = {
  planetScale: 1.0,
  rotationSpeed: 1.0,
  rotationSoundEnabled: false,
}

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  settings: AstraraSettings
  onSettingsChange: (s: AstraraSettings) => void
}

export default function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="font-[family-name:var(--font-display)] text-lg text-white/90 text-center mb-6">
        {t('settings.title')}
      </h2>

      {/* Planet Size */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40">
            {t('settings.planetSize')}
          </label>
          <span className="text-[10px] text-white/30">
            {Math.round(settings.planetScale * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.1"
          value={settings.planetScale}
          onChange={(e) => onSettingsChange({ ...settings, planetScale: parseFloat(e.target.value) })}
          className="w-full accent-purple-500 h-1 bg-white/10 rounded-full
                     appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-purple-400
                     [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        />
        <div className="flex justify-between text-[9px] text-white/20 mt-1">
          <span>{t('settings.small')}</span>
          <span>{t('settings.large')}</span>
        </div>
      </div>

      {/* Rotation Speed */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40">
            {t('settings.rotationSpeed')}
          </label>
          <span className="text-[10px] text-white/30">
            {settings.rotationSpeed === 0 ? t('settings.paused') : `${Math.round(settings.rotationSpeed * 100)}%`}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={settings.rotationSpeed}
          onChange={(e) => onSettingsChange({ ...settings, rotationSpeed: parseFloat(e.target.value) })}
          className="w-full accent-purple-500 h-1 bg-white/10 rounded-full
                     appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-4
                     [&::-webkit-slider-thumb]:h-4
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-purple-400
                     [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        />
        <div className="flex justify-between text-[9px] text-white/20 mt-1">
          <span>{t('settings.paused')}</span>
          <span>{t('settings.fast')}</span>
        </div>
      </div>

      {/* Rotation Sound Toggle */}
      <div className="flex items-center justify-between py-3">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-white/40 block">
            {t('settings.rotationSound')}
          </label>
          <span className="text-[9px] text-white/20">
            {t('settings.rotationSoundHint')}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSettingsChange({ ...settings, rotationSoundEnabled: !settings.rotationSoundEnabled })}
          className={`w-11 h-6 rounded-full transition-colors duration-300
                     flex items-center px-0.5 cursor-pointer select-none
                     ${settings.rotationSoundEnabled ? 'bg-purple-500/60' : 'bg-white/10'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-md
                          transition-transform duration-300
                          ${settings.rotationSoundEnabled ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => onSettingsChange(DEFAULT_SETTINGS)}
        className="w-full mt-6 py-2.5 rounded-xl text-xs text-white/30
                   border border-white/8 hover:border-white/15
                   hover:text-white/50 transition-all select-none"
      >
        {t('settings.reset')}
      </button>
    </Modal>
  )
}
