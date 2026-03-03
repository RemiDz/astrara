'use client';

import { useMemo } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  duration: number;
  delay: number;
  bright: boolean;
}

export default function StarField() {
  const stars = useMemo<Star[]>(() => {
    const result: Star[] = [];

    // Layer 1: 120 tiny dots (1px, low opacity)
    for (let i = 0; i < 120; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1,
        opacity: 0.15 + Math.random() * 0.1,
        twinkle: false,
        duration: 0,
        delay: 0,
        bright: false,
      });
    }

    // Layer 2: 60 medium dots (1.5px, medium opacity)
    for (let i = 0; i < 60; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5,
        opacity: 0.3 + Math.random() * 0.15,
        twinkle: false,
        duration: 0,
        delay: 0,
        bright: false,
      });
    }

    // Layer 3: 30 larger dots (2px, higher opacity)
    for (let i = 0; i < 30; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2,
        opacity: 0.5 + Math.random() * 0.15,
        twinkle: i < 20,
        duration: 2 + Math.random() * 5,
        delay: Math.random() * 5,
        bright: false,
      });
    }

    // Layer 4: 7 bright stars (3px, with glow)
    for (let i = 0; i < 7; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3,
        opacity: 0.5,
        twinkle: true,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 3,
        bright: true,
      });
    }

    return result;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Nebula glow layers */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 600px 500px at 30% 40%, rgba(59, 130, 246, 0.04), transparent),
            radial-gradient(ellipse 700px 600px at 70% 60%, rgba(139, 92, 246, 0.03), transparent),
            radial-gradient(ellipse 400px 400px at 50% 80%, rgba(59, 130, 246, 0.02), transparent)
          `,
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.02,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />

      {/* Stars */}
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
            animationDuration: star.twinkle ? `${star.duration}s` : undefined,
            boxShadow: star.bright
              ? `0 0 ${star.size * 2}px ${star.size}px rgba(255, 255, 255, 0.3)`
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
