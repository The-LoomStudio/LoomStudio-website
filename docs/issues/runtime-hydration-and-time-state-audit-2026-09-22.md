# Website 运行时首屏与 Hydration 审查

日期：2026-09-22  
状态：Open Issues，待修复  
范围：发布页 `StoryDemo` 的 SSR/客户端首次渲染一致性；不涉及 Studio Demo 内部业务状态。

## WEB-RUNTIME-001：剧情演示的时间状态在构建时和访问时使用了两个不同的时钟

优先级：P2  
证据等级：源码调用链 + 固定时刻探针；尚未进行真实浏览器控制台复现。

位置：

- `src/components/story-demo/StoryDemo.tsx:27-38`
- `src/components/ProductPreview.astro:7`

`StoryDemo` 通过 `client:load` 进行 SSR 后立即 Hydrate，但组件在 render 阶段执行：

```ts
const now = new Date()
const initialMinutes = now.getHours() * 60 + now.getMinutes()
const [minutes, setMinutes] = useState(initialMinutes)
```

静态构建时，Astro 生成的 HTML 会使用构建机的当前分钟；用户打开页面时，React Hydration 又会使用访问机的当前分钟。两者跨分钟时，服务端输出的时钟文本与客户端首次 render 不一致，React 会产生 hydration mismatch，并在 Hydration 后改写显示值。

固定时刻探针将构建时设为 `09:00`、访问时设为 `10:15`，结果为：

```json
{
  "buildMinutes": 540,
  "visitorMinutes": 615,
  "initialMarkupMatches": false
}
```

这还会把 `timeRef` 初始化为访问时刻，而页面中服务端已经显示的是构建时刻；用户可能看到时钟在首次加载时跳变，且静态构建缓存越久，首屏文本越不可信。

### 风险边界

- 这是一个真实的 SSR 与 Hydration 输入不一致，不依赖用户点击或网络失败；
- 只有跨分钟访问才会显现，恰好同一分钟构建和访问时不会触发；
- 当前探针没有运行真实浏览器，因此尚未把 React 控制台 warning、实际闪烁时长和不同 Astro 适配器行为描述为已确认事实。

### 最小方向与关闭条件

- 不要在 SSR 和客户端首次 render 中分别读取当前时间；将时间作为稳定的客户端初始化状态，或让服务端和客户端共享同一个显式初始值；
- 需要显示访问时刻时，应在 Hydration 后通过 `useEffect` 更新，而不是改变首个客户端 render 的值；
- 在构建时刻和访问时刻跨分钟的浏览器检查中，首个 Hydration 输出不再出现 mismatch，时钟更新只发生在明确的客户端阶段。
