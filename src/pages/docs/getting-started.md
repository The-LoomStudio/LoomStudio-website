---
layout: ../../layouts/DocsLayout.astro
title: 快速开始
description: 启动 Loom Studio 配置模型并开始第一段故事
---

## 安装与启动

先安装 **Git** 和 **Node.js 24.22.0 或更高版本**，确认终端中可以使用 `git`、`node` 和 `npm`。

在终端依次运行：

~~~bash
git clone https://github.com/The-LoomStudio/LoomStudio.git
cd LoomStudio
npm start
~~~

首次启动会下载依赖并构建缺失的应用产物，需要联网。启动后，打开终端显示的地址，默认是 [http://127.0.0.1:18010](http://127.0.0.1:18010)。使用时保持终端运行，结束后按 `Ctrl+C` 停止服务。

各系统的安装与更新命令见 [下载与启动](/download)。

## 开始第一段故事

1. 在设置中添加模型 Provider、API 地址与密钥，选择可用模型。
2. 为使用的 Agent 预设配置模型，导入或创建角色及故事设定。
3. 进入角色的故事工作台，输入第一句话。

模型 Provider 会接收本轮请求组装的上下文。可通过 [Prompt Build](/docs/concepts/prompt-build) 了解预设、设定和历史如何参与构建。

## 下次打开

在 `LoomStudio` 目录再次运行：

~~~bash
npm start
~~~

升级前先停止服务，备份启动日志中显示的数据目录，再按 [下载页的更新步骤](/download) 操作。

## 继续了解

- [Narrative Timeline](/docs/concepts/narrative-timeline)：阅读剧情与管理故事分支
- [Agent Session](/docs/concepts/agent-sessions)：查看助手的对话与工作记录
- [设定层与装配骨架](/docs/concepts/composition-skeleton)：组织角色设定与预设
