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

Nom 是 Loom Studio 的看板娘。网站、项目 README 和社区内容共用这套透明贴纸：全身 8 张、胸像表情与动作 25 张，共 33 张（旧纯头素材已移除），图片按动作和情绪命名。

- [浏览素材与用途](public/images/nom/stickers/README.md)
- 官网 `/stickers` 已接入全站导航和发布页入口，可分类浏览、切换预览背景、试搭气泡，并下载整套 512px 透明 PNG ZIP 或单张原图。
- 素材清单：`src/data/nom-stickers.json`；更新后运行 `pnpm stickers:pack` 重建下载包（维护时需 Python 3），并提交 ZIP。
- README 直接用 `<img>` 指定展示宽度；对白保留为普通文字，标题与贴纸分别成行。跨仓库引用使用本仓库固定提交的原始图片链接。

## 官方扩展展示

- `/marketplace`：官方扩展目录。
- `/marketplace/st-data-bridge`：ST Data Bridge 介绍、现有角色卡素材与四类资源迁移示意。
- `/marketplace/the-world`：The World 介绍、可切换时间的模拟天空，以及页尾“回家路上”场景 / 地点示例。示例可切换下班、回家、晚饭后三个片段，并同步背景天色。

市场目录采用 News 同系的纸卡、便签和贴纸样式；共用 `global.css` 中的 `--loom-site-note-*` 颜色与字体变量。ST 与 The World 使用各自源仓库的正式图标，来源记录见 `public/brand/README.md`。

扩展页面复用 `ExtensionLayout.astro` 与网站主题；功能示例均为网页样例，不连接 Studio Server 或执行导入。说明依据产品仓库的 `extensions/st-data-compat`、`extensions/the-world` 当前实现核准，安装来源链接取自官方扩展配置；页面不承诺远端构建包已可安装。

模拟天空只在 The World 详情页显式挂载。它响应演示时间与暂停按钮，不修改网站主题；系统减少动态效果、后台标签页和离开展示区时停止动态。恢复记录见 [天空效果归档与恢复](docs/archive/home-atmosphere.md)。

## 局部动画

页面导航继续使用浏览器跨文档 View Transitions。主题切换使用同文档 View Transitions，从主题按钮中心做圆形扩散；不支持 API 或系统减少动态效果时即时切换。

Motion 当前覆盖 Banner、叠放卡片、图片放大、Agent 浮层、表情包分类与气泡换边重排、设备切换、架构视图指示器与侧栏、全站搜索，以及文档目录 / 新闻 / 工作区演示的原生折叠块。新闻分类使用按行排列的响应式 Grid，卡片由 Motion FLIP 过渡到新位置。简单颜色、阴影反馈和循环跑马灯仍使用 CSS。

下载页使用 `src/components/download/DownloadConsole.tsx`，提供首次安装 / 日常启动 / 更新源码页签、系统提示、逐步说明与真实剪贴板反馈。四种语言共用 `download-copy.ts` 中的命令清单；复制只写入剪贴板，不执行安装或模拟安装进度。没有 JavaScript 时，首次安装和更新命令仍可手动复制。

`src/scripts/site-motion.ts` 只处理页面显式标注的 `data-motion-reveal`（分组进场）、`data-motion-feedback`（鼠标 / 键盘 / 按压反馈）和 `data-motion-drift`（滚动层次），并驱动阅读进度和发布页章节定位反馈。发布页、展厅、文档入口、市场、扩展详情和贴纸页面已接入；不要把这些标记加到已有视差、React 布局重排或图片缩放正在控制的节点上。减少动态效果时关闭进场位移、手势回弹和漂移，保留阅读进度与章节信息。

图片放大由 Motion 驱动 FLIP 进度。关闭时逐帧测量缩略图的位置，因此双行跑马灯可以继续滚动；循环换位后，回缩目标取同一行中最靠近视口中心的同图副本。原生 `dialog` 继续负责模态、Escape 与焦点恢复。

`src/components/motion/SiteMotion.tsx` 为每个需要动画的 React island 提供 `MotionConfig` 和 `LazyMotion`，组件从 `motion/react-m` 导入 `m`。默认使用 `domAnimation`，需要布局动画的 island 显式传入 `domMax`；Astro 组件通过 Motion 的原生 DOM API 控制动画，无需转成 React。不要让 CSS transition、手写逐帧更新和 Motion 同时控制同一元素的同一属性；静态定位与动态变换可以分别使用 CSS `translate` 和 Motion 的旋转 / 缩放。

保留现有 `client:load` / `client:visible` 挂载策略，不为简单动画增加 React island。减少动态效果时禁用位移过渡，Banner 即时切换并停止自动轮播；新动画应继续遵守这一设置。

## 网站全局搜索

顶栏放大镜或 `⌘K / Ctrl+K` 打开居中搜索框。范围分为页面、文档、架构、新闻；也可输入 `in:文档`、`in:architecture` 等前缀。无关键词且不限范围时展示常用页面，限定范围后直接浏览该范围内容；输入关键词后搜索正文并显示摘要。搜索条件在当前标签页会话中保留。

使用 Pagefind 在 Astro 构建结束后生成静态全文索引，不连接 Studio Server，不读取本地工作区，不向外部搜索服务发送关键词。新闻按稳定卡片锚点索引；客户端架构地图显式索引模块、概念与操作路径，命中后打开对应详情。Markdown 文档支持章节定位。生产查询按需加载索引和结果，支持键盘选择、分页、错误重试与减少动态效果。

- 实现：`src/integrations/site-search.ts`（构建 / 开发服务）、`src/components/SiteSearch.astro`（界面）、`src/scripts/site-search.ts`（浏览器交互）。
- 页面入口数据由 `src/lib/site-routes.ts` 与 SiteHeader 共享。
- **首次开发或更新内容后先执行 `pnpm build`**。`pnpm dev` 通过中间件读取 `dist/pagefind/` 中最近一次索引；不自动随源码热更新重建搜索索引。`pnpm preview` 可验证完整生产搜索。
- 新增新闻卡片必须有稳定的 `news-` 前缀 ID 和标题；架构索引复用地图的数据源，避免维护另一份摘要。

本次通过 Astro 类型检查、生产构建，以及真实 Pagefind 索引的范围浏览、中文两字词、新闻和架构定位查询；视觉与交互手感仍由用户验收。
