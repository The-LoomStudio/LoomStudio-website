# 已归档效果入口审查

日期：2026-09-22

状态：Open，待处理

## WEB-ENTRY-001：首页仍显示没有事件处理器的樱花按钮

优先级：P3

位置：`src/pages/index.astro:135`、`src/components/SiteFooter.astro:12-15`。

首页调用 `<SiteFooter easterEgg />`，因此 Footer 输出可聚焦的 button，
名称为“触发樱花彩蛋”，并声明 `aria-pressed="false"`。按钮不是占位图片，
样式还有 pointer 光标和 hover 效果，但自身没有点击处理器。

当前 `src` 中唯一为 `data-sakura-trigger` 绑定 click 的位置是
`src/components/SkyBackdrop.astro:317`。首页及其挂载组件没有导入该组件。
`docs/archive/home-atmosphere.md:5` 也明确说明 Home 不再挂载 SkyBackdrop。
因此沿当前源码挂载链，点击或键盘激活这个按钮不会启动所宣称的效果。

最小建议：保持效果已归档的决定，首页停止请求 Footer 的 easterEgg 分支，
使用其已有的普通标志图分支。不要为了消除这个死入口而恢复整套天空系统。
若普通分支的背景不符合首页设计，可独立处理外观，不把外观与启用效果绑定。

验证：已核对当前首页、Footer、效果组件的事件注册和归档说明，未运行浏览器。
这是静态挂载链证据，不是已测量的视觉或交互验收结果。

关闭条件：首页不再向键盘或辅助技术暴露无行为的彩蛋按钮；其他页面的 Footer
不受影响，归档效果不被意外重新挂载。
