import { Anchor, FileText, FolderOpen, MessageSquare } from 'lucide-react'
import type { ReactNode } from 'react'

const ramp = (p: number, a: number, b: number) => Math.max(0, Math.min(1, (p - a) / (b - a)))

function Grow({ p, at, children }: { p: number; at: number; children: ReactNode }) {
  const reveal = ramp(p, at, at + .025)
  return <div className="preset-assembly__grow" aria-hidden={reveal === 0} style={{ gridTemplateRows: `${reveal}fr`, opacity: reveal }}><div>{children}</div></div>
}
function Text({ p, at, children }: { p: number; at: number; children: string }) {
  return <>{children.slice(0, Math.floor(children.length * ramp(p, at, at + .035)))}</>
}
function Slot({ name, tone }: { name: string; tone?: string }) {
  return <div className="preset-assembly__anchor-label" data-tone={tone}><Anchor size={13} /><code>{name}</code></div>
}

/** Main-story Session retains native message boundaries, including its Narrative projection. */
export default function PresetAssembly({ progress: p }: { progress: number }) {
  return <div className="preset-assembly" aria-label="预设逐行构建与 Lore 条件注入">
    <div className="preset-assembly__sources">
      <h3><FolderOpen size={15} />Lore</h3>
      <div className="preset-assembly__folder"><FolderOpen size={13} />诺姆的世界</div>
      <div className="preset-assembly__source" data-tone="stable"><FileText size={12} /><span>人物设定<small>常驻</small></span></div>
      <div className="preset-assembly__source" data-tone="stable"><FileText size={12} /><span>世界观<small>常驻</small></span></div>
      <div className="preset-assembly__source" data-tone="keyword" data-hit={p >= .29}><FileText size={12} /><span>窗边阅读<small>关键词「书」</small></span></div>
      <div className="preset-assembly__source" data-tone="keyword"><FileText size={12} /><span>雨夜街道<small>关键词「雨」</small></span></div>
      <div className="preset-assembly__user"><MessageSquare size={13} /><span>当前输入</span><p>你在她身旁坐下<br />「正在读什么<span data-hit={p >= .29}>书</span>？」</p></div>
    </div>
    <div className="preset-assembly__tree">
      <h3><FolderOpen size={15} />{p >= .70 ? 'Messages' : '预设'}</h3>
      <Grow p={p} at={0}>
        <section className="preset-assembly__message">
          <h4><MessageSquare size={13} /><Text p={p} at={.01}>system</Text></h4>
          <Grow p={p} at={.045}><div className="preset-assembly__entry"><FileText size={12} /><Text p={p} at={.05}>叙事身份.md</Text><p><Text p={p} at={.08}>扮演诺姆 以她的语气推进故事</Text></p></div></Grow>
          <Grow p={p} at={.12}>
            <Slot name="@lore.stable" tone="stable" />
            <Grow p={p} at={.16}><div className="preset-assembly__group">
              <div className="preset-assembly__folder"><FolderOpen size={13} />诺姆的世界</div>
              <p><Text p={p} at={.19}>人物设定 · 温和好奇 喜欢分享故事</Text></p>
              <Grow p={p} at={.225}><p><Text p={p} at={.23}>世界观 · 临海小城 入夜后的灯火</Text></p></Grow>
            </div></Grow>
          </Grow>
        </section>
      </Grow>
      <Grow p={p} at={.28}>
        <section className="preset-assembly__message">
          <h4><MessageSquare size={13} />system</h4>
          <Slot name="@lore.lower" tone="keyword" />
          <Grow p={p} at={.31}><div className="preset-assembly__group">
            <div className="preset-assembly__folder"><FolderOpen size={13} />诺姆的世界</div>
            <p><Text p={p} at={.33}>窗边阅读 · 膝上的书 一杯热茶</Text></p>
          </div></Grow>
        </section>
      </Grow>
      <Grow p={p} at={.39}>
        <section className="preset-assembly__message">
          <Slot name="@chat.session" />
          <Grow p={p} at={.43}><div className="preset-assembly__history"><span>user</span><p><Text p={p} at={.44}>我推门走进书店</Text></p></div></Grow>
          <Grow p={p} at={.49}><div className="preset-assembly__history"><span>assistant <small>Narrative</small></span><p><Text p={p} at={.51}>诺姆坐在窗边 翻过一页书 向你招手</Text></p></div></Grow>
        </section>
      </Grow>
      <Grow p={p} at={.58}>
        <section className="preset-assembly__message">
          <h4><MessageSquare size={13} /><Text p={p} at={.59}>user</Text></h4>
          <Grow p={p} at={.62}><Slot name="@chat.input" /><p className="preset-assembly__input-text"><Text p={p} at={.65}>你在她身旁坐下「正在读什么书？」</Text></p></Grow>
        </section>
      </Grow>
    </div>
  </div>
}
