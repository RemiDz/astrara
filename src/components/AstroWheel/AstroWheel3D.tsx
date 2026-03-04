'use client'

import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { useTranslation } from '@/i18n/useTranslation'

interface AstroWheel3DProps {
  planets: PlanetPosition[]
  aspects: AspectData[]
  onPlanetTap: (planet: PlanetPosition) => void
  onSignTap: (signId: string) => void
  onAspectTap: (aspect: AspectData) => void
  onEarthTap: () => void
  selectedPlanet: string | null
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
      <meshBasicMaterial color="#8B5CF6" transparent opacity={opacity} />
    </mesh>
  )
})

// ─── Outer Zodiac Ring (Ring 1) ─────────────────────────────────────
function OuterZodiacRing({
  onSignTap,
  sceneReady,
}: {
  onSignTap: (signId: string) => void
  sceneReady: boolean
}) {
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
              color="#1a1a2e"
              transparent
              opacity={0.25}
              roughness={0.1}
              metalness={0.8}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
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
              type="button"
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); onSignTap(sign.id) }}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex items-center justify-center select-none cursor-pointer active:scale-90 transition-transform duration-150"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: `${ELEMENT_COLOURS[sign.element]}15`,
                border: `1px solid ${ELEMENT_COLOURS[sign.element]}30`,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                fontSize: '18px',
                color: ELEMENT_COLOURS[sign.element],
                textShadow: `0 0 12px ${ELEMENT_COLOURS[sign.element]}60`,
                fontFamily: 'serif',
                opacity: sceneReady ? 1 : 0,
                transform: sceneReady ? 'scale(1)' : 'scale(0.5)',
                transition: `all 0.4s ease-out ${800 + index * 80}ms`,
                outline: 'none',
                padding: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
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
          <Line key={`div1-${i}`} points={[[x1, 0, z1], [x2, 0, z2]]} color="#8B5CF6" lineWidth={0.5} transparent opacity={0.12} />
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
            color="#1a1a2e" transparent opacity={0.2} roughness={0.1} metalness={0.8}
            clearcoat={1.0} clearcoatRoughness={0.1} side={THREE.DoubleSide}
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
        return <Line key={`tick-${i}`} points={[[x1, 0, z1], [x2, 0, z2]]} color="#8B5CF6" lineWidth={0.5} transparent opacity={0.12} />
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
          color="#1a1a2e" transparent opacity={0.08} roughness={0.1} metalness={0.8}
          clearcoat={1.0} clearcoatRoughness={0.1} side={THREE.DoubleSide}
          emissive="#8B5CF6" emissiveIntensity={0.03}
        />
      </mesh>
    </group>
  )
})

// ─── Sacred Geometry ────────────────────────────────────────────────
const SacredGeometry = memo(function SacredGeometry() {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = -clock.getElapsedTime() * 0.03
  })
  const r = 0.9
  const points = useMemo(() => {
    const pts: [number, number, number][] = [[0, 0, 0]]
    for (let i = 0; i < 6; i++) {
      const a = (i * 60) * (Math.PI / 180)
      pts.push([Math.cos(a) * r * 0.45, 0, Math.sin(a) * r * 0.45])
    }
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 + 30) * (Math.PI / 180)
      pts.push([Math.cos(a) * r * 0.8, 0, Math.sin(a) * r * 0.8])
    }
    return pts
  }, [])
  const lines = useMemo(() => {
    const result: [number, number, number][][] = []
    for (let i = 0; i < points.length; i++)
      for (let j = i + 1; j < points.length; j++)
        result.push([points[i], points[j]])
    return result
  }, [points])

  return (
    <group ref={ref}>
      {lines.map((pair, i) => (
        <Line key={`sg-${i}`} points={pair} color="#8B5CF6" lineWidth={0.3} transparent opacity={0.04} />
      ))}
    </group>
  )
})

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
      <pointsMaterial size={0.015} color="#C4B5FD" transparent opacity={0.15} sizeAttenuation />
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
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
    gradient.addColorStop(0.4, 'rgba(139, 92, 246, 0.08)')
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
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

// ─── Earth Centre ───────────────────────────────────────────────────
function EarthCentre({ onEarthTap }: { onEarthTap: () => void }) {
  const earthRef = useRef<THREE.Mesh>(null!)
  const earthTexture = useMemo(() => createEarthTexture(), [])

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.1
  })

  return (
    <group>
      {/* Textured Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          map={earthTexture}
          emissive="#0a1a3a"
          emissiveIntensity={0.3}
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Atmosphere glow — inside-out sphere */}
      <mesh>
        <sphereGeometry args={[0.175, 32, 32]} />
        <meshBasicMaterial color="#4a9eff" transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      {/* Outer atmosphere halo */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#6ab5ff" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>

      <pointLight color="#4a9eff" intensity={0.3} distance={1.5} decay={2} />

      <Html center position={[0, -0.25, 0]} zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: 'none', overflow: 'visible' }}>
        <div className="text-center whitespace-nowrap select-none tracking-widest uppercase"
          style={{ fontSize: '8px', color: 'rgba(74, 158, 255, 0.35)', textShadow: '0 0 8px rgba(74, 158, 255, 0.3)', fontFamily: 'var(--font-body), sans-serif' }}>
          you are here
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

// ─── Planet Orb (with entrance animation) ───────────────────────────
function PlanetOrb({
  planet, index, isSelected, onTap, planets, sceneReady, entranceDelay,
}: {
  planet: PlanetPosition; index: number; isSelected: boolean; onTap: () => void
  planets: PlanetPosition[]; sceneReady: boolean; entranceDelay: number
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

  useFrame(({ clock }, delta) => {
    // Scale animation
    const targetScale = visible ? 1 : 0
    currentScale.current += (targetScale - currentScale.current) * Math.min(delta * 3, 0.15)
    if (groupRef.current) groupRef.current.scale.setScalar(currentScale.current)

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

  return (
    <group ref={groupRef} position={pos} scale={0}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.radius, 20, 20]} />
        <meshStandardMaterial color={colour} emissive={colour} emissiveIntensity={0.4} transparent opacity={0.9} roughness={0.3} metalness={0.2} />
      </mesh>
      {planet.id === 'saturn' && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[config.radius * 1.6, 0.008, 4, 32]} />
          <meshBasicMaterial color={planet.colour} transparent opacity={0.5} />
        </mesh>
      )}
      <pointLight color={planet.colour} intensity={isSelected || isFlashing ? 0.7 : 0.3} distance={1.5} decay={2} />
      <Html position={[0, labelYOffset, 0]} center zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: 'none', userSelect: 'none', overflow: 'visible' }}>
        <div className="whitespace-nowrap select-none pointer-events-none"
          style={{
            fontSize: '12px', color: 'white', opacity: visible ? 0.85 : 0,
            textShadow: `0 0 8px ${planet.colour}80, 0 1px 3px rgba(0,0,0,0.8)`,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            padding: '2px 6px', borderRadius: '6px',
            fontFamily: "'DM Sans', sans-serif",
            transition: 'opacity 0.4s ease-out',
          }}>
          {planet.glyph} {planet.degreeInSign}°
        </div>
      </Html>
      <Html center zIndexRange={[100, 0]} occlude={false} style={{ pointerEvents: 'auto', overflow: 'visible' }}>
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

// ─── Aspect Line (delayed fade-in) ──────────────────────────────────
function AspectLine({
  pos1, pos2, colour, opacity, sceneReady, delay,
}: {
  pos1: [number, number, number]; pos2: [number, number, number]
  colour: string; opacity: number; sceneReady: boolean; delay: number
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => setVisible(true), delay)
      return () => clearTimeout(timer)
    }
  }, [sceneReady, delay])

  if (!visible) return null

  return (
    <Line
      points={[pos1, pos2]}
      color={colour}
      lineWidth={1}
      transparent
      opacity={opacity}
    />
  )
}

// ─── Aspect Lines ───────────────────────────────────────────────────
function AspectLines3D({
  aspects, planets, selectedPlanet, sceneReady,
}: {
  aspects: AspectData[]; planets: PlanetPosition[]; selectedPlanet: string | null; sceneReady: boolean
}) {
  const visibleAspects = selectedPlanet
    ? aspects.filter(a => a.planet1 === selectedPlanet || a.planet2 === selectedPlanet)
    : aspects

  return (
    <group>
      {visibleAspects.map((aspect, i) => {
        const p1 = planets.find(p => p.id === aspect.planet1)
        const p2 = planets.find(p => p.id === aspect.planet2)
        if (!p1 || !p2) return null
        const pos1 = longitudeToPosition(p1.eclipticLongitude, R_PLANET)
        const pos2 = longitudeToPosition(p2.eclipticLongitude, R_PLANET)
        const isHighlighted = selectedPlanet ? aspect.planet1 === selectedPlanet || aspect.planet2 === selectedPlanet : false
        const baseOpacity = selectedPlanet ? (isHighlighted ? 0.6 : 0.08) : 0.25
        return (
          <AspectLine
            key={`aspect-${i}`}
            pos1={pos1} pos2={pos2}
            colour={aspect.colour}
            opacity={baseOpacity}
            sceneReady={sceneReady}
            delay={2200 + i * 80}
          />
        )
      })}
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
  return <EffectComposer><Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.7} /></EffectComposer>
}

// ─── Main Scene ─────────────────────────────────────────────────────
function WheelScene({
  planets, aspects, onPlanetTap, onSignTap, onEarthTap, selectedPlanet, sceneReady,
}: AstroWheel3DProps & { sceneReady: boolean }) {
  const [entranceComplete, setEntranceComplete] = useState(false)

  useEffect(() => {
    if (sceneReady) {
      const timer = setTimeout(() => setEntranceComplete(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [sceneReady])

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 3, 5]} intensity={0.35} />

      <BackgroundParticles />
      <OuterHalo />

      <group>
        {/* Phase 1: Earth ignites (0ms) */}
        <AnimatedScaleGroup sceneReady={sceneReady} delay={0}>
          <EarthCentre onEarthTap={onEarthTap} />
        </AnimatedScaleGroup>

        {/* Phase 2: Inner rings expand (400ms) */}
        <AnimatedScaleGroup sceneReady={sceneReady} delay={400}>
          <MiddleRing />
          <InnerTrackRing />
          <SacredGeometry />
          <InnerDust />
        </AnimatedScaleGroup>

        {/* Phase 3: Outer zodiac ring (800ms) — badges stagger via CSS */}
        <AnimatedScaleGroup sceneReady={sceneReady} delay={600}>
          <CounterRotatingRing>
            <OuterZodiacRing onSignTap={onSignTap} sceneReady={sceneReady} />
          </CounterRotatingRing>
        </AnimatedScaleGroup>

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
            />
          )
        })}

        {/* Phase 5: Aspect lines draw (2200ms+) */}
        <AspectLines3D aspects={aspects} planets={planets} selectedPlanet={selectedPlanet} sceneReady={sceneReady} />
      </group>

      {/* Phase 6: Auto-rotation begins after entrance (3000ms) */}
      <OrbitControls
        enableRotate
        enableZoom={false}
        enablePan={false}
        autoRotate={entranceComplete}
        autoRotateSpeed={0.3}
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
          <WheelScene {...props} sceneReady={sceneReady} />
        </Canvas>
      </div>
    </div>
  )
}
