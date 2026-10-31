import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { FileText, FolderOpen, Pause, Play, RotateCcw } from 'lucide-react'
import type { DisplayImage } from '../../lib/site-images'
import type { NomExpression } from '../nom-guide/NomGuide'
import './story-workspace.css'

type Operation = { at: number; agent: string; action: '创建' | '读取' | '更新' | '删除'; file: string; text?: string; duration: number }
// A deterministic performance, not real tool calls or a promise of default autonomous coordination.
const operations: Operation[] = [
  { at: 1200, agent: '叙事', action: '创建', file: '伏笔.md', duration: 4300, text: '# 一封来自明天的信\n\n线索：信封上的日期，比今天晚了一天。\n状态：已埋下，尚未揭晓。\n约束：此刻不解释寄信人的身份。' },
  { at: 6200, agent: '策划', action: '更新', file: '伏笔.md', duration: 1600, text: '# 一封来自明天的信\n\n线索：信封上的日期，比今天晚了一天。\n状态：已埋下，尚未揭晓。\n约束：先让钟声出现，寄信人的身份留到重逢时揭晓。' },
  { at: 8000, agent: '策划', action: '创建', file: '章节大纲.md', duration: 3000, text: '# 钟楼来信\n\n第一幕 · 雨停之后，发现信件。\n第二幕 · 沿旧街寻找落款。\n第三幕 · 钟楼重逢，揭晓日期的含义。\n\n让钟声先出现，让答案晚一点到来。' },
  { at: 11500, agent: '记录', action: '创建', file: '人物关系.md', duration: 1800, text: '# 人物关系\n\n诺姆 → 钟表匠：见过他的字迹，尚未认出。\n钟表匠 → 诺姆：守着一个未兑现的约定。' },
  { at: 13700, agent: '策划', action: '创建', file: '场景笔记.md', duration: 1200, text: '# 旧城\n\n雨后的石板路。停在十一点的钟。\n书店距钟楼步行十分钟。\n重复意象：水声、墨迹、钟摆。' },
  { at: 15200, agent: '叙事', action: '更新', file: '人物关系.md', duration: 900, text: '# 人物关系\n\n诺姆 → 钟表匠：认出了他的字迹，却还没说出口。\n钟表匠 → 诺姆：守着一个未兑现的约定。' },
  { at: 16200, agent: '记录', action: '创建', file: '时间顺序.md', duration: 800, text: '# 时间顺序\n\n昨日：钟楼停摆。\n今日：诺姆收到一封信。\n明日：信上约定的见面时间。' },
  { at: 17200, agent: '策划', action: '创建', file: '备选开场.md', duration: 650, text: '# 备选\n\n从钟楼直接开始。\n待与现有开场比较。' },
  { at: 18100, agent: '策划', action: '删除', file: '备选开场.md', duration: 650 },
  { at: 19000, agent: '叙事', action: '更新', file: '章节大纲.md', duration: 900, text: '# 钟楼来信\n\n第一幕 ✓ 雨停之后，发现信件。\n第二幕 ✓ 旧街寻访，认出熟悉的字迹。\n第三幕 → 钟楼重逢。\n\n回收线索：日期不是预言，是迟到的约定。' },
  { at: 20200, agent: '记录', action: '创建', file: 'MEMORY.md', duration: 1200, text: '# 共同工作约定\n\n保持诺姆温和、好奇的语气。\n写下一幕前，回查伏笔与时间顺序。\n未揭晓的身份不提前泄露。\n剧情依据以已发生的正文为准。' },
  { at: 23900, agent: '叙事', action: '读取', file: '伏笔.md', duration: 1600 },
  { at: 26900, agent: '记录', action: '更新', file: '伏笔.md', duration: 2400, text: '# 一封来自明天的信\n\n线索：信封上的日期，比今天晚了一天。\n状态：已在钟楼重逢时回收。\n原来，那是我们约好再见的日子。\n\n保留来处，让下一次重逢有所依凭。' },
]
const end = 32000
const scenes = [
  { at: 0, title: '01 / 埋下一笔', expression: 'surprised', quote: '「奇怪，这封信上的日期……是明天。」', prose: '雨停了。诺姆将信举到灯下，湿润的纸角透出一行熟悉的字迹。' },
  { at: 8000, title: '02 / 故事在幕后生长', expression: 'thinking', quote: '「也许，旧街上有人认得这个落款。」', prose: '她把信收进书里。还没说出口的答案，先留在故事的另一页。' },
  { at: 13700, title: '03 / 一个人物，一整个世界', expression: 'proud', quote: '「走吧。我们还有好多地方没去过。」', prose: '街道、约定、人物与时间逐渐交织。几位助手分工接力，为后面的故事做好准备。' },
  { at: 22400, title: '04 / 接过上一段工作', expression: 'thinking', quote: '「你也听见钟声了吗？」', prose: '接续工作时，先读交接，再回查文件。那些暂时离开视线的细节，仍有来处。' },
  { at: 26900, title: '05 / 让伏笔回到故事', expression: 'smile', quote: '「原来，那是我们约好再见的日子。」', prose: '钟声终于响起。她展开那封信，故事从最初的一行字，走到了这次重逢。' },
] as const

const agentColors: Record<string, string> = { '叙事': '#57b9e8', '策划': '#b69af7', '记录': '#e9b65b' }

function AgentCursor({ agent, quiet = false }: { agent: string; quiet?: boolean }) {
  return <span className="story-workspace__cursor" data-quiet={quiet} style={{ '--agent-color': agentColors[agent] } as CSSProperties} aria-hidden="true">
    <svg viewBox="0 0 24 28" width="20" height="24"><path d="M2 2 21 15 12 17 8 26Z" fill="currentColor" stroke="var(--loom-site-bg)" strokeWidth="2" strokeLinejoin="round" /></svg>
    <span>{agent} Agent</span>
  </span>
}

/** Keep unchanged text in place; select the changed range, remove it, then type its replacement. */
function editFrame(before: string, after: string, progress: number) {
  let start = 0, tail = 0
  while (start < before.length && start < after.length && before[start] === after[start]) start++
  while (tail < before.length - start && tail < after.length - start && before[before.length - 1 - tail] === after[after.length - 1 - tail]) tail++
  const prefix = before.slice(0, start)
  const removed = before.slice(start, before.length - tail)
  const replacement = after.slice(start, after.length - tail)
  const suffix = tail ? before.slice(-tail) : ''
  const selecting = !!removed && progress < .3
  const typed = selecting ? '' : replacement.slice(0, Math.floor(replacement.length * Math.max(0, Math.min(1, (progress - (removed ? .3 : 0)) / (removed ? .7 : 1)))))
  return { prefix, removed: selecting ? removed : '', typed, suffix, selecting, text: prefix + (selecting ? removed : typed) + suffix }
}

export default function StoryWorkspace({ expressions }: { expressions: Record<NomExpression, DisplayImage> }) {
  const root = useRef<HTMLElement>(null)
  const elapsed = useRef(0)
  const [time, setTime] = useState(end)
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    setTime(0)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
    observer.observe(root.current!)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!visible || !playing || reduced) return
    let frame = 0, previous = 0, painted = 0
    const tick = (now: number) => {
      if (previous) elapsed.current = Math.min(end, elapsed.current + now - previous)
      previous = now
      // Text changes need at most 20 updates/sec; no per-character timers or DOM measurement.
      if (now - painted >= 50 || elapsed.current === end) { setTime(elapsed.current); painted = now }
      if (elapsed.current < end) frame = requestAnimationFrame(tick)
      else setPlaying(false)
    }
    const resume = () => {
      cancelAnimationFrame(frame); previous = 0
      if (!document.hidden) frame = requestAnimationFrame(tick)
    }
    resume()
    document.addEventListener('visibilitychange', resume)
    return () => { cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', resume) }
  }, [visible, playing, reduced])

  const t = reduced ? end : time
  const scene = scenes.findLast(item => t >= item.at)!
  const history = operations.filter(item => item.at <= t)
  const active = history.at(-1)
  const files = new Map<string, string>()
  let edit: ReturnType<typeof editFrame> | undefined
  let previousWriter: string | undefined
  for (const item of history) {
    if (item.action === '删除') {
      // Briefly retain the file while the deletion action plays.
      if (t >= item.at + 1500) files.delete(item.file)
    } else if (item.text !== undefined) {
      const fraction = Math.max(0, Math.min(1, (t - item.at - 250) / (item.duration - 250)))
      const frame = editFrame(files.get(item.file) ?? '', item.text, fraction)
      if (item === active) {
        edit = frame
        previousWriter = history.filter(other => other.at < item.at && other.file === item.file && other.text !== undefined).at(-1)?.agent
      }
      files.set(item.file, frame.text)
    }
  }
  const references = new Map<string, string>()
  if (t >= 22400) references.set('工作交接', '# 工作交接\n\n已到达钟楼，信件的日期尚未解释。\n下一步先读「伏笔.md」，衔接重逢场景。\n\n当前会话的接续摘要')
  if (t >= 26900) references.set('剧情记忆', '# 钟楼重逢\n\n诺姆循着信上的落款来到钟楼，终于理解了那个日期。\n那不是预言，而是两人约好再见的日子。\n\n来源：发现信件 → 旧街寻访 → 钟楼重逢\n\n由官方剧情记忆扩展整理正文，可修订、确认后采用。')
  const currentFile = selected && (files.has(selected) || references.has(selected)) ? selected : t >= 22400 && t < 23900 ? '工作交接' : active && files.has(active.file) ? active.file : [...files.keys()].at(-1)
  const working = !selected && active && active.file === currentFile && t < active.at + active.duration
  const writing = working && !!active.text
  const cursorVisible = !reduced && !selected && active && active.file === currentFile && t < active.at + active.duration + 800
  const frame = writing ? edit : undefined
  function seek(value: number, play = false) {
    elapsed.current = value; setTime(value); setSelected(null); setPlaying(play)
  }
  return <section className="story-workspace" id="story-workspace" ref={root} lang="zh-CN" aria-labelledby="workspace-title">
    <header className="story-workspace__heading">
      <h2 id="workspace-title">写下这一句<br />也为下一章做好准备</h2>
      <p>从一条伏笔，到一整个世界。让助手用故事的工作文件，安排、记录，再接着写。</p>
    </header>
    <div className="story-workspace__stage">
      <div className="story-workspace__actor">
        <div className="story-workspace__portrait">
          {(['surprised', 'thinking', 'proud', 'smile'] as const).map(expression => <img key={expression} src={expressions[expression].src} srcSet={expressions[expression].srcSet} sizes="(max-width: 760px) 180px, 300px" width={expressions[expression].width} height={expressions[expression].height} alt="" loading="lazy" data-active={scene.expression === expression} />)}
        </div>
        <div className="story-workspace__dialogue" key={scene.at}>
          <blockquote>{scene.quote}</blockquote><p>{scene.prose}</p>
        </div>
      </div>
      <div className="story-workspace__desk">
        <div className="story-workspace__window">
          <header><FolderOpen size={16} /><span>钟楼来信 / Workspace</span></header>
          <div className="story-workspace__browser">
            <nav aria-label="示例工作文件"><small>故事工作文件</small>
              {!files.size && <p className="story-workspace__empty">第一条线索，即将落笔。</p>}
              {[...files.keys()].map(file => <button key={file} aria-pressed={file === currentFile} onClick={() => { setSelected(file); setPlaying(false) }}><FileText size={14} /><span>{file}</span></button>)}
              {references.size > 0 && <div className="story-workspace__references">{[...references.keys()].map(name => <button key={name} aria-pressed={name === currentFile} onClick={() => { setSelected(name); setPlaying(false) }}><FileText size={14} /><span>{name}</span></button>)}</div>}
            </nav>
            <div className="story-workspace__editor">
              <header><span>{currentFile ?? ''}</span></header>
              <pre key={currentFile} style={{ '--agent-color': active ? agentColors[active.agent] : undefined } as CSSProperties}>{frame ? <>
                {frame.prefix}{previousWriter && previousWriter !== active?.agent && <AgentCursor agent={previousWriter} quiet />}
                {frame.selecting ? <mark className="story-workspace__selection">{frame.removed}</mark> : <span className="story-workspace__insert">{frame.typed}</span>}
                {cursorVisible && <AgentCursor agent={active.agent} />}{frame.suffix}
              </> : <>{currentFile ? files.get(currentFile) ?? references.get(currentFile) : ''}{cursorVisible && <AgentCursor agent={active.agent} />}</>}</pre>

            </div>
          </div>
        </div>

      </div>
    </div>
    <div className="story-workspace__controls">
      <div className="story-workspace__chapters" aria-label="演出阶段">{scenes.map(item => <button key={item.at} disabled={!!reduced} aria-pressed={scene.at === item.at} aria-label={item.title} title={item.title} onClick={() => seek(item.at)}><span className="story-workspace__step" /></button>)}</div>
      <div><button disabled={!!reduced} onClick={() => { setSelected(null); if (time >= end) seek(0, true); else setPlaying(!playing) }}>{playing && time < end ? <Pause size={14} /> : <Play size={14} />}{playing && time < end ? '暂停' : '播放'}</button><button disabled={!!reduced} onClick={() => seek(0, true)}><RotateCcw size={14} />重播</button></div>
    </div>

  </section>
}
