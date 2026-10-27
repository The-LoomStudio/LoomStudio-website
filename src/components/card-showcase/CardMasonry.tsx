import { memo, useEffect, useRef, useState } from 'react'
import './card-showcase.css'
import ZoomImage from '../illustration/ZoomImage'
import type { DisplayImage } from '../../lib/site-images'

const portraitCards = [
  { src: '/images/cards/display/card-001.png', alt: '角色卡展示图一' },
  { src: '/images/cards/display/card-002.png', alt: '角色卡展示图二' },
  { src: '/images/cards/display/card-003.png', alt: '角色卡展示图三' },
  { src: '/images/cards/display/card-004.png', alt: '角色卡展示图四' },
  { src: '/images/cards/display/card-005.png', alt: '角色卡展示图五' },
  { src: '/images/cards/display/card-006.png', alt: '角色卡展示图六' },
  { src: '/images/cards/display/card-007.png', alt: '角色卡展示图七' },
  { src: '/images/cards/display/card-008.png', alt: '角色卡展示图八' },
  { src: '/images/cards/display/card-009.png', alt: '角色卡展示图九' },
  { src: '/images/cards/display/card-010.png', alt: '角色卡展示图十' },
  { src: '/images/cards/display/card-011.png', alt: '角色卡展示图十一' },
  { src: '/images/cards/display/card-012.png', alt: '角色卡展示图十二' },
  { src: '/images/cards/display/card-013.png', alt: '角色卡展示图十三' },
  { src: '/images/cards/display/card-014.png', alt: '角色卡展示图十四' },
  { src: '/images/cards/display/card-015.png', alt: '角色卡展示图十五' },
  { src: '/images/cards/display/card-016.png', alt: '角色卡展示图十六' },
  { src: '/images/cards/display/card-017.png', alt: '角色卡展示图十七' },
  { src: '/images/cards/display/card-018.png', alt: '角色卡展示图十八' },
]

const landscapeCards = [
  {
    "src": "/images/cards_wide/1.45__minaba_hideo____0.6__ogipote____0.75__casino_casinoep____0.7__houkis_s-2615832345_4.png",
    "alt": "向日葵花田中的女孩"
  },
  {
    "src": "/images/cards_wide/1.45__minaba_hideo____0.6__ogipote____0.75__casino_casinoep____0.7__houkis_s-4268011405.png",
    "alt": "书房窗边的少女"
  },
  {
    "src": "/images/cards_wide/image (1).png",
    "alt": "城堡前的金发骑士"
  },
  {
    "src": "/images/cards_wide/image (2).png",
    "alt": "海边的白发精灵"
  },
  {
    "src": "/images/cards_wide/image (3).png",
    "alt": "摩托车旁的旅行者"
  },
  {
    "src": "/images/cards_wide/image.png",
    "alt": "山野间的红白巫女"
  }
]

export const selectedCard = {
  src: '/images/nom/illustrations/nom-illustration-001.png',
  alt: '窗边读书的诺姆',
}

// Place the selected character at the end so her portrait stays visible at the transition.
export const cards = portraitCards.flatMap((card, index) => {
  const additions = index % 3 === 2 ? [landscapeCards[Math.floor(index / 3)]] : []
  return index === portraitCards.length - 1
    ? [card, ...additions, selectedCard]
    : [card, ...additions]
})

function CardMasonry({ images }: { images: Record<string, DisplayImage> }) {
  const root = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({ count: 4, gapRatio: .05 })
  useEffect(() => {
    const element = root.current!
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(element)
      const count = Number(style.getPropertyValue('--masonry-columns'))
      const gap = parseFloat(style.columnGap)
      const width = (element.clientWidth - (count - 1) * gap) / count
      setLayout({ count, gapRatio: gap / width })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  const columns = Array.from({ length: layout.count }, () => ({ height: 0, cards: [] as typeof cards }))
  for (const card of cards) {
    const column = columns.reduce((shortest, candidate) => candidate.height < shortest.height ? candidate : shortest)
    const image = images[card.src]
    column.cards.push(card)
    column.height += image.height / image.width + layout.gapRatio
  }
  return <div ref={root} className="card-masonry" aria-label="角色画廊">
    {columns.map((column, index) => <div className="card-masonry__column" key={index}>
      {column.cards.map(card => <div className="card-masonry__item" key={card.src} data-journey-source={card.src === selectedCard.src || undefined}>
        <ZoomImage image={images[card.src]} sizes="(max-width: 680px) 33vw, (max-width: 1440px) 25vw, 360px" alt={card.alt} className="card-masonry__card" />
      </div>)}
    </div>)}
  </div>
}

export default memo(CardMasonry)
