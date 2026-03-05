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

function createNebulaTexture(hue: number, saturation: number, complexity: number): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Transparent background — additive blending makes rgba(0,0,0,0) invisible
  ctx.clearRect(0, 0, size, size)

  const colour = new THREE.Color()

  // Large base clouds
  for (let i = 0; i < complexity * 8; i++) {
    const x = size * 0.2 + Math.random() * size * 0.6
    const y = size * 0.2 + Math.random() * size * 0.6
    const radius = size * (0.15 + Math.random() * 0.35)

    colour.setHSL(
      hue + (Math.random() - 0.5) * 0.1,
      saturation * (0.5 + Math.random() * 0.5),
      0.3 + Math.random() * 0.2
    )

    const r = (colour.r * 255) | 0
    const g = (colour.g * 255) | 0
    const b = (colour.b * 255) | 0

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.18)`)
    grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, 0.10)`)
    grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.04)`)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }

  // Small detail wisps for realism
  for (let i = 0; i < complexity * 5; i++) {
    const x = size * 0.15 + Math.random() * size * 0.7
    const y = size * 0.15 + Math.random() * size * 0.7
    const radius = size * (0.05 + Math.random() * 0.15)

    colour.setHSL(
      hue + (Math.random() - 0.5) * 0.15,
      saturation * (0.6 + Math.random() * 0.4),
      0.35 + Math.random() * 0.25
    )

    const r = (colour.r * 255) | 0
    const g = (colour.g * 255) | 0
    const b = (colour.b * 255) | 0

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.22)`)
    grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.08)`)
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.globalCompositeOperation = 'lighter'
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }

  // Radial vignette — fade to transparent at edges so sprite boundary is invisible
  ctx.globalCompositeOperation = 'destination-in'
  const vignette = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.5)
  vignette.addColorStop(0, 'rgba(255, 255, 255, 1)')
  vignette.addColorStop(0.55, 'rgba(255, 255, 255, 1)')
  vignette.addColorStop(0.85, 'rgba(255, 255, 255, 0.4)')
  vignette.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = vignette
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

function createGalaxyTexture(): THREE.CanvasTexture {
  const w = 128
  const h = 64
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 3)
  gradient.addColorStop(0, 'rgba(255, 255, 240, 0.6)')
  gradient.addColorStop(0.3, 'rgba(200, 200, 255, 0.2)')
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  return new THREE.CanvasTexture(canvas)
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

// ─── Nebula Clouds (immersive only) ──────────────────────────────
const NEBULAE = [
  { hue: 0.75, saturation: 0.6, x: -40, y: 20, z: -90, scale: 60, rotation: 0.3, complexity: 3 },
  { hue: 0.55, saturation: 0.5, x: 35, y: -15, z: -85, scale: 50, rotation: -0.5, complexity: 2 },
  { hue: 0.65, saturation: 0.4, x: 10, y: 30, z: -95, scale: 45, rotation: 0.8, complexity: 3 },
  { hue: 0.08, saturation: 0.3, x: -25, y: -25, z: -80, scale: 35, rotation: -0.2, complexity: 2 },
]

function NebulaClouds({ immersiveUniverse }: { immersiveUniverse: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const currentOpacity = useRef(0)

  const nebulaTextures = useMemo(
    () => NEBULAE.map((n) => createNebulaTexture(n.hue, n.saturation, n.complexity)),
    []
  )

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    const target = immersiveUniverse ? 0.4 : 0
    const speed = immersiveUniverse ? 0.7 : 1.5
    currentOpacity.current += (target - currentOpacity.current) * Math.min(delta * speed, 0.05)

    const entrance = Math.min(1, Math.max(0, (clock.elapsedTime * 1000 - 800) / 1200))
    const opacity = currentOpacity.current * entrance

    groupRef.current.children.forEach((child, i) => {
      const sprite = child as THREE.Sprite
      sprite.material.opacity = opacity
      sprite.material.rotation += delta * 0.005
      const config = NEBULAE[i]
      sprite.position.x = config.x + Math.sin(clock.elapsedTime * 0.02 + i) * 0.5
      sprite.position.y = config.y + Math.cos(clock.elapsedTime * 0.015 + i * 0.7) * 0.3
    })
  })

  return (
    <group ref={groupRef} renderOrder={-5}>
      {NEBULAE.map((config, i) => (
        <sprite key={i} position={[config.x, config.y, config.z]} scale={[config.scale, config.scale, 1]}>
          <spriteMaterial
            map={nebulaTextures[i]}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest
            rotation={config.rotation}
          />
        </sprite>
      ))}
    </group>
  )
}

// ─── Galaxy Smudges (immersive only) ─────────────────────────────
const GALAXIES = [
  { x: 50, y: 35, z: -100, scaleX: 6, scaleY: 3, rotation: 0.7 },
  { x: -45, y: -30, z: -100, scaleX: 5, scaleY: 2.5, rotation: -0.4 },
]

function GalaxySmudges({ immersiveUniverse }: { immersiveUniverse: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const currentOpacity = useRef(0)

  const texture = useMemo(() => createGalaxyTexture(), [])

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    const target = immersiveUniverse ? 0.3 : 0
    const speed = immersiveUniverse ? 0.7 : 1.5
    currentOpacity.current += (target - currentOpacity.current) * Math.min(delta * speed, 0.05)

    const entrance = Math.min(1, Math.max(0, (clock.elapsedTime * 1000 - 1000) / 1000))
    const opacity = currentOpacity.current * entrance

    groupRef.current.children.forEach((child) => {
      ;(child as THREE.Sprite).material.opacity = opacity
    })
  })

  return (
    <group ref={groupRef} renderOrder={-6}>
      {GALAXIES.map((config, i) => (
        <sprite key={i} position={[config.x, config.y, config.z]} scale={[config.scaleX, config.scaleY, 1]}>
          <spriteMaterial
            map={texture}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest
            rotation={config.rotation}
          />
        </sprite>
      ))}
    </group>
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
        <NebulaClouds immersiveUniverse={immersiveUniverse} />
        <GalaxySmudges immersiveUniverse={immersiveUniverse} />
      </Canvas>
    </div>
  )
}
