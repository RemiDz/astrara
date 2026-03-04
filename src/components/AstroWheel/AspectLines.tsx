'use client'

import type { AspectData, PlanetPosition } from '@/lib/astronomy'

interface AspectLinesProps {
  aspects: AspectData[]
  planets: PlanetPosition[]
  center: number
  radius: number
}

export default function AspectLines({ aspects, planets, center, radius }: AspectLinesProps) {
  return (
    <g>
      {aspects.map((aspect, i) => {
        const p1 = planets.find(p => p.id === aspect.planet1)
        const p2 = planets.find(p => p.id === aspect.planet2)
        if (!p1 || !p2) return null

        const angle1 = (p1.eclipticLongitude - 90) * (Math.PI / 180)
        const angle2 = (p2.eclipticLongitude - 90) * (Math.PI / 180)

        const x1 = center + Math.cos(angle1) * radius
        const y1 = center + Math.sin(angle1) * radius
        const x2 = center + Math.cos(angle2) * radius
        const y2 = center + Math.sin(angle2) * radius

        const opacity = aspect.isApplying ? 0.4 : 0.15
        const dashArray = aspect.type === 'conjunction' ? 'none' : '4,4'

        return (
          <line
            key={`aspect-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={aspect.colour}
            strokeWidth={1}
            strokeDasharray={dashArray}
            opacity={opacity}
            className="pointer-events-none"
          >
            <animate
              attributeName="opacity"
              values={`${opacity * 0.7};${opacity};${opacity * 0.7}`}
              dur="4s"
              repeatCount="indefinite"
            />
          </line>
        )
      })}
    </g>
  )
}
