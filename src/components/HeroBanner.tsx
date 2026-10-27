import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import SiteMotion from './motion/SiteMotion'
import LayeredIllustration from './illustration/LayeredIllustration'
import ZoomImage from './illustration/ZoomImage'
import { BannerArtwork, BannerIntro } from './illustration/BannerArtwork'
import type { DisplayImage } from '../lib/site-images'
import './hero-banner.css'

export const slides = [
  {
    src: '/images/nom/layers/nom-layer-composite-002-004.png',
    alt: '诺姆与另一位人物置于 Loom Studio 海岸构图前',
    mobilePosition: '58%',
    layered: true,
  },
  {
    src: '/images/nom/banners/nom-banner-015.png',
    alt: '带有 Loom Studio 品牌字样的诺姆横幅',
    mobilePosition: '58%',
  },
  {
    src: '/images/nom/banners/nom-banner-011.png',
    alt: '带有 Loom Studio 品牌字样的诺姆海岸横幅',
    mobilePosition: '42%',
  },
]

type Props = {
  className?: string
  images: Record<string, DisplayImage & { fullSrc: string }>
  layers?: { background: DisplayImage; foreground: DisplayImage }
}

export default function HeroBanner({ className = '', images, layers }: Props) {
  const reducedMotion = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [target, setTarget] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const loaded = useRef(new Set<number>())
  const slideSet = slides

  useEffect(() => {
    if (!playing || paused || reducedMotion || target !== active) return
    const timer = window.setTimeout(() => {
      select((active + 1) % slideSet.length)
    }, 7000)
    return () => window.clearTimeout(timer)
  }, [active, target, playing, paused, reducedMotion, slideSet.length])

  useEffect(() => {
    let frame = 0
    const banner = root.current!
    const update = () => {
      frame = 0
      const height = banner.clientHeight
      const progress = Math.min(1, window.scrollY / height)
      banner.style.visibility = progress < 1 ? 'visible' : 'hidden'
      const position = 50 - window.scrollY * 100 / document.documentElement.scrollHeight
      banner.style.setProperty('--hero-image-y', `${Math.max(0, position)}%`)
      setPlaying(!document.hidden && progress < 1)
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
  }, [])

  function select(index: number) {
    setTarget(index)
    if (loaded.current.has(index)) setActive(index)
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

  const controls = <div className="hero-banner__controls" onFocus={() => setPaused(true)} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
  }}>
    <div className="hero-banner__dots" aria-label="选择 Banner">
      {slideSet.map((slide, index) => (
        <m.button
          initial={false}
          animate={{ width: index === active ? 26 : 7 }}
          transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
          type="button"
          className={index === active ? 'is-active' : ''}
          key={slide.src}
          onClick={() => select(index)}
          aria-label={`第 ${index + 1} 张 Banner`}
          aria-current={index === active ? 'true' : undefined}
        />
      ))}
    </div>
  </div>

  return (
    <SiteMotion>
      <div ref={root} className={`hero-banner hero-banner--top ${className}`} aria-label="Loom Studio 介绍 Banner">
        {slideSet.map((slide, index) => (
          <m.article
            initial={false}
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.7, ease: 'easeInOut' }}
            className={`hero-banner__slide${index === active ? ' is-active' : ''}`}
            style={{ '--hero-mobile-position': slide.mobilePosition } as CSSProperties}
            key={slide.src}
            aria-hidden={index !== active}
            inert={index !== active}
            onPointerMove={updateLayeredPointer}
            onPointerLeave={resetLayeredPointer}
          >
            {(index === active || index === target || loaded.current.has(index)) && (
              <BannerArtwork breathe={!('layered' in slide && slide.layered)} playing={playing && !paused && index === active}>
              <ZoomImage image={images[slide.src]} fullSrc={images[slide.src].fullSrc}
                sizes={`max(100vw, ${Math.ceil(images[slide.src].width / images[slide.src].height * 100)}svh)`}
                alt={slide.alt} loading="eager" fetchPriority={index === 0 ? 'high' : 'auto'}
                onLoad={() => { loaded.current.add(index); if (index === target) setActive(index) }}
                onError={() => setTarget(active)}
                className="hero-banner__zoom">
                {'layered' in slide && slide.layered && layers ? (
                  <LayeredIllustration {...layers} label={slide.alt}
                    onLoad={() => { loaded.current.add(index); if (index === target) setActive(index) }}
                    onError={() => setTarget(active)} />
                ) : undefined}
              </ZoomImage>
              </BannerArtwork>
            )}
            {'layered' in slide && slide.layered === true && <BannerIntro />}
          </m.article>
        ))}
      </div>
      {controls}
    </SiteMotion>
  )
}
