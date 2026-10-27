import { useId } from 'react'
import parts from './loom-mark.json'

export { parts as loomMarkParts }

export function LoomMarkPaint({ prefix }: { prefix: string }) {
  return <defs>{parts.map(({ id, gradient: g }) => {
    const stops = g.stops.map((stop, index) => <stop key={index} offset={stop.offset} stopColor={stop.color} />)
    return 'cx' in g
      ? <radialGradient key={id} id={`${prefix}-${id}`} gradientUnits="userSpaceOnUse" cx={g.cx} cy={g.cy} r={g.r}>{stops}</radialGradient>
      : <linearGradient key={id} id={`${prefix}-${id}`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>{stops}</linearGradient>
  })}</defs>
}

export default function LoomMark() {
  const id = useId()
  return <svg viewBox="0 0 1254 1254" role="img" aria-label="Loom 环形标志，透明镂空">
    <LoomMarkPaint prefix={id} />
    {parts.map(part => <path key={part.id} d={part.d} fill={`url(#${id}-${part.id})`} fillRule="evenodd" />)}
  </svg>
}
