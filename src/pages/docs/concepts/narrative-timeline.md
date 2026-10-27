---
layout: ../../../layouts/DocsLayout.astro
title: Narrative Timeline
description: 以 Narrative 节点和分支索引 Timeline 中 canonical Session 消息的剧情正文
---

## 它记录什么

Narrative Timeline 保存故事的 Branch 与楼层索引；canonical 正文内容保存在 Timeline 根 Session 的消息历史中，Narrative Node 将分支位置关联到对应消息。用户输入会先原子提交 canonical 用户消息及正文索引，再启动 Run。普通讨论回复不会自动进入正文；正文模式下的 Assistant 消息按采用的写入规则提交。Narrative Node 是正文导航与分支位置的权威索引，不是 canonical 正文副本。

它通常包含：

- 故事身份与剧情分支（Timeline & Branch）
- 有序的 Narrative Node 与分支楼层索引，定位 canonical Session 消息
- 与当前世界线关联的状态数据（State Head）
- 可回溯至具体推演会话与操作记录的来源标识

## 它不记录什么

Provider 的原始消息协议、推理内容、工具调用与失败重试不属于 Narrative 正文。用户在故事输入框提交的内容则先写入 Timeline；发送或运行失败不会撤销已经提交的节点。

~~~text
用户提交正文
  → 写入 Narrative 节点
  → 以已提交节点身份交给 Timeline 根 Session
  → Provider / Tool Loop
  → 获准的正文工具可明确写入后续 Narrative
  → 普通最终回复留在 Session 工作记录
~~~

## 分支与回溯

剧情分支允许故事从已有节点展开新的走向。切换 Branch 会改变当前正文 Head 与关联 State 版本；根 Session 的 Transcript 保留工作记录，并按分支采用对应的历史位置。

这是深思熟虑的架构设计：创作者应当可以自由对比不同世界线的抉择，系统通过上下文投影来呈现对应的剧情，而不是简单抹除记录来伪造“从未发生”的假象

## 为何长篇必须如此

长篇叙事需要把正文、交互操作与模型通信记录区分开。Narrative Timeline 以正文节点和分支保存故事，同时由根 Session 承接输入与工作历史；章节归档、多线发展、状态快照与长文摘要都围绕故事正文组织。
