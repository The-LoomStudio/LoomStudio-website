import { memo, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { LoomMarkPaint, loomMarkParts } from './LoomMark'
import './logo-transition-stage.css'

const ramp = (value: number, start: number, end: number) => Math.max(0, Math.min(1, (value - start) / (end - start)))

/** Progress is externally controlled so the same reveal can follow time or scrolling. */
function LogoTransition({ progress, reducedMotion = false, children }: {
  progress: number
  reducedMotion?: boolean
  children: ReactNode
}) {
  const host = useRef<HTMLDivElement>(null)
  const id = useId()
  const [size, setSize] = useState({ width: 1200, height: 720 })
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) setSize({ width, height })
    })
    observer.observe(host.current!)
    return () => observer.disconnect()
  }, [])

  const { width, height } = size
  const baseScale = Math.min(width * 0.64, height * 0.84, 540) / 1254
  // Only the central opening reveals the destination; ring gaps stay opaque.
  const apertureRadius = 60
  const finalZoom = Math.hypot(width, height) / (2 * apertureRadius * baseScale) * 1.08
  const zoom = Math.exp(ramp(progress, 0.58, 1) ** 1.35 * Math.log(finalZoom))
  const transform = `translate(${width / 2} ${height / 2}) scale(${baseScale * zoom}) translate(-620 -619)`
  const reveal = ramp(progress, 0.47, 0.59)

  return <div className="logo-transition" ref={host}>
    <div className="logo-transition__destination" inert={progress < 1}>{children}</div>
    <svg className="logo-transition__curtain" viewBox={`0 0 ${width} ${height}`} aria-hidden="true"
      style={{ opacity: reducedMotion ? 1 - ramp(progress, 0.44, 1) : 1 }}>
      <LoomMarkPaint prefix={id} />
      <defs>
        <mask id={`${id}-aperture`} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height} style={{ maskType: 'luminance' }}>
          <rect width={width} height={height} fill="white" />
          {!reducedMotion && <g transform={transform}>
            <circle cx="620" cy="619" r={apertureRadius} fill="black" opacity={reveal} />
            {loomMarkParts.map(part => <path key={part.id} d={part.d} fill="white" fillRule="evenodd" />)}
          </g>}
        </mask>
      </defs>
      <rect width={width} height={height} fill="var(--loom-site-bg)" mask={`url(#${id}-aperture)`} />
      <g transform={reducedMotion ? `translate(${width / 2} ${height / 2}) scale(${baseScale}) translate(-620 -619)` : transform}>
        {loomMarkParts.map((part, index) => {
          const draw = reducedMotion ? 1 : ramp(progress, index * 0.065, 0.23 + index * 0.065)
          const fill = reducedMotion ? 1 : ramp(progress, 0.16 + index * 0.065, 0.29 + index * 0.065)
          return <g key={part.id}>
            <path d={part.d} fill={`url(#${id}-${part.id})`} fillRule="evenodd" opacity={fill} />
            <path d={part.d} fill="none" stroke={`url(#${id}-${part.id})`} strokeWidth="3" pathLength="1"
              strokeDasharray="1" strokeDashoffset={1 - draw} opacity={draw > 0 ? 1 - fill : 0} />
          </g>
        })}
      </g>
    </svg>
  </div>
}

export default memo(LogoTransition)
