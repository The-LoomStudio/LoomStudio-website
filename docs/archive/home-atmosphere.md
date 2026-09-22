# Home 天空系统归档

归档日期：2026-09-16。状态：停用，保留源码与资源，尚未接入插画。

Home 不再挂载 SkyBackdrop，也不再从剧情模拟发送故事时间事件。
剧情内的时钟与流式输出保持独立。页面背景使用现有主题底色。

保留原路径以免破坏内部引用：

- `src/components/SkyBackdrop.astro`：天空色、星空、真实时间及故事时间监听、樱花入口。
- `src/scripts/cloud-field.ts`：云场。
- `src/scripts/sakura.js`：樱花效果。
- `public/images/cloud.png`：云纹理。

恢复时需显式挂载 SkyBackdrop，在需要天空的区块标记
`data-sky-intro` / `data-sky-final`，并恢复下述剧情联动。
`minutes: null` 表示回到真实时间。

```tsx
useEffect(() => {
  const root = rootRef.current!
  const publish = (visible: boolean) => window.dispatchEvent(new CustomEvent('loom:story-time', {
    detail: { minutes: visible ? minutes : null },
  }))
  const observer = new IntersectionObserver(([entry]) => publish(entry.isIntersecting), { threshold: 0 })
  observer.observe(root)
  return () => { observer.disconnect(); publish(false) }
}, [minutes])
```

归档不代表动画已验收：历史反馈中的颜色跳变、中断后反向过渡仍需在再次启用前验证。
