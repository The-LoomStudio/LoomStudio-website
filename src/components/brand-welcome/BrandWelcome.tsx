import { useCallback, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import SiteMotion from '../motion/SiteMotion'
import type { DisplayImage } from '../../lib/site-images'
import './brand-welcome.css'
import BrandAsciiReveal from './BrandAsciiReveal'
import RotatingSlogan from './RotatingSlogan'

export type BrandWelcomeCopy = { label: string; slogan: string; slogans: string[]; download: string }
type Props = {
  logo: DisplayImage
  id: string
  downloadHref: string
  copy: BrandWelcomeCopy
}

/** 品牌入场展示；诺姆导览由独立浮层负责。 */
export default function BrandWelcome(props: Props) {
  return <SiteMotion><WelcomeScene {...props} /></SiteMotion>
}

function WelcomeScene({ logo, id, downloadHref, copy }: Props) {
  const root = useRef<HTMLElement>(null)
  const entered = useInView(root, { once: true, amount: 0.2 })
  const inView = useInView(root, { amount: 0.2 })
  const [logoReady, setLogoReady] = useState(false)
  const onLogoReady = useCallback(() => setLogoReady(true), [])
  const reducedMotion = useReducedMotion()
  const visible = entered || !!reducedMotion

  return <section ref={root} id={id} className="brand-welcome" aria-label={copy.label}>
    <div className="brand-welcome__desk">
      <div className="brand-welcome__logo-position">
        <BrandAsciiReveal src={logo.src} ratio={logo.width / logo.height} entered={visible} reduced={!!reducedMotion} delay={0} logo onComplete={onLogoReady}>
          <img className="brand-welcome__logo" src={logo.src} srcSet={logo.srcSet} sizes="(max-width: 640px) 70vw, 510px" width={logo.width} height={logo.height} alt="Loom Studio" draggable={false} />
        </BrandAsciiReveal>
      </div>
    </div>

    <RotatingSlogan copy={copy} active={inView && logoReady} reduced={!!reducedMotion} />

    <div className="brand-welcome__actions">
      <a className="button button--primary" href={downloadHref}>{copy.download} <ArrowUpRight size={17} aria-hidden="true" /></a>
    </div>
  </section>
}
