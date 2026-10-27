import { brailleCells } from '../../lib/braille-cells'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = { src: string; ratio: number; entered: boolean; reduced: boolean; delay: number; logo?: boolean; children: ReactNode }
const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }

/** Cache glyphs once; animate only a local diffusion mask and the final image opacity. */
export default function BrandAsciiReveal({ src, ratio, entered, reduced, delay, logo = false, children }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [artwork, setArtwork] = useState<HTMLCanvasElement | null>(null)
  const [failed, setFailed] = useState(false)
  const rows = Math.round(44 / ratio)
  const width = 440
  const height = rows * 10

  useEffect(() => {
    if (reduced) return
    const image = new Image()
    image.onload = () => {
      const sample = document.createElement('canvas')
      sample.width = 88
      sample.height = rows * 4
      const context = sample.getContext('2d')!
      const sourceRatio = image.width / image.height
      const cropWidth = sourceRatio > ratio ? image.height * ratio : image.width
      const cropHeight = sourceRatio > ratio ? image.height : image.width / ratio
      context.drawImage(image, (image.width - cropWidth) / 2, (image.height - cropHeight) / 2, cropWidth, cropHeight, 0, 0, 88, rows * 4)
      const pixels = context.getImageData(0, 0, 88, rows * 4).data
      const bitmap = document.createElement('canvas')
      bitmap.width = width
      bitmap.height = height
      const ink = bitmap.getContext('2d')!
      const cells = brailleCells(pixels, 44, rows, logo)
      ink.font = '10px "Apple Braille", "Segoe UI Symbol", monospace'
      cells.forEach((cell, index) => {
        if (!cell.alpha) return
        ink.fillStyle = `rgba(${cell.r},${cell.g},${cell.b},${cell.alpha})`
        ink.fillText(cell.char, index % 44 * 10, Math.floor(index / 44) * 10 + 9)
      })
      setArtwork(bitmap)
    }
    image.onerror = () => setFailed(true)
    image.src = src
    return () => { image.onload = null; image.onerror = null }
  }, [src, ratio, rows, height, logo, reduced])

  useEffect(() => {
    const host = root.current!
    const context = canvas.current!.getContext('2d')!
    const finish = () => {
      host.style.setProperty('--brand-image-opacity', '1')
      host.inert = false
      context.clearRect(0, 0, width, height)
    }
    if (reduced || failed) { finish(); return }
    if (!entered || !artwork) return
    let frame = 0
    let previous = 0
    let elapsed = -delay
    let complete = false
    const originX = width * .18
    const originY = height * .18
    const radius = Math.hypot(width - originX, height - originY) + 30
    const tick = (now: number) => {
      if (previous) elapsed += now - previous
      previous = now
      const p = clamp(elapsed / 2200)
      context.clearRect(0, 0, width, height)
      if (p > 0) {
        const reveal = smooth((p - .66) / .34)
        context.save()
        context.globalAlpha = 1 - reveal
        context.drawImage(artwork, 0, 0)
        context.globalCompositeOperation = 'destination-in'
        const edge = Math.max(1, smooth(p / .68) * radius)
        const mask = context.createRadialGradient(originX, originY, Math.max(0, edge - 28), originX, originY, edge)
        mask.addColorStop(0, '#fff')
        mask.addColorStop(1, 'transparent')
        context.fillStyle = mask
        context.fillRect(0, 0, width, height)
        context.restore()
        host.style.setProperty('--brand-image-opacity', String(reveal))
      }
      if (p < 1) frame = requestAnimationFrame(tick)
      else { complete = true; finish() }
    }
    const resume = () => {
      cancelAnimationFrame(frame)
      previous = 0
      if (!document.hidden && !complete) frame = requestAnimationFrame(tick)
    }
    resume()
    document.addEventListener('visibilitychange', resume)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', resume) }
  }, [entered, artwork, reduced, failed, delay, height])

  return <div ref={root} className="brand-ascii" inert={!reduced && !failed} style={{ '--brand-image-opacity': reduced || failed ? 1 : 0 } as CSSProperties}>
    {children}
    <canvas ref={canvas} width={width} height={height} aria-hidden="true" />
  </div>
}
