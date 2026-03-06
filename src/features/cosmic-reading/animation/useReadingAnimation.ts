import { useMemo } from 'react'
import { useReadingContext } from '../ReadingContext'
import type { CelestialBodyId } from '../types'

export interface ReadingAnimationState {
  isActive: boolean
  highlights: Map<CelestialBodyId, {
    effect: 'pulse' | 'glow' | 'enlarge'
    color?: string
    intensity: number
  }>
  dimOpacity: number
  cameraTarget: CelestialBodyId | null
  cameraZoom: number
  cameraTransitionMs: number
  aspectLine: {
    from: CelestialBodyId
    to: CelestialBodyId
    color: string
    style: 'solid' | 'dashed'
    animateDrawing: boolean
    drawDuration: number
  } | null
}

export function useReadingAnimation(): ReadingAnimationState {
  const { isReadingActive, currentPhase } = useReadingContext()

  return useMemo(() => {
    if (!isReadingActive || !currentPhase?.animation) {
      return {
        isActive: false,
        highlights: new Map(),
        dimOpacity: 1,
        cameraTarget: null,
        cameraZoom: 1,
        cameraTransitionMs: 1500,
        aspectLine: null,
      }
    }

    const anim = currentPhase.animation
    const highlights = new Map<CelestialBodyId, { effect: 'pulse' | 'glow' | 'enlarge'; color?: string; intensity: number }>()

    if (anim.highlights) {
      for (const h of anim.highlights) {
        highlights.set(h.bodyId, {
          effect: h.effect,
          color: h.color,
          intensity: h.intensity ?? 0.8,
        })
      }
    }

    return {
      isActive: true,
      highlights,
      dimOpacity: anim.dimOthers !== false ? 0.3 : 1,
      cameraTarget: anim.camera?.target ?? null,
      cameraZoom: anim.camera?.zoom ?? 1,
      cameraTransitionMs: anim.camera?.transitionDuration ?? 1500,
      aspectLine: anim.aspectLine ? {
        from: anim.aspectLine.from,
        to: anim.aspectLine.to,
        color: anim.aspectLine.color,
        style: anim.aspectLine.style,
        animateDrawing: anim.aspectLine.animateDrawing,
        drawDuration: anim.aspectLine.drawDuration ?? 1000,
      } : null,
    }
  }, [isReadingActive, currentPhase])
}

/** Serialise ReadingAnimationState to plain props for passing into the R3F Canvas */
export function serializeAnimationState(state: ReadingAnimationState): SerializedReadingAnimation {
  return {
    isActive: state.isActive,
    highlights: Array.from(state.highlights.entries()).map(([bodyId, h]) => ({
      bodyId,
      effect: h.effect,
      color: h.color,
      intensity: h.intensity,
    })),
    dimOpacity: state.dimOpacity,
    cameraTarget: state.cameraTarget,
    cameraZoom: state.cameraZoom,
    cameraTransitionMs: state.cameraTransitionMs,
    aspectLine: state.aspectLine,
  }
}

export interface SerializedReadingAnimation {
  isActive: boolean
  highlights: Array<{
    bodyId: string
    effect: 'pulse' | 'glow' | 'enlarge'
    color?: string
    intensity: number
  }>
  dimOpacity: number
  cameraTarget: string | null
  cameraZoom: number
  cameraTransitionMs: number
  aspectLine: {
    from: string
    to: string
    color: string
    style: 'solid' | 'dashed'
    animateDrawing: boolean
    drawDuration: number
  } | null
  onAnimationComplete?: () => void
}
