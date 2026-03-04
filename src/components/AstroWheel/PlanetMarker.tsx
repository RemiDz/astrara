'use client'

import type { PlanetPosition } from '@/lib/astronomy'

interface PlanetMarkerProps {
  planet: PlanetPosition
  center: number
  radius: number
  rotation: number
  isSelected: boolean
  onTap: () => void
}

export default function PlanetMarker({ planet, center, radius, rotation, isSelected, onTap }: PlanetMarkerProps) {
  const angleDeg = planet.eclipticLongitude - 90
  const angleRad = angleDeg * (Math.PI / 180)
  const x = center + Math.cos(angleRad) * radius
  const y = center + Math.sin(angleRad) * radius
  const orbSize = planet.size / 2

  // Unique animation delay per planet for breathing effect
  const breathDuration = 3 + (planet.id.charCodeAt(0) % 3)

  return (
    <g
      data-interactive="true"
      className="cursor-pointer"
      onClick={(e) => { e.stopPropagation(); onTap() }}
    >
      {/* Outer glow */}
      <circle
        cx={x}
        cy={y}
        r={orbSize + 12}
        fill={`url(#glow-${planet.id})`}
        opacity={isSelected ? 0.6 : 0.3}
      >
        <animate
          attributeName="opacity"
          values={isSelected ? '0.4;0.7;0.4' : '0.2;0.4;0.2'}
          dur={`${breathDuration}s`}
          repeatCount="indefinite"
        />
      </circle>

      {/* Planet orb */}
      <circle
        cx={x}
        cy={y}
        r={orbSize}
        fill={planet.colour}
        opacity={0.9}
        stroke={isSelected ? 'white' : 'none'}
        strokeWidth={isSelected ? 1.5 : 0}
      />

      {/* Inner highlight */}
      <circle
        cx={x - orbSize * 0.2}
        cy={y - orbSize * 0.2}
        r={orbSize * 0.4}
        fill="white"
        opacity={0.15}
      />

      {/* Label (counter-rotated) */}
      <g transform={`translate(${x}, ${y + orbSize + 12})`}>
        <g transform={`rotate(${-rotation})`}>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill={planet.colour}
            fontSize="11"
            fontFamily="var(--font-body), sans-serif"
            opacity={0.8}
            className="pointer-events-none select-none"
          >
            {planet.glyph} {planet.degreeInSign}°
          </text>
          {/* Retrograde indicator */}
          {planet.isRetrograde && (
            <text
              textAnchor="middle"
              dominantBaseline="central"
              dy="11"
              fill={planet.colour}
              fontSize="8"
              fontFamily="var(--font-body), sans-serif"
              opacity={0.6}
              className="pointer-events-none select-none"
            >
              Rx
            </text>
          )}
        </g>
      </g>

      {/* Hit area (larger for fat finger tolerance) */}
      <circle
        cx={x}
        cy={y}
        r={orbSize + 20}
        fill="transparent"
        data-interactive="true"
      />
    </g>
  )
}
