'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const RADIUS = 0.22

export default function IcosahedronForm({ opacity = 1 }: { opacity?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  // Vertex morphing state
  const morphState = useRef({
    nextMorphTime: 8 + Math.random() * 2,
    morphing: false,
    morphProgress: 0,
    targetVertices: [] as number[],
    offsets: [] as number[],
    originalPositions: null as Float32Array | null,
  })

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime()

    // Rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.15
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial
      mat.opacity = opacity * 0.65
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = time * 0.15
      wireRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
      const mat = wireRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.4 * opacity
    }

    // Vertex morphing
    if (meshRef.current) {
      const geo = meshRef.current.geometry
      const posAttr = geo.attributes.position as THREE.BufferAttribute
      const state = morphState.current

      // Store original positions on first frame
      if (!state.originalPositions) {
        state.originalPositions = new Float32Array(posAttr.array)
      }

      // Start new morph
      if (!state.morphing && time > state.nextMorphTime) {
        state.morphing = true
        state.morphProgress = 0
        const vertexCount = posAttr.count
        const numToMorph = 3 + Math.floor(Math.random() * 2)
        state.targetVertices = []
        state.offsets = []
        for (let i = 0; i < numToMorph; i++) {
          const idx = Math.floor(Math.random() * vertexCount)
          state.targetVertices.push(idx)
          state.offsets.push(0.02 + Math.random() * 0.02)
        }
      }

      // Animate morph
      if (state.morphing) {
        state.morphProgress += delta / 2 // 2 second cycle
        const t = Math.min(state.morphProgress, 1)
        // Expand then contract
        const expansion = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7

        for (let i = 0; i < state.targetVertices.length; i++) {
          const vi = state.targetVertices[i]
          const ox = state.originalPositions[vi * 3]
          const oy = state.originalPositions[vi * 3 + 1]
          const oz = state.originalPositions[vi * 3 + 2]

          // Get direction from centre
          const len = Math.sqrt(ox * ox + oy * oy + oz * oz)
          if (len > 0) {
            const nx = ox / len
            const ny = oy / len
            const nz = oz / len
            const offset = state.offsets[i] * expansion

            posAttr.setXYZ(vi, ox + nx * offset, oy + ny * offset, oz + nz * offset)
          }
        }
        posAttr.needsUpdate = true

        if (t >= 1) {
          // Reset positions
          for (let i = 0; i < state.targetVertices.length; i++) {
            const vi = state.targetVertices[i]
            posAttr.setXYZ(
              vi,
              state.originalPositions[vi * 3],
              state.originalPositions[vi * 3 + 1],
              state.originalPositions[vi * 3 + 2]
            )
          }
          posAttr.needsUpdate = true
          state.morphing = false
          state.nextMorphTime = time + 8 + Math.random() * 2
        }
      }
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[RADIUS, 0]} />
        <meshPhysicalMaterial
          transmission={0.5}
          thickness={0.4}
          roughness={0.05}
          metalness={0.2}
          ior={1.8}
          color="#4DCCB0"
          transparent
          opacity={0.65}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.05}>
        <icosahedronGeometry args={[RADIUS, 0]} />
        <meshBasicMaterial
          wireframe
          color="#4DCCB0"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
