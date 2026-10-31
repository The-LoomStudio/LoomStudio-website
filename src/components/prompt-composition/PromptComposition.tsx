import { brailleCells, type BrailleCell } from '../../lib/braille-cells'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import PresetAssembly from './PresetAssembly'
import './prompt-composition.css'

const phases = ['预设骨架', 'Lore 注入', 'Session 与 Narrative', '用户输入', '回应']
const duration = 22000
const clamp = (n: number) => Math.max(0, Math.min(1, n))
const ramp = (p: number, a: number, b: number) => clamp((p - a) / (b - a))

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
  const phase = p < .12 ? 0 : p < .39 ? 1 : p < .58 ? 2 : p < .72 ? 3 : 4

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
    if (!playing || !visible || reduced || (!pixels && !imageFailed)) return
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
  }, [playing, visible, reduced, pixels, imageFailed])

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
    if (reduced || p < .72 || p >= .96) return
    context.textAlign = 'center'
    context.font = '10px "Apple Braille", "Segoe UI Symbol", monospace'
    const wave = ramp(p, .72, .87) * 1.3
    const fade = 1 - ramp(p, .87, .96)
    for (let row = 0; row < 70; row++) {
      for (let col = 0; col < 48; col++) {
        // Reveal the scene only after the message tree has been assembled.
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
    <div className="prompt-composition__layout">
      <div className="prompt-composition__copy">
        <h2 id="prompt-composition-title">从设定编排<br />到角色回应</h2>
        <p className="prompt-composition__intro">预设构成骨架 Lore 按条件注入锚点 历史与当前输入共同组成上下文</p>
        <div className="prompt-composition__assembly-stage">
          <div className="prompt-composition__assembly-size" aria-hidden="true" inert><PresetAssembly progress={1} /></div>
          <div className="prompt-composition__assembly-live"><PresetAssembly progress={p} /></div>
        </div>
        <div className="prompt-composition__controls">
          <nav className="prompt-composition__chapters" aria-label="上下文编排演示阶段">
            {phases.map((label, i) => <button key={label} type="button" aria-label={label} title={label} aria-pressed={phase === i} disabled={!!reduced} onClick={() => seek([.115, .38, .57, .70, 1][i])}><span className="prompt-composition__step" /></button>)}
          </nav>
          <div className="prompt-composition__playback">
            <button type="button" disabled={!!reduced} onClick={() => {
              if (progress >= 1) { elapsed.current = 0; setProgress(0); setPlaying(true) }
              else setPlaying(value => !value)
            }}>{playing && progress < 1 ? <Pause size={14} /> : <Play size={14} />}{playing && progress < 1 ? '暂停' : '播放'}</button>
            <button type="button" disabled={!!reduced} onClick={() => { elapsed.current = 0; setProgress(0); setPlaying(true) }}><RotateCcw size={14} />重播</button>
          </div>
        </div>
      </div>
      <figure className="prompt-composition__art">
        <div className="prompt-composition__picture">
          <canvas ref={canvas} className="prompt-composition__flow" aria-hidden="true" />
          <img src={portrait} alt="夜色中的诺姆坐在窗边，膝上摊开一本书" style={{ opacity: ramp(p, .87, .96) }} />
        </div>
        <figcaption style={{ opacity: ramp(p, .94, 1) }}>「刚读到有趣的地方。<br />要一起看吗？」</figcaption>
        {imageFailed && <p role="status">插画未能加载，请刷新后重试。</p>}
      </figure>
    </div>
  </section>
}
