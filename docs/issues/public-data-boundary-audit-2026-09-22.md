# 公开数据边界与能力说明审查

日期：2026-09-22  
状态：Open Issues，待修复  
范围：Website 本地数据边界、Trace 能力和扩展信任边界说明与当前 LoomStudio 公开契约的对应关系。

本轮确认 3 项 P2。只更新审查记录，不修改公开文案或产品行为；没有访问真实凭据、工作区内容或远程模型服务。

## WEB-DATA-001：本地存储被表述为数据绝不发送到云端

优先级：P2  
证据等级：当前文案、产品源码及注入 fetch 的隔离探针。

### 位置与事实

Website：

- `src/pages/docs/concepts/local-first.md:4`：description 写为“数据绝不上云”。
- `src/pages/docs/index.astro:13`：本地数据边界入口写为“数据绝不上传第三方服务器”。
- `src/pages/docs/concepts/local-first.md:11`：本地 RPC 和设备所有权说明没有交代远程 Provider 请求的例外边界。

产品仓库 `/Users/macbookair/Desktop/LoomStudio`：

- `packages/application-runtime/src/providers/gateway.ts:223`：`createOpenAICompatibleGateway` 接受 Provider 的远程 `baseUrl`，未指定时使用远程默认地址。
- 同文件 `:233` 起：将 `input.request.messages` 构造成 Provider payload，再传入 Gateway；真实运行默认使用 `fetch`。
- `docs/architecture/application/agent/provider-and-prompt-build.md`：明确 Provider Account、AI Gateway 及 Provider 请求消息契约。

### 用户影响

“工作区存储在本机”“官网不读取工作区”和“调用模型时内容不离开设备”是三个不同的承诺。当前页面将前两项扩展成第三项，但产品支持远程 Provider：进入模型输入的内容会进入该 Provider 的请求。

这会让用户在选择远程模型时误判内容去向。这里不是报告未经授权的外传漏洞，也不是要求禁止远程模型；问题在公开说明未准确表达已有能力的数据边界。

### 最小验证

探针直接导入产品当前 `createOpenAICompatibleGateway` 源码，设置虚构的 `https://example.test/v1/` Provider，使用完全替换网络的注入 fetch，传入两段虚构消息：

```json
{
  "remoteUrlPassedToInjectedFetch": "https://example.test/v1/chat/completions",
  "messageContents": ["fictional card description", "fictional story text"],
  "realNetworkRequests": 0
}
```

断言远程目标和消息内容进入注入 fetch，退出码为 0。测试未发送真实 HTTP 请求，未使用真实 API Key，也未运行完整 PromptBuild 或 Agent 执行器。这证明 Gateway 的出站请求契约，不代表已经验证某个远程服务的处理或保留政策。

### 反证与边界

- 当前 Website 是独立静态站，不读取桌面工作区；本项不否定这一边界。
- 本地数据库和资产存储不等于自动云同步，本项也不声称存在后台同步。
- 使用本地 Provider 与远程 Provider 的内容去向不同，不应统一承诺绝不上云。
- 不能据本探针推导整个工作区都会上传；实际发送范围由本轮请求消息及相关配置决定。
- 不讨论未经验证的密钥泄露、遥测或第三方服务合规性。

### 修复方向与关闭条件

公开说明应分别表达：本地持久化边界、官网与工作区隔离、模型调用时内容发送给用户选择的 Provider。避免“数据绝不上云”等覆盖所有配置的绝对承诺，同时不制造当前并不存在的云同步行为。

关闭时核对入口摘要、页面 description 和正文保持一致；用本地 Provider 与远程 Provider 两种配置解释数据去向。此项修复应是文案与契约对齐，不需要为了让承诺成立而修改产品网络能力。

## WEB-DATA-002：Trace 页面把尚未具备的逐步解释能力写成现状

优先级：P2  
证据等级：正式集成文档与当前输出构造代码的静态核对；未执行 Agent 或浏览器 Inspector。

### 位置与事实

Website `src/pages/docs/concepts/trace-and-audit.md` 的“装配流水线的每一步都有记录”段落称每次提示词编译都会提供 Activation、Ordering、Token 预算动态裁剪链路，并称检查器可以查看每个片段的确切 Token 消耗。

产品仓库 `/Users/macbookair/Desktop/LoomStudio` 的当前事实：

- `docs/architecture/application/prompt-build/loom-core/studio-integration.md` 区分 Application DFS 编译与 Kernel `loom.run` 的 Core Pipeline；前者没有执行文案暗示的逐 Pass 管道。
- `packages/application-runtime/src/agents/agent-turn.ts:82` 调用 Application 编译器，`:91` 起构造最小 Trace，包含计数、关联字段及空 diagnostics/ executions。
- `packages/application-runtime/src/prompt/prompt-build-pipeline.ts:11` 的 Trace 类型没有每个片段 Token 消耗或裁剪记录字段；当前编译入口接收贡献、节点、骨架和激活输入，没有 Token 预算输入。
- 集成文档明确指出：上述摘要不是完整 Core Trace 压缩，不能从中获得逐 Pass Mutation 或 Replay。`default-preset.md` 也明确当前 Narrative 窗口不是 Token 驱动预算。

这里只核对对外输出合同；没有对正在开发的 Agent 执行语义进行新增审计或修改。工作区包含并行改动，后续修正文案前应重新核对该构造处。

### 用户影响与边界

用户按公开说明查找“哪一段因 Token 超限被裁掉”或“每段的精确 Token 消耗”，可能发现当前检查器没有相应事实。这会把尚未实现的可观测性能力误当成已经可用的排障依据。

现有激活求值、消息编译和摘要不是不存在；Core 也有自己的 Trace 能力。问题是不能把另一路径或计划中的能力直接归给每次实际 PromptBuild。

本轮没有运行 Tokenizer、真实 Provider 请求或浏览器 Inspector；上述差异由正式文档和当前输出构造直接支持，不声称已经复现某种裁剪错误。

### 修复方向与关闭条件

按当前实现分别说明已有的消息投影、关联信息和计数摘要，以及尚待实现的逐步诊断、预算解释和重放。设计目标可以保留，但必须标明目标状态；不能为保持宣传文案而扩大本次审查为重建 PromptBuild。

关闭时公开文案所称可查看的每个字段都能映射到当前真实输出与展示入口；未实现项明确标注。跨 Store 提交事实与各领域恢复能力也应继续分开说明，不把 Changeset 简化成任意操作均可回滚的保证。

## WEB-DATA-003：扩展授权与资源管理被描述为强隔离保证

优先级：P2  
证据等级：公开文案、正式 Extension 架构和当前加载/资源登记代码的静态核对。

### 位置与事实

Website `src/pages/docs/concepts/extension-system.md`：

- 声明式 Manifest 段称“未经声明的操作在运行时将无法执行”；
- Instance 说明称停用或热重载后“所有事件监听与资源占用”被确定性回收，并“根绝内存泄漏与幽灵监听”；
- 结尾称可以杜绝全局状态污染与未知冲突。

产品仓库 `/Users/macbookair/Desktop/LoomStudio`：

- `docs/architecture/extensions/README.md:35` 明确 Server Module 与宿主同进程，capability 是 Host/API 与产品授权边界，不是强安全沙箱；
- 同文档结尾明确受信任 Node.js 扩展可以直接调用文件系统、网络和进程 API，不可信代码的强隔离尚未提供；
- `packages/extension-sdk/extension-host/src/instance.ts:51` 使用当前进程的动态 import 加载模块；
- `instance.ts` 通过 scope.track 登记 Host API 创建的注册句柄及扩展显式提交的 onDispose，不提供任意 Node.js 副作用的自动枚举与撤销。

### 用户影响与边界

用户可能误以为批准少量 Manifest capability 后就能安全运行不可信 Server 插件，或认为停用插件必然撤销其所有副作用。当前系统并不提供这项保证。

这不是本轮发现了权限绕过或沙箱逃逸，而是公开说明没有传达已经明确的可信代码边界。Host API 内的权限检查仍有价值，Module/Instance 生命周期管理也不是不存在；它们不能替代进程隔离，也不能自动回收未登记的全部外部资源。

本轮未安装或运行任何扩展，没有访问系统资源或构造攻击载荷。既有扩展生命周期审查中的清理缺陷不在此重复登记为实现漏洞；这里只跟踪 Website 的说明问题。

### 修复方向与关闭条件

明确说明 Server 扩展当前必须受信任；Manifest grant 约束 Host 提供的能力接口，不是限制任意 Node.js 代码的系统级沙箱。资源回收承诺应限定为 Host 托管或扩展正确登记的资源，并去除“根绝”“所有副作用必然清除”等绝对保证。

关闭时安装前能从公开说明理解信任要求，Server 与 Client 的边界分别准确描述，生命周期托管范围与实际 API 一致。无需为了保持原文承诺而在本次审查中建设新的进程沙箱。

## 本轮排除项

DocsLayout 没有显式 popstate 监听，但仅凭这一点不足以认定浏览器前进后退失效；原生滚动恢复可能触发既有阅读状态更新。未获取真实历史恢复证据，不将其登记成缺陷，也不与已有 BFCache 监听清理问题混为一项。

## 2026-09-22 补查：下载页发布状态反证

核对 `src/pages/download.astro` 及导航入口：页面明确标注 macOS、Windows、Linux 状态待确认，正式安装包尚未生成，下载尚未开放，并只提供源代码入口；没有发现把未发布构建写成可下载版本的说明问题。本项不新增 Issue，也不把静态页面内容当作平台兼容性验收。
