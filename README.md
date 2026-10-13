<div align="center">

<img src="public/images/nom/stickers/fullbody/welcome.png" alt="挥手欢迎的 Nom" width="128" />

# Loom Studio Website

Loom Studio 的独立产品官网与公开文档站。首版使用 Astro 静态生成，发布页、Markdown 文档和站点资产全部由本仓库维护。

</div>

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

开放审查记录：[客户端生命周期与导航审查（2026-09-22）](docs/issues/client-lifecycle-and-navigation-audit-2026-09-22.md)。

公开说明核对：[数据边界与能力说明审查（2026-09-22）](docs/issues/public-data-boundary-audit-2026-09-22.md)。

构建性能审查：[Website 构建性能审查（2026-09-22）](docs/issues/build-performance-audit-2026-09-22.md)。

~~~bash
corepack pnpm check
corepack pnpm build
corepack pnpm preview
~~~

## 当前边界

- 发布页 `/#system` 提供工作区分栏与 Agent 对话的真实 React 组件草稿。完整界面截图待补充；来源、适配与更新方式见 [组件说明](src/components/studio-demo/README.md)。

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

## Nom 贴纸

Nom 是 Loom Studio 的看板娘。网站、项目 README 和社区内容共用这套透明贴纸：全身、带手与道具的大头、纯头表情各 8 张，图片按动作和情绪命名。

- [浏览素材与用途](public/images/nom/stickers/README.md)
- 下载仓库后打开 [离线预览](public/images/nom/stickers/preview.html)，可切换深浅背景、试配气泡。
- README 直接用 `<img>` 指定展示宽度；对白保留为普通文字，标题与贴纸分别成行。跨仓库引用使用本仓库固定提交的原始图片链接。

## 官方扩展展示

- `/marketplace`：官方扩展目录。
- `/marketplace/st-data-bridge`：ST Data Bridge 介绍、现有角色卡素材与四类资源迁移示意。
- `/marketplace/the-world`：The World 介绍、可切换时间的模拟天空，以及页尾“回家路上”场景 / 地点示例。示例可切换下班、回家、晚饭后三个片段，并同步背景天色。

市场目录采用 News 同系的纸卡、便签和贴纸样式；共用 `global.css` 中的 `--loom-site-note-*` 颜色与字体变量。ST 与 The World 使用各自源仓库的正式图标，来源记录见 `public/brand/README.md`。

扩展页面复用 `ExtensionLayout.astro` 与网站主题；功能示例均为网页样例，不连接 Studio Server 或执行导入。说明依据产品仓库的 `extensions/st-data-compat`、`extensions/the-world` 当前实现核准，安装来源链接取自官方扩展配置；页面不承诺远端构建包已可安装。

模拟天空只在 The World 详情页显式挂载。它响应演示时间与暂停按钮，不修改网站主题；系统减少动态效果、后台标签页和离开展示区时停止动态。恢复记录见 [天空效果归档与恢复](docs/archive/home-atmosphere.md)。

## 网站全局搜索

顶栏放大镜或 `⌘K / Ctrl+K` 打开居中搜索框。范围分为页面、文档、架构、新闻；也可输入 `in:文档`、`in:architecture` 等前缀。无关键词且不限范围时展示常用页面，限定范围后直接浏览该范围内容；输入关键词后搜索正文并显示摘要。搜索条件在当前标签页会话中保留。

使用 Pagefind 在 Astro 构建结束后生成静态全文索引，不连接 Studio Server，不读取本地工作区，不向外部搜索服务发送关键词。新闻按稳定卡片锚点索引；客户端架构地图显式索引模块、概念与操作路径，命中后打开对应详情。Markdown 文档支持章节定位。生产查询按需加载索引和结果，支持键盘选择、分页、错误重试与减少动态效果。

- 实现：`src/integrations/site-search.ts`（构建 / 开发服务）、`src/components/SiteSearch.astro`（界面）、`src/scripts/site-search.ts`（浏览器交互）。
- 页面入口数据由 `src/lib/site-routes.ts` 与 SiteHeader 共享。
- **首次开发或更新内容后先执行 `pnpm build`**。`pnpm dev` 通过中间件读取 `dist/pagefind/` 中最近一次索引；不自动随源码热更新重建搜索索引。`pnpm preview` 可验证完整生产搜索。
- 新增新闻卡片必须有稳定的 `news-` 前缀 ID 和标题；架构索引复用地图的数据源，避免维护另一份摘要。

本次通过 Astro 类型检查、生产构建，以及真实 Pagefind 索引的范围浏览、中文两字词、新闻和架构定位查询；视觉与交互手感仍由用户验收。
