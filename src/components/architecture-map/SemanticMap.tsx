import { MapSidebar } from './MapSidebar';
import { useState } from 'react';
import { Background, BackgroundVariant, BaseEdge, EdgeLabelRenderer, Handle, MarkerType, Panel, Position, ReactFlow, useReactFlow, type Edge, type EdgeProps, type Node, type NodeProps } from '@xyflow/react';
import { ArrowUpRight, Check, CircleStop, Cloud, Database, FileText, Focus, GitBranch, Hourglass, MessageCircle, Minus, PanelRightClose, PanelRightOpen, Play, Plus, Server, ShieldCheck } from 'lucide-react';
import { MapColorLegend, categoryLabels } from './MapColorLegend';
import { snapshot, sourceUrl } from './map-data';
import { MapViewTabs, type MapView } from './MapViewTabs';
import type { SceneEdge, SceneNode, SemanticScene, Side } from './semantic-scenes';
import type { DisplayImage } from '../../lib/site-images';

type CardPort = { id: string; type: 'source' | 'target'; side: Side; offset: number };
type CardNode = Node<{ record: SceneNode; ports: CardPort[]; active: boolean; inspect: () => void }, 'card'>;
type FrameNode = Node<{ title: string; note: string }, 'frame'>;
type LineNode = Node<Record<string, never>, 'lifeline'>;
type DiagramEdge = Edge<{ record: SceneEdge; inspect: () => void; active: boolean; startX: number; endX: number }, 'relation'>;
const sides: Record<Side, Position> = { left: Position.Left, right: Position.Right, top: Position.Top, bottom: Position.Bottom };
const roles = { step: '执行阶段', decision: '条件分支', data: '数据', state: '状态', participant: '参与者' };
const kinds = { main: '主链', branch: '条件 / 异常', return: '返回 / 继续', write: '写入 / 留存', read: '读取' };
// Shapes describe the node itself; a finished execution phase is not a terminal Run state.
function cardAppearance(n: SceneNode) {
  if (n.role === 'state') {
    if (n.outcome === 'success') return { shape: 'terminal', Icon: Check };
    if (n.outcome === 'failure') return { shape: 'terminal', Icon: CircleStop };
    if (n.outcome === 'waiting') return { shape: 'waiting', Icon: Hourglass };
    return { shape: 'active', Icon: Play };
  }
  if (n.category === 'waiting') return { shape: 'receipt', Icon: FileText };
  if (n.category === 'storage') return { shape: 'ledger', Icon: Database };
  if (n.category === 'tool') return { shape: 'permit', Icon: ShieldCheck };
  if (n.category === 'external') return { shape: 'signal', Icon: Cloud };
  if (n.category === 'client') return { shape: 'conversation', Icon: MessageCircle };
  if (n.category === 'server') return { shape: 'ticket', Icon: Server };
  if (n.role === 'decision') return { shape: 'decision', Icon: GitBranch };
  return { shape: 'note', Icon: FileText };
}
function Card({ data }: NodeProps<CardNode>) {
  const n = data.record;
  const { shape, Icon } = cardAppearance(n);
  return <div data-category={n.category} className={`am-semantic-card am-shape-${shape} ${data.active ? 'is-inspected' : ''}`}>
    {data.ports.map(port => <Handle key={port.id} id={port.id} type={port.type} position={sides[port.side]}
      style={port.side === 'left' || port.side === 'right' ? { top: `${port.offset * 100}%` } : { left: `${port.offset * 100}%` }} />)}
    <button className="am-semantic-content nodrag nopan" onClick={data.inspect} aria-label={`查看 ${n.title}`} aria-pressed={data.active}>
      <small>{categoryLabels[n.category]} · {roles[n.role]}</small>
      <span className="am-semantic-symbol" aria-hidden="true"><Icon size={22} strokeWidth={1.6} /></span>
      <strong>{n.title}</strong><span className="am-semantic-summary">{n.summary}</span>
    </button>
  </div>;
}
function Frame({ data }: NodeProps<FrameNode>) { return <div className="am-semantic-frame"><strong>{data.title}</strong><span>{data.note}</span></div>; }
function Lifeline() { return <div className="am-semantic-lifeline" />; }
function Relation({ id, data, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps<DiagramEdge>) {
  const { record: e, inspect, active, startX, endX } = data!;
  const points: [number, number][] = e.messageY === undefined
    ? [[sourceX, sourceY], ...(e.via ?? []), [targetX, targetY]]
    : [[startX, e.messageY], [endX, e.messageY]];
  const path = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const mid = Math.floor((points.length - 1) / 2);
  const label = e.labelAt ?? [(points[mid][0] + points[mid + 1][0]) / 2, (points[mid][1] + points[mid + 1][1]) / 2];
  return <><BaseEdge id={id} path={path} markerEnd={markerEnd} style={{ stroke: active ? 'var(--am-highlight)' : 'var(--am-line)', strokeWidth: active ? 3 : 1.8, strokeDasharray: e.kind === 'return' ? '7 5' : e.kind === 'branch' ? '3 5' : undefined }} />
    <EdgeLabelRenderer><button className={`am-semantic-edge nodrag nopan ${active ? 'is-inspected' : ''}`} style={{ transform: `translate(-50%, -50%) translate(${label[0]}px, ${label[1]}px)` }} onClick={inspect} aria-label={`查看连线 ${e.label}`} aria-pressed={active}>{e.label}</button></EdgeLabelRenderer></>;
}
const nodeTypes = { card: Card, frame: Frame, lifeline: Lifeline };
const edgeTypes = { relation: Relation };
export function SemanticMap({ scene, nomGuide, onViewChange }: { scene: SemanticScene; nomGuide: DisplayImage; onViewChange: (view: MapView) => void }) {
  const flow = useReactFlow();
  const [selected, setSelected] = useState<{ type: 'node' | 'edge'; id: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(1);
  const inspect = (type: 'node' | 'edge', id: string) => { setSelected({ type, id }); setSidebarOpen(true); };
  const node = selected?.type === 'node' ? scene.nodes.find(n => n.id === selected.id) : undefined;
  const edge = selected?.type === 'edge' ? scene.edges.find(e => e.id === selected.id) : undefined;
  const evidence = node ?? edge;
  const nodes: (CardNode | FrameNode | LineNode)[] = [
    ...scene.frames.map(f => ({ id: `frame-${f.id}`, type: 'frame' as const, position: { x: f.x, y: f.y }, data: f, style: { width: f.width, height: f.height }, zIndex: -2, selectable: false })),
    ...(scene.id === 'sequence' ? scene.nodes.map(n => ({ id: `line-${n.id}`, type: 'lifeline' as const, position: { x: n.x + 120, y: n.y + 112 }, data: {}, style: { width: 1, height: scene.height - n.y - 150 }, zIndex: -1 })) : []),
    ...scene.nodes.map(n => ({ id: n.id, type: 'card' as const, position: { x: n.x, y: n.y }, data: { record: n,
      ports: scene.edges.flatMap<CardPort>(e => [
        ...(e.from === n.id ? [{ id: `${e.id}-source`, type: 'source' as const, side: e.fromSide ?? 'right', offset: e.fromOffset ?? .5 }] : []),
        ...(e.to === n.id ? [{ id: `${e.id}-target`, type: 'target' as const, side: e.toSide ?? 'left', offset: e.toOffset ?? .5 }] : []),
      ]),
      active: node?.id === n.id || edge?.from === n.id || edge?.to === n.id, inspect: () => inspect('node', n.id) }, style: { width: 240, height: 112 } })),
  ];
  const edges: DiagramEdge[] = scene.edges.map(e => ({ id: e.id, source: e.from, target: e.to, type: 'relation', sourceHandle: `${e.id}-source`, targetHandle: `${e.id}-target`, markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--am-line)' }, data: { record: e, inspect: () => inspect('edge', e.id), active: edge?.id === e.id, startX: scene.nodes.find(n => n.id === e.from)!.x + 120, endX: scene.nodes.find(n => n.id === e.to)!.x + 120 } }));
  return <main className="am-app am-semantic" data-sidebar-open={sidebarOpen}>
    <button className="am-sidebar-toggle" aria-label={sidebarOpen ? '收起侧栏' : '展开侧栏'} aria-expanded={sidebarOpen} aria-controls="architecture-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}</button>
    <header className="am-toolbar"><div className="am-brand"><img src="/brand/website_logo.png" width="26" height="26" alt="" /><h1>Loom Studio <span>架构地图</span></h1></div><MapViewTabs view={scene.id} onChange={onViewChange} /></header>
    <div className="am-workspace"><section className="am-canvas" aria-label={scene.title}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView fitViewOptions={{ padding: .16 }} minZoom={.15} maxZoom={1.8} nodesDraggable={false} nodesConnectable={false} nodesFocusable={false} edgesFocusable={false} elementsSelectable={false} deleteKeyCode={null} panOnScroll onPaneClick={() => setSelected(undefined)} onMove={(_, v) => setZoom(v.zoom)}>
        <Panel position="bottom-right" className="am-color-panel"><MapColorLegend categories={[...new Set(scene.nodes.map(n => n.category))]} states={scene.id === 'lifecycle'} /></Panel>
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="var(--am-grid)" />
        <Panel position="bottom-left" className="am-controls"><button aria-label="缩小" onClick={() => void flow.zoomOut()}><Minus size={17} /></button><output aria-label="缩放比例">{Math.round(zoom * 100)}%</output><button aria-label="放大" onClick={() => void flow.zoomIn()}><Plus size={17} /></button><button aria-label="适应当前视图" onClick={() => void flow.fitView({ padding: .16, duration: 180 })}><Focus size={17} /></button></Panel>
      </ReactFlow></section>
      <MapSidebar open={sidebarOpen}><div className="am-sidebar-heading"><span>{node ? roles[node.role] : edge ? '连线依据' : '阅读此图'}</span></div><div className="am-sidebar-scroll">
        {evidence ? <><button className="am-back" onClick={() => setSelected(undefined)}>返回图解</button><h2>{node?.title ?? edge?.label}</h2>{edge && <p className="am-lead">{scene.nodes.find(n => n.id === edge.from)!.title} → {scene.nodes.find(n => n.id === edge.to)!.title}</p>}<p>{evidence.detail}</p><section className="am-source"><h3>源码依据</h3><code>{evidence.source.path}:{evidence.source.line}–{evidence.source.endLine}</code><a href={sourceUrl(evidence.source)} target="_blank" rel="noreferrer">查看固定提交 <ArrowUpRight size={14} /></a></section></> : <><div className="am-nom-guide"><img src={nomGuide.src} srcSet={nomGuide.srcSet} sizes="80px" width={nomGuide.width} height={nomGuide.height} alt="" draggable={false} /><h2>{scene.title}</h2></div><p className="am-lead">{scene.question}</p><p>点击节点查看职责，点击连线查看条件与源码依据。可拖动画布、滚动平移和缩放。</p><section><h3>图中关系</h3><div className="am-node-index">{scene.edges.map(e => <button key={e.id} onClick={() => inspect('edge', e.id)}>{e.label}<small>{kinds[e.kind]}</small></button>)}</div></section></>}
        <section className="am-boundary"><h3>解释边界</h3><p>{scene.boundary}</p></section>
      </div><footer className="am-snapshot"><span>核对于 {snapshot.date}</span><span>{snapshot.baseline.slice(0, 7)} · 只读源码图解</span></footer></MapSidebar>
    </div><footer className="am-status"><span><i />{scene.title} · {scene.nodes.length} 节点 / {scene.edges.length} 关系</span><span>实线：主链 / 数据 · 点线：条件 · 虚线：返回</span></footer>
  </main>;
}
