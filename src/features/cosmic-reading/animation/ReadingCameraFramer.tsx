'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface Props {
  isActive: boolean
}

// During reading, reposition camera to frame the wheel higher in view
// This eliminates the empty black space above the wheel
const READING_CAMERA_POS = new THREE.Vector3(0, 0.5, 6.2)
const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 1.5, 7)

export default function ReadingCameraFramer({ isActive }: Props) {
  const { camera } = useThree()
  const savedPos = useRef<THREE.Vector3 | null>(null)
  const wasActive = useRef(false)

  useFrame(() => {
    // Just started reading — save current camera position
    if (isActive && !wasActive.current) {
      wasActive.current = true
      savedPos.current = camera.position.clone()
    }

    // Just stopped reading — begin restoring
    if (!isActive && wasActive.current) {
      const target = savedPos.current || DEFAULT_CAMERA_POS
      camera.position.lerp(target, 0.06)
      if (camera.position.distanceTo(target) < 0.05) {
        camera.position.copy(target)
        wasActive.current = false
        savedPos.current = null
      }
      return
    }

    // During reading — lerp toward the tighter framing position
    if (isActive) {
      camera.position.lerp(READING_CAMERA_POS, 0.04)
    }
  })

  return null
}
