import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { CloudField } from '../../scripts/cloud-field'

export type Weather = 'illustration' | 'clear' | 'sunset' | 'rain'

/** Local atmosphere only; never dispatch the marketplace's global sky events. */
export default function WeatherBackdrop({ weather }: { weather: Weather }) {
  const root = useRef<HTMLDivElement>(null)
  const clouds = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (weather === 'illustration') return
    const field = new CloudField(clouds.current!, { density: .6, motionScale: .35 })
    let visible = false
    const sync = () => {
      const paused = !visible || document.hidden || Boolean(reduced)
      field.setPaused(paused)
      root.current!.dataset.paused = String(paused)
    }
    field.setPaused(true)
    field.start()
    field.setAtmosphere(weather === 'rain' ? 'brightness(.55) saturate(.25)' : weather === 'sunset' ? 'brightness(.8) sepia(.4)' : 'brightness(1)', .75)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(root.current!)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); field.destroy() }
  }, [weather, reduced])
  return <div ref={root} className="story-weather" data-weather={weather} aria-hidden="true">
    <div className="story-weather__tone" />
    <div ref={clouds} className="story-weather__clouds" />
    {weather === 'rain' && <div className="story-weather__rain">{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${-(i % 11) * .17}s`, animationDuration: `${.8 + (i % 5) * .12}s` }} />)}</div>}
  </div>
}
