import * as THREE from 'three'
import { scene } from '../scene'
import { getNodePosition } from './nodes'
import { gods, relations } from '../data/gods'
import type { Relation } from '../data/genealogy'

// --- Parenting edges (child → parent) ---
export const edgeLines: THREE.Line[] = []

function createCurvedLine(
  from: THREE.Vector3,
  to: THREE.Vector3,
  color: THREE.Color,
  dashed = false,
  dashOffset = 0,
): THREE.Line {
  const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
  // Arc upward proportional to distance
  const dist = from.distanceTo(to)
  mid.y += Math.max(0.5, dist * 0.25)

  const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone())
  const points = curve.getPoints(32)
  const geo = new THREE.BufferGeometry().setFromPoints(points)

  let mat: THREE.LineBasicMaterial | THREE.LineDashedMaterial
  if (dashed) {
    mat = new THREE.LineDashedMaterial({
      color,
      transparent: true,
      opacity: 0.35,
      dashSize: 0.12,
      gapSize: 0.08,
      depthWrite: false,
    })
  } else {
    mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    })
  }

  const line = new THREE.Line(geo, mat)
  if (dashed) {
    line.computeLineDistances()
    line.userData.dashOffset = dashOffset
  }
  return line
}

// --- Build all edges ---
export function buildEdges() {
  // Clear previous
  edgeLines.forEach((l) => scene.remove(l))
  edgeLines.length = 0

  // 1. Parent-child edges (for every god, connect to their parents)
  gods.forEach((god) => {
    const childPos = getNodePosition(god.id)
    god.parents.forEach((parentId) => {
      const parentPos = getNodePosition(parentId)
      // Only draw if positions aren't at origin (layout not applied yet)
      if (parentPos.length() > 0.01 || childPos.length() > 0.01) {
        const line = createCurvedLine(
          parentPos,
          childPos,
          new THREE.Color(0x8888aa),
          false,
        )
        line.userData = { from: parentId, to: god.id, type: 'parent' }
        scene.add(line)
        edgeLines.push(line)
      }
    })
  })

  // 2. Partner edges (dashed)
  relations
    .filter((r) => r.type === 'partner')
    .forEach((rel) => {
      const fromPos = getNodePosition(rel.from)
      const toPos = getNodePosition(rel.to)
      if (fromPos.length() > 0.01 || toPos.length() > 0.01) {
        const mid = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5)
        mid.y += 0.3
        const line = createCurvedLine(fromPos, toPos, new THREE.Color(0xccaacc), true, Math.random() * 10)
        line.userData = { from: rel.from, to: rel.to, type: 'partner' }
        scene.add(line)
        edgeLines.push(line)
      }
    })
}

// --- Update edge positions after layout change ---
export function updateEdges() {
  // For each edge, recalculate curve geometry
  edgeLines.forEach((line) => {
    const { from, to } = line.userData
    if (!from || !to) return
    const fromPos = getNodePosition(from)
    const toPos = getNodePosition(to)
    if (fromPos.length() < 0.01 && toPos.length() < 0.01) return

    const mid = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5)
    const dist = fromPos.distanceTo(toPos)
    mid.y += Math.max(0.5, dist * 0.25)

    const curve = new THREE.QuadraticBezierCurve3(fromPos.clone(), mid, toPos.clone())
    const points = curve.getPoints(32)
    line.geometry.dispose()
    line.geometry = new THREE.BufferGeometry().setFromPoints(points)
    if (line.material instanceof THREE.LineDashedMaterial) {
      line.computeLineDistances()
    }
  })
}

// --- Edge flow animation (called each frame) ---
export function animateEdges(time: number) {
  edgeLines.forEach((line) => {
    if (line.material instanceof THREE.LineDashedMaterial) {
      // Animate dash offset for flow effect
      const offset = (line.userData.dashOffset ?? 0) + time * 0.05
      line.userData.dashOffset = offset
      const mat = line.material as any
      mat.dashOffset = -offset
    }
  })
}
