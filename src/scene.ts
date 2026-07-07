import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0a12)

// --- Camera ---
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(10, 8, 18)
camera.lookAt(0, 0, 0)

// --- Renderer ---
export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
document.getElementById('app')!.appendChild(renderer.domElement)

// --- Controls ---
export const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.minDistance = 4
controls.maxDistance = 40
controls.autoRotate = false
controls.autoRotateSpeed = 0.5
controls.target.set(0, 0, 0)

// --- Lights ---
const ambient = new THREE.AmbientLight(0x404060, 0.5)
scene.add(ambient)

const mainLight = new THREE.DirectionalLight(0xffeedd, 2)
mainLight.position.set(10, 20, 10)
scene.add(mainLight)

const fillLight = new THREE.DirectionalLight(0x4488ff, 0.6)
fillLight.position.set(-10, 0, -10)
scene.add(fillLight)

const rimLight = new THREE.DirectionalLight(0xffffff, 0.4)
rimLight.position.set(0, -10, 10)
scene.add(rimLight)

// --- Resize handler ---
window.addEventListener('resize', () => {
  const w = window.innerWidth
  const h = window.innerHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
})

// --- Animation loop ---
export function startRenderLoop(callback?: () => void) {
  function animate() {
    requestAnimationFrame(animate)
    controls.update()
    callback?.()
    renderer.render(scene, camera)
  }
  animate()
}
