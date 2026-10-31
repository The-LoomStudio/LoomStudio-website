import { useLayoutEffect, useRef } from 'react'
import type { SiteLocale } from '../../lib/i18n'
import points from './ascii-points.json'

const ramp = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)))
const smooth = (t: number) => t * t * (3 - 2 * t)
const copy: Record<SiteLocale, { prologue: string; headline: string }> = {
  'zh-CN': { prologue: '窗外的雨停了。她把未写完的一页，轻轻推到你面前。\n灯光落在纸上，故事正等着下一句话。', headline: '「这一次，故事由你续写。」' },
  en: { prologue: 'The rain has stopped. She slides an unfinished page toward you.\nLight rests on the paper. The story awaits its next words.', headline: '“This time, you write what comes next.”' },
  ja: { prologue: '窓の外で雨がやんだ。彼女は書きかけの一頁を、そっとあなたの前へ差し出す。\n紙の上に灯りが落ちる。物語は、次の言葉を待っている。', headline: '「今度は、あなたが続きを紡ぐ番。」' },
  ko: { prologue: '창밖의 비가 그쳤다. 그녀가 다 쓰지 못한 한 페이지를 당신 앞으로 살며시 밀어 놓는다.\n종이 위로 불빛이 내려앉는다. 이야기는 다음 말을 기다린다.', headline: '“이번에는 당신이 이야기를 이어 갈 차례.”' },
}

function textLayout(width: number, height: number, locale: SiteLocale) {
  const fontSize = width < 640 ? 14 : 20
  const maxWidth = Math.min(width * .82, 840)
  const glyphs: { character: string; x: number; y: number; fontSize: number; advance: number }[] = []
  let x = 0, y = 0
  const append = (value: string, size: number) => {
    for (const character of value) {
      if (character === '\n') { x = 0; y += size * 2; continue }
      const advance = size * (character.charCodeAt(0) > 255 ? 1 : .61)
      if (x + advance > maxWidth) { x = 0; y += size * 2 }
      glyphs.push({ character, x: x + advance / 2, y, fontSize: size, advance })
      x += advance
    }
  }
  append(copy[locale].prologue, fontSize)
  const pause = glyphs.length
  x = 0; y += fontSize * 2.8
  append(copy[locale].headline, fontSize * 1.7)
  const top = (height - y) / 2
  return { fontSize: fontSize * 1.7, pause, glyphs: glyphs.map(g => ({ ...g, x: g.x + (width - maxWidth) / 2, y: g.y + top })) }
}

/** Rasterize each glyph once; animation frames only blit cached pixels, never reflow text. */
export default function DialogueCanvas({ width, height, progress, waiting = false, locale = 'zh-CN' }: { width: number; height: number; progress: number; waiting?: boolean; locale?: SiteLocale }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const cache = useRef<{
    context: CanvasRenderingContext2D; atlas: HTMLCanvasElement; ratio: number; cell: number;
    text: ReturnType<typeof textLayout>; scale: number;
    targets: { x: number; y: number; stagger: number }[];
  } | null>(null)

  useLayoutEffect(() => {
    const surface = canvas.current!
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    surface.width = Math.ceil(width * ratio)
    surface.height = Math.ceil(height * ratio)
    const context = surface.getContext('2d')!
    const style = getComputedStyle(surface)
    const text = textLayout(width, height, locale)
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
      ink.font = `${text.glyphs[index % text.glyphs.length].fontSize * ratio}px ${style.fontFamily}`
      ink.fillStyle = i < points.length ? muted : String(points[index][2])
      ink.fillText(text.glyphs[index % text.glyphs.length].character, (i % 32 + .5) * cell, (Math.floor(i / 32) + .5) * cell)
    }
    cache.current = {
      context, atlas, ratio, cell, text, scale,
      targets: points.map(([x, y], index) => ({
        x: width / 2 + (Number(x) - 620) * scale,
        y: height / 2 + (Number(y) - 619) * scale,
        stagger: ((index * 37) % 101) / 101,
      })),
    }
    return () => { cache.current = null; atlas.width = atlas.height = 0 }
  }, [width, height, locale])

  useLayoutEffect(() => {
    const { context, atlas, ratio, cell, text, scale, targets } = cache.current!
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)
    const typed = progress < .18 ? Math.floor(ramp(progress, 0, .16) * text.pause)
      : text.pause + Math.floor(ramp(progress, .18, .196) * (text.glyphs.length - text.pause))
    const visible = progress >= .20 ? points.length : typed
    context.globalAlpha = 1 - smooth(ramp(progress, .55, .65))
    for (let index = 0; index < visible; index++) {
      const source = text.glyphs[index % text.glyphs.length]
      const target = targets[index]
      const form = smooth(ramp(progress, .20 + target.stagger * .065, .43 + target.stagger * .065))
      const bend = Math.sin(form * Math.PI) * (target.stagger - .5) * Math.min(width * .12, 100)
      const x = source.x + (target.x - source.x) * form + bend
      const y = source.y + (target.y - source.y) * form
      const fontSize = source.fontSize + (22 * scale - source.fontSize) * form
      const destinationSize = cell / ratio * fontSize / source.fontSize
      const sprite = index + (form > .8 ? points.length : 0)
      context.globalAlpha = (1 - smooth(ramp(progress, .55, .65))) * (index < text.glyphs.length ? 1 : form)
      context.drawImage(atlas, sprite % 32 * cell, Math.floor(sprite / 32) * cell, cell, cell,
        x - destinationSize / 2, y - destinationSize / 2, destinationSize, destinationSize)
    }
    context.globalAlpha = 1
  }, [progress, width, height, waiting, locale])

  const layout = textLayout(width, height, locale)
  const typed = progress < .18 ? Math.floor(ramp(progress, 0, .16) * layout.pause)
    : layout.pause + Math.floor(ramp(progress, .18, .196) * (layout.glyphs.length - layout.pause))
  const last = layout.glyphs[Math.max(0, typed - 1)]
  return <>
    <canvas ref={canvas} className="text-logo__characters" aria-hidden="true" />
    {progress < .20 && <b className="text-logo__caret" aria-hidden="true" style={{ position: 'absolute', left: last.x + (typed ? last.advance / 2 : -last.advance / 2), top: last.y - last.fontSize / 2, height: last.fontSize }} />}
  </>
}
