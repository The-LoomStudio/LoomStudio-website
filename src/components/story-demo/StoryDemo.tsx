import { useLayoutEffect, useRef, useState } from 'react'
import { Menu, ArrowLeft, ArrowRight, Search, ChevronDown, MessageSquare, PanelRight, Plus, Undo2, Lock, Swords, ArrowUp, Check, Activity } from 'lucide-react'
import type { DisplayImage } from '../../lib/site-images'
import './story-demo.css'
import SummerPostcard from './SummerPostcard'
import type { Weather } from './WeatherBackdrop'

const intro = '诺姆把一本空白的故事册推到你面前。\n\n「欢迎来到 Loom Studio。我是诺姆，今天就由我陪你试一试这里的工作台。」她翻开第一页，在页角画了一颗小星星。\n\n「先写下一个行动吧。故事、画面，还有窗外的天气，都可以从这里慢慢变化。」'
const action = '翻开故事册，和诺姆一起写下第一段。'
const reply = '诺姆拿起笔，认真想了想，又把笔尖停在半空。\n\n「如果不知道从哪里开始，就从现在开始。」\n\n窗边的光落在纸上，你们把刚才的相遇写成了第一段。字句一点点延伸，一页空白渐渐有了温度。\n\n「接下来，试试上面的按钮吧。」她笑着指向工作台。「给故事加一张手记，换一种颜色，或者让窗外下起雨。」'
const slice = (text: string, progress: number, start: number, end: number) => text.slice(0, Math.floor(text.length * Math.max(0, Math.min(1, (progress - start) / (end - start)))))

/** A scroll-scrubbed product illustration. Timeline owns both the work record and the resulting body. */
export default function StoryDemo({ progress, avatar, weather, onWeatherChange }: { progress: number; avatar: DisplayImage; weather: Weather; onWeatherChange: (weather: Weather) => void }) {
  const [feature, setFeature] = useState('story')
  const [theme, setTheme] = useState('site')
  const narrativeProgress = progress
  const reading = useRef<HTMLDivElement>(null)
  const sent = narrativeProgress >= .3
  const writing = narrativeProgress >= .46 && narrativeProgress < .9
  const complete = narrativeProgress >= .9
  const response = slice(reply, narrativeProgress, .46, .9)
  const input = slice(action, narrativeProgress, .08, .28)
  useLayoutEffect(() => {
    const pane = reading.current!
    if (feature === 'story') pane.scrollTop = pane.scrollHeight
    else pane.scrollTop = 0
  }, [response, sent, feature])
  return <section className="story-flow" data-demo-theme={theme} aria-label="随页面滚动推进的 Loom Studio 剧情演示">
    <header className="story-native-header">
      <div className="story-header-leading" aria-hidden="true"><span><Menu /><ArrowLeft /><ArrowRight /></span><span><Search /></span></div>
      <div className="story-native-character"><img data-journey-avatar src={avatar.src} alt="诺姆" /><b>Nom · 故事工作台</b><ChevronDown aria-hidden="true" /></div>
      <div className="story-header-agent"><MessageSquare aria-hidden="true" /><span>Agent Session</span><PanelRight aria-hidden="true" /></div>
    </header>
    <nav className="story-demo-controls" aria-label="体验工作台能力">{[
      ['story', '故事'], ['render', '渲染能力'], ['theme', '换主题'], ['world', '扩展示例'],
    ].map(([id, label]) => <button type="button" key={id} aria-pressed={feature === id} onClick={() => { setFeature(id); if (id === 'world' && weather === 'illustration') onWeatherChange('clear') }}>{label}</button>)}</nav>
    <div className="story-flow__body">
      <article ref={reading} className="story-flow__text" data-feature={feature} aria-label="剧情时间轴：主 Session">
        <div className="story-flow__reading">
          {feature === 'story' && <>
          <p className="story-flow__chapter">CHAPTER 01 · HELLO NOM</p>
          {intro.split('\n\n').map(text => <p key={text}>{text}</p>)}
          {sent && <p className="story-flow__action">{action}</p>}
          {sent && <div className="story-flow__work">
            <span><Check size={14} />{complete ? '本轮工作已完成' : '正在推演下一幕'}</span>
            {!complete && <div className="story-flow__steps"><p>接着你的行动，描写诺姆的回应与故事。</p><p><Check size={12} /> 读取世界状态</p>{narrativeProgress > .4 && <p><Check size={12} /> 更新场景与时间</p>}</div>}
          </div>}
          {response && <div>{response.split('\n\n').map((text, index) => <p key={index}>{text}</p>)}</div>}
          </>}
          {feature === 'render' && <SummerPostcard />}
          {feature === 'theme' && <aside className="story-theme-demo" aria-label="外观切换演示">
            <div><b>外观</b><small>当前故事保持不变</small></div>
            <div className="story-theme-demo__options">{[
              { id: 'site', name: '默认' }, { id: 'paper', name: '纸页' }, { id: 'tide', name: '潮汐' },
            ].map(option => <button type="button" key={option.id} aria-pressed={theme === option.id} onClick={() => setTheme(option.id)} data-swatch={option.id}><i />{option.name}</button>)}</div>
          </aside>}
          {feature === 'world' && <aside className="story-world-demo" aria-label="The World 天气演示">
            <header><b>The World</b><span>天气效果示例</span></header>
            <p>诺姆推开窗：「想看看另一种天气吗？」</p>
            <div className="story-demo-controls">{[['clear', '晴天'], ['sunset', '日落'], ['rain', '下雨'], ['illustration', '恢复插画']].map(([id, label]) => <button type="button" key={id} aria-pressed={weather === id} onClick={() => onWeatherChange(id as Weather)}>{label}</button>)}</div>
            <p>设备内外共用一片风景。天气切换后，仍可回到故事继续阅读。</p>
          </aside>}
        </div>
      </article>
      <div className="story-flow__composer" aria-label="行动输入演示">
        <div className="story-flow__task"><Activity size={14} /><span>当前叙事任务</span><small>{complete ? '已完成' : sent ? writing ? '正在续写' : '正在推演' : '等待你的行动'}</small></div>
        <p className={input && !sent ? '' : 'story-flow__placeholder'}>{sent || !input ? '你会怎么做？' : input}</p>
        <div className="story-flow__toolbar" aria-hidden="true"><Swords /><Plus /><Undo2 /><Lock /><span /><small>预览</small><small>默认 <ChevronDown /></small><i><ArrowUp /></i></div>
      </div>
    </div>
  </section>
}
