import { capitalCase } from '@/lib/capital-case'
import { getUrlFriendlyTag } from '@lib/http/urls'
import { Fragment } from 'react'
import { ChevronRightIcon } from '../icons/chevron-right-icon'
import { VCenterRow } from '../layout/v-center-row'
import { BaseLink } from '../link/base-link'

export function DocCrumb({ slug }: { slug: string[] }) {
  return (
    <VCenterRow className="flex gap-x-2 py-2 text-sm">
      {slug.map((p, i) => {
        const url = slug.slice(0, i + 1).join('/')

        return (
          <Fragment key={i}>
            {i > 0 && <ChevronRightIcon stroke="stroke-foreground/30" />}

            <BaseLink
              data-underline="hover"
              href={`/${getUrlFriendlyTag(slug.slice(0, i + 1).join('/'))}`}
              aria-label={`Goto help section ${p}`}
              style={{
                fontWeight: i === slug.length - 1 ? 600 : 'normal',
                opacity: i === slug.length - 1 ? 1 : 0.7,
              }}
            >
              {capitalCase(p)}
            </BaseLink>
          </Fragment>
        )
      })}
    </VCenterRow>
  )
}
