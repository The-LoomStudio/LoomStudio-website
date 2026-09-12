# Studio 组件展示快照

发布页 `/#system` 使用 `StudioDemo.tsx`；固定内容在 `fixtures.ts`，截图位置在上一级 `ProductPreview.astro`。目前只有截图占位，没有以模拟界面冒充截图。

## 来源与 1:1 边界

`snapshot/` 来自相邻 Studio 当前工作树，基准 HEAD 为 `e7683f1cac7bc8d9a59de724f753a765942bd3e7`。源工作树存在未提交修改，不能将这份快照称为该 commit 的纯净副本。`source.json` 保存每个来源文件的 SHA-256。

复用的真实组件：AssetWorkbenchLayout、WindowColumnLayout、FileTree、MarkdownContent、AgentChatPanel、ChatComposer，以及它们的样式和控件。组件 DOM、布局和交互遵循源码；演示工具栏、组件组合及示例内容属于官网，不代表完整 Studio 页面。

首版使用 Studio 全局 CSS 的默认深色 Token、系统字体与 `uiScale=1`。若截图使用了其他主题或自定义 CSS，需要同步相应主题值后才能比较；不声称所有主题下像素一致。最终观感与交互手感由用户验收。

## 明确适配差异

- AgentChatPanel 删除未启用的扩展 Renderer 分支及其类型/静态导入，保留原来的普通 Markdown 分支；不加载扩展 Host。
- `entities/index.ts` 只保留当前组件消费的原始 DTO 声明及 JSON 类型，避免依赖产品 Workspace 包。
- i18n 保留原 translator 与组件实际使用的中英文词条；词条来自工作树。
- `global.css` 包在 `@scope (#studio-demo)` 内，首个 `:root` 改为 `:scope`；页面级 body/root 规则在此范围内不命中官网。需要支持 CSS `@scope` 的现代浏览器。
- Radix ContextMenu / DropdownMenu 的 Portal 指向演示根节点，防止弹层丢失 scoped 样式；服务端渲染时不访问 document。首版页面只挂载一个演示根节点。
- FileTree SCSS 显式引用原 `styles/abstracts`；Studio 原先通过 Vite additionalData 注入。
- 官网页面取消演示区域的视差移动，保持点击与弹层定位稳定。React 在进入视口前 240px 开始加载。

## 后续更新

1. 选定一轮需要展示的 Studio UI，核对上述入口与依赖变化。
2. 只更新来源清单里的文件；用记录的摘要和 Git Diff 判断变化，不整仓复制。
3. 保留上述少量适配，更新词条/DTO 子集和 source.json 摘要。新增业务依赖先判断边界，不自动把 RPC、Store 或扩展运行时搬进来。
4. 网站执行 check/build，并重验受影响的交互；截图、主题和组件快照尽量来自同一轮 UI。

没有自动同步、跨仓 import 或共享发布包。所有演示状态位于 React 内存；切换样例、重置或刷新会丢弃输入。发送只追加固定示例，不进行模型调用。

## 当前验证

见 `docs/plans/studio-ui-demo.md` 最终结果。首次构建因遗漏 Studio 注入的 Sass mixin 失败，显式引入后通过。代码高亮等真实依赖使首版出现超过 500 kB 的 chunk 提示，保留按可见区域加载；未声称完成性能优化。
