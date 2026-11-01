import { useEffect, useState } from 'react'
import type { BrandWelcomeCopy } from './BrandWelcome'

export default function RotatingSlogan({ copy, active, reduced }: {
  copy: BrandWelcomeCopy; active: boolean; reduced: boolean
}) {
  const [frame, setFrame] = useState({ line: 0, count: Array.from(copy.slogans[0]).length, phase: 'hold' })
  const [background, setBackground] = useState(false)
  useEffect(() => {
    const sync = () => setBackground(document.hidden)
    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [])

  useEffect(() => {
    if (!active || reduced || background) return
    const length = Array.from(copy.slogans[frame.line]).length
    const delay = frame.phase === 'hold' ? Math.max(3000, length * 90)
      : frame.phase === 'delete' ? 400 / length : frame.phase === 'gap' ? 180 : 1000 / length
    const timer = window.setTimeout(() => {
      setFrame(current => {
        if (current.phase === 'hold') return { ...current, phase: 'delete' }
        if (current.phase === 'delete') return current.count > 1
          ? { ...current, count: current.count - 1 } : { ...current, count: 0, phase: 'gap' }
        if (current.phase === 'gap') return { line: (current.line + 1) % copy.slogans.length, count: 0, phase: 'type' }
        return { ...current, count: current.count + 1, phase: current.count + 1 >= length ? 'hold' : 'type' }
      })
    }, delay)
    return () => window.clearTimeout(timer)
  }, [active, reduced, background, copy.slogans, frame])

  return <div className="brand-welcome__slogan-row">
    <p className="brand-welcome__slogan" aria-label={copy.slogan}>
      {copy.slogans.map(line => <span key={line} className="brand-welcome__slogan-size" aria-hidden="true">{line}<i /></span>)}
      <span className="brand-welcome__slogan-current" aria-hidden="true">
        <span className="brand-welcome__slogan-size">{reduced ? copy.slogan : copy.slogans[frame.line]}<i /></span>
        <span className="brand-welcome__slogan-live">
          {reduced ? copy.slogan : Array.from(copy.slogans[frame.line]).slice(0, frame.count).join('')}
          {!reduced && <i className="brand-welcome__caret" data-paused={!active || background} />}
        </span>
      </span>
    </p>
  </div>
}
