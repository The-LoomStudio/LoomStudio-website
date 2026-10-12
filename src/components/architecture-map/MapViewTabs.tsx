import type { SceneKind } from './semantic-scenes';
export type MapView = 'modules' | 'flows' | SceneKind;
export const viewLabels: Record<MapView, string> = { modules: '全局模块', flows: '逐步导览', workflow: '工作流', dataflow: '数据流', lifecycle: '生命周期', sequence: '调用时序' };
export function MapViewTabs({ view, onChange }: { view: MapView; onChange: (view: MapView) => void }) {
  return <nav className="am-view-switch" aria-label="架构视图">{(Object.keys(viewLabels) as MapView[]).map(id =>
    <button key={id} type="button" aria-pressed={view === id} onClick={() => onChange(id)}>{viewLabels[id]}</button>)}</nav>;
}
