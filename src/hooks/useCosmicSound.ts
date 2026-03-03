'use client';

import { useRef, useState, useCallback } from 'react';
import { PlanetPosition } from '@/types';
import { CosmicSynth } from '@/lib/audio/cosmic-synth';

export function useCosmicSound(planets: PlanetPosition[]) {
  const synthRef = useRef<CosmicSynth | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = useCallback(async () => {
    if (!synthRef.current) {
      synthRef.current = new CosmicSynth();
    }

    if (synthRef.current.playing) {
      synthRef.current.stop();
      setIsPlaying(false);
    } else {
      await synthRef.current.start(planets);
      setIsPlaying(true);
    }
  }, [planets]);

  return { isPlaying, toggle };
}
