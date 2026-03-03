'use client';

import { useRef, useEffect } from 'react';

interface Props {
  frequency: number;
  color: string;
}

export default function FrequencyBar({ frequency, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      phaseRef.current += 0.02;

      ctx.beginPath();
      ctx.moveTo(0, h / 2);

      const wavelength = Math.max(20, 200 - frequency * 0.3);
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin((x / wavelength) * Math.PI * 2 + phaseRef.current) * (h * 0.35);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [frequency, color]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-6"
    />
  );
}
