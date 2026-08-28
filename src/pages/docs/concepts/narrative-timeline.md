---
layout: ../../../layouts/DocsLayout.astro
title: Narrative Timeline
description: Narrative Timeline 是故事正文的权威世界线；它不是 Provider messages，也不是 Agent 工作历史的镜像。
---

## 它保存什么

Narrative Timeline 保存经过受控提交的剧情正文。一个很短的对白可以成为 Narrative Node，一段长篇章节也可以成为 Narrative Node；判断标准不是长度，而是它是否已经被确认进入故事世界。

它通常包含：

- Timeline 与 Branch；
- 按顺序连接的 Narrative Node；
- 与当前世界线关联的状态 Head；
- 可追溯到 Agent Session、Run 或 Changeset 的来源信息。

## 它不保存什么

用户输入不会因为被发送就自动成为剧情正文。Agent 的推演、工具调用、失败尝试和 Provider 原始消息也不属于 Narrative Timeline。

~~~text
玩家输入
  → Agent Session
  → Agent 工作 / Provider 调用
  → 候选正文
  → 受控提交
  → Narrative Timeline
~~~

## 世界线与回退

Narrative Branch 让故事可以从旧节点产生新的方向。回退 Narrative 只改变剧情世界线及其关联状态，不会同时回退 Agent Session。

这是刻意设计的结果：Agent 可能仍记得旧世界线中的判断，系统应通过版本事实与 Context Projection 处理这些过时信息，而不是删除历史来制造“从未发生”的假象。

## 为什么适合长篇

长篇互动叙事最怕三个东西混在一起：正文、操作历史和模型协议。Narrative Timeline 把正文单独保留下来，因此章节组织、分支、状态快照和未来的摘要策略都可以围绕故事本身演进。
