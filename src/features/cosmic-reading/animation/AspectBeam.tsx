'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

const R_PLANET = 1.5

function longitudeToPos(longitude: number, radius: number): THREE.Vector3 {
  const rad = (longitude - 90) * (Math.PI / 180)
  return new THREE.Vector3(Math.cos(rad) * radius, 0, Math.sin(rad) * radius)
}

interface BeamStyle {
  color: string
  glowColor: string
  coreWidth: number
  glowWidth: number
  coreOpacity: number
  glowOpacity: number
  shimmerSpeed: number
  shimmerWidth: number
}

// Beam style configs per aspect type
const BEAM_STYLES: Record<string, BeamStyle> = {
  sextile: {
    color: '#88BBFF',
    glowColor: '#88BBFF',
    coreWidth: 1.5,
    glowWidth: 6,
    coreOpacity: 0.5,
    glowOpacity: 0.15,
    shimmerSpeed: 0.25, // 4s loop
    shimmerWidth: 0.15,
  },
  square: {
    color: '#FF6B4A',
    glowColor: '#FF6B4A',
    coreWidth: 1,
    glowWidth: 8,
    coreOpacity: 0.7,
    glowOpacity: 0.2,
    shimmerSpeed: 0,
    shimmerWidth: 0,
  },
  trine: {
    color: '#4ADE80',
    glowColor: '#FFD700',
    coreWidth: 2,
    glowWidth: 10,
    coreOpacity: 0.8,
    glowOpacity: 0.25,
    shimmerSpeed: 0.4, // 2.5s loop
    shimmerWidth: 0.2,
  },
  opposition: {
    color: '#A78BFA',
    glowColor: '#FF8C00',
    coreWidth: 1.5,
    glowWidth: 8,
    coreOpacity: 0.6,
    glowOpacity: 0.2,
    shimmerSpeed: 0.33, // 3s loop
    shimmerWidth: 0.12,
  },
  conjunction: {
    color: '#FFFFFF',
    glowColor: '#FFFFFF',
    coreWidth: 0,
    glowWidth: 0,
    coreOpacity: 0,
    glowOpacity: 0,
    shimmerSpeed: 0,
    shimmerWidth: 0,
  },
}

type BeamAspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition'

interface AspectBeamProps {
  aspectLine: {
    from: string
    to: string
    color: string
    style: 'solid' | 'dashed'
    animateDrawing: boolean
    drawDuration: number
  }
  aspectType: string
  planets: PlanetPosition[]
}

export default function AspectBeam({ aspectLine, aspectType, planets }: AspectBeamProps) {
  const beamType = (aspectType in BEAM_STYLES ? aspectType : 'sextile') as BeamAspectType

  if (beamType === 'conjunction') {
    return <ConjunctionGlow aspectLine={aspectLine} planets={planets} />
  }

  return <BeamLine aspectLine={aspectLine} beamType={beamType} planets={planets} />
}

// === CONJUNCTION: shared glow ring, no beam ===
function ConjunctionGlow({ aspectLine, planets }: { aspectLine: AspectBeamProps['aspectLine']; planets: PlanetPosition[] }) {
  const ref = useRef<THREE.Mesh>(null!)
  const elapsed = useRef(0)
  const fadeIn = useRef(0)

  const planet = planets.find(p => p.id === aspectLine.from)
  const pos = planet ? longitudeToPos(planet.eclipticLongitude, R_PLANET) : null

  useFrame((_, delta) => {
    if (!ref.current || !pos) return
    elapsed.current += delta
    fadeIn.current = Math.min(fadeIn.current + delta * 1.5, 1)

    const pulse = 0.25 + Math.sin(elapsed.current * 1.6) * 0.08
    ref.current.scale.setScalar(pulse * fadeIn.current)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.18 * fadeIn.current * (0.7 + Math.sin(elapsed.current * 2.0) * 0.3)
  })

  // Reset fade on change
  const prevKey = useRef('')
  const key = `${aspectLine.from}-${aspectLine.to}`
  if (key !== prevKey.current) {
    prevKey.current = key
    elapsed.current = 0
    fadeIn.current = 0
  }

  if (!pos) return null

  return (
    <mesh ref={ref} position={[pos.x, pos.y + 0.02, pos.z]}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial
        color="#FFD700"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// === BEAM LINE: core line + glow line + shimmer ===
function BeamLine({ aspectLine, beamType, planets }: { aspectLine: AspectBeamProps['aspectLine']; beamType: BeamAspectType; planets: PlanetPosition[] }) {
  const coreRef = useRef<THREE.Line>(null!)
  const glowRef = useRef<THREE.Line>(null!)
  const shimmerRef = useRef<THREE.Mesh>(null!)
  const progressRef = useRef(0)
  const fadeRef = useRef(1)
  const elapsed = useRef(0)
  const crackleTimer = useRef(0)
  const crackleOffsets = useRef<number[]>([0, 0, 0, 0, 0, 0])

  const style = BEAM_STYLES[beamType]

  const positions = useMemo(() => {
    const fromPlanet = planets.find(p => p.id === aspectLine.from)
    const toPlanet = planets.find(p => p.id === aspectLine.to)
    if (!fromPlanet || !toPlanet) return null
    return {
      from: longitudeToPos(fromPlanet.eclipticLongitude, R_PLANET),
      to: longitudeToPos(toPlanet.eclipticLongitude, R_PLANET),
    }
  }, [aspectLine.from, aspectLine.to, planets])

  // Reset on aspect change
  const prevKey = useRef('')
  const currentKey = `${aspectLine.from}-${aspectLine.to}`
  if (currentKey !== prevKey.current) {
    prevKey.current = currentKey
    progressRef.current = 0
    fadeRef.current = 1
    elapsed.current = 0
  }

  // Core line object
  const coreLineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    // For square: multiple segments for crackle. For others: 2 points.
    const numPoints = beamType === 'square' ? 10 : 2
    const verts = new Float32Array(numPoints * 3)
    geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    const mat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geom, mat)
  }, [beamType])

  // Glow line object (wider, lower opacity)
  const glowLineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const numPoints = beamType === 'square' ? 10 : 2
    const verts = new Float32Array(numPoints * 3)
    geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    const mat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1, // WebGL doesn't support linewidth > 1, but we keep this for completeness
    })
    return new THREE.Line(geom, mat)
  }, [beamType])

  // Shimmer point (travelling light particle)
  const shimmerObj = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.025, 8, 8)
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Mesh(geom, mat)
  }, [])

  // Set colours
  useEffect(() => {
    ;(coreLineObj.material as THREE.LineBasicMaterial).color.set(style.color)
    ;(glowLineObj.material as THREE.LineBasicMaterial).color.set(style.glowColor)
    ;(shimmerObj.material as THREE.MeshBasicMaterial).color.set('#FFFFFF')
  }, [style, coreLineObj, glowLineObj, shimmerObj])

  // Store refs
  useEffect(() => {
    coreRef.current = coreLineObj
    glowRef.current = glowLineObj
    shimmerRef.current = shimmerObj
  }, [coreLineObj, glowLineObj, shimmerObj])

  useFrame((_, delta) => {
    if (!positions) return
    elapsed.current += delta

    // Draw animation: 0→1 over drawDuration
    const durationSec = aspectLine.drawDuration / 1000
    if (aspectLine.animateDrawing && progressRef.current < 1) {
      progressRef.current = Math.min(progressRef.current + delta / durationSec, 1)
    } else if (!aspectLine.animateDrawing) {
      progressRef.current = 1
    }

    const p = progressRef.current

    // --- Update core line geometry ---
    if (coreRef.current) {
      const geo = coreRef.current.geometry as THREE.BufferGeometry
      const arr = geo.attributes.position.array as Float32Array

      if (beamType === 'square') {
        // Square: jagged crackle with multiple segments
        crackleTimer.current += delta
        if (crackleTimer.current > 0.18) {
          crackleTimer.current = 0
          // Regenerate random perpendicular offsets
          for (let i = 0; i < crackleOffsets.current.length; i++) {
            crackleOffsets.current[i] = (Math.random() - 0.5) * 0.06
          }
        }

        const dir = positions.to.clone().sub(positions.from)
        const perp = new THREE.Vector3(-dir.z, 0, dir.x).normalize()
        const numSegments = 10
        for (let i = 0; i < numSegments; i++) {
          const t = i / (numSegments - 1)
          const drawT = Math.min(t, p)
          const pt = positions.from.clone().lerp(positions.to, drawT)
          // Add perpendicular jitter (not at endpoints)
          if (i > 0 && i < numSegments - 1 && t <= p) {
            const offsetIdx = i % crackleOffsets.current.length
            pt.add(perp.clone().multiplyScalar(crackleOffsets.current[offsetIdx]))
          }
          arr[i * 3] = pt.x
          arr[i * 3 + 1] = pt.y + 0.02
          arr[i * 3 + 2] = pt.z
        }
      } else {
        // Standard: straight line from A to B
        const endPoint = positions.from.clone().lerp(positions.to, p)
        arr[0] = positions.from.x
        arr[1] = positions.from.y + 0.02
        arr[2] = positions.from.z
        arr[3] = endPoint.x
        arr[4] = endPoint.y + 0.02
        arr[5] = endPoint.z
      }
      geo.attributes.position.needsUpdate = true

      // Opacity with oscillation during idle
      const coreMat = coreRef.current.material as THREE.LineBasicMaterial
      const baseOpacity = style.coreOpacity * p * fadeRef.current
      const idleOsc = p >= 1 ? (0.8 + Math.sin(elapsed.current * Math.PI) * 0.2) : 1

      if (beamType === 'square') {
        // Flicker effect for square
        const flicker = 0.7 + Math.random() * 0.3
        coreMat.opacity = baseOpacity * flicker
      } else {
        coreMat.opacity = baseOpacity * idleOsc
      }
    }

    // --- Update glow line geometry (mirrors core) ---
    if (glowRef.current) {
      const geo = glowRef.current.geometry as THREE.BufferGeometry
      const coreGeo = coreRef.current?.geometry as THREE.BufferGeometry
      if (coreGeo) {
        const coreArr = coreGeo.attributes.position.array as Float32Array
        const glowArr = geo.attributes.position.array as Float32Array
        for (let i = 0; i < glowArr.length; i++) {
          glowArr[i] = coreArr[i]
        }
        geo.attributes.position.needsUpdate = true
      }

      const glowMat = glowRef.current.material as THREE.LineBasicMaterial
      const baseGlowOpacity = style.glowOpacity * p * fadeRef.current
      if (beamType === 'square') {
        // Irregular glow for square
        const glowFlicker = 0.1 + Math.random() * 0.2
        glowMat.opacity = baseGlowOpacity * glowFlicker / style.glowOpacity * style.glowOpacity
      } else {
        const glowOsc = p >= 1 ? (0.6 + Math.sin(elapsed.current * Math.PI * 1.1) * 0.4) : 1
        glowMat.opacity = baseGlowOpacity * glowOsc
      }
    }

    // --- Update shimmer particle ---
    if (shimmerRef.current && p >= 1 && style.shimmerSpeed > 0) {
      const shimmerMat = shimmerRef.current.material as THREE.MeshBasicMaterial

      if (beamType === 'opposition') {
        // Opposition: TWO particles travelling from opposite ends, meeting in middle
        // We simulate one particle for the primary, and use opacity modulation for dual feel
        const cycleT = (elapsed.current * style.shimmerSpeed) % 1
        // Particle goes from 0→0.5 then 0.5→0, creating a ping-pong to centre
        const particleT = cycleT < 0.5 ? cycleT * 2 : (1 - cycleT) * 2
        const shimmerPos = positions.from.clone().lerp(positions.to, particleT * 0.5)
        shimmerRef.current.position.set(shimmerPos.x, shimmerPos.y + 0.02, shimmerPos.z)
        shimmerMat.opacity = 0.6 * fadeRef.current
        shimmerMat.color.set(style.color)
      } else {
        // Standard oscillating shimmer
        const shimmerT = (Math.sin(elapsed.current * style.shimmerSpeed * Math.PI * 2) + 1) / 2
        const shimmerPos = positions.from.clone().lerp(positions.to, shimmerT)
        shimmerRef.current.position.set(shimmerPos.x, shimmerPos.y + 0.02, shimmerPos.z)
        shimmerMat.opacity = 0.5 * fadeRef.current
        shimmerMat.color.set('#FFFFFF')
      }
    } else if (shimmerRef.current) {
      ;(shimmerRef.current.material as THREE.MeshBasicMaterial).opacity = 0
    }
  })

  if (!positions) return null

  return (
    <group>
      <primitive object={coreLineObj} />
      <primitive object={glowLineObj} />
      <primitive object={shimmerObj} />
      {/* Opposition second shimmer particle (from the other end) */}
      {beamType === 'opposition' && (
        <OppositionSecondShimmer positions={positions} elapsed={elapsed} style={style} fadeRef={fadeRef} progressRef={progressRef} />
      )}
      {/* Trine gradient effect: second glow line in gold */}
      {beamType === 'trine' && (
        <TrineGradientGlow positions={positions} progressRef={progressRef} fadeRef={fadeRef} elapsed={elapsed} />
      )}
    </group>
  )
}

// Opposition: second shimmer particle from the opposite end
function OppositionSecondShimmer({ positions, elapsed, style, fadeRef, progressRef }: {
  positions: { from: THREE.Vector3; to: THREE.Vector3 }
  elapsed: React.MutableRefObject<number>
  style: BeamStyle
  fadeRef: React.MutableRefObject<number>
  progressRef: React.MutableRefObject<number>
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    if (!ref.current || progressRef.current < 1) {
      if (ref.current) (ref.current.material as THREE.MeshBasicMaterial).opacity = 0
      return
    }

    const cycleT = (elapsed.current * style.shimmerSpeed) % 1
    // Second particle goes from 1→0.5 then 0.5→1 (opposite of first)
    const particleT = cycleT < 0.5 ? 1 - cycleT * 2 : 0.5 + (cycleT - 0.5) * 2
    const pos = positions.from.clone().lerp(positions.to, 0.5 + particleT * 0.5)
    ref.current.position.set(pos.x, pos.y + 0.02, pos.z)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * fadeRef.current
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial
        color={style.glowColor}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

// Trine: second glow line in gold for gradient effect
function TrineGradientGlow({ positions, progressRef, fadeRef, elapsed }: {
  positions: { from: THREE.Vector3; to: THREE.Vector3 }
  progressRef: React.MutableRefObject<number>
  fadeRef: React.MutableRefObject<number>
  elapsed: React.MutableRefObject<number>
}) {
  const ref = useRef<THREE.Line>(null!)

  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const verts = new Float32Array(6)
    geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    const mat = new THREE.LineBasicMaterial({
      color: '#FFD700',
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geom, mat)
  }, [])

  useEffect(() => {
    ref.current = lineObj
  }, [lineObj])

  useFrame(() => {
    if (!ref.current) return
    const p = progressRef.current
    const geo = ref.current.geometry as THREE.BufferGeometry
    const arr = geo.attributes.position.array as Float32Array
    const endPoint = positions.from.clone().lerp(positions.to, p)
    arr[0] = positions.from.x
    arr[1] = positions.from.y + 0.02
    arr[2] = positions.from.z
    arr[3] = endPoint.x
    arr[4] = endPoint.y + 0.02
    arr[5] = endPoint.z
    geo.attributes.position.needsUpdate = true

    const mat = ref.current.material as THREE.LineBasicMaterial
    const osc = p >= 1 ? (0.6 + Math.sin(elapsed.current * Math.PI * 0.8 + 1) * 0.4) : 1
    mat.opacity = 0.15 * p * fadeRef.current * osc
  })

  return <primitive object={lineObj} />
}
