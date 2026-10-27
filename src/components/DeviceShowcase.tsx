import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import type { DisplayImage } from '../lib/site-images'
import type { Weather } from './story-demo/WeatherBackdrop'
import StoryDemo from './story-demo/StoryDemo'
import './device-showcase.css'

const devices = [
  { id: 'phone', label: '手机', width: 428, viewportWidth: 390, className: 'device-iphone-14-pro' },
  { id: 'laptop', label: '电脑', width: 740, viewportWidth: 1280, className: 'device-macbook-pro device-spacegray' },
] as const

export default function DeviceShowcase({ progress, avatar, weather, onWeatherChange }: { progress: number; avatar: DisplayImage; weather: Weather; onWeatherChange: (weather: Weather) => void }) {
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const slot = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const device = devices[active]

  useLayoutEffect(() => {
    const element = slot.current!
    const display = screen.current!
    const resize = () => {
      element.style.setProperty('--device-scale', String(element.clientWidth / device.width))
      // Measure the screen's unzoomed content box, excluding its bezel safe areas.
      const style = getComputedStyle(display)
      const width = display.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
      const height = display.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      const scale = width / device.viewportWidth
      display.style.setProperty('--app-width', `${device.viewportWidth}px`)
      display.style.setProperty('--app-height', `${height / scale}px`)
      display.style.setProperty('--app-scale', String(scale))
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    observer.observe(display)
    return () => observer.disconnect()
  }, [device.width, device.viewportWidth])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 680px)')
    const sync = () => setActive(query.matches ? 0 : 1)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])
  return <div className="device-showcase">
    <div aria-label={`${device.label}端工作台演示`}
      className={`device-preview device-preview--${device.id}`}>
      <div ref={slot} className="device-slot"
        style={{ aspectRatio: device.id === 'phone' ? 428 / 868 : 740 / 434 }}>
        <div className={`device ${device.className}`}>
          <div className="device-frame">
            <div ref={screen} className="device-screen">
              <div className="device-app-viewport">
                <StoryDemo progress={reducedMotion ? 1 : progress} avatar={avatar} weather={weather} onWeatherChange={onWeatherChange} />
              </div>
            </div>
          </div>
          <div className="device-stripe" aria-hidden="true" />
          <div className="device-header" aria-hidden="true" />
          <div className="device-sensors" aria-hidden="true" />
          <div className="device-btns" aria-hidden="true" />
          <div className="device-power" aria-hidden="true" />
          <div className="device-home" aria-hidden="true" />
        </div>
      </div>
    </div>
  </div>
}
