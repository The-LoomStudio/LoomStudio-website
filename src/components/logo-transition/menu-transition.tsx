import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { animate } from 'motion'
import LogoTransition from './LogoTransition'
import './menu-transition.css'

function MenuReveal({ dialog, finish }: { dialog: HTMLDialogElement; finish: () => void }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const animation = animate(0, 1, {
      duration: 1.2, ease: 'linear',
      onUpdate: value => {
        setProgress(value)
        if (value > .44) dialog.dataset.revealing = ''
      },
      onComplete: finish,
    })
    return () => animation.stop()
  }, [dialog, finish])
  return <LogoTransition progress={progress}>{null}</LogoTransition>
}

/** A separate top-layer dialog can reveal either the menu or the page beneath it. */
export function setupMenuTransition(dialog: HTMLDialogElement) {
  const root = createRoot(dialog.querySelector<HTMLElement>('[data-menu-transition-mount]')!)
  let active = false
  let sequence = 0
  let destination: HTMLElement | null = null
  const finish = () => {
    if (!active) return
    active = false
    root.render(null)
    dialog.close()
    delete dialog.dataset.revealing
    destination?.focus({ preventScroll: true })
  }
  dialog.addEventListener('cancel', event => { event.preventDefault(); finish() })
  window.addEventListener('pagehide', finish)
  return (changeScene: () => void, focusTarget: HTMLElement) => {
    if (active) return
    changeScene()
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      focusTarget.focus({ preventScroll: true })
      return
    }
    active = true
    destination = focusTarget
    // Change the underlying scene and enter the top layer in the same task, before paint.
    dialog.showModal()
    root.render(<MenuReveal key={++sequence} dialog={dialog} finish={finish} />)
  }
}
