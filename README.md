# 🏛️ 希腊神话神谱 — Theogony

基于 [Three.js](https://threejs.org/) 和 [GSAP](https://gsap.com/) 构建的 3D 互动神谱家谱。  
以赫西俄德《神谱》为蓝本，在三维空间中呈现从混沌到奥林匹斯众神的完整谱系。

> 🌐 **在线体验**：[zeromarker.github.io/myth](https://zeromarker.github.io/myth/)

---

## ✨ 功能

- **50+ 神祇节点** — 涵盖 Chaos → 原始神 → 十二泰坦 → 奥林匹斯众神 → 第二代神
- **3D 空间布局** — 按世代分层，弧形展开，可自由旋转/缩放
- **点击交互** — 点击神祇节点，高亮其亲属关系（父母/子女/配偶）
- **信息面板** — 侧边显示神的中英文名、神职、描述、父母与子女
- **相机聚焦** — GSAP 驱动的平滑过渡，自动聚焦到选中神祇
- **入场动画** — 节点逐个从底部绽放，连线随之生长
- **动态效果** — 节点脉动光环、连线流动光点、旋转星空背景

## 🎮 操作

| 操作 | 效果 |
|------|------|
| 🖱 拖拽 | 旋转 3D 视角 |
| 🔄 滚轮 | 缩放 |
| 👆 点击 | 选中神祇，查看详情 |
| 🌀 自动旋转 | 静态时缓慢自转 |

## 🧱 技术栈

| 工具 | 用途 |
|------|------|
| [Vite](https://vitejs.dev/) | 构建工具 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [Three.js](https://threejs.org/) | 3D 渲染 |
| [GSAP](https://gsap.com/) | 动画引擎 |
| [CSS2DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer) | 文字标签 |
| [GitHub Pages](https://pages.github.com/) | 部署托管 |

## 📂 项目结构

```
myth/
├── index.html                # 入口 HTML + 信息面板
├── src/
│   ├── main.ts               # 入口：整合所有模块
│   ├── scene.ts              # Three.js 场景/相机/灯光/OrbitControls
│   ├── data/
│   │   ├── genealogy.ts      # 类型定义
│   │   └── gods.ts           # 50+ 神祇数据 + 伴侣关系
│   ├── graph/
│   │   ├── nodes.ts          # 3D 球体节点 + 发光精灵 + 脉动环
│   │   ├── edges.ts          # 亲子弧线 + 伴侣虚线
│   │   ├── layout.ts         # 按 generation 分层布局
│   │   ├── labels.ts         # CSS2D 中文+英文名称标签
│   │   └── starfield.ts      # 星空粒子背景
│   ├── interaction/
│   │   ├── raycaster.ts      # 悬停/点击拾取 + 亲属高亮
│   │   └── camera.ts         # GSAP 相机聚焦动画
│   ├── animation/
│   │   └── gsap-anim.ts      # 节点绽放入场 + 连线生长
│   └── ui/
│       └── info-panel.ts     # 侧边神祇详情面板
└── .github/workflows/
    └── deploy.yml            # GitHub Pages 自动部署
```

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 📜 数据来源

神谱数据依据赫西俄德（Hesiod）的《神谱》（*Theogony*）整理，涵盖主要谱系：

```
混沌 (Chaos)
 ├── 盖亚 (Gaia) — 大地
 ├── 塔耳塔洛斯 (Tartarus) — 深渊
 ├── 厄洛斯 (Eros) — 原始爱欲
 ├── 厄瑞玻斯 (Erebus) — 黑暗
 └── 倪克斯 (Nyx) — 黑夜
      ...
```

## 📄 License

MIT
