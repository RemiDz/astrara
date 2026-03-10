'use client'

import React, { useEffect, useRef } from 'react'
import type { PlanetPosition } from '@/components/NatalChartWheel/NatalChartWheel'

// ═══════════════════════════════════════════════════════════════
// Design Constants
// ═══════════════════════════════════════════════════════════════

const COLORS = {
  background: '#FFFFFF',
  textPrimary: '#2C2825',
  textSecondary: '#A09890',
  textTertiary: '#C8C0B8',
  structural: '#D8D0C8',
  gold: '#C9A84C',
  pinLine: '#C8C0B8',
}

const ELEMENT_BG: Record<string, string> = {
  fire: '#E0C4B4',
  earth: '#D0DEC8',
  air: '#CCE0EC',
  water: '#D4CCE4',
}

const ELEMENT_TEXT: Record<string, string> = {
  fire: '#A0644E',
  earth: '#5A7A50',
  air: '#4A7088',
  water: '#5A4A78',
}

const PLANET_COLORS: Record<string, string> = {
  Sun: '#D4A843',
  Moon: '#8A8E96',
  Mercury: '#4AAFA0',
  Venus: '#C97B8B',
  Mars: '#C4645A',
  Jupiter: '#C4964A',
  Saturn: '#B8A468',
  Uranus: '#4A7EC4',
  Neptune: '#7A6AAE',
  Pluto: '#8A6A96',
}

const SIGN_DATA: { name: string; glyph: string; abbr: string; element: string }[] = [
  { name: 'Aries', glyph: '\u2648', abbr: 'ARI', element: 'fire' },
  { name: 'Taurus', glyph: '\u2649', abbr: 'TAU', element: 'earth' },
  { name: 'Gemini', glyph: '\u264A', abbr: 'GEM', element: 'air' },
  { name: 'Cancer', glyph: '\u264B', abbr: 'CAN', element: 'water' },
  { name: 'Leo', glyph: '\u264C', abbr: 'LEO', element: 'fire' },
  { name: 'Virgo', glyph: '\u264D', abbr: 'VIR', element: 'earth' },
  { name: 'Libra', glyph: '\u264E', abbr: 'LIB', element: 'air' },
  { name: 'Scorpio', glyph: '\u264F', abbr: 'SCO', element: 'water' },
  { name: 'Sagittarius', glyph: '\u2650', abbr: 'SAG', element: 'fire' },
  { name: 'Capricorn', glyph: '\u2651', abbr: 'CAP', element: 'earth' },
  { name: 'Aquarius', glyph: '\u2652', abbr: 'AQU', element: 'air' },
  { name: 'Pisces', glyph: '\u2653', abbr: 'PIS', element: 'water' },
]

// ═══════════════════════════════════════════════════════════════
// Layout constants
// ═══════════════════════════════════════════════════════════════

const PADDING_X = 30
const HEADER_HEIGHT = 80
const BAND_HEIGHT = 52
const BAND_TOP = HEADER_HEIGHT

// Tier heights (distance from band bottom to orb centre)
const TIER_HEIGHTS = [60, 120, 180, 240, 300]
const MIN_X_SEPARATION = 100

// Orb sizes
const ORB_SIZE_PERSONAL = 34 // Sun, Moon, Mercury, Venus, Mars
const ORB_SIZE_SOCIAL = 30   // Jupiter, Saturn
const ORB_SIZE_OUTER = 26    // Uranus, Neptune, Pluto

const PERSONAL_PLANETS = new Set(['Sun', 'Moon', 'Mercury', 'Venus', 'Mars'])
const SOCIAL_PLANETS = new Set(['Jupiter', 'Saturn'])

function getOrbSize(name: string): number {
  if (PERSONAL_PLANETS.has(name)) return ORB_SIZE_PERSONAL
  if (SOCIAL_PLANETS.has(name)) return ORB_SIZE_SOCIAL
  return ORB_SIZE_OUTER
}

// ═══════════════════════════════════════════════════════════════
// Pin layout algorithm — collision avoidance
// ═══════════════════════════════════════════════════════════════

interface PinLayout {
  planet: PlanetPosition
  x: number
  pinHeight: number
  tier: number
  orbSize: number
}

function getXPosition(longitude: number, bandLeftX: number, bandWidth: number): number {
  const normalized = ((longitude % 360) + 360) % 360
  return bandLeftX + (normalized / 360) * bandWidth
}

function layoutPins(planets: PlanetPosition[], bandLeftX: number, bandWidth: number): PinLayout[] {
  // 1. Calculate X position for each planet
  const items = planets.map(p => ({
    planet: p,
    x: getXPosition(p.longitude, bandLeftX, bandWidth),
    orbSize: getOrbSize(p.name),
  }))

  // 2. Sort by X position (left to right)
  items.sort((a, b) => a.x - b.x)

  // 3. Assign tiers using greedy algorithm
  const assigned: PinLayout[] = []

  for (const item of items) {
    // Find which tiers are occupied by nearby planets
    const occupiedTiers = new Set<number>()
    for (const prev of assigned) {
      if (Math.abs(prev.x - item.x) < MIN_X_SEPARATION) {
        occupiedTiers.add(prev.tier)
      }
    }

    // Assign the lowest available tier
    let tier = 0
    while (occupiedTiers.has(tier)) {
      tier++
    }

    assigned.push({
      planet: item.planet,
      x: item.x,
      tier,
      pinHeight: TIER_HEIGHTS[Math.min(tier, TIER_HEIGHTS.length - 1)],
      orbSize: item.orbSize,
    })
  }

  return assigned
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════

export interface ZodiacBandChartProps {
  planets: PlanetPosition[]
  clientName: string
  birthDate: string
  birthTime: string
  width?: number
  height?: number
  onReady?: () => void
}

export default function ZodiacBandChart({
  planets,
  clientName,
  birthDate,
  birthTime,
  width = 800,
  height = 500,
  onReady,
}: ZodiacBandChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (onReady) {
      const timer = setTimeout(onReady, 100)
      return () => clearTimeout(timer)
    }
  }, [onReady])

  const bandLeftX = PADDING_X
  const bandWidth = width - PADDING_X * 2
  const segmentWidth = bandWidth / 12
  const bandBottom = BAND_TOP + BAND_HEIGHT

  // Layout all planet pins
  const pins = layoutPins(planets, bandLeftX, bandWidth)

  // Calculate needed height — find the tallest pin
  const maxPinBottom = pins.reduce((max, p) => {
    const orbY = bandBottom + p.pinHeight
    const labelBottom = orbY + p.orbSize / 2 + 16 + 14 + 10 // orb half + name + degree + margin
    return Math.max(max, labelBottom)
  }, bandBottom + 80)

  const svgHeight = Math.max(height, maxPinBottom + 30) // 30px bottom margin for watermark

  // Format birth date for display
  const displayDate = birthDate
    ? `${birthDate}${birthTime ? ` \u00B7 ${birthTime}` : ''}`
    : ''

  return (
    <svg
      ref={svgRef}
      width={width}
      height={svgHeight}
      viewBox={`0 0 ${width} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: COLORS.background }}
    >
      {/* Drop shadow filter for planet orbs */}
      <defs>
        {Object.entries(PLANET_COLORS).map(([name, color]) => (
          <filter key={name} id={`shadow-${name}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={color} floodOpacity="0.15" />
          </filter>
        ))}
      </defs>

      {/* ═══ HEADER ZONE ═══ */}
      <text
        x={width / 2}
        y={32}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="22"
        fontWeight="400"
        fill={COLORS.textPrimary}
      >
        {clientName}
      </text>
      <text
        x={width / 2}
        y={50}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="12"
        fontWeight="300"
        fill={COLORS.textSecondary}
      >
        {displayDate}
      </text>
      {/* Gold separator line */}
      <line
        x1={width * 0.2}
        y1={64}
        x2={width * 0.8}
        y2={64}
        stroke={COLORS.gold}
        strokeWidth="1"
        opacity="0.4"
      />

      {/* ═══ ZODIAC BAND ═══ */}
      {/* Top border */}
      <line
        x1={bandLeftX}
        y1={BAND_TOP}
        x2={bandLeftX + bandWidth}
        y2={BAND_TOP}
        stroke={COLORS.structural}
        strokeWidth="1"
      />
      {/* Bottom border */}
      <line
        x1={bandLeftX}
        y1={bandBottom}
        x2={bandLeftX + bandWidth}
        y2={bandBottom}
        stroke={COLORS.structural}
        strokeWidth="1"
      />

      {SIGN_DATA.map((sign, i) => {
        const segX = bandLeftX + i * segmentWidth
        const bg = ELEMENT_BG[sign.element]
        const textColor = ELEMENT_TEXT[sign.element]
        return (
          <g key={sign.name}>
            {/* Segment background */}
            <rect
              x={segX}
              y={BAND_TOP}
              width={segmentWidth}
              height={BAND_HEIGHT}
              fill={bg}
            />
            {/* White divider (except before first) */}
            {i > 0 && (
              <line
                x1={segX}
                y1={BAND_TOP}
                x2={segX}
                y2={bandBottom}
                stroke="#FFFFFF"
                strokeWidth="1"
              />
            )}
            {/* Zodiac glyph */}
            <text
              x={segX + segmentWidth / 2}
              y={BAND_TOP + 22}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="16"
              fill={textColor}
              opacity="0.7"
            >
              {sign.glyph}
            </text>
            {/* 3-letter abbreviation */}
            <text
              x={segX + segmentWidth / 2}
              y={BAND_TOP + 42}
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="9"
              fill={textColor}
              letterSpacing="1"
            >
              {sign.abbr}
            </text>
          </g>
        )
      })}

      {/* ═══ PLANET PINS ═══ */}
      {pins.map((pin) => {
        const { planet, x, pinHeight, orbSize } = pin
        const orbY = bandBottom + pinHeight
        const color = PLANET_COLORS[planet.name] || COLORS.textSecondary
        const nameText = planet.isRetrograde ? `${planet.name} \u211E` : planet.name
        const degreeText = `${Math.round(planet.degree)}\u00B0 ${planet.sign}`
        const orbRadius = orbSize / 2

        return (
          <g key={planet.name}>
            {/* Pin line */}
            <line
              x1={x}
              y1={bandBottom}
              x2={x}
              y2={orbY - orbRadius}
              stroke={COLORS.pinLine}
              strokeWidth="1"
            />
            {/* Planet orb with shadow */}
            <circle
              cx={x}
              cy={orbY}
              r={orbRadius}
              fill={color}
              filter={`url(#shadow-${planet.name})`}
            />
            {/* Planet symbol (white, centred in orb) */}
            <text
              x={x}
              y={orbY + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Georgia, serif"
              fontSize={orbSize * 0.45}
              fill="#FFFFFF"
            >
              {planet.symbol}
            </text>
            {/* Planet name */}
            <text
              x={x}
              y={orbY + orbRadius + 16}
              textAnchor="middle"
              fontFamily="Georgia, serif"
              fontSize="13"
              fontWeight="500"
              fill={COLORS.textPrimary}
            >
              {nameText}
            </text>
            {/* Degree + sign */}
            <text
              x={x}
              y={orbY + orbRadius + 30}
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="10"
              fill={COLORS.textSecondary}
            >
              {degreeText}
            </text>
          </g>
        )
      })}

      {/* ═══ DECORATIVE FOOTER ═══ */}
      {/* Gold decorative line */}
      <line
        x1={width * 0.2}
        y1={svgHeight - 24}
        x2={width * 0.8}
        y2={svgHeight - 24}
        stroke={COLORS.gold}
        strokeWidth="0.5"
        opacity="0.3"
      />
      {/* ASTRARA watermark */}
      <text
        x={width / 2}
        y={svgHeight - 8}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="8"
        fill="#D0C8C0"
        letterSpacing="4"
      >
        ASTRARA
      </text>
    </svg>
  )
}
