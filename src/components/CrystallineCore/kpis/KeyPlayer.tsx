'use client'

import { useTranslation } from '@/i18n/useTranslation'
import type { PlanetPosition } from '@/lib/astronomy'
import { getPlanetMeta } from '@/lib/planets'

const PLANETARY_FREQUENCIES: Record<string, { hz: number; chakra: Record<string, string> }> = {
  sun:     { hz: 126.22, chakra: { en: 'Solar Plexus', lt: 'Saulės rezginys' } },
  moon:    { hz: 210.42, chakra: { en: 'Sacral', lt: 'Kryžkaulio čakra' } },
  mercury: { hz: 141.27, chakra: { en: 'Throat', lt: 'Gerklės čakra' } },
  venus:   { hz: 221.23, chakra: { en: 'Heart', lt: 'Širdies čakra' } },
  mars:    { hz: 144.72, chakra: { en: 'Root', lt: 'Šaknų čakra' } },
  jupiter: { hz: 183.58, chakra: { en: 'Crown', lt: 'Karūninė čakra' } },
  saturn:  { hz: 147.85, chakra: { en: 'Root', lt: 'Šaknų čakra' } },
  uranus:  { hz: 207.36, chakra: { en: 'Third Eye', lt: 'Trečioji akis' } },
  neptune: { hz: 211.44, chakra: { en: 'Crown', lt: 'Karūninė čakra' } },
  pluto:   { hz: 140.25, chakra: { en: 'Root', lt: 'Šaknų čakra' } },
}

const SIGN_ELEMENTS: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
}

const ELEMENT_COLOURS: Record<string, string> = {
  fire: '#FF6B4A', earth: '#4ADE80', air: '#60A5FA', water: '#A78BFA',
}

interface KeyPlanetInfo {
  planet: string
  reason: string
  reasonLt: string
}

interface Props {
  keyPlanet: KeyPlanetInfo
  planets: PlanetPosition[]
}

export default function KeyPlayer({ keyPlanet, planets }: Props) {
  const { t, lang } = useTranslation()

  const planetData = planets.find(p => p.id === keyPlanet.planet)
  const meta = getPlanetMeta(keyPlanet.planet)
  const freq = PLANETARY_FREQUENCIES[keyPlanet.planet]
  const element = planetData ? SIGN_ELEMENTS[planetData.zodiacSign] : null
  const borderColour = element ? ELEMENT_COLOURS[element] : 'rgba(255,255,255,0.1)'

  if (!planetData || !meta) return null

  const planetName = t(`planet.${keyPlanet.planet}`)
  const signName = t(`zodiac.${planetData.zodiacSign}`)
  const reason = lang === 'lt' ? keyPlanet.reasonLt : keyPlanet.reason

  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${borderColour}33`,
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${meta.colour}, transparent 70%)`,
        }}
      />

      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3 relative z-10">
        {lang === 'lt' ? 'Dienos Planeta' : 'Key Player'}
      </p>

      <div className="relative z-10 flex items-start gap-4">
        {/* Glyph */}
        <div className="text-3xl text-white flex-shrink-0" style={{ textShadow: `0 0 20px ${meta.colour}40` }}>
          {meta.glyph}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + position */}
          <p className="text-sm text-white/90 font-medium">
            {planetName}
            <span className="text-white/40 ml-1">
              {planetData.signGlyph} {signName} {planetData.degreeInSign.toFixed(1)}°
            </span>
          </p>

          {/* Reason */}
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            {reason}
          </p>

          {/* Frequency + chakra */}
          {freq && (
            <div className="flex gap-3 mt-2 text-[10px]">
              <span className="text-white/30 font-[family-name:var(--font-mono)]">
                {freq.hz} Hz
              </span>
              <span className="text-white/30">
                {freq.chakra[lang] ?? freq.chakra.en}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
