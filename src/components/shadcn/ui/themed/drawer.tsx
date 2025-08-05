// components/ui/drawer.tsx
import type { IDivProps } from '@/interfaces/div-props'
import { cn } from '@/lib/shadcn-utils'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export const Drawer = DialogPrimitive.Root
export const DrawerTrigger = DialogPrimitive.Trigger
export const DrawerClose = DialogPrimitive.Close
export const DrawerPortal = DialogPrimitive.Portal

export function DrawerContent({ className, children, ...props }: IDivProps) {
  return (
    <DrawerPortal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 left-0 w-4/5 bg-background z-(--z-modal)',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
}
