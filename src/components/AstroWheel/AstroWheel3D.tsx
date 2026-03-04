'use client'

import { useRef, useMemo, memo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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

// Element colours for zodiac segments
const ELEMENT_COLOURS: Record<string, string> = {
  fire: '#FF6B4A',
  earth: '#4ADE80',
  air: '#60A5FA',
  water: '#A78BFA',
}

// Convert ecliptic longitude to 3D position on the wheel plane
function longitudeToPosition(longitude: number, radius: number): [number, number, number] {
  const rad = (longitude - 90) * (Math.PI / 180)
  return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
}

// ─── Particle Field ─────────────────────────────────────────────────
const ParticleField = memo(function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const count = 250

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3.5 + Math.random() * 2.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.15}
        sizeAttenuation
      />
    </points>
  )
})

// ─── Zodiac Ring ────────────────────────────────────────────────────
const ZodiacRing = memo(function ZodiacRing({
  onSignTap,
}: {
  onSignTap: (signId: string) => void
}) {
  const outerRadius = 2.2
  const innerRadius = 1.9
  const segments = 64

  // Build ring segments for each zodiac sign
  const ringSegments = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => {
      const startAngle = (i * 30 - 90) * (Math.PI / 180)
      const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180)
      const colour = new THREE.Color(ELEMENT_COLOURS[sign.element])

      // Create segment shape
      const shape = new THREE.Shape()
      const segs = Math.ceil(segments / 12)

      // Outer arc
      for (let j = 0; j <= segs; j++) {
        const a = startAngle + (endAngle - startAngle) * (j / segs)
        const x = Math.cos(a) * outerRadius
        const z = Math.sin(a) * outerRadius
        if (j === 0) shape.moveTo(x, z)
        else shape.lineTo(x, z)
      }
      // Inner arc (reverse)
      for (let j = segs; j >= 0; j--) {
        const a = startAngle + (endAngle - startAngle) * (j / segs)
        const x = Math.cos(a) * innerRadius
        const z = Math.sin(a) * innerRadius
        shape.lineTo(x, z)
      }
      shape.closePath()

      // Glyph position (midpoint of segment)
      const midAngle = (startAngle + endAngle) / 2
      const glyphRadius = (outerRadius + innerRadius) / 2
      const gx = Math.cos(midAngle) * glyphRadius
      const gz = Math.sin(midAngle) * glyphRadius

      return { sign, shape, colour, gx, gz }
    })
  }, [])

  return (
    <group>
      {ringSegments.map(({ sign, shape, colour, gx, gz }) => (
        <group key={sign.id}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <shapeGeometry args={[shape]} />
            <meshStandardMaterial
              color={colour}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              emissive={colour}
              emissiveIntensity={0.1}
            />
          </mesh>
          <Html
            position={[gx, 0.05, gz]}
            center
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              userSelect: 'none',
              fontFamily: 'serif',
            }}
            onClick={() => onSignTap(sign.id)}
          >
            {sign.glyph}
          </Html>
        </group>
      ))}

      {/* Outer edge ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[outerRadius - 0.01, outerRadius, 64]} />
        <meshStandardMaterial
          color="#8B5CF6"
          transparent
          opacity={0.3}
          emissive="#8B5CF6"
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner edge ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[innerRadius, innerRadius + 0.01, 64]} />
        <meshStandardMaterial
          color="#8B5CF6"
          transparent
          opacity={0.2}
          emissive="#8B5CF6"
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Segment dividers */}
      {ZODIAC_SIGNS.map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = Math.cos(angle) * innerRadius
        const z1 = Math.sin(angle) * innerRadius
        const x2 = Math.cos(angle) * outerRadius
        const z2 = Math.sin(angle) * outerRadius
        return (
          <Line
            key={`div-${i}`}
            points={[[x1, 0, z1], [x2, 0, z2]]}
            color="#8B5CF6"
            lineWidth={0.5}
            transparent
            opacity={0.2}
          />
        )
      })}
    </group>
  )
})

// ─── Degree Track ───────────────────────────────────────────────────
const DegreeTrack = memo(function DegreeTrack() {
  const radius = 1.85

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.005, radius + 0.005, 64]} />
        <meshStandardMaterial
          color="#8B5CF6"
          transparent
          opacity={0.15}
          emissive="#8B5CF6"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tick marks every 30° */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180)
        const x1 = Math.cos(angle) * (radius - 0.04)
        const z1 = Math.sin(angle) * (radius - 0.04)
        const x2 = Math.cos(angle) * (radius + 0.04)
        const z2 = Math.sin(angle) * (radius + 0.04)
        return (
          <Line
            key={`tick-${i}`}
            points={[[x1, 0, z1], [x2, 0, z2]]}
            color="#8B5CF6"
            lineWidth={0.5}
            transparent
            opacity={0.25}
          />
        )
      })}
    </group>
  )
})

// ─── Planet Orb ─────────────────────────────────────────────────────
function PlanetOrb({
  planet,
  index,
  isSelected,
  onTap,
}: {
  planet: PlanetPosition
  index: number
  isSelected: boolean
  onTap: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const colour = new THREE.Color(planet.colour)
  const planetRadius = 1.5
  const pos = longitudeToPosition(planet.eclipticLongitude, planetRadius)

  // Planet size hierarchy
  const sizeMap: Record<string, number> = {
    sun: 0.12,
    moon: 0.10,
    mercury: 0.07,
    venus: 0.07,
    mars: 0.07,
    jupiter: 0.06,
    saturn: 0.06,
    uranus: 0.06,
    neptune: 0.06,
    pluto: 0.06,
  }
  const size = sizeMap[planet.id] ?? 0.06

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime()
      const breath = 0.3 + Math.sin(t * 0.8 + index * 1.2) * 0.15
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = isSelected ? breath * 2.5 : breath
    }
  })

  return (
    <group position={pos}>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onTap() }}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={colour}
          emissive={colour}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight
        color={planet.colour}
        intensity={isSelected ? 0.6 : 0.25}
        distance={1.5}
        decay={2}
      />
      <Html
        position={[0, 0.18, 0]}
        center
        style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.8)',
          whiteSpace: 'nowrap',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none',
          textShadow: '0 0 6px rgba(0,0,0,0.8)',
        }}
        onClick={onTap}
      >
        {planet.glyph} {planet.degreeInSign}°
      </Html>
    </group>
  )
}

// ─── Aspect Lines ───────────────────────────────────────────────────
function AspectLines3D({
  aspects,
  planets,
  selectedPlanet,
  onAspectTap,
}: {
  aspects: AspectData[]
  planets: PlanetPosition[]
  selectedPlanet: string | null
  onAspectTap: (aspect: AspectData) => void
}) {
  const planetRadius = 1.5

  const visibleAspects = selectedPlanet
    ? aspects.filter(a => a.planet1 === selectedPlanet || a.planet2 === selectedPlanet)
    : aspects

  return (
    <group>
      {visibleAspects.map((aspect, i) => {
        const p1 = planets.find(p => p.id === aspect.planet1)
        const p2 = planets.find(p => p.id === aspect.planet2)
        if (!p1 || !p2) return null

        const pos1 = longitudeToPosition(p1.eclipticLongitude, planetRadius)
        const pos2 = longitudeToPosition(p2.eclipticLongitude, planetRadius)
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
            opacity={selectedPlanet ? (isHighlighted ? 0.7 : 0.1) : 0.3}
            onClick={(e) => { e.stopPropagation(); onAspectTap(aspect) }}
          />
        )
      })}
    </group>
  )
}

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
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color="#8B5CF6"
        emissive="#8B5CF6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  )
})

// ─── Main Scene ─────────────────────────────────────────────────────
function WheelScene({
  planets,
  aspects,
  onPlanetTap,
  onSignTap,
  onAspectTap,
  selectedPlanet,
}: AstroWheel3DProps) {
  const groupRef = useRef<THREE.Group>(null!)

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 3, 5]} intensity={0.3} />

      <ParticleField />

      <group ref={groupRef} rotation={[0.25, 0, 0]}>
        <ZodiacRing onSignTap={onSignTap} />
        <DegreeTrack />
        <AspectLines3D
          aspects={aspects}
          planets={planets}
          selectedPlanet={selectedPlanet}
          onAspectTap={onAspectTap}
        />
        {planets.map((planet, i) => (
          <PlanetOrb
            key={planet.id}
            planet={planet}
            index={i}
            isSelected={selectedPlanet === planet.id}
            onTap={() => onPlanetTap(planet)}
          />
        ))}
        <CentreGlow />
      </group>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.8}
        />
      </EffectComposer>
    </>
  )
}

export default function AstroWheel3D(props: AstroWheel3DProps) {
  return (
    <div
      className="relative w-full max-w-[90vw] md:max-w-[60vw] lg:max-w-[min(500px,45vw)] mx-auto"
      style={{ height: '85vw', maxHeight: '500px', touchAction: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 2.5, 4.5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <WheelScene {...props} />
      </Canvas>
    </div>
  )
}
