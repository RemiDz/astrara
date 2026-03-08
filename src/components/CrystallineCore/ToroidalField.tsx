'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 50
const TORUS_RADIUS = 0.25
const TUBE_RADIUS = 0.1

export default function ToroidalField({ opacity = 1 }: { opacity?: number }) {
  const torusRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)

  // Particle state: each has a phase (0–1) along the toroidal flow path
  const particleState = useMemo(() => {
    const phases = new Float32Array(PARTICLE_COUNT)
    const speeds = new Float32Array(PARTICLE_COUNT)
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      phases[i] = Math.random()
      speeds[i] = 0.15 + Math.random() * 0.1
    }
    return { phases, speeds, positions }
  }, [])

  const colorBottom = useMemo(() => new THREE.Color('#FF6B35'), [])
  const colorTop = useMemo(() => new THREE.Color('#FFD700'), [])

  useFrame((_, delta) => {
    // Rotate torus
    if (torusRef.current) {
      torusRef.current.rotation.y += 0.3 * delta
      torusRef.current.rotation.x += 0.15 * delta
      const mat = torusRef.current.material as THREE.MeshPhysicalMaterial
      mat.opacity = opacity * 0.7
    }

    // Animate particles in toroidal flow
    if (pointsRef.current) {
      const { phases, speeds, positions } = particleState
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        phases[i] = (phases[i] + speeds[i] * delta) % 1

        // Toroidal flow: theta goes around the tube, phi goes around the torus
        const t = phases[i]
        const theta = t * Math.PI * 2
        const phi = t * Math.PI * 4 // Wraps around torus twice per tube circuit

        const x = (TORUS_RADIUS + TUBE_RADIUS * 1.5 * Math.cos(theta)) * Math.cos(phi)
        const y = TUBE_RADIUS * 1.5 * Math.sin(theta)
        const z = (TORUS_RADIUS + TUBE_RADIUS * 1.5 * Math.cos(theta)) * Math.sin(phi)

        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
      }
      const geo = pointsRef.current.geometry
      geo.attributes.position.needsUpdate = true
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = opacity * 0.6
    }
  })

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particleState.positions, 3))
    return geo
  }, [particleState])

  return (
    <group>
      <mesh ref={torusRef}>
        <torusGeometry args={[TORUS_RADIUS, TUBE_RADIUS, 32, 64]} />
        <meshPhysicalMaterial
          transmission={0.6}
          thickness={0.3}
          roughness={0.1}
          metalness={0.1}
          ior={1.5}
          color="#FF6B35"
          transparent
          opacity={0.7}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <points ref={pointsRef} geometry={particleGeo}>
        <pointsMaterial
          size={0.008}
          transparent
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          color="#FFB040"
          opacity={0.6}
          depthWrite={false}
        />
      </points>
    </group>
  )
}
