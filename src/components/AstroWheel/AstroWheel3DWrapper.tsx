'use client'

import { Component, Suspense, lazy, type ReactNode } from 'react'
import type { PlanetPosition, AspectData } from '@/lib/astronomy'
import AstroWheel from './AstroWheel'
import Shimmer from '@/components/ui/Shimmer'

const AstroWheel3D = lazy(() => import('./AstroWheel3D'))

interface Props {
  planets: PlanetPosition[]
  aspects: AspectData[]
  onPlanetTap: (planet: PlanetPosition) => void
  onSignTap: (signId: string) => void
  onAspectTap: (aspect: AspectData) => void
  selectedPlanet: string | null
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
          <div className="w-full max-w-[90vw] md:max-w-[60vw] lg:max-w-[min(500px,45vw)] mx-auto aspect-square flex items-center justify-center">
            <Shimmer className="w-full h-full rounded-full" />
          </div>
        }
      >
        <AstroWheel3D {...props} />
      </Suspense>
    </Wheel3DErrorBoundary>
  )
}
