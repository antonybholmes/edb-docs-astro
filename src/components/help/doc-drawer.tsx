import type { DocNode } from '@/lib/docs'
import { cn } from '@/lib/shadcn-utils'
import { useState } from 'react'
import { CloseIcon } from '../icons/close-icon'
import { HamburgerIcon } from '../icons/hamburger-icon'
import { VCenterRow } from '../layout/v-center-row'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../shadcn/ui/themed/drawer'
import { DocTreeNode } from './doc-tree-node'

export function DocDrawer({ node, slug }: { node: DocNode; slug: string[] }) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    // <Popover open={open} onOpenChange={setOpen}>
    //   <PopoverTrigger asChild>
    //     <button
    //       className="shrink-0 grow-0"
    //       onMouseEnter={() => setHover(true)}
    //       onMouseLeave={() => setHover(false)}
    //       title="Open docs menu"
    //     >
    //       <HamburgerIcon hover={hover} />
    //     </button>
    //   </PopoverTrigger>
    //   <PopoverContent
    //     className="flex flex-col w-72 p-2"
    //     side="bottom"
    //     sideOffset={4}
    //     align="end"
    //   >
    //     <DocTreeNode node={node} slug={slug} />

    //   </PopoverContent>
    // </Popover>

    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <button
          className="shrink-0 grow-0 cursor-pointer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          title="Open docs menu"
        >
          <HamburgerIcon hover={hover || open} />
        </button>
      </DrawerTrigger>

      <DrawerContent
        className={cn(
          'flex flex-col gap-y-2 p-4',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-8',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-8'
        )}
      >
        <VCenterRow className="justify-end">
          <DrawerClose asChild>
            <button className="opacity-50 hover:opacity-100 focus-visible:opacity-100 trans-opacity">
              <CloseIcon className="w-6 h-6" />
            </button>
          </DrawerClose>
        </VCenterRow>

        <DocTreeNode node={node} slug={slug} />
      </DrawerContent>
    </Drawer>
  )
}
