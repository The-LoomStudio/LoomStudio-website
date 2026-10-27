import { Maximize2 } from 'lucide-react'
import ZoomImage from './ZoomImage'
import type { DisplayImage } from '../../lib/site-images'

export default function FooterArtwork({ image, label }: { image: DisplayImage; label: string }) {
  return <ZoomImage image={image} sizes="100vw" alt={label} className="footer-artwork">
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Maximize2 size={15} aria-hidden="true" />{label}</span>
  </ZoomImage>
}
