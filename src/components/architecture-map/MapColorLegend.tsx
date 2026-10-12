export const categoryLabels = {
  client: '前端界面', server: '服务入口', runtime: '运行编排', storage: '数据 / 记录',
  extensions: '扩展能力', external: '外部模型', tool: '工具执行', decision: '条件判断',
  active: '执行中', waiting: '暂停 / 放弃', success: '成功结束', failure: '取消 / 失败',
};
export type MapCategory = keyof typeof categoryLabels;
export function MapColorLegend({ categories, states = false }: { categories: MapCategory[]; states?: boolean }) {
  return <div className="am-color-legend" aria-label={states ? '状态颜色图例' : '职责颜色图例'}>
    <strong>{states ? '状态' : '职责'}</strong>{categories.map(category => <span key={category} data-category={category}><i aria-hidden="true" />{categoryLabels[category]}</span>)}
  </div>;
}
