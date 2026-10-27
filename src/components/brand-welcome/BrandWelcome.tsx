import { useRef } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { ArrowUpRight } from 'lucide-react'
import SiteMotion from '../motion/SiteMotion'
import ZoomImage from '../illustration/ZoomImage'
import type { DisplayImage } from '../../lib/site-images'
import './brand-welcome.css'
import BrandAsciiReveal from './BrandAsciiReveal'

export const brandCards = [
  { src: '/images/cards/display/card-007.png', alt: '角色卡展示图七' },
  { src: '/images/cards/display/card-006.png', alt: '角色卡展示图六' },
  { src: '/images/cards/display/card-001.png', alt: '角色卡展示图一' },
  { src: '/images/cards/display/card-004.png', alt: '角色卡展示图四' },
]

export type BrandWelcomeCopy = { label: string; slogan: string; download: string }
type Props = {
  cards: { src: string; alt: string; image: DisplayImage }[]
  logo: DisplayImage
  id: string
  downloadHref: string
  copy: BrandWelcomeCopy
}

/** 卡片与品牌的入场展示；诺姆导览由独立浮层负责。 */
export default function BrandWelcome(props: Props) {
  return <SiteMotion><WelcomeScene {...props} /></SiteMotion>
}

function WelcomeScene({ cards, logo, id, downloadHref, copy }: Props) {
  const root = useRef<HTMLElement>(null)
  const entered = useInView(root, { once: true, amount: 0.2 })
  const reducedMotion = useReducedMotion()
  const visible = entered || !!reducedMotion

  return <section ref={root} id={id} className="brand-welcome" aria-label={copy.label}>
    <div className="brand-welcome__desk">
      {cards.map((card, index) => (
        <div className={`brand-welcome__card-position brand-welcome__card-position--${index + 1}`} key={card.src}>
          <m.div className="brand-welcome__card"
            whileHover={reducedMotion ? undefined : { y: -10, scale: 1.05 }}
            whileFocus={reducedMotion ? undefined : { y: -10, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
            <BrandAsciiReveal src={card.image.src} ratio={188 / 262} entered={visible} reduced={!!reducedMotion} delay={index * 90}>
              <ZoomImage image={card.image} fullSrc={card.src} sizes="(max-width: 640px) 130px, 220px" alt={card.alt} />
            </BrandAsciiReveal>
          </m.div>
        </div>
      ))}
      <div className="brand-welcome__logo-position">
        <BrandAsciiReveal src={logo.src} ratio={logo.width / logo.height} entered={visible} reduced={!!reducedMotion} delay={480} logo>
          <img className="brand-welcome__logo" src={logo.src} srcSet={logo.srcSet} sizes="(max-width: 640px) 70vw, 510px" width={logo.width} height={logo.height} alt="Loom Studio" draggable={false} />
        </BrandAsciiReveal>
      </div>
    </div>

    <p className="brand-welcome__slogan">{copy.slogan}</p>

    <div className="brand-welcome__actions">
      <a className="button button--primary" href={downloadHref}>{copy.download} <ArrowUpRight size={17} aria-hidden="true" /></a>
    </div>
  </section>
}
