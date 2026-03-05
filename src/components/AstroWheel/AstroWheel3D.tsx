'use client'

import { useRef, useMemo, useState, useEffect, memo, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Line, Environment, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import { HELIO_RING_RADII, MOON_ORBIT_OFFSET, calculateAllHelioData, type HelioData } from '@/lib/heliocentric'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { useTranslation } from '@/i18n/useTranslation'

interface PhaseValues {
  zodiacOpacity: number
  smoothMoveT: number
  helioOpacity: number
  continuousPositions: Record<string, HelioData> | null
}

interface AstroWheel3DProps {
  planets: PlanetPosition[]
  aspects: AspectData[]
  onPlanetTap: (planet: PlanetPosition) => void
  onSignTap: (signId: string) => void
  onAspectTap: (aspect: AspectData) => void
  onEarthTap: () => void
  selectedPlanet: string | null
  planetScale?: number
  rotationSpeed?: number
  onRotationVelocity?: (velocity: number) => void
  kpIndex?: number | null
  solarFlareClass?: string | null
  solarFluxValue?: number | null
  viewMode?: 'geocentric' | 'heliocentric'
  isTransitioning?: boolean
  helioData?: Record<string, HelioData>
  onTransitionComplete?: () => void
  animationTimeRef?: React.MutableRefObject<number>
  animationSpeedRef?: React.MutableRefObject<number>
  showHelioLabels?: boolean
}

const HELIO_SCALE_MULTIPLIERS: Record<string, number> = {
  sun:     6.0,
  jupiter: 11.0,
  saturn:  10.0,
  uranus:  8.0,
  neptune: 7.6,
  earth:   6.0,
  venus:   5.6,
  mars:    5.0,
  mercury: 4.0,
  pluto:   3.6,
  moon:    3.6,
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

const ELEMENT_COLOURS: Record<string, string> = {
  fire: '#FF6B4A',
  earth: '#4ADE80',
  air: '#60A5FA',
  water: '#A78BFA',
}

const R_OUTER = 2.2
const R_OUTER_INNER = 2.05
const R_MID_OUTER = 1.95
const R_MID_INNER = 1.7
const R_TRACK = 1.6
const R_PLANET = 1.5

const PLANET_ORDER = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto']

function longitudeToPosition(longitude: number, radius: number): [number, number, number] {
  const rad = (longitude - 90) * (Math.PI / 180)
  return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
}

const PLANET_CONFIG: Record<string, { radius: number; pulseSpeed: number }> = {
  sun:     { radius: 0.28, pulseSpeed: 1.2 },
  moon:    { radius: 0.22, pulseSpeed: 0.6 },
  mercury: { radius: 0.14, pulseSpeed: 2.0 },
  venus:   { radius: 0.17, pulseSpeed: 0.5 },
  mars:    { radius: 0.17, pulseSpeed: 1.4 },
  jupiter: { radius: 0.20, pulseSpeed: 0.7 },
  saturn:  { radius: 0.19, pulseSpeed: 0.6 },
  uranus:  { radius: 0.15, pulseSpeed: 0.8 },
  neptune: { radius: 0.15, pulseSpeed: 0.4 },
  pluto:   { radius: 0.12, pulseSpeed: 0.3 },
}

// ─── Animated Scale Group (lerps scale from 0 to 1) ────────────────
function AnimatedScaleGroup({
  children,
  sceneReady,
  delay,
}: {
  children: React.ReactNode
  sceneReady: boolean
  delay: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const [visible, setVisible] = useState(false)
  const currentScale = useRef(0)

  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => setVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [sceneReady, delay])

  useFrame((_, delta) => {
    const target = visible ? 1 : 0
    currentScale.current += (target - currentScale.current) * Math.min(delta * 3, 0.15)
    if (ref.current) {
      ref.current.scale.setScalar(currentScale.current)
    }
  })

  return <group ref={ref} scale={0}>{children}</group>
}

// ─── Ring Edge ──────────────────────────────────────────────────────
const RingEdge = memo(function RingEdge({ radius, opacity = 0.35 }: { radius: number; opacity?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 8, 128]} />
      <meshPhysicalMaterial
        color="#c0c8e0"
        transparent
        opacity={opacity}
        roughness={0.05}
        metalness={0.6}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
})

// ─── Outer Zodiac Ring (Ring 1) ─────────────────────────────────────
function OuterZodiacRing({
  onSignTap,
  sceneReady,
  phaseValuesRef,
}: {
  onSignTap: (signId: string) => void
  sceneReady: boolean
  phaseValuesRef?: React.MutableRefObject<PhaseValues>
}) {
  // Direct DOM refs for per-frame opacity updates on zodiac glyph buttons
  const glyphRefs = useRef<(HTMLButtonElement | null)[]>([])

  useFrame(() => {
    if (!phaseValuesRef) return
    const zodiacOpacity = phaseValuesRef.current.zodiacOpacity
    for (const btn of glyphRefs.current) {
      if (btn) {
        btn.style.opacity = String(sceneReady ? 0.5 * zodiacOpacity : 0)
        btn.style.pointerEvents = zodiacOpacity > 0.1 ? 'auto' : 'none'
      }
    }
  })

  const segments = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => {
      const startAngle = (i * 30 - 90) * (Math.PI / 180)
      const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180)
      const shape = new THREE.Shape()
      const segs = 8
      for (let j = 0; j <= segs; j++) {
        const a = startAngle + (endAngle - startAngle) * (j / segs)
        const x = Math.cos(a) * R_OUTER
        const z = Math.sin(a) * R_OUTER
        if (j === 0) shape.moveTo(x, z)
        else shape.lineTo(x, z)
      }
      for (let j = segs; j >= 0; j--) {
        const a = startAngle + (endAngle - startAngle) * (j / segs)
        const x = Math.cos(a) * R_OUTER_INNER
        const z = Math.sin(a) * R_OUTER_INNER
        shape.lineTo(x, z)
      }
      shape.closePath()
      const midAngle = (startAngle + endAngle) / 2
      const glyphR = (R_OUTER + R_OUTER_INNER) / 2
      const gx = Math.cos(midAngle) * glyphR
      const gz = Math.sin(midAngle) * glyphR
      return { sign, shape, gx, gz, index: i }
    })
  }, [])

  return (
    <group>
      {segments.map(({ sign, shape, gx, gz, index }) => (
        <group key={sign.id}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <shapeGeometry args={[shape]} />
            <meshPhysicalMaterial
              color="#c0c8e0"
              transparent
              opacity={0.12}
              roughness={0.05}
              metalness={0.6}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              side={THREE.DoubleSide}
              emissive={new THREE.Color(ELEMENT_COLOURS[sign.element])}
              emissiveIntensity={0.08}
            />
          </mesh>
          <Html
            position={[gx, 0.06, gz]}
            center
            zIndexRange={[100, 0]}
            occlude={false}
            style={{ pointerEvents: 'auto', overflow: 'visible' }}
          >
            <button
              ref={(el) => { glyphRefs.current[index] = el }}
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onSignTap(sign.id) }}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center justify-center select-none cursor-pointer
                         w-11 h-11 rounded-full
                         active:scale-90 transition-transform duration-150"
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                color: ELEMENT_COLOURS[sign.element],
                opacity: sceneReady ? 0.5 : 0,
                textShadow: `0 0 10px ${ELEMENT_COLOURS[sign.element]}50, 0 0 20px ${ELEMENT_COLOURS[sign.element]}25, 0 0 40px ${ELEMENT_COLOURS[sign.element]}10`,
                fontFamily: 'serif',
                lineHeight: 1,
                transform: sceneReady ? 'scale(1)' : 'scale(0.5)',
                transition: `all 0.4s ease-out ${800 + index * 80}ms`,
                outline: 'none',
                padding: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
              aria-label={`View ${sign.name} details`}
            >
              {sign.glyph}
            </button>
          </Html>
        </group>
      ))}
      {ZODIAC_SIGNS.map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = Math.cos(angle) * R_OUTER_INNER
        const z1 = Math.sin(angle) * R_OUTER_INNER
        const x2 = Math.cos(angle) * R_OUTER
        const z2 = Math.sin(angle) * R_OUTER
        return (
          <Line key={`div1-${i}`} points={[[x1, 0, z1], [x2, 0, z2]]} color="#ffffff" lineWidth={0.5} transparent opacity={0.12} />
        )
      })}
      <RingEdge radius={R_OUTER} opacity={0.4} />
      <RingEdge radius={R_OUTER_INNER} opacity={0.25} />
    </group>
  )
}

// ─── Middle Degree Ring (Ring 2) ────────────────────────────────────
const MiddleRing = memo(function MiddleRing() {
  const segments = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => {
      const startAngle = (i * 30 - 90) * (Math.PI / 180)
      const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180)
      const shape = new THREE.Shape()
      const segs = 8
      for (let j = 0; j <= segs; j++) {
        const a = startAngle + (endAngle - startAngle) * (j / segs)
        const x = Math.cos(a) * R_MID_OUTER
        const z = Math.sin(a) * R_MID_OUTER
        if (j === 0) shape.moveTo(x, z)
        else shape.lineTo(x, z)
      }
      for (let j = segs; j >= 0; j--) {
        const a = startAngle + (endAngle - startAngle) * (j / segs)
        const x = Math.cos(a) * R_MID_INNER
        const z = Math.sin(a) * R_MID_INNER
        shape.lineTo(x, z)
      }
      shape.closePath()
      return { sign, shape }
    })
  }, [])

  return (
    <group>
      {segments.map(({ sign, shape }) => (
        <mesh key={sign.id} rotation={[-Math.PI / 2, 0, 0]}>
          <shapeGeometry args={[shape]} />
          <meshPhysicalMaterial
            color="#c0c8e0" transparent opacity={0.1} roughness={0.05} metalness={0.6}
            clearcoat={1.0} clearcoatRoughness={0.05} side={THREE.DoubleSide}
            emissive={new THREE.Color(ELEMENT_COLOURS[sign.element])} emissiveIntensity={0.05}
          />
        </mesh>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = Math.cos(angle) * R_MID_INNER
        const z1 = Math.sin(angle) * R_MID_INNER
        const x2 = Math.cos(angle) * R_MID_OUTER
        const z2 = Math.sin(angle) * R_MID_OUTER
        return <Line key={`tick-${i}`} points={[[x1, 0, z1], [x2, 0, z2]]} color="#ffffff" lineWidth={0.5} transparent opacity={0.12} />
      })}
      <RingEdge radius={R_MID_OUTER} opacity={0.25} />
      <RingEdge radius={R_MID_INNER} opacity={0.2} />
    </group>
  )
})

// ─── Inner Track Ring (Ring 3) ──────────────────────────────────────
const InnerTrackRing = memo(function InnerTrackRing() {
  return (
    <group>
      <RingEdge radius={R_TRACK} opacity={0.15} />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R_TRACK - 0.015, R_TRACK + 0.015, 128]} />
        <meshPhysicalMaterial
          color="#c0c8e0" transparent opacity={0.08} roughness={0.05} metalness={0.6}
          clearcoat={1.0} clearcoatRoughness={0.05} side={THREE.DoubleSide}
          emissive="#c0c8e0" emissiveIntensity={0.03}
        />
      </mesh>
    </group>
  )
})

// ─── Sacred Geometry ────────────────────────────────────────────────
// ─── Background Particles ───────────────────────────────────────────
const BackgroundParticles = memo(function BackgroundParticles() {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.5 + Math.random() * 2.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.015 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.12} sizeAttenuation />
    </points>
  )
})

// ─── Orbiting Light (glass ring shimmer) ────────────────────────────
function OrbitingLight() {
  const lightRef = useRef<THREE.PointLight>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.4
    const r = R_OUTER + 0.3
    if (lightRef.current) {
      lightRef.current.position.set(Math.cos(t) * r, 0.3, Math.sin(t) * r)
    }
  })
  return <pointLight ref={lightRef} color="#e0e8ff" intensity={0.4} distance={3} decay={2} />
}

// ─── Inner Dust ─────────────────────────────────────────────────────
const InnerDust = memo(function InnerDust() {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const pos = new Float32Array(80 * 3)
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 0.3 + Math.random() * 1.2
      pos[i * 3] = Math.cos(angle) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.15
      pos[i * 3 + 2] = Math.sin(angle) * r
    }
    return pos
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05 })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.15} sizeAttenuation />
    </points>
  )
})

// ─── Outer Halo ─────────────────────────────────────────────────────
const OuterHalo = memo(function OuterHalo() {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(200, 210, 230, 0.2)')
    gradient.addColorStop(0.4, 'rgba(200, 210, 230, 0.06)')
    gradient.addColorStop(1, 'rgba(200, 210, 230, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
  }, [])
  return (
    <sprite scale={[7, 7, 1]} position={[0, -0.1, -0.5]}>
      <spriteMaterial map={texture} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  )
})

// ─── Procedural Earth Texture ────────────────────────────────────────
function createEarthTexture(): THREE.CanvasTexture {
  const w = 512, h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!

  // Ocean gradient
  const bg = ctx.createLinearGradient(0, 0, 0, h)
  bg.addColorStop(0, '#0a2a5a')
  bg.addColorStop(0.3, '#0e3d7a')
  bg.addColorStop(0.5, '#1a5a9e')
  bg.addColorStop(0.7, '#0e3d7a')
  bg.addColorStop(1, '#0a2a5a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Polar ice
  ctx.fillStyle = 'rgba(200, 220, 240, 0.5)'
  ctx.fillRect(0, 0, w, 18)
  ctx.fillRect(0, h - 18, w, 18)

  // Draw simplified continent shapes (equirectangular projection)
  ctx.fillStyle = '#1a5c2a'
  ctx.strokeStyle = '#2a7a3a'
  ctx.lineWidth = 1

  // Africa
  ctx.beginPath()
  ctx.moveTo(260, 85); ctx.lineTo(275, 75); ctx.lineTo(290, 80); ctx.lineTo(295, 95)
  ctx.lineTo(290, 115); ctx.lineTo(285, 140); ctx.lineTo(278, 160); ctx.lineTo(270, 170)
  ctx.lineTo(262, 165); ctx.lineTo(255, 145); ctx.lineTo(248, 125); ctx.lineTo(250, 105)
  ctx.lineTo(255, 90); ctx.closePath(); ctx.fill(); ctx.stroke()

  // Europe
  ctx.beginPath()
  ctx.moveTo(250, 55); ctx.lineTo(260, 48); ctx.lineTo(275, 45); ctx.lineTo(285, 50)
  ctx.lineTo(290, 58); ctx.lineTo(285, 68); ctx.lineTo(275, 72); ctx.lineTo(265, 75)
  ctx.lineTo(255, 72); ctx.lineTo(248, 65); ctx.closePath(); ctx.fill(); ctx.stroke()

  // Asia
  ctx.beginPath()
  ctx.moveTo(290, 42); ctx.lineTo(320, 38); ctx.lineTo(350, 40); ctx.lineTo(380, 48)
  ctx.lineTo(400, 55); ctx.lineTo(410, 65); ctx.lineTo(400, 80); ctx.lineTo(385, 90)
  ctx.lineTo(370, 95); ctx.lineTo(350, 98); ctx.lineTo(335, 92); ctx.lineTo(320, 85)
  ctx.lineTo(305, 80); ctx.lineTo(295, 70); ctx.lineTo(290, 58); ctx.closePath(); ctx.fill(); ctx.stroke()

  // India
  ctx.beginPath()
  ctx.moveTo(340, 95); ctx.lineTo(350, 100); ctx.lineTo(348, 118); ctx.lineTo(340, 128)
  ctx.lineTo(332, 118); ctx.lineTo(334, 100); ctx.closePath(); ctx.fill(); ctx.stroke()

  // North America
  ctx.beginPath()
  ctx.moveTo(80, 35); ctx.lineTo(110, 30); ctx.lineTo(140, 38); ctx.lineTo(155, 50)
  ctx.lineTo(150, 65); ctx.lineTo(140, 80); ctx.lineTo(128, 90); ctx.lineTo(115, 95)
  ctx.lineTo(100, 88); ctx.lineTo(85, 78); ctx.lineTo(75, 65); ctx.lineTo(70, 50)
  ctx.closePath(); ctx.fill(); ctx.stroke()

  // Central America
  ctx.beginPath()
  ctx.moveTo(110, 95); ctx.lineTo(118, 100); ctx.lineTo(115, 112); ctx.lineTo(108, 118)
  ctx.lineTo(102, 112); ctx.closePath(); ctx.fill(); ctx.stroke()

  // South America
  ctx.beginPath()
  ctx.moveTo(145, 120); ctx.lineTo(160, 115); ctx.lineTo(170, 125); ctx.lineTo(172, 145)
  ctx.lineTo(168, 165); ctx.lineTo(160, 185); ctx.lineTo(148, 195); ctx.lineTo(140, 188)
  ctx.lineTo(135, 170); ctx.lineTo(132, 150); ctx.lineTo(135, 135); ctx.closePath()
  ctx.fill(); ctx.stroke()

  // Australia
  ctx.beginPath()
  ctx.moveTo(400, 155); ctx.lineTo(420, 148); ctx.lineTo(440, 152); ctx.lineTo(445, 165)
  ctx.lineTo(438, 178); ctx.lineTo(420, 182); ctx.lineTo(405, 175); ctx.lineTo(398, 165)
  ctx.closePath(); ctx.fill(); ctx.stroke()

  // Add subtle cloud wisps
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
  for (let i = 0; i < 12; i++) {
    const cx = (i * 43 + 20) % w
    const cy = 40 + Math.sin(i * 1.7) * 60
    ctx.beginPath()
    ctx.ellipse(cx, cy, 30 + Math.random() * 20, 6 + Math.random() * 4, Math.random() * 0.5, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

// ─── Earth Sphere (with real texture) ────────────────────────────────
function EarthSphereTextured() {
  const earthRef = useRef<THREE.Mesh>(null!)
  const texture = useTexture('/textures/earth.jpg')

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
  }, [texture])

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.08
  })

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[0.16, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        emissive="#0a1a3a"
        emissiveIntensity={0.4}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  )
}

function EarthSphereFallback() {
  const earthRef = useRef<THREE.Mesh>(null!)
  const fallbackTexture = useMemo(() => createEarthTexture(), [])

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.08
  })

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[0.16, 32, 32]} />
      <meshStandardMaterial
        map={fallbackTexture}
        emissive="#0a1a3a"
        emissiveIntensity={0.4}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  )
}

// ─── Kp Colour Scale ────────────────────────────────────────────────
function getKpColour(kp: number): { colour: string; glowIntensity: number; pulseSpeed: number } {
  if (kp <= 1) return { colour: '#22c55e', glowIntensity: 0.15, pulseSpeed: 0 }
  if (kp <= 2) return { colour: '#4ade80', glowIntensity: 0.2, pulseSpeed: 0 }
  if (kp <= 3) return { colour: '#a3e635', glowIntensity: 0.25, pulseSpeed: 0 }
  if (kp <= 4) return { colour: '#facc15', glowIntensity: 0.35, pulseSpeed: 4 }
  if (kp <= 5) return { colour: '#f59e0b', glowIntensity: 0.45, pulseSpeed: 3 }
  if (kp <= 6) return { colour: '#ef4444', glowIntensity: 0.55, pulseSpeed: 2.5 }
  if (kp <= 7) return { colour: '#dc2626', glowIntensity: 0.65, pulseSpeed: 2 }
  if (kp <= 8) return { colour: '#a855f7', glowIntensity: 0.75, pulseSpeed: 1.5 }
  return { colour: '#c026d3', glowIntensity: 0.85, pulseSpeed: 1 }
}

// ─── Earth Kp Aura ──────────────────────────────────────────────────
function EarthKpAura({ kpIndex }: { kpIndex: number | null }) {
  const innerRef = useRef<THREE.Mesh>(null!)
  const outerRef = useRef<THREE.Mesh>(null!)
  const targetColour = useRef(new THREE.Color('#93c5fd'))
  const currentColour = useRef(new THREE.Color('#93c5fd'))
  const targetIntensity = useRef(0.1)
  const currentIntensity = useRef(0.1)

  const kpData = kpIndex !== null ? getKpColour(kpIndex) : null

  useEffect(() => {
    if (kpData) {
      targetColour.current.set(kpData.colour)
      targetIntensity.current = kpData.glowIntensity
    } else {
      targetColour.current.set('#93c5fd')
      targetIntensity.current = 0.1
    }
  }, [kpData])

  useFrame(({ clock }, delta) => {
    if (!innerRef.current || !outerRef.current) return

    // Smooth colour lerp
    currentColour.current.lerp(targetColour.current, Math.min(delta * 2, 0.1))
    // Smooth intensity lerp
    currentIntensity.current += (targetIntensity.current - currentIntensity.current) * Math.min(delta * 2, 0.1)

    const innerMat = innerRef.current.material as THREE.MeshBasicMaterial
    const outerMat = outerRef.current.material as THREE.MeshBasicMaterial

    innerMat.color.copy(currentColour.current)
    outerMat.color.copy(currentColour.current)

    const pulseSpeed = kpData?.pulseSpeed ?? 0

    if (pulseSpeed > 0) {
      const pulse = Math.sin(clock.elapsedTime * (Math.PI * 2) / pulseSpeed) * 0.5 + 0.5
      innerMat.opacity = currentIntensity.current * 0.6 * (0.7 + pulse * 0.3)
      outerMat.opacity = currentIntensity.current * 0.3 * (0.6 + pulse * 0.4)
      const scaleBreath = 1.8 + pulse * 0.15
      outerRef.current.scale.setScalar(scaleBreath)
    } else {
      innerMat.opacity = currentIntensity.current * 0.6
      outerMat.opacity = currentIntensity.current * 0.3
      outerRef.current.scale.setScalar(1.8)
    }
  })

  return (
    <group>
      {/* Inner aura */}
      <mesh ref={innerRef} scale={1.3}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial
          color="#93c5fd"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Outer soft aura */}
      <mesh ref={outerRef} scale={1.8}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshBasicMaterial
          color="#93c5fd"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// ─── Earth Centre ───────────────────────────────────────────────────
function EarthCentre({ onEarthTap, kpIndex, labelOpacityRef, phaseValuesRef }: { onEarthTap: () => void; kpIndex: number | null; labelOpacityRef?: React.MutableRefObject<number>; phaseValuesRef?: React.MutableRefObject<PhaseValues> }) {
  const earthLabelRef = useRef<HTMLDivElement>(null)

  useFrame(() => {
    if (earthLabelRef.current && phaseValuesRef && labelOpacityRef) {
      const helioT = phaseValuesRef.current.helioOpacity
      // In helio mode, apply label visibility; in geo mode, always show
      const labelVis = helioT > 0.5 ? labelOpacityRef.current : 1
      earthLabelRef.current.style.opacity = String(0.3 * labelVis)
    }
  })

  return (
    <group>
      <Suspense fallback={<EarthSphereFallback />}>
        <EarthSphereTextured />
      </Suspense>

      {/* Kp Aura (replaces static atmosphere glow when data loads) */}
      <EarthKpAura kpIndex={kpIndex} />

      <pointLight color="#60a5fa" intensity={0.4} distance={1.5} decay={2} />

      <Html center position={[0, -0.25, 0]} zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: 'none', overflow: 'visible' }}>
        <div ref={earthLabelRef} className="text-center whitespace-nowrap select-none tracking-widest uppercase"
          style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.3)', textShadow: '0 0 8px rgba(255, 255, 255, 0.15)', fontFamily: 'var(--font-body), sans-serif' }}>
          home
        </div>
      </Html>

      {/* Earth tap target */}
      <Html center zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: 'auto', overflow: 'visible' }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEarthTap() }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-14 h-14 rounded-full cursor-pointer select-none active:scale-90 transition-transform duration-150"
          style={{ background: 'transparent', border: 'none', outline: 'none', padding: 0, WebkitTapHighlightColor: 'transparent' }}
          aria-label="View Earth intelligence"
        />
      </Html>
    </group>
  )
}

// ─── Solar Activity Parsing ──────────────────────────────────────────
interface SolarActivity {
  flareClass: string
  fluxValue: number
  level: 'quiet' | 'low' | 'moderate' | 'strong' | 'extreme'
  glowMultiplier: number
  brightnessBoost: number
  pulseSpeed: number
  coronaColour: string
}

function parseSolarActivity(fluxValue: number, flareClass: string): SolarActivity {
  if (fluxValue < 1e-7) {
    return { flareClass, fluxValue, level: 'quiet', glowMultiplier: 1.0, brightnessBoost: 0, pulseSpeed: 0, coronaColour: '#FDB813' }
  }
  if (fluxValue < 1e-6) {
    return { flareClass, fluxValue, level: 'low', glowMultiplier: 1.1, brightnessBoost: 0.05, pulseSpeed: 0, coronaColour: '#FDB813' }
  }
  if (fluxValue < 1e-5) {
    return { flareClass, fluxValue, level: 'moderate', glowMultiplier: 1.25, brightnessBoost: 0.15, pulseSpeed: 5, coronaColour: '#FDCE13' }
  }
  if (fluxValue < 1e-4) {
    return { flareClass, fluxValue, level: 'strong', glowMultiplier: 1.5, brightnessBoost: 0.3, pulseSpeed: 3, coronaColour: '#FFE066' }
  }
  return { flareClass, fluxValue, level: 'extreme', glowMultiplier: 1.8, brightnessBoost: 0.5, pulseSpeed: 1.5, coronaColour: '#FFEEAA' }
}

// ─── Sun Corona ─────────────────────────────────────────────────────
function SunCorona({ solarActivity, sceneReady }: { solarActivity: SolarActivity; sceneReady: boolean }) {
  const innerRef = useRef<THREE.Mesh>(null!)
  const outerRef = useRef<THREE.Mesh>(null!)
  const targetColour = useRef(new THREE.Color(solarActivity.coronaColour))
  const currentColour = useRef(new THREE.Color(solarActivity.coronaColour))
  const targetScale = useRef(solarActivity.glowMultiplier)
  const currentScale = useRef(solarActivity.glowMultiplier)
  const targetOpacity = useRef(0.3 + solarActivity.brightnessBoost)
  const currentOpacity = useRef(0.3 + solarActivity.brightnessBoost)

  // Entrance fade: wait 3000ms after sceneReady, then fade in over ~800ms
  const [entranceActive, setEntranceActive] = useState(false)
  const entranceFade = useRef(0)

  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => setEntranceActive(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [sceneReady])

  useEffect(() => {
    targetColour.current.set(solarActivity.coronaColour)
    targetScale.current = solarActivity.glowMultiplier
    targetOpacity.current = 0.3 + solarActivity.brightnessBoost
  }, [solarActivity.coronaColour, solarActivity.glowMultiplier, solarActivity.brightnessBoost])

  useFrame(({ clock }, delta) => {
    if (!innerRef.current || !outerRef.current) return

    // Smooth entrance fade (0 → 1 over ~800ms)
    const fadeTarget = entranceActive ? 1 : 0
    entranceFade.current += (fadeTarget - entranceFade.current) * Math.min(delta * 2.5, 0.12)
    const fade = entranceFade.current

    currentColour.current.lerp(targetColour.current, Math.min(delta * 1.5, 0.1))
    currentScale.current += (targetScale.current - currentScale.current) * Math.min(delta * 2, 0.1)
    currentOpacity.current += (targetOpacity.current - currentOpacity.current) * Math.min(delta * 2, 0.1)

    const innerMat = innerRef.current.material as THREE.MeshBasicMaterial
    const outerMat = outerRef.current.material as THREE.MeshBasicMaterial
    innerMat.color.copy(currentColour.current)
    outerMat.color.copy(currentColour.current)

    let pulseMultiplier = 1
    if (solarActivity.pulseSpeed > 0) {
      const pulse = Math.sin(clock.elapsedTime * (Math.PI * 2) / solarActivity.pulseSpeed) * 0.5 + 0.5
      pulseMultiplier = 0.8 + pulse * 0.2
      outerRef.current.scale.setScalar(currentScale.current * 1.6 + pulse * 0.2)
    } else {
      outerRef.current.scale.setScalar(currentScale.current * 1.6)
    }

    innerMat.opacity = currentOpacity.current * pulseMultiplier * fade
    outerMat.opacity = (currentOpacity.current * 0.5) * pulseMultiplier * fade
    innerRef.current.scale.setScalar(currentScale.current)
  })

  // Sun radius is 0.28
  return (
    <group>
      <mesh ref={innerRef} scale={solarActivity.glowMultiplier}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial color={solarActivity.coronaColour} transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh ref={outerRef} scale={solarActivity.glowMultiplier * 1.6}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshBasicMaterial color={solarActivity.coronaColour} transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── Planet Orb (with entrance animation) ───────────────────────────
function PlanetOrb({
  planet, index, isSelected, onTap, planets, sceneReady, entranceDelay, planetScale = 1,
  phaseValuesRef, helioData, isTransitioning: isTransitioningProp, labelOpacityRef,
}: {
  planet: PlanetPosition; index: number; isSelected: boolean; onTap: () => void
  planets: PlanetPosition[]; sceneReady: boolean; entranceDelay: number; planetScale?: number
  phaseValuesRef?: React.MutableRefObject<PhaseValues>
  helioData?: Record<string, HelioData>
  isTransitioning?: boolean
  labelOpacityRef?: React.MutableRefObject<number>
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const [isFlashing, setIsFlashing] = useState(false)
  const [visible, setVisible] = useState(false)
  const currentScale = useRef(0)
  const colour = useMemo(() => new THREE.Color(planet.colour), [planet.colour])
  const config = PLANET_CONFIG[planet.id] ?? { radius: 0.12, pulseSpeed: 0.6 }

  // Overlap prevention: offset Y and radius when planets are within 8° of each other
  const { yOffset, radiusOffset } = useMemo(() => {
    let yOff = 0
    let rOff = 0
    for (const other of planets) {
      if (other.id === planet.id) continue
      let diff = Math.abs(planet.eclipticLongitude - other.eclipticLongitude)
      if (diff > 180) diff = 360 - diff
      if (diff < 8) {
        const myIdx = planets.indexOf(planet)
        const otherIdx = planets.indexOf(other)
        if (otherIdx < myIdx) {
          yOff = 0.15
          rOff = 0.12
        }
      }
    }
    return { yOffset: yOff, radiusOffset: rOff }
  }, [planet, planets])

  const pos = useMemo(() => {
    const [x, y, z] = longitudeToPosition(planet.eclipticLongitude, R_PLANET + radiusOffset)
    return [x, y + yOffset, z] as [number, number, number]
  }, [planet.eclipticLongitude, yOffset, radiusOffset])

  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => setVisible(true), entranceDelay)
      return () => clearTimeout(timer)
    }
  }, [sceneReady, entranceDelay])

  const labelYOffset = useMemo(() => {
    // Position label below orb, scaled to planet size
    const base = -(config.radius + 0.16)
    for (const other of planets) {
      if (other.id === planet.id) continue
      let diff = Math.abs(planet.eclipticLongitude - other.eclipticLongitude)
      if (diff > 180) diff = 360 - diff
      if (diff < 8 && planets.indexOf(other) < planets.indexOf(planet)) return config.radius + 0.16
    }
    return base
  }, [planet, planets, config.radius])

  const handleTap = useCallback(() => {
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 300)
    onTap()
  }, [onTap])

  // Helio position for this planet
  const helioKey = planet.id.charAt(0).toUpperCase() + planet.id.slice(1)
  const helioPos = helioData?.[helioKey]

  useFrame(({ clock }, delta) => {
    // Scale animation
    const targetScale = visible ? 1 : 0
    currentScale.current += (targetScale - currentScale.current) * Math.min(delta * 3, 0.15)

    // Per-planet helio scale for realistic proportions
    const moveT = phaseValuesRef?.current.smoothMoveT ?? 0
    const helioScaleFactor = HELIO_SCALE_MULTIPLIERS[planet.id] ?? 3.0
    const viewScale = 1.0 + (helioScaleFactor - 1.0) * moveT
    if (groupRef.current) groupRef.current.scale.setScalar(currentScale.current * viewScale)

    // Set position in useFrame (avoids reconciler flash on date change)
    if (groupRef.current) {
      const t = phaseValuesRef?.current.smoothMoveT ?? 0
      const contPos = phaseValuesRef?.current.continuousPositions
      if (t > 0.001 && helioPos) {
        // During continuous animation, use per-frame positions directly
        const activeHelio = (t > 0.99 && contPos?.[helioKey]) ? contPos[helioKey] : helioPos
        const geoX = pos[0], geoY = pos[1], geoZ = pos[2]
        const hX = activeHelio.sceneX
        const hZ = activeHelio.sceneY
        const targetX = geoX + (hX - geoX) * t
        const targetY = geoY + (0 - geoY) * t
        const targetZ = geoZ + (hZ - geoZ) * t
        if (t > 0.99 && contPos) {
          // Continuous animation — set position directly, no lerp needed
          groupRef.current.position.set(targetX, targetY, targetZ)
        } else if (t > 0.99) {
          // Static helio (no autoplay) — smooth glide for date changes
          const lr = Math.min(delta * 8, 0.3)
          groupRef.current.position.x += (targetX - groupRef.current.position.x) * lr
          groupRef.current.position.y += (targetY - groupRef.current.position.y) * lr
          groupRef.current.position.z += (targetZ - groupRef.current.position.z) * lr
        } else {
          groupRef.current.position.set(targetX, targetY, targetZ)
        }
      } else {
        groupRef.current.position.set(pos[0], pos[1], pos[2])
      }
    }

    // Breathing glow
    if (meshRef.current && visible) {
      const t = clock.getElapsedTime()
      let breath = 0.4 + Math.sin(t * config.pulseSpeed + index * 1.2) * 0.2
      if (isFlashing) breath = 3.0
      else if (isSelected) breath *= 2.5
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = breath
    }
  })

  // Track helio opacity for label text swap (coarse updates to avoid excessive re-renders)
  const [showHelioLabel, setShowHelioLabel] = useState(false)
  const labelDivRef = useRef<HTMLDivElement>(null)
  useFrame(() => {
    if (!phaseValuesRef) return
    const h = phaseValuesRef.current.helioOpacity
    if (h > 0.5 && !showHelioLabel) setShowHelioLabel(true)
    else if (h <= 0.5 && showHelioLabel) setShowHelioLabel(false)
    // Imperatively update label opacity for helio label toggle
    if (labelDivRef.current) {
      const labelVis = labelOpacityRef?.current ?? 1
      const isHiddenSunInHelio = showHelioLabel && planet.id === 'sun'
      const baseOpacity = (visible && !isHiddenSunInHelio) ? 0.85 : 0
      // In helio mode, multiply by label visibility; in geo mode, always show
      const finalOpacity = showHelioLabel ? baseOpacity * labelVis : baseOpacity
      labelDivRef.current.style.opacity = String(finalOpacity)
      labelDivRef.current.style.pointerEvents = finalOpacity < 0.1 ? 'none' : 'auto'
    }
  })

  return (
    <group ref={groupRef} scale={0}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.radius * planetScale, 20, 20]} />
        <meshStandardMaterial color={colour} emissive={colour} emissiveIntensity={0.4} transparent opacity={0.9} roughness={0.3} metalness={0.2} />
      </mesh>
      {planet.id === 'saturn' && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[config.radius * planetScale * 1.6, 0.008, 4, 32]} />
          <meshBasicMaterial color={planet.colour} transparent opacity={0.5} />
        </mesh>
      )}
      <pointLight color={planet.colour} intensity={isSelected || isFlashing ? 0.7 : 0.3} distance={1.5} decay={2} />
      <Html position={[0, labelYOffset, 0]} center zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: 'none', userSelect: 'none', overflow: 'visible' }}>
        <div ref={labelDivRef} className="whitespace-nowrap select-none pointer-events-none"
          style={{
            fontSize: '12px', color: 'white', opacity: (visible && !(showHelioLabel && planet.id === 'sun')) ? 0.85 : 0,
            textShadow: `0 0 8px ${planet.colour}80, 0 1px 3px rgba(0,0,0,0.8)`,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            padding: '2px 6px', borderRadius: '6px',
            fontFamily: "'DM Sans', sans-serif",
          }}>
          {showHelioLabel
            ? (planet.id === 'moon' ? planet.glyph : `${planet.glyph} ${planet.name}`)
            : `${planet.glyph} ${planet.degreeInSign}°`}
        </div>
      </Html>
      <Html center zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: isTransitioningProp ? 'none' : 'auto', overflow: 'visible' }}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleTap() }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center justify-center select-none cursor-pointer active:scale-90 transition-transform duration-150"
          style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: 'none', padding: 0, outline: 'none', WebkitTapHighlightColor: 'transparent' }}
          aria-label={`View ${planet.name} details`}
        />
      </Html>
    </group>
  )
}

// ─── Counter-rotating wrapper ───────────────────────────────────────
function CounterRotatingRing({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = -clock.getElapsedTime() * 0.01 })
  return <group ref={ref}>{children}</group>
}

// ─── Mobile bloom detector ──────────────────────────────────────────
function ConditionalBloom() {
  const { size } = useThree()
  if (size.width < 768) return null
  return <EffectComposer><Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.3} /></EffectComposer>
}

// ─── Rotation Velocity Tracker ──────────────────────────────────────
function RotationVelocityTracker({
  prevAzimuth,
  onRotationVelocity,
}: {
  prevAzimuth: React.MutableRefObject<number>
  onRotationVelocity?: (velocity: number) => void
}) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    if (!onRotationVelocity) return
    const azimuth = Math.atan2(camera.position.x, camera.position.z)
    const velocity = (azimuth - prevAzimuth.current) / Math.max(delta, 0.001)
    prevAzimuth.current = azimuth
    onRotationVelocity(velocity)
  })
  return null
}

// ─── Camera Tilt Animator ────────────────────────────────────────────
function TiltAnimator({
  controlsRef,
  tiltStarted,
  onTiltDone,
}: {
  controlsRef: React.MutableRefObject<any>
  tiltStarted: boolean
  onTiltDone: () => void
}) {
  const isDone = useRef(false)
  const TARGET_POLAR = Math.PI / 3 // ~60° from top — dramatic 3D view

  useFrame(() => {
    if (!tiltStarted || isDone.current || !controlsRef.current) return

    const controls = controlsRef.current
    const currentPolar = controls.getPolarAngle()
    const diff = TARGET_POLAR - currentPolar

    if (Math.abs(diff) > 0.001) {
      const newPolar = currentPolar + diff * 0.03
      controls.minPolarAngle = newPolar
      controls.maxPolarAngle = newPolar
    } else {
      // Tilt complete — restore free rotation range
      controls.minPolarAngle = 0.3
      controls.maxPolarAngle = 2.8
      isDone.current = true
      onTiltDone()
    }
    controls.update()
  })

  return null
}

// ─── Geo Fade Group (fades all descendant mesh materials) ───────────
function GeoFadeGroup({
  children,
  phaseValuesRef,
}: {
  children: React.ReactNode
  phaseValuesRef: React.MutableRefObject<PhaseValues>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const originalOpacities = useRef<Map<THREE.Material, number>>(new Map())
  const captured = useRef(false)

  useFrame(() => {
    if (!groupRef.current) return
    const zodiacOpacity = phaseValuesRef.current.zodiacOpacity

    groupRef.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh || (obj as THREE.Line).isLine || (obj as THREE.Points).isPoints) {
        const mat = (obj as THREE.Mesh).material as THREE.Material & { opacity: number }
        if (!mat || !('opacity' in mat)) return

        // Capture original opacity on first meaningful frame
        if (!captured.current && zodiacOpacity > 0.99) {
          if (!originalOpacities.current.has(mat)) {
            originalOpacities.current.set(mat, mat.opacity)
          }
        }

        const orig = originalOpacities.current.get(mat) ?? mat.opacity
        if (!originalOpacities.current.has(mat)) {
          originalOpacities.current.set(mat, orig)
        }
        mat.opacity = orig * zodiacOpacity
      }
    })

    if (!captured.current && zodiacOpacity > 0.99) {
      captured.current = true
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// ─── Continuous Time Animator (per-frame helio position updates) ─────
function ContinuousTimeAnimator({
  animationTimeRef,
  animationSpeedRef,
  phaseValuesRef,
}: {
  animationTimeRef: React.MutableRefObject<number>
  animationSpeedRef: React.MutableRefObject<number>
  phaseValuesRef: React.MutableRefObject<PhaseValues>
}) {
  useFrame((_, delta) => {
    if (animationSpeedRef.current === 0) {
      // Not animating — clear continuous positions
      if (phaseValuesRef.current.continuousPositions !== null) {
        phaseValuesRef.current.continuousPositions = null
      }
      return
    }

    // Advance animation time
    const msAdvance = animationSpeedRef.current * delta * 1000
    animationTimeRef.current += msAdvance

    // Calculate all positions for the current fractional time
    const currentDate = new Date(animationTimeRef.current)
    phaseValuesRef.current.continuousPositions = calculateAllHelioData(currentDate)
  })

  return null
}

// ─── Transition Controller ──────────────────────────────────────────
function TransitionController({
  viewMode,
  isTransitioning,
  onTransitionComplete,
  phaseValuesRef,
  transitionProgress,
}: {
  viewMode: 'geocentric' | 'heliocentric'
  isTransitioning: boolean
  onTransitionComplete?: () => void
  phaseValuesRef: React.MutableRefObject<PhaseValues>
  transitionProgress: React.MutableRefObject<number>
}) {
  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false
  }, [viewMode])

  useFrame((_, delta) => {
    const target = viewMode === 'heliocentric' ? 1 : 0
    const diff = target - transitionProgress.current

    if (Math.abs(diff) > 0.003) {
      transitionProgress.current += diff * delta * 1.5
      transitionProgress.current = Math.max(0, Math.min(1, transitionProgress.current))
    } else if (isTransitioning && !completedRef.current) {
      transitionProgress.current = target
      completedRef.current = true
      onTransitionComplete?.()
    }

    const p = transitionProgress.current
    phaseValuesRef.current = {
      zodiacOpacity: 1 - clamp01(p / 0.25),
      smoothMoveT: smoothstep(clamp01((p - 0.25) / 0.6)),
      helioOpacity: clamp01((p - 0.7) / 0.3),
      continuousPositions: phaseValuesRef.current.continuousPositions,
    }
  })

  return null
}

// ─── Camera Distance Animator ───────────────────────────────────────
function CameraDistanceAnimator({
  transitionProgress,
}: {
  transitionProgress: React.MutableRefObject<number>
}) {
  const { camera } = useThree()
  const initialDistance = useRef<number | null>(null)

  useFrame(() => {
    if (initialDistance.current === null) {
      initialDistance.current = camera.position.length()
    }

    const p = transitionProgress.current
    const geoDistance = initialDistance.current
    const helioDistance = geoDistance * 8.0 // pull back enough for Pluto at r=17 with larger planets + padding
    const targetDistance = geoDistance + (helioDistance - geoDistance) * p

    const currentDistance = camera.position.length()
    if (currentDistance > 0.01) {
      const newDistance = currentDistance + (targetDistance - currentDistance) * 0.05
      camera.position.normalize().multiplyScalar(newDistance)
    }
  })

  return null
}

// ─── Helio Tilt Animator (flat top-down in helio, 3D tilt in geo) ─────
function HelioTiltAnimator({
  controlsRef,
  transitionProgress,
}: {
  controlsRef: React.MutableRefObject<any>
  transitionProgress: React.MutableRefObject<number>
}) {
  const GEO_POLAR = Math.PI / 3   // entrance tilt target — 3D perspective
  const HELIO_POLAR = 0.01        // near top-down (avoid gimbal lock at 0)

  useFrame(() => {
    if (!controlsRef.current) return
    const controls = controlsRef.current
    const p = transitionProgress.current
    const tiltT = clamp01((p - 0.85) / 0.15)
    const smoothT = smoothstep(tiltT)

    if (tiltT > 0.001 && tiltT < 0.999) {
      // Mid-tilt animation: lock polar angle
      const targetPolar = GEO_POLAR + (HELIO_POLAR - GEO_POLAR) * smoothT
      controls.minPolarAngle = targetPolar
      controls.maxPolarAngle = targetPolar
      controls.update()
    } else if (tiltT >= 0.999) {
      // Fully helio: allow free rotation including top-down
      controls.minPolarAngle = HELIO_POLAR
      controls.maxPolarAngle = 2.8
    } else {
      // Geo or early transition: normal rotation range
      controls.minPolarAngle = 0.3
      controls.maxPolarAngle = 2.8
    }
  })

  return null
}

// ─── Earth Position Animator (moves Earth from centre to helio orbit) ─
function EarthPositionAnimator({
  phaseValuesRef,
  helioData,
  children,
}: {
  phaseValuesRef: React.MutableRefObject<PhaseValues>
  helioData?: Record<string, HelioData>
  children: React.ReactNode
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    if (!groupRef.current || !helioData?.Earth) return
    const t = phaseValuesRef.current.smoothMoveT
    const contPos = phaseValuesRef.current.continuousPositions
    if (t > 0.001) {
      const activeEarth = (t > 0.99 && contPos?.Earth) ? contPos.Earth : helioData.Earth
      const targetX = activeEarth.sceneX * t
      const targetZ = activeEarth.sceneY * t
      if (t > 0.99 && contPos) {
        // Continuous animation — set directly
        groupRef.current.position.set(targetX, 0, targetZ)
      } else if (t > 0.99) {
        const lr = Math.min(delta * 8, 0.3)
        groupRef.current.position.x += (targetX - groupRef.current.position.x) * lr
        groupRef.current.position.y += (0 - groupRef.current.position.y) * lr
        groupRef.current.position.z += (targetZ - groupRef.current.position.z) * lr
      } else {
        groupRef.current.position.set(targetX, 0, targetZ)
      }
    } else {
      groupRef.current.position.set(0, 0, 0)
    }
    // Scale Earth per HELIO_SCALE_MULTIPLIERS
    const earthScale = 1.0 + (HELIO_SCALE_MULTIPLIERS.earth - 1.0) * t
    groupRef.current.scale.setScalar(earthScale)
  })

  return <group ref={groupRef}>{children}</group>
}

// ─── Sun Corona Animated (lerps between geo and helio position) ─────
function SunCoronaAnimated({
  planet,
  solarActivity,
  sceneReady,
  phaseValuesRef,
  helioData,
}: {
  planet: PlanetPosition
  solarActivity: SolarActivity
  sceneReady: boolean
  phaseValuesRef: React.MutableRefObject<PhaseValues>
  helioData?: Record<string, HelioData>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const geoPos = useMemo(() => longitudeToPosition(planet.eclipticLongitude, R_PLANET), [planet.eclipticLongitude])

  useFrame(() => {
    if (!groupRef.current) return
    const t = phaseValuesRef.current.smoothMoveT
    // Sun helio position is (0, 0, 0)
    groupRef.current.position.set(
      geoPos[0] + (0 - geoPos[0]) * t,
      geoPos[1] + (0 - geoPos[1]) * t,
      geoPos[2] + (0 - geoPos[2]) * t,
    )
  })

  return (
    <group ref={groupRef} position={geoPos}>
      <SunCorona solarActivity={solarActivity} sceneReady={sceneReady} />
    </group>
  )
}

// ─── Orbital Path Rings (helio view only) ───────────────────────────
function getOrbitalRingOpacity(planetName: string): number {
  switch (planetName) {
    case 'Mercury': return 0.16
    case 'Venus':   return 0.16
    case 'Earth':   return 0.20
    case 'Mars':    return 0.16
    case 'Jupiter': return 0.12
    case 'Saturn':  return 0.12
    case 'Uranus':  return 0.10
    case 'Neptune': return 0.10
    case 'Pluto':   return 0.08
    default:        return 0.10
  }
}

function OrbitalRings({ phaseValuesRef }: { phaseValuesRef: React.MutableRefObject<PhaseValues> }) {
  const groupRef = useRef<THREE.Group>(null!)
  const rings = useMemo(() =>
    Object.entries(HELIO_RING_RADII).filter(([name]) => name !== 'Sun'),
  [])

  useFrame(() => {
    if (!groupRef.current) return
    const helioOpacity = phaseValuesRef.current.helioOpacity
    groupRef.current.visible = helioOpacity > 0.01
    groupRef.current.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial
        const name = obj.userData.planetName as string
        if (name) mat.opacity = getOrbitalRingOpacity(name) * helioOpacity
      }
    })
  })

  return (
    <group ref={groupRef} visible={false}>
      {rings.map(([name, radius]) => (
        <mesh key={name} rotation={[-Math.PI / 2, 0, 0]} userData={{ planetName: name }}>
          <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Moon Orbit Ring (helio view only, around Earth) ────────────────
function MoonOrbitRing({
  phaseValuesRef,
  helioData,
}: {
  phaseValuesRef: React.MutableRefObject<PhaseValues>
  helioData?: Record<string, HelioData>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const matRef = useRef<THREE.MeshBasicMaterial>(null!)

  useFrame((_, delta) => {
    if (!groupRef.current || !helioData?.Earth) return
    const t = phaseValuesRef.current.smoothMoveT
    const helioOpacity = phaseValuesRef.current.helioOpacity
    const contPos = phaseValuesRef.current.continuousPositions

    // Follow Earth's interpolated position
    const activeEarth = (t > 0.99 && contPos?.Earth) ? contPos.Earth : helioData.Earth
    const targetX = activeEarth.sceneX * t
    const targetZ = activeEarth.sceneY * t
    if (t > 0.99 && contPos) {
      groupRef.current.position.set(targetX, 0, targetZ)
    } else if (t > 0.99) {
      const lr = Math.min(delta * 8, 0.3)
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * lr
      groupRef.current.position.y += (0 - groupRef.current.position.y) * lr
      groupRef.current.position.z += (targetZ - groupRef.current.position.z) * lr
    } else {
      groupRef.current.position.set(targetX, 0, targetZ)
    }
    groupRef.current.visible = helioOpacity > 0.01
    if (matRef.current) matRef.current.opacity = 0.24 * helioOpacity
  })

  return (
    <group ref={groupRef} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[MOON_ORBIT_OFFSET - 0.015, MOON_ORBIT_OFFSET + 0.015, 64]} />
        <meshBasicMaterial
          ref={matRef}
          color="#C8C4DC"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

// ─── Sun Centre Label (visible in helio view) ───────────────────────
function SunCentreLabel({ phaseValuesRef, label, labelOpacityRef }: { phaseValuesRef: React.MutableRefObject<PhaseValues>; label?: string; labelOpacityRef?: React.MutableRefObject<number> }) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const [show, setShow] = useState(false)

  useFrame(() => {
    const opacity = phaseValuesRef.current.helioOpacity
    if (opacity > 0.01 && !show) setShow(true)
    else if (opacity < 0.01 && show) setShow(false)
    if (spanRef.current) {
      const labelVis = labelOpacityRef?.current ?? 1
      spanRef.current.style.opacity = String(opacity * labelVis)
    }
  })

  if (!show) return null
  return (
    <Html center position={[0, -0.35, 0]} zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: 'none', overflow: 'visible' }}>
      <span ref={spanRef} className="text-white/70 text-xs whitespace-nowrap select-none" style={{ opacity: 0 }}>
        &#9737; {label ?? 'Sun'}
      </span>
    </Html>
  )
}

// ─── Label Opacity Animator ──────────────────────────────────────────
function LabelOpacityAnimator({ target, opacityRef }: { target: number; opacityRef: React.MutableRefObject<number> }) {
  useFrame((_, delta) => {
    opacityRef.current += (target - opacityRef.current) * Math.min(delta * 5, 0.25)
  })
  return null
}

// ─── Main Scene ─────────────────────────────────────────────────────
function WheelScene({
  planets, aspects, onPlanetTap, onSignTap, onEarthTap, selectedPlanet, sceneReady,
  planetScale = 1, rotationSpeed = 1, onRotationVelocity, kpIndex, solarFluxValue,
  viewMode = 'geocentric', isTransitioning = false, helioData, onTransitionComplete,
  animationTimeRef, animationSpeedRef,
  sunLabel, showHelioLabels = true,
}: AstroWheel3DProps & { sceneReady: boolean; sunLabel?: string }) {
  const [entranceComplete, setEntranceComplete] = useState(false)
  const [tiltStarted, setTiltStarted] = useState(false)
  const [tiltDone, setTiltDone] = useState(false)
  const controlsRef = useRef<any>(null)
  const prevAzimuth = useRef(0)

  // Transition state
  const phaseValuesRef = useRef<PhaseValues>({ zodiacOpacity: 1, smoothMoveT: 0, helioOpacity: 0, continuousPositions: null })
  const transitionProgress = useRef(0)

  // Label visibility (helio view toggle)
  const labelOpacityRef = useRef(showHelioLabels ? 1 : 0)

  // Phase 6: Entrance finishes at 3000ms
  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => setEntranceComplete(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [sceneReady])

  // Phase 7: Brief pause, then tilt begins at 3500ms
  useEffect(() => {
    if (entranceComplete) {
      const timer = setTimeout(() => setTiltStarted(true), 500)
      return () => clearTimeout(timer)
    }
  }, [entranceComplete])

  const handleTiltDone = useCallback(() => setTiltDone(true), [])

  return (
    <>
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight position={[3, 4, 2]} intensity={0.6} color="#e0e8ff" />
      <pointLight position={[0, -2, 0]} intensity={0.2} color="#c0c8e0" distance={6} />
      <Environment preset="night" background={false} />

      <BackgroundParticles />
      <OrbitingLight />

      {/* Label opacity animation (helio toggle) */}
      <LabelOpacityAnimator target={showHelioLabels ? 1 : 0} opacityRef={labelOpacityRef} />

      {/* Transition system */}
      <TransitionController
        viewMode={viewMode}
        isTransitioning={isTransitioning}
        onTransitionComplete={onTransitionComplete}
        phaseValuesRef={phaseValuesRef}
        transitionProgress={transitionProgress}
      />
      <CameraDistanceAnimator transitionProgress={transitionProgress} />
      <HelioTiltAnimator controlsRef={controlsRef} transitionProgress={transitionProgress} />
      {animationTimeRef && animationSpeedRef && (
        <ContinuousTimeAnimator
          animationTimeRef={animationTimeRef}
          animationSpeedRef={animationSpeedRef}
          phaseValuesRef={phaseValuesRef}
        />
      )}

      <group>
        {/* Phase 1: Earth ignites (0ms) — moves in helio view */}
        <EarthPositionAnimator phaseValuesRef={phaseValuesRef} helioData={helioData}>
          <AnimatedScaleGroup sceneReady={sceneReady} delay={0}>
            <EarthCentre onEarthTap={onEarthTap} kpIndex={kpIndex ?? null} labelOpacityRef={labelOpacityRef} phaseValuesRef={phaseValuesRef} />
          </AnimatedScaleGroup>
        </EarthPositionAnimator>

        {/* Geo-only elements: fade out during transition */}
        <GeoFadeGroup phaseValuesRef={phaseValuesRef}>
          {/* Phase 2: Inner rings expand (400ms) */}
          <AnimatedScaleGroup sceneReady={sceneReady} delay={400}>
            <MiddleRing />
            <InnerTrackRing />
            <InnerDust />
          </AnimatedScaleGroup>

          {/* Phase 3: Outer zodiac ring (800ms) — badges stagger via CSS */}
          <AnimatedScaleGroup sceneReady={sceneReady} delay={600}>
            <CounterRotatingRing>
              <OuterZodiacRing onSignTap={onSignTap} sceneReady={sceneReady} phaseValuesRef={phaseValuesRef} />
            </CounterRotatingRing>
          </AnimatedScaleGroup>
        </GeoFadeGroup>

        {/* Orbital path rings — helio view only */}
        <OrbitalRings phaseValuesRef={phaseValuesRef} />
        <MoonOrbitRing phaseValuesRef={phaseValuesRef} helioData={helioData} />

        {/* Phase 4: Planets appear (1400ms+, staggered) */}
        {planets.map((planet) => {
          const orderIndex = PLANET_ORDER.indexOf(planet.id)
          return (
            <PlanetOrb
              key={planet.id}
              planet={planet}
              index={orderIndex}
              isSelected={selectedPlanet === planet.id}
              onTap={() => onPlanetTap(planet)}
              planets={planets}
              sceneReady={sceneReady}
              entranceDelay={1400 + orderIndex * 100}
              planetScale={planetScale}
              phaseValuesRef={phaseValuesRef}
              helioData={helioData}
              isTransitioning={isTransitioning}
              labelOpacityRef={labelOpacityRef}
            />
          )
        })}

        {/* Sun Corona — live solar activity glow (last to appear) */}
        {(() => {
          const sun = planets.find(p => p.id === 'sun')
          if (!sun) return null
          const activity = parseSolarActivity(solarFluxValue ?? 0, '')
          return (
            <SunCoronaAnimated
              planet={sun}
              solarActivity={activity}
              sceneReady={sceneReady}
              phaseValuesRef={phaseValuesRef}
              helioData={helioData}
            />
          )
        })()}

        {/* Sun centre label — appears in helio view */}
        <SunCentreLabel phaseValuesRef={phaseValuesRef} label={sunLabel} labelOpacityRef={labelOpacityRef} />
      </group>

      {/* Phase 7: Cinematic tilt after entrance */}
      <TiltAnimator controlsRef={controlsRef} tiltStarted={tiltStarted} onTiltDone={handleTiltDone} />

      {/* Phase 8: Auto-rotation begins after tilt completes */}
      <RotationVelocityTracker prevAzimuth={prevAzimuth} onRotationVelocity={onRotationVelocity} />
      <OrbitControls
        ref={controlsRef}
        enableRotate
        enableZoom={false}
        enablePan={false}
        autoRotate={tiltDone && rotationSpeed > 0 && !isTransitioning}
        autoRotateSpeed={viewMode === 'heliocentric' ? 0.08 : 0.3 * rotationSpeed}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={0.3}
        maxPolarAngle={2.8}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        rotateSpeed={0.5}
      />

      <ConditionalBloom />
    </>
  )
}

// ─── Export ─────────────────────────────────────────────────────────
export default function AstroWheel3D(props: AstroWheel3DProps) {
  const { t } = useTranslation()
  const [sceneReady, setSceneReady] = useState(false)

  return (
    <div
      className="relative w-full select-none"
      style={{
        height: '95vw',
        maxHeight: '550px',
        overflow: 'visible',
        touchAction: 'none',
        background: 'transparent',
        WebkitTapHighlightColor: 'transparent',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        outline: 'none',
      }}
    >
      {/* Loading text */}
      {!sceneReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
            {t('loading.stars')}
          </div>
        </div>
      )}

      {/* Canvas — hidden until scene renders first frame */}
      <div style={{ opacity: sceneReady ? 1 : 0, width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        <Canvas
          tabIndex={-1}
          camera={{ position: [0, 1.5, 7], fov: 38, near: 0.1, far: 100 }}
          style={{ background: 'transparent', overflow: 'visible', outline: 'none', WebkitTapHighlightColor: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
          onCreated={() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                setSceneReady(true)
              })
            })
          }}
        >
          <WheelScene {...props} sceneReady={sceneReady} sunLabel={t('helio.sunLabel')} />
        </Canvas>
      </div>
    </div>
  )
}
