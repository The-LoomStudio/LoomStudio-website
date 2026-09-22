# Website 客户端生命周期与导航审查

日期：2026-09-22  
状态：Open Issues，待修复  
基线：HEAD `eb9101b1e9cf1b6e1ed3bf63b77a1e4ec00ceb22` 加当前工作区，包含未提交页面和插图修改。  
来源：前四项为同模型子智能体独立只读审查，主 Agent 整理，未作第二次独立复现；WEB-005 为主 Agent 后续独立检查。

## 范围与验证

覆盖 BaseLayout、SiteHeader、DocsLayout 的页面/事件生命周期，StoryDemo 的计时与卸载，StudioDemo 的重置与交互，以及图像组件的接入和资源释放。

共 5 项 P2。L1 表示源码因果链；L2 表示当前源码片段的纯内存探针。没有浏览器复现，没有上线测试；不把探针断言通过当作真实 BFCache 或键盘行为的浏览器证据。

本轮不修改实现、依赖、配置或真实数据，不部署。不包含主观视觉验收。

## WEB-001：前进后退缓存恢复后，页面监听没有恢复

优先级：P2；L2，真实缓存命中未验证。

位置：`src/layouts/BaseLayout.astro:210`、`src/layouts/DocsLayout.astro:389`。

页面离开触发 pagehide 后，源码移除滚动、尺寸监听并断开 Observer；若浏览器从前进后退缓存恢复原页面，初始化脚本不会像全新加载那样重新执行，缺少配对恢复路径。自定义滚动条、文档阅读进度、活动章节和触底续载可能失效。取消 RAF 后保留非零 frame 标记，也会影响后续调度。

反证：BaseLayout 虽有 pageshow 监听，但只清除转场标记，不恢复上述资源；首次加载正常不是恢复正确的证据。

探针模拟 pagehide → pageshow → scroll/resize，恢复后的滚动条新调度数为 0。最小方向：明确页面终止与缓存暂停的差异，成对恢复监听/Observer 并重置调度标记。

关闭条件：在真实浏览器确认缓存命中后，上述功能继续工作，且重复返回没有重复订阅。

## WEB-002：文档异步导航缺少最新请求约束与加载去重

优先级：P2；L2。

位置：`src/layouts/DocsLayout.astro:354`，结果提交在 360-372 行。

连续选择未加载文档 A、B，若 B 先返回、A 后返回，旧 A 仍插入正文、滚动并更新历史，最终导航回到已过时的选择。重复点击同一未加载文档时，还可能重复插入正文和相同章节 ID。

反证：loadedArticle 只在请求前检查；loadingNextDocument 只保护自动续载，不保护侧栏导航。请求完成后的插入未复核是否已经加载。

逆序完成和重复点击的纯内存探针均得到错误结果。最小方向：按文档共享加载/去重；导航滚动与历史提交受最新选择约束，插入前再核对。取消请求不能代替提交时的有效性检查。

关闭条件：逆序返回不抢回导航，重复请求不会生成重复正文；侧栏点击与自动续载交错也遵守同一去重规则。

## WEB-003：自定义链接处理器吞掉修饰键导航

优先级：P2；文档分支 L2，菜单分支 L1。

位置：`src/layouts/DocsLayout.astro:333`、`src/components/SiteHeader.astro:263`。

在文档侧栏或全屏导航 Cmd/Ctrl 点击链接，处理器仍 preventDefault，转为当前页滚动、异步加载或 location.assign，破坏原生新标签页行为。

反证：BaseLayout 的捕获监听虽然排除修饰键，但退出自己的处理器不会阻止后续处理器取消事件。内存探针确认文档已加载分支的 Meta+click 被取消。

最小方向：只接管未被处理、无修饰键的普通主键点击；保留其他点击的浏览器默认行为。

关闭条件：正常点击继续执行页面导航，Cmd/Ctrl/Shift 等点击遵循浏览器链接语义。

## WEB-004：全屏导航没有完整隔离背景及恢复焦点

优先级：P2；L1，未做浏览器键盘复现。

位置：`src/components/SiteHeader.astro:130,163`。

打开全屏导航后只把 main、footer 设置为 inert，而文档侧栏 docs-nav、docs-toc 是兄弟区域，仍可被 Tab 到达。用户能把焦点移入遮罩后并触发链接；菜单中按 Escape 关闭也没有将焦点送回触发按钮。

反证：菜单声明 aria-modal，但元素是普通 div，没有原生 dialog 的焦点约束，也未实现 Tab 管理。用于卡片方向切换的 focus() 不覆盖完整模态焦点生命周期。

最小方向：完整隔离实际背景区域，明确打开和关闭的焦点归属，优先评估已有原生模态能力。

关闭条件：文档页打开菜单后 Tab/Shift+Tab 不离开模态范围，Escape 关闭后焦点可继续操作触发按钮，背景 inert 正确恢复。

## WEB-005：连续阅读目录把临时章节 ID 暴露为持久链接

优先级：P2；L2，未执行浏览器刷新或分享验收。

位置：`src/layouts/DocsLayout.astro:158,188,220`。

`enhanceArticle` 给追加文章的章节 ID 加上文档前缀，以避免连续阅读时与已有 DOM 冲突；原 ID 保存在 `data-canonical-id`。但 `renderToc` 直接用新的 `heading.id` 生成 `href`，例如 `#overview--最小概念图`。文章进入活动状态后地址路径已切换到 `/docs`，目录链接因此将临时 ID 用作该文档的公开 fragment。

当前页面中此 fragment 可以匹配已追加的章节，但刷新或在另一个标签页打开同一地址时，独立 `/docs` 页面只有 `id="最小概念图"`；初始文章增强也不会添加 `overview--` 前缀。代码没有将此 fragment 映射回规范 ID 的恢复路径。因此连续阅读会生成无法在独立页面定位同一章节的链接。

反证核查：标题旁的复制按钮已使用 `document.href + canonicalId`，该路径是正确的；不能据此认为右侧目录也正确。BaseLayout 对同路径链接不做导航改写，DocsLayout 的侧栏监听只处理 `data-doc-link`，不接管目录链接。

探针通过 TypeScript AST 提取当前 `documentKey`、`enhanceArticle`、`renderToc`，用最小 DOM 替身执行“追加概览文章 → 渲染目录”，并核对当前 `src/pages/docs/index.astro` 的显式章节 ID：

```json
{"tocFragment":"#overview--最小概念图","standaloneId":"最小概念图","appendedId":"overview--最小概念图","fragmentExistsOnStandalone":false}
```

断言通过，退出码为 0，无文件写入。这证明目录生成值与独立页面 ID 不一致，不等于真实浏览器滚动或历史恢复已经复现。

最小方向：区分当前长页面内部定位 ID 与可分享的规范文档 URL。目录点击可以定位当前 DOM，但写入或复制的链接应使用规范路径和章节 ID；复用标题复制按钮已有的语义，不再增加第二套章节标识协议。

关闭条件：从其他文档连续阅读或侧栏加载目标文章后，目录链接能定位当前章节；刷新、复制链接到新标签页仍定位相同章节。原始页面直接进入的章节链接及修饰键行为不能回退。

## 排除项与剩余风险

- StoryDemo 有取消标记和计时器清理；关闭 Agent 面板后继续演示是明确设计，不作为泄漏。
- StudioDemo 当前只挂载 WorkspaceDemo，不把未使用 AgentDemo 当作实际调用者。
- ZoomImage、LayeredIllustration 尚未接入页面；天空系统已归档，不能据此报告线上图片或动画缺陷。
- 普通 img 未发现由应用持有却不释放的 Blob URL，不为缺少手动清理而造问题。
- 前四项问题在已读 README、计划和归档中未见既有记录；后续 WEB-005 与现有四项触发条件不同，独立登记。实际仅执行 Node/TypeScript 源码内存探针，没有 test/build、安装依赖、服务启动或真实浏览器验证。

后续实施优先 WEB-002，再处理 WEB-001 与模态/链接交互。图片失败、解码时序和移动设备体验仍需真实浏览器/设备证据。

## 2026-09-22 补查：Website 类型检查账目

运行 `pnpm check`，结果为 **0 errors、0 warnings、24 hints**；命令退出码为 0。运行环境为 Node `v26.8.2`，项目声明要求 Node `>=22.18.0 <23`，因此这不是目标运行时验收。

24 个 hints 主要包括 React `FormEvent` / Radix `ElementRef` 类型弃用、`StudioDemo.tsx` 中未挂载的 `AgentDemo`、快照 `AssetWorkbenchLayout` 中未使用的 `setMobilePane`，以及旧式 JavaScript 构造函数提示。当前首页实际只挂载 `WorkspaceDemo`；结合 Studio Demo 仍是独立演示草稿，未把未挂载 AgentDemo 计为线上功能缺陷，也没有为了消除提示改动 WIP 快照或 Agent 展示代码。

这项账目用于区分“类型检查通过”和“源码完全无维护提示”：当前没有类型错误，但也不能据此宣称 Website 已完成浏览器、目标 Node 版本、响应式或视觉验收。未运行 `build`，没有修改 Website 实现。
