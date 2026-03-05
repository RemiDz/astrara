'use client'

import type { EarthData } from '@/lib/earth-data'
import { useTranslation } from '@/i18n/useTranslation'
import { useLanguage } from '@/i18n/LanguageContext'
import { getEarthInsight, getBodyMindPractice } from '@/lib/earth-insights'
import Modal from '@/components/ui/Modal'

function getKpAuraColour(kp: number): string {
  if (kp <= 1) return '#22c55e'
  if (kp <= 2) return '#4ade80'
  if (kp <= 3) return '#a3e635'
  if (kp <= 4) return '#facc15'
  if (kp <= 5) return '#f59e0b'
  if (kp <= 6) return '#ef4444'
  if (kp <= 7) return '#dc2626'
  if (kp <= 8) return '#a855f7'
  return '#c026d3'
}

function getKpStormLabel(kp: number): string {
  if (kp <= 1) return 'Quiet'
  if (kp <= 3) return 'Unsettled'
  if (kp <= 4) return 'Active'
  if (kp <= 5) return 'Minor storm'
  if (kp <= 6) return 'Moderate storm'
  if (kp <= 7) return 'Strong storm'
  if (kp <= 8) return 'Severe storm'
  return 'Extreme storm'
}

function KpBar({ kp }: { kp: number }) {
  const segments = Array.from({ length: 9 }, (_, i) => i + 1)

  const getColour = (index: number) => {
    if (index <= 1) return '#4ADE80'
    if (index <= 3) return '#FACC15'
    if (index <= 4) return '#FB923C'
    if (index <= 6) return '#F87171'
    return '#DC2626'
  }

  return (
    <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
      {segments.map(i => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{
            background: i <= Math.round(kp) ? getColour(i) : 'rgba(255,255,255,0.06)',
          }}
        />
      ))}
    </div>
  )
}

interface EarthPanelProps {
  isOpen: boolean
  onClose: () => void
  earthData: EarthData | null
  loading: boolean
}

export default function EarthPanel({ isOpen, onClose, earthData, loading }: EarthPanelProps) {
  const { t } = useTranslation()
  const { lang } = useLanguage()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="text-center mb-5">
        <div className="text-3xl mb-2">🌍</div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-white tracking-wide">
          {t('earth.title')}
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
          {t('earth.subtitle')}
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
            {t('earth.loading')}
          </div>
        </div>
      )}

      {earthData && (
        <>
          {/* Error notice */}
          {earthData.fetchError && (
            <div className="text-center mb-4 px-3 py-2 rounded-xl bg-yellow-500/10 border border-yellow-400/20">
              <p className="text-xs text-yellow-300/70">{t('earth.error')}</p>
            </div>
          )}

          <div className="w-full h-px bg-white/8 mb-4" />

          {/* How Earth Feels Right Now */}
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('earth.howFeels')}
          </h3>
          <p className="font-[family-name:var(--font-display)] text-sm italic leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
            &ldquo;{getEarthInsight(earthData, lang)}&rdquo;
          </p>

          <div className="w-full h-px bg-white/8 mb-4" />

          {/* Geomagnetic Activity */}
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('earth.geomagneticActivity')}
          </h3>
          <div className="glass-card p-4 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: getKpAuraColour(earthData.kpIndex), boxShadow: `0 0 6px ${getKpAuraColour(earthData.kpIndex)}80` }}
                />
                {t('earth.kpIndex')}: <span className="text-white font-medium">{earthData.kpIndex}</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{
                background: `${getKpAuraColour(earthData.kpIndex)}25`,
                color: getKpAuraColour(earthData.kpIndex),
              }}>
                {getKpStormLabel(earthData.kpIndex)}
              </span>
            </div>
            <KpBar kp={earthData.kpIndex} />
            {earthData.kpTimestamp && (
              <p className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
                {t('earth.updated')}: {earthData.kpTimestamp.split('.')[0]} UTC
              </p>
            )}
          </div>

          {/* Solar Wind */}
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('earth.solarWind')}
          </h3>
          <div className="glass-card p-4 mb-5">
            <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>{t('earth.speed')}</span>
                <span>{earthData.solarWindSpeed > 0 ? `${Math.round(earthData.solarWindSpeed)} km/s` : '—'} <span className="text-xs opacity-60">{earthData.solarWindSpeedLabel}</span></span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>{t('earth.density')}</span>
                <span>{earthData.solarWindDensity > 0 ? `${earthData.solarWindDensity.toFixed(1)} p/cm³` : '—'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>{t('earth.magneticField')}</span>
                <span>{earthData.bzComponent !== 0 ? `${earthData.bzComponent.toFixed(1)} nT` : '—'} <span className="text-xs opacity-60">{earthData.bzLabel}</span></span>
              </div>
            </div>
          </div>

          {/* Earth Frequency */}
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('earth.frequency')}
          </h3>
          <div className="glass-card p-4 mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('earth.schumannResonance')}</span>
              <span className="text-white font-medium">{earthData.schumannBase} Hz</span>
            </div>
            <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-muted)' }}>
              {lang === 'lt'
                ? 'Žemės elektromagnetinis širdies plakimas — ties Teta ir Alfa smegenų bangų riba.'
                : "The Earth's electromagnetic heartbeat — at the boundary between Theta and Alpha brainwaves."}
            </p>
            <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
              <span>{t('earth.harmonics')}:</span>
              <span>{earthData.schumannHarmonics.join(' · ')} Hz</span>
            </div>
          </div>

          <div className="w-full h-px bg-white/8 mb-4" />

          {/* What This Means For You */}
          <h3 className="text-[10px] uppercase tracking-widest mb-2.5" style={{ color: 'var(--text-muted)' }}>
            {t('earth.whatThisMeans')}
          </h3>
          {(() => {
            const bmp = getBodyMindPractice(earthData, lang)
            return (
              <div className="space-y-3 mb-5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div>
                  <span className="text-xs font-medium block mb-0.5" style={{ color: 'var(--text-muted)' }}>{t('earth.body')}</span>
                  <span>{bmp.body}</span>
                </div>
                <div>
                  <span className="text-xs font-medium block mb-0.5" style={{ color: 'var(--text-muted)' }}>{t('earth.mind')}</span>
                  <span>{bmp.mind}</span>
                </div>
                <div>
                  <span className="text-xs font-medium block mb-0.5" style={{ color: 'var(--text-muted)' }}>{t('earth.practice')}</span>
                  <span>{bmp.practice}</span>
                </div>
              </div>
            )
          })()}

          <div className="w-full h-px bg-white/8 mb-4" />

          {/* Deep dive link */}
          <a
            href="https://shumann.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl
                       bg-blue-500/10 border border-blue-400/20
                       text-blue-300/70 text-sm
                       hover:bg-blue-500/15 hover:text-blue-300
                       transition-all select-none"
          >
            <span>🌍</span>
            <span>{t('earth.deepDive')}</span>
          </a>
        </>
      )}
    </Modal>
  )
}
