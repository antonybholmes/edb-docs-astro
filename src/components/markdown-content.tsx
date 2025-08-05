import type { IDivProps } from '@interfaces/div-props'
import { cn } from '@lib/shadcn-utils'

export function MarkdownContent({
  ref,
  className,
  children,
  ...props
}: IDivProps) {
  return (
    <article ref={ref} className={cn('markdown', className)} {...props}>
      {children}
    </article>
  )
}
