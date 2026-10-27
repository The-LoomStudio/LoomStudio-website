import { useEffect, useRef, type ReactNode } from 'react'
import { animate, type AnimationPlaybackControls } from 'motion'
import { useReducedMotion } from 'motion/react'
import './banner-artwork.css'

/** 首屏与预览共用的轻微呼吸；分层插画继续由自身处理视差。 */
export function BannerArtwork({ children, breathe, playing }: { children: ReactNode; breathe: boolean; playing: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const animation = useRef<AnimationPlaybackControls | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!breathe || reducedMotion) return
    const element = root.current!
    const controls = animate(element, { scale: [1, 1.025] }, {
      duration: 9, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut',
    })
    controls.pause()
    animation.current = controls
    return () => {
      controls.stop()
      animation.current = null
      element.style.removeProperty('transform')
    }
  }, [breathe, reducedMotion])

  useEffect(() => {
    if (playing) animation.current?.play()
    else animation.current?.pause()
  }, [playing, breathe, reducedMotion])

  return <div ref={root} className="banner-artwork">{children}</div>
}

export function BannerIntro() {
  return <div className="banner-intro">
    <h1 className="banner-wordmark" aria-label="Loom Studio"><span>LOOM</span><span>STUDIO</span></h1>
    <div className="banner-copy">
    <p className="eyebrow">编织世界，交织故事。</p>
    <h2><span>一个角色</span><span>一段未完的故事</span></h2>
    <p>Loom Studio 是本地运行的 AI 角色扮演与互动叙事工作台。角色、世界设定、故事分支，都在这里接着写。</p>
    </div>
  </div>
}
