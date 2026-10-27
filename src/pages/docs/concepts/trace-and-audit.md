---
layout: ../../../layouts/DocsLayout.astro
title: 可解释性与 Trace
description: 按记录范围检查 PromptBuild 观察、Provider usage、运行记录与结构化数据变更
---

## 用已有观察定位问题

在长篇角色扮演与复杂的提示词系统中，创作者经常会遇到令人头疼的问题：

- “为什么模型突然把某条关键设定抛到了脑后”
- “某条世界观规则在这一轮究竟有没有被激活”
- “本轮保存了哪些来源、激活与加工观察”

构建观察、Provider Observation、运行记录和数据变更各自回答不同问题。它们提供可检查的事实，但不合并为覆盖全链路的审计日志。

## 按记录类型检查构建与调用

PromptBuild 的观察记录可包含选中的来源、加工记录、激活原因、消息片段与最终编译消息；可见细节取决于该次构建与观察上下文。它不是保证每一项都产生完整记录的全局审计日志：

~~~text
来源与条件求值 (Build Observation)
  ↓
槽位映射与权重排序 (Ordering Trace)
  ↓
可选加工与消息投影 (Transform / Emission)
  ↓
编译后的 messages；Provider 请求及回复另记 Observation
~~~

检查视图可展示实际记录到的来源、激活原因、加工和消息顺序。输入 Token 估算与 Provider 返回的 usage 是不同口径：前者是请求前估算，后者是 Provider 实际报告；系统不承诺逐片段精确计费或所有 Provider 都回报 usage。

## 变更集与版本安全（Changeset）

结构化数据操作可通过 Data Engine 事务记录 Changeset 与 Revision，但它们不把整个 Agent Run、Provider 请求、外部副作用和所有数据写入合成一个原子事务：

- Narrative 输入提交与随后 Run 启动是分开的；后续失败不会撤销已提交正文
- State Revision 记录结构化状态变化，Branch 选择当前采用版本
- Changeset 回退只适用于支持回退的具体数据操作，不代表能恢复 Provider 或其他外部副作用

这些分层记录帮助定位本轮上下文和执行结果；它们不替代备份，也不保证所有外部副作用都可回退。
