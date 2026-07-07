import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { scene, camera } from '../scene'
import { nodeGroupMap, nodeDataMap } from './nodes'

// --- CSS2D Label Renderer ---
export const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0'
labelRenderer.domElement.style.left = '0'
labelRenderer.domElement.style.pointerEvents = 'none' // let clicks pass through
document.getElementById('app')!.appendChild(labelRenderer.domElement)

// --- Attach labels to every node group ---
export function createLabels() {
  nodeGroupMap.forEach((group, id) => {
    const god = nodeDataMap.get(id)
    if (!god) return

    const div = document.createElement('div')
    div.className = 'god-label'
    div.innerHTML = `${god.name}<span class="sub">${god.nameEn}</span>`
    const label = new CSS2DObject(div)
    label.position.set(0, 0.8, 0) // Above the sphere
    group.add(label)
  })
}

// --- Update label renderer (call each frame after camera update) ---
export function renderLabels() {
  labelRenderer.render(scene, camera)
}
