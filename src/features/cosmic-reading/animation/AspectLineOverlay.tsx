import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

const R_PLANET = 1.5

function longitudeToPos(longitude: number, radius: number): THREE.Vector3 {
  const rad = (longitude - 90) * (Math.PI / 180)
  return new THREE.Vector3(Math.cos(rad) * radius, 0, Math.sin(rad) * radius)
}

interface AspectLineDef {
  from: string
  to: string
  color: string
  style: 'solid' | 'dashed'
  animateDrawing: boolean
  drawDuration: number
}

interface AspectLineOverlayProps {
  aspectLine: AspectLineDef | null
  planets: PlanetPosition[]
}

export default function AspectLineOverlay({ aspectLine, planets }: AspectLineOverlayProps) {
  const lineRef = useRef<THREE.Line>(null!)
  const progressRef = useRef(0)
  const fadeRef = useRef(0)

  const positions = useMemo(() => {
    if (!aspectLine) return null
    const fromPlanet = planets.find(p => p.id === aspectLine.from)
    const toPlanet = planets.find(p => p.id === aspectLine.to)
    if (!fromPlanet || !toPlanet) return null
    return {
      from: longitudeToPos(fromPlanet.eclipticLongitude, R_PLANET),
      to: longitudeToPos(toPlanet.eclipticLongitude, R_PLANET),
    }
  }, [aspectLine, planets])

  // Reset progress when aspect line changes
  const prevKey = useRef('')
  const currentKey = aspectLine ? `${aspectLine.from}-${aspectLine.to}` : ''
  if (currentKey !== prevKey.current) {
    prevKey.current = currentKey
    progressRef.current = 0
    fadeRef.current = 0
  }

  useFrame((_, delta) => {
    if (!lineRef.current || !positions || !aspectLine) return

    const durationSec = aspectLine.drawDuration / 1000
    if (aspectLine.animateDrawing) {
      progressRef.current = Math.min(progressRef.current + delta / durationSec, 1)
    } else {
      fadeRef.current = Math.min(fadeRef.current + delta * 1.6, 1)
    }

    // Update line geometry
    const geo = lineRef.current.geometry as THREE.BufferGeometry
    const p = aspectLine.animateDrawing ? progressRef.current : 1
    const endPoint = positions.from.clone().lerp(positions.to, p)
    const arr = geo.attributes.position.array as Float32Array
    arr[0] = positions.from.x
    arr[1] = positions.from.y + 0.02
    arr[2] = positions.from.z
    arr[3] = endPoint.x
    arr[4] = endPoint.y + 0.02
    arr[5] = endPoint.z
    geo.attributes.position.needsUpdate = true

    // Update opacity
    const mat = lineRef.current.material as THREE.LineBasicMaterial
    const targetOpacity = aspectLine.animateDrawing ? progressRef.current * 0.6 : fadeRef.current * 0.6
    mat.opacity = targetOpacity
  })

  // Build the Line object imperatively to avoid JSX <line> → SVG conflict
  const lineObj = useMemo(() => {
    const geom = new THREE.BufferGeometry()
    const verts = new Float32Array(6) // two xyz points
    geom.setAttribute('position', new THREE.BufferAttribute(verts, 3))
    const mat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    return new THREE.Line(geom, mat)
  }, [])

  // Update colour when aspectLine changes
  useEffect(() => {
    if (aspectLine) {
      ;(lineObj.material as THREE.LineBasicMaterial).color.set(aspectLine.color)
    }
  }, [aspectLine, lineObj])

  // Store lineObj in ref for useFrame
  useEffect(() => {
    lineRef.current = lineObj
  }, [lineObj])

  if (!aspectLine || !positions) return null

  return <primitive object={lineObj} />
}
