'use client'

import { useMemo, type ReactNode } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import type { PlanetPosition } from '@/lib/astronomy'

const ELEMENT_COLOURS: Record<string, string> = {
  fire: '#FF6B4A',
  earth: '#4ADE80',
  air: '#60A5FA',
  water: '#A78BFA',
}

const SIGN_ELEMENTS: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
}

const LUMINARIES = new Set(['sun', 'moon'])

const ELEMENT_ICONS: Record<string, ReactNode> = {
  fire: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#FF6B4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c0 6-6 8-6 14a6 6 0 0012 0c0-6-6-8-6-14z" fill="rgba(255,107,74,0.15)" />
    </svg>
  ),
  earth: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V8" /><path d="M5 12l7-4 7 4" /><path d="M8 16l4-2 4 2" />
    </svg>
  ),
  air: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8c2-2 6-2 8 0s6 2 8 0" /><path d="M4 14c2-2 6-2 8 0s6 2 8 0" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16c2-3 5-3 7 0s5 3 7 0s5 3 7 0" /><path d="M3 10c2-3 5-3 7 0s5 3 7 0s5 3 7 0" />
    </svg>
  ),
}

const ELEMENT_MEANINGS: Record<string, Record<string, string>> = {
  fire: {
    en: 'The sky burns with directed will. Action carries momentum today.',
    lt: 'Dangus dega nukreipta valia. Šiandien veiksmas turi pagreitį.',
  },
  earth: {
    en: 'The cosmos grounds into form. Practical steps bear fruit today.',
    lt: 'Kosmosas įžeminamas į formą. Praktiniai žingsniai šiandien duoda vaisių.',
  },
  air: {
    en: 'Ideas flow freely. Communication and connection are amplified.',
    lt: 'Idėjos teka laisvai. Bendravimas ir ryšys sustiprinti.',
  },
  water: {
    en: 'Emotional currents run deep. Intuition is your compass today.',
    lt: 'Emocinės srovės teka giliai. Intuicija šiandien yra jūsų kompasas.',
  },
}

interface Props {
  planets: PlanetPosition[]
}

export default function ElementBalance({ planets }: Props) {
  const { t, lang } = useTranslation()

  const { counts, total, dominant } = useMemo(() => {
    const c = { fire: 0, earth: 0, air: 0, water: 0 }
    for (const p of planets) {
      const el = SIGN_ELEMENTS[p.zodiacSign]
      if (el) c[el as keyof typeof c] += LUMINARIES.has(p.id) ? 2 : 1
    }
    const tot = c.fire + c.earth + c.air + c.water
    const max = Math.max(c.fire, c.earth, c.air, c.water)
    const winners = (Object.entries(c) as [string, number][]).filter(([, v]) => v === max)
    const dom = winners.length === 1 ? winners[0][0] : 'fire'
    return { counts: c, total: tot, dominant: dom }
  }, [planets])

  // SVG donut chart
  const R = 52
  const STROKE = 10
  const CIRCUMFERENCE = 2 * Math.PI * R
  const elements = ['fire', 'earth', 'air', 'water'] as const

  let offset = 0
  const segments = elements.map((el) => {
    const fraction = total > 0 ? counts[el] / total : 0.25
    const dashLen = fraction * CIRCUMFERENCE
    const seg = { element: el, dash: dashLen, offset, colour: ELEMENT_COLOURS[el] }
    offset += dashLen
    return seg
  })

  const dominantName = t(`element.${dominant}`)
  const meaning = ELEMENT_MEANINGS[dominant]?.[lang] ?? ELEMENT_MEANINGS[dominant]?.en ?? ''

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
        {lang === 'lt' ? 'Dominuojanti Energija' : 'Dominant Energy'}
      </p>

      <div className="flex flex-col items-center">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {segments.map((seg) => (
            <circle
              key={seg.element}
              cx="70" cy="70" r={R}
              fill="none"
              stroke={seg.colour}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dash} ${CIRCUMFERENCE - seg.dash}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
              style={{ opacity: 0.85 }}
            />
          ))}
          {/* Centre icon + label */}
          <foreignObject x="42" y="38" width="56" height="64">
            <div className="flex flex-col items-center justify-center h-full">
              {ELEMENT_ICONS[dominant]}
              <span className="text-[10px] text-white/60 mt-1">{dominantName}</span>
            </div>
          </foreignObject>
        </svg>

        {/* Legend */}
        <div className="flex gap-3 mt-2 mb-2">
          {elements.map((el) => (
            <div key={el} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: ELEMENT_COLOURS[el] }} />
              <span className="text-[9px] text-white/40">{t(`element.${el}`)}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/50 text-center leading-relaxed mt-1">
          {meaning}
        </p>
      </div>
    </div>
  )
}
