'use client';

import { useRef, useEffect, useCallback } from 'react';
import { BirthChart, ZODIAC_SIGNS, ZODIAC_SYMBOLS, ZODIAC_ELEMENTS, PLANET_SYMBOLS, PlanetName, ZodiacElement } from '@/types';
import { degToRad } from '@/lib/utils';
import { useLanguage, TranslationKey } from '@/lib/i18n';

interface Props {
  chart: BirthChart;
  isPlaying: boolean;
}

const PLANET_COLORS: Record<PlanetName, string> = {
  Sun: '#FCD34D',
  Moon: '#E2E8F0',
  Mercury: '#A5B4FC',
  Venus: '#F9A8D4',
  Mars: '#EF4444',
  Jupiter: '#FB923C',
  Saturn: '#A78BFA',
  Uranus: '#22D3EE',
  Neptune: '#6366F1',
  Pluto: '#9CA3AF',
};

const ELEMENT_COLORS: Record<ZodiacElement, string> = {
  fire: 'rgba(251, 191, 36, 0.05)',
  earth: 'rgba(34, 197, 94, 0.05)',
  air: 'rgba(59, 130, 246, 0.05)',
  water: 'rgba(139, 92, 246, 0.05)',
};

export default function CosmicWheel({ chart, isPlaying }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const fadeRef = useRef(0);
  const { t } = useLanguage();
  const tRef = useRef(t);
  tRef.current = t;

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const t = tRef.current;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) * 0.9;
    const rotation = rotationRef.current;
    const fade = Math.min(fadeRef.current, 1);

    ctx.clearRect(0, 0, width, height);

    // Outer zodiac ring
    const outerR = radius;
    const innerR = radius * 0.78;

    // Subtle outer glow ring at 110% radius
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Zodiac segments with element tints
    ZODIAC_SIGNS.forEach((sign, i) => {
      const startAngle = degToRad(i * 30 - 90 + rotation);
      const endAngle = degToRad((i + 1) * 30 - 90 + rotation);
      const element = ZODIAC_ELEMENTS[sign];

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = ELEMENT_COLORS[element];
      ctx.fill();

      // Dividing lines
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(startAngle) * innerR, cy + Math.sin(startAngle) * innerR);
      ctx.lineTo(cx + Math.cos(startAngle) * outerR, cy + Math.sin(startAngle) * outerR);
      ctx.strokeStyle = 'rgba(30, 31, 46, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Zodiac symbol (prominent) + name (very subtle)
      const midAngle = degToRad(i * 30 + 15 - 90 + rotation);
      const symbolR = (outerR + innerR) / 2;
      const sx = cx + Math.cos(midAngle) * symbolR;
      const sy = cy + Math.sin(midAngle) * symbolR;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(midAngle + Math.PI / 2);

      // Symbol — more prominent
      ctx.fillStyle = 'rgba(107, 113, 148, 0.7)';
      ctx.font = '14px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ZODIAC_SYMBOLS[sign], 0, -5);

      // Name — very subtle (0.3 opacity, smaller)
      ctx.fillStyle = 'rgba(107, 113, 148, 0.3)';
      ctx.font = '7px "DM Sans", sans-serif';
      ctx.fillText(t(sign as TranslationKey), 0, 7);
      ctx.restore();
    });

    // Outer/inner circles
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(30, 31, 46, 0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.stroke();

    // Aspect lines — TOP 5 only (smallest orb = strongest)
    if (fade > 0.5) {
      const aspectFade = (fade - 0.5) * 2;
      const planetR = innerR * 0.85;

      const topAspects = [...chart.aspects]
        .sort((a, b) => a.orb - b.orb)
        .slice(0, 5);

      topAspects.forEach((aspect) => {
        const p1 = chart.planets.find((p) => p.planet === aspect.planet1);
        const p2 = chart.planets.find((p) => p.planet === aspect.planet2);
        if (!p1 || !p2) return;

        const a1 = degToRad(p1.longitude - 90 + rotation);
        const a2 = degToRad(p2.longitude - 90 + rotation);

        const x1 = cx + Math.cos(a1) * planetR;
        const y1 = cy + Math.sin(a1) * planetR;
        const x2 = cx + Math.cos(a2) * planetR;
        const y2 = cy + Math.sin(a2) * planetR;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        switch (aspect.type) {
          case 'conjunction':
            ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 * aspectFade})`;
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            break;
          case 'trine':
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * aspectFade})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            break;
          case 'square':
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.15 * aspectFade})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            break;
          case 'opposition':
            ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 * aspectFade})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([6, 4]);
            break;
          case 'sextile':
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * aspectFade})`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([]);
            break;
        }

        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // Planet dots — with label overlap detection
    const now = Date.now() / 1000;
    const planetR = innerR * 0.85;

    // Pre-calculate label positions, detect overlaps, and offset if needed
    interface LabelInfo {
      angle: number;
      px: number;
      py: number;
      size: number;
      labelR: number;
      labelX: number;
      labelY: number;
      offset: boolean;
    }

    const labels: LabelInfo[] = chart.planets.map((planet, i) => {
      const angle = planet.longitude;
      const drawAngle = degToRad(angle - 90 + rotation);
      const px = cx + Math.cos(drawAngle) * planetR;
      const py = cy + Math.sin(drawAngle) * planetR;

      const baseSize = planet.planet === 'Sun' || planet.planet === 'Moon' ? 6
        : ['Mercury', 'Venus', 'Mars'].includes(planet.planet) ? 4 : 3;

      const pulseAmp = isPlaying ? 0.08 : 0.02;
      const pulse = 1 + Math.sin(now * 2 + i * 0.7) * pulseAmp;
      const size = baseSize * pulse;

      return {
        angle,
        px,
        py,
        size,
        labelR: planetR,
        labelX: px,
        labelY: py - size - 6,
        offset: false,
      };
    });

    // Detect overlaps — if two planets within 15° of each other, offset one outward
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        let diff = Math.abs(labels[i].angle - labels[j].angle);
        if (diff > 180) diff = 360 - diff;
        if (diff < 15) {
          labels[j].offset = true;
        }
      }
    }

    chart.planets.forEach((planet, i) => {
      const planetFade = Math.min(Math.max((fade - i * 0.05) * 2, 0), 1);
      if (planetFade <= 0) return;

      const info = labels[i];
      const { px, py, size } = info;
      const color = PLANET_COLORS[planet.planet];

      // Glow
      const glowRadius = isPlaying ? size * 4 : size * 3;
      const glowOpacity = isPlaying ? 0.5 : 0.4;
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, glowRadius);
      gradient.addColorStop(0, color.replace(')', `, ${glowOpacity * planetFade})`).replace('rgb', 'rgba'));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Dot
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = planetFade;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Label — offset outward if overlapping
      const drawAngle = degToRad(planet.longitude - 90 + rotation);
      let labelX: number, labelY: number;

      if (info.offset) {
        const offsetR = planetR + 20;
        labelX = cx + Math.cos(drawAngle) * offsetR;
        labelY = cy + Math.sin(drawAngle) * offsetR;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = `rgba(107, 113, 148, ${0.2 * planetFade})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else {
        labelX = px;
        labelY = py - size - 6;
      }

      ctx.fillStyle = color;
      ctx.globalAlpha = planetFade;
      ctx.font = '10px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${PLANET_SYMBOLS[planet.planet]} ${planet.degree.toFixed(0)}°`, labelX, labelY);
      ctx.globalAlpha = 1;
    });

    // Seed of Life (centre) — 7 circles
    const seedR = radius * 0.12;
    const seedCircleR = seedR * 0.5;
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 0.5;

    ctx.beginPath();
    ctx.arc(cx, cy, seedCircleR, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const a = degToRad(i * 60 + rotation * 2);
      const sx = cx + Math.cos(a) * seedCircleR;
      const sy = cy + Math.sin(a) * seedCircleR;
      ctx.beginPath();
      ctx.arc(sx, sy, seedCircleR, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, [chart, isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    let lastTime = 0;

    function animate(time: number) {
      if (!canvas || !ctx) return;
      const delta = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;

      rotationRef.current += (isPlaying ? 0.08 : 0.02) * delta * 60;
      if (fadeRef.current < 1) fadeRef.current += delta * 0.5;

      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height);
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [chart, isPlaying, draw]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full aspect-square mx-auto rounded-full ${
        isPlaying ? 'animate-wheel-glow' : ''
      }`}
    />
  );
}
