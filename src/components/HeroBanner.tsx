import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LayeredIllustration from './illustration/LayeredIllustration'
import ZoomImage from './illustration/ZoomImage'
import type { DisplayImage } from '../lib/site-images'
import './hero-banner.css'

export const slides = [
  {
    src: '/images/nom/layers/nom-layer-composite-002-004.png',
    alt: '诺姆与另一位人物置于 Loom Studio 海岸构图前',
    textSide: 'left',
    mobilePosition: '58%',
    layered: true,
    eyebrow: 'LOOM STUDIO / 01',
    title: '让故事拥有自己的世界',
    copy: '从一个角色开始，把设定、选择和每一次回望编织成一条可以继续走下去的世界线。',
  },
  {
    src: '/images/nom/banners/nom-banner-015.png',
    alt: '带有 Loom Studio 品牌字样的诺姆横幅',
    textSide: 'none',
    mobilePosition: '58%',
    eyebrow: 'LOOM STUDIO / 02',
    title: '',
    copy: '',
  },
  {
    src: '/images/nom/banners/nom-banner-011.png',
    alt: '带有 Loom Studio 品牌字样的诺姆海岸横幅',
    textSide: 'none',
    mobilePosition: '42%',
    eyebrow: 'LOOM STUDIO / 03',
    title: '',
    copy: '',
  },
]

export const bottomSlides = [
  {
    src: '/images/nom/banners/nom-banner-001.png',
    alt: '诺姆坐在夜色湖畔',
    textSide: 'none',
    mobilePosition: '64%',
    eyebrow: '',
    title: '',
    copy: '',
  },
  {
    src: '/images/nom/banners/nom-banner-006.png',
    alt: '诺姆与另一位人物坐在篝火旁',
    textSide: 'none',
    mobilePosition: '56%',
    eyebrow: '',
    title: '',
    copy: '',
  },
  {
    src: '/images/nom/banners/nom-banner-010.png',
    alt: '诺姆坐在海岸木栈桥上阅读',
    textSide: 'none',
    mobilePosition: '38%',
    eyebrow: '',
    title: '',
    copy: '',
  },
]

type Props = {
  className?: string
  variant?: 'top' | 'bottom'
  images: Record<string, DisplayImage & { fullSrc: string }>
  layers?: { background: DisplayImage; foreground: DisplayImage }
}

export default function HeroBanner({ className = '', variant = 'top', images, layers }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [target, setTarget] = useState(0)
  const [enabled, setEnabled] = useState(variant === 'top')
  const [playing, setPlaying] = useState(false)
  const loaded = useRef(new Set<number>())
  const slideSet = variant === 'bottom' ? bottomSlides : slides

  useEffect(() => {
    if (variant !== 'bottom') return
    // Observe the document-flow boundary, not the fixed footer behind the page.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setEnabled(true)
        observer.disconnect()
      }
    }, { rootMargin: '800px' })
    observer.observe(document.getElementById('footer-banner-start')!)
    return () => observer.disconnect()
  }, [variant])

  useEffect(() => {
    if (!enabled || !playing || target !== active) return
    const timer = window.setTimeout(() => {
      select((active + 1) % slideSet.length)
    }, 7000)
    return () => window.clearTimeout(timer)
  }, [active, target, enabled, playing, slideSet.length])

  useEffect(() => {
    let frame = 0
    const banner = root.current!
    const update = () => {
      frame = 0
      const height = banner.clientHeight
      if (variant === 'bottom') {
        // Move the whole footer into place behind the content, not its image.
        banner.style.setProperty('--hero-bottom-offset', window.scrollY >= height ? '0px' : '-100%')
        setPlaying(!document.hidden && document.getElementById('footer-banner-start')!.getBoundingClientRect().top < window.innerHeight)
      } else {
        const progress = Math.min(1, window.scrollY / height)
        banner.style.visibility = progress < 1 ? 'visible' : 'hidden'
        const position = 50 - window.scrollY * 100 / document.documentElement.scrollHeight
        banner.style.setProperty('--hero-image-y', `${Math.max(0, position)}%`)
        setPlaying(!document.hidden && progress < 1)
      }
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    document.addEventListener('visibilitychange', requestUpdate)
    update()
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      document.removeEventListener('visibilitychange', requestUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [variant])

  function select(index: number) {
    setTarget(index)
    if (loaded.current.has(index)) setActive(index)
  }

  const move = (direction: number) => {
    select((active + direction + slideSet.length) % slideSet.length)
  }

  const updateLayeredPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (!('layered' in slideSet[active]) || !slideSet[active].layered || event.pointerType !== 'mouse') return
    const layered = event.currentTarget.querySelector<HTMLElement>('.layered-illustration')
    if (!layered) return
    const rect = event.currentTarget.getBoundingClientRect()
    layered.style.setProperty('--illustration-x', String((event.clientX - rect.left) / rect.width * 2 - 1))
    layered.style.setProperty('--illustration-y', String((event.clientY - rect.top) / rect.height * 2 - 1))
  }

  const resetLayeredPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const layered = event.currentTarget.querySelector<HTMLElement>('.layered-illustration')
    layered?.style.setProperty('--illustration-x', '0')
    layered?.style.setProperty('--illustration-y', '0')
  }

  return (
    <div ref={root} className={`hero-banner hero-banner--${variant} ${className}`} aria-label="Loom Studio 介绍 Banner">
      {slideSet.map((slide, index) => (
        <article
          className={`hero-banner__slide hero-banner__slide--text-${slide.textSide}${index === active ? ' is-active' : ''}`}
          style={{ '--hero-mobile-position': slide.mobilePosition } as CSSProperties}
          key={slide.src}
          aria-hidden={index !== active}
          inert={index !== active}
          onPointerMove={updateLayeredPointer}
          onPointerLeave={resetLayeredPointer}
        >
          {enabled && (index === active || index === target || loaded.current.has(index)) && (
            <ZoomImage image={images[slide.src]} fullSrc={images[slide.src].fullSrc}
              sizes={`max(100vw, ${Math.ceil(images[slide.src].width / images[slide.src].height * 100)}svh)`}
              alt={slide.alt} loading="eager" fetchPriority={variant === 'top' && index === 0 ? 'high' : 'auto'}
              onLoad={() => { loaded.current.add(index); if (index === target) setActive(index) }}
              onError={() => setTarget(active)}
              className="hero-banner__zoom">
              {'layered' in slide && slide.layered && layers ? (
                <LayeredIllustration {...layers} label={slide.alt}
                  onLoad={() => { loaded.current.add(index); if (index === target) setActive(index) }}
                  onError={() => setTarget(active)} />
              ) : undefined}
            </ZoomImage>
          )}
          <div className="hero-banner__shade" aria-hidden="true" />
          <div className="hero-banner__copy">
            <p className="eyebrow">{slide.eyebrow}</p>
            <h1>{slide.title}</h1>
            <p>{slide.copy}</p>
          </div>
        </article>
      ))}
      <div className="hero-banner__controls">
        <button type="button" onClick={() => move(-1)} aria-label="上一张 Banner"><ChevronLeft size={18} /></button>
        <div className="hero-banner__dots" aria-label="选择 Banner">
          {slideSet.map((slide, index) => (
            <button
              type="button"
              className={index === active ? 'is-active' : ''}
              key={slide.src}
              onClick={() => select(index)}
              aria-label={`第 ${index + 1} 张 Banner`}
              aria-current={index === active ? 'true' : undefined}
            />
          ))}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="下一张 Banner"><ChevronRight size={18} /></button>
      </div>
    </div>
  )
}
