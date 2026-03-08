'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

// Match AstroWheel3D positioning
const R_PLANET = 1.5
const CRYSTAL_Y = 1.6
const CURVE_POINTS = 48

function longitudeToPosition(longitude: number, radius: number): [number, number, number] {
  const rad = (longitude - 90) * (Math.PI / 180)
  return [Math.cos(rad) * radius, 0, Math.sin(rad) * radius]
}

export interface ConnectionTarget {
  planetId: string
  type: 'key' | 'aspect'
}

interface EnergyLinksProps {
  planets: PlanetPosition[]
  connectionTargets: ConnectionTarget[]
  readingActive: boolean
  entranceComplete: boolean
  viewMode: 'geocentric' | 'heliocentric'
}

interface LinkState {
  line: THREE.Line
  mat: THREE.LineDashedMaterial
  geom: THREE.BufferGeometry
  targetId: string
  type: 'key' | 'aspect'
  // Lifecycle
  drawProgress: number // 0→1 draw-in
  opacity: number
  fadingOut: boolean
  age: number
}

function makeCurve(
  start: THREE.Vector3,
  end: THREE.Vector3,
): THREE.QuadraticBezierCurve3 {
  const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  // Offset control point outward from wheel centre
  const outward = new THREE.Vector3(end.x, 0, end.z).normalize()
  const controlPoint = midpoint.clone()
  controlPoint.add(outward.multiplyScalar(0.3))
  controlPoint.y = (start.y + end.y) / 2 + 0.2
  return new THREE.QuadraticBezierCurve3(start, controlPoint, end)
}

function buildLinkGeometry(
  planetLongitude: number,
  crystalY: number,
): THREE.BufferGeometry {
  const start = new THREE.Vector3(0, crystalY, 0)
  const [ex, ey, ez] = longitudeToPosition(planetLongitude, R_PLANET)
  const end = new THREE.Vector3(ex, ey, ez)
  const curve = makeCurve(start, end)
  const points = curve.getPoints(CURVE_POINTS)
  return new THREE.BufferGeometry().setFromPoints(points)
}

// computeLineDistances must be called on the Line object, not the geometry
function computeDashes(line: THREE.Line) {
  line.computeLineDistances()
}

const MAX_LINKS = 3

export default function EnergyLinks({
  planets,
  connectionTargets,
  readingActive,
  entranceComplete,
  viewMode,
}: EnergyLinksProps) {
  const groupRef = useRef<THREE.Group>(null)
  const linksRef = useRef<LinkState[]>([])
  const prevTargetsRef = useRef<string>('')
  const rebuildCounterRef = useRef(0)
  const isGeo = viewMode === 'geocentric'
  const helioFadeRef = useRef(isGeo ? 1 : 0)

  // Pool of link objects (max 3)
  const linkPool = useMemo(() => {
    return Array.from({ length: MAX_LINKS }, () => {
      const geom = new THREE.BufferGeometry()
      const mat = new THREE.LineDashedMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        dashSize: 0.04,
        gapSize: 0.03,
        blending: THREE.AdditiveBlending,
      })
      mat.depthWrite = false
      const line = new THREE.Line(geom, mat)
      line.visible = false
      return { line, mat, geom }
    })
  }, [])

  // Cleanup
  useEffect(() => () => {
    linkPool.forEach(({ geom, mat }) => {
      geom.dispose()
      mat.dispose()
    })
  }, [linkPool])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // Helio fade
    helioFadeRef.current += ((isGeo ? 1 : 0) - helioFadeRef.current) * Math.min(delta * 4, 0.2)
    const helioVis = helioFadeRef.current

    if (!entranceComplete || helioVis < 0.01) {
      linkPool.forEach(l => { l.line.visible = false })
      return
    }

    const readingDim = readingActive ? 0.5 : 1
    const currentTargetKey = connectionTargets.map(t => t.planetId).join(',')

    // Detect target change — trigger fade out / rebuild
    if (currentTargetKey !== prevTargetsRef.current) {
      // Mark existing links as fading out
      linksRef.current.forEach(l => { l.fadingOut = true })
      prevTargetsRef.current = currentTargetKey
    }

    // Remove fully faded links
    linksRef.current = linksRef.current.filter(l => {
      if (l.fadingOut && l.opacity <= 0.01) {
        // Find pool index and hide
        const poolIdx = linkPool.findIndex(p => p.line === l.line)
        if (poolIdx >= 0) linkPool[poolIdx].line.visible = false
        return false
      }
      return true
    })

    // Spawn new links for targets that don't have active (non-fading) links
    const activeLinkIds = new Set(linksRef.current.filter(l => !l.fadingOut).map(l => l.targetId))
    connectionTargets.forEach((target, i) => {
      if (activeLinkIds.has(target.planetId)) return
      // Find a free pool slot
      const usedLines = new Set(linksRef.current.map(l => l.line))
      const freeSlot = linkPool.find(p => !usedLines.has(p.line))
      if (!freeSlot) return

      const planet = planets.find(p => p.id === target.planetId)
      if (!planet) return

      // Build initial geometry
      const newGeom = buildLinkGeometry(planet.eclipticLongitude, CRYSTAL_Y)
      freeSlot.geom.dispose()
      freeSlot.line.geometry = newGeom
      computeDashes(freeSlot.line)
      freeSlot.geom = newGeom as any // keep reference for disposal

      const colour = new THREE.Color(planet.colour)
      freeSlot.mat.color = colour
      freeSlot.mat.opacity = 0
      ;(freeSlot.mat as any).dashOffset = 0
      freeSlot.line.visible = true

      linksRef.current.push({
        line: freeSlot.line,
        mat: freeSlot.mat,
        geom: newGeom,
        targetId: target.planetId,
        type: target.type,
        drawProgress: 0,
        opacity: 0,
        fadingOut: false,
        age: -i * 0.3, // stagger by 300ms
      })
    })

    // Update each active link
    rebuildCounterRef.current++
    const shouldRebuild = rebuildCounterRef.current % 10 === 0

    linksRef.current.forEach((link) => {
      link.age += delta
      if (link.age < 0) {
        // Waiting for stagger
        link.line.visible = false
        return
      }
      link.line.visible = true

      const planet = planets.find(p => p.id === link.targetId)
      if (!planet) return

      // Rebuild geometry periodically to track rotating planets
      if (shouldRebuild && !link.fadingOut) {
        const newGeom = buildLinkGeometry(planet.eclipticLongitude, CRYSTAL_Y)
        link.geom.dispose()
        link.line.geometry = newGeom
        computeDashes(link.line)
        link.geom = newGeom
        // Find pool slot and update geom reference
        const poolSlot = linkPool.find(p => p.line === link.line)
        if (poolSlot) (poolSlot as any).geom = newGeom
      }

      // Draw-in animation (0→1 over 1 second)
      if (!link.fadingOut && link.drawProgress < 1) {
        link.drawProgress = Math.min(link.drawProgress + delta, 1)
        const vertexCount = Math.floor(link.drawProgress * (CURVE_POINTS + 1))
        link.geom.setDrawRange(0, vertexCount)
      } else if (!link.fadingOut) {
        link.geom.setDrawRange(0, CURVE_POINTS + 1)
      }

      // Opacity
      const baseOpacity = link.type === 'key' ? 0.25 : 0.15
      const pulse = 0.8 + 0.2 * Math.sin(time * 1.5 + linksRef.current.indexOf(link))

      if (link.fadingOut) {
        link.opacity = Math.max(0, link.opacity - delta / 0.6) // fade over 600ms
      } else {
        // Fade in with draw progress
        link.opacity = Math.min(link.opacity + delta / 1.0, baseOpacity * pulse)
      }

      link.mat.opacity = link.opacity * readingDim * helioVis

      // Dash flow animation — energy flows from mother shape toward planet
      ;(link.mat as any).dashOffset -= delta * 0.4
    })
  })

  return (
    <group ref={groupRef}>
      {linkPool.map((poolItem, i) => (
        <primitive key={i} object={poolItem.line} />
      ))}
    </group>
  )
}
