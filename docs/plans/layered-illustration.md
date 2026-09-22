# 双层特殊插图

Status: implemented，待提供正式插图后进行视觉验收。

目标：移植 Odysseia 的双层视差，作为 Website 后续插图组件；不挂载到 Home，不恢复天空系统，不新增依赖。

来源：`/Users/macbookair/Odysseia-Forum-webpage/src/pages/AuthPage/AuthSceneBackground.tsx`、
`src/shared/hooks/useSettledParallax.ts` 和 `useDeviceOrientationParallax.ts`。

决策与文件边界：新增 `src/components/illustration/`，复用两个 React hooks，
将 Tailwind 表达改为普通 CSS。保留阻尼 0.05、收敛阈值 0.001、后台暂停、
鼠标离开归中和移动设备方向输入。未复制随机选图、登录行为或轮播功能。
iOS 首次指针操作可能请求方向权限，拒绝时保持静态。

桌面后景位移 6/6px、缩放 1.05；前景 12/10px、缩放 1.02。
移动后景 3/3px、缩放 1.03；前景 6/5px、缩放 3.5、水平 -40%。
移动构图沿用原图参数，换图时通过 `--illustration-mobile-scale` 和
`--illustration-mobile-offset` 调整。坐标改为组件区域，适配非全屏插图；
服务端渲染不读取 window。尊重减少动态效果设置。

接入示例：

```astro
---
import LayeredIllustration from '../components/illustration/LayeredIllustration';
---
<div style="height: 560px">
  <LayeredIllustration client:visible background="/illustrations/back.webp"
    foreground="/illustrations/front.webp" label="人物站在远处的群岛前" />
</div>
```

前景需透明，前后两图需共享构图。资源路径为示例，尚未复制人物素材。
完成标准：组件可编译，保留原参数和生命周期清理，不改变当前首页。
验证预算：Website 类型检查；不新增测试框架。尚未做浏览器与传感器实机验收。
