import type { DocNode } from '@/lib/docs'
import { getUrlFriendlyTag, redirect } from '@lib/http/urls'
import { CornerDownRight } from 'lucide-react'
import { Fragment } from 'react'
import { ChevronRightIcon } from '../icons/chevron-right-icon'
import { FolderIcon } from '../icons/folder-icon'
import { VCenterRow } from '../layout/v-center-row'
import { BaseLink } from '../link/base-link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn/ui/themed/dropdown-menu'
export function DocCrumb({
  node,
  pathChildren,
}: {
  node: DocNode
  pathChildren: DocNode[][]
}) {
  return (
    <VCenterRow className="hidden md:flex gap-x-2 py-2 text-sm">
      {node.slug.map((p, i) => {
        const url = node.slug.slice(0, i + 1).join('/')

        return (
          <Fragment key={i}>
            {i > 0 && <ChevronRightIcon stroke="stroke-foreground/25" />}

            {pathChildren[i]!.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  style={{
                    fontWeight: i === node.slug.length - 1 ? 'bold' : 'normal',
                    opacity: i === node.slug.length - 1 ? 1 : 0.7,
                  }}
                >
                  <span>{p}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => redirect(`/help/${url}`)}
                    aria-label={`Goto help section ${p}`}
                  >
                    <FolderIcon stroke="stroke-theme" fill="fill-white" />
                    <span>{p}</span>
                  </DropdownMenuItem>

                  {pathChildren[i]!.map((tab) => {
                    const url = `/help/${tab.slug}`
                    return (
                      <DropdownMenuItem
                        key={tab.title}
                        onClick={() => redirect(url)}
                        aria-label={`Goto help section ${tab.title}`}
                      >
                        <CornerDownRight className="w-4 opacity-50" />
                        <span>{tab.title}</span>
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {pathChildren[i]!.length === 0 && (
              <BaseLink
                data-underline="hover"
                href={`/help/${getUrlFriendlyTag(
                  node.slug.slice(0, i + 1).join('/')
                )}`}
                aria-label={`Goto help section ${p}`}
                style={{
                  fontWeight: i === node.slug.length - 1 ? 'bold' : 'normal',
                  opacity: i === node.slug.length - 1 ? 1 : 0.7,
                }}
              >
                {p.replace(/[\_\-]/g, ' ')}
              </BaseLink>
            )}
          </Fragment>
        )
      })}
    </VCenterRow>
  )
}
