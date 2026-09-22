# 图片放大组件

Status: implemented，待实际素材接入后的浏览器验收。

来源：`loom_studio_flat_diverse_edition.html` 的 lightbox 开关逻辑。
范围：新增 `src/components/illustration/ZoomImage.tsx` 与 `zoom-image.css`，
不挂载首页，不引入库。

以原图比例展示缩略图，记录起止矩形，通过 translate / scale 和 CSS transition
完成 FLIP 展开、回缩。使用原生 dialog 的模态焦点管理、Esc、背景点击关闭，
关闭后返回触发按钮。支持动画中关闭与减少动态效果；卸载清理关闭计时器。

与原附件的区别：不移植 `transition: all` 的尺寸动画，不支持缩略图 cover 裁切
向完整图片展开，不含画廊切换和下拉关闭手势。组件用于独立静态图片，
不直接放大双层视差组件。

```astro
---
import ZoomImage from '../components/illustration/ZoomImage';
---
<ZoomImage client:visible src="/illustrations/example.webp" alt="插图内容说明" caption="可选说明" />
```

验证：Website 类型检查。尚未执行浏览器动画、焦点与移动设备验收。
