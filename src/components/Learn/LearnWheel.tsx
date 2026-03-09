'use client'

import { useMemo } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import { ZODIAC_SIGNS, ELEMENT_COLOURS } from '@/lib/zodiac'
import { PLANETS } from '@/lib/planets'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'

interface LearnWheelProps {
  planets: PlanetPosition[]
  aspects: AspectData[]
  selectedId: string | null
  onPlanetTap: (id: string) => void
  onSignTap: (id: string) => void
}

const SIZE = 500
const CX = SIZE / 2
const CY = SIZE / 2
const R_OUTER = 210
const R_INNER = 170
const R_PLANET = 130
const R_GLYPH = 192

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

function lonToAngle(lon: number) {
  // SVG: 0° Aries = top (12 o'clock), clockwise
  return lon - 90
}

function polarToXY(angleDeg: number, radius: number) {
  const rad = degToRad(angleDeg)
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function arcPath(startAngle: number, endAngle: number, outerR: number, innerR: number) {
  const s1 = polarToXY(startAngle, outerR)
  const s2 = polarToXY(endAngle, outerR)
  const s3 = polarToXY(endAngle, innerR)
  const s4 = polarToXY(startAngle, innerR)
  const large = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${s2.x} ${s2.y}`,
    `L ${s3.x} ${s3.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${s4.x} ${s4.y}`,
    'Z',
  ].join(' ')
}

export default function LearnWheel({ planets, aspects, selectedId, onPlanetTap, onSignTap }: LearnWheelProps) {
  const { t } = useTranslation()

  const selectedPlanetIds = useMemo(() => {
    if (!selectedId) return new Set<string>()
    // If a planet is selected, highlight it and its aspect partners
    const ids = new Set<string>([selectedId])
    aspects.forEach(a => {
      if (a.planet1 === selectedId) ids.add(a.planet2)
      if (a.planet2 === selectedId) ids.add(a.planet1)
    })
    return ids
  }, [selectedId, aspects])

  const zodiacSegments = ZODIAC_SIGNS.map((sign, i) => {
    const startAngle = lonToAngle(i * 30)
    const endAngle = lonToAngle((i + 1) * 30)
    const midAngle = lonToAngle(i * 30 + 15)
    const glyphPos = polarToXY(midAngle, R_GLYPH)
    const colour = ELEMENT_COLOURS[sign.element]
    const isSelected = selectedId === sign.id

    return (
      <g key={sign.id} onClick={() => onSignTap(sign.id)} style={{ cursor: 'pointer' }}>
        <path
          d={arcPath(startAngle, endAngle, R_OUTER, R_INNER)}
          fill={colour}
          fillOpacity={isSelected ? 0.25 : 0.08}
          stroke={colour}
          strokeOpacity={isSelected ? 0.6 : 0.2}
          strokeWidth={1}
          style={{ transition: 'fill-opacity 0.2s, stroke-opacity 0.2s' }}
        />
        <text
          x={glyphPos.x}
          y={glyphPos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={colour}
          fillOpacity={isSelected ? 1 : 0.6}
          fontSize={16}
          fontFamily="var(--font-body)"
          style={{ transition: 'fill-opacity 0.2s' }}
        >
          {sign.glyph}
        </text>
      </g>
    )
  })

  const planetDots = planets.map(p => {
    const meta = PLANETS.find(m => m.id === p.id)
    if (!meta) return null
    const angle = lonToAngle(p.eclipticLongitude)
    const pos = polarToXY(angle, R_PLANET)
    const isSelected = selectedId === p.id
    const isDimmed = selectedId && !selectedPlanetIds.has(p.id)

    return (
      <g key={p.id} onClick={() => onPlanetTap(p.id)} style={{ cursor: 'pointer' }}>
        <circle
          cx={pos.x}
          cy={pos.y}
          r={isSelected ? 7 : 5}
          fill={meta.colour}
          fillOpacity={isDimmed ? 0.2 : 1}
          style={{ transition: 'r 0.2s, fill-opacity 0.2s' }}
        />
        {isSelected && (
          <circle
            cx={pos.x}
            cy={pos.y}
            r={12}
            fill="none"
            stroke={meta.colour}
            strokeOpacity={0.4}
            strokeWidth={1.5}
          />
        )}
        <text
          x={pos.x}
          y={pos.y - 12}
          textAnchor="middle"
          fill={meta.colour}
          fillOpacity={isDimmed ? 0.2 : 0.8}
          fontSize={11}
          fontFamily="var(--font-body)"
          style={{ transition: 'fill-opacity 0.2s' }}
        >
          {meta.glyph}
        </text>
      </g>
    )
  })

  const aspectLines = aspects.map((a, i) => {
    const p1 = planets.find(p => p.id === a.planet1)
    const p2 = planets.find(p => p.id === a.planet2)
    if (!p1 || !p2) return null

    const angle1 = lonToAngle(p1.eclipticLongitude)
    const angle2 = lonToAngle(p2.eclipticLongitude)
    const pos1 = polarToXY(angle1, R_PLANET)
    const pos2 = polarToXY(angle2, R_PLANET)
    const isConnected = selectedPlanetIds.has(a.planet1) && selectedPlanetIds.has(a.planet2)
    const opacity = selectedId ? (isConnected ? 0.7 : 0.05) : 0.15

    return (
      <line
        key={`${a.planet1}-${a.planet2}-${i}`}
        x1={pos1.x}
        y1={pos1.y}
        x2={pos2.x}
        y2={pos2.y}
        stroke={a.colour}
        strokeOpacity={opacity}
        strokeWidth={isConnected ? 1.5 : 0.8}
        style={{ transition: 'stroke-opacity 0.2s, stroke-width 0.2s' }}
      />
    )
  })

  return (
    <div className="flex justify-center px-4">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[500px]"
        style={{ aspectRatio: '1 / 1' }}
      >
        {/* Inner circle */}
        <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
        <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

        {/* Aspect lines (behind planets) */}
        {aspectLines}

        {/* Zodiac segments */}
        {zodiacSegments}

        {/* Planet dots */}
        {planetDots}

        {/* Centre dot */}
        <circle cx={CX} cy={CY} r={3} fill="rgba(255,255,255,0.15)" />
      </svg>
    </div>
  )
}
