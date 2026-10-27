import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import LogoTransition from '../logo-transition/LogoTransition'
import DialogueCanvas from './DialogueCanvas'
import './text-logo-transition.css'

const ramp = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)))
const smooth = (t: number) => t * t * (3 - 2 * t)
/** Dialogue keeps its original glyphs while forming the mark, then reveals the page. */
export default function TextLogoTransition({ progress, reducedMotion = false, waiting = false, children }: {
  progress: number; reducedMotion?: boolean; waiting?: boolean; children: ReactNode
}) {
  const host = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 1200, height: 750 })
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width && height) setSize({ width, height })
    })
    observer.observe(host.current!)
    return () => observer.disconnect()
  }, [])
  const { width, height } = size
  const solid = smooth(ramp(progress, 0.55, 0.65))
  const stageProgress = 0.44 + ramp(progress, 0.70, 1) * 0.56

  return <div className="text-logo" ref={host} style={{ '--text-logo-solid': reducedMotion ? 1 : solid } as CSSProperties}>
    <LogoTransition progress={stageProgress} reducedMotion={reducedMotion}>{children}</LogoTransition>
    {reducedMotion && waiting && <span className="text-logo__thinking text-logo__thinking--reduced" role="status" aria-label="正在思考"><i /></span>}
    {!reducedMotion && progress < 0.66 && <DialogueCanvas width={width} height={height} progress={progress} waiting={waiting} />}
  </div>
}
