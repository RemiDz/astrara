'use client'

import { useRef, useMemo, useCallback, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetPosition } from '@/lib/astronomy'
import { ZODIAC_SIGNS } from '@/lib/zodiac'
import { useTapVsDrag } from '@/hooks/useTapVsDrag'

// ─── Element dominance ──────────────────────────────────────────────

type DominantElement = 'fire' | 'earth' | 'air' | 'water' | 'neutral'

const SIGN_TO_ELEMENT: Record<string, DominantElement> = {}
ZODIAC_SIGNS.forEach((s) => { SIGN_TO_ELEMENT[s.id] = s.element as DominantElement })

const LUMINARIES = new Set(['sun', 'moon'])

export function getDominantElement(planets: PlanetPosition[]): DominantElement {
  const counts = { fire: 0, earth: 0, air: 0, water: 0 }
  for (const p of planets) {
    const el = SIGN_TO_ELEMENT[p.zodiacSign]
    if (el && el !== 'neutral') counts[el] += LUMINARIES.has(p.id) ? 2 : 1
  }
  const max = Math.max(counts.fire, counts.earth, counts.air, counts.water)
  const winners = (Object.entries(counts) as [keyof typeof counts, number][]).filter(([, v]) => v === max)
  return winners.length === 1 ? winners[0][0] : 'neutral'
}

const ELEMENT_COLOURS: Record<DominantElement, string> = {
  fire: '#FF6B4A',
  earth: '#4ADE80',
  air: '#60A5FA',
  water: '#A78BFA',
  neutral: '#C0C0D0',
}

// ─── Constants ──────────────────────────────────────────────────────

const CRYSTAL_Y = 1.6
const CIRCLE_RADIUS = 0.12
const CIRCLE_SEGMENTS = 64
const X_TILT = 0.17 // ~10°
const Z_ROT_SPEED = 0.04 // rad/s

// Three layers distributed spherically — each layer's seed pattern is rotated
// to a different orientation, creating a volumetric 3D light form
const LAYERS = [
  { scale: 1.0,  alpha: 0.25, phaseOffset: 0 },   // front face
  { scale: 0.85, alpha: 0.15, phaseOffset: 2.1 },  // tilted ~63° on X
  { scale: 0.92, alpha: 0.10, phaseOffset: 4.2 },  // tilted ~63° on Y
]

// Rotation per layer — distributes seed patterns across a sphere
const LAYER_ROTATIONS: [number, number, number][] = [
  [0, 0, 0],          // front face (primary visible pattern)
  [1.1, 0.3, 0],      // tilted forward + slight twist
  [-0.3, 1.1, 0],     // tilted sideways + slight opposite twist
]

const NUM_EMANATION = 5
const NUM_PARTICLES = 30
const WAVE_SEGMENTS = 80
const WAVE_EXTENT = 0.3

// ─── Helpers ────────────────────────────────────────────────────────

function createCircleGeometry(radius: number, segments: number): THREE.BufferGeometry {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0))
  }
  return new THREE.BufferGeometry().setFromPoints(points)
}

function createGlowTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.15, 'rgba(255,255,255,0.6)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.15)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

function seedPositions(radius: number): [number, number][] {
  const pos: [number, number][] = [[0, 0]]
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    pos.push([Math.cos(a) * radius, Math.sin(a) * radius])
  }
  return pos
}

function makeLineMat(): THREE.LineBasicMaterial {
  const mat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  })
  mat.depthWrite = false
  return mat
}

// ─── Component ──────────────────────────────────────────────────────

interface CrystallineCoreProps {
  planets: PlanetPosition[]
  viewMode: 'geocentric' | 'heliocentric'
  readingActive: boolean
  entranceComplete: boolean
  onCrystalTap: () => void
}

export default function CrystallineCore({
  planets,
  viewMode,
  readingActive,
  entranceComplete,
  onCrystalTap,
}: CrystallineCoreProps) {
  const groupRef = useRef<THREE.Group>(null)
  const zRotRef = useRef(0)
  const entranceFadeRef = useRef(0)
  const helioFadeRef = useRef(viewMode === 'geocentric' ? 1 : 0)
  const pulseRef = useRef({ active: false, time: 0 })

  const dominantElement = getDominantElement(planets)
  const targetColour = useMemo(() => new THREE.Color(ELEMENT_COLOURS[dominantElement]), [dominantElement])
  const currentColourRef = useRef(new THREE.Color(ELEMENT_COLOURS[dominantElement]))
  const isGeo = viewMode === 'geocentric'

  // ── Shared geometry & texture ──
  const circleGeom = useMemo(() => createCircleGeometry(CIRCLE_RADIUS, CIRCLE_SEGMENTS), [])
  const glowTexture = useMemo(() => createGlowTexture(), [])

  // ── Seed of Life: 3 layers × 7 circles = 21 lines, spherically distributed ──
  const seeds = useMemo(() => {
    const positions = seedPositions(CIRCLE_RADIUS)
    return LAYERS.map((layer, li) => {
      const group = new THREE.Group()
      group.rotation.set(...LAYER_ROTATIONS[li])
      const circles = positions.map(([x, y]) => {
        const mat = makeLineMat()
        const line = new THREE.Line(circleGeom, mat)
        line.position.set(x * layer.scale, y * layer.scale, 0)
        line.scale.setScalar(layer.scale)
        group.add(line)
        return { line, mat }
      })
      return { ...layer, group, circles }
    })
  }, [circleGeom])

  // ── Emanation rings: 5 expanding circles ──
  const emanations = useMemo(() =>
    Array.from({ length: NUM_EMANATION }, (_, i) => {
      const mat = makeLineMat()
      const line = new THREE.Line(circleGeom, mat)
      return { line, mat, phase: i / NUM_EMANATION }
    }),
  [circleGeom])

  // ── Frequency waves: sub-bass, main compound, ghost ──
  const waves = useMemo(() =>
    [0, 1, 2].map(() => {
      const positions = new Float32Array((WAVE_SEGMENTS + 1) * 3)
      const geom = new THREE.BufferGeometry()
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const mat = makeLineMat()
      const line = new THREE.Line(geom, mat)
      return { line, mat, geom }
    }),
  [])

  // ── Core glow: white-hot inner + coloured outer halo ──
  const coreGlow = useMemo(() => {
    const mkSprite = () => {
      const mat = new THREE.SpriteMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        map: glowTexture,
      })
      mat.depthWrite = false
      return mat
    }
    return { inner: mkSprite(), outer: mkSprite() }
  }, [glowTexture])

  // ── Particles: 30 luminous points ──
  const particleObj = useMemo(() => {
    const pos = new Float32Array(NUM_PARTICLES * 3)
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const r = 0.04 + Math.random() * 0.2
      const a = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = Math.sin(a) * r
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1
    }
    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.006,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    mat.depthWrite = false
    return { obj: new THREE.Points(geom, mat), mat, geom }
  }, [])

  // ── Cleanup ──
  useEffect(() => () => {
    circleGeom.dispose()
    glowTexture.dispose()
    seeds.forEach((l) => l.circles.forEach((c) => c.mat.dispose()))
    emanations.forEach((e) => e.mat.dispose())
    waves.forEach((w) => { w.geom.dispose(); w.mat.dispose() })
    coreGlow.inner.dispose()
    coreGlow.outer.dispose()
    particleObj.geom.dispose()
    particleObj.mat.dispose()
  }, [circleGeom, glowTexture, seeds, emanations, waves, coreGlow, particleObj])

  // ── Tap ──
  const handleTap = useCallback(() => {
    pulseRef.current = { active: true, time: 0 }
    onCrystalTap()
  }, [onCrystalTap])
  const tapHandlers = useTapVsDrag({ onTap: handleTap })

  // ── Frame loop ──
  useFrame((_, delta) => {
    if (!groupRef.current) return
    const time = (groupRef.current.userData.t ?? 0) + delta
    groupRef.current.userData.t = time

    // ── Entrance (scale 0.5→1 over 800ms) ──
    if (entranceComplete && entranceFadeRef.current < 1) {
      entranceFadeRef.current = Math.min(entranceFadeRef.current + delta / 0.8, 1)
    }
    const eT = entranceFadeRef.current

    // ── Helio fade ──
    helioFadeRef.current += ((isGeo ? 1 : 0) - helioFadeRef.current) * Math.min(delta * 4, 0.2)

    // ── Combined visibility ──
    const vis = eT * helioFadeRef.current * (readingActive ? 0.4 : 1)
    groupRef.current.visible = vis > 0.01

    // ── Position: gentle float ──
    groupRef.current.position.y = CRYSTAL_Y + 0.02 * Math.sin(time * 0.5)

    // ── Rotation: fixed X-tilt + slow Z-spin ──
    zRotRef.current += Z_ROT_SPEED * delta
    groupRef.current.rotation.set(X_TILT, 0, zRotRef.current)

    // ── Scale: entrance + compound breathing (harmonicwaves.app pattern) ──
    const breath = 0.93 + Math.sin(time * 0.3) * 0.07
    groupRef.current.scale.setScalar((0.5 + 0.5 * eT) * breath)

    // ── Colour lerp ──
    currentColourRef.current.lerp(targetColour, Math.min(delta / 1.5, 0.05))
    const col = currentColourRef.current

    // ── Core pulse: dual-frequency compound oscillation ──
    const cp = 0.6 + Math.sin(time * 1.4) * 0.25 + Math.sin(time * 3.1) * 0.15

    // ── Tap pulse multiplier ──
    let tap = 1
    if (pulseRef.current.active) {
      pulseRef.current.time += delta
      const pt = pulseRef.current.time
      if (pt < 0.6) {
        tap = 1 + 1.5 * (1 - pt / 0.6)
      } else {
        pulseRef.current.active = false
      }
    }

    // ──────────── SEED OF LIFE CIRCLES ────────────
    // Per-layer time pulse + per-petal phase offset (from HarmonicLogo)
    seeds.forEach((layer) => {
      const layerPulse = 0.85 + Math.sin(time * 0.5 + layer.phaseOffset) * 0.15
      layer.circles.forEach((c, ci) => {
        const petalPulse = ci > 0 ? (0.8 + Math.sin(time * 0.6 + ci * 1.05) * 0.2) : 1
        c.mat.color.copy(col)
        c.mat.opacity = layer.alpha * layerPulse * petalPulse * vis * tap
      })
    })

    // ──────────── EMANATION RINGS ────────────
    // Grow outward, fade in then out (triangle wave opacity)
    emanations.forEach((ring) => {
      const life = ((time * 0.2 + ring.phase) % 1)
      ring.line.scale.setScalar(0.5 + life * 3.8)
      ring.mat.color.copy(col)
      ring.mat.opacity = (life < 0.5 ? life * 0.3 : (1 - life) * 0.3) * vis * tap
    })

    // ──────────── FREQUENCY WAVES ────────────
    // Three layered sine waves with Gaussian envelope (from HarmonicLogo)
    const waveBaseAlphas = [0.08, 0.18, 0.10]
    waves.forEach(({ mat, geom }, wi) => {
      const attr = geom.getAttribute('position') as THREE.BufferAttribute
      for (let i = 0; i <= WAVE_SEGMENTS; i++) {
        const t01 = i / WAVE_SEGMENTS
        const n = t01 * 2 - 1 // -1 to 1
        const x = n * WAVE_EXTENT
        const env = Math.pow(Math.max(0, 1 - n * n), 1.5)
        let y = 0
        if (wi === 0) {
          // Sub-bass: slow, wide sine
          y = Math.sin(t01 * Math.PI * 4 + time * 0.8) * env * 0.015
        } else if (wi === 1) {
          // Main: compound harmonic (carrier + sub-harmonic + overtone)
          const f1 = Math.sin(t01 * Math.PI * 14 + time * 2.8) * env
          const f2 = Math.sin(t01 * Math.PI * 9 - time * 2.0) * env * 0.35
          const f3 = Math.sin(t01 * Math.PI * 21 + time * 3.5) * env * 0.12
          y = (f1 + f2 + f3) * 0.027
        } else {
          // Ghost: phase-shifted echo of main
          const f1 = Math.sin(t01 * Math.PI * 14 + time * 2.8 + 1.5) * env
          const f2 = Math.sin(t01 * Math.PI * 9 - time * 2.0 + 1.0) * env * 0.35
          y = (f1 + f2) * 0.021
        }
        attr.setXYZ(i, x, y, 0)
      }
      attr.needsUpdate = true
      mat.color.copy(col)
      mat.opacity = waveBaseAlphas[wi] * vis * tap
    })

    // ──────────── CORE GLOW ────────────
    // White-hot inner + coloured outer halo (from HarmonicLogo energy core)
    coreGlow.inner.opacity = 0.7 * cp * vis * tap
    coreGlow.outer.color.copy(col)
    coreGlow.outer.opacity = 0.3 * cp * vis * tap

    // ──────────── PARTICLES ────────────
    // Ethereal spirit dust
    particleObj.mat.color.copy(col)
    particleObj.mat.opacity = (0.12 + Math.sin(time * 1.5) * 0.06) * vis * tap
  })

  return (
    <group ref={groupRef} position={[0, CRYSTAL_Y, 0]} visible={false}>
      {/* 3 spherically-distributed Seed of Life layers */}
      {seeds.map((layer, li) => (
        <primitive key={`layer-${li}`} object={layer.group} />
      ))}

      {/* 5 emanation rings — grow outward from centre */}
      {emanations.map((e, i) => (
        <primitive key={`e${i}`} object={e.line} />
      ))}

      {/* 3 frequency waves — harmonic energy flow through centre */}
      {waves.map((w, i) => (
        <primitive key={`w${i}`} object={w.line} />
      ))}

      {/* Core glow — white-hot centre + coloured halo */}
      <sprite material={coreGlow.inner} scale={[0.06, 0.06, 0.06]} />
      <sprite material={coreGlow.outer} scale={[0.2, 0.2, 0.2]} />

      {/* Luminous particles — spirit dust */}
      <primitive object={particleObj.obj} />

      {/* Invisible tap target */}
      <mesh {...tapHandlers}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  )
}
