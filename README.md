# Loom Studio Website

Loom Studio 的独立产品官网与公开文档站。首版使用 Astro 静态生成，发布页、Markdown 文档和站点资产全部由本仓库维护。

## 本地运行

环境与产品仓库保持一致：Node.js 22.18.0、pnpm 9.15.0。

~~~bash
corepack pnpm install
corepack pnpm dev
~~~

默认访问：

- 发布页：http://localhost:4321/
- 文档页：http://localhost:4321/docs

## 检查

~~~bash
corepack pnpm check
corepack pnpm build
corepack pnpm preview
~~~

## 当前边界

- 纯静态站点，不连接 Studio Server、不读取本地工作区、不调用 Provider。
- 公开文档由本仓库单独维护，不自动同步产品仓库中的 Workbench 或 Archive。
- src/styles/global.css 是网站自己的银灰色视觉 Token，不 import 产品仓库样式。
- Cloudflare Pages 部署暂缓，待本地版本确认后再配置。

## 目录

~~~text
src/
  components/   站点级组件
  layouts/      发布页与文档页布局
  pages/        静态路由与 Markdown 文档
  styles/       网站独立视觉 Token
public/
  brand/        Logo 等品牌资产
  images/       Hero 与文档插图
~~~
