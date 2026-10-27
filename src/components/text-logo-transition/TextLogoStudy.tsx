import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion'
import { useReducedMotion } from 'motion/react'
import LogoTransition from '../logo-transition/LogoTransition'
import TextLogoTransition from './TextLogoTransition'
import type { DisplayImage } from '../../lib/site-images'
import '../logo-transition/logo-transition.css'

export default function TextLogoStudy({ image }: { image: DisplayImage }) {
  const reduced = useReducedMotion()
  const [variant, setVariant] = useState<'text' | 'outline'>('text')
  const [progress, setProgress] = useState(0.16)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const animation = useRef<ReturnType<typeof animate> | null>(null)
  useEffect(() => () => animation.current?.stop(), [])
  function seek(value: number) { animation.current?.stop(); setPlaying(false); setProgress(value) }
  function play(from: number) {
    animation.current?.stop(); setPlaying(true); setProgress(from)
    animation.current = animate(from, 1, {
      duration: (reduced ? 0.6 : variant === 'text' ? 8 : 5.8) * (1 - from), ease: 'linear',
      onUpdate: setProgress, onComplete: () => setPlaying(false),
    })
  }
  const Transition = variant === 'text' ? TextLogoTransition : LogoTransition
  const phase = variant === 'outline' ? '对照 · 原描边方案' : progress < .2 ? '01 · 多语故事文本' : progress < .55 ? '02 · 文本汇聚为 文字 标志' : progress < .70 ? '03 · 字符融入 SVG' : '04 · 从圆心进入故事'
  return <main className="logo-study">
    <header className="logo-study__heading"><div><p className="logo-study__eyebrow">LOOM STUDIO · MOTION STUDY 02</p><h1>故事，从一句话开始。</h1><p>对白汇聚成字符，字符构成标志，标志打开世界。</p></div><a href="/dev/preview/logo-transition">SVG 轮廓对照 ↗</a></header>
    <div className="text-logo-study__choices" role="group" aria-label="转场方案">
      <button aria-pressed={variant === 'text'} onClick={() => { seek(.16); setVariant('text') }}>A · 对白 → 文字 → SVG</button>
      <button aria-pressed={variant === 'outline'} onClick={() => { seek(.44); setVariant('outline') }}>B · 轮廓描绘 → SVG</button>
    </div>
    <Transition progress={progress} reducedMotion={!!reduced}>
      <img className="logo-study__scene" src={image.src} srcSet={image.srcSet} sizes="(max-width: 1200px) 100vw, 1200px" alt="等待进入的故事画面"
        onLoad={() => { setReady(true); setFailed(false) }} onError={() => { setReady(false); setFailed(true) }} />
      <div className="logo-study__scene-copy"><span>LOOM STUDIO</span><h2>一个角色，<br />一段未完的故事。</h2><p>编织世界，交织故事。</p></div>
    </Transition>
    <div className="logo-study__controls">
      <button disabled={!ready} onClick={() => playing ? seek(progress) : play(progress >= 1 ? 0 : progress)}>{playing ? '暂停' : '继续播放'}</button>
      <button disabled={!ready} onClick={() => play(0)}>从头播放</button>
      <label className="logo-study__timeline">进度<input type="range" min="0" max="1" step=".001" value={progress} onChange={e => seek(Number(e.target.value))} /></label><output>{Math.round(progress * 100)}%</output>
    </div>
    <div className="logo-study__status"><span>{phase}</span><span>{failed ? '后景加载失败，请刷新重试。' : !ready ? '正在加载后景…' : reduced ? '系统减少动态效果已开启，使用淡出。' : variant === 'text' ? '实验时长 8 秒 · 供观察与对比' : '原方案 5.8 秒'}</span></div>
    {variant === 'text' && <div className="text-logo-study__steps" aria-label="跳到动画阶段">
      <button onClick={() => seek(.16)}><strong>01 / 对白</strong><span>中文、日文与英文的角色对白和叙事。</span></button>
      <button onClick={() => seek(.52)}><strong>02 / 字符标志</strong><span>沿原始 SVG 灰色区域排列，保留环间留白。</span></button>
      <button onClick={() => seek(.67)}><strong>03 / SVG</strong><span>字符淡出，灰色实体在同一位置显现。</span></button>
      <button onClick={() => seek(.86)}><strong>04 / 揭幕</strong><span>沿用同心圆镂空，放大穿入真实画面。</span></button>
    </div>}
    <p className="logo-study__note">这些对白是固定的演示文本，不是实际模型输出。本页独立比较设计方向，正式首次加载使用文字方案，Menu 打开使用描边方案，关闭使用拉帘。</p>
  </main>
}
