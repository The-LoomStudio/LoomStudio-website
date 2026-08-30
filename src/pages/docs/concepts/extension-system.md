---
layout: ../../../layouts/DocsLayout.astro
title: 插件与扩展体系
description: Package、Module 与 Instance 三层身份，让能力贡献、UI 渲染与生命周期保持清晰可控。
---

## 三层身份模型

Loom Studio 不采用传统的“单个脚本即插件”模式，而是将扩展明确拆解为三层生命周期：

~~~text
Extension Package
  安装、分发、版本与持久数据归属
  ↓
Extension Module
  Server / Client 运行时、入口、启用状态与能力授权
  ↓
Extension Instance
  单次激活、RPC / Event 注册与生命周期上下文
~~~

- **Package（包）**：创作者分享和分发的内容单元。一个 Package 可以只包含提示词预设与素材资产，也可以同时携带服务端或客户端可执行模块。
- **Module（模块）**：运行时的边界。Server Module 在后端提供平台 RPC 与工具响应；Client Module 在前端注册自定义面板与界面挂载点。
- **Instance（实例）**：实际运行时的激活句柄。当模块重新加载或禁用时，对应的 Instance 及其所有临时注册项会被确定性释放，避免内存泄漏与幽灵监听。

## Server 与 Client 解耦

服务端与客户端有完全不同的运行环境与安全模型：

- **Server Host**：管理后台模块的生命周期、事件订阅与持久存储。Server 模块与内核同进程运行，负责数据交互与模型工具对接。
- **Client Renderer Host**：管理前端渲染模块。通过标准化的 Surface 协议，插件可以安全地向工作区主面板、消息节点或自定义视图贡献交互卡片。

## 声明式 Manifest

扩展通过 `manifest.json` 声明其意图、依赖以及所需的能力授权（如事件订阅权限、存储配额或工具注册）。

未声明的权限在运行时不会被授予；多个扩展之间的冲突通过显式的优先级与仲裁规则解决，杜绝隐式竞争与非预期副作用。

## 为什么这样设计

传统的扩展机制往往让插件无限制地挂钩全局状态，导致版本升级时脆弱不堪。三层解耦让扩展成为**可预测、可审计、即插即用**的安全构件。
