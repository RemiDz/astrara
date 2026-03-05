'use client'

import React, { Component, Suspense, lazy, type ReactNode } from 'react'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import type { HelioData } from '@/lib/heliocentric'
import AstroWheel from './AstroWheel'
import Shimmer from '@/components/ui/Shimmer'

const AstroWheel3D = lazy(() => import('./AstroWheel3D'))

interface Props {
  planets: PlanetPosition[]
  aspects: AspectData[]
  onPlanetTap: (planet: PlanetPosition) => void
  onSignTap: (signId: string) => void
  onAspectTap: (aspect: AspectData) => void
  onEarthTap: () => void
  selectedPlanet: string | null
  planetScale?: number
  rotationSpeed?: number
  onRotationVelocity?: (velocity: number) => void
  kpIndex?: number | null
  solarFlareClass?: string | null
  solarFluxValue?: number | null
  viewMode?: 'geocentric' | 'heliocentric'
  isTransitioning?: boolean
  helioData?: Record<string, HelioData>
  onTransitionComplete?: () => void
  animationTimeRef?: React.MutableRefObject<number>
  animationSpeedRef?: React.MutableRefObject<number>
}

interface ErrorBoundaryState {
  hasError: boolean
}

class Wheel3DErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn('3D wheel failed, falling back to 2D:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export default function AstroWheel3DWrapper(props: Props) {
  const fallback2D = (
    <AstroWheel
      planets={props.planets}
      aspects={props.aspects}
      onPlanetTap={props.onPlanetTap}
      onSignTap={props.onSignTap}
      onAspectTap={props.onAspectTap}
      selectedPlanet={props.selectedPlanet}
    />
  )

  return (
    <Wheel3DErrorBoundary fallback={fallback2D}>
      <Suspense
        fallback={
          <div className="relative w-full flex items-center justify-center" style={{ height: '95vw', maxHeight: '550px' }}>
            <div className="text-white/20 text-xs tracking-widest uppercase animate-pulse">
              Reading the stars...
            </div>
          </div>
        }
      >
        <AstroWheel3D {...props} />
      </Suspense>
    </Wheel3DErrorBoundary>
  )
}
