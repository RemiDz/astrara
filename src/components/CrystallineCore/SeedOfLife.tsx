'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SPHERE_RADIUS = 0.15
const SPHERE_OFFSET = 0.15
const SPHERE_COUNT = 7
const INTERSECTION_COUNT = 12

export default function SeedOfLife({ opacity = 1 }: { opacity?: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRefs = useRef<THREE.Mesh[]>([])
  const glowRefs = useRef<THREE.Mesh[]>([])

  // Sphere positions: 1 centre + 6 surrounding
  const spherePositions = useMemo(() => {
    const positions: [number, number, number][] = [[0, 0, 0]]
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6
      positions.push([
        Math.cos(angle) * SPHERE_OFFSET,
        0,
        Math.sin(angle) * SPHERE_OFFSET,
      ])
    }
    return positions
  }, [])

  // Intersection glow positions — midpoints between adjacent sphere pairs
  const intersectionPositions = useMemo(() => {
    const points: [number, number, number][] = []
    // Between centre and each outer sphere (6 points)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6
      const x = (Math.cos(angle) * SPHERE_OFFSET) / 2
      const z = (Math.sin(angle) * SPHERE_OFFSET) / 2
      points.push([x, 0, z])
    }
    // Between adjacent outer spheres (6 points)
    for (let i = 0; i < 6; i++) {
      const a1 = (i * Math.PI * 2) / 6
      const a2 = (((i + 1) % 6) * Math.PI * 2) / 6
      const x = ((Math.cos(a1) + Math.cos(a2)) * SPHERE_OFFSET) / 2
      const z = ((Math.sin(a1) + Math.sin(a2)) * SPHERE_OFFSET) / 2
      points.push([x, 0, z])
    }
    return points
  }, [])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2
    }

    // Breathe each sphere
    sphereRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const scale = 1.0 + 0.05 * Math.sin(time * 1.8 + i * 0.9)
        mesh.scale.setScalar(scale)
        const mat = mesh.material as THREE.MeshBasicMaterial
        mat.opacity = 0.25 * opacity
      }
    })

    // Pulse intersection glows
    glowRefs.current.forEach((mesh, i) => {
      if (mesh) {
        const glowOpacity = (0.4 + 0.4 * Math.sin(time * 2.5 + i)) * opacity
        const mat = mesh.material as THREE.MeshBasicMaterial
        mat.opacity = glowOpacity
      }
    })
  })

  return (
    <group ref={groupRef}>
      {spherePositions.map((pos, i) => (
        <mesh
          key={`seed-sphere-${i}`}
          ref={(el) => { if (el) sphereRefs.current[i] = el }}
          position={pos}
        >
          <sphereGeometry args={[SPHERE_RADIUS, 24, 24]} />
          <meshBasicMaterial
            wireframe
            color="#4D8DE8"
            transparent
            opacity={0.25}
            depthWrite={false}
          />
        </mesh>
      ))}
      {intersectionPositions.map((pos, i) => (
        <mesh
          key={`seed-glow-${i}`}
          ref={(el) => { if (el) glowRefs.current[i] = el }}
          position={pos}
        >
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial
            color="#B0E0FF"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
