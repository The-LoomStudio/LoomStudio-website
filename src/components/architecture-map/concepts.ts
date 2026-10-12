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
    detail: 'Timeline 引用当前 Branch、资源与来源 Card。Branch 的 Head 指向正文节点；Session 可以关联这条故事线，但二者并不互相拥有。',
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
    summary: '同一条故事线中的正文与状态位置。',
    detail: 'Branch 属于 Timeline，headNodeId 指向当前正文，stateHeadRevisionId 指向对应状态版本。分叉可记录父分支与分叉节点；Timeline 的扩展采用关系由各分支共享。',
    fields: [
      { name: 'timelineId', meaning: '所属故事线的身份。' },
      { name: 'headNodeId', meaning: '当前正文节点，可在空分支上缺省。' },
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
    detail: 'Session 引用 Preset 和可选 Timeline。它的 Transcript 保存工作消息、工具调用和执行观察，不会自动成为剧情正文。',
    fields: [
      { name: 'agentPresetId', meaning: '工作所使用的预设身份。' },
      { name: 'timelineId', meaning: '可选关联；无 Timeline 也能创建 Session。' },
      { name: 'headEntryId / entryCount', meaning: '工作记录的 Head 与条目数量。' },
    ],
    example: { id: 'demo-session', agentPresetId: 'demo-preset', timelineId: 'demo-timeline', title: '整理藏书室线索', entryCount: 0 },
    source: { path: 'packages/application-data/src/agent/types.ts', line: 9 },
  },
  Run: {
    summary: 'Session 中的一次执行，不是一条正文。',
    detail: '发起执行的输入可以带上已经提交的 inputNodeId。下面展示 InvokeAgentTurn 的输入字段，而非完整 Run 存储记录。模型与工具的实际执行分阶段记录；最终文本不会自动写入 Narrative。',
    fields: [
      { name: 'agentSessionId', meaning: '执行归属的工作 Session。' },
      { name: 'inputNodeId', meaning: '本轮已保存的用户正文节点。' },
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
