import { useEffect, useState } from 'react'
import { animate } from 'motion'
import type { SiteLocale } from '../../lib/i18n'
import TextLogoTransition from '../text-logo-transition/TextLogoTransition'

/** The overlay reveals the real document underneath, never a duplicate Banner. */
export default function PageArrivalScene({ locale }: { locale: SiteLocale }) {
  const [progress, setProgress] = useState(0)
  const [waiting, setWaiting] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.arrival !== 'loading') return
    const overlay = document.querySelector<HTMLElement>('[data-page-arrival]')!
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(reducedMotion)
    const controller = new AbortController()
    const { signal } = controller
    const siblings = [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlay)
    const previousInert = siblings.map(node => node.inert)
    siblings.forEach(node => { node.inert = true })
    let animation: ReturnType<typeof animate> | undefined

    function restore() {
      if (signal.aborted) return
      animation?.stop()
      controller.abort()
      siblings.forEach((node, index) => { node.inert = previousInert[index] })
      overlay.setAttribute('aria-busy', 'false')
      delete root.dataset.arrival
    }
    window.addEventListener('pagehide', restore, { once: true })

    async function reveal() {
      // Off-screen eager images (including the footer Banner) must not gate first paint.
      const images = [...document.images].filter(image => {
        const bounds = image.getBoundingClientRect()
        return bounds.width > 0 && bounds.height > 0 && bounds.bottom > 0 && bounds.top < innerHeight
          && bounds.right > 0 && bounds.left < innerWidth
      })
      const ready = Promise.all(images.map(image => new Promise<void>(resolve => {
        const finish = () => {
          clearTimeout(timeout)
          image.removeEventListener('load', decode)
          image.removeEventListener('error', finish)
          signal.removeEventListener('abort', finish)
          resolve()
        }
        // Broken or stalled assets must not keep the document inaccessible.
        const decode = () => { void image.decode().catch(() => {}).then(finish) }
        const timeout = setTimeout(finish, 12000)
        signal.addEventListener('abort', finish, { once: true })
        image.addEventListener('load', decode, { once: true })
        image.addEventListener('error', finish, { once: true })
        if (image.complete) decode()
      })))
      let assetsReady = false
      void ready.then(() => { assetsReady = true })
      // Hold before glyphs begin to form the mark, not after the mark is complete.
      animation = animate(0, 0.18, {
        duration: reducedMotion ? 0 : 1.8, ease: 'linear', onUpdate: setProgress,
        onComplete: () => { if (!signal.aborted && !assetsReady) setWaiting(true) },
      })
      await Promise.all([ready, animation])
      if (signal.aborted) return
      setWaiting(false)
      animation = animate(0.18, 0.20, {
        duration: reducedMotion ? 0 : 1.6, ease: 'linear', onUpdate: setProgress,
      })
      await animation
      if (signal.aborted) return
      animation = animate(0.20, 0.67, {
        duration: reducedMotion ? 0 : 1.2, ease: 'linear', onUpdate: setProgress,
      })
      await animation
      if (signal.aborted) return
      setLeaving(true)
      root.dataset.arrival = 'revealing'
      animation = animate(0.67, 1, {
        duration: reducedMotion ? 0.22 : 1.2, ease: 'linear', onUpdate: setProgress,
      })
      await animation
      if (signal.aborted) return
      try { sessionStorage.setItem('loom-site-arrival-seen', '1') } catch { /* Storage may be disabled; route handoff still skips the intro. */ }
      restore()
    }
    void reveal()
    return () => {
      window.removeEventListener('pagehide', restore)
      restore()
    }
  }, [])

  return <div className="page-arrival__scene" data-waiting={waiting || undefined} data-leaving={leaving || undefined}>
    <TextLogoTransition locale={locale} progress={progress} reducedMotion={reduced} waiting={waiting}>{null}</TextLogoTransition>
  </div>
}
