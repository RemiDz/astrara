import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

const R_PLANET = 1.5
const LERP_SPEED = 0.03

function longitudeToPos(longitude: number, radius: number): THREE.Vector3 {
  const rad = (longitude - 90) * (Math.PI / 180)
  return new THREE.Vector3(Math.cos(rad) * radius, 0, Math.sin(rad) * radius)
}

interface ReadingCameraControllerProps {
  isActive: boolean
  target: string | null
  zoom: number
  planets: PlanetPosition[]
  controlsRef: React.MutableRefObject<any>
  onComplete?: () => void
}

export default function ReadingCameraController({
  isActive,
  target,
  zoom,
  planets,
  controlsRef,
  onComplete,
}: ReadingCameraControllerProps) {
  const { camera } = useThree()
  const hasCompletedRef = useRef(false)
  const prevTargetRef = useRef<string | null>(null)
  const savedCameraPos = useRef<THREE.Vector3 | null>(null)
  const savedControlsTarget = useRef<THREE.Vector3 | null>(null)
  const wasActive = useRef(false)
  const restoring = useRef(false)
  const noTargetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Detect target change → reset completion guard
  if (isActive && target !== prevTargetRef.current) {
    prevTargetRef.current = target
    hasCompletedRef.current = false

    // Clear any pending no-target timer
    if (noTargetTimerRef.current) {
      clearTimeout(noTargetTimerRef.current)
      noTargetTimerRef.current = null
    }

    // For phases without a camera target, fire onComplete after a delay
    if (!target) {
      noTargetTimerRef.current = setTimeout(() => {
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true
          onComplete?.()
        }
      }, 800)
    }
  }

  useFrame(() => {
    if (!controlsRef.current) return

    // ENTRY: reading just started
    if (isActive && !wasActive.current) {
      wasActive.current = true
      restoring.current = false
      savedCameraPos.current = camera.position.clone()
      savedControlsTarget.current = controlsRef.current.target.clone()
      controlsRef.current.enabled = false
      controlsRef.current.autoRotate = false
    }

    // EXIT: reading just ended — begin restore
    if (!isActive && wasActive.current && !restoring.current) {
      restoring.current = true
      prevTargetRef.current = null
      // Clear any pending timer
      if (noTargetTimerRef.current) {
        clearTimeout(noTargetTimerRef.current)
        noTargetTimerRef.current = null
      }
    }

    // RESTORING: lerp back to saved position
    if (restoring.current && savedCameraPos.current) {
      camera.position.lerp(savedCameraPos.current, 0.05)
      camera.lookAt(savedControlsTarget.current ?? new THREE.Vector3(0, 0, 0))

      const dist = camera.position.distanceTo(savedCameraPos.current)
      if (dist < 0.05) {
        camera.position.copy(savedCameraPos.current)
        if (savedControlsTarget.current) {
          controlsRef.current.target.copy(savedControlsTarget.current)
        }
        controlsRef.current.enabled = true
        controlsRef.current.update()
        wasActive.current = false
        restoring.current = false
        savedCameraPos.current = null
        savedControlsTarget.current = null
      }
      return // Don't do anything else while restoring
    }

    // IDLE: when not active and not restoring, do absolutely nothing
    if (!isActive) return

    // ACTIVE: lerp to target planet position
    if (target) {
      const planet = planets.find(p => p.id === target)
      if (!planet) return

      const planetPos = longitudeToPos(planet.eclipticLongitude, R_PLANET)

      // Calculate target camera position:
      // Keep roughly the same viewing angle, shift slightly toward planet, apply gentle zoom
      const currentDist = camera.position.length() || 7
      const zoomDist = currentDist / zoom

      // Shift camera toward the planet's angular position (subtle offset)
      const offsetX = planetPos.x * 0.2
      const offsetZ = planetPos.z * 0.2
      const targetCamPos = new THREE.Vector3(
        offsetX,
        savedCameraPos.current?.y ?? 1.5,
        zoomDist + offsetZ * 0.08,
      )

      camera.position.lerp(targetCamPos, LERP_SPEED)

      // Look toward a point slightly shifted toward the planet
      const lookTarget = new THREE.Vector3(planetPos.x * 0.25, 0, planetPos.z * 0.25)
      camera.lookAt(lookTarget)

      // Check if we've reached the target
      if (!hasCompletedRef.current) {
        const dist = camera.position.distanceTo(targetCamPos)
        if (dist < 0.1) {
          hasCompletedRef.current = true
          onComplete?.()
        }
      }
    }
  })

  return null
}
