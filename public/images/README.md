# Website 图片素材索引

本目录保存网站展示素材。诺姆（Loom 娘）是看板娘；角色卡展示目录不限定人物，可以继续加入其他角色。

## 分类

```text
images/
├── cards/              角色卡展示图，不限定角色
└── nom/
    ├── banners/        诺姆横幅候选图
    ├── illustrations/  诺姆独立插画
    ├── expressions/    诺姆表情与贴纸
    └── layers/         诺姆分层画面及部件
```

`cloud.png` 是旧天空效果素材，不属于本次编号。

## 编号与使用

- 使用分类前缀与三位递增编号；编号只用于定位，不代表品质、展示顺序或正式角色设定。
- 后续图片沿用各分类最大编号加一，不因插入、排序或删除重新编号。分类或用途未确定时，先确认再分配编号。
- 表中的链接指向实际文件；原始文件名用于追溯生成稿。画面描述由读图整理，只描述可见内容，不补造角色身份或剧情。
- `cards/` 是封面图片，不是可导入应用的角色卡数据包。
- 横幅目录是候选集合，不代表已经适合任意比例裁切。接入页面时仍需检查主体位置、文字留白和移动端裁切。
- 页面图片的 `alt` 应按实际语境编写，不直接照搬索引描述；纯装饰图片使用空 `alt`。

## 体积与原件

2026-09-22 已将 `cards/card-001.png` 至 `card-018.png` 生成
`cards/display/` 下的 `376×524` 网页展示副本，并删除公开目录中的高分辨率原图。
展示副本按页面 `188×262` 卡片的 2x 尺寸生成，保留卡片显示比例；这一步是展示尺寸缩小，不属于无损处理。

当前原图不宜直接全部用作网页展示版本。接入页面时，应按实际展示尺寸生成 WebP 等派生文件，并保留原图；卡片缩略图与全屏大图应分别控制尺寸。透明分层素材需要保留透明通道。

2026-09-22 对最大文件 `nom-banner-017.png` 做过内存转码试算：11.64 MiB PNG 转为无损 WebP 后仍有 7.84 MiB，未写入文件。仅换格式不足以解决所有体积问题，展示版本需要结合实际尺寸决定；本轮没有确定有损压缩质量。

`public/` 中的素材属于公开静态资源，不是私有原稿库。未被页面引用不等于不会进入发布产物，也不代表浏览器会一次性下载全部素材。正式发布前应将不准备公开的原件移出 `public/`，不要在这里存放私密内容。

## 重复与分层

角色卡前六张与独立插画前六张逐一完全相同（SHA-256 一致）。暂时保留两个用途下的副本，不擅自删除；后续页面可以复用同一文件。

分层部件暂按独立编号保留。文件名中的“人物”“背景”“全图”仅是原始命名，不能单凭相同数字断言它们能直接叠合；配套与对齐限制见对应描述。

## 图片索引

尺寸为原始像素，体积单位为 MiB（1 MiB = 1,048,576 字节）。

本批共 47 张 PNG，合计 156.19 MiB。

### nom/banners

| 文件 | 画面描述与使用提示 | 尺寸 | MiB | 原始位置 |
| --- | --- | --- | --- | --- |
| [nom-banner-001.png](nom/banners/nom-banner-001.png) | 夜色湖畔与远山上空带有星光和流光，诺姆（Loom娘）坐在岸边，整体为蓝色静谧氛围；适合夜景或安静主题横幅。 | 1216 x 832 | 1.25 | `nom/banners/21-04-43-2999403846.png` |
| [nom-banner-002.png](nom/banners/nom-banner-002.png) | 室内暖光中，诺姆（Loom娘）侧躺在沙发上手持书本，画面柔和慵懒；适合休息、阅读或生活感横幅。 | 1216 x 832 | 1.28 | `nom/banners/21-10-37-3747315015.png` |
| [nom-banner-003.png](nom/banners/nom-banner-003.png) | 明亮画室里，诺姆（Loom娘）在画架前作画，周围有雕像、画布和颜料；适合创作、工作台或艺术主题横幅。 | 2736 x 1872 | 7.03 | `nom/banners/64550214871754_SeedVR2_00001_.png` |
| [nom-banner-004.png](nom/banners/nom-banner-004.png) | 暖色图书室中，诺姆（Loom娘）伏在桌边托腮，身后是整面书架；适合阅读、知识或安静氛围横幅。 | 1536 x 1024 | 3.15 | `nom/banners/66jks976.png` |
| [nom-banner-005.png](nom/banners/nom-banner-005.png) | 高处窗边可见大片城市景观，诺姆（Loom娘）手持书本望向窗外；适合城市、远眺或探索主题横幅。 | 2736 x 1872 | 7.20 | `nom/banners/932639767929948_SeedVR2_00001_.png` |
| [nom-banner-006.png](nom/banners/nom-banner-006.png) | 夜晚篝火旁，诺姆（Loom娘）与另一位棕发人物坐在一起，周围是树林和火光；适合陪伴、露营或夜间主题横幅。 | 1216 x 832 | 2.18 | `nom/banners/IMG_2862.png` |
| [nom-banner-007.png](nom/banners/nom-banner-007.png) | 拱窗和书架构成的室内场景中，诺姆（Loom娘）举着一本深色古典书本，旁边可见小动物轮廓；适合书籍、档案或神秘感横幅。 | 2432 x 1664 | 5.88 | `nom/banners/TMIC_00003_.png` |
| [nom-banner-008.png](nom/banners/nom-banner-008.png) | 雨天城市街道上，诺姆（Loom娘）撑着透明雨伞，背景有车流和灯光；适合雨景、城市或通勤主题横幅。 | 1536 x 1024 | 2.87 | `nom/banners/hdn6nh7j.png` |
| [nom-banner-009.png](nom/banners/nom-banner-009.png) | 明亮海湾码头上，诺姆（Loom娘）与另一位棕发人物共同查看书本或地图，远处有帆船和山城；适合旅行、海岸或双人主题横幅。 | 1216 x 832 | 1.90 | `nom/banners/image (1) 2.png` |
| [nom-banner-010.png](nom/banners/nom-banner-010.png) | 蓝天海岸旁的木栈桥上，诺姆（Loom娘）坐在长椅上阅读，身后是海面和飞鸟；适合海滨、阅读或清爽主题横幅。 | 1680 x 944 | 2.20 | `nom/banners/image (1).png` |
| [nom-banner-011.png](nom/banners/nom-banner-011.png) | 平面设计构图中，诺姆（Loom娘）手持打开的书本，背景有明显的 Loom Studio 字样和海岸照片拼贴；适合品牌首页或标题横幅。 | 1472 x 768 | 1.78 | `nom/banners/image (3).png` |
| [nom-banner-012.png](nom/banners/nom-banner-012.png) | 高处石墙上，诺姆（Loom娘）与另一位棕发人物并肩站立，身后是云海、山城和远景；适合旅行、户外或开阔感横幅。 | 1216 x 832 | 1.85 | `nom/banners/image (4).png` |
| [nom-banner-013.png](nom/banners/nom-banner-013.png) | 雨窗边的咖啡馆内，诺姆（Loom娘）与另一位棕发人物在桌边阅读或交谈，桌上有杯子；适合咖啡馆、陪伴或雨天横幅。 | 1216 x 832 | 1.61 | `nom/banners/image (6).png` |
| [nom-banner-014.png](nom/banners/nom-banner-014.png) | 高大的图书馆中，诺姆（Loom娘）坐在桌边阅读，另一位人物站在旁边，四周有书架和灯光；适合图书馆、研究或协作主题横幅。 | 3120 x 2080 | 10.87 | `nom/banners/view (4) 2.png` |
| [nom-banner-015.png](nom/banners/nom-banner-015.png) | 黑白排版背景上有醒目的 LOOM STUDIO 大字，诺姆（Loom娘）居中持书；适合品牌标题、封面或宣传横幅。 | 3120 x 2080 | 8.80 | `nom/banners/view (4).png` |
| [nom-banner-016.png](nom/banners/nom-banner-016.png) | 夜间列车车厢内，诺姆（Loom娘）与另一位人物面对面坐着，窗外是深色风景和灯光；适合旅途、对话或叙事氛围横幅。 | 3120 x 2080 | 11.00 | `nom/banners/view (5) 2.png` |
| [nom-banner-017.png](nom/banners/nom-banner-017.png) | 温室植物间，诺姆（Loom娘）背着包并手持书本，周围是大片热带叶片；适合自然、植物或探索主题横幅。 | 3120 x 2080 | 11.64 | `nom/banners/view (5).png` |
| [nom-banner-018.png](nom/banners/nom-banner-018.png) | 城市高处的围栏旁，诺姆（Loom娘）背着包望向夕阳下的城市，天空呈粉紫色；适合城市、黄昏或远眺主题横幅。 | 3120 x 2080 | 10.81 | `nom/banners/view (6).png` |
| [nom-banner-019.png](nom/banners/nom-banner-019.png) | 铁路票据与纸张构成的拼贴画面中，诺姆（Loom娘）从列车和票据构图间探出身来，带有旅行文字元素；适合旅行、档案或拼贴风横幅。 | 1536 x 1024 | 2.93 | `nom/banners/view (7).png` |
| [nom-banner-020.png](nom/banners/nom-banner-020.png) | 昏暗而温暖的餐吧内，诺姆（Loom娘）坐在桌边，桌上有饮品和玻璃器皿；适合夜间、酒吧或沉静氛围横幅。 | 3120 x 2080 | 10.75 | `nom/banners/view 2.png` |
| [nom-banner-021.png](nom/banners/nom-banner-021.png) | 高处山崖或建筑边缘，诺姆（Loom娘）与另一位人物俯瞰远方城市和城堡般的景观；适合冒险、远行或史诗感横幅。 | 3120 x 2080 | 11.50 | `nom/banners/view 3.png` |
| [nom-banner-022.png](nom/banners/nom-banner-022.png) | 明亮蓝天和白云覆盖海岸与城市景观，诺姆（Loom娘）在画面上方轻盈跃起；适合天空、自由或轻快主题横幅。 | 2072 x 1384 | 3.60 | `nom/banners/view.png` |

### 横幅构图索引

`textSide` 是建议叠加网页文案的一侧；`none` 表示画面已经很满、已有品牌字样，或不建议再叠字。`focus` 是主体视觉重心。以下判断来自缩略图复核，最终的移动端裁切仍需浏览器验收。

| 文件 | 重心 | 文案侧 | 建议位置 | 构图与裁切提示 |
| --- | --- | --- | --- | --- |
| `nom-banner-001.png` | 右 | 左 | 顶部 | 左侧夜空留白；移动端保留右侧主体。 |
| `nom-banner-002.png` | 右 | 左 | 顶部 | 左侧有室内空间；建议偏右取景。 |
| `nom-banner-003.png` | 中 | 不叠字 | 底部 | 画面密集，人物和画室居中。 |
| `nom-banner-004.png` | 中 | 不叠字 | 顶部 | 书架与人物填满背景，留白不足。 |
| `nom-banner-005.png` | 右 | 左 | 顶部 | 左侧城市与天空适合文字；移动端偏右。 |
| `nom-banner-006.png` | 中 | 左 | 顶部 | 左侧可放短文案，保留中右双人和篝火。 |
| `nom-banner-007.png` | 中 | 不叠字 | 底部 | 书本和人物居中，环境细节密集。 |
| `nom-banner-008.png` | 中 | 左 | 顶部 | 左侧车流较空；人物与伞需保留。 |
| `nom-banner-009.png` | 右 | 左 | 顶部 | 左侧海湾留白；移动端偏右。 |
| `nom-banner-010.png` | 左 | 右 | 顶部 | 右侧海面天空留白；移动端偏左。 |
| `nom-banner-011.png` | 中 | 不叠字 | 顶部 | 已含 Loom Studio 品牌字样，不再覆盖文字。 |
| `nom-banner-012.png` | 中 | 不叠字 | 顶部 | 双人和景物居中，留白不足。 |
| `nom-banner-013.png` | 中 | 左 | 顶部 | 左侧雨窗可放短文案，主体保留中右。 |
| `nom-banner-014.png` | 中 | 不叠字 | 底部 | 图书馆细节密集，不适合叠字。 |
| `nom-banner-015.png` | 中 | 不叠字 | 顶部 | LOOM STUDIO 字样本身是构图主体。 |
| `nom-banner-016.png` | 中 | 不叠字 | 顶部 | 列车场景密集，保持中部构图。 |
| `nom-banner-017.png` | 中 | 不叠字 | 顶部 | 植物包围人物，没有干净留白。 |
| `nom-banner-018.png` | 右 | 左 | 顶部 | 左侧城市与天空适合文字；移动端偏右。 |
| `nom-banner-019.png` | 左 | 不叠字 | 底部 | 拼贴中已有票据文字，不再叠字。 |
| `nom-banner-020.png` | 左 | 右 | 顶部 | 右侧可放短文案；移动端偏左。 |
| `nom-banner-021.png` | 左 | 右 | 顶部 | 右侧远景可放短文案；移动端偏左。 |
| `nom-banner-022.png` | 右 | 左 | 顶部 | 左侧天空海岸留白；人物位于右上，需偏右偏上。 |

### 分层构图建议

- `nom-layer-002.png` 是双人前景层，适合与 `nom-layer-004.png` 背景纹理组合；透明边界尚未做像素级确认。
- `nom-layer-004.png` 是背景纹理层，适合承载滚动视差与设备/鼠标视差，不建议直接在纹理上叠文字。
- 分层视差和整页滚动视差是两套效果：前者只移动背景与前景层，后者移动整个 Banner 相对实色内容层的位置。

### nom/layers

| 文件 | 画面描述与使用提示 | 尺寸 | MiB | 原始位置 |
| --- | --- | --- | --- | --- |
| [nom-layer-001.png](nom/layers/nom-layer-001.png) | 以诺姆（Loom娘）持书立绘为主体，周围可见少量照片卡片样式元素；适合作为前景人物层，具体透明边界需以实际资产为准。 | 1472 x 768 | 0.99 | `nom/banners/分离/人物1.png` |
| [nom-layer-002.png](nom/layers/nom-layer-002.png) | 以诺姆（Loom娘）和另一位棕发人物的双人立绘为主体，周围带有旅行照片样式元素；适合作为双人前景层，具体透明边界需以实际资产为准。 | 1560 x 1040 | 2.36 | `nom/banners/分离/人物2.png` |
| [nom-layer-003.png](nom/layers/nom-layer-003.png) | 诺姆（Loom娘）持书站在 Loom Studio 标志和海岸照片构图前，属于人物、文字与背景合成的完整画面；适合作为品牌构图参考或整图使用。 | 1472 x 768 | 1.82 | `nom/banners/分离/全图1.png` |
| [nom-layer-004.png](nom/layers/nom-layer-004.png) | 米白色纸张或岩面纹理与青蓝色海水构成的抽象背景，带有斜向深色边界；适合作为纹理或海岸风背景层，具体材质含义不确定。 | 1536 x 1024 | 2.99 | `nom/banners/分离/背景2.png` |

### cards

| 文件 | 画面描述与使用提示 | 尺寸 | MiB | 原始位置 |
| --- | --- | --- | --- | --- |
| [card-001.png](cards/card-001.png) | 蓝色夜景室内，诺姆（Loom娘）坐着阅读，旁边有小桌和杯子；适合安静、阅读或夜间卡片。 | 832 x 1216 | 1.26 | `nom/cards/20-39-14-2918749313.png` |
| [card-002.png](cards/card-002.png) | 柔和粉色花树和户外景色前，诺姆（Loom娘）坐着捧读书本；适合春日、阅读或温柔氛围卡片。 | 832 x 1216 | 1.31 | `nom/cards/20-43-29-4220210961.png` |
| [card-003.png](cards/card-003.png) | 花树和水岸旁，诺姆（Loom娘）坐在长椅上手持书本或笔记本；适合写作、阅读或春日户外卡片。 | 832 x 1216 | 1.28 | `nom/cards/20-44-10-3524559832.png` |
| [card-004.png](cards/card-004.png) | 绿色树影和明亮散景中，诺姆（Loom娘）站立并抱着书本；适合自然、清新或角色卡片。 | 832 x 1216 | 1.28 | `nom/cards/20-45-12-3788122057.png` |
| [card-005.png](cards/card-005.png) | 蓝色雨景中，诺姆（Loom娘）蹲在浅水边撑伞，旁边有黑色小动物轮廓；适合雨天、观察或安静叙事卡片。 | 832 x 1216 | 1.29 | `nom/cards/20-46-46-4230397869.png` |
| [card-006.png](cards/card-006.png) | 阳光穿过绿色背景，诺姆（Loom娘）抱着书本并抬手靠近脸侧；适合自然光、角色展示或温暖主题卡片。 | 832 x 1216 | 1.31 | `nom/cards/20-50-04-4046424041.png` |
| [card-007.png](cards/card-007.png) | 竖幅角色卡面，画面主体居中，适合角色展示或叙事卡片。 | 832 x 1216 | 1.69 | `cards/image (4).png` |
| [card-008.png](cards/card-008.png) | 高分辨率竖幅角色卡面，适合大尺寸展示；接入网页前建议生成展示尺寸派生图。 | 1616 x 2880 | 7.18 | `cards/495DAC774066F286445F475317404F13.png` |
| [card-009.png](cards/card-009.png) | 高分辨率竖幅角色卡面，适合大尺寸展示；接入网页前建议生成展示尺寸派生图。 | 2160 x 2880 | 9.13 | `cards/ED36EF93FC6914D58D581630CE5C7FF0.png` |
| [card-010.png](cards/card-010.png) | 竖幅角色卡面，适合加入滚动画廊与散乱堆叠展示。 | 832 x 1216 | 1.90 | `cards/NAI_260722_001210.png` |
| [card-011.png](cards/card-011.png) | 略偏方形的竖向角色卡面，适合卡片展示；需注意与标准卡比例混排时的裁切。 | 896 x 1152 | 1.32 | `cards/anima_00019_.png` |

### nom/illustrations

| 文件 | 画面描述与使用提示 | 尺寸 | MiB | 原始位置 |
| --- | --- | --- | --- | --- |
| [nom-illustration-001.png](nom/illustrations/nom-illustration-001.png) | 蓝色夜景室内，诺姆（Loom娘）坐着阅读，旁边有小桌和杯子；适合安静、阅读或夜间卡片。 | 832 x 1216 | 1.26 | `nom/illustrations/20-39-14-2918749313.png` |
| [nom-illustration-002.png](nom/illustrations/nom-illustration-002.png) | 柔和粉色花树和户外景色前，诺姆（Loom娘）坐着捧读书本；适合春日、阅读或温柔氛围卡片。 | 832 x 1216 | 1.31 | `nom/illustrations/20-43-29-4220210961.png` |
| [nom-illustration-003.png](nom/illustrations/nom-illustration-003.png) | 花树和水岸旁，诺姆（Loom娘）坐在长椅上手持书本或笔记本；适合写作、阅读或春日户外卡片。 | 832 x 1216 | 1.28 | `nom/illustrations/20-44-10-3524559832.png` |
| [nom-illustration-004.png](nom/illustrations/nom-illustration-004.png) | 绿色树影和明亮散景中，诺姆（Loom娘）站立并抱着书本；适合自然、清新或角色卡片。 | 832 x 1216 | 1.28 | `nom/illustrations/20-45-12-3788122057.png` |
| [nom-illustration-005.png](nom/illustrations/nom-illustration-005.png) | 蓝色雨景中，诺姆（Loom娘）蹲在浅水边撑伞，旁边有黑色小动物轮廓；适合雨天、观察或安静叙事卡片。 | 832 x 1216 | 1.29 | `nom/illustrations/20-46-46-4230397869.png` |
| [nom-illustration-006.png](nom/illustrations/nom-illustration-006.png) | 阳光穿过绿色背景，诺姆（Loom娘）抱着书本并抬手靠近脸侧；适合自然光、角色展示或温暖主题卡片。 | 832 x 1216 | 1.31 | `nom/illustrations/20-50-04-4046424041.png` |
| [nom-illustration-007.png](nom/illustrations/nom-illustration-007.png) | 图书馆书架前的竖幅人物画面，诺姆（Loom娘）站立并抱着书本；适合角色插画、书籍主题或竖版展示。 | 832 x 1216 | 1.52 | `nom/illustrations/93c674b7-8a6c-44c6-964d-9675939f24a4_strip.png` |
| [nom-illustration-008.png](nom/illustrations/nom-illustration-008.png) | 扁平海岸构图中，诺姆（Loom娘）与另一位棕发人物并肩站立，背景有色块、海面和书本元素；适合海滨主题海报或插画。 | 832 x 1216 | 1.43 | `nom/illustrations/image (5).png` |

### nom/expressions

| 文件 | 画面描述与使用提示 | 尺寸 | MiB | 原始位置 |
| --- | --- | --- | --- | --- |
| [nom-expression-001.png](nom/expressions/nom-expression-001.png) | 可爱简化画风的诺姆（Loom娘）抱着书本，周围有金色闪光；适合表达开心、期待或被夸奖的反应。 | 1024 x 1024 | 0.85 | `nom/表情包/20-53-44-89411200.png` |
| [nom-expression-002.png](nom/expressions/nom-expression-002.png) | 可爱简化画风的诺姆（Loom娘）张开双臂，背景有明亮的黄色爆发形状；适合表达惊喜、欢迎或兴奋。 | 1024 x 1024 | 1.19 | `nom/表情包/20-54-35-3288194442.png` |
| [nom-expression-003.png](nom/expressions/nom-expression-003.png) | 诺姆（Loom娘）的大幅可爱脸部特写，双颊泛红，表情温和；适合表达害羞、亲近或卖萌。 | 1024 x 1024 | 0.97 | `nom/表情包/20-56-12-1722280906.png` |
| [nom-expression-004.png](nom/expressions/nom-expression-004.png) | 诺姆（Loom娘）抬起食指，旁边气泡写有 objection!；适合表达反驳、纠正或提出异议。 | 1024 x 1024 | 1.18 | `nom/表情包/21-00-28-4090126585.png` |
| [nom-expression-005.png](nom/expressions/nom-expression-005.png) | 诺姆（Loom娘）双手举起，前方有 ABSOLUTE CINEMA 大字；适合表达强烈称赞、精彩或戏剧性反应。 | 1024 x 1024 | 1.26 | `nom/表情包/21-01-39-2605432027.png` |
| [nom-expression-006.png](nom/expressions/nom-expression-006.png) | 粉色背景前，诺姆（Loom娘）面带微笑并比出剪刀手；适合表达轻松、胜利或拍照反应。 | 1024 x 1024 | 1.06 | `nom/表情包/21-02-44-4224267973.png` |
| [nom-expression-007.png](nom/expressions/nom-expression-007.png) | 诺姆（Loom娘）举起一件带动物脸图案的灰色头套或玩偶遮在头顶，画面为竖向贴纸构图；适合表达俏皮、装扮或遮脸反应。 | 832 x 1216 | 1.03 | `nom/表情包/image (7).png` |
