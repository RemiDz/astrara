'use client';

import { useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  delay: number;
}

export default function StarField() {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 180 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.3 ? 2 : 1,
      opacity: 0.2 + Math.random() * 0.6,
      twinkle: i < 15,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((star, i) => (
        <div
          key={i}
          className={`absolute rounded-full bg-white ${star.twinkle ? 'animate-twinkle' : ''}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: star.twinkle ? `${star.delay}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}
