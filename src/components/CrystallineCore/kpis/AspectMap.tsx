'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { AspectData } from '@/lib/astronomy'

const ASPECT_COLOURS: Record<string, string> = {
  conjunction: '#FFD700',
  sextile: '#4DCCB0',
  square: '#FF6B4A',
  trine: '#60A5FA',
  opposition: '#A78BFA',
}

function orbOpacity(orb: number): number {
  if (orb < 1) return 0.9
  if (orb < 3) return 0.6
  return 0.35
}

interface Props {
  aspects: AspectData[]
}

export default function AspectMap({ aspects }: Props) {
  const { lang } = useTranslation()

  const displayed = aspects.slice(0, 5)

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
        {lang === 'lt' ? 'Planetų Aspektai' : 'Planetary Aspects'}
      </p>

      {displayed.length === 0 ? (
        <p className="text-xs text-white/30 text-center py-2">
          {lang === 'lt'
            ? 'Giedras dangus — šiandien jokių svarbių planetinių pokalbių'
            : 'Clear sky — no major planetary conversations today'}
        </p>
      ) : (
        <div className="space-y-1.5">
          {displayed.map((aspect, i) => {
            const colour = ASPECT_COLOURS[aspect.type] ?? 'rgba(255,255,255,0.3)'
            const opacity = orbOpacity(aspect.orb)

            return (
              <div
                key={i}
                className="flex items-center gap-2 py-1"
                style={{ opacity }}
              >
                {/* Planet A glyph */}
                <span className="text-sm text-white/80 w-5 text-center">{aspect.planet1Glyph}</span>

                {/* Aspect symbol */}
                <span className="text-xs w-4 text-center" style={{ color: colour }}>
                  {aspect.symbol}
                </span>

                {/* Planet B glyph */}
                <span className="text-sm text-white/80 w-5 text-center">{aspect.planet2Glyph}</span>

                {/* Orb */}
                <span className="text-[10px] text-white/30 font-[family-name:var(--font-mono)] ml-auto">
                  {aspect.orb.toFixed(1)}°
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
