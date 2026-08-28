---
layout: ../../../layouts/DocsLayout.astro
title: 本地数据边界
description: Loom Studio 的桌面应用数据以本地工作区为中心；当前官网只是完全独立的静态展示层。
---

## 桌面应用边界

Loom Studio 的当前实现围绕本地 Studio Server 与 Studio Client 运行。SQLite、Blob、Source Artifact、Media Asset 与系统凭证各自拥有明确的存储边界；Secret 明文不会写入普通 SQLite 业务表。

本地 Client 通过受控 RPC 与 Server 通信。公开网站不会复用这条会话，也不会尝试在浏览器中打开真实工作区。

## 官网边界

当前官网是纯静态 Astro 站点：

- 不部署公开 Studio Server；
- 不请求 Provider 凭证；
- 不读取本地文件或桌面应用数据；
- 不建立账号、Cookie 身份或分析平台；
- 产品展示使用静态资产与固定 UI 示意。

## 为什么暂时不做在线 Demo

真实 Studio Client 依赖 Server、RPC、Session 与本地资源。直接公开部署会立即引入临时账户、数据隔离、Provider 成本和安全边界，这些都不是一个首版发布页应该承担的复杂度。

如果未来确实需要 Web Demo，它应运行在独立 Origin、使用可重置沙盒数据，并与官网 Cookie、Storage 和真实用户工作区隔离。
