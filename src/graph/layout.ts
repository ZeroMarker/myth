import { gods } from '../data/gods'
import { updateNodePosition } from './nodes'
import * as THREE from 'three'

interface LayoutNode {
  id: string
  generation: number
  parentIds: string[]
  x: number
  z: number
}

// --- Collect layout info ---
const layoutNodes: LayoutNode[] = gods.map((g) => ({
  id: g.id,
  generation: g.generation,
  parentIds: g.parents,
  x: 0,
  z: 0,
}))

const maxGen = Math.max(...gods.map((g) => g.generation))
const minGen = Math.min(...gods.map((g) => g.generation))
const genCount = maxGen - minGen + 1

// --- Group by generation ---
const byGen: Map<number, LayoutNode[]> = new Map()
layoutNodes.forEach((n) => {
  if (!byGen.has(n.generation)) byGen.set(n.generation, [])
  byGen.get(n.generation)!.push(n)
})

// ============================================================
// Layout: concentric arcs by generation
// Generations are arranged along Z (front-to-back)
// Within each generation, nodes are spread on X
// ============================================================
const GEN_SPACING = 2.8       // vertical (z) distance between generations
const BASE_RADIUS = 2.5       // innermost generation radius
const RADIUS_STEP = 1.2       // how much wider each generation gets

function computeLayout() {
  // Sort generations from 0 (Chaos) upward
  const sortedGens = Array.from(byGen.entries()).sort((a, b) => a[0] - b[0])

  // Map generation number to Z position
  const genZ = new Map<number, number>()
  sortedGens.forEach(([gen], idx) => {
    // Center the layout at z=0
    const centerIdx = (genCount - 1) / 2
    genZ.set(gen, (idx - centerIdx) * GEN_SPACING)
  })

  // For each generation, place nodes along an arc
  sortedGens.forEach(([gen, nodes]) => {
    const z = genZ.get(gen) ?? 0
    const radius = BASE_RADIUS + gen * RADIUS_STEP
    const count = nodes.length
    const angleStep = Math.PI / Math.max(count, 1)

    // Starting angle - slightly offset for visual interest
    const startAngle = -Math.PI / 2 - (angleStep * (count - 1)) / 2

    nodes.forEach((node, i) => {
      const angle = startAngle + i * angleStep
      // Add slight z-variation within generation for depth
      const zOffset = (Math.random() - 0.5) * 0.4
      node.x = Math.cos(angle) * radius
      node.z = z + Math.sin(angle) * radius * 0.3 + zOffset
    })
  })

  // --- Special adjustments for family clustering ---
  // Group children near their parents in the Y-direction
  // (We use Y for vertical in the scene, but our layout is on XZ-Y plane)
  // Actually, let's use Y for vertical = generation height
  
  // Convert from XZ layout to XYZ where Y = generation height
  // X = same X, Z becomes X-depth, Y becomes vertical
  const yCenter = 0
  sortedGens.forEach(([gen, nodes]) => {
    const yOffset = (gen - minGen) * GEN_SPACING - (genCount - 1) * GEN_SPACING / 2
    nodes.forEach((node) => {
      updateNodePosition(node.id, node.x, yOffset, node.z)
    })
  })
}

export function applyLayout() {
  computeLayout()
}
