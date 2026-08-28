---
layout: ../../../layouts/DocsLayout.astro
title: Agent Session
description: Agent Session 是可持续的智能体工作空间，保存消息与运行事实，但不拥有 Narrative Timeline。
---

## 一个独立的工作空间

Agent Session 保存 Agent 与用户之间的消息路径，以及运行过程中产生的事实。它可以绑定一条 Narrative Timeline，为故事生成或编辑内容，但二者仍然保持不同的权威边界。

Agent Session 可以容纳：

- 用户与 Agent Message；
- Tool Invocation 与 Tool Result；
- Run、Step 与运行状态；
- 与 Narrative 提交相关的 Changeset；
- 只属于工作过程的备忘与观察。

## 为什么不直接等于聊天

Provider 的 messages[] 是一次调用的传输形状，不应该成为永久数据模型。Loom Studio 会从 Agent Session、Narrative、Setting 与 Prompt Resource 中选择本轮需要的内容，再编译成 Provider 能理解的消息。

因此，持久化历史不必永远绑定某一家 Provider，也不需要把每一条工具结果都无条件塞回未来上下文。

## 与 Narrative 的提交关系

Agent 产生的文本只有在明确提交后才进入 Narrative Timeline。未指定 Narrative 目标时，本轮只更新 Agent Session；指定并确认目标时，相关 Agent Message 与 Narrative Node 可以在同一 Changeset 中留下关联证据。

## 未来的工作模式

不同 Preset 可以塑造不同工作方式：直接角色扮演、长篇续写、设定审查、章节修订或带工具的研究。AIRP 提供默认体验，但不会把唯一一种小说工作流写死进底层平台。
