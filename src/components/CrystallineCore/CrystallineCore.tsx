'use client'

import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'
import { getActiveForm, ELEMENT_COLOURS, getDominantElement, type CrystalForm, type CrystalFormOverride } from './crystalUtils'
import SeedOfLife from './SeedOfLife'
import IcosahedronForm from './IcosahedronForm'
import EnergyStreams from './EnergyStreams'

const CRYSTAL_Y = 1.4
const TRANSITION_DURATION = 2 // seconds for fade in/out

interface CrystallineCoreProps {
  planets: PlanetPosition[]
  formOverride: CrystalFormOverride
  viewMode: 'geocentric' | 'heliocentric'
  readingActive: boolean
  onCrystalTap: () => void
}

export default function CrystallineCore({
  planets,
  formOverride,
  viewMode,
  readingActive,
  onCrystalTap,
}: CrystallineCoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const tapRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef({ active: false, time: 0 })

  // Current displayed form + transition state
  const activeForm = getActiveForm(formOverride, planets)
  const [displayedForm, setDisplayedForm] = useState<CrystalForm>(activeForm)

  // Visibility for helio transitions
  const visibilityRef = useRef(viewMode === 'geocentric' ? 1 : 0)
  const isGeo = viewMode === 'geocentric'

  // Transition opacity for form switching
  const formOpacityRef = useRef(1)
  const [transitioning, setTransitioning] = useState(false)
  const pendingFormRef = useRef<CrystalForm | null>(null)

  // Handle form changes (from element change or settings)
  useEffect(() => {
    if (activeForm !== displayedForm && !transitioning) {
      pendingFormRef.current = activeForm
      setTransitioning(true)
    }
  }, [activeForm])

  // Dominant element for colour
  const dominantElement = getDominantElement(planets)
  const targetColor = useMemo(() => new THREE.Color(ELEMENT_COLOURS[dominantElement]), [dominantElement])

  const crystalPosition: [number, number, number] = [0, CRYSTAL_Y, 0]

  // Tap handler with pulse
  const handleTap = useCallback((e: any) => {
    e?.stopPropagation?.()
    pulseRef.current = { active: true, time: 0 }
    onCrystalTap()
  }, [onCrystalTap])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Visibility fade for helio
    const targetVis = isGeo ? 1 : 0
    visibilityRef.current += (targetVis - visibilityRef.current) * Math.min(delta * 3, 0.15)

    // Reading dimming
    const readingMul = readingActive ? 0.5 : 1

    const baseOpacity = visibilityRef.current * readingMul

    // Hover float
    const time = groupRef.current.userData.time ?? 0
    groupRef.current.userData.time = time + delta
    groupRef.current.position.y = CRYSTAL_Y + Math.sin(time * 0.5) * 0.03

    // Form transition
    if (transitioning) {
      formOpacityRef.current -= delta / (TRANSITION_DURATION / 2)
      if (formOpacityRef.current <= 0) {
        formOpacityRef.current = 0
        if (pendingFormRef.current) {
          setDisplayedForm(pendingFormRef.current)
          pendingFormRef.current = null
        }
        // Now fade in
        formOpacityRef.current = 0.01 // trigger fade-in path
      }
      if (formOpacityRef.current > 0 && formOpacityRef.current < 1 && !pendingFormRef.current) {
        formOpacityRef.current += delta / (TRANSITION_DURATION / 2)
        if (formOpacityRef.current >= 1) {
          formOpacityRef.current = 1
          setTransitioning(false)
        }
      }
    }

    const finalOpacity = baseOpacity * formOpacityRef.current

    // Apply to group visibility
    groupRef.current.visible = baseOpacity > 0.01

    // Tap pulse animation
    if (pulseRef.current.active) {
      pulseRef.current.time += delta
      const t = pulseRef.current.time
      if (t < 0.4) {
        const scale = 1 + 0.15 * Math.sin((t / 0.4) * Math.PI)
        groupRef.current.scale.setScalar(scale)
      } else {
        groupRef.current.scale.setScalar(1)
        pulseRef.current.active = false
      }
    }

    // Light colour
    if (lightRef.current) {
      lightRef.current.color.lerp(targetColor, delta * 2)
      lightRef.current.intensity = 0.3 * finalOpacity
    }
  })

  const formOpacity = formOpacityRef.current

  return (
    <>
      <group ref={groupRef} position={[0, CRYSTAL_Y, 0]}>
        {/* Crystal form */}
        {displayedForm === 'seed' && <SeedOfLife opacity={formOpacity} />}
        {displayedForm === 'icosa' && <IcosahedronForm opacity={formOpacity} />}

        {/* Tap target — invisible sphere */}
        <mesh
          ref={tapRef}
          onClick={handleTap}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Point light at crystal */}
        <pointLight
          ref={lightRef}
          intensity={0.3}
          distance={2}
          color={ELEMENT_COLOURS[dominantElement]}
        />
      </group>

      {/* Energy streams from planets to crystal */}
      <EnergyStreams
        planets={planets}
        crystalPosition={crystalPosition}
        opacity={visibilityRef.current * (readingActive ? 0.5 : 1)}
      />
    </>
  )
}
