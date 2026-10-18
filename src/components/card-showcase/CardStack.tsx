import './card-showcase.css'
import { useState, type CSSProperties } from 'react'
import * as m from 'motion/react-m'
import SiteMotion from '../motion/SiteMotion'
import ZoomImage from '../illustration/ZoomImage'
import type { DisplayImage } from '../../lib/site-images'

export const stackCards = [
  { src: '/images/cards/display/card-007.png', alt: '角色卡展示图七', x: '-360px', y: '65px', angle: '-17deg', scale: '.7' },
  { src: '/images/cards/display/card-006.png', alt: '角色卡展示图六', x: '-270px', y: '-70px', angle: '10deg', scale: '.85' },
  { src: '/images/cards/display/card-001.png', alt: '角色卡展示图一', x: '285px', y: '-80px', angle: '-12deg', scale: '.8' },
  { src: '/images/cards/display/card-004.png', alt: '角色卡展示图四', x: '375px', y: '80px', angle: '19deg', scale: '.65' },
]

export default function CardStack({ images }: { images: Record<string, DisplayImage> }) {
  const [focused, setFocused] = useState<string>()
  return (
    <SiteMotion>
      <div className="card-showcase card-showcase--stack" aria-label="角色卡叠放展示">
        <div className="card-showcase__stack">
          {stackCards.map(card => (
            <m.figure
              className="card-showcase__card"
              key={card.src}
              initial={false}
              animate={{ rotate: focused === card.src ? 0 : parseFloat(card.angle), scale: Number(card.scale) + (focused === card.src ? 0.1 : 0) }}
              whileHover={{ rotate: 0, scale: Number(card.scale) + 0.1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onFocus={() => setFocused(card.src)}
              onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(undefined) }}
              style={{
                '--card-x': card.x,
                '--card-y': card.y,
              } as CSSProperties}
            >
              <ZoomImage image={images[card.src]} sizes="(max-width: 680px) 205px, 260px"
                alt={card.alt} className="card-showcase__card-image" />
            </m.figure>
          ))}
        </div>
      </div>
    </SiteMotion>
  )
}
