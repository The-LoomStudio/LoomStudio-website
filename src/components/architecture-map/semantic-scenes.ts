import type { MapCategory } from './MapColorLegend';
import type { Source } from './map-data';

export type SceneKind = 'workflow' | 'dataflow' | 'lifecycle' | 'sequence';
export type Side = 'left' | 'right' | 'top' | 'bottom';
export type SceneNode = {
  id: string; title: string; summary: string; detail: string; source: Source;
  category: MapCategory; x: number; y: number; role: 'step' | 'decision' | 'data' | 'state' | 'participant';
  outcome?: 'waiting' | 'success' | 'failure';
};
export type SceneEdge = {
  id: string; from: string; to: string; label: string; detail: string; source: Source;
  kind: 'main' | 'branch' | 'return' | 'write' | 'read';
  fromSide?: Side; toSide?: Side; via?: [number, number][]; labelAt?: [number, number];
  // Fraction along the node edge, used to keep incoming and outgoing routes distinct.
  fromOffset?: number; toOffset?: number;
  // Sequence messages attach to lifelines at a chronological row, not header boxes.
  messageY?: number;
};
export type SceneFrame = { id: string; title: string; note: string; x: number; y: number; width: number; height: number };
export type SemanticScene = {
  id: SceneKind; title: string; question: string; boundary: string;
  frames: SceneFrame[]; nodes: SceneNode[]; edges: SceneEdge[];
  width: number; height: number;
};
const loop = 'packages/application-runtime/src/agents/tool-loop.ts';
const turn = 'packages/application-runtime/src/agents/agent-turn.ts';
const runtime = 'packages/application-runtime/src/runtime/agents-runtime.ts';
const processing = 'packages/application-runtime/src/prompt/process-prompt.ts';
const runs = 'apps/studio-server/src/rpc/handlers/application/agents.ts';
const client = 'apps/studio-client/src/features/narrative-runtime/model/use-narrative-runtime.ts';
const narrative = 'packages/application-runtime/src/runtime/narrative-runtime.ts';
const src = (path: string, line: number, endLine: number): Source => ({ path, line, endLine });
const edge = (id: string, from: string, to: string, label: string, detail: string, source: Source, options: Partial<SceneEdge> = {}): SceneEdge =>
  ({ id, from, to, label, detail, source, kind: 'main', ...options });
const lane = (id: string, title: string, note: string, y: number): SceneFrame => ({ id, title, note, x: 0, y, width: 1520, height: 200 });

const workflow: SemanticScene = {
  id: 'workflow', title: '模型与工具的执行循环', question: '谁负责执行？什么时候继续、结束或留下恢复记录？',
  boundary: '节点表示执行阶段，不是 Run 的状态枚举。这里只展开已有 Session 的模型工具主链；工具内部的审批和具体写入由各自作用域控制。',
  width: 1520, height: 1000,
  frames: [lane('prepare', '01 · Application Runtime', '准备本轮上下文', 0), lane('provider', '02 · Provider 与响应处理', '调用模型 → 接受结果 → 判断分支', 240), lane('tools', '03 · Tool 与 Transcript', '执行副作用 → 记录结果 → 返回下一步', 480), lane('interrupt', '04 · 中断与恢复', '不把未知副作用当成可以安全重试', 720)],
  nodes: [
    { id: 'context', category: 'runtime', title: '准备上下文与工具', summary: 'Preset / Lore / 历史 / Tool Mount', detail: 'Runtime 准备模型绑定、PromptBuild、挂载工具和明确的 Narrative 目标，随后调用 Tool Loop。', source: src(runtime, 354, 391), x: 70, y: 70, role: 'step' },
    { id: 'checkpoint', category: 'storage', title: '记录本轮起点', summary: '用户消息 + running checkpoint', detail: '新执行保存用户消息和 provider 阶段恢复点；恢复执行使用 sourceRunId，并复用已有用户条目。', source: src(loop, 397, 410), x: 490, y: 70, role: 'data' },
    { id: 'model', category: 'external', title: '调用所选模型', summary: 'messages 与 Native tools', detail: 'Provider Step 发出模型请求，流事件传回 Run；不由 Provider 直接执行本地工具。', source: src(loop, 414, 480), x: 490, y: 310, role: 'step' },
    { id: 'response', category: 'decision', title: '判断响应内容', summary: 'Invocation / 完整正文 / 截断', detail: '归一化响应先记录 Observation，再识别 Native 与 Content Invocation；不是仅凭 Stop Reason 决定是否执行工具。', source: src(loop, 482, 550), x: 910, y: 310, role: 'decision' },
    { id: 'finish', category: 'runtime', title: '接受最终回复', summary: '无工具调用且有完整文本', detail: '完整回复经采用的 State 内容处理路径后完成；普通模型输出不会自动成为 Narrative 正文。', source: src(loop, 602, 630), x: 1230, y: 70, role: 'step', outcome: 'success' },
    { id: 'tool', category: 'tool', title: '执行受控工具', summary: '合法 Invocation 与执行作用域', detail: '按挂载工具、参数校验和执行作用域调用本地处理器；具体审批按工具操作触发，而非所有调用统一经过一个虚构审批节点。', source: src('packages/application-runtime/src/agents/tool-registry.ts', 392, 439), x: 910, y: 550, role: 'step' },
    { id: 'result', category: 'storage', title: '保存工具结果', summary: 'Tool Result + 下一步 checkpoint', detail: '结果加入 Transcript 和模型 Replay；最后一个工具完成后记录下一次 Provider Step 的恢复点。工具自身的失败结果也可进入 Replay。', source: src(loop, 732, 767), x: 490, y: 550, role: 'data' },
    { id: 'failure', category: 'decision', title: '中断或执行异常', summary: '暂停、取消、抛出错误', detail: '捕获执行异常；尚未得到结果的 Invocation 被配对为中断结果，避免把不确定状态当成成功。', source: src(loop, 800, 816), x: 1230, y: 790, role: 'step', outcome: 'failure' },
    { id: 'recovery', category: 'storage', title: '记录可恢复现场', summary: '消息、阶段、工具合同、加工快照', detail: '暂停或失败可记录 checkpoint。恢复前核对工具合同；中断工具结果未知时拒绝重复副作用。普通取消走 aborted 记录。', source: src(loop, 355, 390), x: 490, y: 790, role: 'data', outcome: 'waiting' },
  ],
  edges: [
    edge('prepare-start', 'context', 'checkpoint', '准备完成', '模型与工具准备完成后进入 Loop。', src(runtime, 367, 391)),
    edge('start-model', 'checkpoint', 'model', '开始 Provider Step', '写入起点后执行模型步骤。', src(loop, 397, 419), { fromSide: 'bottom', toSide: 'top', toOffset: .3, via: [[610, 205], [562, 205]], labelAt: [562, 275] }),
    edge('model-response', 'model', 'response', 'Observation', '模型结果先保存为执行观察。', src(loop, 480, 485)),
    edge('response-tool', 'response', 'tool', '存在 Invocation', '存在工具请求时才进入工具执行分支。', src(loop, 580, 603), { kind: 'branch', fromSide: 'bottom', toSide: 'top' }),
    edge('tool-result', 'tool', 'result', 'Tool Result', '保存受控工具返回的结果。', src(loop, 749, 759), { kind: 'write', fromSide: 'left', toSide: 'right' }),
    edge('result-model', 'result', 'model', 'Replay · 下一步', '用已接受的工具结果继续下一次模型调用。', src(loop, 749, 775), { kind: 'return', fromSide: 'left', toSide: 'left', toOffset: .75, via: [[420, 606], [420, 394]], labelAt: [420, 485] }),
    edge('response-finish', 'response', 'finish', '完整正文 · 无工具', '满足完整回复条件才接受最终输出。', src(loop, 602, 630), { kind: 'branch', fromSide: 'right', toSide: 'left', via: [[1190, 366], [1190, 126]], labelAt: [1190, 265] }),
    edge('response-continue', 'response', 'model', 'length · 续写', '无工具且输出被长度截断时追加已接受消息并继续。', src(loop, 659, 675), { kind: 'return', fromSide: 'top', toSide: 'top', toOffset: .7, via: [[1030, 230], [658, 230]], labelAt: [820, 230] }),
    edge('model-failure', 'model', 'failure', '调用异常 / 中断', '执行异常进入 Loop 的统一中断处理。', src(loop, 780, 816), { kind: 'branch', fromSide: 'left', fromOffset: .25, toSide: 'bottom', via: [[330, 338], [330, 950], [1350, 950]], labelAt: [330, 730] }),
    edge('tool-failure', 'tool', 'failure', '执行中断', '未确认结果的工具不能被静默重放。', src(loop, 800, 816), { kind: 'branch', fromSide: 'right', toSide: 'top', via: [[1350, 606]], labelAt: [1350, 700] }),
    edge('failure-record', 'failure', 'recovery', '按中断原因记录', '暂停 / 失败保留现场，普通取消记录 aborted；不承诺任意现场都可恢复。', src(loop, 851, 896), { kind: 'write', fromSide: 'left', toSide: 'right' }),
  ],
};

const dataflow: SemanticScene = {
  id: 'dataflow', title: 'PromptBuild 的上下文数据流', question: '哪些数据被选中、怎样加工，最终什么会发送给模型？',
  boundary: '图中是本轮构建的数据投影。Lore 作者正文、Narrative 正文与 Session 工作记录各有存储所有者；加工不会覆盖原始资源。',
  width: 1570, height: 870,
  frames: [
    { id: 'sources', title: '01 · 来源', note: '持久内容与本轮输入', x: 0, y: 0, width: 280, height: 850 },
    { id: 'selection', title: '02 · 选择与组合', note: '身份、采用和作用域', x: 400, y: 0, width: 280, height: 850 },
    { id: 'processing', title: '03 · 加工与编排', note: 'Application DFS', x: 810, y: 0, width: 280, height: 850 },
    { id: 'output', title: '04 · 输出', note: '模型请求与恢复投影', x: 1240, y: 0, width: 310, height: 850 },
  ],
  nodes: [
    { id: 'lore', category: 'storage', title: 'Preset 与 Lore', summary: '作者树与显式 LoreMount', detail: '当前 Preset 的显式 Lore 挂载，以及 useCardLore 未关闭时 Card 引用的 Lore。全局手动挂载和 Card 内联 lore.entries 不会自动进入此路径。', source: src(turn, 74, 110), x: 20, y: 110, role: 'data' },
    { id: 'history', category: 'storage', title: '历史与当前输入', summary: 'Narrative / Session / input', detail: 'Runtime 构造历史和当前输入的 SourceNode 与贡献；Session 历史是否采用取决于 Preset 的 historyPolicy。', source: src(runtime, 781, 805), x: 20, y: 355, role: 'data' },
    { id: 'tools', category: 'tool', title: '挂载工具', summary: 'Content 与 Native 两种传输', detail: '工具集合编译后，Content Tool 可贡献正文；Native Tool 规范作为独立请求字段。', source: src(loop, 181, 267), x: 20, y: 660, role: 'data' },
    { id: 'select', category: 'runtime', title: '筛选资源', summary: 'Lore 分类、去重、安装作用域', detail: '从明确来源读取资源。不可用的可选资源留下诊断；当前 Preset 不可用会阻断执行。', source: src(turn, 74, 110), x: 420, y: 110, role: 'step' },
    { id: 'compose', category: 'runtime', title: '组合构建模型', summary: 'SourceNode + Contribution', detail: '组合作者资源、Runtime 历史、当前输入及允许的扩展贡献；Preset 根作为编排骨架。', source: src(turn, 111, 144), x: 420, y: 355, role: 'step' },
    { id: 'process', category: 'runtime', title: '作者正文加工', summary: '可选 prepare → 有序 render', detail: '显式 processorId 才执行处理器。prepare 修改本轮候选；Activation / DFS 确定发送顺序；render 后展开普通宏。未采用处理器的正文直接编排。', source: src(processing, 22, 109), x: 830, y: 355, role: 'step' },
    { id: 'messages', category: 'external', title: 'Provider messages', summary: '已编排的模型上下文', detail: '加工投影或普通编译产出消息；恢复时复用已接受的消息，不重新执行作者模板。', source: src(turn, 145, 167), x: 1270, y: 355, role: 'data' },
    { id: 'native', category: 'tool', title: 'Native tools', summary: '独立的工具规范数组', detail: '工具规范与消息分开进入 Provider 请求；存在规范并不等于模型一定调用工具。', source: src(loop, 441, 458), x: 1270, y: 660, role: 'data' },
    { id: 'snapshot', category: 'storage', title: '加工与恢复快照', summary: '已接受消息与处理后贡献', detail: '处理过的来源与投影随恢复 checkpoint 保存；恢复缺少所需加工快照时明确失败。', source: src(turn, 152, 167), x: 1270, y: 110, role: 'data' },
  ],
  edges: [
    edge('lore-select', 'lore', 'select', '资源引用', '读取 Preset 显式挂载和可选 Card Lore。', src(turn, 74, 94), { kind: 'read' }),
    edge('select-compose', 'select', 'compose', '资源树', '筛选后的作者资源参与模型组合。', src(turn, 125, 144), { fromSide: 'bottom', toSide: 'top' }),
    edge('history-compose', 'history', 'compose', '历史 / 当前输入', 'Runtime 来源进入同一构建模型。', src(turn, 111, 144), { kind: 'read' }),
    edge('tools-compose', 'tools', 'compose', 'Content 贡献', 'Content 工具贡献正文，与 Native 规范分离。', src(runtime, 803, 805), { fromSide: 'right', toSide: 'bottom', via: [[540, 716]], labelAt: [540, 605] }),
    edge('compose-process', 'compose', 'process', '候选正文与能力', '当前构建模型进入异步加工或普通编排。', src(turn, 145, 165)),
    edge('process-messages', 'process', 'messages', '有序消息', '输出实际使用的文本片段和消息。', src(processing, 89, 111)),
    edge('messages-snapshot', 'messages', 'snapshot', '保存加工投影', '与恢复消息一同保留加工快照；不是重写原始资源。', src(turn, 155, 167), { kind: 'write', fromSide: 'top', toSide: 'bottom' }),
    edge('tools-native', 'tools', 'native', 'Native Tool 规范', '独立于 Prompt 正文进入模型请求。', src(loop, 441, 458), { fromSide: 'bottom', toSide: 'bottom', via: [[140, 810], [1390, 810]], labelAt: [800, 810] }),
  ],
};

const lifecycle: SemanticScene = {
  id: 'lifecycle', title: 'Server Run 的生命周期', question: '一个 runId 何时结束？恢复是不是同一个执行？',
  boundary: '本图采用 Server AgentRun.state，不混用 Transcript 的 created / aborted / discarded，也不把 preparation、provider、tool 等阶段当成状态。恢复成功创建新 runId，旧执行保留来源身份。',
  width: 1520, height: 950,
  frames: [lane('main', '01 · 执行与正常结束', '对象：Server AgentRun', 0), lane('wait', '02 · 暂停与恢复请求', '恢复资格取决于 checkpoint 和合同校验', 300), lane('end', '03 · 异常结束', '取消与失败分别记录', 680)],
  nodes: [
    { id: 'running', category: 'active', title: 'running', summary: '新 Run 接受执行', detail: 'startAgentRun 创建新身份并置为 running。同一 Session 已有运行中的执行时拒绝并发启动。', source: src(runs, 406, 415), x: 650, y: 70, role: 'state' },
    { id: 'completed', category: 'success', title: 'completed', summary: '执行返回且未被取消', detail: 'Runtime 返回结果且 AbortSignal 未触发，Server 设置 completed，清理恢复点并保留待确认的完成事件。', source: src(runs, 485, 495), x: 1190, y: 70, role: 'state', outcome: 'success' },
    { id: 'suspended', category: 'waiting', title: 'suspended', summary: '用户暂停或得到新 checkpoint', detail: '用户暂停，或异常路径产生新的 checkpoint，会映射为 suspended；是否能继续还需恢复检查。', source: src(runs, 495, 505), x: 60, y: 370, role: 'state', outcome: 'waiting' },
    { id: 'new-run', category: 'active', title: '新的 running Run', summary: '新 runId · 关联 sourceRunId', detail: 'resume 使用内存 checkpoint 或从 Transcript 准备恢复；接受请求后创建新 Run。工具合同变化或未知工具副作用可拒绝恢复，旧对象不会简单回到 running。', source: src(runs, 298, 339), x: 650, y: 370, role: 'state' },
    { id: 'abandoned', category: 'waiting', title: '放弃继续', summary: 'abandoned 标记 + discarded 记录', detail: '仅对尚未续接的 suspended Run 生效。清除 checkpoint、设置 abandoned，Transcript 追加 discarded；Server state 本身仍为 suspended。', source: src(runs, 278, 295), x: 60, y: 750, role: 'step', outcome: 'waiting' },
    { id: 'cancelled', category: 'failure', title: 'cancelled', summary: '已取消且不满足暂停条件', detail: '异常处理优先判断 suspended；否则 AbortSignal 已触发时映射为 cancelled。它不同于 Transcript 的 aborted 字面值。', source: src(runs, 495, 505), x: 650, y: 750, role: 'state', outcome: 'failure' },
    { id: 'failed', category: 'failure', title: 'failed', summary: '异常且无暂停 / 取消条件', detail: '未形成新的暂停现场且未触发取消时，Server 设置 failed。恢复请求仍要检查是否存在合法的恢复证据，不能据此承诺自动重试。', source: src(runs, 495, 505), x: 1190, y: 750, role: 'state', outcome: 'failure' },
  ],
  edges: [
    edge('complete', 'running', 'completed', '成功返回', '未被取消的正常结果使该执行结束。', src(runs, 485, 495)),
    edge('pause', 'running', 'suspended', 'user-pause / 新 checkpoint', 'pause 触发中断，状态在异步执行结束时更新。', src(runs, 271, 276), { kind: 'branch', fromSide: 'bottom', fromOffset: .2, toSide: 'top', via: [[698, 250], [180, 250]], labelAt: [410, 250] }),
    edge('resume', 'suspended', 'new-run', '接受恢复请求', '取得恢复现场后创建新的执行；后续 Loop 仍可能因工具合同变化而拒绝继续，不将旧 runId 改回 running。', src(runs, 310, 335), { kind: 'return' }),
    edge('abandon', 'suspended', 'abandoned', '显式放弃', '清理恢复现场并记录 discarded；不是新增的 Server 状态。', src(runs, 278, 295), { kind: 'branch', fromSide: 'bottom', toSide: 'top', labelAt: [180, 600] }),
    edge('cancel', 'running', 'cancelled', '取消 · 非暂停', '按照 Server catch 中的优先级映射。', src(runs, 495, 505), { kind: 'branch', fromSide: 'bottom', toSide: 'top', via: [[770, 220], [1000, 220], [1000, 610], [770, 610]], labelAt: [1000, 535] }),
    edge('fail', 'running', 'failed', '异常 · 无恢复现场', '异常未满足暂停和取消条件。', src(runs, 495, 505), { kind: 'branch', fromSide: 'bottom', fromOffset: .8, toSide: 'right', via: [[842, 200], [1490, 200], [1490, 806]], labelAt: [1230, 200] }),
  ],
};

const sequence: SemanticScene = {
  id: 'sequence', title: '从正文提交到 Run 启动', question: '正文何时已经保存？哪一步失败不会回滚它？',
  boundary: '这是调用时序，不是耗时比例。叙事写入与 Run 创建不是一个跨阶段事务；当前提交路径要求已有主写作 Session，Agent 独立对话另有 ensureAgentSession 路径。',
  width: 1510, height: 970,
  frames: [
    { id: 'write', title: '01 · 先提交用户正文', note: '检查预期 Head 并保存', x: 0, y: 190, width: 1490, height: 360 },
    { id: 'run', title: '02 · 再启动并观察执行', note: '失败不会撤销前面的正文提交', x: 0, y: 570, width: 1490, height: 360 },
  ],
  nodes: [
    { id: 'client', category: 'client', title: 'Studio Client', summary: '剧情提交控制器', detail: '保存提交身份和预期 Head。确认正文提交后查找当前 Timeline 的主写作 Session。', source: src(client, 454, 500), x: 20, y: 25, role: 'participant' },
    { id: 'narrative', category: 'runtime', title: 'Narrative Runtime', summary: '正文提交边界', detail: '接收 content 并转换为 loom-markdown.v1 正文，交给 Narrative Store。', source: src(narrative, 230, 240), x: 420, y: 25, role: 'participant' },
    { id: 'store', category: 'storage', title: 'Narrative Store', summary: '正文节点与 Branch Head', detail: '持久化正文并返回节点、分支与提交事实；正文写入先于 Run 创建。', source: src(narrative, 233, 240), x: 820, y: 25, role: 'participant' },
    { id: 'server-run', category: 'server', title: 'Server Run', summary: '独立执行身份与事件', detail: '创建 AgentRun 并启动 Runtime；运行进度由 Run 事件机制提供。', source: src(runs, 406, 440), x: 1220, y: 25, role: 'participant' },
  ],
  edges: [
    edge('append', 'client', 'narrative', '1 · appendInput(content, expectedHeadNodeId)', '先发送用户正文与提交身份。', src(client, 465, 471), { messageY: 280 }),
    edge('write', 'narrative', 'store', '2 · appendInput(body.raw)', 'Runtime 将 content 映射为正文结构。', src(narrative, 230, 240), { kind: 'write', messageY: 355 }),
    edge('committed', 'store', 'narrative', '3 · node / branch / commit', 'Store 返回已经提交的正文与分支。', src(narrative, 233, 240), { kind: 'return', messageY: 430 }),
    edge('accept', 'narrative', 'client', '4 · 标记正文已提交', 'Client 记录 committed，更新节点及 Branch；后续失败不会回滚此提交。', src(client, 471, 480), { kind: 'return', messageY: 505 }),
    edge('create', 'client', 'server-run', '5 · 已有主写作 Session → createRun(inputNodeId)', '校验已有主写作 Session 属于当前 Timeline，再携带已保存 inputNodeId 创建 Run。', src(client, 485, 500), { messageY: 670 }),
    edge('started', 'server-run', 'client', '6 · runId / 执行进度', '新 Run 有独立身份；状态与进度更新属于执行链，而非此前正文写事务。', src(runs, 406, 440), { kind: 'return', messageY: 790 }),
  ],
};

export const semanticScenes: Record<SceneKind, SemanticScene> = { workflow, dataflow, lifecycle, sequence };
