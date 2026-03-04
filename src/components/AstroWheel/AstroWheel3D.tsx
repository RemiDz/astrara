'use client'

import { useRef, useMemo, useState, useEffect, memo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'

interface AstroWheel3DProps {
  planets: PlanetPosition[]
  aspects: AspectData[]
  onPlanetTap: (planet: PlanetPosition) => void
  onSignTap: (signId: string) => void
  onAspectTap: (aspect: AspectData) => void
  selectedPlanet: string | null
}

const ELEMENT_COLOURS: Record<string, string> = {
  fire: '#FF6B4A',
  earth: '#4ADE80',
  air: '#60A5FA',
  water: '#A78BFA',
}

// Radii
const R_OUTER = 2.2
const R_OUTER_INNER = 2.05
const R_MID_OUTER = 1.95
const R_MID_INNER = 1.7
const R_TRACK = 1.6
const R_PLANET = 1.5

function longitudeToPosition(longitude: number, radius: number): [number, number, number] {
  const rad = (longitude - 90) * (Math.PI / 180)
  return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
}

// Planet sizes and pulse speeds per spec
const PLANET_CONFIG: Record<string, { radius: number; pulseSpeed: number }> = {
  sun:     { radius: 0.18, pulseSpeed: 1.2 },
  moon:    { radius: 0.15, pulseSpeed: 0.6 },
  mercury: { radius: 0.10, pulseSpeed: 2.0 },
  venus:   { radius: 0.12, pulseSpeed: 0.5 },
  mars:    { radius: 0.12, pulseSpeed: 1.4 },
  jupiter: { radius: 0.14, pulseSpeed: 0.7 },
  saturn:  { radius: 0.13, pulseSpeed: 0.6 },
  uranus:  { radius: 0.10, pulseSpeed: 0.8 },
  neptune: { radius: 0.10, pulseSpeed: 0.4 },
  pluto:   { radius: 0.08, pulseSpeed: 0.3 },
}

// ─── Ring Edge (torus glow line) ────────────────────────────────────
const RingEdge = memo(function RingEdge({ radius, opacity = 0.35 }: { radius: number; opacity?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.005, 8, 128]} />
      <meshBasicMaterial color="#8B5CF6" transparent opacity={opacity} />
    </mesh>
  )
})

// ─── Outer Zodiac Ring (Ring 1) ─────────────────────────────────────
const OuterZodiacRing = memo(function OuterZodiacRing({
  onSignTap,
}: {
  onSignTap: (signId: string) => void
}) {
  const segments = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => {
      const startAngle = (i * 30 - 90) * (Math.PI / 180)
      const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180)

      // Create segment shape
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

      return { sign, shape, gx, gz }
    })
  }, [])

  return (
    <group>
      {segments.map(({ sign, shape, gx, gz }) => (
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
            onClick={() => onSignTap(sign.id)}
          >
            <div
              className="flex items-center justify-center select-none cursor-pointer"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: `${ELEMENT_COLOURS[sign.element]}15`,
                border: `1px solid ${ELEMENT_COLOURS[sign.element]}30`,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                fontSize: '18px',
                color: ELEMENT_COLOURS[sign.element],
                textShadow: `0 0 12px ${ELEMENT_COLOURS[sign.element]}60`,
                fontFamily: 'serif',
              }}
            >
              {sign.glyph}
            </div>
          </Html>
        </group>
      ))}

      {/* Segment dividers */}
      {ZODIAC_SIGNS.map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = Math.cos(angle) * R_OUTER_INNER
        const z1 = Math.sin(angle) * R_OUTER_INNER
        const x2 = Math.cos(angle) * R_OUTER
        const z2 = Math.sin(angle) * R_OUTER
        return (
          <Line
            key={`div1-${i}`}
            points={[[x1, 0, z1], [x2, 0, z2]]}
            color="#8B5CF6"
            lineWidth={0.5}
            transparent
            opacity={0.12}
          />
        )
      })}

      {/* Torus edges */}
      <RingEdge radius={R_OUTER} opacity={0.4} />
      <RingEdge radius={R_OUTER_INNER} opacity={0.25} />
    </group>
  )
})

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
            color="#1a1a2e"
            transparent
            opacity={0.2}
            roughness={0.1}
            metalness={0.8}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            side={THREE.DoubleSide}
            emissive={new THREE.Color(ELEMENT_COLOURS[sign.element])}
            emissiveIntensity={0.05}
          />
        </mesh>
      ))}

      {/* Tick marks every 30° */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = Math.cos(angle) * R_MID_INNER
        const z1 = Math.sin(angle) * R_MID_INNER
        const x2 = Math.cos(angle) * R_MID_OUTER
        const z2 = Math.sin(angle) * R_MID_OUTER
        return (
          <Line
            key={`tick-${i}`}
            points={[[x1, 0, z1], [x2, 0, z2]]}
            color="#8B5CF6"
            lineWidth={0.5}
            transparent
            opacity={0.12}
          />
        )
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
          color="#1a1a2e"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.8}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
          emissive="#8B5CF6"
          emissiveIntensity={0.03}
        />
      </mesh>
    </group>
  )
})

// ─── Sacred Geometry (Metatron's Cube) ──────────────────────────────
const SacredGeometry = memo(function SacredGeometry() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = -clock.getElapsedTime() * 0.03
    }
  })

  // Metatron's cube: 13 circles connected by lines
  const r = 0.9
  const points = useMemo(() => {
    const pts: [number, number, number][] = [[0, 0, 0]]
    // Inner ring (6 points)
    for (let i = 0; i < 6; i++) {
      const a = (i * 60) * (Math.PI / 180)
      pts.push([Math.cos(a) * r * 0.45, 0, Math.sin(a) * r * 0.45])
    }
    // Outer ring (6 points)
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 + 30) * (Math.PI / 180)
      pts.push([Math.cos(a) * r * 0.8, 0, Math.sin(a) * r * 0.8])
    }
    return pts
  }, [])

  // Connect all points to each other
  const lines = useMemo(() => {
    const result: [number, number, number][][] = []
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        result.push([points[i], points[j]])
      }
    }
    return result
  }, [points])

  return (
    <group ref={ref}>
      {lines.map((pair, i) => (
        <Line
          key={`sg-${i}`}
          points={pair}
          color="#8B5CF6"
          lineWidth={0.3}
          transparent
          opacity={0.04}
        />
      ))}
    </group>
  )
})

// ─── Background Particle Field ──────────────────────────────────────
const BackgroundParticles = memo(function BackgroundParticles() {
  const ref = useRef<THREE.Points>(null!)
  const count = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.5 + Math.random() * 2.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.015
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.12} sizeAttenuation />
    </points>
  )
})

// ─── Inner Dust Particles ───────────────────────────────────────────
const InnerDust = memo(function InnerDust() {
  const ref = useRef<THREE.Points>(null!)
  const count = 80

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 0.3 + Math.random() * 1.2
      pos[i * 3] = Math.cos(angle) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.15
      pos[i * 3 + 2] = Math.sin(angle) * r
    }
    return pos
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#C4B5FD" transparent opacity={0.15} sizeAttenuation />
    </points>
  )
})

// ─── Outer Glow Halo ────────────────────────────────────────────────
const OuterHalo = memo(function OuterHalo() {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
    gradient.addColorStop(0.4, 'rgba(139, 92, 246, 0.08)')
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  return (
    <sprite scale={[7, 7, 1]} position={[0, -0.1, -0.5]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  )
})

// ─── Centre Glow ────────────────────────────────────────────────────
const CentreGlow = memo(function CentreGlow() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.15
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.35}
      />
    </mesh>
  )
})

// ─── Planet Orb ─────────────────────────────────────────────────────
function PlanetOrb({
  planet,
  index,
  isSelected,
  onTap,
  planets,
}: {
  planet: PlanetPosition
  index: number
  isSelected: boolean
  onTap: () => void
  planets: PlanetPosition[]
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [isFlashing, setIsFlashing] = useState(false)
  const colour = useMemo(() => new THREE.Color(planet.colour), [planet.colour])
  const pos = useMemo(() => longitudeToPosition(planet.eclipticLongitude, R_PLANET), [planet.eclipticLongitude])
  const config = PLANET_CONFIG[planet.id] ?? { radius: 0.08, pulseSpeed: 0.6 }

  // Check if close to another planet for label offset
  const labelOffset = useMemo(() => {
    let offset = -0.28
    for (const other of planets) {
      if (other.id === planet.id) continue
      let diff = Math.abs(planet.eclipticLongitude - other.eclipticLongitude)
      if (diff > 180) diff = 360 - diff
      if (diff < 8 && planets.indexOf(other) < planets.indexOf(planet)) {
        offset = 0.28 // push label above if close to another planet
      }
    }
    return offset
  }, [planet, planets])

  const handleTap = useCallback(() => {
    setIsFlashing(true)
    setTimeout(() => setIsFlashing(false), 300)
    onTap()
  }, [onTap])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime()
      const speed = config.pulseSpeed
      let breath = 0.4 + Math.sin(t * speed + index * 1.2) * 0.2
      if (isFlashing) breath = 3.0
      else if (isSelected) breath *= 2.5
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = breath
    }
  })

  return (
    <group position={pos}>
      {/* Visible orb */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.radius, 20, 20]} />
        <meshStandardMaterial
          color={colour}
          emissive={colour}
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Saturn ring */}
      {planet.id === 'saturn' && (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[config.radius * 1.6, 0.008, 4, 32]} />
          <meshBasicMaterial color={planet.colour} transparent opacity={0.5} />
        </mesh>
      )}

      {/* Point light */}
      <pointLight
        color={planet.colour}
        intensity={isSelected || isFlashing ? 0.7 : 0.3}
        distance={1.5}
        decay={2}
      />

      {/* Label with backdrop */}
      <Html
        position={[0, labelOffset, 0]}
        center
        zIndexRange={[100, 0]}
        occlude={false}
        style={{ pointerEvents: 'none', userSelect: 'none', overflow: 'visible' }}
      >
        <div
          className="text-center whitespace-nowrap px-1.5 py-0.5 rounded-md"
          style={{
            fontSize: '11px',
            color: planet.colour,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            textShadow: `0 0 8px ${planet.colour}40`,
            fontFamily: 'var(--font-body), sans-serif',
          }}
        >
          {planet.glyph} {planet.degreeInSign}°
        </div>
      </Html>

      {/* Invisible HTML tap target — 48px for reliable mobile tapping */}
      <Html
        center
        zIndexRange={[100, 0]}
        occlude={false}
        style={{ pointerEvents: 'auto', overflow: 'visible' }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleTap()
          }}
          className="rounded-full cursor-pointer"
          style={{
            width: '48px',
            height: '48px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            outline: 'none',
          }}
          aria-label={`View ${planet.name} details`}
        />
      </Html>
    </group>
  )
}

// ─── Aspect Lines ───────────────────────────────────────────────────
function AspectLines3D({
  aspects,
  planets,
  selectedPlanet,
}: {
  aspects: AspectData[]
  planets: PlanetPosition[]
  selectedPlanet: string | null
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
        const isHighlighted = selectedPlanet
          ? aspect.planet1 === selectedPlanet || aspect.planet2 === selectedPlanet
          : false

        return (
          <Line
            key={`aspect-${i}`}
            points={[pos1, pos2]}
            color={aspect.colour}
            lineWidth={1}
            transparent
            opacity={selectedPlanet ? (isHighlighted ? 0.6 : 0.08) : 0.25}
          />
        )
      })}
    </group>
  )
}

// ─── Counter-rotating wrapper for outer ring ────────────────────────
function CounterRotatingRing({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = -clock.getElapsedTime() * 0.01
    }
  })

  return <group ref={ref}>{children}</group>
}

// ─── Mobile bloom detector ──────────────────────────────────────────
function ConditionalBloom() {
  const { size } = useThree()
  if (size.width < 768) return null
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={0.7} />
    </EffectComposer>
  )
}

// ─── Main Scene ─────────────────────────────────────────────────────
function WheelScene({
  planets,
  aspects,
  onPlanetTap,
  onSignTap,
  selectedPlanet,
}: AstroWheel3DProps) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 3, 5]} intensity={0.35} />

      <BackgroundParticles />
      <OuterHalo />

      <group>
        {/* Outer zodiac ring — slow counter-rotation for parallax */}
        <CounterRotatingRing>
          <OuterZodiacRing onSignTap={onSignTap} />
        </CounterRotatingRing>

        {/* Middle + inner rings rotate with wheel */}
        <MiddleRing />
        <InnerTrackRing />

        {/* Sacred geometry behind planets */}
        <SacredGeometry />
        <InnerDust />

        {/* Aspect lines */}
        <AspectLines3D
          aspects={aspects}
          planets={planets}
          selectedPlanet={selectedPlanet}
        />

        {/* Planet orbs */}
        {planets.map((planet, i) => (
          <PlanetOrb
            key={planet.id}
            planet={planet}
            index={i}
            isSelected={selectedPlanet === planet.id}
            onTap={() => onPlanetTap(planet)}
            planets={planets}
          />
        ))}

        <CentreGlow />
      </group>

      <OrbitControls
        enableRotate
        enableZoom={false}
        enablePan={false}
        autoRotate
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

export default function AstroWheel3D(props: AstroWheel3DProps) {
  return (
    <div
      className="relative w-full"
      style={{
        height: '95vw',
        maxHeight: '550px',
        overflow: 'visible',
        touchAction: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 1.5, 7], fov: 38, near: 0.1, far: 100 }}
        style={{ background: 'transparent', overflow: 'visible' }}
        gl={{ alpha: true, antialias: true }}
      >
        <WheelScene {...props} />
      </Canvas>
    </div>
  )
}
