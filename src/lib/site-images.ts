import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'

export type DisplayImage = {
  src: string
  srcSet: string
  width: number
  height: number
}

// Only called by Astro frontmatter; React receives the generated URLs, never the image service.
const sources = import.meta.glob<ImageMetadata>([
  '/public/images/cards/display/*.png',
  '/public/images/nom/banners/nom-banner-{001,003,005,006,007,008,009,010,011,012,014,015,016,017,018,020,021}.png',
  '/public/images/nom/illustrations/nom-illustration-{001,004,007}.png',
  '/public/images/nom/expressions/nom-expression-001.png',
  '/public/images/nom/layers/nom-layer-{002,004,composite-002-004}.png',
  '/public/brand/banner.png',
], { eager: true, import: 'default' })

export async function siteImage(path: string, widths: number[], quality = 82): Promise<DisplayImage> {
  const source = sources[`/public${path}`]
  if (!source) throw new Error(`Unknown site image: ${path}`)
  const image = await getImage({ src: source, width: Math.max(...widths), widths, format: 'webp', quality })
  // Astro caps srcset widths to the original. Use that capped candidate as the fallback too.
  const largest = image.srcSet.values.at(-1)!
  return {
    src: largest.url,
    srcSet: image.srcSet.attribute,
    width: Number(largest.transform.width),
    height: Number(largest.transform.height),
  }
}
