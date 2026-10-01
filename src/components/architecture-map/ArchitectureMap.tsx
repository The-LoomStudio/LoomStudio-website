import { useEffect, useState } from 'react';
import {
  Background, BackgroundVariant, BaseEdge, EdgeLabelRenderer, Handle, MarkerType, Panel, Position,
  ReactFlow, ReactFlowProvider, useReactFlow, type Edge, type EdgeProps, type Node, type NodeProps,
} from '@xyflow/react';
import { ArrowLeft, ArrowUpRight, ChevronRight, Cloud, Database, Focus, Map as MapIcon, MessageCircle, Minus, Monitor, PanelRightClose, PanelRightOpen, Plus, Puzzle, Search, SendHorizontal, Server, ShieldCheck, Square, Workflow, X } from 'lucide-react';
import { connections, items, journeys, regions, snapshot, sourceUrl, type MapItem, type RegionId } from './map-data';
import { concepts } from './concepts';
import type { DisplayImage } from '../../lib/site-images';
import '@xyflow/react/dist/style.css';
import './architecture-map.css';

type MapProps = { nom: DisplayImage; cardCover: DisplayImage };
type DetailNode = Node<MapItem & {
  highlighted: boolean; inspected: boolean; inspect: () => void;
  sourceSide: Position; targetSide: Position;
  cardCover: DisplayImage;
  explain: (term: string) => void;
  delivery?: 'processing' | 'delivered' | 'waiting';
  simulation?: {
    draft: string; onDraft: (value: string) => void; onSend: () => void; onStop: () => void;
    playing: boolean; status: string;
  };
}, 'detail'>;
type RegionNode = Node<{
  region: RegionId; title: string; subtitle: string; inspect: () => void;
}, 'region'>;
const regionLabels = { client: '界面入口', server: '本地服务', runtime: '运行编排', storage: '本地数据', extensions: '扩展能力', external: '外部模型' };
const regionIcons = { client: Monitor, server: Server, runtime: Workflow, storage: Database, extensions: Puzzle, external: Cloud };

function TermText({ text, explain }: { text: string; explain: (term: string) => void }) {
  return <>{text.split(/\b(Settings|Preset|Timeline|Session|Run|inputNodeId)\b/g).map((part, index) =>
    concepts[part] ? <button key={index} className="am-term" onClick={() => explain(part)} aria-label={`解释 ${part}`} data-definition={concepts[part].summary}>{part}</button> : part,
  )}</>;
}

function Detail({ data }: NodeProps<DetailNode>) {
  const Icon = regionIcons[data.region];
  const title = <button className="am-node-title" onClick={data.inspect} aria-label={`查看 ${data.title}`} aria-pressed={data.inspected}><strong>{data.title}</strong></button>;
  const summary = <span className="am-node-summary"><TermText text={data.summary} explain={data.explain} /></span>;
  const shape = data.id === 'file' || data.id === 'card-import' ? 'photo'
    : data.id === 'session' || data.id === 'narrative-input' ? 'conversation'
    : data.id === 'tools' ? 'permit'
    : data.region === 'storage' ? 'ledger'
    : data.region === 'server' || data.id === 'api' ? 'ticket'
    : data.region === 'extensions' || data.id === 'extension-ui' ? 'patch'
    : data.region === 'external' || data.id === 'gateway' ? 'signal'
    : 'note';
  return (
    <div className={`am-node am-shape-${shape}${data.simulation ? ' am-simulation-node' : ''}${data.highlighted ? ' is-highlighted' : ''}${data.inspected ? ' is-inspected' : ''}${data.delivery ? ` is-${data.delivery}` : ''}`} aria-busy={data.delivery === 'processing'}>
      <Handle type="target" position={data.targetSide} />
      <div className="am-node-content nopan" onClick={event => { if (!(event.target as Element).closest('button, textarea, form')) data.inspect(); }}>
        {data.simulation ? <>
          {title}
          <form className="am-simulation-form nodrag nowheel" aria-label="发送正文模拟" onSubmit={event => { event.preventDefault(); data.simulation!.onSend(); }}>
            <textarea aria-label="模拟正文" value={data.simulation.draft} disabled={data.simulation.playing}
              onChange={event => data.simulation!.onDraft(event.target.value)} placeholder="Nom，打开那本书。" />
            <div className="am-simulation-actions">
              <small>文档模拟 · 不调用模型</small>
              {data.simulation.playing
                ? <button key="stop" type="button" onClick={data.simulation.onStop} aria-label="停止模拟" title="停止模拟"><Square size={16} /></button>
                : <button key="send" type="submit" disabled={!data.simulation.draft.trim()} aria-label="发送模拟正文" title="发送模拟正文"><SendHorizontal size={18} /></button>}
            </div>
            <output aria-live="polite">{data.simulation.status}</output>
          </form>
        </> : shape === 'photo' ? <>
          <span className="am-photo"><img src={data.cardCover.src} srcSet={data.cardCover.srcSet} sizes="64px" width={data.cardCover.width} height={data.cardCover.height} alt="竖版角色卡封面示例" draggable={false} /></span>
          <span className="am-node-copy">{title}{summary}</span>
          <small className="am-photo-caption">原始字节与资源</small><span className="am-word-sticker am-card-sticker">CARD</span>
        </> : shape === 'ledger' ? <>
          <span className="am-ledger-heading"><Database size={16} /><small>{data.kind}</small></span>
          {title}{summary}
          <span className="am-ledger-rule" aria-hidden="true" />
        </> : shape === 'ticket' ? <>
          <span className="am-ticket-header">{title}<Icon size={20} /></span>
          {summary}
          <small className="am-ticket-footer">{data.kind} <span>↗ {regionLabels[data.region]}</span></small>
        </> : shape === 'conversation' ? <>
          <span className="am-conversation-icon" aria-hidden="true"><MessageCircle size={22} /></span>
          {title}{summary}
        </> : shape === 'permit' ? <>
          <span className="am-permit-seal" aria-hidden="true"><ShieldCheck size={28} /></span>
          <span className="am-node-copy">{title}{summary}</span>
          <small className="am-permit-label am-word-sticker">授权后执行</small>
        </> : shape === 'patch' ? <>
          {title}{summary}
          <span className="am-patch-footer"><Puzzle size={18} /><small>安装身份 · 能力</small></span>
          {data.id === 'host' && <span className="am-icon-sticker" aria-hidden="true"><Puzzle size={21} /></span>}
        </> : shape === 'signal' ? <>
          <span className="am-signal-header"><Cloud size={25} /><small>{data.region === 'external' ? 'NETWORK' : 'MODEL ROUTE'}</small></span>
          {title}{summary}
        </> : <>
          {title}{summary}
          <span className="am-note-footer"><small>{regionLabels[data.region]}</small><Icon size={16} /></span>
          {data.id === 'loop' && <span className="am-word-sticker am-run-sticker">RUN</span>}
        </>}
      </div>
      <Handle type="source" position={data.sourceSide} />
    </div>
  );
}

const systemPorts: Record<RegionId, { id: string; type: 'source' | 'target'; side: Position; offset: number }[]> = {
  client: [{ id: 'server', type: 'source', side: Position.Right, offset: 300 }],
  server: [
    { id: 'client', type: 'target', side: Position.Left, offset: 300 },
    { id: 'runtime', type: 'source', side: Position.Right, offset: 300 },
    { id: 'media', type: 'source', side: Position.Bottom, offset: 380 },
    { id: 'platform', type: 'target', side: Position.Bottom, offset: 620 },
  ],
  runtime: [
    { id: 'server', type: 'target', side: Position.Left, offset: 300 },
    { id: 'extensions', type: 'target', side: Position.Left, offset: 1000 },
    { id: 'data', type: 'source', side: Position.Bottom, offset: 300 },
    { id: 'model', type: 'source', side: Position.Bottom, offset: 600 },
  ],
  storage: [
    { id: 'media', type: 'target', side: Position.Top, offset: 590 },
    { id: 'domain', type: 'target', side: Position.Bottom, offset: 590 },
  ],
  extensions: [
    { id: 'runtime', type: 'source', side: Position.Right, offset: 160 },
    { id: 'platform', type: 'source', side: Position.Top, offset: 170 },
  ],
  external: [{ id: 'model', type: 'target', side: Position.Top, offset: 600 }],
};

function Region({ data }: NodeProps<RegionNode>) {
  return <div className={`am-group-label am-system-${data.region}`}>
    <button onClick={data.inspect} aria-label={`查看 ${data.title} 模块`}>
      <h2>{data.title}</h2><p>{data.subtitle}</p>
    </button>
    {data.region === 'storage' && <span className="am-word-sticker am-group-sticker">LOCAL FIRST</span>}
    {data.region === 'extensions' && <span className="am-word-sticker am-group-sticker">PLUG IN</span>}
    {systemPorts[data.region].map(port => <Handle key={port.id} id={port.id} type={port.type} position={port.side}
      style={port.side === Position.Top || port.side === Position.Bottom ? { left: port.offset } : { top: port.offset }} />)}
  </div>;
}

type SystemEdge = Edge<{ viaY?: number }, 'system'>;
function SystemConnection({ id, sourceX, sourceY, targetX, targetY, data, label, style, markerEnd }: EdgeProps<SystemEdge>) {
  const viaY = data?.viaY;
  const path = viaY === undefined ? `M${sourceX},${sourceY} L${targetX},${targetY}`
    : `M${sourceX},${sourceY} L${sourceX},${viaY} L${targetX},${viaY} L${targetX},${targetY}`;
  return <>
    <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />
    <EdgeLabelRenderer><span className="am-system-edge-label" style={{
      transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${viaY ?? (sourceY + targetY) / 2}px)`,
    }}>{label}</span></EdgeLabelRenderer>
  </>;
}

const nodeTypes = { detail: Detail, region: Region };
const edgeTypes = { system: SystemConnection };
// The overview uses system-boundary corridors; detailed calls remain in the journeys.
const systemConnections: SystemEdge[] = [
  { id: 'system-client-server', source: 'client', sourceHandle: 'server', target: 'server', targetHandle: 'client', label: 'HTTP · 文件 / RPC' },
  { id: 'system-server-runtime', source: 'server', sourceHandle: 'runtime', target: 'runtime', targetHandle: 'server', label: '领域调用' },
  { id: 'system-server-storage', source: 'server', sourceHandle: 'media', target: 'storage', targetHandle: 'media', label: '媒体字节写入', data: { viaY: 720 } },
  { id: 'system-runtime-storage', source: 'runtime', sourceHandle: 'data', target: 'storage', targetHandle: 'domain', label: '领域读写 · SQLite', data: { viaY: 1520 } },
  { id: 'system-extension-runtime', source: 'extensions', sourceHandle: 'runtime', target: 'runtime', targetHandle: 'extensions', label: '受控能力贡献' },
  { id: 'system-extension-server', source: 'extensions', sourceHandle: 'platform', target: 'server', targetHandle: 'platform', label: '平台能力注册', data: { viaY: 720 } },
  { id: 'system-runtime-provider', source: 'runtime', sourceHandle: 'model', target: 'external', targetHandle: 'model', label: '模型请求', style: { strokeDasharray: '8 6' } },
];
const connectionById = new Map(connections.map(connection => [connection.id, connection]));
const connectionKinds = { call: '调用', write: '写入', read: '读取', return: '返回' };
const regionColumns = { client: 2, server: 2, runtime: 2, storage: 3, extensions: 1, external: 1 };

const examples: Record<string, { title: string; text: string }> = {
  import: { title: 'Nom 的角色包', text: '假设选中 nom.loomcard.zip：媒体先保存为 Blob，随后导入 Card 与资源。此时还没有故事线或 Session。' },
  timeline: { title: '让 Nom 的故事开始', text: '从已导入的 Card 开始游玩，生成 Timeline、初始状态和 Opening；Agent 的工作历史仍独立存在。' },
  submit: { title: '“Nom，打开那本书。”', text: '这句话先成为 Narrative Input，再把该节点的身份交给 Session 创建 Run。投递失败不会抹去这句话。' },
  agent: { title: 'Nom 翻开书后的下一幕', text: '模型可请求授权工具来提交剧情。最终回复只是工作输出，不会自行变成下一段正文。' },
  extension: { title: '为故事加一个扩展', text: '假设安装一个扩展包：安装记录、资源导入、模块启用各自独立，安装成功不等于当前故事正在使用它。' },
};

function MapCanvas({ nom, cardCover }: MapProps) {
  const flow = useReactFlow<DetailNode | RegionNode, Edge>();
  const [view, setView] = useState<'modules' | 'flows'>('modules');
  const [journeyId, setJourneyId] = useState('import');
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedConcept, setSelectedConcept] = useState<string>();
  const [activeStep, setActiveStep] = useState<number>();
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draft, setDraft] = useState('Nom，打开那本书。');
  const [simulationStep, setSimulationStep] = useState<number>();
  const journey = view === 'flows' ? journeys.find(value => value.id === journeyId) : undefined;
  const concept = selectedConcept ? concepts[selectedConcept] : undefined;
  const simulationActive = journey?.id === 'submit' && simulationStep !== undefined;
  const simulationPlaying = simulationActive && simulationStep < journey.steps.length;
  const simulationStatus = !simulationActive ? 'Nom 的一轮故事 · 模拟'
    : simulationPlaying ? `${simulationStep + 1}/${journey.steps.length} · ${journey.steps[simulationStep].title}${simulationStep >= 4 ? ' · 正文已保存' : ''}`
      : '模拟完成 · 正文先保存，再进入 Agent Run';
  useEffect(() => {
    if (!simulationPlaying) return;
    // ponytail: 固定节拍仅用于文档演示；真实耗时与状态必须来自实际事件。
    const timer = window.setTimeout(() => setSimulationStep(simulationStep + 1), 950);
    return () => window.clearTimeout(timer);
  }, [simulationStep, simulationPlaying]);
  const selected = items.find(item => item.id === selectedId);
  const selectedRegion = regions.find(region => region.id === selectedId);
  const pathItems = new Set(journey?.steps.flatMap(step => {
    const edge = connectionById.get(step.edge)!;
    return [edge.source, edge.target];
  }) ?? []);
  const pathSequence = journey ? [
    connectionById.get(journey.steps[0].edge)!.source,
    ...journey.steps.map(step => connectionById.get(step.edge)!.target),
  ] : [];
  const sceneItems = journey ? pathSequence.map((id, index) => {
    const row = Math.floor(index / 3);
    const column = row % 2 ? 2 - index % 3 : index % 3;
    return {
      item: items.find(item => item.id === id)!,
      id: `step-node-${index}`,
      position: { x: 20 + column * 420, y: 40 + row * 310 },
      sourceSide: index % 3 === 2 ? Position.Bottom : row % 2 ? Position.Left : Position.Right,
      targetSide: index > 0 && index % 3 === 0 ? Position.Top : row % 2 ? Position.Right : Position.Left,
    };
  }) : items.map(item => {
    const index = items.filter(value => value.region === item.region).findIndex(value => value.id === item.id);
    const columns = regionColumns[item.region];
    return {
      item, id: item.id,
      position: { x: 40 + index % columns * 420, y: 120 + Math.floor(index / columns) * 260 },
      sourceSide: Position.Right, targetSide: Position.Left,
    };
  });
  const matches = query.trim() ? items.filter(item =>
    `${item.title} ${item.kind} ${item.summary} ${item.source.path}`.toLowerCase().includes(query.trim().toLowerCase()),
  ) : [];

  function focusNodes(ids: string[]) {
    const bounds = flow.getNodesBounds(ids);
    if (ids.length === 1) {
      void flow.setCenter(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2, { zoom: 1.15, duration: 320 });
    } else {
      void flow.fitBounds(bounds, { padding: 0.15, duration: 320 });
    }
  }

  function inspect(id: string, focus = false) {
    setSelectedId(id);
    setSelectedConcept(undefined);
    setSidebarOpen(true);
    if (focus) {
      const visible = sceneItems.find(record => record.item.id === id);
      if (visible) focusNodes([visible.id]);
      else {
        setView('modules');
        setActiveStep(undefined);
        const item = items.find(item => item.id === id)!;
        const region = regions.find(region => region.id === item.region)!;
        void flow.setCenter(region.x + region.width / 2, region.y + region.height / 2, { zoom: 1.15, duration: 320 });
      }
    }
  }

  function explain(term: string) {
    setSelectedConcept(term);
    setSelectedId(undefined);
    setSidebarOpen(true);
  }

  function chooseJourney(id: string) {
    setView(id === 'overview' ? 'modules' : 'flows');
    if (id !== 'overview') setJourneyId(id);
    setSelectedId(undefined);
    setSelectedConcept(undefined);
    setActiveStep(undefined);
    setQuery('');
    setSimulationStep(undefined);
    const chosen = journeys.find(value => value.id === id);
    if (chosen) {
      const rowCount = Math.ceil((chosen.steps.length + 1) / 3);
      void flow.fitBounds({ x: 20, y: 40, width: 1100, height: (rowCount - 1) * 310 + 140 }, { padding: 0.12, duration: 320 });
    } else {
      void flow.fitBounds({ x: 0, y: 0, width: 2840, height: 1940 }, { padding: 0.12, duration: 320 });
    }
  }

  const nodes: (DetailNode | RegionNode)[] = [
    ...(journey ? [] : regions.map(region => ({
      id: region.id, type: 'region' as const, position: { x: region.x, y: region.y },
      data: {
        region: region.id, title: region.title, subtitle: region.subtitle,
        inspect: () => { setSelectedId(region.id); setSelectedConcept(undefined); setSidebarOpen(true); },
      },
      style: { width: region.width, height: region.height },
      draggable: false, selectable: false, focusable: false,
    }))),
    ...sceneItems.map<DetailNode>((record, index) => ({
      id: record.id, type: 'detail' as const,
      parentId: journey ? undefined : record.item.region,
      position: record.position,
      data: {
        ...record.item,
        cardCover,
        explain,
        delivery: simulationActive ? index < simulationStep ? 'delivered' : index <= simulationStep + 1 ? 'processing' : 'waiting' : undefined,
        simulation: journey?.id === 'submit' && index === 0 ? {
          draft, onDraft: setDraft, onSend: () => { setSimulationStep(0); setActiveStep(undefined); },
          onStop: () => setSimulationStep(undefined), playing: simulationPlaying, status: simulationStatus,
        } : undefined,
        highlighted: Boolean(journey), inspected: selectedId === record.item.id,
        sourceSide: record.sourceSide, targetSide: record.targetSide,
        inspect: () => inspect(record.item.id),
      },
      draggable: false, selectable: false, focusable: false,
      style: { width: 260, height: journey?.id === 'submit' && index === 0 ? 230 : 140 },
    })),
  ];
  const edges: Edge[] = journey ? journey.steps.map((step, index) => {
    const connection = connectionById.get(step.edge)!;
    const current = simulationActive ? simulationStep === index : activeStep === index;
    const color = 'var(--am-highlight)';
    return {
      id: connection.id, source: `step-node-${index}`, target: `step-node-${index + 1}`, type: 'smoothstep',
      label: `${index + 1} · ${step.title}`,
      animated: false, selectable: false, focusable: false,
      className: simulationActive ? current ? 'am-signal-current' : index < simulationStep ? 'am-signal-done' : 'am-signal-waiting' : undefined,
      ariaLabel: `${connectionKinds[connection.kind]}：${connection.label}`,
      zIndex: 1,
      markerEnd: { type: MarkerType.ArrowClosed, color },
      style: {
        stroke: color, strokeWidth: current ? 4 : connection.kind === 'write' ? 3 : 2,
        strokeDasharray: simulationActive && current ? '12 7' : connection.kind === 'return' ? '8 5' : connection.kind === 'read' ? '2 5' : undefined,
      },
      labelStyle: { fill: 'var(--am-ink)', fontSize: 12, fontWeight: 600 },
      labelBgStyle: { fill: 'var(--am-paper)' },
      labelBgPadding: [7, 4] as [number, number],
      labelBgBorderRadius: 3,
    };
  }) : systemConnections.map(edge => ({
    ...edge, type: 'system', selectable: false, focusable: false,
    ariaLabel: String(edge.label), zIndex: 0,
    markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--am-line)' },
    style: { stroke: 'var(--am-line)', strokeWidth: 2, ...edge.style },
  }));

  return (
    <main className="am-app" data-sidebar-open={sidebarOpen} data-simulation-step={simulationStep ?? 'idle'}>
      <button className="am-sidebar-toggle" aria-label={sidebarOpen ? '收起侧栏' : '展开侧栏'} title={sidebarOpen ? '收起侧栏' : '展开侧栏'} aria-expanded={sidebarOpen} aria-controls="architecture-sidebar" onClick={() => setSidebarOpen(open => !open)}>
        {sidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
      </button>
      <header className="am-toolbar">
        <div className="am-brand">
          <img src="/brand/website_logo.png" width="26" height="26" alt="" />
          <h1>Loom Studio <span>架构地图</span></h1>
        </div>
        <nav className="am-view-switch" aria-label="架构视图">
          <button type="button" aria-pressed={view === 'modules'} onClick={() => chooseJourney('overview')}><MapIcon size={15} />全局模块</button>
          <button type="button" aria-pressed={view === 'flows'} onClick={() => chooseJourney(journeyId)}><Workflow size={15} />操作流程</button>
        </nav>
        {journey && <nav className="am-journeys" aria-label="架构路径">
          {journeys.map(value => <button key={value.id} type="button" aria-pressed={journeyId === value.id} onClick={() => chooseJourney(value.id)}>{value.title}</button>)}
        </nav>}
        <div className="am-search">
          <Search size={15} aria-hidden="true" />
          <input
            aria-label="搜索架构节点" placeholder="搜索节点…" value={query}
            onChange={event => setQuery(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Escape') setQuery('');
              if (event.key === 'Enter' && matches.length) { inspect(matches[0].id, true); setQuery(''); }
            }}
          />
          {query && <button aria-label="清空搜索" title="清空搜索" onClick={() => setQuery('')}><X size={14} /></button>}
          {query.trim() && <div className="am-search-results" aria-label="搜索结果">
            {matches.length ? matches.map(item => <button key={item.id} onClick={() => { inspect(item.id, true); setQuery(''); }}>
              <strong>{item.title}</strong><span>{item.kind}</span>
            </button>) : <p role="status">没有匹配的节点</p>}
          </div>}
        </div>
      </header>

      <div className="am-workspace">
        <section className="am-canvas" aria-label="交互式架构图">
          <ReactFlow<DetailNode | RegionNode, Edge>
            nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
            fitView fitViewOptions={{ padding: 0.08 }} minZoom={0.15} maxZoom={1.8}
            nodesDraggable={false} nodesConnectable={false} nodesFocusable={false}
            edgesFocusable={false} elementsSelectable={false}
            deleteKeyCode={null} panOnScroll selectionOnDrag={false}
            onMove={(_, viewport) => setZoom(viewport.zoom)}
            onPaneClick={() => { setSelectedId(undefined); setSelectedConcept(undefined); }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--am-grid)" />
            <Panel position="bottom-left" className="am-controls">
              <button aria-label="缩小" title="缩小" onClick={() => void flow.zoomOut({ duration: 180 })}><Minus size={17} /></button>
              <output aria-label="缩放比例">{Math.round(zoom * 100)}%</output>
              <button aria-label="放大" title="放大" onClick={() => void flow.zoomIn({ duration: 180 })}><Plus size={17} /></button>
              <span className="am-control-divider" />
              <button aria-label="适应当前视图" title="适应当前视图" onClick={() => focusNodes(journey ? sceneItems.map(record => record.id) : regions.map(region => region.id))}><Focus size={17} /></button>
            </Panel>
          </ReactFlow>
        </section>

        <aside className="am-sidebar" id="architecture-sidebar" aria-label="架构说明">
          <div className="am-sidebar-heading">
            <span>{concept ? '数据概念' : selected ? '模块详情' : selectedRegion ? '系统模块' : journey ? '操作路径' : '架构总览'}</span>
          </div>
          <div className="am-sidebar-scroll">
            {concept ? <>
              <button className="am-back" onClick={() => setSelectedConcept(undefined)}><ArrowLeft size={14} />返回{journey ? '路径' : '总览'}</button>
              <h2>{selectedConcept}</h2><p className="am-lead">{concept.summary}</p>
              <section><p>{concept.detail}</p></section>
              <section className="am-model"><h3>结构示例 · 字段节选</h3><pre><code>{JSON.stringify(concept.example, null, 2)}</code></pre><p>示例身份与正文是虚构的，不是正在运行的数据。</p></section>
              <section><h3>字段含义</h3><dl className="am-model-fields">{concept.fields.map(field => <div key={field.name}><dt>{field.name}</dt><dd>{field.meaning}</dd></div>)}</dl></section>
              <section className="am-source"><h3>源码依据</h3><code>{concept.source.path}:{concept.source.line}</code><a href={sourceUrl(concept.source)} target="_blank" rel="noreferrer">查看公开基线 <ArrowUpRight size={14} /></a><p>{snapshot.note}</p></section>
            </> : selected ? <>
              <button className="am-back" onClick={() => setSelectedId(undefined)}><ArrowLeft size={14} />{journey ? '返回路径' : '返回总览'}</button>
              <p className={`am-category am-region-${selected.region}`}>{selected.kind}</p>
              <h2>{selected.title}</h2>
              <p className="am-lead">{selected.summary}</p>
              <section><h3>当前职责</h3><p><TermText text={selected.detail} explain={explain} /></p></section>
              <section className="am-boundary"><h3>边界</h3><p><TermText text={selected.boundary} explain={explain} /></p></section>
              <section>
                <h3>关联节点</h3>
                <div className="am-neighbors">{connections.filter(edge => edge.source === selected.id || edge.target === selected.id).map(edge => {
                  const outgoing = edge.source === selected.id;
                  const other = items.find(item => item.id === (outgoing ? edge.target : edge.source))!;
                  return <button key={edge.id} onClick={() => inspect(other.id, true)}>
                    <span>{outgoing ? '→' : '←'} {other.title}</span><small>{edge.label}</small>
                  </button>;
                })}</div>
              </section>
              <section className="am-source">
                <h3>源码依据</h3>
                <code>{selected.source.path}:{selected.source.line}</code>
                <a href={sourceUrl(selected.source)} target="_blank" rel="noreferrer">查看公开基线 <ArrowUpRight size={14} /></a>
                <p>{snapshot.note}</p>
              </section>
            </> : selectedRegion ? <>
              <button className="am-back" onClick={() => setSelectedId(undefined)}><ArrowLeft size={14} />返回总览</button>
              <h2>{selectedRegion.title}</h2>
              <p className="am-lead">{selectedRegion.subtitle}</p>
              <section><h3>当前模块</h3><div className="am-node-index">{items.filter(item => item.region === selectedRegion.id).map(item =>
                <button key={item.id} onClick={() => inspect(item.id, true)}>{item.title}<ChevronRight size={14} /></button>,
              )}</div></section>
            </> : journey ? <>
              <h2>{journey.title}</h2>
              <p className="am-lead">{journey.summary}</p>
              <section className="am-example">
                <img src={nom.src} srcSet={nom.srcSet} sizes="72px" width="72" height="72" alt="抱着书的 Nom" />
                <div><h3>示例 · {examples[journey.id].title}</h3><p>{examples[journey.id].text}</p></div>
              </section>
              <section className="am-boundary"><h3>先记住这个边界</h3><p><TermText text={journey.boundary} explain={explain} /></p></section>
              <ol className="am-steps">
                {journey.steps.map((step, index) => <li key={step.edge}>
                  <button className={activeStep === index ? 'is-active' : ''} aria-pressed={activeStep === index} onClick={() => {
                    setActiveStep(index);
                    focusNodes([`step-node-${index}`, `step-node-${index + 1}`]);
                  }}>
                    <span className="am-step-number">{index + 1}</span>
                    <span><strong>{step.title}</strong><span>{step.detail}</span></span>
                  </button>
                </li>)}
              </ol>
              <section><h3>路径节点</h3><div className="am-node-index">{items.filter(item => pathItems.has(item.id)).map(item =>
                <button key={item.id} onClick={() => inspect(item.id, true)}>{item.title}<ChevronRight size={14} /></button>,
              )}</div></section>
            </> : <>
              <div className="am-nom-intro"><img src={nom.src} srcSet={nom.srcSet} sizes="110px" width="110" height="110" alt="Nom 抱着故事书" /><span>Nom 的创作小地图</span></div>
              <h2>从界面到数据，<br />Loom 如何运转</h2>
              <p className="am-lead">本地优先的创作系统。故事、智能体工作和上下文装配，各自有明确的权威边界。</p>
              <section className="am-facts">
                <h3>三个关键区别</h3>
                <p><strong>故事 ≠ 聊天记录</strong>Narrative Timeline 保存剧情；Agent Session 保存执行与工作历史。</p>
                <p><strong>文件 ≠ 运行数据库</strong>SQLite 保存可修改、可关联的状态；Blob 保存原始字节。</p>
                <p><strong>本地 ≠ 不出网</strong>所选模型 Provider 会收到本轮构建的上下文，不直接访问本地数据库。</p>
              </section>
              <section><h3>操作路径</h3><div className="am-overview-paths">{journeys.map(value =>
                <button key={value.id} onClick={() => chooseJourney(value.id)}><span><strong>{value.title}</strong><small>{value.summary}</small></span><ChevronRight size={16} /></button>,
              )}</div></section>
              <section><h3>数据概念</h3><div className="am-concept-list">{Object.keys(concepts).map(term => <button key={term} onClick={() => explain(term)}>{term}<ChevronRight size={14} /></button>)}</div></section>
              <section className="am-boundary"><h3>尚未覆盖</h3><p>未完成 Run 的重启恢复、Client Renderer 细节及摘要内部流程不在这张首版地图中。注册、付款、Convex、Modal 与 R2 不是本图描述的架构。</p></section>
            </>}
          </div>
          <footer className="am-snapshot"><span>核对于 {snapshot.date}</span><span>本地工作区 · 只读文档</span></footer>
        </aside>
      </div>
      <footer className="am-status">
        <span><i />{simulationActive ? simulationStatus : `${journey?.title ?? '系统总览'} · ${journey ? `${journey.steps.length} 个步骤` : `${regions.length} 个分区 / ${items.length} 个模块`}`}</span>
        <span className="am-legend"><b />调用<b className="am-write-line" />数据写入<em className="am-read-line" />读取<em />返回 / Replay</span>
      </footer>
    </main>
  );
}

export default function ArchitectureMap(props: MapProps) {
  return <ReactFlowProvider><MapCanvas {...props} /></ReactFlowProvider>;
}
