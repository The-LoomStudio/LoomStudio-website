import { useId, useState } from 'react'
import { AnimatePresence, LayoutGroup, domMax, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowDownToLine } from 'lucide-react'
import SiteMotion from '../motion/SiteMotion'
import type { DisplayImage } from '../../lib/site-images'
import type stickerEntries from '../../data/nom-stickers.json'
import { localizeStickerEntry } from '../../data/nom-stickers-i18n'
import type { SiteLocale } from '../../lib/i18n'
import { getStickersCopy } from '../../lib/i18n'
import StickerCard from './StickerCard'
import './nom-stickers.css'

type Entry = (typeof stickerEntries)[number] & { image: DisplayImage }
const original = (entry: Entry) => `/images/nom/stickers/${entry.file}`

export default function NomStickerGallery({ entries: rawEntries, locale = 'zh-CN' }: { entries: Entry[]; locale?: SiteLocale }) {
  const copy = getStickersCopy(locale).gallery
  const entries = rawEntries.map(entry => localizeStickerEntry(entry, locale))
  const layoutId = useId()
  const [selected, setSelected] = useState(entries[0])
  const [group, setGroup] = useState('all')
  const [background, setBackground] = useState('checker')
  const [side, setSide] = useState('right')
  const [text, setText] = useState(entries[0].sampleText)
  const reducedMotion = useReducedMotion()
  const visible = entries.filter(entry => group === 'all' || entry.group === group)

  function select(entry: Entry) {
    setSelected(entry)
    setText(entry.sampleText)
  }

  const groupLabel = copy.groups.find(g => g.id === selected.group)?.title ?? (selected.group === 'fullbody' ? copy.groups[2].title : copy.groups[1].title)

  return <SiteMotion features={domMax}><LayoutGroup id={layoutId}>
    <div className="nom-gallery" data-background={background}>
      <section className="nom-preview" aria-label={copy.previewSectionAria}>
        <div className="nom-preview__stage nom-canvas">
          <span className="nom-preview__label">{copy.label}</span>
          <div className="nom-scene" data-side={side}>
            <m.div layout="position" className="nom-scene__character" transition={{ type: 'spring', stiffness: 280, damping: 30 }}>
              <AnimatePresence mode="wait" initial={false}>
                <m.img key={selected.id} src={selected.image.src} srcSet={selected.image.srcSet}
                  sizes="(max-width: 600px) 160px, 280px" width={selected.image.width} height={selected.image.height}
                  alt={selected.title} decoding="async"
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.14 }} />
              </AnimatePresence>
            </m.div>
            {text && <m.p layout="position" className="nom-scene__bubble" transition={{ type: 'spring', stiffness: 280, damping: 30 }}>{text}</m.p>}
          </div>
          <div className="nom-controls nom-preview__background" role="group" aria-label={copy.previewBackgroundAria}>
            {copy.backgrounds.map(item => <button key={item.id} type="button" aria-pressed={background === item.id}
              onClick={() => setBackground(item.id)}>{item.title}</button>)}
          </div>
        </div>
        <div className="nom-preview__editor">
          <div>
            <p className="eyebrow">{groupLabel}</p>
            <h2 aria-live="polite">{selected.title}</h2>
            <p className="nom-preview__usage">{selected.usage.join(' · ')}</p>
            <a className="nom-original" href={original(selected)} download={`nom-${selected.file.replace('/', '-')}`}>
              <ArrowDownToLine size={16} aria-hidden="true" /> {copy.downloadOriginal}
            </a>
          </div>
          <div>
            <label htmlFor="nom-bubble-text">{copy.bubbleLabel}</label>
            <textarea id="nom-bubble-text" value={text} onChange={event => setText(event.target.value)}
              rows={2} maxLength={160} aria-describedby="nom-bubble-note" />
            <div className="nom-preview__editor-bottom">
              <div className="nom-controls" role="group" aria-label={copy.bubblePositionAria}>
                {copy.sides.map(item =>
                  <button key={item.id} type="button" aria-pressed={side === item.id} onClick={() => setSide(item.id)}>{item.title}</button>)}
              </div>
              <small id="nom-bubble-note">{copy.bubbleNote}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="nom-collection" aria-labelledby="nom-collection-title">
        <div className="nom-collection__heading">
          <div><h2 id="nom-collection-title">{copy.collectionTitle}</h2></div>
          <span role="status">{copy.collectionCount(visible.length, entries.length)}</span>
        </div>
        <div className="nom-controls nom-filters" role="group" aria-label={copy.filterAria}>
          {copy.groups.map(item => <button key={item.id} type="button" aria-pressed={group === item.id}
            onClick={() => setGroup(item.id)}>
              {group === item.id && <m.i className="nom-filter-highlight" layoutId="filter" aria-hidden="true"
                transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
              <b>{item.title}</b><span>{item.id === 'all' ? entries.length : entries.filter(entry => entry.group === item.id).length}</span></button>)}
        </div>
        <div className="nom-grid">
          <AnimatePresence initial={false} mode="popLayout">
            {entries.map((entry) => (group === 'all' || entry.group === group) &&
              <StickerCard key={entry.id} entry={entry} selected={selected.id === entry.id} onSelect={() => select(entry)} locale={locale} />)}
          </AnimatePresence>
        </div>
      </section>
    </div>
  </LayoutGroup></SiteMotion>
}
