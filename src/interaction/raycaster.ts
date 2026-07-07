import * as THREE from 'three'
import { camera, controls, renderer } from '../scene'
import { nodeMeshes, nodeDataMap, nodeGroupMap } from '../graph/nodes'
import { edgeLines } from '../graph/edges'
import { updateInfoPanel } from '../ui/info-panel'
import { focusCameraOn } from './camera'
import gsap from 'gsap'

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()

let hoveredId: string | null = null
let selectedId: string | null = null
let highlightMode = false

// --- Get all interactive meshes ---
function getInteractiveMeshes(): THREE.Object3D[] {
  return Array.from(nodeMeshes.values())
}

// --- Highlight family (selected node + parents + children + partner) ---
function setHighlight(godId: string | null) {
  highlightMode = godId !== null

  if (!godId) {
    // Reset all
    nodeGroupMap.forEach((group) => {
      group.children.forEach((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
          gsap.to(child, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        }
      })
      gsap.to(group.position, { duration: 0.3, ease: 'power2.out' })
    })
    edgeLines.forEach((line) => {
      gsap.to(line.material, { opacity: line.material instanceof THREE.LineDashedMaterial ? 0.35 : 0.5, duration: 0.4 })
    })
    return
  }

  // Collect related ids: parents + children + partner
  const related = new Set<string>([godId])
  const god = nodeDataMap.get(godId)
  if (god) {
    god.parents.forEach((p) => related.add(p))
    // Find children (nodes that have this god as parent)
    nodeDataMap.forEach((n) => {
      if (n.parents.includes(godId)) related.add(n.id)
    })
    // Find partner via edges
    edgeLines.forEach((line) => {
      if (line.userData.type === 'partner') {
        if (line.userData.from === godId) related.add(line.userData.to)
        if (line.userData.to === godId) related.add(line.userData.from)
      }
    })
  }

  // Dim non-related
  nodeGroupMap.forEach((group, id) => {
    const isRelated = related.has(id)
    // Animate sphere material opacity and emissive
    const sphere = nodeMeshes.get(id)
    if (sphere && sphere.material instanceof THREE.MeshPhysicalMaterial) {
      gsap.to(sphere.material, {
        emissiveIntensity: isRelated ? 0.6 : 0.05,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
    // Scale
    if (id === godId) {
      gsap.to(group.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.4, ease: 'back.out(2)' })
    } else {
      gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'power2.out' })
    }
  })

  // Dim non-related edges
  edgeLines.forEach((line) => {
    const { from, to } = line.userData
    const isRelated = (from && related.has(from)) || (to && related.has(to))
    const targetOpacity = isRelated ? (line.material instanceof THREE.LineDashedMaterial ? 0.5 : 0.7) : 0.08
    gsap.to(line.material, { opacity: targetOpacity, duration: 0.4 })
  })
}

// --- Setup event listeners ---
export function setupInteraction() {
  const canvas = renderer.domElement

  canvas.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(getInteractiveMeshes())

    if (intersects.length > 0) {
      const godId = intersects[0].object.userData.godId
      if (godId && godId !== hoveredId) {
        hoveredId = godId
        canvas.style.cursor = 'pointer'
      }
    } else {
      if (hoveredId) {
        hoveredId = null
        canvas.style.cursor = 'default'
      }
    }
  })

  canvas.addEventListener('click', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(getInteractiveMeshes())

    if (intersects.length > 0) {
      const godId = intersects[0].object.userData.godId
      if (godId) {
        selectedId = godId
        setHighlight(godId)
        updateInfoPanel(godId)
        focusCameraOn(godId)
      }
    } else {
      // Deselect
      if (selectedId) {
        selectedId = null
        setHighlight(null)
        updateInfoPanel(null)
      }
    }
  })
}
