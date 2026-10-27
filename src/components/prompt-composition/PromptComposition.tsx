import { brailleCells, type BrailleCell } from '../../lib/braille-cells'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import './prompt-composition.css'

const phases = ['预设', 'Lore', '用户输入', '回应']
const duration = 10000
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const ramp = (p: number, a: number, b: number) => clamp((p - a) / (b - a))

const reasoningSteps = [
  '采用互动叙事身份，结合角色语气、行动与环境组织回应。可按需读取设定和世界状态，不需要的工具不调用。',
  '诺姆温和而好奇，喜欢分享书里的故事。此刻她坐在临海小城的窗边，膝上摊着书，身旁是一杯热茶。回应应从这个具体场景展开。',
  '你在她身旁坐下，问她正在读什么。她会从书页抬起头，把书向你移近一些，用邀请一起阅读的方式回应。',
]

/** Fixed context-composition example; the illustration visualizes the scene, not image generation. */
export default function PromptComposition({ portrait }: { portrait: string }) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const elapsed = useRef(0)
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(false)
  const [pixels, setPixels] = useState<BrailleCell[] | null>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const reduced = useReducedMotion()
  const p = reduced ? 1 : progress
  const phase = p < .18 ? 0 : p < .36 ? 1 : p < .78 ? 2 : 3

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(root.current!)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      const sample = document.createElement('canvas')
      sample.width = 48 * 2
      sample.height = 70 * 4
      const context = sample.getContext('2d')!
      context.drawImage(image, 0, 0, 48 * 2, 70 * 4)
      setPixels(brailleCells(context.getImageData(0, 0, 48 * 2, 70 * 4).data, 48, 70))
    }
    image.onerror = () => setImageFailed(true)
    image.src = portrait
    return () => { image.onload = null; image.onerror = null }
  }, [portrait])

  useEffect(() => {
    if (!playing || !visible || reduced || !pixels) return
    let frame = 0
    let previous = 0
    const tick = (now: number) => {
      if (previous) elapsed.current = Math.min(duration, elapsed.current + now - previous)
      previous = now
      setProgress(elapsed.current / duration)
      if (elapsed.current < duration) frame = requestAnimationFrame(tick)
      else setPlaying(false)
    }
    const syncVisibility = () => {
      cancelAnimationFrame(frame)
      previous = 0
      if (!document.hidden) frame = requestAnimationFrame(tick)
    }
    syncVisibility()
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [playing, visible, reduced, pixels])

  useEffect(() => {
    const element = canvas.current!
    const context = element.getContext('2d')
    if (!context || !pixels) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (element.width !== 480 * dpr) {
      element.width = 480 * dpr
      element.height = 700 * dpr
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, 480, 700)
    if (reduced || p < .50 || p >= .90) return
    context.textAlign = 'center'
    context.font = '10px "Apple Braille", "Segoe UI Symbol", monospace'
    const wave = ramp(p, .50, .78) * 1.3
    const fade = 1 - ramp(p, .78, .90)
    for (let row = 0; row < 70; row++) {
      for (let col = 0; col < 48; col++) {
        // Expand locally from the reasoning text; no geometry crosses the two columns.
        const distance = Math.hypot((col + .5) / 48 - .18, (row + .5) / 70 - .18)
        const alpha = clamp((wave - distance) * 12) * fade
        if (!alpha) continue
        const cell = pixels[row * 48 + col]
        context.fillStyle = `rgba(${cell.r},${cell.g},${cell.b},${alpha * cell.alpha})`
        context.fillText(cell.char, col * 10 + 5, row * 10 + 9)
      }
    }
  }, [p, pixels, reduced])

  const seek = (value: number) => {
    elapsed.current = value * duration
    setProgress(value)
    setPlaying(false)
  }
  return <section ref={root} id="prompt-builder" lang="zh-CN" className="prompt-composition" aria-labelledby="prompt-composition-title">
    <header className="prompt-composition__top"><span>LOOM / PROMPT BUILDER</span><small>角色组成与上下文编排</small></header>
    <div className="prompt-composition__layout">
      <div className="prompt-composition__copy">
        <p className="prompt-composition__eyebrow">先有执行者，再有世界，最后是你。</p>
        <h2 id="prompt-composition-title">从你的设定，<br />到她的回应。</h2>
        <p className="prompt-composition__intro">将这一轮采用的设定与当前行动组织在一起，让回应发生在你构建的世界里。</p>
        <div className="prompt-composition__assembly">
          <div className="prompt-composition__layers">
            <section className="prompt-composition__layer" style={{ opacity: reduced ? 1 : ramp(p, 0, .06) }}>
              <h3><span>01</span> 预设 <small>AGENT PRESET</small></h3>
              <dl><dt>身份</dt><dd>互动叙事 Agent</dd><dt>能力</dt><dd>扮演角色 · 推进情节 · 描写环境</dd><dt>工具</dt><dd>读取设定 · 查询世界状态 <em>按需使用 · 示例</em></dd></dl>
            </section>
            <section className="prompt-composition__layer" style={{ opacity: reduced ? 1 : ramp(p, .18, .25) }}>
              <h3><span>02</span> Lore <small>作者赋予的灵魂</small></h3>
              <dl><dt>角色</dt><dd>诺姆 / 温和、好奇，喜欢分享书里的故事</dd><dt>世界</dt><dd>临海小城，窗外是入夜后的灯火</dd><dt>场景</dt><dd>窗边的座位，膝上的书，一杯热茶</dd></dl>
            </section>
            <section className="prompt-composition__layer prompt-composition__input" style={{ opacity: reduced ? 1 : ramp(p, .36, .43) }}>
              <h3><span>03</span> 你的输入 <small>让这一轮开始</small></h3>
              <p>你在她身旁坐下：<br /><strong>「正在读什么？」</strong></p>
              <span className="prompt-composition__ready">{p >= .48 ? '上下文就绪 →' : '▍'}</span>
            </section>
          </div>

        </div>
        <nav className="prompt-composition__controls" aria-label="上下文编排演示阶段">
          {phases.map((label, i) => <button key={label} type="button" aria-pressed={phase === i} disabled={!!reduced} onClick={() => seek([.16, .34, .48, 1][i])}>{label}</button>)}
        </nav>
        {!reduced && <button className="prompt-composition__play" type="button" onClick={() => {
          if (progress >= 1) { elapsed.current = 0; setProgress(0) }
          setPlaying(value => !value)
        }}>{playing ? '暂停' : progress >= 1 ? '再看一次 ↻' : '继续播放'}</button>}
      </div>
      <figure className="prompt-composition__art">
        <div className="prompt-composition__picture">
          <div className="prompt-composition__reasoning" aria-hidden="true" style={{ opacity: reduced ? 0 : 1 - ramp(p, .50, .66) }}>
            <small>AI 推演 · 示意</small>
            {reasoningSteps.map((text, index) => <p key={text}>{text.slice(0, Math.floor(text.length * ramp(p, [.01, .18, .36][index], [.17, .35, .50][index])))}</p>)}
          </div>
          <canvas ref={canvas} className="prompt-composition__flow" aria-hidden="true" />
          <img src={portrait} alt="夜色中的诺姆坐在窗边，膝上摊开一本书" style={{ opacity: imageFailed ? 1 : ramp(p, .78, .90) }} />
        </div>
        <figcaption style={{ opacity: ramp(p, .88, .96) }}>「刚读到有趣的地方。<br />要一起看吗？」</figcaption>
        {imageFailed && <p role="status">插画未能加载，请刷新后重试。</p>}
      </figure>
    </div>
    <footer className="prompt-composition__bottom"><span>预设 → Lore → 用户输入 → 角色回应</span><small>固定示例 · 插画用于呈现场景，不代表 Prompt Builder 生成图片。</small></footer>
    <div className="prompt-composition__progress" aria-hidden="true" style={{ transform: `scaleX(${p})` }} />
  </section>
}
