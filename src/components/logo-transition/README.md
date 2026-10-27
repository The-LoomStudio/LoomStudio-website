# Logo 轮廓与转场实验

开发预览：`/dev/preview/logo-transition`。路由仅在 `astro.config.mjs` 的 `command === 'dev'` 分支注册；预览自身不进入生产路由。正式开场通过 `PageArrival.astro` / `PageArrivalScene.tsx` 使用文字版；Menu 通过 `menu-transition.tsx` 使用描边版，两者共享 SVG 揭幕。

- `loom-mark.json`：从 `public/brand/loom-logo.png` 的灰色区域提取的三个轮廓，坐标为 1254 × 1254。保留中心孔和不规则原始曲线，不包含白色贴纸。
- `LoomMark.tsx`：共享路径与灰阶渐变。
- `LogoTransition.tsx`：由 `progress`（0–1）驱动的可复用遮罩；`children` 是后景。支持减少动态效果。先描绘填色，仅从最中心圆孔透出后景，再放大穿过中央孔；其余圆环间隙由主题底色遮实。Menu 与首次加载共享此行为。
- `LogoTransitionStudy.tsx`：仅预览使用的播放、暂停、进度拖动和 PNG 叠合对照。
- `public/brand/loom-mark.svg`：同一几何数据导出的独立 SVG。后续改几何或填色时须同步导出。

重建工具为本机已有的 ImageMagick、Potrace 1.16 和项目 Sharp，未新增依赖。原图在白底上去除 alpha，再以灰度 85% 阈值提取；Potrace `--opttolerance 0.15 --turdsize 100` 去掉小噪点。填色以原图内部像素拟合：外环和中心环线性渐变，中间主体径向渐变。没有嵌入 PNG，也没有把白色伪装成透明。

轮廓回渲染与阈值灰色区域的二值交并比约 99.50%，不是像素完全一致；原图纹理被简化为灰色渐变。已检查 Astro 类型（0 errors，0 warnings，26 hints）、开发入口 HTTP 200，以及 1200 × 750 / 390 × 487.5 结束帧遮罩完全透出。生产排除通过开发条件的源码检查确认，未运行全站构建。主观形状、填色和动效节奏待人工预览验收。

## 正式开场

首次访问对白逐字流入约 1.8 秒，随后汇聚为文字 Logo 并融合 SVG 约 0.9 秒，完整标志停留约 0.3 秒，与首屏可见图片解码并行；准备完成后揭幕约 1.2 秒。等待期间轻微呼吸，图片失败或 12 秒超时不会阻塞访问。结束后在 sessionStorage 写入 `loom-site-arrival-seen`，本标签页后续访问跳过；站内导航继续沿用原有 route-transition。减少动态效果使用 0.22 秒淡出。加载时暂时禁用背景交互，结束或离开页面时恢复。

首次/已看过/站内跳转/存储禁用分支通过定向检查。随后包含文本转场预览的 Astro check 为 0 errors / 0 warnings（24 hints）；真实浏览器开场节奏仍待人工确认。

## Menu 描边转场

打开 Menu 使用约 1.2 秒的描边 → SVG → 镂空揭幕；关闭恢复 680ms 拉帘，不重复首次加载的多语对白。独立顶层 dialog 覆盖原 Menu；进入结束后归还焦点到菜单关闭按钮；关闭拉帘完成后归还原菜单触发按钮。动画期间忽略重复请求，Esc 可直接结束，减少动态效果时直接切换。页面隐藏时清理转场。普通跨页链接的导航行为保持原样。

本次 Astro check 为 0 errors / 0 warnings（24 hints），首页 SSR 返回 200；未进行真实浏览器的层级、焦点与动效验收。
