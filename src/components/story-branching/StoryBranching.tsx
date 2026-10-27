import { brailleCells } from '../../lib/braille-cells'
import { useEffect, useRef, useState, useCallback, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import './story-branching.css'

const ramp = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)))
const smooth = (t: number) => t * t * (3 - 2 * t)

const LOOP_DURATION = 13000 // 13秒完整双轨顺序推演循环

// 紧密连续的 ASCII 灰度阶梯（不留白，暗部亦保持细腻微字模）
const WAVE_CHARS = '⠁⠃⠇⠏⠟⠿⡿⣿'

// 分支 A（活跃推进线：雨夜钟楼）参数设定 (16:10 比例)
const BASE_A_W = 480
const BASE_A_H = 300
const COLS_A = 48
const ROWS_A = 30
const TOTAL_CELLS_A = COLS_A * ROWS_A

// 分支 B（平行保留线：涉水旧街）参数设定 (16:10 比例)
const BASE_B_W = 400
const BASE_B_H = 250
const COLS_B = 40
const ROWS_B = 25
const TOTAL_CELLS_B = COLS_B * ROWS_B

// 分支 A AI 思维流段落
const reasoningParagraphsA = [
  '分支判定：选择「潜入雨夜钟楼避雨，俯瞰整座沉睡城市」。载入夏日河谷初遇记忆，分支置信度 0.95。',
  '环境物理模拟：暴雨骤降，能见度骤降，雷鸣在生锈螺旋铁梯间震颤回响。小夏加快脚步，拉紧衣袖带你登上天台。',
  '场景构图解构：推开沉重天窗，水汽与夜风扑面而来。整座沉睡雨城的万家灯火在雨幕中化为连绵金色星河。',
  '小夏回眸灿烂微笑：「整座城市的灯火都在我们脚下。今晚的秘密，只有我们知道。」',
  '扩散采样启动：自推理核心波前向全画幅经纬网格扩散解构，色彩矩阵收敛……',
]

// 分支 B AI 思维流段落（平行归档）
const reasoningParagraphsB = [
  '备选判定：选择「涉水折返旧街，去街角咖啡馆躲雨」。平行现场状态完好归档，不覆写主线时间线。',
  '街区氛围推演：石板路积水如镜，倒映沿街闭店招牌的暖黄微光。伞面狭小促使身体靠近，听觉聚焦伞骨清脆雨声。',
  '场景构图解构：小夏挽住手肘避开水洼，享受片刻宁静。街角咖啡馆暖光橱窗透出水汽，相视一笑。',
  '状态快照持久化：快照向量完好冻结，支持随时无损切回。「走吧，先去街角避一避。」',
  '扩散采样启动：平行特征向量收敛，保持低饱和归档渲染……',
]

interface AsciiCellData {
  char: string
  r: number
  g: number
  b: number
  lum: number
  x: number
  y: number
  distFromReasoning: number
}

// 从底图中提取贴合指定画幅的高密 ASCII 网格数据
function sampleImageToCells(
  img: HTMLImageElement,
  cols: number,
  rows: number,
  baseW: number,
  baseH: number,
  originX: number,
  originY: number
): AsciiCellData[] {
  const off = document.createElement('canvas')
  off.width = cols * 2
  off.height = rows * 4
  const offCtx = off.getContext('2d', { willReadFrequently: true })
  if (!offCtx) return []

  offCtx.drawImage(img, 0, 0, cols * 2, rows * 4)
  const imgData = brailleCells(offCtx.getImageData(0, 0, cols * 2, rows * 4).data, cols, rows)
  const cells: AsciiCellData[] = []
  const cellW = baseW / cols
  const cellH = baseH / rows

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const { char, r: red, g: green, b: blue, lum } = imgData[r * cols + c]

      // 坐标严格覆盖 0..baseW, 0..baseH，零多余边距
      const cellX = (c + 0.5) * cellW
      const cellY = (r + 0.5) * cellH

      const dx = (cellX - originX) / (baseW / 2)
      const dy = (cellY - originY) / (baseH / 2)
      const distFromReasoning = Math.sqrt(dx * dx + dy * dy)

      const cr = Math.max(30, red)
      const cg = Math.max(36, green)
      const cb = Math.max(42, blue)

      cells.push({
        char,
        r: cr,
        g: cg,
        b: cb,
        lum,
        x: cellX,
        y: cellY,
        distFromReasoning,
      })
    }
  }

  return cells
}

export interface StoryBranchingProps {
  bannerSource?: string
  bannerA?: string
  bannerB?: string
}

export default function StoryBranching({
  bannerSource = '/images/nom/banners/nom-banner-012.png',
  bannerA = '/images/nom/banners/nom-banner-005.png',
  bannerB = '/images/nom/banners/nom-banner-008.png',
}: StoryBranchingProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const forkARef = useRef<HTMLDivElement>(null)
  const forkBRef = useRef<HTMLDivElement>(null)
  const cardARef = useRef<HTMLDivElement>(null)
  const cardBRef = useRef<HTMLDivElement>(null)

  const canvasARef = useRef<HTMLCanvasElement>(null)
  const canvasBRef = useRef<HTMLCanvasElement>(null)
  const pathARef = useRef<SVGPathElement>(null)
  const pathBRef = useRef<SVGPathElement>(null)

  const startTimeRef = useRef<number>(0)
  const cellsRefA = useRef<AsciiCellData[]>([])
  const cellsRefB = useRef<AsciiCellData[]>([])

  const [progress, setProgress] = useState(0)
  const [dataReady, setDataReady] = useState(false)
  const [svgPathA, setSvgPathA] = useState('')
  const [svgPathB, setSvgPathB] = useState('')
  const [pulseA, setPulseA] = useState<{ x: number; y: number } | null>(null)
  const [pulseB, setPulseB] = useState<{ x: number; y: number } | null>(null)

  const reduced = useReducedMotion()

  // 1. 预载底图并提取覆盖画幅的高密 ASCII 矩阵
  useEffect(() => {
    let loadedCount = 0
    const checkReady = () => {
      loadedCount++
      if (loadedCount >= 2) setDataReady(true)
    }

    const imgA = new Image()
    imgA.crossOrigin = 'anonymous'
    imgA.onload = () => {
      try {
        cellsRefA.current = sampleImageToCells(
          imgA,
          COLS_A,
          ROWS_A,
          BASE_A_W,
          BASE_A_H,
          BASE_A_W / 2,
          75
        )
      } catch {
        // 兜底
      }
      checkReady()
    }
    imgA.src = bannerA

    const imgB = new Image()
    imgB.crossOrigin = 'anonymous'
    imgB.onload = () => {
      try {
        cellsRefB.current = sampleImageToCells(
          imgB,
          COLS_B,
          ROWS_B,
          BASE_B_W,
          BASE_B_H,
          BASE_B_W / 2,
          65
        )
      } catch {
        // 兜底
      }
      checkReady()
    }
    imgB.src = bannerB
  }, [bannerA, bannerB])

  // 2. 重新播放
  const handleReplay = useCallback(() => {
    startTimeRef.current = performance.now()
    setProgress(0)
  }, [])

  // 3. 自主时间循环（RAF 驱动）
  useEffect(() => {
    if (reduced) return
    startTimeRef.current = performance.now()
    let frameId = 0

    const loop = (now: number) => {
      const elapsed = now - startTimeRef.current
      const p = (elapsed % LOOP_DURATION) / LOOP_DURATION
      setProgress(p)
      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [reduced])

  // 4. 计算源节点分支到右侧卡片的物理连线路径 (SVG 连线)
  const updateConnectors = useCallback(() => {
    if (!stageRef.current || !forkARef.current || !forkBRef.current || !cardARef.current || !cardBRef.current) return
    const stage = stageRef.current.getBoundingClientRect()
    const fa = forkARef.current.getBoundingClientRect()
    const fb = forkBRef.current.getBoundingClientRect()
    const ca = cardARef.current.getBoundingClientRect()
    const cb = cardBRef.current.getBoundingClientRect()

    const x1a = fa.right - stage.left + 2
    const y1a = fa.top + fa.height / 2 - stage.top
    const x2a = ca.left - stage.left - 4
    const y2a = ca.top + 14 - stage.top

    const x1b = fb.right - stage.left + 2
    const y1b = fb.top + fb.height / 2 - stage.top
    const x2b = cb.left - stage.left - 4
    const y2b = cb.top + 14 - stage.top

    const dxA = x2a - x1a
    const c1xA = x1a + dxA * 0.45
    const c2xA = x1a + dxA * 0.55
    setSvgPathA(`M ${x1a} ${y1a} C ${c1xA} ${y1a}, ${c2xA} ${y2a}, ${x2a} ${y2a}`)

    const dxB = x2b - x1b
    const c1xB = x1b + dxB * 0.45
    const c2xB = x1b + dxB * 0.55
    setSvgPathB(`M ${x1b} ${y1b} C ${c1xB} ${y1b}, ${c2xB} ${y2b}, ${x2b} ${y2b}`)
  }, [])

  useEffect(() => {
    updateConnectors()
    window.addEventListener('resize', updateConnectors)
    const t = setTimeout(updateConnectors, 200)
    return () => {
      window.removeEventListener('resize', updateConnectors)
      clearTimeout(t)
    }
  }, [updateConnectors])

  // 5. 顺序时间线信号：先分叉 1，再分叉 2
  useEffect(() => {
    const p = reduced ? 1 : progress
    // 脉冲 A：0.05 ~ 0.12 前往分支 01
    if (p >= 0.05 && p <= 0.12) {
      const pulseT = smooth(ramp(p, 0.05, 0.12))
      if (pathARef.current) {
        try {
          const lenA = pathARef.current.getTotalLength()
          const ptA = pathARef.current.getPointAtLength(pulseT * lenA)
          setPulseA({ x: ptA.x, y: ptA.y })
        } catch {
          // 兜底
        }
      }
    } else {
      setPulseA(null)
    }

    // 脉冲 B：0.46 ~ 0.54 从分歧点二次分叉，前往分支 02
    if (p >= 0.46 && p <= 0.54) {
      const pulseT = smooth(ramp(p, 0.46, 0.54))
      if (pathBRef.current) {
        try {
          const lenB = pathBRef.current.getTotalLength()
          const ptB = pathBRef.current.getPointAtLength(pulseT * lenB)
          setPulseB({ x: ptB.x, y: ptB.y })
        } catch {
          // 兜底
        }
      }
    } else {
      setPulseB(null)
    }
  }, [progress, reduced])

  // 6. 全屏宏大淡雅 ASCII 状态矩阵背景渲染（优化：移除 Git 提交短 ID，采用自然深邃的叙事流与状态经纬纹理）
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.max(2, window.devicePixelRatio || 1)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr
      canvas.height = h * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, w, h)

    const p = reduced ? 1 : progress
    const loopAlpha = 1 - smooth(ramp(p, 0.94, 0.98))
    ctx.globalAlpha = loopAlpha

    ctx.font = '10px -apple-system, BlinkMacSystemFont, "PingFang SC", monospace'
    ctx.textBaseline = 'middle'

    // 背景微细时间线刻度纵轨
    const trackCount = Math.max(6, Math.floor(w / 140))
    const startX = 70
    const colStep = (w - 140) / trackCount

    for (let t = 0; t <= trackCount; t++) {
      const x = startX + t * colStep
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)'
      for (let y = 30; y < h - 40; y += 28) {
        ctx.fillText('·', x, y)
      }
    }

    // 优化的淡色经纬叙事状态块（消除 Git 短哈希，代之以深邃的时空潜空间状态矩阵）
    const ambientBlocks = [
      {
        x: 60,
        y: 45,
        lines: [
          '[TIMELINE_LATENT_MATRIX // DEPTH: 02 // ZERO_OVERWRITE: TRUE]',
          'LATENT_RESONANCE: 0.9412  |  STREAM_CHUNKS: 0x3F8A..0x3F9E',
          'STATUS: MULTI_BRANCH_EXPANDING [NON_DESTRUCTIVE_PERSISTENCE]',
        ],
        color: 'rgba(107, 154, 196, 0.09)',
      },
      {
        x: Math.max(60, w * 0.45),
        y: Math.max(60, h * 0.44),
        lines: [
          'STREAM.BRANCH_01 :: 夏日骤雨 ➔ 钟楼天台俯瞰 [ACTIVE_VECTOR: 0.95]',
          'STREAM.BRANCH_02 :: 夏日骤雨 ➔ 涉水旧街避雨 [PARALLEL_SNAPSHOT: 0.88]',
          'SNAPSHOT_INTEGRITY: 100% UNTOUCHED // ROLLBACK_SAFETY: SECURE',
        ],
        color: 'rgba(255, 255, 255, 0.04)',
      },
    ]

    ambientBlocks.forEach((block) => {
      ctx.fillStyle = block.color
      block.lines.forEach((line, idx) => {
        ctx.fillText(line, block.x, block.y + idx * 17)
      })
    })

    ctx.restore()
  }, [progress, reduced])

  // 7. 分支 A 核心动画渲染（推理 ➔ 原位直接扩散 ➔ 全幅彩色 ASCII ➔ 显影）
  useEffect(() => {
    const canvas = canvasARef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.max(2, window.devicePixelRatio || 1)
    if (canvas.width !== BASE_A_W * dpr || canvas.height !== BASE_A_H * dpr) {
      canvas.width = BASE_A_W * dpr
      canvas.height = BASE_A_H * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, BASE_A_W, BASE_A_H)

    const p = reduced ? 1 : progress
    const loopAlpha = 1 - smooth(ramp(p, 0.94, 0.98))

    // 阶段进度
    const typeP = smooth(ramp(p, 0.08, 0.22))
    const diffuseP = smooth(ramp(p, 0.22, 0.36))
    const asciiFadeOut = 1 - smooth(ramp(p, 0.36, 0.44))

    // 【阶段一】：推理文字流
    if (p >= 0.08 && p < 0.30) {
      const flatText = reasoningParagraphsA.join('\n')
      const totalChars = flatText.length
      const visibleCount = Math.floor(typeP * totalChars)
      const textAlpha = 1 - smooth(ramp(p, 0.22, 0.28))

      if (textAlpha > 0 && visibleCount > 0) {
        ctx.globalAlpha = loopAlpha * textAlpha
        ctx.font = '11.5px -apple-system, BlinkMacSystemFont, "PingFang SC", monospace'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'

        const padX = 18
        let curX = padX
        let curY = 24
        const lineHeight = 18
        const charWidth = 13.5
        const maxRight = BASE_A_W - padX

        for (let i = 0; i < visibleCount; i++) {
          const char = flatText[i]
          if (char === '\n') {
            curX = padX
            curY += lineHeight + 5
            continue
          }

          ctx.fillStyle = '#c3cdd3'
          ctx.fillText(char, curX, curY)
          curX += charWidth
          if (curX + charWidth > maxRight) {
            curX = padX
            curY += lineHeight
          }
        }

        // 光标
        if (visibleCount < totalChars && p < 0.22) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(curX + 1, curY - 5, 2, 12)
        }
      }
    }

    // 【阶段二】：从推理处直接扩散为全幅彩色高密 ASCII (0.22 ~ 0.44)
    if (diffuseP > 0 && asciiFadeOut > 0 && dataReady) {
      ctx.globalAlpha = loopAlpha * asciiFadeOut
      ctx.font = '10px "Apple Braille", "Segoe UI Symbol", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const cells = cellsRefA.current
      const waveRadius = diffuseP * 2.4

      for (let i = 0; i < TOTAL_CELLS_A; i++) {
        const cell = cells[i]
        if (!cell) continue
        if (cell.distFromReasoning > waveRadius) continue

        const isWaveFront = Math.abs(cell.distFromReasoning - waveRadius) < 0.28 && diffuseP < 0.96
        let charToDraw = cell.char
        let colorToDraw = `rgb(${cell.r}, ${cell.g}, ${cell.b})`

        if (isWaveFront && Math.random() > 0.35) {
          charToDraw = WAVE_CHARS[Math.floor(Math.random() * WAVE_CHARS.length)]
          colorToDraw = '#9ec2df'
        }

        ctx.fillStyle = colorToDraw
        ctx.fillText(charToDraw, cell.x, cell.y)
      }
    }

    ctx.restore()
  }, [progress, dataReady, reduced])

  // 8. 分支 B 核心动画渲染（顺序执行：在 0.50 触发后展开）
  useEffect(() => {
    const canvas = canvasBRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.max(2, window.devicePixelRatio || 1)
    if (canvas.width !== BASE_B_W * dpr || canvas.height !== BASE_B_H * dpr) {
      canvas.width = BASE_B_W * dpr
      canvas.height = BASE_B_H * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, BASE_B_W, BASE_B_H)

    const p = reduced ? 1 : progress
    const loopAlpha = 1 - smooth(ramp(p, 0.94, 0.98))

    // 阶段进度
    const typeP = smooth(ramp(p, 0.50, 0.64))
    const diffuseP = smooth(ramp(p, 0.64, 0.76))
    const asciiFadeOut = 1 - smooth(ramp(p, 0.76, 0.84))

    // 【阶段一】：分支 B 推理文字流
    if (p >= 0.50 && p < 0.70) {
      const flatText = reasoningParagraphsB.join('\n')
      const totalChars = flatText.length
      const visibleCount = Math.floor(typeP * totalChars)
      const textAlpha = 1 - smooth(ramp(p, 0.64, 0.70))

      if (textAlpha > 0 && visibleCount > 0) {
        ctx.globalAlpha = loopAlpha * textAlpha
        ctx.font = '11px -apple-system, BlinkMacSystemFont, "PingFang SC", monospace'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'

        const padX = 16
        let curX = padX
        let curY = 22
        const lineHeight = 17
        const charWidth = 12.8
        const maxRight = BASE_B_W - padX

        for (let i = 0; i < visibleCount; i++) {
          const char = flatText[i]
          if (char === '\n') {
            curX = padX
            curY += lineHeight + 5
            continue
          }

          ctx.fillStyle = '#b0bac2'
          ctx.fillText(char, curX, curY)
          curX += charWidth
          if (curX + charWidth > maxRight) {
            curX = padX
            curY += lineHeight
          }
        }

        // 光标
        if (visibleCount < totalChars && p < 0.64) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(curX + 1, curY - 5, 2, 12)
        }
      }
    }

    // 【阶段二】：分支 B 从推理处扩散为全幅高密 ASCII (0.64 ~ 0.84)
    if (diffuseP > 0 && asciiFadeOut > 0 && dataReady) {
      ctx.globalAlpha = loopAlpha * asciiFadeOut
      ctx.font = '9.5px "Apple Braille", "Segoe UI Symbol", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const cells = cellsRefB.current
      const waveRadius = diffuseP * 2.4

      for (let i = 0; i < TOTAL_CELLS_B; i++) {
        const cell = cells[i]
        if (!cell) continue
        if (cell.distFromReasoning > waveRadius) continue

        const isWaveFront = Math.abs(cell.distFromReasoning - waveRadius) < 0.28 && diffuseP < 0.96
        let charToDraw = cell.char
        let colorToDraw = `rgb(${cell.r}, ${cell.g}, ${cell.b})`

        if (isWaveFront && Math.random() > 0.35) {
          charToDraw = WAVE_CHARS[Math.floor(Math.random() * WAVE_CHARS.length)]
          colorToDraw = '#9da8af'
        }

        ctx.fillStyle = colorToDraw
        ctx.fillText(charToDraw, cell.x, cell.y)
      }
    }

    ctx.restore()
  }, [progress, dataReady, reduced])

  const p = reduced ? 1 : progress
  const loopAlpha = 1 - smooth(ramp(p, 0.94, 0.98))

  // 9. 插画显影样式：严格覆盖且显影完成后 100% 不透明，彻底根除文字透出
  const revealA = smooth(ramp(p, 0.36, 0.44))
  const revealB = smooth(ramp(p, 0.76, 0.84))

  const imageOpacityA = reduced ? 1 : revealA * loopAlpha
  const imageOpacityB = reduced ? 1 : revealB * loopAlpha

  const imageStyleA: CSSProperties = {
    opacity: imageOpacityA,
    transition: 'opacity 0.05s linear',
  }

  const imageStyleB: CSSProperties = {
    opacity: imageOpacityB,
    transition: 'opacity 0.05s linear',
  }

  // 10. 标签头部显隐：分支 A 在 0.06 浮现；分支 B 在 0.48 浮现
  const headerOpacityA = reduced ? 1 : smooth(ramp(p, 0.06, 0.12)) * loopAlpha
  const headerOpacityB = reduced ? 1 : smooth(ramp(p, 0.46, 0.52)) * loopAlpha

  // 11. 台词响应：显影完成后自然浮现
  const replyVisibleA = p >= 0.42 && p <= 0.94
  const replyVisibleB = p >= 0.82 && p <= 0.94

  // 底栏进度阶段文案
  const phaseText = reduced
    ? '双轨分支 · 随时无损回溯'
    : p < 0.08
    ? '① 源节点抉择 · 故事分岔就绪'
    : p < 0.44
    ? '② 活跃分支推演 · 雨夜钟楼扩散显影'
    : p < 0.52
    ? '③ 触发平行分歧 · 涉水折返旧街'
    : p < 0.84
    ? '④ 平行分支归档 · 独立显影留存'
    : '⑤ 双轨平行就绪 · 随时无损回溯'

  return (
    <section
      className="story-branching"
      style={{ '--compose-progress': progress } as CSSProperties}
      data-reduced={reduced || undefined}
      aria-labelledby="branching-title"
    >
      <div className="story-branching__stage" ref={stageRef}>
        {/* 顶栏 */}
        <header className="story-branching__top">
          <span>LOOM / 故事分支与平行世界</span>
          {!reduced && (
            <button onClick={handleReplay} aria-label="重新播放">
              重看 ↺
            </button>
          )}
        </header>

        {/* 全屏宏大淡雅 ASCII 状态经纬背景 */}
        <canvas ref={bgCanvasRef} className="story-branching__canvas" aria-hidden="true" />

        {/* 动态 SVG 时间线分支连线（物理连接左侧源节点与右侧分支卡片） */}
        <svg className="story-branching__connectors" aria-hidden="true">
          <defs>
            <linearGradient id="branchGradA" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6b9ac4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6b9ac4" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="branchGradB" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#82939e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#82939e" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* 分支 A 连线 */}
          {svgPathA && (
            <>
              <path
                ref={pathARef}
                d={svgPathA}
                fill="none"
                stroke="url(#branchGradA)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              {pulseA && (
                <circle cx={pulseA.x} cy={pulseA.y} r="3.5" fill="#6b9ac4" />
              )}
            </>
          )}

          {/* 分支 B 连线 */}
          {svgPathB && (
            <>
              <path
                ref={pathBRef}
                d={svgPathB}
                fill="none"
                stroke="url(#branchGradB)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              {pulseB && (
                <circle cx={pulseB.x} cy={pulseB.y} r="3" fill="#82939e" />
              )}
            </>
          )}
        </svg>

        {/* 左侧：源节点（共同前情画面 + 纯净底部描述与抉择，无多余卡片包装） */}
        <div className="story-branching__source">
          <div className="source-node">
            {/* 图一：前情插画（默认静止呈现，无需动画） */}
            <div className="source-node__viewport">
              <img
                src={bannerSource}
                alt="共同前情：夏日骤雨分岔路口"
                className="source-node__img"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="source-node__badge-row">
              <span className="source-node__dot">●</span>
              <span className="source-node__label">ORIGIN / 源节点 · 共同前情</span>
            </div>

            <div className="source-node__content">
              <p className="source-node__narration">
                夏日骤雨倾盆而下。小夏抬手挡住雨帘，在分岔路口停下脚步，回头看向你：
              </p>
              <div className="source-node__dialogue">
                「前面就是钟楼了！或者……我们折返回旧街去避雨？」
              </div>
            </div>

            <div className="source-node__forks">
              <div
                className="source-fork source-fork--a"
                ref={forkARef}
                data-active={progress >= 0.05 ? 'true' : 'false'}
              >
                <div className="source-fork__left">
                  <span className="source-fork__marker">├─▸ [分支 01]</span>
                  <span className="source-fork__title">潜入雨夜钟楼 · 俯瞰雨城</span>
                </div>
                <span className="source-fork__tag">[活跃推进]</span>
              </div>
              <div
                className="source-fork source-fork--b"
                ref={forkBRef}
                data-active={progress >= 0.46 ? 'true' : 'false'}
              >
                <div className="source-fork__left">
                  <span className="source-fork__marker">└─▸ [分支 02]</span>
                  <span className="source-fork__title">涉水折返旧街 · 街角避雨</span>
                </div>
                <span className="source-fork__tag">[平行保留]</span>
              </div>
            </div>
          </div>
        </div>

        {/* 左下角：文案区 */}
        <div className="story-branching__copy">
          <div className="story-branching__badge">BRANCH / ZERO-OVERWRITE TIMELINE</div>
          <h1 id="branching-title">
            在任意一句话，
            <br />
            分出新的可能。
          </h1>
          <p className="story-branching__lead">
            不用担心选错，也不必推倒重来。剧情在每一个节点都能派生新的分支，回溯、重走或同时保留。所有走过的世界，都完好地停留在时间线里。
          </p>
          <div className="story-branching__meta-list">
            <div className="story-branching__meta-item">
              BRANCHES:<span>08 PARALLEL</span>
            </div>
            <div className="story-branching__meta-item">
              NODES:<span>34 FORKS</span>
            </div>
            <div className="story-branching__meta-item">
              ROLLBACK:<span>SEAMLESS</span>
            </div>
          </div>
        </div>

        {/* 右侧两路分支画面预览槽位 */}
        <div className="story-branching__previews">
          {/* 分支 A：活跃推进线（右上） */}
          <div className="branch-card branch-card--a" ref={cardARef}>
            <div className="branch-card__header" style={{ opacity: headerOpacityA }}>
              <span className="branch-card__tag">branch/01 · 潜入雨夜钟楼</span>
              <span className="branch-card__status">[KEPT / 活跃线]</span>
            </div>
            <div className="branch-card__viewport">
              <canvas
                ref={canvasARef}
                width={BASE_A_W * 2}
                height={BASE_A_H * 2}
                className="branch-card__canvas"
                aria-hidden="true"
              />
              <img
                src={bannerA}
                alt="分支A插画：雨夜钟楼顶层"
                className="branch-card__img"
                style={imageStyleA}
                loading="eager"
                decoding="async"
              />
            </div>
            <p className="branch-card__reply" data-visible={replyVisibleA ? 'true' : 'false'}>
              <strong>小夏</strong>「你看，整座城市的灯火都在我们脚下。今晚的秘密，只有我们知道。」
            </p>
          </div>

          {/* 分支 B：平行保留线（右下） */}
          <div className="branch-card branch-card--b" ref={cardBRef}>
            <div className="branch-card__header" style={{ opacity: headerOpacityB }}>
              <span className="branch-card__tag">branch/02 · 涉水折返旧街</span>
              <span className="branch-card__status">[PRESERVED / 平行保留]</span>
            </div>
            <div className="branch-card__viewport">
              <canvas
                ref={canvasBRef}
                width={BASE_B_W * 2}
                height={BASE_B_H * 2}
                className="branch-card__canvas"
                aria-hidden="true"
              />
              <img
                src={bannerB}
                alt="分支B插画：涉水旧街咖啡馆"
                className="branch-card__img"
                style={imageStyleB}
                loading="eager"
                decoding="async"
              />
            </div>
            <p className="branch-card__reply" data-visible={replyVisibleB ? 'true' : 'false'}>
              <strong>小夏</strong>「雨下得好大呢……走吧，先去街角避一避。」
            </p>
          </div>
        </div>

        {/* 底栏进度 */}
        <footer className="story-branching__bottom">
          <span>{phaseText}</span>
          <span>{Math.round(progress * 100)}%</span>
        </footer>

        <div className="story-branching__progress" aria-hidden="true" />
      </div>
    </section>
  )
}
