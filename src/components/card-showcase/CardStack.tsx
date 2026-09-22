import './card-showcase.css'
import type { CSSProperties } from 'react'
import ZoomImage from '../illustration/ZoomImage'

const cards = [
  { src: '/images/cards/display/card-007.png', alt: '角色卡展示图七', x: '-360px', y: '65px', angle: '-17deg', scale: '.7' },
  { src: '/images/cards/display/card-006.png', alt: '角色卡展示图六', x: '-270px', y: '-70px', angle: '10deg', scale: '.85' },
  { src: '/images/cards/display/card-001.png', alt: '角色卡展示图一', x: '285px', y: '-80px', angle: '-12deg', scale: '.8' },
  { src: '/images/cards/display/card-004.png', alt: '角色卡展示图四', x: '375px', y: '80px', angle: '19deg', scale: '.65' },
]

export default function CardStack() {
  return (
    <div className="card-showcase card-showcase--stack" aria-label="角色卡叠放展示">
      <div className="card-showcase__stack">
        {cards.map((card, index) => (
          <figure
            className="card-showcase__card"
            key={card.src}
            style={{
              '--card-index': index,
              '--card-x': card.x,
              '--card-y': card.y,
              '--card-angle': card.angle,
              '--card-scale': card.scale,
              '--card-hover-scale': String(Number(card.scale) + 0.1),
            } as CSSProperties}
          >
            <ZoomImage src={card.src} alt={card.alt} className="card-showcase__card-image" />
          </figure>
        ))}
      </div>
    </div>
  )
}
