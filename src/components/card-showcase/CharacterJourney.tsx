import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import type { DisplayImage } from '../../lib/site-images'
import CardMasonry, { selectedCard } from './CardMasonry'
import DeviceShowcase from '../DeviceShowcase'
import './character-journey.css'
import WeatherBackdrop, { type Weather } from '../story-demo/WeatherBackdrop'

const range = (value: number, start: number, end: number) => Math.max(0, Math.min(1, (value - start) / (end - start)))

export default function CharacterJourney({ images }: { images: Record<string, DisplayImage> }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const traveller = useRef<HTMLImageElement>(null)
  const [weather, setWeather] = useState<Weather>('illustration')
  const [progress, setProgress] = useState(0)
  const reducedMotion = useReducedMotion()
  const avatar = images[selectedCard.src]

  useEffect(() => {
    if (reducedMotion) return
    const element = root.current!
    const sticky = stage.current!
    let frame = 0
    const update = () => {
      frame = 0
      const bounds = track.current!.getBoundingClientRect()
      const p = range(-bounds.top, 0, track.current!.offsetHeight - sticky.offsetHeight)
      setProgress(p)
      if (p <= 0 || p >= .14) return
      const source = element.querySelector('[data-journey-source] .zoom-image__trigger')!
      const target = element.querySelector('[data-journey-avatar]')!
      const from = source.getBoundingClientRect()
      const to = target.getBoundingClientRect()
      const origin = sticky.getBoundingClientRect()
      const t = range(p, 0, .14)
      const ease = t * t * (3 - 2 * t)
      Object.assign(traveller.current!.style, {
        left: `${from.left - origin.left + (to.left - from.left) * ease}px`,
        top: `${from.top - origin.top + (to.top - from.top) * ease}px`,
        width: `${from.width + (to.width - from.width) * ease}px`,
        height: `${from.height + (to.height - from.height) * ease}px`,
        borderRadius: `${14 + 200 * ease}px`,
      })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const observer = new ResizeObserver(schedule)
    observer.observe(sticky)
    observer.observe(element.querySelector('.card-masonry')!)
    observer.observe(element.querySelector('[data-journey-avatar]')!)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [reducedMotion])

  const demoProgress = reducedMotion ? 1 : range(progress, .16, .95)
  const landed = progress >= .14 || Boolean(reducedMotion)
  return <div ref={root} className="character-journey" data-reduced={reducedMotion || undefined}>
    <div className="character-journey__gallery" inert={!reducedMotion && progress > 0} aria-hidden={!reducedMotion && progress > 0}
        style={{ opacity: reducedMotion ? 1 : 1 - range(progress, 0, .12) }}>
        <CardMasonry images={images} />
      </div>
    <div ref={track} className="character-journey__track">
    <div ref={stage} className="character-journey__stage">
      <div className="character-journey__scene" aria-hidden={!landed} inert={!landed} data-landed={landed}
        style={{ opacity: reducedMotion ? 1 : range(progress, .025, .14) }}>
        <WeatherBackdrop weather={weather} />
        <DeviceShowcase progress={demoProgress} avatar={avatar} weather={weather} onWeatherChange={setWeather} />
      </div>
      <img ref={traveller} className="character-journey__traveller" src={avatar.src} alt="" aria-hidden="true"
        style={{ visibility: !reducedMotion && progress > 0 && progress < .14 ? 'visible' : 'hidden' }} />
    </div>
    </div>
  </div>
}
