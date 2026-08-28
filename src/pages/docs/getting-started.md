---
layout: ../../layouts/DocsLayout.astro
title: 快速开始
description: 用最短路径建立 Loom Studio 的产品概念地图，并明确当前公开站点与桌面应用的边界。
---

## Loom Studio 是什么

Loom Studio 是一个面向 AI Native 时代的桌面对话扮演与智能体开发框架。它内建第一方 AIRP 体验，重点服务深度、长篇、可分支的互动叙事，而不是只把模型回复排列成一条聊天记录。

首版公开文档先围绕三个核心对象展开：

1. **Narrative Timeline**：承载经过受控提交的剧情正文与世界线。
2. **Agent Session**：承载 Agent 消息、推演、工具与工作历史。
3. **Prompt Build**：从明确的 Source 构造本轮上下文，并留下可检查的 Trace。

## 先理解一条边界

<blockquote data-callout="boundary">
Narrative Timeline 与 Agent Session 可以关联，但两者不共根、不镜像，也不会自动同步回退。
</blockquote>

这条边界让“故事里真正发生了什么”和“Agent 为此做过什么”保持独立。回到旧世界线时，Agent 的旧工作历史仍然存在；它可能过时，但不会被系统假装从未发生。

## 当前网站能做什么

这个仓库目前提供：

- 纵向 Parallax 产品发布页；
- 独立公开文档导航与 Markdown 页面；
- 网站自己的银灰色视觉 Token；
- 可替换的品牌 Logo 与首页 Hero 资产；
- 完整静态构建产物。

它不会连接 Studio Server、读取本地文件、调用 Provider 或保存用户数据。

## 本地运行网站

~~~bash
corepack pnpm install
corepack pnpm dev
~~~

打开 http://localhost:4321/ 查看发布页，打开 http://localhost:4321/docs 查看文档页。

## 下一步阅读

如果你关心故事如何被保存，继续阅读 [Narrative Timeline](/docs/concepts/narrative-timeline)。如果你关心 Agent 的工作过程，阅读 [Agent Session](/docs/concepts/agent-sessions)。如果你更关心上下文如何被构造，直接进入 [Prompt Build](/docs/concepts/prompt-build)。
