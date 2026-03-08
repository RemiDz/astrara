'use client'

import { useTranslation } from '@/i18n/useTranslation'

const SEGMENT_COLOURS = [
  '#4ADE80', '#4ADE80', // 0-1: green
  '#60A5FA', '#60A5FA', // 2-3: blue
  '#FFD700', '#FFD700', // 4-5: gold
  '#FF8C00', '#FF8C00', // 6-7: orange
  '#FF4444', '#FF4444', // 8-9: red
]

const KP_LABELS: Record<string, Record<string, string>> = {
  quiet:     { en: 'Quiet', lt: 'Ramu' },
  unsettled: { en: 'Unsettled', lt: 'Nestabilu' },
  active:    { en: 'Active Storm', lt: 'Aktyvi audra' },
  severe:    { en: 'Severe Storm', lt: 'Stipri audra' },
}

const KP_GUIDANCE: Record<string, Record<string, string>> = {
  low:  { en: 'Clear field for sensitive work', lt: 'Geras laukas jautriam darbui' },
  high: { en: 'Ground before deep sessions', lt: 'Įžeminkitės prieš gilius seansus' },
}

function getKpLevel(kp: number): string {
  if (kp <= 1) return 'quiet'
  if (kp <= 3) return 'unsettled'
  if (kp <= 5) return 'active'
  return 'severe'
}

interface Props {
  kpIndex: number | null
  loading?: boolean
}

export default function KpIndex({ kpIndex, loading }: Props) {
  const { lang } = useTranslation()

  if (loading || kpIndex === null) {
    return (
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">Kp Index</p>
        <div className="h-12 rounded bg-white/5 animate-pulse" />
      </div>
    )
  }

  const level = getKpLevel(kpIndex)
  const label = KP_LABELS[level]?.[lang] ?? KP_LABELS[level]?.en ?? ''
  const guidance = kpIndex <= 3
    ? (KP_GUIDANCE.low[lang] ?? KP_GUIDANCE.low.en)
    : (KP_GUIDANCE.high[lang] ?? KP_GUIDANCE.high.en)

  const kpClamped = Math.max(0, Math.min(9, Math.round(kpIndex)))

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
        {lang === 'lt' ? 'Geomagnetinis Aktyvumas' : 'Geomagnetic Activity'}
      </p>

      <div className="flex items-center gap-3">
        {/* Kp number */}
        <span
          className="text-2xl font-light"
          style={{ color: SEGMENT_COLOURS[kpClamped] }}
        >
          {kpIndex.toFixed(1)}
        </span>

        {/* Bar */}
        <div className="flex-1">
          <div className="flex gap-0.5 h-3 rounded-sm overflow-hidden">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="flex-1 relative"
                style={{
                  background: i <= kpClamped
                    ? SEGMENT_COLOURS[i]
                    : 'rgba(255,255,255,0.05)',
                  opacity: i <= kpClamped ? 0.8 : 1,
                }}
              >
                {i === kpClamped && (
                  <div
                    className="absolute inset-0"
                    style={{
                      boxShadow: `0 0 6px ${SEGMENT_COLOURS[i]}`,
                      background: SEGMENT_COLOURS[i],
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-white/20">0</span>
            <span className="text-[8px] text-white/20">9</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] text-white/40">{label}</span>
        <span className="text-[10px] text-white/30">{guidance}</span>
      </div>
    </div>
  )
}
