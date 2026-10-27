import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type Props = { src: string; ratio: number; entered: boolean; reduced: boolean; delay: number; logo?: boolean; children: ReactNode }

/** Image-colored glyphs stay inside each artwork's existing geometry and stacking layer. */
export default function BrandAsciiReveal({ src, ratio, entered, reduced, delay, logo = false, children }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [pixels, setPixels] = useState<Uint8ClampedArray | null>(null)
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(false)
  const rows = Math.round(60 / ratio)
  const p = reduced || failed ? 1 : progress
  const imageOpacity = Math.max(0, Math.min(1, (p - .38) / .62))

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      const sample = document.createElement('canvas')
      sample.width = 60
      sample.height = rows
      const context = sample.getContext('2d')!
      // Match the existing card cover crop; the transparent logo keeps its natural ratio.
      const sourceRatio = image.width / image.height
      const width = sourceRatio > ratio ? image.height * ratio : image.width
      const height = sourceRatio > ratio ? image.height : image.width / ratio
      context.drawImage(image, (image.width - width) / 2, (image.height - height) / 2, width, height, 0, 0, 60, rows)
      setPixels(context.getImageData(0, 0, 60, rows).data)
    }
    image.onerror = () => setFailed(true)
    image.src = src
    return () => { image.onload = null; image.onerror = null }
  }, [src, ratio, rows])

  useEffect(() => {
    if (!entered || !pixels || reduced) return
    let frame = 0
    let previous = 0
    let elapsed = -delay
    const tick = (now: number) => {
      if (previous) elapsed += now - previous
      previous = now
      setProgress(Math.max(0, Math.min(1, elapsed / 2100)))
      if (elapsed < 2100) frame = requestAnimationFrame(tick)
    }
    const resume = () => {
      cancelAnimationFrame(frame)
      previous = 0
      if (!document.hidden) frame = requestAnimationFrame(tick)
    }
    resume()
    document.addEventListener('visibilitychange', resume)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', resume) }
  }, [entered, pixels, reduced, delay])

  useEffect(() => {
    const context = canvas.current!.getContext('2d')
    if (!context || !pixels) return
    context.clearRect(0, 0, 600, rows * 10)
    if (p >= 1 || !entered) return
    const glyphs = logo ? 'LOOMSTUDIO' : '.:-=+*#%@'
    context.font = '10px monospace'
    const appear = Math.min(1, p / .12)
    for (let row = 0; row < rows; row++) for (let col = 0; col < 60; col++) {
      const offset = (row * 60 + col) * 4
      const [r, g, b, a] = pixels.subarray(offset, offset + 4)
      if (a < 20) continue
      const luminance = (r * .299 + g * .587 + b * .114) / 255
      const index = logo ? (row * 60 + col) % glyphs.length : Math.min(glyphs.length - 1, Math.floor(luminance * glyphs.length))
      context.fillStyle = `rgba(${r},${g},${b},${a / 255 * appear * (1 - imageOpacity)})`
      context.fillText(glyphs[index], col * 10, row * 10 + 9)
    }
  }, [p, pixels, rows, entered, logo, imageOpacity])

  return <div className="brand-ascii" inert={p < 1} style={{ '--brand-image-opacity': imageOpacity } as CSSProperties}>
    {children}
    <canvas ref={canvas} width={600} height={rows * 10} aria-hidden="true" />
  </div>
}
