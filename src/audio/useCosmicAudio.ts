'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { CosmicAudioEngine } from './CosmicAudioEngine'
import { getBinauralPreset } from './frequencies'
import type { PlanetPosition } from '@/lib/astronomy'

export function useCosmicAudio(planets: PlanetPosition[], moonSign: string) {
  const engineRef = useRef<CosmicAudioEngine | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [wantsAudio, setWantsAudio] = useState(false)

  // Restore preference (but don't auto-play — browsers block it)
  useEffect(() => {
    const saved = localStorage.getItem('astrara-audio')
    if (saved === 'on') setWantsAudio(true)
  }, [])

  const toggle = useCallback(async () => {
    if (!engineRef.current) {
      engineRef.current = new CosmicAudioEngine()
    }

    if (isPlaying) {
      engineRef.current.stop()
      setIsPlaying(false)
      setWantsAudio(false)
      localStorage.setItem('astrara-audio', 'off')
    } else {
      const preset = getBinauralPreset(planets)
      await engineRef.current.start(moonSign, preset)
      setIsPlaying(true)
      setWantsAudio(true)
      localStorage.setItem('astrara-audio', 'on')
    }
  }, [isPlaying, planets, moonSign])

  const onPlanetTap = useCallback((planetName: string) => {
    engineRef.current?.onPlanetTap(planetName)
  }, [])

  const onSignTap = useCallback((signKey: string) => {
    engineRef.current?.onSignTap(signKey)
  }, [])

  const startRotationSound = useCallback(async () => {
    if (!engineRef.current) {
      engineRef.current = new CosmicAudioEngine()
    }
    await engineRef.current.startRotationSound()
  }, [])

  const stopRotationSound = useCallback(() => {
    engineRef.current?.stopRotationSound()
  }, [])

  const updateRotationVelocity = useCallback((velocity: number) => {
    engineRef.current?.updateRotationVelocity(velocity)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.stop()
      engineRef.current?.stopRotationSound()
    }
  }, [])

  // Update audio when Moon sign / day changes
  useEffect(() => {
    if (isPlaying && engineRef.current) {
      const preset = getBinauralPreset(planets)
      engineRef.current.updateConfiguration(moonSign, preset)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moonSign])

  return { isPlaying, wantsAudio, toggle, onPlanetTap, onSignTap, startRotationSound, stopRotationSound, updateRotationVelocity }
}
