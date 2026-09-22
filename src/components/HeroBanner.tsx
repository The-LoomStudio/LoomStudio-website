import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import LayeredIllustration from './illustration/LayeredIllustration'
import ZoomImage from './illustration/ZoomImage'
import './hero-banner.css'

const slides = [
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

const bottomSlides = [
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

type Props = { className?: string; variant?: 'top' | 'bottom' }

export default function HeroBanner({ className = '', variant = 'top' }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const slideSet = variant === 'bottom' ? bottomSlides : slides

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive(index => (index + 1) % slideSet.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [slideSet.length])

  useEffect(() => {
    let frame = 0
    const banner = root.current!
    const update = () => {
      frame = 0
      const height = banner.clientHeight
      if (variant === 'bottom') {
        // Move the whole footer into place behind the content, not its image.
        banner.style.setProperty('--hero-bottom-offset', window.scrollY >= height ? '0px' : '-100%')
      } else {
        const progress = Math.min(1, window.scrollY / height)
        banner.style.visibility = progress < 1 ? 'visible' : 'hidden'
        const position = 50 - window.scrollY * 100 / document.documentElement.scrollHeight
        banner.style.setProperty('--hero-image-y', `${Math.max(0, position)}%`)
      }
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    update()
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(frame)
    }
  }, [variant])

  const move = (direction: number) => {
    setActive(index => (index + direction + slideSet.length) % slideSet.length)
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
          onPointerMove={updateLayeredPointer}
          onPointerLeave={resetLayeredPointer}
        >
          {'layered' in slide && slide.layered ? (
            <>
              <LayeredIllustration
                background="/images/nom/layers/nom-layer-004.png"
                foreground="/images/nom/layers/nom-layer-002.png"
                label={slide.alt}
              />
              <ZoomImage src={slide.src} alt={slide.alt} loading={index === 0 ? 'eager' : 'lazy'} className="hero-banner__zoom hero-banner__zoom--layered" />
            </>
          ) : (
            <ZoomImage src={slide.src} alt={slide.alt} loading={index === 0 ? 'eager' : 'lazy'} className="hero-banner__zoom" />
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
              onClick={() => setActive(index)}
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
