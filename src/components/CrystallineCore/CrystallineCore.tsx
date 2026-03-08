'use client'

import { useRef, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { useTapVsDrag } from '@/hooks/useTapVsDrag'

// ─── Element dominance ──────────────────────────────────────────────

type DominantElement = 'fire' | 'earth' | 'air' | 'water' | 'neutral'

const SIGN_TO_ELEMENT: Record<string, DominantElement> = {}
ZODIAC_SIGNS.forEach((s) => { SIGN_TO_ELEMENT[s.id] = s.element as DominantElement })

const LUMINARIES = new Set(['sun', 'moon'])

export function getDominantElement(planets: PlanetPosition[]): DominantElement {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 }
  for (const p of planets) {
    const el = SIGN_TO_ELEMENT[p.zodiacSign]
    if (el && el !== 'neutral') counts[el] += LUMINARIES.has(p.id) ? 2 : 1
  }
  const max = Math.max(counts.fire, counts.earth, counts.air, counts.water)
  const winners = (Object.entries(counts) as [keyof typeof counts, number][]).filter(([, v]) => v === max)
  return winners.length === 1 ? winners[0][0] : 'neutral'
}

const ELEMENT_COLOURS: Record<DominantElement, string> = {
  fire: '#FF6B4A',
  earth: '#4ADE80',
  air: '#60A5FA',
  water: '#A78BFA',
  neutral: '#C0C0D0',
}

// ─── Constants ──────────────────────────────────────────────────────

const CRYSTAL_Y = 1.6
const ROTATION_SPEED = 0.12 // rad/s

// ─── Component ──────────────────────────────────────────────────────

interface CrystallineCoreProps {
  planets: PlanetPosition[]
  viewMode: 'geocentric' | 'heliocentric'
  readingActive: boolean
  entranceComplete: boolean
  onCrystalTap: () => void
}

export default function CrystallineCore({
  planets,
  viewMode,
  readingActive,
  entranceComplete,
  onCrystalTap,
}: CrystallineCoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const rotateRef = useRef<THREE.Group>(null)
  const innerMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const shellMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const wireMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  // Entrance + visibility animation refs
  const entranceFadeRef = useRef(0) // 0→1 during entrance
  const helioFadeRef = useRef(viewMode === 'geocentric' ? 1 : 0)

  // Tap pulse state
  const pulseRef = useRef({ active: false, time: 0, emissivePeak: false })

  // Target colour
  const dominantElement = getDominantElement(planets)
  const targetColour = useMemo(() => new THREE.Color(ELEMENT_COLOURS[dominantElement]), [dominantElement])

  // Colour lerp ref (current colour state for smooth transitions)
  const currentColourRef = useRef(new THREE.Color(ELEMENT_COLOURS[dominantElement]))

  const isGeo = viewMode === 'geocentric'

  // Tap handler via useTapVsDrag
  const handleTap = useCallback(() => {
    pulseRef.current = { active: true, time: 0, emissivePeak: true }
    onCrystalTap()
  }, [onCrystalTap])

  const tapHandlers = useTapVsDrag({ onTap: handleTap })

  useFrame((_, delta) => {
    if (!groupRef.current || !rotateRef.current) return

    const time = (groupRef.current.userData.t ?? 0) + delta
    groupRef.current.userData.t = time

    // ── Entrance fade (scale 0.5→1 over 800ms) ──
    if (entranceComplete && entranceFadeRef.current < 1) {
      entranceFadeRef.current = Math.min(entranceFadeRef.current + delta / 0.8, 1)
    }
    const entranceT = entranceFadeRef.current

    // ── Helio fade ──
    const helioTarget = isGeo ? 1 : 0
    helioFadeRef.current += (helioTarget - helioFadeRef.current) * Math.min(delta * 4, 0.2)

    // ── Reading dimming (50% of normal opacity for all layers) ──
    const readingMul = readingActive ? 0.5 : 1

    // ── Combined visibility ──
    const vis = entranceT * helioFadeRef.current * readingMul
    groupRef.current.visible = vis > 0.01

    // ── Position: floating hover ──
    groupRef.current.position.y = CRYSTAL_Y + 0.025 * Math.sin(time * 0.6)

    // ── Rotation (Y-axis only) ──
    rotateRef.current.rotation.y += ROTATION_SPEED * delta

    // ── Scale: entrance + breathing + tap pulse ──
    const entranceScale = 0.5 + 0.5 * entranceT
    const breathe = 1.0 + 0.02 * Math.sin(time * 0.8)
    let tapScale = 1
    if (pulseRef.current.active) {
      pulseRef.current.time += delta
      const pt = pulseRef.current.time
      if (pt < 0.4) {
        tapScale = 1 + 0.12 * Math.sin((pt / 0.4) * Math.PI)
      } else {
        pulseRef.current.active = false
      }
    }
    const finalScale = entranceScale * breathe * tapScale
    groupRef.current.scale.setScalar(finalScale)

    // ── Colour lerp ──
    currentColourRef.current.lerp(targetColour, Math.min(delta / 1.5, 0.05))

    // ── Emissive intensity on shell: breathing + tap spike ──
    let emissiveI = 0.15 + 0.1 * Math.sin(time * 1.0)
    if (readingActive) emissiveI = 0.05
    if (pulseRef.current.emissivePeak) {
      const pt = pulseRef.current.time
      if (pt < 0.6) {
        emissiveI = 0.6 * (1 - pt / 0.6) + emissiveI * (pt / 0.6)
      } else {
        pulseRef.current.emissivePeak = false
      }
    }

    // ── Layer 1: Inner core — additive glow ──
    if (innerMatRef.current) {
      innerMatRef.current.color.copy(currentColourRef.current)
      const innerBase = 0.2 + 0.1 * Math.sin(time * 1.0)
      innerMatRef.current.opacity = innerBase * vis
    }

    // ── Layer 2: Glass shell — reflective facets ──
    if (shellMatRef.current) {
      shellMatRef.current.emissive.copy(currentColourRef.current)
      shellMatRef.current.emissiveIntensity = emissiveI
      shellMatRef.current.opacity = 0.12 * vis
    }

    // ── Layer 3: Wireframe edges ──
    if (wireMatRef.current) {
      wireMatRef.current.color.copy(currentColourRef.current)
      const wireBase = 0.15 + 0.08 * Math.sin(time * 1.2)
      wireMatRef.current.opacity = wireBase * vis
    }

    // ── Point light ──
    if (lightRef.current) {
      lightRef.current.color.copy(currentColourRef.current)
      lightRef.current.intensity = 0.15 * vis
    }
  })

  return (
    <group ref={groupRef} position={[0, CRYSTAL_Y, 0]} visible={false}>
      <group ref={rotateRef}>
        {/* Layer 1: Inner glow core */}
        <mesh>
          <icosahedronGeometry args={[0.12, 0]} />
          <meshBasicMaterial
            ref={innerMatRef}
            color={ELEMENT_COLOURS[dominantElement]}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Layer 2: Glass shell */}
        <mesh>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            ref={shellMatRef}
            color="#ffffff"
            transparent
            opacity={0}
            metalness={0.8}
            roughness={0.05}
            envMapIntensity={2.0}
            side={THREE.DoubleSide}
            emissive={ELEMENT_COLOURS[dominantElement]}
            emissiveIntensity={0.15}
            depthWrite={false}
          />
        </mesh>

        {/* Layer 3: Wireframe edge highlight */}
        <mesh>
          <icosahedronGeometry args={[0.181, 0]} />
          <meshBasicMaterial
            ref={wireMatRef}
            color={ELEMENT_COLOURS[dominantElement]}
            wireframe
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Tap target — larger invisible hitbox */}
      <mesh {...tapHandlers}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Subtle point light */}
      <pointLight
        ref={lightRef}
        intensity={0}
        distance={1.5}
        decay={2}
        color={ELEMENT_COLOURS[dominantElement]}
      />
    </group>
  )
}
