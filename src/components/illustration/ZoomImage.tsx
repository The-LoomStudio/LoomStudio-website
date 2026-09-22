import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  const [previewReady, setPreviewReady] = useState(false)
  const [enlargedReady, setEnlargedReady] = useState(false)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    const preview = thumbnail.current
    setPreviewReady(Boolean(preview?.complete && preview.naturalWidth))
  }, [image.src])

  const inverse = () => {
    const first = (thumbnail.current ?? trigger.current!).getBoundingClientRect()
    const last = enlarged.current!.getBoundingClientRect()
    return `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${first.width / last.width}, ${first.height / last.height})`
  }
  const open = () => {
    if ((!children && !thumbnail.current!.naturalWidth) || dialog.current!.open) return
    closing.current = false
    delete dialog.current!.dataset.closing
    setEnlargedReady(false)
    const preview = enlarged.current!
    // The hidden dialog has no src until opened. Show the cached preview while the larger image decodes.
    preview.src = thumbnail.current?.currentSrc || image.src
    dialog.current!.showModal()
    preview.style.transition = 'none'
    preview.style.transform = 'none'
    preview.style.transform = inverse()
    preview.getBoundingClientRect()
    trigger.current!.style.visibility = 'hidden'
    preview.style.transition = ''
    preview.style.transform = 'none'
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
    // 关闭途中或打开未结束时，从浏览器当前插值位置继续回缩。
    const image = enlarged.current!
    const current = getComputedStyle(image).transform
    image.style.transition = 'none'
    image.style.transform = 'none'
    const target = inverse()
    image.style.transform = current
    image.getBoundingClientRect()
    image.style.transition = ''
    image.style.transform = target
    // transitionend 在关闭标签页等情况下可能不触发；计时器完成相同清理。
    timer.current = setTimeout(finish, 650)
  }

  return <figure className={['zoom-image', className].filter(Boolean).join(' ')}>
    <button ref={trigger} className="zoom-image__trigger" type="button" aria-label={`放大图片：${alt}`} onClick={open}>
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
        onLoad={() => setEnlargedReady(true)} onError={() => setEnlargedReady(false)}
        onTransitionEnd={event => {
          if (event.propertyName === 'transform' && closing.current) finish()
        }} />
      {caption && <p>{caption}</p>}
    </dialog>
  </figure>
}
