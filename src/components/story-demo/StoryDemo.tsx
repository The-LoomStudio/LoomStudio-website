import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Menu, PanelRight, Check, ChevronDown, LoaderCircle } from 'lucide-react'
import './story-demo.css'
import { ChatComposer } from '../studio-demo/snapshot/widgets/chat-composer/chat-composer.js'
import { createTranslator } from '../studio-demo/snapshot/shared/i18n/index.js'

const intro = '潮水退到第三道石阶时，灯塔终于亮了。\n\n伊芙站在雾港尽头，看见一封信从没有月亮的海面上漂来。她没有立刻拆开，因为信封上的日期，是三天之后。远处的钟声敲了十三下，整座城市像在等待某个尚未发生的决定。\n\n她把手伸向信封，海雾里忽然传来另一个自己的声音：「不要让守灯人看见你的影子。」'
const choices = ['拆开信', '观察灯塔', '等到天亮'] as const
const replies: Record<string, string> = {
  拆开信: '信纸是湿的，字迹却没有晕开。最后一行写着：如果你已经读到这里，说明第一条世界线已经失效。\n\n伊芙抬起头。海面的最后一抹夕光正在消退，信封内侧浮出一幅银色海图。原本空白的灯塔下方，多了一个缓缓跳动的标记。\n\n「你终于来了。」守灯人的声音从背后响起。这一次，她没有回头。',
  观察灯塔: '灯塔的光扫过海面，照出一条向陆地倒流的潮汐。每一次闪烁，地图上都会多出一条不存在的路。\n\n夜色渐深。伊芙数到第七次闪烁时，塔顶的窗户打开了。一只手将提灯伸出窗外，灯光在浓雾里勾出三个字：不要来。\n\n可海水已经分开。一道向下的石阶，正从她脚边延伸到灯塔深处。',
  等到天亮: '伊芙在防波堤上坐了一夜。直到东方泛起第一线微光，那封信才终于停止发冷。\n\n晨光穿过雾港，海面由墨蓝转成淡金。夜里无处可寻的渡船，此刻安静地停在第三道石阶旁。船夫摘下帽子，露出一张和守灯人一模一样的脸。\n\n「白天走水路，晚上走影子。」他说，「你选对了时间。」',
}
type Message = { id: string; role: 'user' | 'assistant'; text: string; streaming?: boolean }
type AgentEntry = { id: string; kind: 'user' | 'assistant' | 'tool'; text: string; complete?: boolean }
type Job = { id: number; text: string; type: 'intro' | 'choice' | 'manual' }
const t = createTranslator('zh-CN')

export default function StoryDemo() {
  const [messages, setMessages] = useState<Message[]>([])
  const [agentEntries, setAgentEntries] = useState<AgentEntry[]>([])
  const [input, setInput] = useState('')
  const [agentOpen, setAgentOpen] = useState(false)
  const [busy, setBusy] = useState(true)
  const [job, setJob] = useState<Job>({ id: 0, text: intro, type: 'intro' })
  const [choiceIndex, setChoiceIndex] = useState(0)
  const initialMinutes = (() => {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes()
  })()
  const [minutes, setMinutes] = useState(initialMinutes)
  const rootRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLElement>(null)
  const agentRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const busyRef = useRef(true)
  const nextId = useRef(1)
  const timeRef = useRef(initialMinutes)

  useEffect(() => {
    let cancelled = false
    let timer = 0
    const pause = (ms: number) => new Promise<void>(resolve => { timer = window.setTimeout(resolve, ms) })
    const stream = async (value: string, update: (text: string) => void, step = 2) => {
      for (let length = step; length < value.length; length += step) {
        if (cancelled) return
        update(value.slice(0, length))
        await pause(30)
      }
      if (!cancelled) update(value)
    }
    const appendNarrative = async (id: string, value: string) => {
      setMessages(items => [...items, { id, role: 'assistant', text: '', streaming: true }])
      await stream(value, text => setMessages(items => items.map(item => item.id === id ? { ...item, text } : item)))
      if (!cancelled) setMessages(items => items.map(item => item.id === id ? { ...item, streaming: false } : item))
    }
    const run = async () => {
      if (job.type === 'intro') {
        // StrictMode/HMR may restart this effect; the introductory message has one owner.
        setMessages([])
        await appendNarrative('intro', intro)
      } else {
        if (job.type === 'choice') {
          await stream(job.text, setInput, 1)
          await pause(300)
        }
        if (cancelled) return
        const id = String(job.id)
        setInput('')
        setMessages(items => [...items, { id: `${id}-user`, role: 'user', text: job.text }])
        setAgentEntries(items => [...items, { id: `${id}-user`, kind: 'user', text: job.text }])
        // Each showcase choice points to a distinct story moment; only free-form
        // actions use a small relative advance.
        const nextTime = /等到天亮|天亮|清晨|黎明|早晨/.test(job.text) ? 6 * 60 + 30
          : /观察灯塔/.test(job.text) ? 23 * 60
          : /拆开信/.test(job.text) ? 20 * 60 + 30
          : /中午|正午/.test(job.text) ? 12 * 60
          : /午夜|深夜/.test(job.text) ? 23 * 60
          : /黄昏|傍晚/.test(job.text) ? 18 * 60 + 30
          : (timeRef.current + (job.text.includes('灯塔') ? 120 : 60)) % 1440
        timeRef.current = nextTime
        setMinutes(nextTime)

        const thoughtId = `${id}-thought`
        setAgentEntries(items => [...items, { id: thoughtId, kind: 'assistant', text: '' }])
        await stream(`收到「${job.text}」。我会沿着当前世界线推演，让时间、线索和人物反应一起变化。`, text =>
          setAgentEntries(items => items.map(item => item.id === thoughtId ? { ...item, text } : item)))
        if (cancelled) return
        for (const [index, label] of ['读取世界状态', '更新场景与时间'].entries()) {
          const toolId = `${id}-tool-${index}`
          setAgentEntries(items => [...items, { id: toolId, kind: 'tool', text: label, complete: false }])
          await pause(500)
          if (cancelled) return
          setAgentEntries(items => items.map(item => item.id === toolId ? { ...item, complete: true } : item))
        }
        const writeId = `${id}-write`
        setAgentEntries(items => [...items, { id: writeId, kind: 'tool', text: '写入剧情正文', complete: false }])
        // The floating panel can be closed while this continues; it never owns the timeline.
        const response = replies[job.text] ?? `伊芙决定${job.text.replace(/[。！!？?]$/, '')}。\n\n潮声忽然变得遥远。她的行动打破了雾港长久的沉默，一盏藏在石阶下的灯亮了起来。信纸上的字迹开始移动，像是在回应这个尚未被写下的选择。\n\n「接下来呢？」海雾中的声音轻轻问。伊芙握紧手中的信，向前走了一步。`
        await appendNarrative(`${id}-reply`, response)
        if (cancelled) return
        setAgentEntries(items => items.map(item => item.id === writeId ? { ...item, complete: true } : item))
        const resultId = `${id}-result`
        setAgentEntries(items => [...items, { id: resultId, kind: 'assistant', text: '' }])
        await stream('新的剧情已追加到正文，世界时间已同步。你可以继续下一步行动。', text =>
          setAgentEntries(items => items.map(item => item.id === resultId ? { ...item, text } : item)))
      }
      if (!cancelled) {
        busyRef.current = false
        setBusy(false)
        if (job.type === 'choice') setChoiceIndex(index => Math.min(index + 1, choices.length - 1))
      }
    }
    void run()
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [job])

  useEffect(() => {
    const root = rootRef.current!
    const publish = (visible: boolean) => window.dispatchEvent(new CustomEvent('loom:story-time', {
      detail: { minutes: visible ? minutes : null },
    }))
    const observer = new IntersectionObserver(([entry]) => publish(entry.isIntersecting), { threshold: 0 })
    observer.observe(root)
    return () => { observer.disconnect(); publish(false) }
  }, [minutes])

  useEffect(() => {
    const pane = textRef.current!
    pane.scrollTop = pane.scrollHeight
  }, [messages])
  useEffect(() => {
    const pane = agentRef.current
    if (pane) pane.scrollTop = pane.scrollHeight
  }, [agentEntries, agentOpen])

  function start(value: string, type: 'choice' | 'manual') {
    if (busyRef.current || !value.trim()) return
    busyRef.current = true
    setBusy(true)
    setJob({ id: nextId.current++, text: value.trim(), type })
  }
  function submit(event: FormEvent) { event.preventDefault(); start(input, 'manual') }
  function closeAgent() { setAgentOpen(false); toggleRef.current?.focus() }
  const clock = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

  return <section ref={rootRef} className="story-flow" aria-label="Loom Studio 剧情游玩模拟"
    onKeyDown={event => { if (event.key === 'Escape' && agentOpen) { event.stopPropagation(); closeAgent() } }}>
    <header className="story-native-header">
      <span className="story-native-menu" aria-hidden="true"><Menu /></span>
      <span className="story-native-character"><img src="/brand/loom-logo.png" alt="" /><b>雾港传</b><ChevronDown aria-hidden="true" /></span>
      <span className="story-native-time" aria-label={`故事时间 ${clock}`}>{clock}</span>
      <button ref={toggleRef} className="story-native-agent-toggle" type="button" aria-expanded={agentOpen}
        aria-controls="story-agent" aria-label={agentOpen ? '关闭 Agent 面板' : '打开 Agent 面板'} onClick={() => setAgentOpen(open => !open)}>
        <PanelRight aria-hidden="true" />{busy && !agentOpen ? <i className="story-agent-notice" aria-label="Agent 正在工作" /> : null}
      </button>
    </header>
    <div className="story-flow__body">
      <div className="story-flow__main">
        <article ref={textRef} className="story-flow__text" aria-label="剧情时间轴" aria-busy={busy}>
          <div className="story-flow__reading">
            <div className="story-flow__chapter">CHAPTER 01 · THE LIGHTHOUSE</div>
            {messages.map(message => <div key={message.id} data-message-role={message.role} className={`story-flow__message story-flow__message--${message.role}`}>
              {message.text.split('\n\n').map((line, index, lines) => <p key={index}>{line}
                {message.streaming && index === lines.length - 1 ? <span className="cursor" aria-hidden="true">▋</span> : null}
              </p>)}
            </div>)}
          </div>
        </article>
        <div className="story-flow__input">
          <div className="story-flow__choices" data-hidden={busy || undefined}>
            <button disabled={busy} type="button" onClick={() => start(choices[choiceIndex], 'choice')}>
              {choices[choiceIndex]} ↗
            </button>
          </div>
          <ChatComposer canPreviewPrompt={false} canSend={!busy && Boolean(input.trim())} input={input}
            moreLabel={t('composer.more')} placeholder="输入你的行动…" previewLabel={t('composer.preview')}
            retryLabel={t('composer.retry')} sendLabel="发送行动" textareaDisabled={busy} textareaLabel="角色行动输入区"
            onChangeInput={setInput} onPreviewPrompt={() => {}} onSubmit={submit} />
        </div>
      </div>
      {agentOpen && <aside id="story-agent" className="story-flow__agent" aria-label="Agent 会话浮层">
        <header><span>TOOLS</span><span>{busy ? '执行中' : '已同步'}</span></header>
        <div ref={agentRef} className="story-flow__agent-content">
          {agentEntries.filter(entry => entry.kind === 'tool').length === 0 ? <p>选择一个行动，查看工具执行过程。</p> : agentEntries.filter(entry => entry.kind === 'tool').map(entry =>
            <div key={entry.id} data-agent-kind={entry.kind} className={`story-flow__agent-entry story-flow__agent-entry--${entry.kind}`}>
              {entry.kind === 'tool' ? <>{entry.complete ? <Check aria-hidden="true" /> : <LoaderCircle className="story-flow__spinner" aria-hidden="true" />}<span>{entry.text} · {entry.complete ? '完成' : '执行中'}</span></> : entry.text}
            </div>)}
        </div>
      </aside>}
    </div>
  </section>
}
