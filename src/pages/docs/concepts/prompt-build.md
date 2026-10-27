---
layout: ../../../layouts/DocsLayout.astro
title: Prompt Build
description: 将分散的故事正文、设定与运行时状态编译为清晰可查的模型输入
---

## 四个核心概念

Prompt Build 可以通过四个概念建立理解：

| 概念 | 职责 |
| --- | --- |
| Structure | 定义提示词的槽位、挂载点、排序与预算骨架 |
| Source | 提供 Preset、Lore、Narrative 投影、Session 工作历史与本轮输入 |
| Activation | 按启用状态、关键词或运行时事实求值本轮是否纳入 |
| Trace | 说明来源选择、加工、激活与消息投影的可观察记录 |

## 保存启用（Enabled）与本轮生效（Active）

`Enabled` 是创作者长期保存的启用状态，`Active` 则是单轮提示词编译的动态计算结果，二者不能混淆

例如，一个 Lore 条目可以长期处于 `Enabled`，而本轮是否 `Active` 由其 Activation 条件和当前事实决定。作者正文处理器也只能修改本轮候选内容或激活结果，不会改写已保存的原文。

## 从内容来源到模型接入

~~~text
构建器拉取可用 Source 集合
  → 组成 SourceNode 与 PromptContribution
  → 可选的扩展处理器执行 prepare / render
  → Application 按 Preset 有序树、Anchor / Slot 与 Activation 做 DFS 编排
  → 生成 Provider messages；Provider-managed Tools 作为独立数组
  → AI Gateway / Adapter 映射 Provider 请求并记录外部响应事实
~~~

PromptBuild 属于 Application；Loom Core 的旧 Pass 原型已退役。Gateway / Adapter 负责 Provider 调用与协议映射，不决定正文提交。Content Tool 描述进入 PromptBuild；Native Function Tools 与 messages 分开传递。

## 链路追踪（Trace）的价值

长篇故事的上下文往往极其庞大。缺少链路追踪时，创作者只能猜测某段设定为什么被遗忘、为什么被截断，或是哪段逻辑修改了最终输出

可查阅的编译链路将这些猜测转变为明确的事实：来源文件、版本编号、装配顺序与激活原因全部有迹可循，让复杂的长篇创作重获掌控感
