import './card-showcase.css'
import ZoomImage from '../illustration/ZoomImage'

const cards = [
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

function Card({ src, alt }: (typeof cards)[number]) {
  return (
    <ZoomImage src={src} alt={alt} className="card-showcase__card" />
  )
}

export default function CardMarquee() {
  return (
    <div className="card-showcase card-showcase--marquee" aria-label="角色卡展示">
      <div className="card-showcase__lane card-showcase__lane--forward">
        <div className="card-showcase__track">
          {[...cards, ...cards].map((card, index) => <Card key={`forward-${index}`} {...card} />)}
        </div>
      </div>
      <div className="card-showcase__lane card-showcase__lane--reverse">
        <div className="card-showcase__track">
          {[...cards.slice().reverse(), ...cards.slice().reverse()].map((card, index) => (
            <Card key={`reverse-${index}`} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}
