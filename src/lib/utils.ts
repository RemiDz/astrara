export function formatDegree(degree: number): string {
  return `${degree.toFixed(1)}°`;
}

export function formatFrequency(freq: number): string {
  return `${freq.toFixed(2)} Hz`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}
