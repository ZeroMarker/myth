import { startRenderLoop, controls } from './scene'
import { applyLayout } from './graph/layout'
import { buildEdges, animateEdges } from './graph/edges'
import { animateNodes } from './graph/nodes'
import { createLabels, labelRenderer, renderLabels } from './graph/labels'
import { createStarfield } from './graph/starfield'
import { setupInteraction } from './interaction/raycaster'
import { playEntranceAnimation } from './animation/gsap-anim'

// --- Step 1: Apply layout to all nodes ---
applyLayout()

// --- Step 2: Create CSS2D labels (before scatter, so labels follow nodes) ---
createLabels()

// --- Step 3: Create starfield background ---
const animateStars = createStarfield()

// --- Step 4: Set up interaction ---
setupInteraction()

// --- Step 5: Play entrance animation (nodes scatter, then return) ---
const entranceTimeline = playEntranceAnimation()

// --- Step 6: Build edges + hide loading AFTER entrance completes ---
entranceTimeline.eventCallback('onComplete', () => {
  buildEdges()
  controls.autoRotate = true
  const loading = document.getElementById('loading')
  if (loading) loading.classList.add('hidden')
})

// --- Step 7: Start render loop ---
startRenderLoop(() => {
  const time = performance.now() / 1000
  animateNodes(time)
  animateEdges(time)
  animateStars(time)
  renderLabels()
})
