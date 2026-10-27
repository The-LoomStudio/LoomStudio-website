import { animate, hover, inView, press, scroll, type AnimationPlaybackControls } from 'motion'

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
let teardown: (() => void) | undefined

function setup() {
  teardown?.()
  const cleanups: (() => void)[] = []
  const reveals = new Map<HTMLElement, AnimationPlaybackControls>()
  const gestures = new Map<HTMLElement, AnimationPlaybackControls>()
  const events = new AbortController()
  const progress = document.querySelector<HTMLElement>('[data-reading-progress]')
  if (progress) {
    const animation = animate(progress, { scaleX: [0, 1] }, { ease: 'linear', autoplay: false })
    const stop = scroll(animation)
    cleanups.push(() => { stop(); animation.cancel() })
  }

  if (!reducedMotion.matches) {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-motion-reveal]'))
    elements.forEach(element => cleanups.push(inView(element, () => {
      const group = element.closest('[data-motion-group]')
      const siblings = group ? Array.from(group.querySelectorAll('[data-motion-reveal]')) : []
      const index = Math.max(0, siblings.indexOf(element))
      reveals.set(element, animate(element, { opacity: [0, 1], translate: ['0 28px', '0 0'] }, {
        duration: 0.7, delay: Math.min(index, 4) * 0.07, ease: [0.16, 1, 0.3, 1],
      }))
    }, { margin: '0px 0px -36px 0px' })))

    document.querySelectorAll<HTMLElement>('[data-motion-feedback]').forEach(element => {
      let hovered = false
      let focused = false
      let pressed = false
      const paint = () => {
        gestures.get(element)?.stop()
        gestures.set(element, animate(element, {
          y: pressed ? 0 : hovered || focused ? -5 : 0,
          scale: pressed ? 0.975 : 1,
        }, { type: 'spring', stiffness: 380, damping: 28 }))
      }
      cleanups.push(hover(element, () => {
        hovered = true; paint()
        return () => { hovered = false; paint() }
      }))
      element.addEventListener('focusin', () => { focused = true; paint() }, { signal: events.signal })
      element.addEventListener('focusout', event => {
        if (!(event.relatedTarget instanceof Node) || !element.contains(event.relatedTarget)) { focused = false; paint() }
      }, { signal: events.signal })
      if (element.matches('a, button')) cleanups.push(press(element, () => {
        pressed = true; paint()
        return () => { pressed = false; paint() }
      }))
    })
    document.querySelectorAll<HTMLElement>('[data-motion-drift]').forEach(element => {
      const animation = animate(element, { translate: ['0 24px', '0 -24px'] }, { ease: 'linear', autoplay: false })
      const stop = scroll(animation, { target: element, offset: ['start end', 'end start'] })
      cleanups.push(() => { stop(); animation.cancel(); element.style.removeProperty('translate') })
    })
  }
  teardown = () => {
    events.abort()
    cleanups.forEach(cleanup => cleanup())
    reveals.forEach((animation, element) => {
      animation.stop(); element.style.removeProperty('opacity'); element.style.removeProperty('translate')
    })
    gestures.forEach((animation, element) => { animation.stop(); element.style.removeProperty('transform') })
  }
}
setup()
reducedMotion.addEventListener('change', setup)
window.addEventListener('pagehide', () => teardown?.())
window.addEventListener('pageshow', event => { if (event.persisted) setup() })
