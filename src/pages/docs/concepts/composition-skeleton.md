---
layout: ../../../layouts/DocsLayout.astro
title: 设定层与骨架
description: 存储拓扑与提示词投影分离，让设定世界书、角色信息与运行时记忆井然有序。
---

## 存储树 vs 投影视图

在传统提示词管理中，创作者常常被迫把“分类存储位置”和“最终插入位置”混在同一个文件夹树中。

Loom Studio 将两者彻底解耦：

- **资源存储树（Source Tree）**：关注**内容如何组织**（如世界设定、人物背景、道具字典、全局规则）。
- **组合骨架（Composition Skeleton）**：关注**提示词如何拼装**（如系统前缀、长期设定槽、世界线上下文、最新输入）。

~~~text
Setting Store (内容如何组织)
  ├── 角色设定 / 艾莉丝
  └── 世界观 / 浮空城
        ↓ 声明 Injection Group
Composition Skeleton (提示词如何组装)
  ├── [System Zone] 系统指令
  ├── [Context Zone] 世界设定槽 ← 浮空城
  ├── [Persona Zone] 角色定义槽 ← 艾莉丝
  └── [History Zone] 剧情历史
~~~

## Zone Tree 与 Injection Group

骨架采用 **Zone（区）** 与 **Slot（槽）** 结构：

- **Zone**：大颗粒度的逻辑分区（例如 `system`、`narrative`、`tail`）。
- **Slot**：Zone 内部具体的挂载槽位，可声明排序权重与过滤策略。
- **Injection Group（注入组）**：设定条目只需声明自己属于哪个注入组，就会在提示词构建时自动投影到对应的 Slot 中，无需修改骨架定义。

## 动态激活（Activation）

并非所有被挂载的条目都会无条件塞入模型上下文。Activation Engine 会在每轮对话中动态求值：

- **关键词触发**：当前上下文或用户输入命中了设定的唤醒词；
- **状态事实判断**：当前世界线数值（如好感度、地理位置、剧情阶段）满足激活条件；
- **主动阅读沉淀**：Agent 在上一轮主动检索阅读到的记忆，沉淀至动态挂载区。

未激活的条目会被安全略过，既节省了昂贵的 Token 预算，又防止无关背景信息干扰模型的注意力。
