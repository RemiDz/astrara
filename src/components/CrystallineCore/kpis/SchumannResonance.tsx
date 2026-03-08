'use client'

import { useTranslation } from '@/i18n/useTranslation'

const BASE_FREQ = 7.83
const HARMONICS = [14.3, 20.8, 27.3, 33.8]

interface Props {}

export default function SchumannResonance(_props: Props) {
  const { lang } = useTranslation()

  // Generate sine wave path
  const W = 260
  const H = 40
  const makeWavePath = (freq: number, amp: number, yOffset: number) => {
    const points: string[] = []
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * W
      const t = i / 100
      // Gaussian envelope to taper edges
      const env = Math.exp(-Math.pow((t - 0.5) * 3, 2))
      const y = yOffset + Math.sin(t * Math.PI * 2 * (freq / BASE_FREQ) * 2) * amp * env
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return points.join(' ')
  }

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">
        {lang === 'lt' ? 'Žemės Širdies Ritmas' : "Earth's Heartbeat"}
      </p>

      <div className="flex flex-col items-center">
        {/* Main frequency display */}
        <p className="text-lg font-light text-white/80 font-[family-name:var(--font-mono)] mb-2">
          {BASE_FREQ} Hz
        </p>

        {/* SVG waves */}
        <svg width="100%" height="80" viewBox={`0 0 ${W} 80`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="schumann-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0" />
              <stop offset="30%" stopColor="#4ADE80" />
              <stop offset="70%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Base wave — 7.83 Hz */}
          <path
            d={makeWavePath(BASE_FREQ, 12, 20)}
            fill="none"
            stroke="url(#schumann-grad)"
            strokeWidth="1.5"
            opacity="0.7"
          />

          {/* Harmonics — progressively fainter */}
          {HARMONICS.map((freq, i) => (
            <path
              key={freq}
              d={makeWavePath(freq, 6 - i, 50 + i * 8)}
              fill="none"
              stroke="url(#schumann-grad)"
              strokeWidth="1"
              opacity={0.3 - i * 0.06}
            />
          ))}
        </svg>

        {/* Harmonics list */}
        <div className="flex gap-3 mt-1">
          {HARMONICS.map((freq) => (
            <span key={freq} className="text-[9px] text-white/25 font-[family-name:var(--font-mono)]">
              {freq} Hz
            </span>
          ))}
        </div>

        <p className="text-[10px] text-white/20 mt-2">
          {lang === 'lt' ? 'Šumano Rezonansas' : 'Schumann Resonance'}
        </p>
      </div>
    </div>
  )
}
