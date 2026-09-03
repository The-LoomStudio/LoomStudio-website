---
layout: ../../layouts/DocsLayout.astro
title: 快速开始
description: 建立 Loom Studio 的第一张概念地图，理解桌面应用与公开文档的边界
---

## Loom Studio 是什么

Loom Studio 是面向长篇角色扮演与深度互动叙事的桌面创作工具。它重点服务于有世界观支撑、有严谨人物设定、可自由分支的故事体验，而不是单纯将对话气泡排列成流水账

公开文档围绕三个核心支柱展开：

1. **Narrative Timeline**：承载经过确认提交的剧情正文与世界线
2. **Agent Session**：承载智能体的交互消息、幕后推演、工具与工作历史
3. **Prompt Build**：从清晰的内容来源装配本轮上下文，并保留完整的链路记录

## 先理解一条核心边界

<blockquote data-callout="boundary">
剧情正文与推演会话紧密关联，但两者不共根、不镜像，绝不强制同步回退
</blockquote>

这条边界让“故事里真正发生了什么”和“AI 为此在幕后做过什么”始终保持清晰独立。当你回溯至旧节点时，推演历史依然忠实存在，既不伪造假象，也不破坏已有沉淀

## 当前公开网站的职责

当前发布的站点是完全独立的静态展示空间：

- 沉浸式动态天色产品发布页
- 独立公开文档体系与阅读器
- 银灰质感的视觉设计系统
- 本地静态编译构建产物

公开网站不连接本地工作区、不调用任何模型接口，亦不存储任何私人数据

## 本地启动网站

~~~bash
corepack pnpm install
corepack pnpm dev
~~~

浏览器访问 http://localhost:4321/ 查看发布页，访问 http://localhost:4321/docs 进入公开文档

## 推荐阅读路径

- 关注故事正文与世界线如何组织：阅读 [Narrative Timeline](/docs/concepts/narrative-timeline)
- 关注 Agent 幕后推演与工具工作流：阅读 [Agent Session](/docs/concepts/agent-sessions)
- 关注提示词如何组装与动态激活：直接阅读 [Prompt Build](/docs/concepts/prompt-build) 与 [设定层与装配骨架](/docs/concepts/composition-skeleton)
