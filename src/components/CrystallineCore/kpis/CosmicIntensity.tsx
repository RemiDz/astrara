'use client'

import { useMemo } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import type { PlanetPosition, AspectData, MoonData } from '@/lib/astronomy'

const INTENSITY_LABELS: Record<string, Record<string, string>> = {
  '1': { en: 'Stillness', lt: 'Ramybė' },
  '2': { en: 'Stillness', lt: 'Ramybė' },
  '3': { en: 'Gentle', lt: 'Švelnu' },
  '4': { en: 'Gentle', lt: 'Švelnu' },
  '5': { en: 'Active', lt: 'Aktyvu' },
  '6': { en: 'Active', lt: 'Aktyvu' },
  '7': { en: 'Intense', lt: 'Intensyvu' },
  '8': { en: 'Intense', lt: 'Intensyvu' },
  '9': { en: 'Powerful', lt: 'Galinga' },
  '10': { en: 'Powerful', lt: 'Galinga' },
}

interface Props {
  planets: PlanetPosition[]
  aspects: AspectData[]
  moon: MoonData
}

export default function CosmicIntensity({ planets, aspects, moon }: Props) {
  const { lang } = useTranslation()

  const score = useMemo(() => {
    let raw = 0
    // Active aspects (orb < 5°)
    const activeAspects = aspects.filter(a => a.orb < 5)
    raw += activeAspects.length
    // Exact aspects (orb < 1°)
    raw += activeAspects.filter(a => a.orb < 1).length * 2
    // Retrograde planets
    raw += planets.filter(p => p.isRetrograde).length * 2
    // Full or new moon
    if (moon.phase === 'Full Moon' || moon.phase === 'New Moon') raw += 1
    // Normalise to 1-10
    return Math.max(1, Math.min(10, Math.round(raw * 10 / 20) || 1))
  }, [planets, aspects, moon])

  const label = INTENSITY_LABELS[String(score)]
  const labelText = label?.[lang] ?? label?.en ?? ''

  // Semi-circular gauge
  const W = 200
  const H = 120
  const R = 75
  const CX = W / 2
  const CY = H - 10
  const startAngle = Math.PI
  const endAngle = 0
  const scoreAngle = startAngle + (1 - (score - 1) / 9) * (startAngle - endAngle)

  // Arc path
  const arcPath = (angle1: number, angle2: number, r: number) => {
    const x1 = CX + Math.cos(angle1) * r
    const y1 = CY + Math.sin(angle1) * r
    const x2 = CX + Math.cos(angle2) * r
    const y2 = CY + Math.sin(angle2) * r
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }

  // Needle position
  const needleX = CX + Math.cos(scoreAngle) * (R - 8)
  const needleY = CY + Math.sin(scoreAngle) * (R - 8)

  // Gradient stops for the arc
  const gradientId = 'intensity-grad'

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
        {lang === 'lt' ? 'Kosminis Intensyvumas' : 'Cosmic Intensity'}
      </p>

      <div className="flex flex-col items-center">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="35%" stopColor="#4ADE80" />
              <stop offset="65%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF4444" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d={arcPath(Math.PI, 0, R)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Coloured arc */}
          <path
            d={arcPath(Math.PI, 0, R)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Needle dot */}
          <circle cx={needleX} cy={needleY} r="5" fill="white" opacity="0.9" />
          <circle cx={needleX} cy={needleY} r="3" fill="white" />

          {/* Score number */}
          <text x={CX} y={CY - 15} textAnchor="middle" fill="white" fontSize="28" fontWeight="300" opacity="0.9">
            {score}
          </text>
        </svg>

        <p className="text-xs text-white/50 -mt-1">{labelText}</p>
      </div>
    </div>
  )
}
