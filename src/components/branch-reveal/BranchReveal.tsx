import { brailleCells, type BrailleCell } from '../../lib/braille-cells'
import { useEffect, useRef, useState } from 'react'
import ZoomImage from '../illustration/ZoomImage'
import type { DisplayImage } from '../../lib/site-images'
import './branch-reveal.css'

type Props = { image: DisplayImage; fullSrc: string; sizes: string; alt: string; order: number; text?: string }
const clamp = (n: number) => Math.max(0, Math.min(1, n))

/** Scroll-driven branch illustration; text remains visible while the image loads. */
export default function BranchReveal({ image, fullSrc, sizes, alt, order, text }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [imageReady, setImageReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [focused, setFocused] = useState(false)
  const [pixels, setPixels] = useState<BrailleCell[] | null>(null)
  const rows = Math.max(12, Math.round(44 * image.height / image.width))
  const choice = text ?? ['如果换一个选择，故事会往哪里走？', '沿着另一条可能，展开接下来的一幕。', '同一个起点，也可以走向不同的远方。'][order % 3]
  const copy = `${choice}

保留角色的性格与已有经历，从这次行动出发。结合地点和环境，组织她的回应，让另一条故事自然展开。`
  const pending = !pixels || !imageReady
  const shown = focused || failed ? 1 : pending ? Math.min(progress, .40) : progress


  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const top = root.current!.getBoundingClientRect().top
      // Reserve most of the scroll interval for readable text before diffusion begins.
      const span = order < 3 ? .86 : order < 7 ? .78 : .68
      setProgress(query.matches ? 1 : clamp((innerHeight * .92 - top) / (innerHeight * span)))
    }
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const syncMotion = update
    syncMotion()
    window.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('resize', syncMotion)
    query.addEventListener('change', syncMotion)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scroll)
      window.removeEventListener('resize', syncMotion)
      query.removeEventListener('change', syncMotion)
    }
  }, [order])

  useEffect(() => {
    const thumbnail = root.current!.querySelector<HTMLImageElement>('.zoom-image__trigger img')
    if (thumbnail?.complete && thumbnail.naturalWidth) setImageReady(true)
    const sample = new Image()
    sample.onload = () => {
      const buffer = document.createElement('canvas')
      buffer.width = 44 * 2
      buffer.height = rows * 4
      const context = buffer.getContext('2d')!
      context.drawImage(sample, 0, 0, 44 * 2, rows * 4)
      setPixels(brailleCells(context.getImageData(0, 0, 44 * 2, rows * 4).data, 44, rows))
    }
    sample.onerror = () => setFailed(true)
    sample.src = image.src
    return () => { sample.onload = null; sample.onerror = null }
  }, [image.src, rows])

  useEffect(() => {
    const context = canvas.current!.getContext('2d')
    if (!context || !pixels) return
    context.clearRect(0, 0, 440, rows * 10)
    context.font = '10px "Apple Braille", "Segoe UI Symbol", monospace'
    const wave = clamp((shown - .64) / .22) * 1.4
    const fade = 1 - clamp((shown - .88) / .12)
    for (let row = 0; row < rows; row++) for (let col = 0; col < 44; col++) {
      const alpha = clamp((wave - Math.hypot(col / 44 - .15, row / rows - .2)) * 10) * fade
      if (!alpha) continue
      const cell = pixels[row * 44 + col]
      context.fillStyle = `rgba(${cell.r},${cell.g},${cell.b},${alpha * cell.alpha})`
      context.fillText(cell.char, col * 10, row * 10 + 9)
    }
  }, [shown, pixels, rows])

  return <div ref={root} className="branch-reveal" style={{ '--branch-image': clamp((shown - .88) / .12) } as React.CSSProperties}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="branch-reveal__surface">
    <ZoomImage image={image} fullSrc={fullSrc} sizes={sizes} alt={alt} onLoad={() => setImageReady(true)} onError={() => setFailed(true)} />
    <div className="branch-reveal__text" aria-hidden="true" style={{ opacity: 1 - clamp((shown - .56) / .08) }}>
      <span>⑂ {String(order + 1).padStart(2, '0')} / 分支推演 · 示意{pending && !failed ? ' · 准备画面' : ''}</span>
      <p>{copy.slice(0, Math.max(1, Math.floor(copy.length * clamp(shown / .20))))}</p>
    </div>
    <canvas ref={canvas} width={440} height={rows * 10} aria-hidden="true" />
    </div>
    {text && <div className="branch-reveal__caption" data-parallax={order % 2 ? '0.025' : '-0.025'} style={{ opacity: clamp((shown - .82) / .18) }}>
      <span>⑂ {String(order + 1).padStart(2, '0')} / 另一种选择</span>
      <p>{text}</p>
    </div>}
  </div>
}
