import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { ComponentProps, ReactNode } from 'react'

/** Each Astro React island owns its animation context. */
export default function SiteMotion({ children, features = domAnimation }: {
  children: ReactNode
  features?: ComponentProps<typeof LazyMotion>['features']
}) {
  return <MotionConfig reducedMotion="user">
    <LazyMotion features={features} strict>
      {children}
    </LazyMotion>
  </MotionConfig>
}
