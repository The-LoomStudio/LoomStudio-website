import { useEffect, useRef, useState, type ReactNode } from 'react'
import { animate, type AnimationPlaybackControls } from 'motion'
import type { DisplayImage } from '../../lib/site-images'
import './zoom-image.css'

type Props = {
  image: DisplayImage
  fullSrc?: string
  sizes: string
  alt: string
  caption?: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'auto'
  onLoad?: () => void
  onError?: () => void
  children?: ReactNode
}

/** 同比例缩略图的 FLIP 展开；不裁切图片，也不改变正文占位。 */
export default function ZoomImage({
  image, fullSrc = image.src, sizes, alt, caption, className, loading = 'lazy',
  fetchPriority = 'auto', onLoad, onError, children,
}: Props) {
  const thumbnail = useRef<HTMLImageElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const enlarged = useRef<HTMLImageElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closing = useRef(false)
  const animation = useRef<AnimationPlaybackControls | undefined>(undefined)
  const [previewReady, setPreviewReady] = useState(false)
  const [enlargedReady, setEnlargedReady] = useState(false)

  useEffect(() => () => { clearTimeout(timer.current); animation.current?.stop() }, [])
  useEffect(() => {
    const preview = thumbnail.current
    setPreviewReady(Boolean(preview?.complete && preview.naturalWidth))
  }, [image.src])

  // Motion controls progress; measure the destination every frame because the marquee keeps moving.
  const animateImage = (from: DOMRect, destination: () => DOMRect, onComplete?: () => void) => {
    const preview = enlarged.current!
    preview.style.transform = 'none'
    const base = preview.getBoundingClientRect()
    const render = (progress: number) => {
      const to = destination()
      const left = from.left + (to.left - from.left) * progress
      const top = from.top + (to.top - from.top) * progress
      const width = from.width + (to.width - from.width) * progress
      const height = from.height + (to.height - from.height) * progress
      preview.style.transform = `translate(${left - base.left}px, ${top - base.top}px) scale(${width / base.width}, ${height / base.height})`
    }
    render(0)
    animation.current = animate(0, 1, {
      duration: 0.6, ease: [0.2, 0.8, 0.2, 1], onUpdate: render, onComplete,
    })
  }
  const thumbnailRect = () => (thumbnail.current ?? trigger.current!).getBoundingClientRect()
  const open = () => {
    if ((!children && !thumbnail.current!.naturalWidth) || dialog.current!.open) return
    closing.current = false
    delete dialog.current!.dataset.closing
    setEnlargedReady(false)
    const preview = enlarged.current!
    // The hidden dialog has no src until opened. Show the cached preview while the larger image decodes.
    preview.src = thumbnail.current?.currentSrc || image.src
    dialog.current!.showModal()
    preview.style.transform = 'none'
    const destination = preview.getBoundingClientRect()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animateImage(thumbnailRect(), () => destination)
    }
    trigger.current!.style.visibility = 'hidden'
    if (preview.src !== new URL(fullSrc, location.href).href) {
      const full = new Image()
      full.src = fullSrc
      full.decode().then(() => {
        if (dialog.current?.open && !closing.current) preview.src = fullSrc
      }).catch(() => {
        // A failed high-resolution request must not discard the usable preview.
      })
    }
  }
  const finish = () => {
    clearTimeout(timer.current)
    animation.current?.stop()
    dialog.current!.close()
    trigger.current!.style.visibility = ''
    trigger.current!.focus({ preventScroll: true })
    closing.current = false
  }
  const close = () => {
    if (closing.current || !dialog.current!.open) return
    closing.current = true
    dialog.current!.dataset.closing = ''
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
      return
    }
    animation.current?.stop()
    const from = enlarged.current!.getBoundingClientRect()
    const marquee = trigger.current!.closest('[data-zoom-marquee]')
    // A looping track has two copies. Return to the copy nearest the viewport after a wrap.
    const copies = marquee
      ? Array.from(marquee.querySelectorAll<HTMLButtonElement>('button[data-zoom-source]'))
        .filter(button => button.dataset.zoomSource === image.src
          && button.closest('[data-zoom-lane]') === trigger.current!.closest('[data-zoom-lane]'))
      : []
    const destination = () => {
      if (!copies.length) return thumbnailRect()
      const rects = copies.map(button => button.querySelector('img')!.getBoundingClientRect())
      return rects.reduce((nearest, rect) =>
        Math.abs(rect.left + rect.width / 2 - innerWidth / 2) < Math.abs(nearest.left + nearest.width / 2 - innerWidth / 2)
          ? rect : nearest)
    }
    animateImage(from, destination, finish)
    // Motion's frame loop pauses in background tabs; still release the modal there.
    timer.current = setTimeout(finish, 650)
  }

  return <figure className={['zoom-image', className].filter(Boolean).join(' ')}>
    <button ref={trigger} className="zoom-image__trigger" type="button" data-zoom-source={image.src} aria-label={`放大图片：${alt}`} onClick={open}>
      {children ?? <img ref={thumbnail} src={image.src} srcSet={image.srcSet} sizes={sizes}
        width={image.width} height={image.height} alt={alt} loading={loading}
        fetchPriority={fetchPriority} decoding="async" style={{ opacity: previewReady ? 1 : 0 }}
        onLoad={() => { setPreviewReady(true); onLoad?.() }}
        onError={() => { setPreviewReady(false); onError?.() }} />}
    </button>
    {caption && <figcaption>{caption}</figcaption>}
    <dialog ref={dialog} className="zoom-image__dialog" aria-label={alt}
      onCancel={event => { event.preventDefault(); close() }}
      onClick={event => { if (event.target === event.currentTarget) close() }}>
      <button className="zoom-image__close" type="button" onClick={close} autoFocus aria-label="关闭图片">×</button>
      <img ref={enlarged} width={image.width} height={image.height} alt={alt} onClick={close}
        style={{ opacity: enlargedReady ? 1 : 0 }}
        onLoad={() => setEnlargedReady(true)} onError={() => setEnlargedReady(false)} />
      {caption && <p>{caption}</p>}
    </dialog>
  </figure>
}
