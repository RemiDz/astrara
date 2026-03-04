'use client'

import { ZODIAC_SIGNS, ELEMENT_COLOURS } from '@/lib/zodiac'

interface ZodiacRingProps {
  center: number
  outerRadius: number
  innerRadius: number
  rotation: number
  onSignTap: (signId: string) => void
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

export default function ZodiacRing({ center, outerRadius, innerRadius, rotation, onSignTap }: ZodiacRingProps) {
  const midRadius = (outerRadius + innerRadius) / 2

  return (
    <g>
      {ZODIAC_SIGNS.map((sign, i) => {
        const startAngle = i * 30
        const endAngle = (i + 1) * 30
        const midAngle = startAngle + 15
        const elementColour = ELEMENT_COLOURS[sign.element]

        // Arc segment path
        const outerStart = polarToCartesian(center, center, outerRadius, startAngle)
        const outerEnd = polarToCartesian(center, center, outerRadius, endAngle)
        const innerStart = polarToCartesian(center, center, innerRadius, startAngle)
        const innerEnd = polarToCartesian(center, center, innerRadius, endAngle)

        const pathD = [
          `M ${outerStart.x} ${outerStart.y}`,
          `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
          `L ${innerEnd.x} ${innerEnd.y}`,
          `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
          'Z',
        ].join(' ')

        // Label position
        const labelPos = polarToCartesian(center, center, midRadius, midAngle)

        return (
          <g key={sign.id}>
            {/* Segment fill */}
            <path
              d={pathD}
              fill={elementColour}
              fillOpacity={0.08}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
              data-interactive="true"
              className="cursor-pointer hover:fill-opacity-20 transition-all duration-200"
              onClick={(e) => { e.stopPropagation(); onSignTap(sign.id) }}
            />

            {/* Sign glyph + name (counter-rotated so always upright) */}
            <g transform={`translate(${labelPos.x}, ${labelPos.y})`}>
              <g transform={`rotate(${-rotation})`}>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  dy="-6"
                  fill="rgba(255,255,255,0.5)"
                  fontSize="14"
                  fontFamily="serif"
                  className="pointer-events-none select-none"
                >
                  {sign.glyph}
                </text>
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  dy="8"
                  fill="rgba(255,255,255,0.25)"
                  fontSize="7"
                  fontFamily="var(--font-body), sans-serif"
                  className="pointer-events-none select-none"
                >
                  {sign.name}
                </text>
              </g>
            </g>

            {/* Degree markers at segment boundaries */}
            <line
              x1={polarToCartesian(center, center, outerRadius, startAngle).x}
              y1={polarToCartesian(center, center, outerRadius, startAngle).y}
              x2={polarToCartesian(center, center, innerRadius, startAngle).x}
              y2={polarToCartesian(center, center, innerRadius, startAngle).y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
            />
          </g>
        )
      })}

      {/* Outer and inner ring borders */}
      <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
      <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
    </g>
  )
}
