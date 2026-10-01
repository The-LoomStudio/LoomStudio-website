export type Source = { path: string; line: number };
export type RegionId = 'client' | 'server' | 'runtime' | 'storage' | 'extensions' | 'external';
export type MapItem = {
  id: string;
  region: RegionId;
  title: string;
  kind: string;
  summary: string;
  detail: string;
  boundary: string;
  source: Source;
};
export type Connection = {
  id: string;
  source: string;
  target: string;
  label: string;
  kind: 'call' | 'write' | 'read' | 'return';
};
export type Journey = {
  id: string;
  title: string;
  summary: string;
  boundary: string;
  steps: { edge: string; title: string; detail: string }[];
};

export const snapshot = {
  date: '2026-10-01',
  baseline: 'efc45a4fe140686459e46f48da3de7c32672c5b0',
  note: '本地工作区核对，含未提交改动。公开源码仅为基线参考，可能与当前实现不同。',
};

export const regions: { id: RegionId; title: string; subtitle: string; x: number; y: number; width: number; height: number }[] = [
  { id: 'client', title: 'Studio Client', subtitle: '界面、选择与调用入口', x: 0, y: 0, width: 760, height: 600 },
  { id: 'server', title: 'Studio Server', subtitle: '本地服务 · 传输与组合根', x: 1040, y: 0, width: 760, height: 600 },
  { id: 'runtime', title: 'Application Runtime', subtitle: '领域流程 · Prompt 与 Agent', x: 2080, y: 0, width: 760, height: 1120 },
  { id: 'external', title: '外部 Provider', subtitle: '所选模型服务 · 外部网络边界', x: 2080, y: 1620, width: 760, height: 320 },
  { id: 'extensions', title: 'Extension', subtitle: '安装身份 · 授权 · 能力贡献', x: 1400, y: 840, width: 340, height: 600 },
  { id: 'storage', title: '本地权威数据', subtitle: 'SQLite 保存结构化状态，Blob 保存字节', x: 0, y: 840, width: 1180, height: 600 },
];

export const items: MapItem[] = [
  {
    id: 'file', region: 'client', title: '文件入口', kind: 'CLIENT',
    summary: '媒体与角色包走不同的 HTTP 入口。',
    detail: '媒体使用 POST /assets；Loom 角色包使用 /cards/import/loomcard 或 /cards/import/png。文件字节不通过 JSON-RPC base64 传送。',
    boundary: '导入角色不等于开始游玩，也不会在这一步自动创建 Agent Session。',
    source: { path: 'apps/studio-server/src/http/http-server.ts', line: 128 },
  },
  {
    id: 'play', region: 'client', title: '剧情工作区', kind: 'CLIENT',
    summary: '选择 Card，创建 Timeline，提交用户正文。',
    detail: '创建 Timeline 调用 narratives.create。发送正文时先 appendInput，再确保 Agent Session，最后以已提交 inputNodeId 创建 Run。',
    boundary: '界面状态不是权威存储；创建 Timeline 后会重置当前 Session 选择，不代表删除历史 Session。',
    source: { path: 'apps/studio-client/src/features/narrative-runtime/model/use-narrative-runtime.ts', line: 350 },
  },
  {
    id: 'api', region: 'client', title: 'Typed API / Bridge', kind: 'TRANSPORT',
    summary: '业务类型映射与 HTTP JSON-RPC 传输分离。',
    detail: 'studio-api 定义具体业务调用；client-bridge 封装 fetch、RPC ID 和错误映射。浏览器 401 时可进行一次应用会话刷新。',
    boundary: '会话刷新不是业务重试、提交幂等或防丢失保证。',
    source: { path: 'apps/studio-client/src/shared/api/studio-api.ts', line: 739 },
  },
  {
    id: 'extension-ui', region: 'client', title: '扩展管理', kind: 'CLIENT',
    summary: '显式安装、导入资源、启用模块与授权。',
    detail: '用户操作进入 extensions API。安装目标区分全局与 Card；模块启用和资源导入并非同一动作。',
    boundary: '界面列出包不意味着它的模块正在运行。',
    source: { path: 'apps/studio-client/src/shared/api/studio-api.ts', line: 386 },
  },
  {
    id: 'http', region: 'server', title: 'HTTP / 应用会话', kind: 'BOUNDARY',
    summary: '校验应用会话与 Origin，接收原始字节。',
    detail: 'POST /auth/session 建立应用会话；其余受保护入口验证会话。文件路由负责将字节交给媒体存储或角色包解析器。',
    boundary: '这不是账户注册、订阅付款或访客通行证系统。',
    source: { path: 'apps/studio-server/src/http/http-server.ts', line: 86 },
  },
  {
    id: 'codec', region: 'server', title: 'Card Bundle Codec', kind: 'IMPORT',
    summary: '校验并解析 ZIP / PNG 角色包。',
    detail: '识别 Loom PNG 载荷并解码 ZIP。没有 Loom 载荷的 PNG 才进入启用的第三方转换入口；损坏的 Loom 包直接失败。',
    boundary: '路径、CRC、引用和解压预算在领域导入前校验。CRC 不是来源认证。',
    source: { path: 'apps/studio-server/src/main.ts', line: 648 },
  },
  {
    id: 'router', region: 'server', title: 'Studio RPC Router', kind: 'ROUTING',
    summary: '将 application.* 与平台 RPC 分派给所有者。',
    detail: 'Server 组装 Runtime 和 Kernel。Application 负责 AIRP 语义；Kernel 负责平台 RPC、服务与事件，二者不互相伪装。',
    boundary: 'Kernel 不选择模型，不定义 Card / Session，也不执行领域 PromptBuild。',
    source: { path: 'apps/studio-server/src/rpc/studio-rpc-router.ts', line: 1 },
  },
  {
    id: 'kernel', region: 'server', title: 'Kernel / 事件', kind: 'PLATFORM',
    summary: 'RPC 注册、提交事实、诊断与平台服务。',
    detail: '共享 Data Engine 的提交事实可投影为 data.changed；平台事件不携带完整正文。Server 是持久化服务的组合根。',
    boundary: '进程内事件不是持久消息队列，也不承诺重启补发。',
    source: { path: 'packages/kernel/src/index.ts', line: 1 },
  },
  {
    id: 'card-import', region: 'runtime', title: '导入 Card / 资源', kind: 'DOMAIN',
    summary: '创建 Card、Prompt Resources 和绑定。',
    detail: '角色包解析结果进入 importCardBundle。资源、脚本与文本规则复用领域导入事务；媒体由 Server 在调用前创建。',
    boundary: '创建新 Card 不是覆盖原 Card，也不自动执行包内代码。',
    source: { path: 'packages/application-runtime/src/cards/workspace.ts', line: 130 },
  },
  {
    id: 'timeline-create', region: 'runtime', title: '创建 Timeline', kind: 'DOMAIN',
    summary: '物化初始 State、Branch 与 Opening。',
    detail: '以 Card 当前声明生成初始状态和 Opening，并在共享 SQLite 事务中创建 State 与 Narrative。运行依赖与动态文本引用具有不同生命周期。',
    boundary: '创建 Timeline 不自动复制整套资源，也不创建 Agent Session。',
    source: { path: 'packages/application-runtime/src/runtime/narrative-runtime.ts', line: 415 },
  },
  {
    id: 'narrative-input', region: 'runtime', title: '提交用户正文', kind: 'DOMAIN',
    summary: '先保存 Narrative Input，再交给 Session。',
    detail: 'appendNarrativeInput 使用目标 Branch、节点身份与预期 Head 追加用户正文。Client 将提交后的节点 ID 作为 Run 输入身份。',
    boundary: '后续 Session 投递失败不会回滚已经提交的用户节点。',
    source: { path: 'packages/application-runtime/src/runtime/narrative-runtime.ts', line: 221 },
  },
  {
    id: 'tools', region: 'runtime', title: '受控 Tool 执行', kind: 'CAPABILITY',
    summary: '执行 Invocation，记录 Result，再进入 Replay。',
    detail: 'Runtime 根据 Tool Mount、能力和授权执行工具。Narrative 正文只能通过授权写入工具提交；结果与错误返回到 Agent 工作记录。',
    boundary: '模型最终回复不会自动追加到剧情正文。工具成功提交也不因后续 Run 失败撤销。',
    source: { path: 'packages/application-runtime/src/agents/tool-loop.ts', line: 1 },
  },
  {
    id: 'session', region: 'runtime', title: 'Agent Session', kind: 'WORK',
    summary: '持久化工作身份，引用 Preset 与可选 Timeline。',
    detail: 'Session Header 保存 agentPresetId 和可选 timelineId。Transcript 保存 message、reasoning、Invocation、Result、Observation 与 Run 状态。',
    boundary: 'Session 与 Timeline 关联但不互相拥有。可无 Timeline 创建 Session。',
    source: { path: 'packages/application-runtime/src/runtime/agents-runtime.ts', line: 180 },
  },
  {
    id: 'prompt', region: 'runtime', title: 'PromptBuild', kind: 'COMPOSITION',
    summary: '组合 Preset、Settings、历史与 Tool 描述。',
    detail: '采集来源、求值 Activation、展开宏并按 Anchor / Slot 编排。Content Tools 参与正文构建；Native Tools 以独立 tools 数组交给 Gateway。',
    boundary: 'enabled 是作者配置，active 是本轮求值。构建不会改写原始资源。',
    source: { path: 'packages/application-runtime/src/agents/agent-turn.ts', line: 52 },
  },
  {
    id: 'loop', region: 'runtime', title: 'Agent Run / Loop', kind: 'EXECUTION',
    summary: 'Provider Step → Tool → Result → 下一步。',
    detail: 'Loop 记录实际 Provider Observation 并决定完成、失败或继续。Invocation 的存在决定是否执行 Tool，不仅依赖 Provider Stop Reason。',
    boundary: '持久化执行记录不等于 Server 重启后能自动恢复未完成 Run。',
    source: { path: 'packages/application-runtime/src/agents/tool-loop.ts', line: 333 },
  },
  {
    id: 'gateway', region: 'runtime', title: 'AI Gateway', kind: 'ADAPTER',
    summary: '解析 Model 绑定、凭据与 Provider Adapter。',
    detail: 'Preset 引用 Provider Profile / Model。Gateway 使用已授权 Secret 和 Adapter 发出请求，将流事件与结果映射回应用合同。',
    boundary: 'API Key 不保存在 Preset 正文中；模型调用会将实际构建的上下文送往所选 Provider。',
    source: { path: 'packages/ai-gateway/src/gateway.ts', line: 1 },
  },
  {
    id: 'provider', region: 'external', title: '模型服务', kind: 'EXTERNAL',
    summary: '接收 messages / tools，返回流、用量与调用。',
    detail: '通过官方 Adapter 对接 OpenAI、Anthropic、Google 或 compatible Provider。Provider 返回事实由 Gateway 归一化。',
    boundary: '外部 Provider 不拥有本地 Timeline，也不直接执行 Studio Tool。',
    source: { path: 'packages/ai-gateway/src/provider-registry.ts', line: 1 },
  },
  {
    id: 'manager', region: 'extensions', title: '安装 / 模块管理', kind: 'LIFECYCLE',
    summary: '验证包，记录安装目标与模块授权。',
    detail: '安装、发现、导入声明式资源与启用模块是不同操作。enableModule 验证授权并以安装目标启动对应模块。',
    boundary: '全局安装与 Card 安装身份分开；安装不等于本轮实际消费。',
    source: { path: 'apps/studio-server/src/extensions/extension-manager.ts', line: 478 },
  },
  {
    id: 'host', region: 'extensions', title: 'Extension Host', kind: 'CAPABILITY',
    summary: '以真实安装身份提供 RPC、资产和其他能力。',
    detail: 'Host 向模块提供受控 ctx。扩展可贡献工具、资源与渲染能力；注册后仍需匹配本轮的挂载和使用条件。',
    boundary: 'ctx 不是 ApplicationRuntimeContext，也不是任意本地文件或全局数据访问权。',
    source: { path: 'packages/extension-sdk/extension-host/src/index.ts', line: 1 },
  },
  {
    id: 'blobs', region: 'storage', title: 'Blob / Media Asset', kind: 'BYTES',
    summary: '本地 SHA-256 字节与稳定 assetId。',
    detail: 'Blob 通过 staging、hash 和 finalize 保存原始字节；Media Asset 在 SQLite 保存可查询 metadata。多个业务记录可以引用同一 Blob。',
    boundary: '删除业务引用不会自动物理删除 Blob；目前不做完整物理 GC。',
    source: { path: 'packages/blob-store/src/index.ts', line: 1 },
  },
  {
    id: 'resources', region: 'storage', title: 'Card / Prompt Resource', kind: 'SQLITE',
    summary: '作者配置、正文树与资源绑定的权威状态。',
    detail: 'Card、Preset、Settings 与关联记录进入结构化存储。后续编辑修改 canonical state，PromptBuild 不读取导入的原始 Blob 作为当前正文。',
    boundary: '导出的文件与 ZIP 是分发投影，不是第二套运行数据库。',
    source: { path: 'packages/application-runtime/src/cards/workspace.ts', line: 138 },
  },
  {
    id: 'narratives', region: 'storage', title: 'Narrative / State', kind: 'SQLITE',
    summary: '故事节点、Branch Head 与结构化 Revision。',
    detail: 'Narrative 保存故事权威树；State 保存可校验的结构化快照与版本。分支通过 Head 引用节点及对应 State Revision。',
    boundary: '不是 Provider message array，也不是 Agent Transcript。',
    source: { path: 'packages/application-runtime/src/runtime/narrative-runtime.ts', line: 426 },
  },
  {
    id: 'transcript', region: 'storage', title: 'Agent Transcript', kind: 'SQLITE',
    summary: '追加式工作记录与分阶段持久化的 Run。',
    detail: '记录用户和 Assistant 消息、推理、工具配对、模型观察与 Run 状态。每个 Provider Step 与执行结果分阶段保存。',
    boundary: '工作摘要改变后续投影，不删除原始 Transcript。',
    source: { path: 'packages/application-data/src/agent/store.ts', line: 1 },
  },
  {
    id: 'secrets', region: 'storage', title: 'Secret Store / Keyring', kind: 'CREDENTIAL',
    summary: '本地凭据引用与受控使用。',
    detail: 'Server 创建 Secret Store 与系统 Keyring Backend。SQLite 保存相关结构化记录，Gateway 通过授权路径使用凭据。',
    boundary: '扩展和界面不因持有 Profile ID 就能获得明文 API Key。',
    source: { path: 'apps/studio-server/src/main.ts', line: 122 },
  },
  {
    id: 'directory', region: 'storage', title: '角色目录投影', kind: 'FILES',
    summary: '导入成功后保存可编辑的角色文件。',
    detail: '新 Card 导入后调用 saveImportedCard。目录提供文件化编辑与分发入口；SQLite 仍是运行权威状态。',
    boundary: '目录保存可能在 Card 提交后失败。报错会提示已导入的 Card ID，不应直接重新导入。',
    source: { path: 'apps/studio-server/src/main.ts', line: 612 },
  },
];

export const connections: Connection[] = [
  { id: 'file-http', source: 'file', target: 'http', label: '原始文件', kind: 'call' },
  { id: 'http-codec', source: 'http', target: 'codec', label: '角色包', kind: 'call' },
  { id: 'codec-blobs', source: 'codec', target: 'blobs', label: '先保存媒体', kind: 'write' },
  { id: 'blobs-import', source: 'blobs', target: 'card-import', label: 'assetId + artifact', kind: 'return' },
  { id: 'import-resources', source: 'card-import', target: 'resources', label: '领域事务', kind: 'write' },
  { id: 'resources-directory', source: 'resources', target: 'directory', label: '提交后保存目录', kind: 'write' },
  { id: 'http-blobs', source: 'http', target: 'blobs', label: 'POST /assets', kind: 'write' },
  { id: 'play-api', source: 'play', target: 'api', label: '领域请求', kind: 'call' },
  { id: 'api-router', source: 'api', target: 'router', label: '/rpc · 应用会话', kind: 'call' },
  { id: 'router-create', source: 'router', target: 'timeline-create', label: 'narratives.create', kind: 'call' },
  { id: 'create-resources', source: 'timeline-create', target: 'resources', label: '读取 Card', kind: 'read' },
  { id: 'resources-create', source: 'resources', target: 'timeline-create', label: '当前声明', kind: 'return' },
  { id: 'create-narrative', source: 'timeline-create', target: 'narratives', label: 'State + Branch + Opening', kind: 'write' },
  { id: 'router-input', source: 'router', target: 'narrative-input', label: 'appendInput', kind: 'call' },
  { id: 'input-narrative', source: 'narrative-input', target: 'narratives', label: '用户正文 + Head CAS', kind: 'write' },
  { id: 'narrative-session', source: 'narratives', target: 'session', label: '提交后再投递', kind: 'call' },
  { id: 'session-transcript', source: 'session', target: 'transcript', label: '独立工作身份', kind: 'write' },
  { id: 'session-prompt', source: 'session', target: 'prompt', label: '准备本轮输入', kind: 'call' },
  { id: 'resources-prompt', source: 'resources', target: 'prompt', label: 'Preset / Settings', kind: 'read' },
  { id: 'narratives-prompt', source: 'narratives', target: 'prompt', label: '授权故事投影', kind: 'read' },
  { id: 'transcript-prompt', source: 'transcript', target: 'prompt', label: '工作历史', kind: 'read' },
  { id: 'prompt-loop', source: 'prompt', target: 'loop', label: 'messages + tools', kind: 'return' },
  { id: 'loop-gateway', source: 'loop', target: 'gateway', label: 'Provider Step', kind: 'call' },
  { id: 'secrets-gateway', source: 'secrets', target: 'gateway', label: '授权凭据', kind: 'read' },
  { id: 'gateway-provider', source: 'gateway', target: 'provider', label: '外部网络请求', kind: 'call' },
  { id: 'provider-loop', source: 'provider', target: 'loop', label: '归一化模型结果', kind: 'return' },
  { id: 'loop-transcript', source: 'loop', target: 'transcript', label: 'Observation / Run', kind: 'write' },
  { id: 'transcript-tools', source: 'transcript', target: 'tools', label: '已记录 Invocation', kind: 'call' },
  { id: 'tools-transcript', source: 'tools', target: 'transcript', label: 'Tool Result', kind: 'write' },
  { id: 'tools-narrative', source: 'tools', target: 'narratives', label: '授权正文 / State 写入', kind: 'write' },
  { id: 'transcript-loop', source: 'transcript', target: 'loop', label: 'Result Replay', kind: 'return' },
  { id: 'extension-manager', source: 'extension-ui', target: 'manager', label: '经 extensions API', kind: 'call' },
  { id: 'manager-host', source: 'manager', target: 'host', label: '授权后激活模块', kind: 'call' },
  { id: 'host-kernel', source: 'host', target: 'kernel', label: '注册平台能力', kind: 'call' },
  { id: 'manager-resources', source: 'manager', target: 'resources', label: '显式导入资源', kind: 'write' },
  { id: 'host-tools', source: 'host', target: 'tools', label: '贡献受控能力', kind: 'call' },
];

export const journeys: Journey[] = [
  {
    id: 'import', title: '导入角色', summary: '从一个角色文件到本地 Card 与资源。',
    boundary: '媒体、领域提交和目录保存不是一个跨存储原子事务；导入不启动 Agent。',
    steps: [
      { edge: 'file-http', title: '接收文件', detail: '通过原始 HTTP body 接收 ZIP 或 PNG 角色包。' },
      { edge: 'http-codec', title: '识别与校验', detail: '先解析容器和校验引用、路径、CRC 与大小预算。' },
      { edge: 'codec-blobs', title: '保存媒体', detail: '头像和背景先创建本地 Media Asset，得到 assetId。' },
      { edge: 'blobs-import', title: '交给领域导入', detail: '将媒体引用填入已解码 artifact，再调用 importCardBundle。' },
      { edge: 'import-resources', title: '提交 Card 与资源', detail: '创建新 Card、Prompt Resources、绑定和关联声明。' },
      { edge: 'resources-directory', title: '保存目录', detail: '新 Card 提交后保存目录；失败时已导入的 Card 不消失。' },
    ],
  },
  {
    id: 'timeline', title: '创建 Timeline', summary: '从 Card 开始一条独立的故事线。',
    boundary: '只物化初始状态和 Opening。动态文本仍按当前资源引用读取，Session 此时不创建。',
    steps: [
      { edge: 'play-api', title: '选择角色并开始', detail: '剧情工作区调用 narratives.create({ cardId })。' },
      { edge: 'api-router', title: '传输业务请求', detail: 'Typed API 经 Bridge 发送到本地 /rpc。' },
      { edge: 'router-create', title: '进入领域操作', detail: 'Server 将调用交给 Narrative Runtime。' },
      { edge: 'create-resources', title: '读取当前 Card', detail: '读取初始 State 声明、Opening 和运行依赖。' },
      { edge: 'resources-create', title: '物化初始内容', detail: '编排 State，并渲染要保存的 Opening。' },
      { edge: 'create-narrative', title: '创建故事权威树', detail: '在共享事务中保存 State Revision、Timeline、Branch 和 Opening。' },
    ],
  },
  {
    id: 'submit', title: '发送正文', summary: '先保存故事输入，再发起 Agent 工作。',
    boundary: '图中的“提交后再投递”由 Client 顺序编排，不是 Store 之间的自动事件或跨领域事务。',
    steps: [
      { edge: 'play-api', title: '提交本轮输入', detail: '界面保留节点身份与预期 Branch Head。' },
      { edge: 'api-router', title: '调用本地 API', detail: '先调用 appendInput，而不是直接请求模型。' },
      { edge: 'router-input', title: '检查目标分支', detail: 'Narrative Runtime 执行节点追加。' },
      { edge: 'input-narrative', title: '持久化用户正文', detail: '检查 Head 并提交节点；后续失败不撤销这一步。' },
      { edge: 'narrative-session', title: '确保工作 Session', detail: 'Client 选择或创建关联 Session，再投递已提交 inputNodeId。' },
      { edge: 'session-prompt', title: '准备本轮上下文', detail: 'Run 使用明确的 Timeline、Branch 和输入节点身份。' },
      { edge: 'prompt-loop', title: '开始 Agent Run', detail: '编译后的输入进入模型与工具循环。' },
    ],
  },
  {
    id: 'agent', title: '模型与工具', summary: '模型生成、工具执行与工作记录的循环。',
    boundary: '工具调用是可选分支。没有 Invocation 时 Runtime 检查最终文本并结束；不是每次都写 Timeline。',
    steps: [
      { edge: 'session-prompt', title: '读取本轮配置', detail: '解析 Preset、Model、资源来源、历史和挂载工具。' },
      { edge: 'prompt-loop', title: '编译模型输入', detail: 'messages 与 Native tools 分别进入请求。' },
      { edge: 'loop-gateway', title: '发起 Provider Step', detail: 'Loop 将本轮输入交给 Gateway。' },
      { edge: 'gateway-provider', title: '跨出本地边界', detail: 'Gateway 通过 Adapter 和授权凭据调用外部 Provider。' },
      { edge: 'provider-loop', title: '接收模型结果', detail: 'Gateway 归一化结果；Loop 判断 Invocation、完成或失败。' },
      { edge: 'loop-transcript', title: '保存执行事实', detail: '持久化 Observation、消息、Invocation 和 Run 状态。' },
      { edge: 'transcript-tools', title: '执行可选工具', detail: '仅有合法 Invocation 时，在受控能力范围执行。' },
      { edge: 'tools-transcript', title: '保存工具结果', detail: '成功、拒绝或失败均作为 Tool Result 记录。' },
      { edge: 'transcript-loop', title: '进入下一步', detail: 'Replay 包含工具结果的新输入，再执行 Provider Step。' },
    ],
  },
  {
    id: 'extension', title: '安装扩展', summary: '安装身份、资源导入与模块激活分开。',
    boundary: '这里只追踪 Server 模块主线，不将 Client Renderer 或任意脚本执行画成相同运行环境。',
    steps: [
      { edge: 'extension-manager', title: '显式管理安装', detail: '经本地 extensions API 指定包与全局 / Card 目标。' },
      { edge: 'manager-host', title: '授权与启用', detail: '安装验证后，显式启用模块并授予必要能力。' },
      { edge: 'host-kernel', title: '注册平台能力', detail: 'Host 以真实身份注册 RPC 等能力；注册不等于当前消费。' },
    ],
  },
];

export function sourceUrl(source: Source) {
  return `https://github.com/The-LoomStudio/LoomStudio/blob/${snapshot.baseline}/${source.path}#L${source.line}`;
}
