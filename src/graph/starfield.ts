import * as THREE from 'three'
import { scene } from '../scene'

// --- Star field background ---
const STAR_COUNT = 2000

export function createStarfield() {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(STAR_COUNT * 3)
  const colors = new Float32Array(STAR_COUNT * 3)
  const sizes = new Float32Array(STAR_COUNT)

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3
    const radius = 60 + Math.random() * 60
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    const brightness = 0.3 + Math.random() * 0.7
    // Slight color variation
    const tint = Math.random()
    if (tint < 0.1) {
      // Warm tint
      colors[i3] = brightness
      colors[i3 + 1] = brightness * 0.85
      colors[i3 + 2] = brightness * 0.7
    } else if (tint < 0.2) {
      // Cool tint
      colors[i3] = brightness * 0.7
      colors[i3 + 1] = brightness * 0.8
      colors[i3 + 2] = brightness
    } else {
      colors[i3] = brightness
      colors[i3 + 1] = brightness
      colors[i3 + 2] = brightness
    }

    sizes[i] = 0.5 + Math.random() * 1.5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })

  const stars = new THREE.Points(geometry, material)
  scene.add(stars)

  // Slow rotation animation
  function animateStars(time: number) {
    stars.rotation.y = time * 0.002
    stars.rotation.x = Math.sin(time * 0.001) * 0.02
  }

  return animateStars
}
