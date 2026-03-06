'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

function longitudeToPosition(longitude: number, radius: number): [number, number, number] {
  const rad = (longitude - 90) * (Math.PI / 180)
  return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
}

const R_PLANET = 1.5

interface PlanetGlowProps {
  highlights: Array<{ bodyId: string; color?: string; intensity: number }>
  planets: PlanetPosition[]
}

export default function PlanetGlow({ highlights, planets }: PlanetGlowProps) {
  return (
    <>
      {highlights.map(h => {
        const planet = planets.find(p => p.id === h.bodyId)
        if (!planet) return null
        return (
          <GlowOrb
            key={h.bodyId}
            longitude={planet.eclipticLongitude}
            color={h.color || planet.colour}
            intensity={h.intensity}
          />
        )
      })}
    </>
  )
}

function GlowOrb({ longitude, color, intensity }: { longitude: number; color: string; intensity: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (ref.current) {
      const s = 0.18 + Math.sin(elapsed.current * 1.5) * 0.03
      ref.current.scale.setScalar(s)
    }
  })

  const pos = longitudeToPosition(longitude, R_PLANET)

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.12 * intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
