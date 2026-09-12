# Studio 组件展示草稿

Status: Superseded by playable story demo; component draft retained as secondary

## 目标与授权

用户已批准：完整界面使用后续提供的截图；工作区分栏与 Agent 对话使用真实 React 组件快照，允许新增必要依赖。首版是发布页 UI 演示，不连接业务服务。

## 决策与边界

- 只修改 Website；Studio 工作区存在其他未提交工作，不修改源项目。
- 复制实际展示源码、模块样式和必要基础样式。来源记录包含 HEAD 与逐文件摘要，区分工作树快照与已提交版本。
- 工作区采用 AssetWorkbenchLayout、FileTree 和 MarkdownContent；Agent 采用 AgentChatPanel。
- 仅演示内存数据；不接 RPC、Provider、扩展运行时或持久布局 Store。
- 不建立共享包、自动同步和完整应用嵌入，不承诺官网组合布局等同完整 Studio 页面。

## 工作包

1. 保存必要源码与来源记录，适配扩展入口、类型和样式范围。
2. 网站启用 React，接入固定数据、工作区分栏和 Agent 交互；建立截图占位。
3. 定向类型检查、静态构建；客观验证关键交互与无业务请求。

## 完成条件与验证预算

源码与样式差异可追溯；分栏、文件选择、Agent 选择和输入可以体验；刷新重置演示。新增构建集成执行网站 check/build；交互使用聚焦浏览器诊断或最小 runnable check。视觉与手感由用户验收，不以自动检查代替。

## 停止条件

依赖扩展到实际业务运行时、需要改变产品公共契约或引入发布服务时停止；本地草稿不部署。

## 最终结果

- 已在发布页 `/#system` 接入真实 Studio 组件快照：工作区使用 AssetWorkbenchLayout、WindowColumnLayout、FileTree、MarkdownContent；Agent 使用 AgentChatPanel 与 ChatComposer。
- 已加入固定演示数据：文件选择/展开/下钻、分栏拖动与键盘调整、Agent 切换、工具事件展开、Markdown 消息、固定回复、重置。演示不调用 RPC、不读写本地数据、不调用 Provider。
- 完整工作台位置已建立截图占位，等待用户提供截图后替换。
- 已记录来源与适配差异：`src/components/studio-demo/source.json`、`src/components/studio-demo/README.md`。
- `pnpm check`：PASS，0 errors / 0 warnings / 21 hints（包含 Studio 源码的已知弃用提示）。`pnpm build`：PASS；存在 Vite 单个 chunk 超过 500 kB 的 warning，已通过 `client:visible` 与 240px root margin 将演示按可见区域加载，未继续做低收益拆包。
- 内置浏览器客观验收：桌面文件选择、键盘分栏、Agent 菜单、固定回复、重置均通过；390px 窄屏文件下钻和 Agent 发送通过，`document.documentElement.scrollWidth === 390`、演示根滚动宽度 360、无控制台 error。未完成主观像素级比较，截图与主题尚待用户验收。

## 后续方向更新

经过发布目标复核，主展示不再追求原生 Studio 组件 1:1。发布页已新增 `src/components/story-demo/` 作为主视觉：三幕固定剧情、Agent 推演、世界状态、资源变化、分支按钮与自由输入组成一条可玩的连续流程。原组件展示收进可展开的辅助草稿，用于说明真实产品结构但不承担第一印象。
