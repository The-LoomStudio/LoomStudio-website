import { useEffect, useRef } from 'react'
import './zoom-image.css'

type Props = { src: string; alt: string; caption?: string; className?: string; loading?: 'lazy' | 'eager' }

/** 同比例缩略图的 FLIP 展开；不裁切图片，也不改变正文占位。 */
export default function ZoomImage({ src, alt, caption, className, loading = 'lazy' }: Props) {
  const thumbnail = useRef<HTMLImageElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const enlarged = useRef<HTMLImageElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const closing = useRef(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  const inverse = () => {
    const first = thumbnail.current!.getBoundingClientRect()
    const last = enlarged.current!.getBoundingClientRect()
    return `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${first.width / last.width}, ${first.height / last.height})`
  }
  const open = () => {
    if (!thumbnail.current!.naturalWidth || dialog.current!.open) return
    closing.current = false
    dialog.current!.showModal()
    const image = enlarged.current!
    image.style.transition = 'none'
    image.style.transform = 'none'
    image.style.transform = inverse()
    image.getBoundingClientRect()
    thumbnail.current!.style.visibility = 'hidden'
    image.style.transition = ''
    image.style.transform = 'none'
  }
  const finish = () => {
    clearTimeout(timer.current)
    dialog.current!.close()
    thumbnail.current!.style.visibility = ''
    trigger.current!.focus({ preventScroll: true })
    closing.current = false
  }
  const close = () => {
    if (closing.current || !dialog.current!.open) return
    closing.current = true
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
      <img ref={thumbnail} src={src} alt={alt} loading={loading} decoding="async" />
    </button>
    {caption && <figcaption>{caption}</figcaption>}
    <dialog ref={dialog} className="zoom-image__dialog" aria-label={alt}
      onCancel={event => { event.preventDefault(); close() }}
      onClick={event => { if (event.target === event.currentTarget) close() }}>
      <button className="zoom-image__close" type="button" onClick={close} autoFocus aria-label="关闭图片">×</button>
      <img ref={enlarged} src={src} alt={alt} onClick={close}
        onTransitionEnd={event => {
          if (event.propertyName === 'transform' && closing.current) finish()
        }} />
      {caption && <p>{caption}</p>}
    </dialog>
  </figure>
}
