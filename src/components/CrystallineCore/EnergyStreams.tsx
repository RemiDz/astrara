'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'
import { PLANETS } from '@/lib/planets'

const R_PLANET = 1.5

function longitudeToPosition(longitude: number, radius: number): THREE.Vector3 {
  const rad = (longitude - 90) * (Math.PI / 180)
  return new THREE.Vector3(Math.cos(rad) * radius, 0, Math.sin(rad) * radius)
}

interface EnergyStreamsProps {
  planets: PlanetPosition[]
  crystalPosition: [number, number, number]
  opacity?: number
}

// Only render the 5 most prominent planet streams for performance
const STREAM_PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars']

function EnergyStream({ planet, crystalPos, index, opacity }: {
  planet: PlanetPosition
  crystalPos: THREE.Vector3
  index: number
  opacity: number
}) {
  const lineRef = useRef<THREE.Line>(null)
  const meta = PLANETS.find((m) => m.id === planet.id)
  const color = meta?.colour ?? '#ffffff'

  const { geometry, material } = useMemo(() => {
    const startPos = longitudeToPosition(planet.eclipticLongitude, R_PLANET)

    // Deterministic control point based on planet index
    const angleOffset = index * 0.7
    const midX = (startPos.x + crystalPos.x) / 2 + Math.sin(angleOffset) * 0.15
    const midY = (startPos.y + crystalPos.y) / 2 + 0.3
    const midZ = (startPos.z + crystalPos.z) / 2 + Math.cos(angleOffset) * 0.15
    const controlPoint = new THREE.Vector3(midX, midY, midZ)

    const curve = new THREE.QuadraticBezierCurve3(startPos, controlPoint, crystalPos)
    const points = curve.getPoints(20)
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    return { geometry: geo, material: mat }
  }, [planet.eclipticLongitude, crystalPos, color, index])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    const pulse = 0.1 + 0.08 * Math.sin(time * 1.5 + index * 0.7)
    material.opacity = pulse * opacity
  })

  // Clean up
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return <primitive ref={lineRef} object={new THREE.Line(geometry, material)} />
}

export default function EnergyStreams({ planets, crystalPosition, opacity = 1 }: EnergyStreamsProps) {
  const crystalPos = useMemo(() => new THREE.Vector3(...crystalPosition), [crystalPosition])

  const streamPlanets = useMemo(
    () => planets.filter((p) => STREAM_PLANETS.includes(p.id)),
    [planets]
  )

  return (
    <group>
      {streamPlanets.map((planet, i) => (
        <EnergyStream
          key={planet.id}
          planet={planet}
          crystalPos={crystalPos}
          index={i}
          opacity={opacity}
        />
      ))}
    </group>
  )
}
