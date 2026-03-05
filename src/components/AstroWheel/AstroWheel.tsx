'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import ZodiacRing from './ZodiacRing'
import PlanetMarker from './PlanetMarker'

interface AstroWheelProps {
  planets: PlanetPosition[]
  aspects: AspectData[]
  onPlanetTap: (planet: PlanetPosition) => void
  onSignTap: (signId: string) => void
  onAspectTap: (aspect: AspectData) => void
  selectedPlanet: string | null
}

export default function AstroWheel({
  planets,
  aspects,
  onPlanetTap,
  onSignTap,
  onAspectTap,
  selectedPlanet,
}: AstroWheelProps) {
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const velocityRef = useRef(0)
  const lastAngleRef = useRef(0)
  const lastInteractionRef = useRef(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const animFrameRef = useRef<number>(0)
  const lastFrameTimeRef = useRef(Date.now())
  const anglesHistoryRef = useRef<{ angle: number; time: number }[]>([])
  const autoRotationSpeed = 0.072 // degrees per second

  const getAngleFromEvent = useCallback((clientX: number, clientY: number): number => {
    if (!svgRef.current) return 0
    const rect = svgRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI)
  }, [])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      const dt = (now - lastFrameTimeRef.current) / 1000
      lastFrameTimeRef.current = now

      if (!isDragging) {
        if (Math.abs(velocityRef.current) > 0.01) {
          // Momentum phase
          setRotation(prev => prev + velocityRef.current * dt * 60)
          velocityRef.current *= 0.97
        } else if (now - lastInteractionRef.current > 4000) {
          // Auto-rotation fade-in
          const timeSinceRelease = now - lastInteractionRef.current - 4000
          const fadeIn = Math.min(timeSinceRelease / 1000, 1)
          setRotation(prev => prev - autoRotationSpeed * fadeIn * dt)
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [isDragging])

  // Mouse/touch handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Check if the target is interactive (planet, sign, aspect)
    const target = e.target as SVGElement
    if (target.closest('[data-interactive]')) return

    e.preventDefault()
    setIsDragging(true)
    velocityRef.current = 0
    lastAngleRef.current = getAngleFromEvent(e.clientX, e.clientY)
    anglesHistoryRef.current = []
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }, [getAngleFromEvent])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const currentAngle = getAngleFromEvent(e.clientX, e.clientY)
    let delta = currentAngle - lastAngleRef.current

    // Handle wraparound
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360

    setRotation(prev => prev + delta)
    lastAngleRef.current = currentAngle

    // Track velocity
    const now = Date.now()
    anglesHistoryRef.current.push({ angle: delta, time: now })
    // Keep last 5 entries
    if (anglesHistoryRef.current.length > 5) anglesHistoryRef.current.shift()
  }, [isDragging, getAngleFromEvent])

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    lastInteractionRef.current = Date.now()

    // Calculate velocity from recent history
    const history = anglesHistoryRef.current
    if (history.length >= 2) {
      const totalDelta = history.reduce((sum, h) => sum + h.angle, 0)
      const totalTime = (history[history.length - 1].time - history[0].time) / 1000
      if (totalTime > 0) {
        velocityRef.current = (totalDelta / totalTime) * (1 / 60) // normalize to per-frame
      }
    }
  }, [isDragging])

  const size = 500
  const center = size / 2
  const outerRadius = 230
  const innerRadius = 170
  const planetRadius = 140

  return (
    <div className="relative w-full max-w-[90vw] md:max-w-[60vw] lg:max-w-[min(500px,45vw)] mx-auto aspect-square">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full touch-none select-none"
        style={{ willChange: 'transform' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Definitions */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c0c8e0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#c0c8e0" stopOpacity="0" />
          </radialGradient>
          {planets.map(p => (
            <radialGradient key={`glow-${p.id}`} id={`glow-${p.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={p.colour} stopOpacity="0.6" />
              <stop offset="50%" stopColor={p.colour} stopOpacity="0.2" />
              <stop offset="100%" stopColor={p.colour} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Center glow */}
        <circle cx={center} cy={center} r={innerRadius * 0.6} fill="url(#centerGlow)" />

        {/* Rotating group */}
        <g transform={`rotate(${rotation} ${center} ${center})`}>
          {/* Zodiac ring */}
          <ZodiacRing
            center={center}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            rotation={rotation}
            onSignTap={onSignTap}
          />

          {/* Planet markers */}
          {planets.map(planet => (
            <PlanetMarker
              key={planet.id}
              planet={planet}
              center={center}
              radius={planetRadius}
              rotation={rotation}
              isSelected={selectedPlanet === planet.id}
              onTap={() => onPlanetTap(planet)}
            />
          ))}
        </g>

        {/* Center earth dot */}
        <circle cx={center} cy={center} r={3} fill="rgba(255,255,255,0.2)" />

      </svg>
    </div>
  )
}
