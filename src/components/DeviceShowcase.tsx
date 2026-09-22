import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Laptop, Smartphone } from 'lucide-react'
import StoryDemo from './story-demo/StoryDemo'
import './device-showcase.css'

const devices = [
  { id: 'phone', label: '手机', icon: Smartphone, width: 428, viewportWidth: 390, className: 'device-iphone-14-pro' },
  { id: 'laptop', label: '电脑', icon: Laptop, width: 740, viewportWidth: 1280, className: 'device-macbook-pro device-spacegray' },
] as const

export default function DeviceShowcase() {
  const [active, setActive] = useState(0)
  const slot = useRef<HTMLDivElement>(null)
  const tabs = useRef<HTMLDivElement>(null)
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

  const navigateTabs = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: number
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight': next = 1 - active; break
      case 'Home': next = 0; break
      case 'End': next = 1; break
      default: return
    }
    event.preventDefault()
    setActive(next)
    tabs.current!.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next].focus()
  }

  return <div className="device-showcase">
    <div ref={tabs} className="device-tabs" role="tablist" aria-label="演示设备" onKeyDown={navigateTabs}>
      {devices.map(({ id, label, icon: Icon }, index) => (
        <button key={id} id={`device-tab-${id}`} type="button" role="tab"
          aria-selected={active === index} aria-controls="device-preview-panel"
          tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)}>
          <Icon size={16} aria-hidden="true" />{label}
        </button>
      ))}
    </div>
    <div id="device-preview-panel" role="tabpanel" aria-labelledby={`device-tab-${device.id}`}
      className={`device-preview device-preview--${device.id}`}>
      <div ref={slot} className="device-slot">
        <div className={`device ${device.className}`}>
          <div className="device-frame">
            <div ref={screen} className="device-screen">
              <div className="device-app-viewport">
                <StoryDemo />
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
