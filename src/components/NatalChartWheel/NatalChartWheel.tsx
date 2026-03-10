'use client'

import React, { useEffect, useRef } from 'react'
import { layoutPlanetLabels } from './labelLayout'

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface PlanetPosition {
  name: string
  symbol: string
  longitude: number    // 0-360
  sign: string
  degree: number       // 0-30
  isRetrograde: boolean
}

export interface NatalChartWheelProps {
  planets: PlanetPosition[]
  birthDate: string
  birthTime: string
  size?: number
  onReady?: () => void
}

// ═══════════════════════════════════════════════════════════════
// Design Constants
// ═══════════════════════════════════════════════════════════════

const PLANET_COLORS: Record<string, string> = {
  Sun: '#D4A017', Moon: '#C8C8D0', Mercury: '#20B2AA',
  Venus: '#DB7093', Mars: '#CD5C5C', Jupiter: '#E8903A',
  Saturn: '#B8860B', Uranus: '#4169E1', Neptune: '#6A5ACD',
  Pluto: '#9B59B6',
}

// Element colours matching Astrara palette
const ELEMENT_COLORS: Record<string, string> = {
  fire: '#E07A5F',   // terracotta
  earth: '#81B29A',  // sage
  air: '#9DB4C0',    // silver-blue
  water: '#5E7CE2',  // indigo
}

const SIGN_DATA: { name: string; glyph: string; element: string }[] = [
  { name: 'Aries', glyph: '\u2648', element: 'fire' },
  { name: 'Taurus', glyph: '\u2649', element: 'earth' },
  { name: 'Gemini', glyph: '\u264A', element: 'air' },
  { name: 'Cancer', glyph: '\u264B', element: 'water' },
  { name: 'Leo', glyph: '\u264C', element: 'fire' },
  { name: 'Virgo', glyph: '\u264D', element: 'earth' },
  { name: 'Libra', glyph: '\u264E', element: 'air' },
  { name: 'Scorpio', glyph: '\u264F', element: 'water' },
  { name: 'Sagittarius', glyph: '\u2650', element: 'fire' },
  { name: 'Capricorn', glyph: '\u2651', element: 'earth' },
  { name: 'Aquarius', glyph: '\u2652', element: 'air' },
  { name: 'Pisces', glyph: '\u2653', element: 'water' },
]

const GOLD = '#C9A84C'
const BG = '#05050F'

// Aspect definitions
const ASPECT_DEFS: { name: string; angle: number; orb: number; color: string; dash?: string; width: number }[] = [
  { name: 'conjunction', angle: 0, orb: 8, color: '#C9A84C', width: 1.2 },
  { name: 'sextile', angle: 60, orb: 6, color: '#34D399', dash: '2 4', width: 0.8 },
  { name: 'square', angle: 90, orb: 7, color: '#F87171', width: 0.8 },
  { name: 'trine', angle: 120, orb: 8, color: '#5E7CE2', dash: '4 3', width: 1 },
  { name: 'opposition', angle: 180, orb: 8, color: '#F87171', dash: '3 3', width: 0.8 },
]

// ═══════════════════════════════════════════════════════════════
// Geometry helpers
// ═══════════════════════════════════════════════════════════════

// 0° Aries at 9 o'clock (left), counter-clockwise (astrological standard)
function toXY(angleDeg: number, radius: number, cx: number, cy: number): [number, number] {
  const rad = (180 + angleDeg) * Math.PI / 180
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export default function NatalChartWheel({
  planets,
  birthDate,
  birthTime,
  size = 600,
  onReady,
}: NatalChartWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Signal ready after paint
    if (onReady) {
      const timer = setTimeout(onReady, 100)
      return () => clearTimeout(timer)
    }
  }, [onReady])

  const cx = size / 2
  const cy = size / 2
  const unit = size / 600 // scale factor

  // Ring radii (proportional to size)
  const outerR = size * 0.46          // outermost border
  const signNameOuter = outerR
  const signNameInner = outerR - 28 * unit
  const glyphOuter = signNameInner - 4 * unit
  const glyphInner = glyphOuter - 26 * unit
  const tickOuter = glyphInner - 2 * unit
  const tickInner = tickOuter - 10 * unit
  const planetRingR = tickInner - 12 * unit  // default planet label radius
  const aspectR = planetRingR - 40 * unit     // inner area for aspect lines
  const centreR = 18 * unit

  // Compute aspects between planets
  const aspects: { i: number; j: number; type: string; color: string; dash?: string; width: number }[] = []
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = angleDiff(planets[i].longitude, planets[j].longitude)
      for (const asp of ASPECT_DEFS) {
        if (Math.abs(diff - asp.angle) <= asp.orb) {
          aspects.push({ i, j, type: asp.name, color: asp.color, dash: asp.dash, width: asp.width })
          break
        }
      }
    }
  }

  // Layout planet labels with collision avoidance
  const labelPositions = layoutPlanetLabels(
    planets.map(p => ({ name: p.name, longitude: p.longitude })),
    planetRingR,
    14,
  )

  // Build lookup: planetName -> labelPosition
  const labelMap = new Map(labelPositions.map(lp => [lp.planetName, lp]))

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: BG }}
    >
      <defs>
        {/* Centre radial glow */}
        <radialGradient id="centreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.15" />
          <stop offset="60%" stopColor={GOLD} stopOpacity="0.03" />
          <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
        </radialGradient>

        {/* Planet glow filter */}
        <filter id="planetGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={3 * unit} result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft glow for gold rings */}
        <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={1.5 * unit} />
        </filter>

        {/* Background stars */}
        <radialGradient id="starGrad">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background cosmic glow */}
      <circle cx={cx} cy={cy} r={outerR + 30 * unit} fill="url(#centreGlow)" />

      {/* Subtle background stars */}
      {[
        [0.12, 0.18, 1.2], [0.85, 0.15, 0.8], [0.08, 0.78, 1.0],
        [0.92, 0.82, 0.9], [0.5, 0.06, 0.7], [0.95, 0.5, 1.1],
        [0.05, 0.5, 0.6], [0.5, 0.95, 0.8], [0.3, 0.92, 0.5],
        [0.7, 0.08, 0.6], [0.2, 0.35, 0.4], [0.78, 0.65, 0.5],
      ].map(([px, py, r], i) => (
        <circle key={`star-${i}`} cx={size * (px as number)} cy={size * (py as number)}
          r={(r as number) * unit} fill="white" opacity={0.15 + (i % 3) * 0.08} />
      ))}

      {/* ═══ Ring 1: Zodiac Sign Ring ═══ */}
      {SIGN_DATA.map((sign, i) => {
        const elemColor = ELEMENT_COLORS[sign.element]
        const startDeg = i * 30
        const endDeg = (i + 1) * 30
        const midDeg = startDeg + 15

        // Segment wedge path
        const [ox1, oy1] = toXY(startDeg, signNameOuter, cx, cy)
        const [ox2, oy2] = toXY(endDeg, signNameOuter, cx, cy)
        const [ix1, iy1] = toXY(startDeg, signNameInner, cx, cy)
        const [ix2, iy2] = toXY(endDeg, signNameInner, cx, cy)

        // Sign name position (along outer arc)
        const nameR = (signNameOuter + signNameInner) / 2
        const [nx, ny] = toXY(midDeg, nameR, cx, cy)

        return (
          <g key={`sign-${i}`}>
            {/* Segment fill */}
            <path
              d={`M ${ix1} ${iy1} L ${ox1} ${oy1} A ${signNameOuter} ${signNameOuter} 0 0 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${signNameInner} ${signNameInner} 0 0 0 ${ix1} ${iy1} Z`}
              fill={elemColor}
              opacity={0.12}
            />
            {/* Divider line */}
            <line x1={ix1} y1={iy1} x2={ox1} y2={oy1}
              stroke={GOLD} strokeWidth={0.8 * unit} opacity={0.3} />
            {/* Sign name */}
            <text x={nx} y={ny}
              textAnchor="middle" dominantBaseline="central"
              fill={elemColor} opacity={0.8}
              fontSize={7.5 * unit} fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="600" letterSpacing={1.5 * unit}>
              {sign.name.toUpperCase()}
            </text>
          </g>
        )
      })}
      {/* Outer ring border */}
      <circle cx={cx} cy={cy} r={signNameOuter} fill="none"
        stroke={GOLD} strokeWidth={1 * unit} opacity={0.5} />
      <circle cx={cx} cy={cy} r={signNameInner} fill="none"
        stroke={GOLD} strokeWidth={0.7 * unit} opacity={0.35} />
      {/* Gold ring glow */}
      <circle cx={cx} cy={cy} r={signNameOuter} fill="none"
        stroke={GOLD} strokeWidth={2 * unit} opacity={0.08} filter="url(#goldGlow)" />

      {/* ═══ Ring 2: Zodiac Glyph Ring ═══ */}
      {SIGN_DATA.map((sign, i) => {
        const elemColor = ELEMENT_COLORS[sign.element]
        const startDeg = i * 30
        const endDeg = (i + 1) * 30
        const midDeg = startDeg + 15

        const [gx1, gy1] = toXY(startDeg, glyphOuter, cx, cy)
        const [gx2, gy2] = toXY(endDeg, glyphOuter, cx, cy)
        const [gi1, gi1y] = toXY(startDeg, glyphInner, cx, cy)
        const [gi2, gi2y] = toXY(endDeg, glyphInner, cx, cy)

        const glyphR = (glyphOuter + glyphInner) / 2
        const [glx, gly] = toXY(midDeg, glyphR, cx, cy)

        return (
          <g key={`glyph-${i}`}>
            {/* Segment background */}
            <path
              d={`M ${gi1} ${gi1y} L ${gx1} ${gy1} A ${glyphOuter} ${glyphOuter} 0 0 1 ${gx2} ${gy2} L ${gi2} ${gi2y} A ${glyphInner} ${glyphInner} 0 0 0 ${gi1} ${gi1y} Z`}
              fill={elemColor}
              opacity={0.07}
            />
            {/* Zodiac glyph */}
            <text x={glx} y={gly}
              textAnchor="middle" dominantBaseline="central"
              fill={elemColor} opacity={0.85}
              fontSize={16 * unit} fontFamily="serif">
              {sign.glyph}
            </text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={glyphOuter} fill="none"
        stroke={GOLD} strokeWidth={0.6 * unit} opacity={0.3} />
      <circle cx={cx} cy={cy} r={glyphInner} fill="none"
        stroke={GOLD} strokeWidth={0.6 * unit} opacity={0.3} />

      {/* ═══ Ring 3: Degree Tick Ring ═══ */}
      {Array.from({ length: 360 }, (_, deg) => {
        const isBoundary = deg % 30 === 0
        const isMajor = deg % 10 === 0
        const isMinor = deg % 5 === 0

        if (!isBoundary && !isMajor && !isMinor) return null

        const tLen = isBoundary ? 8 * unit : isMajor ? 5 * unit : 3 * unit
        const [x1, y1] = toXY(deg, tickOuter, cx, cy)
        const [x2, y2] = toXY(deg, tickOuter - tLen, cx, cy)
        const opacity = isBoundary ? 0.4 : isMajor ? 0.25 : 0.12

        return (
          <line key={`tick-${deg}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={GOLD} strokeWidth={(isBoundary ? 0.8 : 0.4) * unit} opacity={opacity} />
        )
      })}
      {/* Degree numbers at 10° intervals */}
      {Array.from({ length: 36 }, (_, i) => {
        const deg = i * 10
        if (deg % 30 === 0) return null // skip boundaries (already labelled by sign)
        const degInSign = deg % 30
        const [tx, ty] = toXY(deg, tickOuter - 11 * unit, cx, cy)
        return (
          <text key={`deg-${deg}`} x={tx} y={ty}
            textAnchor="middle" dominantBaseline="central"
            fill={GOLD} opacity={0.2}
            fontSize={5 * unit} fontFamily="'Courier New', monospace">
            {degInSign}°
          </text>
        )
      })}
      <circle cx={cx} cy={cy} r={tickInner} fill="none"
        stroke={GOLD} strokeWidth={0.5 * unit} opacity={0.25} />

      {/* ═══ Ring 4: Aspect Lines ═══ */}
      {aspects.map((asp, i) => {
        const p1 = planets[asp.i]
        const p2 = planets[asp.j]
        const [x1, y1] = toXY(p1.longitude, aspectR, cx, cy)
        const [x2, y2] = toXY(p2.longitude, aspectR, cx, cy)
        return (
          <line key={`asp-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={asp.color} strokeWidth={asp.width * unit}
            strokeDasharray={asp.dash || 'none'}
            opacity={0.22} />
        )
      })}

      {/* ═══ Planet Ring ═══ */}
      {planets.map((planet, i) => {
        const lp = labelMap.get(planet.name)
        if (!lp) return null

        const color = PLANET_COLORS[planet.name] || GOLD

        // Actual planet position (dot)
        const [dotX, dotY] = toXY(planet.longitude, planetRingR, cx, cy)

        // Label position (may be displaced)
        const [lblX, lblY] = toXY(lp.labelAngleDeg, lp.labelRadius, cx, cy)

        // Name position (outward from label)
        const nameR = lp.labelRadius + 16 * unit
        const [nameX, nameY] = toXY(lp.labelAngleDeg, nameR, cx, cy)

        // Degree position (inward from label)
        const degR = lp.labelRadius - 16 * unit
        const [degX, degY] = toXY(lp.labelAngleDeg, degR, cx, cy)

        const signAbbr = planet.sign.length > 3 ? planet.sign.substring(0, 3).toUpperCase() : planet.sign.toUpperCase()
        const posLabel = `${Math.floor(planet.degree)}° ${signAbbr}`

        return (
          <g key={`planet-${i}`}>
            {/* Leader line (if label displaced) */}
            {lp.needsLeaderLine && (
              <line x1={dotX} y1={dotY} x2={lblX} y2={lblY}
                stroke={color} strokeWidth={0.6 * unit} opacity={0.3}
                strokeDasharray={`${2 * unit} ${2 * unit}`} />
            )}

            {/* Planet orb glow */}
            <circle cx={lblX} cy={lblY} r={12 * unit}
              fill={color} opacity={0.12} filter="url(#planetGlow)" />

            {/* Planet dot */}
            <circle cx={lblX} cy={lblY} r={7 * unit}
              fill={color} opacity={0.85} />

            {/* Planet symbol inside dot */}
            <text x={lblX} y={lblY}
              textAnchor="middle" dominantBaseline="central"
              fill="white" opacity={0.95}
              fontSize={8.5 * unit} fontFamily="serif" fontWeight="bold">
              {planet.symbol}
            </text>

            {/* Full planet name (outward) */}
            <text x={nameX} y={nameY}
              textAnchor="middle" dominantBaseline="central"
              fill={color} opacity={0.75}
              fontSize={7 * unit} fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="600">
              {planet.name}{planet.isRetrograde ? ' \u211E' : ''}
            </text>

            {/* Degree + sign label (inward) */}
            <text x={degX} y={degY}
              textAnchor="middle" dominantBaseline="central"
              fill="#E0E0E8" opacity={0.5}
              fontSize={5.5 * unit} fontFamily="'Courier New', monospace">
              {posLabel}
            </text>

            {/* Pointer line from planet dot to tick ring */}
            <line
              x1={lblX} y1={lblY}
              x2={toXY(planet.longitude, tickInner, cx, cy)[0]}
              y2={toXY(planet.longitude, tickInner, cx, cy)[1]}
              stroke={color} strokeWidth={0.4 * unit} opacity={0.2} />
          </g>
        )
      })}

      {/* ═══ Centre ═══ */}
      {/* Inner glow */}
      <circle cx={cx} cy={cy} r={centreR * 2} fill="url(#centreGlow)" />

      {/* Centre star */}
      <text x={cx} y={cy - 4 * unit}
        textAnchor="middle" dominantBaseline="central"
        fill={GOLD} opacity={0.6}
        fontSize={14 * unit} fontFamily="serif">
        ✦
      </text>

      {/* Birth date + time */}
      <text x={cx} y={cy + 10 * unit}
        textAnchor="middle" dominantBaseline="central"
        fill={GOLD} opacity={0.45}
        fontSize={6 * unit} fontFamily="Georgia, 'Times New Roman', serif">
        {birthDate}{birthTime ? ` · ${birthTime}` : ''}
      </text>
    </svg>
  )
}
