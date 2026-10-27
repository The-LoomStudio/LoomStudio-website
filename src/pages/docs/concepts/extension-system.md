---
layout: ../../../layouts/DocsLayout.astro
title: 插件与扩展体系
description: Package、Module 与 Instance 的生命周期，以及 Host API 授权与可信服务端代码的边界
---

## 三层生命周期模型

Loom Studio 不采用“单个脚本即插件”的简陋模式，而是将扩展拆解为三层清晰的生命周期：

~~~text
Extension Package
  安装分发、版本管理与持久数据归属
  ↓
Extension Module
  运行环境、代码入口、启用状态与能力授权
  ↓
Extension Instance
  一次激活及 Host 管理的注册资源生命周期
~~~

- **Package（扩展包）**：分发与分享的最小单元，一个包可以纯粹包含角色卡设定、世界书与提示词模板，也可以同时携带服务端或前端可执行模块
- **Module（功能模块）**：运行时的边界划分，后端模块提供数据工具与扩展能力，前端模块负责界面挂载与交互组件
- **Instance（运行实例）**：一次模块激活及其 Host 注册资源。停用或重载时 Host 会撤销并清理受管注册；扩展自行创建的定时器、网络和文件副作用不保证可撤回。

## 服务端与前端隔离

服务端与客户端拥有完全不同的环境与安全边界：

- **Server Host**：在服务进程中管理 Server Module 生命周期和受管能力；模块是受信任的同进程代码，不是安全沙箱。
- **Client Host**：独立管理客户端 Module、Renderer 与命令贡献；特定隔离 Renderer 使用沙箱 iframe，但这不代表所有客户端模块都处于同一种隔离环境。

## 声明式 Manifest

`manifest.json` 声明 Package、Module、runtime、贡献与请求能力。Host 对通过其 API 注册和调用的能力校验声明与授权；这不是阻止受信任同进程代码直接使用 Node API 的沙箱。

安装预览会核对依赖身份、版本、来源与循环，并在安装缺失依赖前要求确认；不会静默挑选同 ID 来源。Package 声明、资源导入、能力授权、Module 启用和某轮实际采用是不同步骤，不能据此保证扩展之间绝无冲突。
