import { useCallback, useRef } from 'react'
import { useSettledParallax } from './useSettledParallax'
import './layered-illustration.css'

type Props = {
  background: string
  foreground: string
  label: string
  foregroundFit?: 'contain' | 'cover'
}

// 移植自 Odysseia AuthSceneBackground：只平移，不倾斜整幅插图。
export default function LayeredIllustration({
  background, foreground, label, foregroundFit = 'contain',
}: Props) {
  const root = useRef<HTMLDivElement>(null)
  const setTarget = useSettledParallax(useCallback(({ x, y }) => {
    root.current!.style.setProperty('--illustration-x', String(x))
    root.current!.style.setProperty('--illustration-y', String(y))
  }, []))

  return <div ref={root} className="layered-illustration" data-foreground-fit={foregroundFit}
    role="img" aria-label={label}
    onPointerMove={event => {
      if (event.pointerType !== 'mouse') return
      const rect = event.currentTarget.getBoundingClientRect()
      setTarget({
        x: (event.clientX - rect.left) / rect.width * 2 - 1,
        y: (event.clientY - rect.top) / rect.height * 2 - 1,
      })
    }}
    onPointerLeave={() => setTarget({ x: 0, y: 0 })}>
    <img className="layered-illustration__background" src={background} alt="" loading="eager" decoding="async" />
    <img className="layered-illustration__foreground" src={foreground} alt="" loading="eager" decoding="async" />
  </div>
}
