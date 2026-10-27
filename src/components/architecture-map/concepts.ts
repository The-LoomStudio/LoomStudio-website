import type { Source } from './map-data';

type Concept = {
  summary: string;
  detail: string;
  fields: { name: string; meaning: string }[];
  example: object;
  source: Source;
};

export const concepts: Record<string, Concept> = {
  Lore: {
    summary: '设定资源树，不是任意配置字典。',
    detail: 'Lore 以 lore 类型的 Prompt Resource 保存。Agent 读取 Preset 显式挂载和可选 Card 资源引用；全局手动挂载不自动进入所有 Agent。Card 内联 lore.entries 单独保存，不由此路径自动消费。enabled 不等于本轮 active。',
    fields: [
      { name: 'resourceKind', meaning: 'lore 表示设定资源。' },
      { name: 'rootNode / children', meaning: '树形组织，正文放在 entry 的 body 中。' },
      { name: 'source', meaning: 'Mount 的来源是 manual 或 preset，不是资源所有权。' },
      { name: 'orderIndex', meaning: '该挂载在来源内的排序。' },
      { name: 'useCardLore', meaning: 'Preset 的开关；false 时不自动采用 Card 引用的 Lore。' },
    ],
    example: {
      resource: {
        id: 'demo-lore', resourceKind: 'lore', label: 'Nom 的图书馆', version: 1, rootNodeId: 'demo-root',
        rootNode: { id: 'demo-root', kind: 'module', label: '场景设定', children: [
          { id: 'demo-entry', kind: 'entry', label: '藏书室', enabled: true, body: '书页之间藏着尚未讲完的故事。' },
        ] },
      },
      mount: { loreResourceId: 'demo-lore', source: { kind: 'preset', id: 'demo-preset' }, orderIndex: 0 },
    },
    source: { path: 'packages/shared/src/prompt-resource-contracts.ts', line: 3, endLine: 22 },
  },
  Preset: {
    summary: 'Agent 的作者配置与资源引用。',
    detail: 'Preset 同样保存为 Prompt Resource。Session 通过 agentPresetId 引用它；资源挂载与工具挂载各有自己的记录，不是把所有资源正文复制到 Session。',
    fields: [
      { name: 'resourceKind', meaning: 'preset 表示预设资源。' },
      { name: 'version', meaning: '可用于修改时的版本检查。' },
      { name: 'rootNode', meaning: '作者维护的预设正文树。' },
    ],
    example: { id: 'demo-preset', resourceKind: 'preset', label: '故事助手', version: 1, rootNodeId: 'demo-preset-root',
      rootNode: { id: 'demo-preset-root', kind: 'module', label: '预设', children: [] } },
    source: { path: 'packages/application-data/src/prompt-resource/types.ts', line: 34 },
  },
  Timeline: {
    summary: '故事的身份，不是 Agent 的聊天记录。',
    detail: 'Timeline 引用当前 Branch、资源与来源 Card。Branch Head 指向 Narrative Node 索引；canonical 正文消息保存在同 ID 的根 Session 中，节点将分支位置关联到消息。',
    fields: [
      { name: 'createdFrom', meaning: '创建故事线时使用的 Card 与版本。' },
      { name: 'activeBranchId', meaning: '当前故事分支。' },
      { name: 'promptResourceIds', meaning: '本条故事线关联的资源身份。' },
    ],
    example: { id: 'demo-timeline', title: '书页后的房间', createdFrom: { cardId: 'demo-card', cardVersion: 1 },
      promptResourceIds: ['demo-lore'], activeBranchId: 'demo-branch' },
    source: { path: 'packages/application-data/src/narrative/types.ts', line: 19 },
  },
  Branch: {
    summary: '同一条故事线中的正文索引与状态位置。',
    detail: 'Branch 属于 Timeline，headNodeId 指向当前 Narrative Node 索引，stateHeadRevisionId 指向对应状态版本。分叉可记录父分支与分叉节点；canonical 消息由 Timeline 根 Session 保存，Timeline 的扩展采用关系由各分支共享。',
    fields: [
      { name: 'timelineId', meaning: '所属故事线的身份。' },
      { name: 'headNodeId', meaning: '当前 Narrative Node 索引，可在空分支上缺省。' },
      { name: 'stateHeadRevisionId', meaning: '这个分支当前采用的状态版本。' },
      { name: 'parentBranchId / forkedFromNodeId', meaning: '分叉来源，不是整份正文副本。' },
    ],
    example: { id: 'demo-branch', timelineId: 'demo-timeline', headNodeId: 'demo-input', stateHeadRevisionId: 'demo-state-revision' },
    source: { path: 'packages/application-data/src/narrative/types.ts', line: 34, endLine: 45 },
  },
  State: {
    summary: '有归属和版本的结构化故事状态。',
    detail: 'Scope 区分 global 与 timeline，Revision 保存 snapshot、变更操作与 changesetId。故事分支通过 stateHeadRevisionId 选择版本；状态与叙事正文、Lore 作者设定分别存储。',
    fields: [
      { name: 'scopeId', meaning: '状态所属作用域，作用域记录其 ownerId。' },
      { name: 'snapshot', meaning: '该版本的结构化内容；示例字段仅用于说明。' },
      { name: 'parentRevisionId', meaning: '可选的前一状态版本。' },
      { name: 'changesetId', meaning: '产生该版本的提交身份。' },
    ],
    example: { scope: { id: 'demo-state', kind: 'timeline', ownerId: 'demo-timeline' },
      revision: { id: 'demo-state-revision', scopeId: 'demo-state', changesetId: 'demo-changeset', snapshot: { scene: '藏书室' }, operations: [] } },
    source: { path: 'packages/application-data/src/state/types.ts', line: 8, endLine: 34 },
  },
  Session: {
    summary: '独立的 Agent 工作身份。',
    detail: '普通 Agent Session 固定引用 Preset，可选关联 Timeline。每条 Timeline 另有与 Timeline 同 ID 的 kind: timeline 根 Session，承接故事输入框并共享同一工作历史；它可在安全边界调整 Preset。Transcript 是工作记录，普通最终回复不会自动成为 Narrative 正文。',
    fields: [
      { name: 'kind', meaning: 'agent 是普通工作 Session；timeline 是故事根 Session。' },
      { name: 'agentPresetId', meaning: '普通 Session 固定引用；根 Session 可暂未配置。' },
      { name: 'timelineId', meaning: '普通 Session 可选关联；根 Session 与 Timeline 同 ID。' },
      { name: 'headEntryId / entryCount', meaning: '工作记录的 Head 与条目数量。' },
    ],
    example: { id: 'demo-timeline', kind: 'timeline', agentPresetId: 'demo-preset', timelineId: 'demo-timeline', title: '书页后的房间', entryCount: 0 },
    source: { path: 'packages/application-data/src/agent/types.ts', line: 9 },
  },
  PromptBuild: {
    summary: 'Application 将选定来源投影为 Provider 输入。',
    detail: 'Preset 有序树组织 Prompt；Runtime 准备 Lore、Narrative / Session History 与本轮输入，按 Activation 和 DFS 编排。作者正文处理器仅在明确采用时运行。Native Tools 与 messages 分开传递；Content Tool 描述进入 PromptBuild。',
    fields: [
      { name: 'SourceNode / PromptContribution', meaning: '来源树节点与独立贡献，保留来源身份。' },
      { name: 'Anchor / Slot', meaning: '来源贡献进入预设骨架的位置及局部顺序。' },
      { name: 'Activation', meaning: '本轮按开关、关键词或事实条件求值。' },
      { name: 'Provider messages', meaning: 'Application 编排后的消息；不是 Loom Core Pass 输出。' },
    ],
    example: { preset: 'ordered-preset-tree', source: ['lore', 'narrative-projection', 'session-history', 'current-input'], compiler: 'Application DFS' },
    source: { path: 'packages/application-runtime/src/prompt/prompt-build-pipeline.ts', line: 44 },
  },
  Tool: {
    summary: 'Definition、Preset Mount 与 Runtime Registration 分属不同步骤。',
    detail: 'Tool Definition 保存模型可见合同和 Handler 身份；Preset Tool Mount 决定本轮候选与 Activation；Runtime Registry 提供实际执行器。Native Function Tools 作为独立请求字段，Content Tools 的说明作为 Prompt 来源。',
    fields: [
      { name: 'Tool Definition', meaning: '工具身份、参数合同与执行器引用。' },
      { name: 'Preset Tool Mount', meaning: '某个 Preset 是否采用，以及 Activation 和投影设置。' },
      { name: 'Runtime Registration', meaning: '可执行 Handler；有定义或 Mount 不代表已注册。' },
      { name: 'Transport', meaning: 'Native Function 或 Content；Provider Custom 尚非正式 Adapter。' },
    ],
    example: { definition: 'world.read_state', mount: { presetId: 'demo-preset', defaultEnabled: true }, transport: 'native-function' },
    source: { path: 'packages/application-runtime/src/agents/tool-registry.ts', line: 1 },
  },
  Extension: {
    summary: 'Package、Module、Instance 与授权各有边界。',
    detail: 'Package 可只带声明式资源而没有 Module；Module 在 Package 内声明 runtime、贡献与请求能力；Instance 是一次激活。声明、资源导入、授权、启用和当前消费不是同一状态。Server Module 是同进程受信任代码，不是安全沙箱。',
    fields: [
      { name: 'Package', meaning: '分发来源与共享资源归属，可零 Module。' },
      { name: 'Module', meaning: 'Package 内的 runtime、入口、Grant 与贡献合同。' },
      { name: 'Instance', meaning: 'Host 管理的一次激活及受管注册资源。' },
      { name: 'dependencies', meaning: '安装预览核对身份、版本、来源与循环；缺失依赖需确认安装。' },
    ],
    example: { packageId: 'author.example', modules: [{ id: 'server', runtime: 'server' }, { id: 'panel', runtime: 'client' }] },
    source: { path: 'packages/extension-sdk/extension-host/src/instance.ts', line: 51 },
  },
  LoomScript: {
    summary: 'Script Document 与目标 Mount；声明式贡献和代码运行分离。',
    detail: 'Loom Script 可只声明文本规则/提取器而不执行 JS，也可通过授权 Mount 启动 Client、Worker 或 Server Runtime。源码保存不自动切换运行版本；显式刷新采用版本。Worker 线程隔离不是权限沙箱。',
    fields: [
      { name: 'Script Document', meaning: '保存 Metadata、版本与 Blob 源码。' },
      { name: 'Mount', meaning: '保存目标、采用版本、启用、配置与 Grant。' },
      { name: 'text-transform / text-extractor', meaning: '可由平台声明式执行，不要求 JS 运行。' },
      { name: 'runtime', meaning: 'declarative、client-sandbox、client、client-worker 或 server。' },
    ],
    example: { document: 'airp.loomScript', mount: 'airp.loomScriptMount', contributions: ['text-transform', 'text-extractor'] },
    source: { path: 'packages/application-runtime/src/scripts/loom-script-text-pipeline.ts', line: 16 },
  },
  Observation: {
    summary: 'Build Trace、Provider Observation 与运行日志是不同记录。',
    detail: 'Build Observation 可含消息、来源、变换和诊断；Provider Observation 记录单步调用及供应商返回的 usage。请求前 Token 估算是 best-effort，不能代替实际 usage，也不保证逐片段精确计费。Operational Log 不承载完整调试快照。',
    fields: [
      { name: 'Build Observation', meaning: '来源、编译消息和构建过程中的观察。' },
      { name: 'Provider Observation', meaning: 'Provider / Model / Call ID、Stop Reason 与可用 usage。' },
      { name: 'Request Measurement', meaning: '请求前估算，和 Provider 报告的 usage 分开保存。' },
      { name: 'Log / Diagnostic / Audit', meaning: '操作日志、可行动诊断与审计事实分别有语义边界。' },
    ],
    example: { build: 'messages + sources + transformations', provider: 'model + callId + usage', logs: 'operational summaries' },
    source: { path: 'packages/application-runtime/src/observability/types.ts', line: 48, endLine: 76 },
  },
  Run: {
    summary: 'Session 中的一次执行，不是一条正文。',
    detail: '发起执行的输入可以带上已经提交的 inputNodeId。下面展示 InvokeAgentTurn 的输入字段，而非完整 Run 存储记录。模型与工具的实际执行分阶段记录；最终文本不会自动写入 Narrative。',
    fields: [
      { name: 'agentSessionId', meaning: '执行归属的工作 Session。' },
      { name: 'inputNodeId', meaning: '本轮已提交消息关联的 Narrative Node 索引。' },
      { name: 'branchId', meaning: '本轮使用的目标故事分支。' },
    ],
    example: { agentSessionId: 'demo-session', input: '继续这一轮故事。', narrativeTarget: { timelineId: 'demo-timeline', branchId: 'demo-branch', inputNodeId: 'demo-input' } },
    source: { path: 'packages/application-runtime/src/types.ts', line: 828 },
  },
  inputNodeId: {
    summary: '先提交的用户正文节点身份。',
    detail: '用户输入先以 loom-markdown.v1 正文保存，提交后再以节点 ID 投递给 Agent。后续投递失败不会撤销这次正文提交。',
    fields: [
      { name: 'nodeId', meaning: '追加用户正文时提供的节点身份。' },
      { name: 'expectedHeadNodeId', meaning: '追加前预期的分支 Head，用于检查并发。' },
      { name: 'content', meaning: 'API 接收的本轮正文；Runtime 将它保存为 body.raw，格式为 loom-markdown.v1。' },
    ],
    example: { timelineId: 'demo-timeline', branchId: 'demo-branch', nodeId: 'demo-input', expectedHeadNodeId: null,
      content: 'Nom，打开那本书。' },
    source: { path: 'packages/application-runtime/src/types.ts', line: 642 },
  },
};
