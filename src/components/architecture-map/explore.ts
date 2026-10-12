import type { Connection } from './map-data';

export type ReachDirection = 'direct' | 'upstream' | 'downstream';

// Follow authored arrows, including returns. These routes describe the map,
// not runtime causality or a dependency impact analysis.
export function exploreConnections(root: string, direction: ReachDirection, edges: readonly Connection[]) {
  const routes = new Map<string, Connection[]>();
  const queue = [root];
  const visited = new Set([root]);
  for (let index = 0; index < queue.length; index++) {
    const current = queue[index];
    for (const edge of edges) {
      const outgoing = edge.source === current;
      const incoming = edge.target === current;
      if (direction === 'upstream' ? !incoming : direction === 'downstream' ? !outgoing : !incoming && !outgoing) continue;
      const next = outgoing && direction !== 'upstream' ? edge.target : edge.source;
      if (visited.has(next)) continue;
      visited.add(next);
      const previous = routes.get(current) ?? [];
      routes.set(next, direction === 'upstream' ? [edge, ...previous] : [...previous, edge]);
      if (direction !== 'direct') queue.push(next);
    }
  }
  return routes;
}
