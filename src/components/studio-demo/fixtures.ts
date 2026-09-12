import type { AgentProfile, AgentSession, AgentTranscriptEntry, ProviderAccount } from './snapshot/entities/index.js'
import type { FileTreeNode } from './snapshot/shared/ui/file-tree/file-tree.js'

const createdAt = '2026-09-12T08:00:00Z'
export const providers: ProviderAccount[] = [{
  id: 'demo-provider', version: 1, providerExtensionId: 'demo', displayName: '本地演示',
  config: {}, enabledModelIds: ['fixed-example'], credential: { configured: false }, createdAt, updatedAt: createdAt,
}]
export const profiles: AgentProfile[] = ['叙事助手', '世界设定助手'].map((name, index) => ({
  id: `demo-agent-${index}`, version: 1, name, presetId: 'demo-preset',
  model: { providerProfileId: 'demo-provider', modelId: 'fixed-example' }, toolOverrides: {}, createdAt, updatedAt: createdAt,
}))
export const session: AgentSession = {
  id: 'demo-silver-sea', agentProfileId: profiles[0].id, entryCount: 3, createdAt, updatedAt: createdAt,
}
export const initialMessages: AgentTranscriptEntry[] = [
  { id: 'demo-entry-1', agentSessionId: session.id, sequence: 1, createdAt, entry: { kind: 'message', role: 'user', content: '帮我整理雾港这一幕的线索，先不要推进正文。' } },
  { id: 'demo-entry-2', agentSessionId: session.id, sequence: 2, createdAt, entry: { kind: 'tool-result', toolId: 'read_state', result: { location: '雾港', tide: '上涨', lighthouse: '熄灭' } } },
  { id: 'demo-entry-3', agentSessionId: session.id, sequence: 3, createdAt, entry: { kind: 'message', role: 'assistant', content: '## 雾港的三条线索\n\n- **灯塔**：守灯人消失后，光线仍在每夜出现。\n- **潮汐**：旧塔入口只在退潮时露出。\n- **来信**：落款日期比今天晚了三天。\n\n“先让角色发现矛盾，再让他们作出选择。”\n\n这是固定演示内容，可以展开工具记录、切换 Agent 或试用输入框。' } },
]
export const files: FileTreeNode[] = [{ id: 'world', label: '银海纪行', children: [
  { id: 'setting', label: '世界设定.md', meta: 'Markdown' },
  { id: 'character', label: '角色笔记.md', meta: 'Markdown' },
  { id: 'scene', label: '场景状态.md', meta: 'Markdown' },
] }]
export const documents: Record<string, string> = {
  world: '# 银海纪行\n\n一个发生在群岛、灯塔与潮汐之间的故事。\n\n选择左侧文件查看内容；可以拖动分栏边界，或切换浏览方式。',
  setting: '# 银海纪行\n\n## 雾港\n\n群岛最北端的港口，每年有三个月被海雾遮蔽。城里的钟声总比外海的潮汐早一刻。\n\n> “海会把失去的东西送回来，只是未必还是原来的模样。”\n\n### 创作线索\n\n- 灯塔的信号\n- 一封来自未来的信\n- 退潮后出现的石阶\n\n这是演示文件，不会写入你的工作区。',
  character: '# 伊芙\n\n**身份**：修复航海图的学徒。\n\n**目标**：找到父亲留下的最后一张地图。\n\n## 尚未说出口的秘密\n\n她记得一座从未去过的塔，也记得塔底有人喊过她的名字。',
  scene: '# 场景状态\n\n```yaml\nlocation: 雾港\ntime: 黄昏\ntide: 上涨\nlighthouse: 熄灭\n```\n\n这是固定示例数据，展示原生 Markdown 与代码块交互。',
}
