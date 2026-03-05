'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Constants ───────────────────────────────────────────────────
const DEEP_STAR_COUNT = 1500
const MID_STAR_COUNT = 400
const ACCENT_STAR_COUNT = 20

// ─── Shaders ─────────────────────────────────────────────────────
const starVertexShader = /* glsl */ `
  attribute float aOpacity;
  attribute float aSize;
  attribute vec3 aColor;
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    vOpacity = aOpacity;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = length(mvPosition.xyz);
    gl_PointSize = aSize * (300.0 / max(1.0, dist));
    gl_Position = projectionMatrix * mvPosition;
  }
`

const starFragmentShader = /* glsl */ `
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`

// ─── Texture Generators ──────────────────────────────────────────
function createStarSpriteTexture(hasDiffraction: boolean): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.8)')
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  if (hasDiffraction) {
    ctx.globalCompositeOperation = 'screen'
    const mid = size / 2

    // Horizontal spike
    const hGrad = ctx.createLinearGradient(0, mid, size, mid)
    hGrad.addColorStop(0, 'rgba(255,255,255,0)')
    hGrad.addColorStop(0.35, 'rgba(255,255,255,0.08)')
    hGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)')
    hGrad.addColorStop(0.65, 'rgba(255,255,255,0.08)')
    hGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = hGrad
    ctx.fillRect(0, mid - 1.5, size, 3)

    // Vertical spike
    const vGrad = ctx.createLinearGradient(mid, 0, mid, size)
    vGrad.addColorStop(0, 'rgba(255,255,255,0)')
    vGrad.addColorStop(0.35, 'rgba(255,255,255,0.08)')
    vGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)')
    vGrad.addColorStop(0.65, 'rgba(255,255,255,0.08)')
    vGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = vGrad
    ctx.fillRect(mid - 1.5, 0, 3, size)
  }

  return new THREE.CanvasTexture(canvas)
}

// ─── Nebula Particle Shaders ────────────────────────────────────
const nebulaVertexShader = /* glsl */ `
  attribute float aOpacity;
  attribute float aSize;
  attribute vec3 aColor;
  varying float vOpacity;
  varying vec3 vColor;
  uniform float uGlobalOpacity;

  void main() {
    vOpacity = aOpacity * uGlobalOpacity;
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float dist = length(mvPosition.xyz);
    gl_PointSize = aSize * (600.0 / max(1.0, dist));
    gl_Position = projectionMatrix * mvPosition;
  }
`

const nebulaFragmentShader = /* glsl */ `
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`

// ─── Nebula Configs ─────────────────────────────────────────────
interface NebulaConfig {
  centreX: number; centreY: number; centreZ: number
  spreadX: number; spreadY: number; spreadZ: number
  particleCount: number
  colour1: string; colour2: string
  maxOpacity: number
}

const NEBULA_CONFIGS: NebulaConfig[] = [
  {
    centreX: -50, centreY: 30, centreZ: -120,
    spreadX: 25, spreadY: 18, spreadZ: 8,
    particleCount: 800,
    colour1: '#1e1040', colour2: '#0d1f3c',
    maxOpacity: 0.35,
  },
  {
    centreX: 40, centreY: 25, centreZ: -110,
    spreadX: 15, spreadY: 20, spreadZ: 6,
    particleCount: 500,
    colour1: '#0a2a2a', colour2: '#0d1f3c',
    maxOpacity: 0.25,
  },
  {
    centreX: 5, centreY: -35, centreZ: -130,
    spreadX: 30, spreadY: 12, spreadZ: 10,
    particleCount: 600,
    colour1: '#2a1a0a', colour2: '#1a0a1a',
    maxOpacity: 0.20,
  },
  {
    centreX: 0, centreY: 0, centreZ: -140,
    spreadX: 40, spreadY: 30, spreadZ: 15,
    particleCount: 1000,
    colour1: '#0a0a20', colour2: '#100a18',
    maxOpacity: 0.15,
  },
  {
    centreX: 55, centreY: -10, centreZ: -100,
    spreadX: 8, spreadY: 10, spreadZ: 5,
    particleCount: 300,
    colour1: '#1a0a2a', colour2: '#0a1a2a',
    maxOpacity: 0.30,
  },
]

function gaussianRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

function generateNebulaParticles(config: NebulaConfig) {
  const count = config.particleCount
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const opacities = new Float32Array(count)
  const sizes = new Float32Array(count)

  const c1 = new THREE.Color(config.colour1)
  const c2 = new THREE.Color(config.colour2)
  const mixed = new THREE.Color()

  for (let i = 0; i < count; i++) {
    const gx = gaussianRandom()
    const gy = gaussianRandom()
    const gz = gaussianRandom()

    positions[i * 3] = gx * config.spreadX
    positions[i * 3 + 1] = gy * config.spreadY
    positions[i * 3 + 2] = gz * config.spreadZ

    const blend = Math.random()
    mixed.copy(c1).lerp(c2, blend)
    const dimming = 0.3 + Math.random() * 0.7
    colors[i * 3] = mixed.r * dimming
    colors[i * 3 + 1] = mixed.g * dimming
    colors[i * 3 + 2] = mixed.b * dimming

    const dist = Math.sqrt(gx * gx + gy * gy + gz * gz)
    opacities[i] = Math.max(0.05, 1.0 - dist * 0.3)
    sizes[i] = Math.max(1.0, 4.0 - dist * 0.8)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  return geometry
}

// ─── Star Color ──────────────────────────────────────────────────
function generateStarColor(color: THREE.Color): void {
  const roll = Math.random()
  if (roll < 0.85) {
    color.setHSL(0, 0, 0.9 + Math.random() * 0.1)
  } else if (roll < 0.95) {
    color.setHSL(0.08 + Math.random() * 0.05, 0.3, 0.9)
  } else {
    color.setHSL(0.6 + Math.random() * 0.05, 0.3, 0.9)
  }
}

// ─── Star Generation ─────────────────────────────────────────────
function generateStarLayer(
  count: number,
  radiusMin: number,
  radiusMax: number,
  opacityRange: [number, number],
  sizeRange: [number, number],
  twinkleSpeedRange: [number, number]
) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const baseOpacities = new Float32Array(count)
  const opacities = new Float32Array(count)
  const sizes = new Float32Array(count)
  const twinkleSpeeds = new Float32Array(count)
  const twinkleOffsets = new Float32Array(count)

  const color = new THREE.Color()

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const radius = radiusMin + Math.random() * (radiusMax - radiusMin)

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    generateStarColor(color)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b

    baseOpacities[i] = opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0])
    opacities[i] = 0
    twinkleSpeeds[i] = twinkleSpeedRange[0] + Math.random() * (twinkleSpeedRange[1] - twinkleSpeedRange[0])
    twinkleOffsets[i] = Math.random() * Math.PI * 2
    sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))

  return { geometry, baseOpacities, twinkleSpeeds, twinkleOffsets }
}

// ─── Deep Stars (1500) ───────────────────────────────────────────
function DeepStars() {
  const frameCount = useRef(0)

  const data = useMemo(
    () => generateStarLayer(DEEP_STAR_COUNT, 80, 120, [0.3, 0.8], [0.3, 0.8], [0.15, 0.5]),
    []
  )

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    []
  )

  useFrame(({ clock }) => {
    frameCount.current++
    if (frameCount.current % 2 !== 0) return // Skip every other frame

    const time = clock.elapsedTime
    const entrance = Math.min(1, (time * 1000) / 500)
    const opacityAttr = data.geometry.attributes.aOpacity
    const arr = opacityAttr.array as Float32Array

    for (let i = 0; i < DEEP_STAR_COUNT; i++) {
      const base = data.baseOpacities[i]
      const speed = data.twinkleSpeeds[i]
      const offset = data.twinkleOffsets[i]
      arr[i] = base * (0.4 + 0.6 * (Math.sin(time * speed + offset) * 0.5 + 0.5)) * entrance
    }
    opacityAttr.needsUpdate = true
  })

  return <points geometry={data.geometry} material={material} renderOrder={-3} />
}

// ─── Mid Stars (400) ─────────────────────────────────────────────
function MidStars() {
  const data = useMemo(
    () => generateStarLayer(MID_STAR_COUNT, 50, 75, [0.5, 0.8], [0.6, 1.2], [0.08, 0.2]),
    []
  )

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: false,
      }),
    []
  )

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    const entrance = Math.min(1, Math.max(0, (time * 1000 - 200) / 400))
    const opacityAttr = data.geometry.attributes.aOpacity
    const arr = opacityAttr.array as Float32Array

    for (let i = 0; i < MID_STAR_COUNT; i++) {
      const base = data.baseOpacities[i]
      const speed = data.twinkleSpeeds[i]
      const offset = data.twinkleOffsets[i]
      arr[i] = base * (0.4 + 0.6 * (Math.sin(time * speed + offset) * 0.5 + 0.5)) * entrance
    }
    opacityAttr.needsUpdate = true
  })

  return <points geometry={data.geometry} material={material} renderOrder={-2} />
}

// ─── Accent Stars (20 sprites with glow halos) ──────────────────
function AccentStars() {
  const groupRef = useRef<THREE.Group>(null)

  const starData = useMemo(
    () =>
      Array.from({ length: ACCENT_STAR_COUNT }, () => {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const radius = 40 + Math.random() * 30
        return {
          position: [
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi),
          ] as [number, number, number],
          baseOpacity: 0.6 + Math.random() * 0.3,
          twinkleSpeed: 0.05 + Math.random() * 0.05,
          twinkleOffset: Math.random() * Math.PI * 2,
          size: 1.5 + Math.random() * 1.5,
          hasDiffraction: Math.random() < 0.25,
        }
      }),
    []
  )

  const textures = useMemo(
    () => ({
      normal: createStarSpriteTexture(false),
      diffraction: createStarSpriteTexture(true),
    }),
    []
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const time = clock.elapsedTime
    const entrance = Math.min(1, Math.max(0, (time * 1000 - 400) / 600))

    groupRef.current.children.forEach((child, i) => {
      const sprite = child as THREE.Sprite
      const d = starData[i]
      const twinkle =
        d.baseOpacity * (0.4 + 0.6 * (Math.sin(time * d.twinkleSpeed + d.twinkleOffset) * 0.5 + 0.5))
      sprite.material.opacity = twinkle * entrance
      const s = d.size * entrance
      sprite.scale.set(s, s, 1)
    })
  })

  return (
    <group ref={groupRef} renderOrder={-1}>
      {starData.map((star, i) => (
        <sprite key={i} position={star.position}>
          <spriteMaterial
            map={star.hasDiffraction ? textures.diffraction : textures.normal}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}

// ─── Nebula Particle Cloud (immersive only) ─────────────────────
function NebulaCloud({ config, visible, index }: { config: NebulaConfig; visible: boolean; index: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const currentOpacity = useRef(0)

  const geometry = useMemo(() => generateNebulaParticles(config), [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nebulaVertexShader,
        fragmentShader: nebulaFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uGlobalOpacity: { value: 0 } },
      }),
    []
  )

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return

    const target = visible ? config.maxOpacity : 0
    const speed = visible ? 1.0 : 1.5
    currentOpacity.current += (target - currentOpacity.current) * Math.min(delta * speed, 0.05)
    material.uniforms.uGlobalOpacity.value = currentOpacity.current

    const t = clock.elapsedTime
    pointsRef.current.position.x = config.centreX + Math.sin(t * 0.008 + index * 1.3) * 0.5
    pointsRef.current.position.y = config.centreY + Math.cos(t * 0.006 + index * 0.9) * 0.3
    pointsRef.current.position.z = config.centreZ
  })

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      position={[config.centreX, config.centreY, config.centreZ]}
      renderOrder={-5}
    />
  )
}

// ─── Main Component ──────────────────────────────────────────────
interface CosmicBackgroundProps {
  immersiveUniverse: boolean
}

export default function CosmicBackground({ immersiveUniverse }: CosmicBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', pointerEvents: 'none' }}
      >
        <DeepStars />
        <MidStars />
        <AccentStars />
        {NEBULA_CONFIGS.map((config, i) => (
          <NebulaCloud key={i} config={config} visible={immersiveUniverse} index={i} />
        ))}
      </Canvas>
    </div>
  )
}
