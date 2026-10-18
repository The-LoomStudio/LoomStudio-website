# Nom 网站与社区贴纸 · 第一辑

当前选图集为 33 张透明 PNG：全身 8 张、胸像 25 张。旧纯头 8 张已移除，文字制作记录保留。官网 [`/stickers`](/stickers) 提供分类浏览、浅色 / 深色 / 棋盘背景及左右独立气泡试搭；支持整套 512px 透明 PNG 下载和单张原图下载。

第一辑制作记录保留在原 JSON 中。2026-10-15 将纯头情绪重绘为胸像，并新增 8 种活泼表情；本次记录见 `generation-chest-2026-10-15.json`。实际网页尺寸下的观感由使用场景验收。

制作记录：[完整提示词](generation-prompts.json)、[生成来源](generation-results.json)、[文件与透明通道检查](verification.json)。

## 素材约定

- **全身 `fullbody`**：用于欢迎、引导、页脚与较宽的场景区域。
- **胸像表情与动作 `bust`**：用于帮助提示、操作反馈、推荐内容与社区互动。
- 保留透明 PNG 原件；图片里不烙入对白，网站文案使用可编辑的 DOM 气泡。
- 第一辑图生图分别以 `fullbody/holding-book.png`、`bust/proud.png` 为固定基准（当时的纯头基准 `heads/smile.png` 已随旧素材移除），沿用已认可的精致 Q 版造型。本辑是网站与社区用的表情、动作扩展，不构成正式人设补充。
- 本次胸像统一以 `bust/thinking.png` 为身份、画风与构图基准：大头、短小肩胸与手臂，底部收在胸前，不延伸到腰或裙装。用户提供的旧表情集仅参考情绪动作；少量金星、汗滴、问号、爱心与睡眠符号按情绪使用。
- 用作装饰的图片设置 `alt=""`；若图像传递独立含义，提供准确的替代文字或相邻等价文本。

## 文件命名

直接按构图目录与动作、情绪命名，例如 `fullbody/welcome.png`、`bust/thinking.png`、`bust/sleepy.png`。网站直接引用图片路径；展示清单由 `src/data/nom-stickers.json` 维护，官网图库和下载包使用同一清单。制作记录仅供追溯，不作为网站配置。

## 网站接入

已接入发布页、News、下载页、扩展市场及详情页、展示页、文档侧栏和架构地图。发布页使用阅读、工作与思考动作对应功能介绍；News 采用便签旁的小贴纸；架构地图在既有讲解侧栏里展示胸像和提示动作。

Astro 页面使用 [`NomSticker.astro`](../../../../src/components/NomSticker.astro)，直接填写语义文件路径；`size` 支持 `small`、`medium`、`large`，`message` 提供可选对白，`side="right"` 把人物放在气泡右侧。

```astro
<NomSticker src="/images/nom/stickers/bust/tip.png" size="small" message="这里有个小提示。" />
```

组件复用 [`siteImage()`](../../../../src/lib/site-images.ts)，构建时按展示尺寸生成 quality 90 的 WebP 与响应式 `srcset`，图片懒加载；React 架构地图由 Astro 页面生成并传入相同的图片结果。PNG 原件保留供社区使用。对白是独立 DOM 文字，可选中、可翻译；纯装饰图片为空 `alt`，不接收指针事件。桌面及移动端的视觉位置仍需人工验收。

## 素材索引

### 全身

图生图基准：[`fullbody/holding-book.png`](fullbody/holding-book.png)。

| 原件 | 名称 | 建议用途 |
| --- | --- | --- |
| [`fullbody/holding-book.png`](fullbody/holding-book.png) | 抱书陪伴 | 首页介绍、侧栏陪伴、品牌落款 |
| [`fullbody/welcome.png`](fullbody/welcome.png) | 挥手欢迎 | 首页欢迎、新手入口、社区招呼 |
| [`fullbody/guide-left.png`](fullbody/guide-left.png) | 向左引导 | 右侧角色与左侧气泡、下载入口、功能介绍 |
| [`fullbody/guide-right.png`](fullbody/guide-right.png) | 向右引导 | 左侧角色与右侧气泡、文档入口、下一步指引 |
| [`fullbody/reading.png`](fullbody/reading.png) | 翻书阅读 | 文档、教程、知识说明 |
| [`fullbody/celebrating.png`](fullbody/celebrating.png) | 举手庆祝 | 更新发布、里程碑、完成提示 |
| [`fullbody/working.png`](fullbody/working.png) | 电脑前忙碌 | 处理中、维护说明、开发手记 |
| [`fullbody/resting.png`](fullbody/resting.png) | 抱书休息 | 页脚、晚安、等待状态 |

### 胸像表情与动作

图生图基准：[`bust/proud.png`](bust/proud.png)。

| 原件 | 名称 | 建议用途 |
| --- | --- | --- |
| [`bust/proud.png`](bust/proud.png) | 抱书得意 | 推荐内容、创作展示、成果分享 |
| [`bust/tip.png`](bust/tip.png) | 举指提示 | 教程提示、注意事项、帮助气泡 |
| [`bust/thinking.png`](bust/thinking.png) | 托腮思考 | 搜索引导、常见问题、选择建议 |
| [`bust/thumbs-up.png`](bust/thumbs-up.png) | 竖拇指认可 | 操作成功、安装完成、社区认可 |
| [`bust/sorry.png`](bust/sorry.png) | 合掌抱歉 | 错误说明、暂不可用、反馈回应 |
| [`bust/surprised.png`](bust/surprised.png) | 捂嘴惊喜 | 新功能、发现内容、意外收获 |
| [`bust/thank-you.png`](bust/thank-you.png) | 比心感谢 | 贡献者、反馈感谢、社区互动 |
| [`bust/gift.png`](bust/gift.png) | 递出礼物 | 下载、扩展推荐、活动赠礼 |

### 新增胸像情绪

原纯头情绪的胸像版本：`smile`（满足微笑）、`laugh`（开心大笑）、`confused`（困惑疑问）、`sad`（委屈难过）、`panic`（慌张冒汗）、`determined`（认真加油）、`sleepy`（困困打盹）、`wink`（俏皮眨眼）。均位于 `bust/`。

新增活泼表情：`giggle`（捂嘴偷笑）、`tsundere`（傲娇别扭）、`sleeping`（抱枕睡觉）、`angry`（气鼓鼓）、`crying`（放声大哭）、`hopeful`（闪亮期待）、`love`（心动喜欢）、`pudding`（满足吃布丁）。均位于 `bust/`；对白继续通过 DOM 气泡添加。

旧 `heads/` PNG 已于 2026-10-18 移除；第一辑 JSON 作为历史制作记录保留，其中旧路径不再代表当前文件。

补充：`bust/tea.png`（淡定喝茶），保持同款胸像，双手捧白瓷茶杯，不添加特效符号。

## 整套下载

`public/downloads/nom-stickers-512.zip` 包含清单中的 33 张 512px 透明 PNG，按 `fullbody/` 与 `bust/` 分类，并附中文文件索引。原尺寸 PNG 继续由官网提供单张下载。

更新素材或清单后，在仓库运行 `pnpm stickers:pack` 并提交生成的 ZIP。维护脚本使用项目现有 Sharp 和 Python 3 标准库，不在访问页面时打包；普通构建直接复制已生成的包，无需 Python。
