import { useRef, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'

const R_PLANET = 1.5
const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 1.5, 7)
const LERP_SPEED = 0.04

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
  const noTargetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Save camera position when reading starts
  useEffect(() => {
    if (isActive && !savedCameraPos.current) {
      savedCameraPos.current = camera.position.clone()
    }
    if (!isActive) {
      savedCameraPos.current = null
    }
  }, [isActive, camera])

  // Detect target change → reset completion
  useEffect(() => {
    if (target !== prevTargetRef.current) {
      prevTargetRef.current = target
      hasCompletedRef.current = false

      // Clear any pending no-target timer
      if (noTargetTimerRef.current) {
        clearTimeout(noTargetTimerRef.current)
        noTargetTimerRef.current = null
      }

      // For phases without a camera target, fire onComplete after a delay
      if (isActive && !target) {
        noTargetTimerRef.current = setTimeout(() => {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true
            onComplete?.()
          }
        }, 800)
      }
    }
  }, [target, isActive, onComplete])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (noTargetTimerRef.current) clearTimeout(noTargetTimerRef.current)
    }
  }, [])

  useFrame(() => {
    if (!controlsRef.current) return

    if (isActive) {
      // Disable user orbit controls during reading
      controlsRef.current.enabled = false
      controlsRef.current.autoRotate = false

      if (target) {
        const planet = planets.find(p => p.id === target) as PlanetPosition | undefined
        if (!planet) return

        const planetPos = longitudeToPos(planet.eclipticLongitude, R_PLANET)

        // Calculate target camera position: shift to centre on planet, apply zoom
        const baseDist = 7
        const zoomDist = baseDist / zoom

        // Offset camera toward the planet while keeping it looking at the wheel centre
        const offsetX = planetPos.x * 0.25
        const offsetZ = planetPos.z * 0.25
        const targetCamPos = new THREE.Vector3(offsetX, 1.5, zoomDist + offsetZ * 0.1)

        camera.position.lerp(targetCamPos, LERP_SPEED)
        camera.lookAt(planetPos.x * 0.3, 0, planetPos.z * 0.3)

        // Check if we've reached the target
        if (!hasCompletedRef.current) {
          const dist = camera.position.distanceTo(targetCamPos)
          if (dist < 0.05) {
            hasCompletedRef.current = true
            onComplete?.()
          }
        }
      }
    } else {
      // Restore camera and controls
      const restorePos = savedCameraPos.current ?? DEFAULT_CAMERA_POS
      camera.position.lerp(restorePos, LERP_SPEED * 1.5)
      camera.lookAt(0, 0, 0)

      // Re-enable controls once close to default
      const dist = camera.position.distanceTo(restorePos)
      if (dist < 0.1) {
        controlsRef.current.enabled = true
      }
    }
  })

  return null
}
