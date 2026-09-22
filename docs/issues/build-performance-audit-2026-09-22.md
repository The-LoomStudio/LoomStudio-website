# Website 构建性能审查

日期：2026-09-22  
状态：Open Issues，待修复  
范围：Astro 静态构建产物、首页可选 Studio Demo 加载策略；未做浏览器网络瀑布或 Lighthouse 测量。

## WEB-PERF-001：折叠的交互草稿仍在空闲时加载超过 500 kB 的客户端代码

优先级：P3
证据等级：当前 Website `pnpm build` 输出、构建产物大小和页面源码。

### 位置与事实

- `src/components/ProductPreview.astro:7` 在 `<details>` 折叠内容中挂载 `<StudioDemo client:idle />`；
- 同组件的 `StoryDemo` 是 `client:load`，而 Studio Demo 只是“查看真实组件交互草稿”的可选内容；
- `src/components/studio-demo/StudioDemo.tsx` 引入快照 UI、Markdown 内容和编辑演示；
- `pnpm build` 成功生成 13 个页面，但 Vite 输出 chunk 警告；
- 构建产物 `dist/_astro/markdown-content.DSEH2ijg.js` 为 522,393 bytes，超过 Vite 默认 500 kB 警告阈值；相关 Studio Demo chunk 另有 76,435 bytes。

### 影响

用户不展开 `<details>` 时，折叠内容仍会因 `client:idle` 在浏览器空闲阶段初始化并下载对应客户端代码。这样一个可选的、偏演示性质的工作区草稿会把 Markdown/编辑器依赖带入首页资源链；不应把构建成功等同于首屏和后续资源已经合理拆分。

当前没有压缩后网络大小、缓存命中、移动设备带宽或真实交互延迟数据，因此不声称已经造成特定 LCP/TBT 数值回归。问题是静态加载策略与产物大小的直接组合，属于性能优化项，不是功能错误。

### 验证

运行：

```bash
pnpm build
```

退出码为 0，输出明确显示 13 个页面生成成功，同时报告 minified chunk 超过 500 kB。随后检查 `dist/_astro`，最大的 JavaScript 文件为：

```text
522393 dist/_astro/markdown-content.DSEH2ijg.js
180631 dist/_astro/client.V7dXQhPI.js
76435  dist/_astro/StudioDemo.DKDsiiS9.js
```

源码和构建产物引用核对确认该大 chunk 属于 Studio Demo 依赖链。构建运行在 Node `v26.8.2`，项目声明要求 `>=22.18.0 <23`；因此构建成功不是目标 Node 版本的发布验收。

### 最小方向与关闭条件

把可选草稿的代码加载和用户展开行为对齐，或将重量较大的 Markdown/编辑器依赖进一步拆分；不要只调大 `chunkSizeWarningLimit` 隐藏警告。保留无 JavaScript 时的静态页面和当前演示边界。

关闭时应证明未展开草稿不会下载其重依赖，展开后仍能正常挂载；至少补一次目标 Node 版本的构建和浏览器网络/交互检查。压缩格式、缓存和移动端表现仍需真实发布验收。

## WEB-PERF-002：已禁用的 IntroLoader 仍将品牌图片标记为 eager

优先级：P3
证据等级：当前源码加载链；未做真实浏览器网络瀑布验证。

位置：`src/components/IntroLoader.astro:1-21`。

`IntroLoader` 输出的根节点一开始带有 `hidden`，因此 CSS 明确令它不显示；紧接着组件脚本执行：

```ts
document.querySelector<HTMLElement>('[data-intro-loader]')?.remove();
```

这意味着 Loader 在当前页面没有可见生命周期，也没有等待图片加载或展示的路径。但其中的 `/brand/banner.png` 使用 `loading="eager"`。在浏览器执行删除脚本之前，解析器仍可能为该图片启动 eager 请求；即使请求已被缓存，组件也会为一个立即删除的 DOM 节点制造额外的图片解码/预加载机会。首页后续还会在 `index.astro` 中再次引用同一品牌图片。

这不是把“没有 Loader”误判成视觉问题，而是已禁用组件仍保留主动资源加载语义。它也让当前源码里的 Loader、样式和图片职责互相矛盾：组件名和结构暗示首屏加载，实际行为却是构建后直接移除。

### 最小方向与关闭条件

- 如果 Loader 已正式废弃，删除首页挂载和组件文件，或至少移除其中的 eager 图片；
- 如果未来需要 Loader，应该由明确的客户端生命周期控制显示和资源加载，不能用静态 `hidden` + 立即删除同时保留 eager；
- 目标浏览器网络检查应确认首页不再请求只属于已废弃 Loader 的资源，实际需要的品牌图片仍按正常页面策略加载；
- 不通过单纯改大图片缓存或忽略网络请求来关闭问题。

## 证据边界

本轮未修改 Website 实现、依赖或构建配置；未启动 dev/preview Server，未运行 Lighthouse，也没有把 522,393 bytes 直接等同于传输字节数。
