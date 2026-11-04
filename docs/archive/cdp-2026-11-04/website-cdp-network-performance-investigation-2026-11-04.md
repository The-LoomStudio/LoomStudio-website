# Website CDP 网络与性能调研

> 已归档（2026-11-04）：本次调查与修复已收束。正文保留各阶段证据，不代表每条旧结论仍成立；最终结果见网络与性能记录末尾，剩余调查线索见[网络与性能归档](website-cdp-network-performance-investigation-2026-11-04.md#收束后保留的调查线索)。

日期：2026-11-04。状态：首批修复已实施并完成本地客观验收，待人工观感确认与部署。前序记录见[内存调研](website-cdp-memory-investigation-2026-11-04.md)。

## 环境与证据边界

在当前源码上执行 `pnpm build`，39 页构建完成、搜索索引生成成功；构建报告 DocsLayout 的无效 CSS 选择器警告。开发服务仍为 `127.0.0.1:4321`。请求启动新 preview 时，Astro 返回已有 `127.0.0.1:4337`、PID 25256；已核对进程命令与 cwd 均属于 Website，该服务提供刚更新的 dist，没有停止或重启它。不是先前口头预期的 4322。

Chrome 独立临时页，生产构建，无 CPU/网络节流。Network 按 requestId 配对 request/response/finished，并检查分页与截断；只汇总 URL、大小、状态等元数据，不读取业务正文、凭据或导出 HAR。浏览器扩展也会注入请求，站点数字单独筛选同源，不把扩展代码归因给网站。

禁用 HTTP 缓存的样本属于受控实验，不等于新浏览器进程的严格冷启动。localhost 耗时不能代表公网、移动端或 Cloudflare 边缘性能；preview 也不证明线上 `_headers` 实际响应。encodedDataLength 包含协议传输开销，资源的 decodedBodySize 是解压后的文件大小，不是图片解码像素或内存。

## 已确认问题与优先级

### P2：故事揭示首次位图生成占用主线程

使用原生 Chrome DevTools Performance 手动录制页面就绪后的快速分段滚动，经过首页多个展区。录制包含约 6.3 秒，DevTools 自动选中的活跃分析范围为 0–2284 ms，该范围摘要为执行脚本 840 ms、系统 229 ms、渲染 94 ms、绘制 79 ms。不同分类与 bottom-up 总耗时存在包含关系，不将它们累加作独立成本。

Bottom-up 自身耗时：

| 活动 | 自身耗时 | 归因 |
| --- | ---: | --- |
| getImageData | 450.9 ms | 展开调用者后 449.2 ms 对应 BranchReveal.BMuaNadg.js:3:791；1.7 ms 对应 PromptComposition onload |
| BranchReveal 匿名函数 | 82.6 ms | BranchReveal.BMuaNadg.js:3:1206，总耗时 164.6 ms |
| fillText | 81.4 ms | 字形绘制，未进一步逐调用者拆分 |
| drawImage | 67.2 ms | 图像绘制，未进一步逐调用者拆分 |
| 分析开销 | 66.4 ms | 诊断工具开销，不能算入产品函数 |

这与源码 `src/components/branch-reveal/BranchReveal.tsx` 的三档采样、逐格 fillText 和三张离屏位图持有相符。支持优先减少重复采样/字形构建及无用缓存持有；不意味着普通每次滚动都会重复花费 449 ms。此次快速跳段会集中触发 hydration，DevTools 停靠也缩小了视口，不能外推自然阅读的逐帧延迟、INP 或其他设备的耗时。getImageData 的 GPU/CPU同步等更深原因尚未隔离，不据此直接指定 willReadFrequently 为已证修复。

### P2：首页离屏演示背景提前加载原始 PNG

禁用缓存、固定 scrollY=0 后刷新，Network 捕获 `/images/nom/banners/nom-banner-013.png` 的 HTTP 200，encodedDataLength 1,689,077 bytes；文件 body 为 1,688,806 bytes。同页 `.character-journey__scene` 顶部距视口约 3941 px，computed backgroundImage 包含该原始 PNG。

所有者：`src/components/card-showcase/character-journey.css:5`。SSR 已输出该背景所属的场景，CSS 背景请求不受 React `client:visible` 的 hydration 门控。`src/pages/index.astro` 同时已有该素材的 siteImage/WebP 处理结果，但这一 CSS 路径绕开了它。

最小方向：复用构建生成的图片 URL，并将离屏场景的背景加载与实际展示范围对齐。不需先裁切或降低素材分辨率。应保留滚动进入时的画面准备和 reduced-motion 路径，修复后验证顶部不再下载此原始 PNG、进入场景仍正常显示。

### P3：浏览器图标直接引用约 791 KB PNG

`src/layouts/BaseLayout.astro:126-128` 同时声明 favicon.ico 和 `/brand/website_logo.png` 的 icon/apple-touch-icon。普通缓存刷新窗口曾捕获 PNG 下载 791,058 bytes；禁用缓存顶部窗口记录同 URL 两次 200，各 791,058 bytes。文件 body 790,789 bytes。

两次下载属于该缓存实验事实，不声称普通访问必定重复两次。可以为浏览器图标提供合适的小尺寸独立输出，保留品牌原始文件及其其他用途。它不涉及降低正文插画画质；关闭条件为实际 favicon 请求体积与显示清晰度，不只检查声明。

### P2：文档目录分组样式因无效选择器被丢弃

`src/layouts/DocsLayout.astro` 已使用 `<style is:global>`，但 468/482-484 行仍写 `.docs-nav__group :global(summary)` 等选择器。生产构建明确警告 `global` 不是有效伪类。

浏览器复核 `CSS.supports('selector(.docs-nav__group :global(summary))') === false`，同源 stylesheet 的 CSSOM 中没有保留下来的该规则。文档三个分组“开始 / 核心概念 / 体系与扩展”的 summary computed minHeight 均为 0px、display 均为 list-item，未获得源码意图的 min-height:34px / display:flex。

最小方向：在已经全局的样式块中使用普通 summary 选择器，核对 marker、hover 与 active 规则。不将此问题扩展为重做目录交互或主观视觉审计。

## Network 基线与有效反证

开发首页一次刷新窗口捕获 161 个请求、无 loadingFailed，但包含开发模块和扩展，不用于直接比较线上收益。生产普通缓存窗口也包含缓存与扩展，不用少量传输字节代表全部 JS 体积。

生产禁用缓存顶部窗口，同源 52 个请求均记录 HTTP 200，无 disk/service-worker cache 标记，无 loadingFailed、无事件截断：

| 类型 | 请求数 | encodedDataLength 合计 |
| --- | ---: | ---: |
| Document | 1 | 32,758 bytes |
| Stylesheet | 2 | 24,552 bytes |
| Script | 31 | 170,856 bytes |
| Image | 16 | 3,031,689 bytes |
| Other | 2 | 1,582,116 bytes |

同源约 4.84 MB 传输窗口中，原始背景 PNG 和图标是直接可识别的大项。外部另有 Google Fonts CSS、11 个字体请求合计 254,072 bytes，以及 GitHub 星数 API；该窗口外部请求均有 200 响应。Google Analytics 未获同意，此轮未批准统计。上述窗口包含取样前首屏轮播所需资源，不是严格定义的 LCP 关键路径总量。

### 搜索按需加载及失败恢复通过

- 查询前资源列表无 `/pagefind/`；打开搜索并输入 `Prompt` 后请求 pagefind.js，返回“全部 · 6 项匹配”。页面侧捕获到 worker 启动请求，但 worker 内部请求不在当前 target 的完整覆盖范围；不宣称搜索总下载仅 13 KB。
- 在新文档中，仅拦截一次首次 pagefind.js 的 Script Request，`Fetch.failRequest(ConnectionReset)` 后立即清空 patterns。UI 显示“搜索暂时无法加载，请重试”和“重新加载搜索”。
- 撤销拦截后点击重试，Network 记录新的 pagefind.js 200，UI 恢复 6 项结果。当前 retry handler 会清除 api Promise；没有以静态推断把它登记为拒绝缓存缺陷。

### The World 离屏暂停通过本轮短窗口

对同一页面 Performance.getMetrics 做有界窗口比较：

| 状态 | Timestamp 窗口 | TaskDuration | RecalcStyleDuration | LayoutCount / RecalcStyleCount |
| --- | ---: | ---: | ---: | ---: |
| Hero 天空运行 | 0.807 s | 354 ms | 125 ms | 0 / 49 |
| 点击暂停后 | 0.777 s | 128 ms | 6 ms | 0 / 47 |
| 恢复运行并滚到中间实底区，稳定后 | 0.827 s | 10 ms | 0 ms | 0 / 0 |

最后一项同时确认两个 `[data-sky-intro]` 的 bounds 分别在视口上方和下方。支持现有离屏暂停有效；短窗口、无重复统计，不将差值当优化百分比。暂停窗口仍有样式工作，也不声称所有页面动画均停止。TaskDuration 和 ScriptDuration 等存在包含关系，不相加。

### 其他页面覆盖边界

访问了展厅、市场、架构地图、贴纸页；初始导航窗口未见失败，但这些窗口读取较早，不作为各页加载完成的总请求量结论。架构地图后来确认实际 hydration 完成，1063 个 DOM 元素、35 个 React Flow 节点（包含分区）、7 条边；“Agent Run / Loop”节点详情成功打开。该页同源 script Resource Timing decodedBodySize 合计 684,549 bytes，其中 ArchitectureMap 275,795、React client 178,836 bytes；是文件解压大小，不是 heap。尚无证据支持替换 React Flow 或以此判定泄漏。

## 工具问题、清理与后续

- Raw `Profiler.enable` 返回方法不存在，随后改用原生 DevTools Performance。
- DevTools“录制并重新加载”被浏览器桥接暂停文档响应，停在 about:blank；11.28 秒录制无目标页活动，明确作废。停止后通过受支持的 tab.goto 恢复，再手动录制已就绪页面的滚动，成功取得火焰图和 bottom-up 调用来源。
- 关闭 DevTools 后 Network 域曾没有继续提供事件，导致第一次缓存实验读到 0 请求，且页面恢复在页底。该次作废；重新 Network.enable，确认 scrollY=0，再刷新取得上表有效窗口。不可把 0 事件说成 0 请求。
- 原生 UI 首次激活时用户正在操作其他标签页；重新读取状态并选中本轮分组的独立页后才操作 DevTools，没有录制其他页面内容作为项目证据。
- 本轮 Fetch 暂停请求已 failRequest 结束、patterns 清空；cacheDisabled=false 已恢复；Performance 和 Network 域已关闭；DevTools 已关闭，临时标签页已关闭。保留原有开发与 preview 服务，未关闭用户标签页。查询文字只保存在临时页的 sessionStorage，未改源码或业务持久数据。

建议实施顺序：BranchReveal 采样/缓存 → 离屏原始 PNG 加载路径 → ZoomImage 关闭释放（见前序）→ 图标和文档目录 CSS。后续需要独立覆盖自然往返滚动、后台/减少动态效果、弱网和部署响应；本轮不声称全站性能或长期泄漏审计完成。


## 首批修复与复验结果

用户批准保留展示效果、三档字形、遮罩节奏和反向滚动，优先改善生成性能。

- BranchReveal 从已加载的响应式展示图采样，不再额外创建最大候选图片；复用采样 Canvas，使用 `willReadFrequently` 的读回模式，跳过 alpha=0 的字形绘制。三档输出缓存及动画公式保留，未宣称释放原有约 27.4 MiB 缓存预算。
- CharacterJourney 背景通过现有 siteImage 生成 WebP，临近 stage 时才启用背景。首屏实测原始 PNG 请求为 0；进入 stage 后 computed backgroundImage 为构建生成的 WebP。
- ZoomImage 收起动画结束后移除大图 src；解码 generation 在关闭/新开/卸载时失效。受控暂缓大图 Response，关闭后 src 消失；放行晚响应后仍无 src、naturalWidth=0；重开正常加载 2560 像素图，再次关闭后引用清空。
- favicon 使用构建生成的 48×48 PNG，apple-touch-icon 为 180×180，原始品牌图片保留。浏览器图标 body 由 790789 bytes 降为 4191 bytes。
- DocsLayout 全局样式块移除多余 `:global()`。三个 summary 实测 minHeight=34px、display=flex；构建原有选择器警告消失。

反向滚动验证：相同过渡位置前后两次 Canvas alpha 总和均为 6181693，中间接近完成时为 2642293，图像 opacity 随进度改变；生成读回次数始终为45，没有因往返重采样。该校验支持状态连续和缓存复用，不替代用户对色彩、字体与动画手感的验收。系统 reduced-motion 模拟下15张图均直接显示，模拟已撤销。

修复后的 DevTools Performance 同机分段滚动样本，确认15个 BranchReveal 全部 hydration；分析范围0–1625ms，脚本265ms、渲染117ms、绘制111ms。Bottom-up getImageData 自身26.125ms（总55.796ms），fillText 自身35.896ms，drawImage 自身57.608ms。前轮 getImageData 自身450.892ms、fillText81.421ms，支持原生成热点明显减轻。两轮窗口、缓存和加载调度不完全相同，后轮还补滚一次以覆盖全部组件，不据此计算全站加速百分比或逐项独立收益。另一次有界实际函数读回计数为45次、约202ms，视口和测量方式不同，不与原生Profiler数据混合求差。

### Cookie 与诺姆共用入口

用户随后指出 Cookie 和首页导览分别绘制诺姆，要求复用。NomGuide 改为由 BaseLayout 全局唯一挂载；首页继续提供章节与互动，其他页面仅在 Cookie 打开时显示。Cookie 内容优先使用同一角色与气泡，关闭后恢复之前的导览展开/缩小/关闭状态。AnalyticsConsent 删除独立角色，保留原生授权控件、设置入口及统计逻辑；NomGuide 通过观察 panel.hidden 将现有面板挂到气泡中，卸载时归还原位置，不复制控件或授权状态。统计脚本的监听绑定跟随 panel，支持移入共享外壳后的 Escape 与选择操作。

本地验收覆盖首页展开、缩小、已关闭状态下打开 Cookie，每次均仅1个 guide / portrait，收起后恢复旧状态；Escape 与收起后焦点回设置，主动打开时焦点到拒绝按钮。非首页清除本地测试选择后首次访问，自动提示也只有1只诺姆；测试结束恢复为原来的 denied。角色岛屿加载期间保留无角色的文字面板，避免组件加载失败使授权入口不可用。没有改变 Google Analytics 的许可、存储和撤回语义。

390×844 窄屏实测，共享外壳 bounds 为 left=12、right=378、top=511.75、bottom=832，面板和角色各1个，未越出视口。最终构建39页成功；Astro check 108个文件0 errors / 0 warnings / 3 hints（未修改的 MapIcon、sakura、keyCode 提示）。本轮没有新增依赖或测试框架，没有部署、提交或推送。

清理：DevTools录制已停止并关闭；临时页关闭；Fetch patterns清空、缓存恢复、viewport/reduced-motion覆盖恢复，读回原型探针已撤销。窄屏覆盖切换期间 Console 记录一次“Viewport size changed”导致的 View Transition aborted，属于本次受控改变视口时的现象，未计为零控制台错误，也未将其归因于 Cookie 修改；自然窗口调整的对应恢复尚未专项验证。


## 持续调查：主题转场恢复

按用户要求持续CDP检查，未据新增发现自动修改实现。对同一独立文档页以90ms间隔点击主题6次，再等700ms，最终回到初始light、aria-pressed=false、data-theme-transition已清除，未捕获unhandledrejection。另在一次主题切换期间受控改变viewport至1280×850，稳定后dark已生效、pending标记消失，仍未捕获unhandledrejection。恢复viewport、初始主题及原localStorage值，移除异常观察者。与前述窄屏覆盖触发的浏览器ViewTransition console记录分开统计，不把一次干预错误泛化为主题功能故障。


## 持续调查：发布站缓存、统计说明与文档失败恢复

### 实际发布站响应

独立临时页访问 `https://loomstudio.pages.dev/`，采集一次普通缓存刷新窗口，事件无截断。HTML HTTP200、h2、`Cache-Control: public, max-age=0, must-revalidate`、Brotli；已采到的指纹CSS/JS及WebP具有 `public, max-age=31536000, immutable`，文本CSS/JS同时为Brotli，多数来自浏览器缓存。该证据覆盖所采资源，不代表未采资源或所有CDN边缘。

线上BranchReveal仍为BMuaNadg，本地修复为BZLN8qcx，确认本地改动尚未部署。线上Cookie状态文本为“当前：已允许统计”，Network观察到googletagmanager及google-analytics域请求。没有读取统计请求正文、导出带参数的请求URL或改变用户线上许可。采完关闭诊断页并关闭本轮Network域。

### 文档说明偏差（待修正）

当前 `/docs/concepts/local-first` 的“官方网站边界”仍写“不收集用户隐私 Cookie 或任何追踪分析”，与已有Google Analytics选择式统计实现、Cookie说明和上述已许可线上请求不一致。应明确“仅在允许统计后使用Google Analytics；拒绝不影响浏览，可随时更改”，不能继续承诺完全没有分析，也不能因为修正文案而扩大采集权限。此次仅登记事实，未擅自修改公开说明或部署。

### 文档连续阅读失败恢复通过

对本地 `/docs` 的后续 `/docs/getting-started` HTML请求，在Response阶段暂缓并注入一次ConnectionReset，之后立即清空Fetch patterns。UI显示“快速开始 载入失败”、state=error、重新加载按钮可见，原正文仍1篇。点击真实“重新加载”后，state=idle、重试按钮隐藏，正文恰为概览和快速开始2篇，没有丢失原正文或重复追加。失败注入只作用于该自建页已知只读请求；所有暂停句柄均已结束。


## 持续调查：展示恢复、地图切换与图片口径

- 对首页 BranchReveal 模块首次请求施加一次 ConnectionReset 并撤销拦截，短暂观察前三张处于SSR、图像opacity=0、文字1字符；随后进入其他区域并返回，全部15个实例均完成hydration，图像加载且正文展开，未留下持续空白。本次没有完整Network.loadingFailed链证明模块已终态失败，不把短暂pending误登记为不可恢复错误，也不外推所有404/模块执行错误均可恢复。
- 全局模块→逐步导览→工作流→数据流→生命周期→调用时序→全局模块，执行3个循环。每次全局模块终态都为1061个DOM、35个React Flow节点；各视图节点数稳定重复。window listeners前后关键项一致：resize3、hashchange2、blur4、keydown3、keyup3、pagehide3、pageshow3；调试对象组已释放。没有发现本样本的节点/监听累积，但未进行retained heap或长期泄漏验收。切换过程中旧按钮会被卸载，因此不能据旧button引用aria-pressed=false判断新视图未激活；最终重新查询导航确认全局模块pressed=true。
- 多语言首页资源入口差异：本地/en的lang=en、没有Google Fonts stylesheet；/首页有该stylesheet。BaseLayout字体条件混用原始Astro.url.pathname和unlocalizedPath，共用note-heading/body却引用Fredoka/ZCOOL/Nunito。这是当前入口差异和待确认一致性问题，未作主观字体外观验收，不据此改变字体选型。
- 减少动态效果在首次挂载前启用，经过全部15个故事组件后，仍发生45次willReadFrequently采样调用；稳定后15张图均直接可见。因此简化动态模式仍生成三档不会播放的字形缓存，是后续可考虑的生成成本优化点，当前没有改实现，也不影响用户要求保留正常动画的决定。首次200ms读数只有9张完成React发布，后续稳定读数为15，未把早期读数写成缺图故障。媒体覆盖和原型探针均已恢复。

### 图片像素预算口径校准

响应式img的naturalWidth/naturalHeight可由浏览器按srcset候选密度修正，不能直接当源文件物理像素。对同一当前页面37个已加载唯一同源currentSrc，用不带srcset的临时Image读取相同缓存资源，确认其物理尺寸：DOM自然尺寸乘积约38.03 MiB，而实际文件像素乘积约94.59 MiB（RGBA单层预算）。例如品牌图DOM510×382而文件1080×810；某角色卡DOM360×501而文件376×524；一张宽图DOM299×200而文件640×427。该校准只保留尺寸元数据，临时Image引用随探针结束释放，但decode可能改变缓存状态，所以不用该窗口推算自然空闲进程内存。

此前初始43.8MiB图像读数来自不同页面时点/URL集合且使用DOM密度修正尺寸，已在前序文档更正，不能与94.59MiB直接作前后变化比较。Canvas显式width/height的27.4MiB预算不受此问题影响。上述94.59MiB仍未包含CSS背景、浏览器缓存策略、GPU副本等，不是实际驻留字节。


## 持续调查：跨页许可同步与已缓存滚动

本地两个自建标签页初始均denied。在地图页点击允许后，另一首页的状态文本自动变为已允许；本地hostname仍127.0.0.1，gtag脚本数0。再在首页点击拒绝，两页均回到未允许，恢复原测试前选择。首页Cookie打开时portrait数仍为1。未操作线上许可。

已完成15个BranchReveal挂载并恢复正常动态后，以41个24ms间隔的程序化scrollTo执行故事区3500px往返，PerformanceObserver记录4个longtask：350/69/63/98ms；窗口约2.358s，TaskDuration1.759s、ScriptDuration0.220s、RecalcStyleDuration0.274s、LayoutCount46、RecalcStyleCount429。该输入速度属于受控快速滚动，不能当作自然滚轮INP或真实帧率。

原生Chrome Computer Use通道在标签页搜索弹层上连续出现AX/截图超时，未继续盲点。尝试Escape撤销；页面侧确认当前诊断页visible且hasFocus=true。原生窗口通道未恢复，故未声称取得该场景的新DevTools火焰图。页面提供long-animation-frame，改用该原生性能API采集第二个同类窗口：出现最长约301ms的长帧，其中React client的MessagePort回调291ms；也有首页FrameRequestCallback函数r的59.1ms样本，forcedStyleAndLayoutDuration50.6ms，及BaseLayout回调20.2ms/forced20.1ms。部分长帧来自本次TimerHandler程序化scrollTo输入，不能全部归因于产品业务函数。

读取当前页inline模块确认r是首页updateParallax，循环内逐项getBoundingClientRect后立即setProperty('--parallax-y')，存在交错读取/写入的明确路径。下一步可考虑先读完可见项、再批量写入以减少强制样式刷新，但尚未做干预A/B或修改实现，不承诺独立收益。React长回调还缺少细分调用栈，不能据此认定为位图重复生成。


已缓存滚动进一步排除生成路径：保持真实逻辑，仅有界包裹Canvas原型方法计数/计时，重复同类往返后getImageData=0、fillText=0，drawImage=28次且均来自BranchReveal输出Canvas，合计约7.1ms；所有方法在finally恢复。因此现有长帧不能简单归因为字形重建或缓存drawImage独占耗时。source中17个data-parallax元素实际有2对父子嵌套（portrait-a→caption、wide-b→caption），父速度分别-0.08/-0.12，子速度0.025/-0.025。若后续批量读写，必须保留父变换先于子测量的依赖，不能为减少flush直接把所有矩形一次读完而悄悄改变动画。

## 持续调查：手记与下载说明交互

- 手记页选择“修复”，退出动画结束后仅1张fix卡可见，inert=false、opacity=1。以70ms间隔交替all/update/fix/journal/update/journal，450ms后恰有2张journal卡，均没有遗留绝对定位，只有1个filter-highlight。页面离开再返回，pageshow.persisted=true，journal选择和2张卡保持；随后选择all可恢复全部6张。探针移除，未发现该路径的过滤状态或BFCache事件丢失。
- 下载说明页未运行任何安装命令，也未改用户剪贴板。只在自建页将navigator.clipboard.writeText临时替换为受控Promise，保留真实组件状态、按钮与异步逻辑。复制pending后切换“日常启动”，旧Promise成功不会将新模式标为copied；同模式受控NotAllowedError显示手动复制提示，重试后受控成功显示copied。原clipboard方法已按原descriptor恢复。此证据不代表真实系统剪贴板权限/写入成功，更不代表安装或平台兼容性通过。

## 持续调查：保留父子依赖的视差探针

原生AX通道已恢复，但现场用户正在切换Chrome标签，故停止切换原生窗口，在自建生产预览页使用CDP。先以instant滚动预热故事区，再按original/batched/batched/original四段、每段41步32ms间隔执行10000–13500px往返。临时包裹requestAnimationFrame，仅识别含--parallax-y的原回调：batched段提前读取15个无视差祖先的元素矩形，原回调正常执行，两处嵌套caption仍在父写入后实时读取；finally恢复RAF和Element原型。没有修改源码。

original 81次回调合计178.2ms，中位2.1ms、最大6.6ms；batched 80次合计81.8ms，中位0.8ms、最大2.9ms。计时包含预读和包装开销。该同页交叉探针支持交错读写有可优化成本，不能作为整页帧率提升比例，也未取得React约291ms回调的细分归因。尚需正式实现后的动画等价验收；不建议直接将所有17项一次预读。测试页error/warn日志为空，自建页已关闭。

## 第二批修复与验收

用户批准修复后，已实现三项：

- BaseLayout滚动条和DocsLayout阅读进度在pagehide取消RAF并清零句柄、移除监听和断开观察器，在pageshow重新连接并请求更新；事件可覆盖多次往返。文档百分比文本选择器限定到.docs-toc，避免命中BaseLayout同名装饰节点。
- 连续阅读目录href使用文章路径和canonicalId；普通点击仍跳转当前DOM标题，修改键点击和复制链接使用可独立打开的规范URL，data-toc-link仍保留DOM临时ID用于高亮。
- 首页预读15个无视差祖先元素的矩形，再按原顺序写入；两处嵌套caption仍在父层变换后测量，未更改速度、阈值或动效。

验收：pnpm check为108文件0 errors/0 warnings/3既有hints；pnpm build成功生成39页。生产预览真实docs→showcase→Back，pageshow.persisted=true；随后instant滚动500/700px，阅读文本30%/45%，滚动条aria值均更新（连续阅读追加文章时分母会增长）。连续阅读生成getting-started规范锚点，独立标签打开时目标标题存在，scrollY253.5。视差10400/11500/12900/11500四个采样位置，从同一起始样式分别运行旧/新计算，17项数值差异大于0.001px者均为0。该证据覆盖计算依赖与反向输入，不替代人工动画观感验收。页面error/warn日志为空，临时标签关闭。

本批未处理快速Back与未结束平滑滚动的竞争、reduced-motion缓存生成、公开隐私说明；React约291ms长回调仍缺细分归因。尚未部署或推送。

## 用户手感反馈后的修正：开场与滚动

用户反馈视差卡顿、晕眩，撤回本轮parallaxRoots批量测量，保留原逐项视差更新。另移除首页原有非被动wheel拦截与自定义缓动：原逻辑将delta乘0.45并按100ms指数追赶，输入依赖主线程；现在采用浏览器原生滚动，未删除视差或字形动效。生产页window wheel监听为0。实际手感仍由用户确认，未把缓动认定为全部卡顿的唯一原因。

用户明确要求开场由资源就绪驱动，而非单纯缩短固定时长。PageArrivalScene现在首屏图片已complete时等待decode后直接退出；确实未加载时前奏只运行到资源就绪，立即停止等待并连续完成原1.2s成形+1.2s揭幕，删除原强制1.6s停留。还修正固定页脚被误算作首屏图片：footer-reveal--curtain内图片按裁切外层bounds判断可见性，避免实际离屏lazy背景阻塞到12s超时。

生产预览清除自建页seen标记后刷新，缓存资源场景约navigation起596ms时arrival已清除、aria-busy=false（并非纯动画耗时）。保留seen的简单刷新跳过开场。对nom-layer-004图片Response暂缓，页面仍处于loading；放行后约2381ms完成连续收尾，aria-busy=false；拦截清空，自建页关闭。此前单纯改短时长的方案已被替换。check为0 errors/0 warnings/3既有hints，最终build39页成功。尚未部署。

## 归档后的追加修复：明确待办与文档导航

用户继续授权已确认问题：减少动态效果时直接显示插画、不建立三档缓存，切换模式释放缓存并清空输出Canvas；切回正常模式重建，保留正常反向滚动。生产页滚动触达15个BranchReveal，reduced模式15图可见、getImageData=0；切回no-preference后45次读回。

文档历史修复取消尚未完成的旧平滑滚动，以navigationGeneration作废旧导航；在push前保存原条目的docsScrollY，目标条目先记录目标位置，scrollend保存实际阅读位置，popstate优先恢复记录。保留replaceState时的历史状态，防止目录/章节分享擦除位置。只取消旧平滑目标而依赖浏览器恢复，或提前按文章矩形校正，均曾使Forward丢失文章内偏移，已替换。最终快速Back回/docs/y0，Forward回getting-started/y2063；滚动2300px后Back/Forward准确回2300px。

local-first公开说明已明确Google Analytics须经许可、拒绝不影响浏览、可随时改选且不读取本地工作区。

用户要求文档侧栏隐藏滚动条而非细化：scrollbar-width:none与WebKit规则仅隐藏外观，保留overflow滚动。移动端<=760px采用左下角44px触发按钮和原生模态dialog，直接移动同一份导航DOM，桌面还原，不复制链接和活动状态；无JS仍保留原导航。390x844下浮层bounds为left12/right364/top252/bottom832；内容仅1份，焦点进入dialog，背景overflow hidden，Escape关闭并回焦按钮，选快速开始后dialog关闭、aria-expanded=false。1440px新页回到桌面侧栏，触发按钮hidden，scrollbar-width为none。

最终check108文件0 errors/0 warnings/3既有hints，build39页成功，diff检查通过。跨页面/构建过程的旧测试页日志曾出现一次React hydration #418，未取得组件归因；最终新文档页error/warn为空，不能据此证明全站没有hydration问题。此线索与React长回调一起保留，不认定为本次修复回归。所有临时媒体/尺寸覆盖恢复，自建页关闭。

## 收束后保留的调查线索

后续issue按用户要求删除；以下仅保留证据，不表示已修复：已缓存快速程序滚动的约291ms React MessagePort长回调与一次hydration #418仍缺少细分归因；不同语言首页Google Fonts入口条件不一致，视觉影响尚未验收。
