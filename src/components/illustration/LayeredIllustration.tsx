import { useCallback, useEffect, useRef, useState } from 'react'
import { useSettledParallax } from './useSettledParallax'
import type { DisplayImage } from '../../lib/site-images'
import './layered-illustration.css'

type Props = {
  background: DisplayImage
  foreground: DisplayImage
  label: string
  foregroundFit?: 'contain' | 'cover'
  onLoad?: () => void
  onError?: () => void
}

// 移植自 Odysseia AuthSceneBackground：只平移，不倾斜整幅插图。
export default function LayeredIllustration({
  background, foreground, label, foregroundFit = 'contain', onLoad, onError,
}: Props) {
  const root = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState([false, false])
  const reportLoaded = () => {
    const loaded = Array.from(root.current!.querySelectorAll('img')).map(image => Boolean(image.complete && image.naturalWidth))
    setReady(loaded)
    if (loaded.every(Boolean)) onLoad?.()
  }
  const reportError = () => { reportLoaded(); onError?.() }
  useEffect(reportLoaded, [background.src, foreground.src])
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
    <img className="layered-illustration__background" src={background.src} srcSet={background.srcSet}
      sizes={`max(100vw, ${Math.ceil(background.width / background.height * 100)}svh)`}
      width={background.width} height={background.height} alt="" loading="eager" fetchPriority="high"
      decoding="async" style={{ opacity: ready[0] ? 1 : 0 }} onLoad={reportLoaded} onError={reportError} />
    <img className="layered-illustration__foreground" src={foreground.src} srcSet={foreground.srcSet}
      sizes="(max-width: 639px) 1560px, 100vw"
      width={foreground.width} height={foreground.height} alt="" loading="eager" fetchPriority="high"
      decoding="async" style={{ opacity: ready[1] ? 1 : 0 }} onLoad={reportLoaded} onError={reportError} />
  </div>
}
