'use client'

import { useRef, useMemo, useCallback, useEffect } from 'react'
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
const Z_ROTATION_SPEED = 0.05 // rad/s — ~126s per revolution
const CIRCLE_RADIUS = 0.12
const CIRCLE_SEGMENTS = 64
const X_TILT = 0.15 // ~8.5° tilt for depth hint

// ─── Helpers ────────────────────────────────────────────────────────

function createCircleGeometry(radius: number, segments: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0))
  }
  return new THREE.BufferGeometry().setFromPoints(points)
}

function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.3)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(canvas)
}

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
  const zRotRef = useRef(0)

  // Entrance + visibility
  const entranceFadeRef = useRef(0)
  const helioFadeRef = useRef(viewMode === 'geocentric' ? 1 : 0)

  // Tap pulse
  const pulseRef = useRef({ active: false, time: 0 })

  // Element colour
  const dominantElement = getDominantElement(planets)
  const targetColour = useMemo(() => new THREE.Color(ELEMENT_COLOURS[dominantElement]), [dominantElement])
  const currentColourRef = useRef(new THREE.Color(ELEMENT_COLOURS[dominantElement]))

  const isGeo = viewMode === 'geocentric'

  // ── Geometries & materials (created once) ──

  const circleGeom = useMemo(() => createCircleGeometry(CIRCLE_RADIUS, CIRCLE_SEGMENTS), [])

  const lineMat = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(ELEMENT_COLOURS['neutral']),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    })
    mat.depthWrite = false
    return mat
  }, [])

  const glowTexture = useMemo(() => createGlowTexture(), [])

  const spriteMat = useMemo(() => {
    const mat = new THREE.SpriteMaterial({
      color: new THREE.Color(ELEMENT_COLOURS['neutral']),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      map: glowTexture,
    })
    mat.depthWrite = false
    return mat
  }, [glowTexture])

  // 7 circle positions (Seed of Life)
  const circlePositions = useMemo((): [number, number][] => {
    const positions: [number, number][] = [[0, 0]]
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      positions.push([Math.cos(a) * CIRCLE_RADIUS, Math.sin(a) * CIRCLE_RADIUS])
    }
    return positions
  }, [])

  // Create THREE.Line objects (share geometry + material)
  const lines = useMemo(() => {
    return circlePositions.map(([x, y]) => {
      const line = new THREE.Line(circleGeom, lineMat)
      line.position.set(x, y, 0)
      return line
    })
  }, [circleGeom, circlePositions, lineMat])

  // Cleanup
  useEffect(() => {
    return () => {
      circleGeom.dispose()
      lineMat.dispose()
      spriteMat.dispose()
      glowTexture.dispose()
    }
  }, [circleGeom, lineMat, spriteMat, glowTexture])

  // Tap handler
  const handleTap = useCallback(() => {
    pulseRef.current = { active: true, time: 0 }
    onCrystalTap()
  }, [onCrystalTap])

  const tapHandlers = useTapVsDrag({ onTap: handleTap })

  useFrame((_, delta) => {
    if (!groupRef.current) return

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

    // ── Reading dimming (40% of normal) ──
    const readingMul = readingActive ? 0.4 : 1

    // ── Combined visibility ──
    const vis = entranceT * helioFadeRef.current * readingMul
    groupRef.current.visible = vis > 0.01

    // ── Position: floating hover ──
    groupRef.current.position.y = CRYSTAL_Y + 0.02 * Math.sin(time * 0.5)

    // ── Rotation: fixed X tilt + accumulated Z spin ──
    zRotRef.current += Z_ROTATION_SPEED * delta
    groupRef.current.rotation.set(X_TILT, 0, zRotRef.current)

    // ── Scale: entrance + breathing ──
    const entranceScale = 0.5 + 0.5 * entranceT
    const breatheScale = 1.0 + 0.015 * Math.sin(time * 0.7)
    groupRef.current.scale.setScalar(entranceScale * breatheScale)

    // ── Colour lerp ──
    currentColourRef.current.lerp(targetColour, Math.min(delta / 1.5, 0.05))

    // ── Base opacities ──
    let lineOpacity = 0.2 + 0.08 * Math.sin(time * 0.8)
    let spriteOpacity = 0.4 + 0.15 * Math.sin(time * 1.0)

    // ── Tap pulse ──
    if (pulseRef.current.active) {
      pulseRef.current.time += delta
      const pt = pulseRef.current.time
      if (pt < 0.6) {
        const fade = 1 - pt / 0.6
        lineOpacity = lineOpacity + (0.6 - lineOpacity) * fade
        spriteOpacity = spriteOpacity + (0.9 - spriteOpacity) * fade
      } else {
        pulseRef.current.active = false
      }
    }

    // ── Apply to materials ──
    lineMat.color.copy(currentColourRef.current)
    lineMat.opacity = lineOpacity * vis

    spriteMat.color.copy(currentColourRef.current)
    spriteMat.opacity = spriteOpacity * vis
  })

  return (
    <group ref={groupRef} position={[0, CRYSTAL_Y, 0]} visible={false}>
      {/* 7 overlapping circles — Seed of Life / Flower of Life */}
      {lines.map((line, i) => <primitive key={i} object={line} />)}

      {/* Centre glow point */}
      <sprite material={spriteMat} scale={[0.08, 0.08, 0.08]} />

      {/* Invisible tap target */}
      <mesh {...tapHandlers}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  )
}
