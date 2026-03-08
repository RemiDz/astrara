'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

const R_PLANET = 1.5
const CURVE_DIVISIONS = 64 // getPoints(64) → 65 vertices

function longitudeToPos(longitude: number, radius: number): THREE.Vector3 {
  const rad = (longitude - 90) * (Math.PI / 180)
  return new THREE.Vector3(Math.cos(rad) * radius, 0, Math.sin(rad) * radius)
}

// Colour mapping by aspect type
const ARC_COLORS: Record<string, string> = {
  conjunction: '#E8D44D', // gold/yellow — fusion, intensity
  sextile:    '#4DCCB0', // teal/soft green — opportunity, harmony
  square:     '#E85D4D', // warm red — tension, challenge
  trine:      '#4D8DE8', // soft blue — flow, grace
  opposition: '#B04DE8', // purple — polarity, awareness
  quincunx:   '#E8A94D', // amber — adjustment, mystery
}

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
  const coreRef = useRef<THREE.Line>(null!)
  const glowRef = useRef<THREE.Line>(null!)
  const elapsedRef = useRef(0)
  const drawRef = useRef(0)
  const canGlow = useRef(true)

  // Skip glow on low-end hardware
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency < 4) {
      canGlow.current = false
    }
  }, [])

  const arcColor = ARC_COLORS[aspectType] ?? '#FFFFFF'

  // Planet world positions
  const positions = useMemo(() => {
    const fromP = planets.find(p => p.id === aspectLine.from)
    const toP = planets.find(p => p.id === aspectLine.to)
    if (!fromP || !toP) return null
    return {
      from: longitudeToPos(fromP.eclipticLongitude, R_PLANET),
      to: longitudeToPos(toP.eclipticLongitude, R_PLANET),
    }
  }, [aspectLine.from, aspectLine.to, planets])

  // Build Bézier curve points
  const curvePoints = useMemo(() => {
    if (!positions) return null
    const { from, to } = positions
    // Slight Y offset to avoid Z-fighting with wheel plane
    const a = from.clone(); a.y = 0.02
    const b = to.clone(); b.y = 0.02
    const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
    const distance = a.distanceTo(b)
    const controlPoint = midpoint.clone()
    controlPoint.y += Math.max(distance * 0.3, 0.12)

    const curve = new THREE.QuadraticBezierCurve3(a, controlPoint, b)
    return curve.getPoints(CURVE_DIVISIONS)
  }, [positions])

  const totalVerts = curvePoints ? curvePoints.length : 0

  // Core line — dashed material
  const coreObj = useMemo(() => {
    if (!curvePoints) return null
    const geom = new THREE.BufferGeometry().setFromPoints(curvePoints)
    geom.setDrawRange(0, 0) // hidden initially
    const mat = new THREE.LineDashedMaterial({
      color: arcColor,
      dashSize: 0.06,
      gapSize: 0.04,
      linewidth: 1,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geom, mat)
    line.computeLineDistances() // REQUIRED for LineDashedMaterial — must be on Line, not geometry
    return line
  }, [curvePoints, arcColor])

  // Glow line — soft undashed layer behind the core
  const glowObj = useMemo(() => {
    if (!curvePoints) return null
    const geom = new THREE.BufferGeometry().setFromPoints(curvePoints)
    geom.setDrawRange(0, 0)
    const mat = new THREE.LineBasicMaterial({
      color: arcColor,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geom, mat)
  }, [curvePoints, arcColor])

  // Assign refs when objects change
  useEffect(() => {
    if (coreObj) coreRef.current = coreObj
    if (glowObj) glowRef.current = glowObj
  }, [coreObj, glowObj])

  // Reset animation on aspect pair change
  const prevKey = useRef('')
  const key = `${aspectLine.from}-${aspectLine.to}`
  if (key !== prevKey.current) {
    prevKey.current = key
    elapsedRef.current = 0
    drawRef.current = 0
  }

  // Dispose geometry + materials on unmount or rebuild
  useEffect(() => {
    return () => {
      if (coreObj) {
        coreObj.geometry.dispose()
        ;(coreObj.material as THREE.Material).dispose()
      }
      if (glowObj) {
        glowObj.geometry.dispose()
        ;(glowObj.material as THREE.Material).dispose()
      }
    }
  }, [coreObj, glowObj])

  useFrame((_, delta) => {
    if (!coreRef.current || totalVerts === 0) return
    elapsedRef.current += delta
    const elapsed = elapsedRef.current
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coreMat = coreRef.current.material as any
    const coreGeo = coreRef.current.geometry

    // === Step 1: Draw-in (0 → 800ms, ease-out) ===
    if (drawRef.current < 1) {
      drawRef.current = Math.min(drawRef.current + delta / 0.8, 1)
      const t = drawRef.current
      const eased = t * (2 - t) // ease-out
      const count = Math.round(eased * totalVerts)

      coreGeo.setDrawRange(0, count)
      // Opacity fades 0→1 over first 400ms
      const fadeT = Math.min(elapsed / 0.4, 1)
      coreMat.opacity = fadeT

      if (glowRef.current) {
        glowRef.current.geometry.setDrawRange(0, count)
        ;(glowRef.current.material as THREE.LineBasicMaterial).opacity = fadeT * 0.15
      }
      return
    }

    // === Step 2: Energy Flow (continuous after draw-in) ===
    coreGeo.setDrawRange(0, totalVerts)
    // Animate dash offset — dashes travel along the curve
    coreMat.dashOffset -= delta * 0.5
    // Subtle opacity pulse
    const pulse = 0.7 + 0.3 * Math.sin(elapsed * 2.0)
    coreMat.opacity = pulse

    if (glowRef.current) {
      glowRef.current.geometry.setDrawRange(0, totalVerts)
      ;(glowRef.current.material as THREE.LineBasicMaterial).opacity = pulse * 0.15
    }
  })

  if (!coreObj) return null

  return (
    <group>
      <primitive object={coreObj} />
      {canGlow.current && glowObj && <primitive object={glowObj} />}
    </group>
  )
}
