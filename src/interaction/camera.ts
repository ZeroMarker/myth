import gsap from 'gsap'
import * as THREE from 'three'
import { camera, controls } from '../scene'
import { getNodePosition } from '../graph/nodes'

let currentTween: gsap.core.Tween | null = null

export function focusCameraOn(godId: string) {
  const pos = getNodePosition(godId)
  if (!pos) return

  // Cancel any in-progress tween
  if (currentTween) {
    currentTween.kill()
  }

  const targetDist = 6

  // Calculate camera target position: look at the node from slightly above and side
  const camTarget = new THREE.Vector3(
    pos.x + 3,
    pos.y + 2,
    pos.z + targetDist,
  )

  // Save the current controls target
  const oldTarget = controls.target.clone()

  currentTween = gsap.to(camera.position, {
    x: camTarget.x,
    y: camTarget.y,
    z: camTarget.z,
    duration: 1.2,
    ease: 'power3.inOut',
    onUpdate: () => {
      // Also lerp the controls target toward the node
      controls.target.lerp(pos, 0.08)
      controls.update()
    },
    onComplete: () => {
      controls.target.copy(pos)
      currentTween = null
    },
  })
}
