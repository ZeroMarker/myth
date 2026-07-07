import gsap from 'gsap'
import * as THREE from 'three'
import { nodeGroupMap, nodeDataMap } from '../graph/nodes'
import { edgeLines } from '../graph/edges'
import { gods } from '../data/gods'

// --- Entrance animation: nodes pop in one by one ---
export function playEntranceAnimation() {
  // Sort by generation, then by order in array
  const sorted = [...gods].sort((a, b) => a.generation - b.generation)

  // Start all nodes invisible and at a slight offset
  const startPositions: Map<string, { x: number; y: number; z: number }> = new Map()
  nodeGroupMap.forEach((group, id) => {
    startPositions.set(id, { x: group.position.x, y: group.position.y, z: group.position.z })
    const god = nodeDataMap.get(id)
    // Start below and slightly scattered
    group.position.y -= 3 + Math.random() * 2
    group.position.x += (Math.random() - 0.5) * 4
    group.position.z += (Math.random() - 0.5) * 4
    group.scale.set(0, 0, 0)
  })

  // Hide all edges initially
  edgeLines.forEach((line) => {
    line.visible = false
  })

  // Stagger entrance by generation
  const timeline = gsap.timeline({ delay: 0.3 })

  sorted.forEach((god, idx) => {
    const group = nodeGroupMap.get(god.id)
    const startPos = startPositions.get(god.id)
    if (!group || !startPos) return

    const delay = god.generation * 0.25 + idx * 0.04

    timeline.to(
      group.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: 'back.out(2)',
      },
      delay,
    )

    timeline.to(
      group.position,
      {
        x: startPos.x,
        y: startPos.y,
        z: startPos.z,
        duration: 0.7,
        ease: 'power3.out',
      },
      delay,
    )

    // Show edges for this node after it appears
    const nodeEdges = edgeLines.filter((l) => l.userData.to === god.id || l.userData.from === god.id)
    nodeEdges.forEach((line) => {
      timeline.to(
        line,
        {
          visible: true,
          duration: 0.01,
        },
        delay + 0.5,
      )
      if (line.material) {
        gsap.fromTo(
          line.material,
          { opacity: 0 },
          { opacity: line.material instanceof THREE.LineDashedMaterial ? 0.35 : 0.5, duration: 0.5, delay: delay + 0.5 },
        )
      }
    })
  })

  return timeline
}
