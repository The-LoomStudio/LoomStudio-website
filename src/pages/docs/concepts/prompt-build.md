---
layout: ../../../layouts/DocsLayout.astro
title: Prompt Build
description: Prompt Build 把分散的故事、设定与运行事实编译成一次可解释、可追踪的模型输入。
---

## 四个关键词

Prompt Build 可以先用四个概念理解：

| 概念 | 作用 |
| --- | --- |
| Structure | 定义 Prompt 的 Zone、Slot、顺序与预算骨架 |
| Source | 提供 Narrative、Setting、Card、Session 等正文来源 |
| Activation | 在每次 Build 中判断来源是否进入本轮上下文 |
| Trace | 解释哪个来源经过什么步骤，最终为何 active 或 inactive |

## Persistent enabled 与本轮 active

enabled 是作者保存下来的配置，active 是一次 Prompt Build 的计算结果。二者不能混为一个布尔值。

例如，一个 Setting Resource 可以长期保持 enabled，但只有当关键词、状态事实、运行事实或用户 Pin 条件满足时，才在某一轮 Build 中 active。Activation 只产生覆盖层与 Trace，不应该偷偷修改源配置。

## 从来源到 Provider

~~~text
Runtime 构造 Source Set
  → Structure 分配 Zone / Slot
  → Activation 评估本轮来源
  → Loom Core Pass 执行转换与审计
  → 编译 canonical message
  → Provider Adapter 映射协议
~~~

Provider Adapter 只负责协议映射，不决定 Narrative 是否提交，也不拥有 Prompt 的业务结构。Kernel 同样保持业务无感知。

## 为什么 Trace 很重要

长篇上下文会逐渐复杂。没有 Trace 时，作者只能猜测某段设定为什么出现、为什么缺失，或者是谁修改了最终 Prompt。可检查的 Build Trace 把这种猜测变成事实：来源、版本、顺序、转换与激活理由都可以被定位。
