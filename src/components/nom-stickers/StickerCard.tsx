import { useIsPresent, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight } from 'lucide-react'
import type { DisplayImage } from '../../lib/site-images'
import type { Ref } from 'react'
import type entries from '../../data/nom-stickers.json'

type Entry = (typeof entries)[number] & { image: DisplayImage }

export default function StickerCard({ entry, index, selected, onSelect, ref }: {
  entry: Entry; index: number; selected: boolean; onSelect: () => void; ref?: Ref<HTMLElement>
}) {
  const present = useIsPresent()
  const reducedMotion = useReducedMotion()
  return <m.article ref={ref} layout="position" className="nom-card" data-selected={selected}
    inert={!present} aria-hidden={!present}
    initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }} animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.96 }}
    transition={{ duration: reducedMotion ? 0 : 0.18, layout: { type: 'spring', stiffness: 320, damping: 32 } }}>
    <button className="nom-card__choose" type="button" aria-pressed={selected}
      aria-label={`预览：${entry.title}`} onClick={onSelect}>
      <span className="nom-card__art nom-canvas"><img src={entry.image.src} srcSet={entry.image.srcSet}
        sizes="(max-width: 600px) 40vw, (max-width: 1000px) 25vw, 220px"
        width={entry.image.width} height={entry.image.height} alt="" loading="lazy" decoding="async" /></span>
      <span className="nom-card__title"><small>{String(index + 1).padStart(2, '0')}</small>{entry.title}</span>
    </button>
    <div className="nom-card__footer">
      <span>{entry.usage[0]}</span>
      <a href={`/images/nom/stickers/${entry.file}`} download={`nom-${entry.file.replace('/', '-')}`} aria-label={`下载${entry.title}原图`}>
        PNG <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
  </m.article>
}
