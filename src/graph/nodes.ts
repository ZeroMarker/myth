import * as THREE from 'three'
import type { GodNode } from '../data/genealogy'
import { gods } from '../data/gods'
import { scene } from '../scene'

// --- Sprite glow texture ---
function createGlowTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)')
  gradient.addColorStop(0.5, 'rgba(255,255,255,0.15)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

const glowTexture = createGlowTexture()

// --- Store references for interaction ---
export const nodeMeshes: Map<string, THREE.Mesh> = new Map()
export const nodeDataMap: Map<string, GodNode> = new Map()
export const nodeGroupMap: Map<string, THREE.Group> = new Map()

gods.forEach((god) => {
  const color = new THREE.Color(god.color)

  // --- Group to hold everything ---
  const group = new THREE.Group()
  group.position.set(0, 0, 0)
  group.userData = { godId: god.id }

  // --- Core sphere ---
  const sphereGeo = new THREE.SphereGeometry(0.45, 24, 24)
  const sphereMat = new THREE.MeshPhysicalMaterial({
    color: color,
    emissive: color,
    emissiveIntensity: 0.3,
    metalness: 0.1,
    roughness: 0.3,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3,
  })
  const sphere = new THREE.Mesh(sphereGeo, sphereMat)
  sphere.userData = { godId: god.id }
  group.add(sphere)
  nodeMeshes.set(god.id, sphere)

  // --- Glow sprite ---
  const spriteMat = new THREE.SpriteMaterial({
    map: glowTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.6,
    color: color,
  })
  const sprite = new THREE.Sprite(spriteMat)
  sprite.scale.set(2.2, 2.2, 1)
  group.add(sprite)

  // --- Inner ring (pulse ring) ---
  const ringGeo = new THREE.RingGeometry(0.5, 0.6, 32)
  const ringMat = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = Math.random() * Math.PI
  ring.rotation.y = Math.random() * Math.PI
  group.add(ring)
  group.userData.ring = ring

  scene.add(group)
  nodeGroupMap.set(god.id, group)
  nodeDataMap.set(god.id, god)
})

// --- Update positions ---
export function updateNodePosition(id: string, x: number, y: number, z: number) {
  const group = nodeGroupMap.get(id)
  if (group) group.position.set(x, y, z)
}

export function getNodePosition(id: string): THREE.Vector3 {
  return nodeGroupMap.get(id)?.position.clone() ?? new THREE.Vector3(0, 0, 0)
}

// --- Pulse animation (called each frame) ---
export function animateNodes(time: number) {
  nodeGroupMap.forEach((group) => {
    const ring = group.userData.ring as THREE.Mesh
    if (ring) {
      ring.rotation.z = time * 0.3
      const scale = 1 + Math.sin(time * 1.2 + group.position.x) * 0.06
      ring.scale.set(scale, scale, scale)
    }
  })
}
