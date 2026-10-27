import { brailleCells } from '../../lib/braille-cells'
import { useEffect, useRef, useState, useCallback, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import './setting-composition.css'

const ramp = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)))
const smooth = (t: number) => t * t * (3 - 2 * t)

const entries = [
  { branch: '│  ├─', name: '性格.txt', content: '开朗，好奇，总想绕一点远路。她记得河边每一棵树的名字，却总是忘记带回借来的书。' },
  { branch: '│  └─', name: '习惯.txt', content: '喜欢把新发现分享给你。说到开心的事，会不自觉地踮起脚尖。' },
  { branch: '│  └─', name: '夏日河谷.txt', content: '放学后的风带着树叶和溪水的气息。阳光穿过树冠，在浅浅的河面碎开。远处是蝉鸣，近处是踩过石子的水声。' },
  { branch: '   └─', name: '放学以后.txt', content: '「这边比教室凉快多了，对吧？」小夏站在浅浅的河水里，抬手挡住阳光。她指了指水面，又向你招手：「快来，我发现了一条会发光的小鱼。」' },
]

const folders = ['├─ 角色/', null, '├─ 世界/', '└─ 开场/']

// 长篇连贯的 AI 推理流段落
const reasoningParagraphs = [
  '正在读取并解析角色核心设定「小夏」：性格开朗、纯粹好奇，习惯在开心时踮起脚尖，总想绕一点远路去探险。她记得河边每一棵树的名字，却总是忘记带回借来的书。',
  '世界记忆挂载：夏日河谷。放学后的微风带着树叶和清浅溪水的气息，阳光穿过树冠在浅浅的河面碎开，远处是连绵蝉鸣，近处是踩过石子的清脆水声。',
  '推演开场情境：放学后的初次相遇。小夏站在浅滩中央，抬手挡住刺眼的阳光向你招手。需要捕捉她发现水面发光小鱼时的灵动神态与清澈水汽光影。',
  '意图分析与特征编译：将角色性格特质、夏日河谷物理环境与开场对白编译为潜在特征向量。午后树冠碎光、水面波纹、少女回眸眼神正在收敛。',
  '扩散采样启动：从当前推理核心节点开始，潜在空间波前直接向全画幅经纬网格蔓延解构……',
]

// 紧密连续的 ASCII 灰度阶梯（不留白，暗部亦有微字符纹理）
const WAVE_CHARS = '⠁⠃⠇⠏⠟⠿⡿⣿'

const BASE_W = 480
const BASE_H = 700

// 高密 ASCII 网格：44 列 × 64 行 = 2816 单元，从 (0,0) 到 (480,700) 严格充满画布，与底图 100% 贴合
const ASCII_COLS = 44
const ASCII_ROWS = 64
const TOTAL_CELLS = ASCII_COLS * ASCII_ROWS

const LOOP_DURATION = 10000 // 10秒完整循环

interface AsciiCellData {
  char: string
  r: number
  g: number
  b: number
  lum: number
  x: number
  y: number
  distFromReasoning: number // 距推理核心区域的归一化距离
}

export default function SettingComposition({ portrait }: { portrait: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startTimeRef = useRef<number>(0)
  const cellsRef = useRef<AsciiCellData[]>([])

  const [progress, setProgress] = useState(0)
  const [dataReady, setDataReady] = useState(false)

  const reduced = useReducedMotion()

  // 1. 预载底图并提取覆盖 0..480 × 0..700 的全幅高密 ASCII 矩阵
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const off = document.createElement('canvas')
        off.width = ASCII_COLS * 2
        off.height = ASCII_ROWS * 4
        const offCtx = off.getContext('2d', { willReadFrequently: true })
        if (offCtx) {
          offCtx.drawImage(img, 0, 0, ASCII_COLS * 2, ASCII_ROWS * 4)
          const imgData = brailleCells(offCtx.getImageData(0, 0, ASCII_COLS * 2, ASCII_ROWS * 4).data, ASCII_COLS, ASCII_ROWS)
          const cells: AsciiCellData[] = []

          const cellW = BASE_W / ASCII_COLS
          const cellH = BASE_H / ASCII_ROWS

          // 推理文本的核心发源位置（居中偏上，y 约为 150px）
          const reasoningOriginX = BASE_W / 2
          const reasoningOriginY = 150

          for (let r = 0; r < ASCII_ROWS; r++) {
            for (let c = 0; c < ASCII_COLS; c++) {
              const { char, r: red, g: green, b: blue, lum } = imgData[r * ASCII_COLS + c]

              // 坐标完全覆盖 0 到 BASE_W、0 到 BASE_H，无任何额外缩进内边距
              const cellX = (c + 0.5) * cellW
              const cellY = (r + 0.5) * cellH

              // 计算距推理文本发源位置的距离
              const dx = (cellX - reasoningOriginX) / (BASE_W / 2)
              const dy = (cellY - reasoningOriginY) / 380
              const distFromReasoning = Math.sqrt(dx * dx + dy * dy)

              // 保底色彩，防止暗部死黑
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

          cellsRef.current = cells
          setDataReady(true)
        }
      } catch {
        setDataReady(true)
      }
    }
    img.src = portrait
  }, [portrait])

  const handleReplay = useCallback(() => {
    startTimeRef.current = performance.now()
    setProgress(0)
  }, [])

  // 2. 自主时间循环（RAF 驱动）
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

  // 3. 核心动画渲染：
  // 阶段 1 (0.04 ~ 0.32)：AI 推理文本流自然展开
  // 阶段 2 (0.32 ~ 0.62)：无冗余乱码停顿，扩散波直接从推理位置启动并向外席卷，波前所到之处原推理文字直接解构成全画幅彩色 ASCII 字符画
  // 阶段 3 (0.65 ~ 0.78)：从与画框 100% 贴合的全幅 ASCII 字符上，直接凝结显影为插画（长宽高完全一致，零尺寸跳变）
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.max(2, window.devicePixelRatio || 1)
    if (canvas.width !== BASE_W * dpr || canvas.height !== BASE_H * dpr) {
      canvas.width = BASE_W * dpr
      canvas.height = BASE_H * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, BASE_W, BASE_H)

    const p = reduced ? 1 : progress
    const loopAlpha = 1 - smooth(ramp(p, 0.92, 0.98))

    // 扩散进度 (0.32 开始直接启动扩散，波前蔓延至全幅)
    const diffuseP = smooth(ramp(p, 0.32, 0.60))
    // 显影完成时 ASCII 画布完全淡出
    const asciiFadeOut = 1 - smooth(ramp(p, 0.66, 0.78))

    // 【阶段一】：AI 推理文本展示 (在扩散波尚未覆盖之处保持呈现；被波前扫过时自然消解)
    if (p < 0.50) {
      const typeP = smooth(ramp(p, 0.04, 0.30))
      const flatText = reasoningParagraphs.join('\n')
      const totalChars = flatText.length
      const visibleCount = Math.floor(typeP * totalChars)

      // 随着扩散波推进，推理文字平滑隐入扩散流中
      const textAlpha = 1 - smooth(ramp(p, 0.34, 0.44))

      if (textAlpha > 0) {
        ctx.globalAlpha = loopAlpha * textAlpha
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans SC", monospace'
        ctx.textAlign = 'left'
        ctx.textBaseline = 'middle'

        const padX = 20
        let curX = padX
        let curY = 28
        const lineHeight = 20
        const charWidth = 14.5
        const maxRight = BASE_W - padX

        for (let i = 0; i < visibleCount; i++) {
          const char = flatText[i]
          if (char === '\n') {
            curX = padX
            curY += lineHeight + 6
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

        // 打字机光标
        if (visibleCount > 0 && p < 0.30) {
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(curX + 1, curY - 6, 2, 13)
        }
      }
    }

    // 【阶段二】：直接从推理位置向全框扩散 (Diffusion)，覆盖并扩展为全幅高密 ASCII (0.32 ~ 0.80)
    if (diffuseP > 0 && p <= 0.80 && dataReady) {
      ctx.globalAlpha = loopAlpha * asciiFadeOut
      ctx.font = '11px "Apple Braille", "Segoe UI Symbol", monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const cells = cellsRef.current
      // 扩散波前半径（从推理位置向外扩散，最大跨度约 2.2，充分铺满整框）
      const waveRadius = diffuseP * 2.3

      for (let i = 0; i < TOTAL_CELLS; i++) {
        const cell = cells[i]
        if (!cell) continue

        // 仅在波前触及该单元时点亮
        if (cell.distFromReasoning > waveRadius) continue

        // 波前交界处呈现高能量动态采样波动，随后迅速稳定为真色 ASCII 字符
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

  // 【阶段三】：从 0..480 × 0..700 完全贴合的高密 ASCII 上，直接凝结显影高清插画 (0.66 ~ 0.78)
  const revealProgress = smooth(ramp(p, 0.66, 0.78))
  const loopAlpha = 1 - smooth(ramp(p, 0.92, 0.98))

  const imageOpacity = reduced ? 1 : revealProgress * loopAlpha

  const imageStyle: CSSProperties = {
    opacity: imageOpacity,
    transition: 'opacity 0.05s linear',
  }

  // 阶段四：相遇对白浮现 (0.76 ~ 0.92)
  const replyVisible = p >= 0.76 && p <= 0.92

  // 底栏进度阶段文案
  const phaseText = reduced
    ? '小夏 · 夏日河谷'
    : p < 0.32
    ? '① 设定读取 · 长段落思维流'
    : p < 0.62
    ? '② 自推理处直接扩散 · 全幅 ASCII 铺满'
    : '③ 凝结显影 · 角色相遇就绪'

  return (
    <section
      className="setting-composition"
      style={{ '--compose-progress': progress } as CSSProperties}
      data-reduced={reduced || undefined}
      aria-labelledby="composition-title"
    >
      <div className="setting-composition__stage">
        {/* 顶栏 */}
        <header className="setting-composition__top">
          <span>LOOM / 推理 ➔ 直接扩散全幅 ASCII ➔ 显影</span>
          {!reduced && (
            <button onClick={handleReplay} aria-label="重新播放">
              重看 ↺
            </button>
          )}
        </header>

        {/* 左侧设定树 */}
        <div className="setting-composition__copy">
          <h1 id="composition-title">从设定，到相遇。</h1>
          <div className="setting-composition__tree" aria-label="小夏的设定目录">
            <div className="setting-composition__root">小夏/</div>
            {entries.map((entry, index) => (
              <div className="setting-composition__entry" key={entry.name}>
                {folders[index] && <div className="setting-composition__folder">{folders[index]}</div>}
                <div className="setting-composition__filename">
                  <span aria-hidden="true">{entry.branch} </span>
                  {entry.name}
                </div>
                <p>
                  <span className="setting-composition__connector" aria-hidden="true">
                    {index < 3 ? '│' : ' '}
                  </span>
                  <span className="setting-composition__body">{entry.content}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧画框：ASCII 字符网格与高清插画严格 100% 同宽高重合 */}
        <figure className="setting-composition__art" aria-label="从推理直接扩散为全幅ASCII再显影的插画">
          <canvas
            ref={canvasRef}
            width={BASE_W * 2}
            height={BASE_H * 2}
            className="setting-composition__text-canvas"
            aria-hidden="true"
          />

          <img
            src={portrait}
            alt="小夏插画"
            className="setting-composition__portrait-img"
            style={imageStyle}
            loading="eager"
            decoding="async"
          />

          <p className="setting-composition__reply" data-visible={replyVisible ? 'true' : 'false'}>
            「……原来这就是你为我写下的世界呀。快脱掉鞋子过来，水里真的很凉快呢！」
          </p>
        </figure>

        {/* 底栏进度 */}
        <footer className="setting-composition__bottom">
          <span>{phaseText}</span>
          <span>{Math.round(progress * 100)}%</span>
        </footer>

        <div className="setting-composition__progress" aria-hidden="true" />
      </div>
    </section>
  )
}
