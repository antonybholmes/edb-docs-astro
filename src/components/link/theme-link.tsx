import { FOCUS_RING_CLS } from '@/theme'

import { cn } from '@lib/shadcn-utils'
import { BaseLink, type ILinkProps } from './base-link'

export const BASE_THEME_LINK_CLS = cn(FOCUS_RING_CLS, 'text-theme inline-block')

export function ThemeLink({ ref, className, children, ...props }: ILinkProps) {
  return (
    <BaseLink
      ref={ref}
      className={cn(BASE_THEME_LINK_CLS, className)}
      data-underline={'hover'}
      {...props}
    >
      {children}
    </BaseLink>
  )
}
