import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion'
import { useReducedMotion } from 'motion/react'
import LoomMark from './LoomMark'
import LogoTransition from './LogoTransition'
import type { DisplayImage } from '../../lib/site-images'
import './logo-transition.css'

export default function LogoTransitionStudy({ image }: { image: DisplayImage }) {
  const reducedMotion = useReducedMotion()
  const animation = useRef<ReturnType<typeof animate> | null>(null)
  const [progress, setProgress] = useState(0.44)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [overlay, setOverlay] = useState(false)
  const [opacity, setOpacity] = useState(0.5)
  useEffect(() => () => animation.current?.stop(), [])

  function stop() {
    animation.current?.stop()
    setPlaying(false)
  }
  function play(from = 0) {
    animation.current?.stop()
    setProgress(from)
    setPlaying(true)
    animation.current = animate(from, 1, {
      duration: (reducedMotion ? 0.6 : 5.8) * (1 - from), ease: 'linear',
      onUpdate: setProgress, onComplete: () => setPlaying(false),
    })
  }
  const phase = progress < 0.43 ? '01 · 描绘与填色' : progress < 0.58 ? '02 · 圆环透出' : progress < 1 ? '03 · 穿过圆心' : '04 · 后景完整呈现'

  return <main className="logo-study">
    <header className="logo-study__heading"><div><p className="logo-study__eyebrow">LOOM STUDIO · MOTION STUDY 01</p><h1>从标志中，进入故事。</h1><p>保留灰色轮廓，让圆环之间的留白成为通往下一幕的窗口。</p></div><a href="#comparison">检查 SVG 轮廓 ↓</a></header>
    <section aria-label="标志转场预览">
      <LogoTransition progress={progress} reducedMotion={!!reducedMotion}>
        <img className="logo-study__scene" src={image.src} srcSet={image.srcSet} sizes="(max-width: 1200px) 100vw, 1200px" alt="诺姆的故事插画"
          onLoad={() => setReady(true)} onError={() => { setReady(false); setFailed(true) }} />
        <div className="logo-study__scene-copy"><span>LOOM STUDIO</span><h2>一个角色，<br />一段未完的故事。</h2><p>编织世界，交织故事。</p></div>
      </LogoTransition>
      <div className="logo-study__controls">
        <button disabled={!ready} onClick={() => playing ? stop() : play(progress >= 1 ? 0 : progress)}>{playing ? '暂停' : '继续播放'}</button>
        <button disabled={!ready} onClick={() => play()}>从头播放</button>
        <label className="logo-study__timeline">转场进度<input type="range" min="0" max="1" step="0.001" value={progress}
          onChange={event => { stop(); setProgress(Number(event.target.value)) }} /></label>
        <output>{Math.round(progress * 100)}%</output>
      </div>
      <div className="logo-study__status"><span>{phase}</span><span>{failed ? '后景加载失败，请刷新后重试。' : !ready ? '正在加载后景…' : reducedMotion ? '遵循系统减少动态效果：使用淡出。' : '5.8 秒 · 可拖动进度逐帧检查'}</span></div>
    </section>
    <section id="comparison" className="logo-study__comparison" aria-labelledby="comparison-title">
      <div className="logo-study__section-heading"><div><p className="logo-study__eyebrow">VECTOR RECONSTRUCTION</p><h2 id="comparison-title">同一个轮廓，透明的留白。</h2></div><a href="/brand/loom-mark.svg" download>下载 SVG ↗</a></div>
      <div className="logo-study__compare-grid">
        <figure><div className="logo-study__asset"><img src="/brand/loom-logo.png" alt="原始 PNG，含白色贴纸底" /></div><figcaption><strong>原始 PNG</strong><span>灰色主体 + 白色贴纸</span></figcaption></figure>
        <figure><div className="logo-study__asset logo-study__asset--transparent">
          {overlay && <img className="logo-study__reference" src="/brand/loom-logo.png" alt="用于叠合对照的原图" />}
          <div className="logo-study__vector" style={{ opacity: overlay ? opacity : 1 }}><LoomMark /></div>
        </div><figcaption><strong>重建 SVG</strong><span>3 个轮廓 · 原图灰阶 · 真实透明孔隙</span></figcaption></figure>
      </div>
      <div className="logo-study__controls"><label><input type="checkbox" checked={overlay} onChange={event => setOverlay(event.target.checked)} /> 叠合原图检查</label>
        {overlay && <label className="logo-study__timeline">SVG 不透明度<input type="range" min="0" max="1" step="0.01" value={opacity} onChange={event => setOpacity(Number(event.target.value))} /></label>}
      </div>
      <p className="logo-study__note">轮廓由原始 PNG 提取，保留原本略不规则的曲线；填色使用灰色渐变，省去贴纸白边与栅格纹理。当前是独立实验，尚未接入正式页面转场。</p>
    </section>
  </main>
}
