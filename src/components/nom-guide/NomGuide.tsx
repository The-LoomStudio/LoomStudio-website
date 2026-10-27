import { useEffect, useState } from 'react'
import { AnimatePresence, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { Minus, X } from 'lucide-react'
import SiteMotion from '../motion/SiteMotion'
import type { DisplayImage } from '../../lib/site-images'
import './nom-guide.css'

export const nomExpressions = ['smile', 'proud', 'thinking', 'wink', 'giggle', 'surprised'] as const
export type NomExpression = (typeof nomExpressions)[number]
export type NomSpeech = { expression: NomExpression; title: string; text: string }
export type NomGuideSection = NomSpeech & { targetId: string }
export type NomGuideCopy = { label: string; expand: string; minimize: string; close: string; greet: string; minimized: string }
type Props = {
  /** 按页面顺序排列；targetId 指向已挂载的章节。 */
  sections: NomGuideSection[]
  expressions: Record<NomExpression, DisplayImage>
  reactions: NomSpeech[]
  copy: NomGuideCopy
}

export default function NomGuide(props: Props) {
  return <SiteMotion><Guide {...props} /></SiteMotion>
}

function Guide({ sections, expressions, reactions, copy }: Props) {
  const reducedMotion = useReducedMotion()
  const [current, setCurrent] = useState<{ index: number; reaction: number | null } | null>(null)
  const [minimized, setMinimized] = useState(false)
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (closed) return
    // 以视口中上方的阅读区域切换章节；离开区域时保留上一段介绍。
    const targets = sections.map(item => document.getElementById(item.targetId)!)
    const visible = new Set<Element>()
    const updateSection: IntersectionObserverCallback = entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      const current = targets.find(target => visible.has(target))
      if (current) {
        const index = targets.indexOf(current)
        setCurrent(previous => previous?.index === index ? previous : { index, reaction: null })
      }
    }
    const observe = () => {
      // rootMargin 的百分比按宽度计算；阅读区按实际视口高度定位。
      const observer = new IntersectionObserver(updateSection, { rootMargin: `-${window.innerHeight * 0.28}px 0px -${window.innerHeight * 0.55}px 0px` })
      targets.forEach(target => observer.observe(target))
      return observer
    }
    let observer = observe()
    const resize = () => {
      observer.disconnect()
      visible.clear()
      observer = observe()
    }
    window.addEventListener('resize', resize)
    return () => { observer.disconnect(); window.removeEventListener('resize', resize) }
  }, [sections, closed])

  if (closed || !current) return null
  const section = sections[current.index]
  const speech = current.reaction === null ? section : reactions[current.reaction]
  function reactToTouch() {
    setCurrent({ index: current!.index, reaction: ((current!.reaction ?? -1) + 1) % reactions.length })
  }

  return <aside className="nom-guide" aria-label={copy.label} data-pagefind-ignore>
    <AnimatePresence mode="wait" initial={false}>
      {minimized ? <m.div key="minimized" className="nom-guide__mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.12 }}>
        <button className="nom-guide__expand" type="button" onClick={() => setMinimized(false)} aria-label={copy.expand} aria-expanded="false">
          <img src={expressions.smile.src} width="36" height="36" alt="" /><span>{copy.minimized}</span>
        </button>
        <button className="nom-guide__icon" type="button" onClick={() => setClosed(true)} aria-label={copy.close}><X size={15} /></button>
      </m.div> : <m.div key="expanded" className="nom-guide__scene" initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }}>
        <m.button className="nom-guide__portrait" type="button" onClick={reactToTouch} disabled={!reactions.length} aria-label={copy.greet}
          whileHover={reducedMotion ? undefined : { rotate: -3, y: -3 }} whileTap={reducedMotion ? undefined : { scale: 0.96 }}>
          {nomExpressions.map(expression => {
            const image = expressions[expression]
            return <m.img key={expression} src={image.src} srcSet={image.srcSet} sizes="(max-width: 640px) 80px, 136px" width={image.width} height={image.height} alt="" draggable={false}
              initial={false} animate={{ opacity: speech.expression === expression ? 1 : 0, y: speech.expression === expression || reducedMotion ? 0 : 5 }} transition={{ duration: reducedMotion ? 0 : 0.18 }} />
          })}
        </m.button>
        <div className="nom-guide__bubble">
          <div className="nom-guide__controls">
            <button className="nom-guide__icon" type="button" onClick={() => setMinimized(true)} aria-label={copy.minimize} aria-expanded="true"><Minus size={16} /></button>
            <button className="nom-guide__icon" type="button" onClick={() => setClosed(true)} aria-label={copy.close}><X size={16} /></button>
          </div>
          <div className="nom-guide__speech" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <m.div key={`${section.targetId}-${speech.title}`} initial={{ opacity: 0, y: reducedMotion ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.12 }}>
                <h2>{speech.title}</h2><p>{speech.text}</p>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </m.div>}
    </AnimatePresence>
  </aside>
}
