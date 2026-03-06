import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

const R_PLANET = 1.5
const PLANET_RADIUS = 0.25

function longitudeToPos(longitude: number, radius: number): [number, number, number] {
  const rad = (longitude - 90) * (Math.PI / 180)
  return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
}

interface HighlightDef {
  bodyId: string
  effect: 'pulse' | 'glow' | 'enlarge'
  color?: string
  intensity: number
}

interface PlanetHighlightProps {
  highlights: HighlightDef[]
  planets: PlanetPosition[]
}

function GlowOrb({
  planet,
  effect,
  color,
  intensity,
}: {
  planet: PlanetPosition
  effect: 'pulse' | 'glow' | 'enlarge'
  color?: string
  intensity: number
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const matRef = useRef<THREE.MeshBasicMaterial>(null!)
  const timeRef = useRef(0)
  const fadeRef = useRef(0)

  const pos = longitudeToPos(planet.eclipticLongitude, R_PLANET)
  const glowColor = color ?? planet.colour
  const glowRadius = PLANET_RADIUS * 1.8

  useFrame((_, delta) => {
    fadeRef.current = Math.min(fadeRef.current + delta * 1.25, 1)
    timeRef.current += delta

    if (!meshRef.current || !matRef.current) return

    const fade = fadeRef.current
    let scale = 1.5
    let opacity = 0.25 * intensity * fade

    if (effect === 'pulse') {
      scale = 1.5 + Math.sin(timeRef.current * 1.5) * 0.2
      opacity = (0.2 + Math.sin(timeRef.current * 1.5) * 0.06) * intensity * fade
    } else if (effect === 'glow') {
      scale = 1.4 + Math.sin(timeRef.current * 1.2) * 0.15
      opacity = (0.25 + Math.sin(timeRef.current * 1.2) * 0.05) * intensity * fade
    } else if (effect === 'enlarge') {
      scale = 1.5 + 0.15 * fade
    }

    meshRef.current.scale.setScalar(scale)
    matRef.current.opacity = opacity
  })

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[glowRadius, 16, 16]} />
      <meshBasicMaterial
        ref={matRef}
        color={glowColor}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

export default function PlanetHighlight({ highlights, planets }: PlanetHighlightProps) {
  if (highlights.length === 0) return null

  return (
    <group>
      {highlights.map(h => {
        const planet = planets.find(p => p.id === h.bodyId)
        if (!planet) return null
        return (
          <GlowOrb
            key={h.bodyId}
            planet={planet}
            effect={h.effect}
            color={h.color}
            intensity={h.intensity}
          />
        )
      })}
    </group>
  )
}
