import type { Source } from './map-data';

type Concept = {
  summary: string;
  detail: string;
  fields: { name: string; meaning: string }[];
  example: object;
  source: Source;
};

export const concepts: Record<string, Concept> = {
  Settings: {
    summary: '设定资源树，不是任意配置字典。',
    detail: 'Settings 以 setting 类型的 Prompt Resource 保存。树节点包含正文与作者配置，Mount 决定资源来自手动选择还是某个 Preset。enabled 不等于本轮 active。',
    fields: [
      { name: 'resourceKind', meaning: 'setting 表示设定资源。' },
      { name: 'rootNode / children', meaning: '树形组织，正文放在 entry 的 body 中。' },
      { name: 'source', meaning: 'Mount 的来源是 manual 或 preset，不是资源所有权。' },
      { name: 'orderIndex', meaning: '该挂载在来源内的排序。' },
    ],
    example: {
      resource: {
        id: 'demo-setting', resourceKind: 'setting', label: 'Nom 的图书馆', version: 1, rootNodeId: 'demo-root',
        rootNode: { id: 'demo-root', kind: 'module', label: '场景设定', children: [
          { id: 'demo-entry', kind: 'entry', label: '藏书室', enabled: true, body: '书页之间藏着尚未讲完的故事。' },
        ] },
      },
      mount: { settingResourceId: 'demo-setting', source: { kind: 'preset', id: 'demo-preset' }, orderIndex: 0 },
    },
    source: { path: 'packages/application-data/src/prompt-resource/types.ts', line: 37 },
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
    source: { path: 'packages/application-data/src/prompt-resource/types.ts', line: 37 },
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
      promptResourceIds: ['demo-setting'], activeBranchId: 'demo-branch' },
    source: { path: 'packages/application-data/src/narrative/types.ts', line: 17 },
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
    source: { path: 'packages/application-runtime/src/types.ts', line: 739 },
  },
  inputNodeId: {
    summary: '先提交的用户正文节点身份。',
    detail: '用户输入先以 loom-markdown.v1 正文保存，提交后再以节点 ID 投递给 Agent。后续投递失败不会撤销这次正文提交。',
    fields: [
      { name: 'nodeId', meaning: '追加用户正文时提供的节点身份。' },
      { name: 'expectedHeadNodeId', meaning: '追加前预期的分支 Head，用于检查并发。' },
      { name: 'body.raw', meaning: '本轮正文，和身份引用是两件事。' },
    ],
    example: { timelineId: 'demo-timeline', branchId: 'demo-branch', nodeId: 'demo-input', expectedHeadNodeId: null,
      body: { format: 'loom-markdown.v1', raw: 'Nom，打开那本书。' } },
    source: { path: 'packages/application-data/src/narrative/types.ts', line: 108 },
  },
};
