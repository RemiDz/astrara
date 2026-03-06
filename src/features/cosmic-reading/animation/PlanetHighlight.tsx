import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

const R_PLANET = 1.5

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
  const fadeRef = useRef(0) // fades in from 0→1

  const pos = longitudeToPos(planet.eclipticLongitude, R_PLANET)
  const glowColor = color ?? planet.colour
  const baseRadius = 0.25

  useFrame((_, delta) => {
    // Fade in
    fadeRef.current = Math.min(fadeRef.current + delta * 1.25, 1)
    timeRef.current += delta

    if (!meshRef.current || !matRef.current) return

    const fade = fadeRef.current
    let scale = 1.0
    let opacity = 0.2 * intensity * fade

    if (effect === 'pulse') {
      scale = 1.0 + Math.sin(timeRef.current * 2.5) * 0.15
      opacity = (0.15 + Math.sin(timeRef.current * 2.5) * 0.08) * intensity * fade
    } else if (effect === 'glow') {
      opacity = (0.18 + Math.sin(timeRef.current * 1.2) * 0.05) * intensity * fade
    } else if (effect === 'enlarge') {
      scale = 1.0 + 0.2 * fade
    }

    meshRef.current.scale.setScalar(scale)
    matRef.current.opacity = opacity
  })

  return (
    <mesh ref={meshRef} position={pos}>
      <sphereGeometry args={[baseRadius, 16, 16]} />
      <meshBasicMaterial
        ref={matRef}
        color={glowColor}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
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
