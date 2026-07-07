import { nodeDataMap } from '../graph/nodes'

const panel = document.getElementById('info-panel')!
const nameEl = document.getElementById('ip-name')!
const enEl = document.getElementById('ip-en')!
const titleEl = document.getElementById('ip-title')!
const descEl = document.getElementById('ip-desc')!
const parentsEl = document.getElementById('ip-parents')!
const childrenEl = document.getElementById('ip-children')!

export function updateInfoPanel(godId: string | null) {
  if (!godId) {
    panel.classList.remove('visible')
    return
  }

  const god = nodeDataMap.get(godId)
  if (!god) return

  nameEl.textContent = god.name
  enEl.textContent = god.nameEn
  titleEl.textContent = god.title
  descEl.textContent = god.description

  // Parents
  if (god.parents.length > 0) {
    const parentNames = god.parents.map((pid) => {
      const p = nodeDataMap.get(pid)
      return p ? p.name : pid
    })
    parentsEl.textContent = `父母：${parentNames.join('、')}`
  } else {
    parentsEl.textContent = '父母：无（原始神）'
  }

  // Children
  const children: string[] = []
  nodeDataMap.forEach((n) => {
    if (n.parents.includes(godId)) {
      children.push(n.name)
    }
  })
  if (children.length > 0) {
    childrenEl.textContent = `子女：${children.join('、')}`
  } else {
    childrenEl.textContent = ''
  }

  panel.classList.add('visible')
}
