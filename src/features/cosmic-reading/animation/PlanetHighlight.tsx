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
  const innerRef = useRef<THREE.Mesh>(null!)
  const outerRef = useRef<THREE.Mesh>(null!)
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null!)
  const outerMatRef = useRef<THREE.MeshBasicMaterial>(null!)
  const timeRef = useRef(0)
  const fadeRef = useRef(0)

  const pos = longitudeToPos(planet.eclipticLongitude, R_PLANET)

  // Brighten the glow colour
  const baseColor = new THREE.Color(color ?? planet.colour)
  baseColor.multiplyScalar(1.8)

  useFrame((_, delta) => {
    fadeRef.current = Math.min(fadeRef.current + delta * 1.25, 1)
    timeRef.current += delta

    const fade = fadeRef.current

    // Inner glow: scale ~2x, opacity 0.4
    if (innerRef.current && innerMatRef.current) {
      let innerScale = 2.0
      let innerOpacity = 0.4 * intensity * fade

      if (effect === 'pulse') {
        innerScale = 2.0 + Math.sin(timeRef.current * 2) * 0.5
        innerOpacity = (0.35 + Math.sin(timeRef.current * 2) * 0.1) * intensity * fade
      } else if (effect === 'glow') {
        innerScale = 2.0 + Math.sin(timeRef.current * 1.2) * 0.3
        innerOpacity = (0.4 + Math.sin(timeRef.current * 1.2) * 0.08) * intensity * fade
      } else if (effect === 'enlarge') {
        innerScale = 2.0 + 0.3 * fade
      }

      innerRef.current.scale.setScalar(innerScale)
      innerMatRef.current.opacity = innerOpacity
    }

    // Outer glow: scale ~3.5x, opacity 0.15
    if (outerRef.current && outerMatRef.current) {
      let outerScale = 3.5
      let outerOpacity = 0.15 * intensity * fade

      if (effect === 'pulse') {
        outerScale = 3.5 + Math.sin(timeRef.current * 2) * 0.8
        outerOpacity = (0.12 + Math.sin(timeRef.current * 2) * 0.05) * intensity * fade
      } else if (effect === 'glow') {
        outerScale = 3.5 + Math.sin(timeRef.current * 1.2) * 0.4
      }

      outerRef.current.scale.setScalar(outerScale)
      outerMatRef.current.opacity = outerOpacity
    }
  })

  return (
    <group position={pos}>
      {/* Inner glow — bright, close to planet */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          ref={innerMatRef}
          color={baseColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* Outer glow — larger, softer halo */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial
          ref={outerMatRef}
          color={baseColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
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
