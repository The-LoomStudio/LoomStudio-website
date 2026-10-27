import { useLayoutEffect, useMemo, useRef } from 'react'
import points from './ascii-points.json'

const ramp = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)))
const smooth = (t: number) => t * t * (3 - 2 * t)
const dialogue = [
  '「如果故事还没有结束，你愿意和我一起写下去吗？」',
  '窗外的雨停了。她合上旧书，将未写完的一页轻轻推到你面前。',
  '“Every choice leaves a thread. Where will yours lead?”',
  'You reach for the letter. Somewhere beyond the door, a familiar voice calls your name.',
  '「ねえ、この物語の続きを、一緒に紡いでくれる？」',
  '窓の外で雨が止んだ。彼女はそっと本を閉じ、まだ白いページに指を置いた。',
  '「这一次，结局由我们决定。」她笑了，灯光落在尚未落笔的信纸上。',
  '“Then let us begin.” The world holds its breath, waiting for your next word.',
  '「大丈夫。まだ、どんな未来だって選べるよ。」',
].join('\n')

function textLayout(count: number, width: number, height: number, fontSize = width < 640 ? 12 : 16): { fontSize: number; glyphs: { character: string; x: number; y: number }[] } {
  const lineHeight = fontSize * 1.9
  const maxWidth = Math.min(width * 0.82, 840)
  const characters = Array.from(dialogue)
  let x = 0, row = 0, cursor = 0
  const glyphs = []
  for (let i = 0; i < count; i++) {
    let character = characters[cursor++ % characters.length]
    if (character === '\n') { x = 0; row++; character = characters[cursor++ % characters.length] }
    const advance = character.charCodeAt(0) > 255 ? fontSize : fontSize * 0.61
    if (x + advance > maxWidth) { x = 0; row++ }
    glyphs.push({ character, x: x + advance / 2, y: row * lineHeight })
    x += advance
  }
  if ((row + 1) * lineHeight > height * .82 && fontSize > 9) return textLayout(count, width, height, fontSize - 1)
  const top = (height - row * lineHeight) / 2
  return { fontSize, glyphs: glyphs.map(g => ({ ...g, x: g.x + (width - maxWidth) / 2, y: g.y + top })) }
}


/** Rasterize each glyph once; animation frames only blit cached pixels, never reflow text. */
export default function DialogueCanvas({ width, height, progress, waiting = false }: { width: number; height: number; progress: number; waiting?: boolean }) {
  const waitingPosition = useMemo(() => {
    const layout = textLayout(points.length, width, height)
    const last = layout.glyphs[layout.glyphs.length - 1]
    return { left: Math.min(last.x + layout.fontSize * .7, width - 48), top: last.y - layout.fontSize * .5, height: layout.fontSize }
  }, [width, height])
  const canvas = useRef<HTMLCanvasElement>(null)
  const cache = useRef<{
    context: CanvasRenderingContext2D; atlas: HTMLCanvasElement; ratio: number; cell: number;
    text: ReturnType<typeof textLayout>; scale: number; silver: string;
    targets: { x: number; y: number; stagger: number }[];
  } | null>(null)

  useLayoutEffect(() => {
    const surface = canvas.current!
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    surface.width = Math.ceil(width * ratio)
    surface.height = Math.ceil(height * ratio)
    const context = surface.getContext('2d')!
    const style = getComputedStyle(surface)
    const text = textLayout(points.length, width, height)
    const cell = Math.ceil(text.fontSize * 2 * ratio)
    const atlas = document.createElement('canvas')
    atlas.width = cell * 32
    atlas.height = cell * Math.ceil(points.length * 2 / 32)
    const ink = atlas.getContext('2d')!
    ink.font = `${text.fontSize * ratio}px ${style.fontFamily}`
    ink.textAlign = 'center'
    ink.textBaseline = 'middle'
    const muted = style.getPropertyValue('--loom-site-text-muted').trim()
    const scale = Math.min(width * .64, height * .84, 540) / 1254
    for (let i = 0; i < points.length * 2; i++) {
      const index = i % points.length
      ink.fillStyle = i < points.length ? muted : String(points[index][2])
      ink.fillText(text.glyphs[index].character, (i % 32 + .5) * cell, (Math.floor(i / 32) + .5) * cell)
    }
    cache.current = {
      context, atlas, ratio, cell, text, scale,
      silver: style.getPropertyValue('--loom-site-silver').trim(),
      targets: points.map(([x, y], index) => ({
        x: width / 2 + (Number(x) - 620) * scale,
        y: height / 2 + (Number(y) - 619) * scale,
        stagger: ((index * 37) % 101) / 101,
      })),
    }
    return () => { cache.current = null; atlas.width = atlas.height = 0 }
  }, [width, height])

  useLayoutEffect(() => {
    const { context, atlas, ratio, cell, text, scale, targets, silver } = cache.current!
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)
    const visible = Math.floor(ramp(progress, 0, .18) * points.length)
    context.globalAlpha = 1 - smooth(ramp(progress, .55, .65))
    for (let index = 0; index < visible; index++) {
      const source = text.glyphs[index]
      const target = targets[index]
      const form = smooth(ramp(progress, .20 + target.stagger * .065, .43 + target.stagger * .065))
      const bend = Math.sin(form * Math.PI) * (target.stagger - .5) * Math.min(width * .12, 100)
      const x = source.x + (target.x - source.x) * form + bend
      const y = source.y + (target.y - source.y) * form
      const fontSize = text.fontSize + (22 * scale - text.fontSize) * form
      const destinationSize = cell / ratio * fontSize / text.fontSize
      const sprite = index + (form > .8 ? points.length : 0)
      context.drawImage(atlas, sprite % 32 * cell, Math.floor(sprite / 32) * cell, cell, cell,
        x - destinationSize / 2, y - destinationSize / 2, destinationSize, destinationSize)
    }
    if (progress < .19 && !waiting) {
      const cursor = text.glyphs[Math.min(visible, points.length - 1)]
      context.globalAlpha = 1 - ramp(progress, .18, .19)
      context.fillStyle = silver
      context.fillRect(cursor.x - text.fontSize * .3, cursor.y - text.fontSize * .5,
        Math.max(1.5, text.fontSize * .12), text.fontSize)
    }
    context.globalAlpha = 1
  }, [progress, width, height, waiting])

  return <>
    <canvas ref={canvas} className="text-logo__characters" aria-hidden="true" />
    {waiting && <span className="text-logo__thinking" style={waitingPosition} role="status" aria-label="正在思考"><b aria-hidden="true" /><i aria-hidden="true" /></span>}
  </>
}
